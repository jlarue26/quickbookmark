# Quick Bookmark - Chrome Extension

A lightweight Chrome extension that provides a quick bookmark dialog with folder selection. Bookmark pages instantly with a keyboard shortcut and organize them into your existing bookmark folders.

## Features

- **Quick Access**: Use `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac) to open the bookmark dialog
- **Folder Selection**: Dropdown shows all your bookmark folders with full paths
- **Smart Defaults**: Remembers your last used folder, defaults to Bookmarks Bar
- **Create Folders On-the-Fly**: Create new folders without leaving the dialog
- **Keyboard Friendly**: Full keyboard navigation support, ESC to cancel
- **Bottom Placement**: New bookmarks are added to the bottom of the selected folder

## Installation

### From Source (Developer Mode)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/yourusername/quickbookmark.git
   cd quickbookmark
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** by toggling the switch in the top right corner

4. Click **Load unpacked** button

5. Select the `quickbookmark` directory containing the manifest.json file

6. The extension icon should appear in your Chrome toolbar

### Verify Installation

- Click the extension icon in the toolbar - the popup should appear
- Press `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac) - the popup should open
- Check `chrome://extensions/shortcuts` to verify or modify the keyboard shortcut

## Usage

1. **Navigate to any webpage** you want to bookmark

2. **Open the bookmark dialog** using one of these methods:
   - Press `Ctrl+Shift+D` (Windows/Linux) or `Cmd+Shift+D` (Mac)
   - Click the extension icon in the toolbar

3. **Select a folder** from the dropdown or choose "Create new folder..."

4. **Press Enter** or click "Bookmark" to save

5. **Press ESC** or click "Cancel" to close without saving

## Development

### Project Structure

```
quickbookmark/
├── manifest.json      # Extension configuration
├── background.js      # Service worker for keyboard shortcuts
├── popup.html         # Bookmark dialog UI
├── popup.js           # Dialog functionality
├── popup.css          # Dialog styling
└── icons/
    └── icon128.png    # Extension icon
```

### Key Components

- **manifest.json**: Defines permissions, commands, and extension metadata
- **popup.js**: Contains all bookmark management logic using Chrome APIs
- **background.js**: Handles the keyboard shortcut to open the popup

### Chrome APIs Used

- `chrome.bookmarks`: Create bookmarks and folders, traverse bookmark tree
- `chrome.storage.local`: Persist last used folder preference
- `chrome.tabs`: Get current tab information
- `chrome.action`: Open the extension popup programmatically
- `chrome.commands`: Register keyboard shortcuts

## Debugging

### Chrome DevTools

1. **For the popup**:
   - Right-click the extension icon and select "Inspect popup"
   - Or open the popup and right-click inside it, then select "Inspect"

2. **For the background script**:
   - Go to `chrome://extensions/`
   - Find Quick Bookmark and click "service worker" link

3. **View console logs**:
   - Popup logs appear in the popup's DevTools console
   - Background script logs appear in the service worker's DevTools console

### Common Issues

**Keyboard shortcut not working?**
- Check `chrome://extensions/shortcuts` for conflicts
- Ensure no other extension uses `Ctrl+Shift+D`
- Try setting a different shortcut

**Popup closes immediately?**
- Check for JavaScript errors in the popup console
- Verify all files are loaded correctly

**Bookmarks not saving?**
- Check Chrome DevTools console for error messages
- Ensure the extension has bookmarks permission
- Verify the selected folder still exists

### Testing Changes

1. Make your code changes
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Quick Bookmark card
4. Test the functionality

### Debugging Tips

- Add `console.log()` statements to track execution flow
- Use Chrome DevTools debugger with breakpoints
- Check the Network tab to ensure all resources load
- Monitor the Console for any runtime errors
- Use `chrome.runtime.lastError` to catch Chrome API errors

## Permissions

The extension requires these permissions:

- **bookmarks**: Create and organize bookmarks
- **storage**: Remember last used folder
- **activeTab**: Get current tab's URL and title
- **scripting**: Not currently used (can be removed)

## Browser Support

- Chrome 88+ (uses Manifest V3)
- Chromium-based browsers (Edge, Brave, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly in Chrome
5. Commit with clear messages: `git commit -m "Add feature"`
6. Push to your fork: `git push origin feature-name`
7. Open a Pull Request

## License

[Choose your license - e.g., MIT, Apache 2.0, etc.]

## Future Enhancements

- [ ] Edit bookmark title before saving
- [ ] Search/filter folders in dropdown
- [ ] Sync folder preferences across devices
- [ ] Support for tags/labels
- [ ] Batch bookmark operations
- [ ] Import/export bookmarks
