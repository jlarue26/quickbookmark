// background.js

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open-bookmark-dialog") {
    // Simply open the popup - Chrome handles everything else
    await chrome.action.openPopup();
  }
});
