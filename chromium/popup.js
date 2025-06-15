// popup.js

// Uses only Chrome Extension APIs: bookmarks, storage, tabs.
// No third-party libraries are used for security, performance, and maintainability.

// Recursively collects all bookmark folders with their full paths.
async function getBookmarkFolders() {
  const tree = await chrome.bookmarks.getTree();
  const folders = [];
  
  // Chrome's special folder IDs
  const specialFolders = {
    "0": "Bookmarks",  // Root node (usually hidden)
    "1": "Bookmarks Bar",
    "2": "Other Bookmarks",
    "3": "Mobile Bookmarks"
  };
  
  function traverse(nodes, path = []) {
    for (const node of nodes) {
      if (node.children) {
        // Use special folder names for Chrome's built-in folders, or the node's title
        const title = specialFolders[node.id] || node.title || "Untitled";
        
        // Don't include the root "Bookmarks" node (id: "0") in the list
        if (node.id !== "0") {
          folders.push({
            id: node.id,
            title: title,
            path: [...path, title].join(" / "),
          });
        }
        
        traverse(node.children, node.id === "0" ? [] : [...path, title]);
      }
    }
  }
  traverse(tree);
  return folders;
}

// Retrieves the last used folder ID from storage.
async function getLastUsedFolder() {
  try {
    const { lastFolderId } = await chrome.storage.local.get("lastFolderId");
    return lastFolderId;
  } catch (error) {
    console.error("Error retrieving last used folder:", error);
    return null;
  }
}

// Stores the last used folder ID in storage.
async function setLastUsedFolder(folderId) {
  try {
    await chrome.storage.local.set({ lastFolderId: folderId });
  } catch (error) {
    console.error("Error saving last used folder:", error);
    // Non-critical error, continue execution
  }
}

// Gets the current active tab in the current window.
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Creates a bookmark at the bottom of the specified folder.
async function createBookmarkAtBottom(parentId, title, url) {
  try {
    // For root folders, we can create bookmarks directly without checking children
    const rootFolders = ["1", "2", "3"]; // Bookmarks Bar, Other Bookmarks, Mobile Bookmarks
    
    if (rootFolders.includes(parentId)) {
      // For root folders, just create without specifying index
      await chrome.bookmarks.create({
        parentId,
        title,
        url
      });
    } else {
      // For non-root folders, place at the bottom
      const children = await chrome.bookmarks.getChildren(parentId);
      const index = children.length;
      await chrome.bookmarks.create({
        parentId,
        title,
        url,
        index,
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return { success: false, error: error.message };
  }
}

// Main logic for the popup dialog.
document.addEventListener("DOMContentLoaded", async () => {
  const folderSelect = document.getElementById("folder-select");
  const newFolderContainer = document.getElementById("new-folder-container");
  const newFolderNameInput = document.getElementById("new-folder-name");
  const form = document.getElementById("bookmark-form");
  const cancelBtn = document.getElementById("cancel-btn");

  // Populate folder dropdown
  const folders = await getBookmarkFolders();
  const lastUsed = await getLastUsedFolder();

  folders.forEach((folder) => {
    const option = document.createElement("option");
    option.value = folder.id;
    option.textContent = folder.path;
    folderSelect.appendChild(option);
  });

  // Set initial value: last used folder, or Bookmarks Bar, or first available
  if (lastUsed && folders.some((f) => f.id === lastUsed)) {
    folderSelect.value = lastUsed;
  } else {
    // Try to default to Bookmarks Bar (id: "1")
    const bookmarksBar = folders.find((f) => f.id === "1");
    if (bookmarksBar) {
      folderSelect.value = bookmarksBar.id;
    } else {
      // Fall back to first available folder
      folderSelect.value = folders[0].id;
    }
  }
  // Track the last valid folder selection (for new folder creation)
  folderSelect.dataset.lastValidId = folderSelect.value;
  
  // Set initial focus to the folder dropdown
  folderSelect.focus();

  // Add "Create new folder..." option
  const createNewOption = document.createElement("option");
  createNewOption.value = "__create_new__";
  createNewOption.textContent = "Create new folder...";
  folderSelect.appendChild(createNewOption);

  // Update last valid folder selection and show/hide new folder input
  folderSelect.addEventListener("change", () => {
    if (folderSelect.value !== "__create_new__") {
      folderSelect.dataset.lastValidId = folderSelect.value;
      newFolderContainer.style.display = "none";
    } else {
      newFolderContainer.style.display = "block";
      newFolderNameInput.focus();
    }
  });

  // ESC to dismiss
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      window.close();
    }
  });

  cancelBtn.addEventListener("click", () => {
    window.close();
  });

  // Form submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    try {
      const tab = await getCurrentTab();
      let folderId = folderSelect.value;

      if (folderId === "__create_new__") {
        const newFolderName = newFolderNameInput.value.trim();
        if (!newFolderName) {
          newFolderNameInput.focus();
          return;
        }
        // Use the last valid folder as the parent for the new folder
        const parentFolderId = folderSelect.dataset.lastValidId || folders[0].id;

        try {
          // Create the new folder under the selected parent
          const newFolder = await chrome.bookmarks.create({
            parentId: parentFolderId,
            title: newFolderName,
          });
          folderId = newFolder.id;
          await setLastUsedFolder(folderId);
        } catch (error) {
          alert(`Failed to create folder: ${error.message}`);
          return;
        }
      } else {
        await setLastUsedFolder(folderId);
      }

      // Create the bookmark
      const result = await createBookmarkAtBottom(folderId, tab.title, tab.url);
      
      if (result.success) {
        window.close();
      } else {
        alert(`Failed to create bookmark: ${result.error}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  });
});
