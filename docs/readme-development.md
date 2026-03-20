# Getting Started - Development

## Prerequisites
- Chrome browser (v88+)
- Text editor or IDE

## Installation

1. **Clone/setup the repository**
   ```bash
   cd search-tool
   ```

2. **Load the extension in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `search-tool` folder
   - The extension should now appear in your toolbar

3. **Verify it's working**
   - Click the extension icon in your toolbar
   - You should see the settings popup with 2 default text shortcuts

## Quick Test

### Test Text Shortcuts
1. Open any input field (Gmail compose, Google Docs, etc.)
2. Type: `br`
3. Press `Space`
4. It should expand to `Best regards,`

## Managing Shortcuts

### Add a New Shortcut
1. Click the extension icon
2. Click "+ Add Shortcut"
4. Fill in the keyword and (URL or replacement text)
5. Saves automatically

### Delete a Shortcut
1. Click the extension icon
2. Find the shortcut
3. Click "Delete"

## Project Structure
```
search-tool/
├── manifest.json           # Extension config
├── src/
│   ├── background/
│   │   └── background.js   # Service worker (storage, messaging)
│   ├── content/
│   │   └── content.js      # Runs on all pages (detects shortcuts)
│   └── popup/
│       ├── popup.html      # Settings UI
│       ├── popup.css       # Styling
│       └── popup.js        # Settings logic
└── docs/
    ├── MVP.md              # This MVP scope
    └── readme-development.md
```

## Debugging

### View Extension Logs
1. Go to `chrome://extensions/`
2. Click "Details" on keyora
3. Click "Errors" to see any issues

### Background Worker Logs
1. Go to `chrome://extensions/`
2. Click "Details" on keyora
3. Click "service worker" link to open DevTools

### Content Script Logs
1. Open DevTools on any webpage (F12)
2. Check Console tab
3. Look for messages from the content script

## Common Issues

**Shortcuts not working?**
- Reload the extension: go to `chrome://extensions/`, click the reload icon
- Check that DevTools Console has no errors
- Make sure you're pressing the `Space` key after typing your keyword

**Text shortcut not expanding in certain fields?**
- Some rich text editors (Notion, medium, some Google products) use special input methods
- Works best in standard HTML `<input>` and `<textarea>` fields
- May have issues with:
  - Rich text editors with Shadow DOM
  - iframes with different origins (security restriction)

---

**Questions?** Check the [MVP scope](./MVP.md) to see what's in/out of scope for this version.
