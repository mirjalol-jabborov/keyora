# keyora - Chrome Extension

A lightweight Chrome extension that lets you create custom text snippets that expand with a keyboard shortcut.

**Type a keyword + press `Ctrl+Space`** (or `Cmd+Space` on Mac) to expand your text snippets anywhere.

## ✨ Features

### Text Field Snippets
- `br` → `Best regards,`
- `eml` → your email
- Define anything: SQL, signatures, templates...
- Works in Gmail, Google Docs, forms, code editors, and any text input

### Easy Customization
- No coding needed
- Add, edit, and remove shortcuts via popup UI
- Settings saved locally

## 🚀 Quick Start

1. **Load the extension**
   - Go to `chrome://extensions/`
   - Enable Developer Mode
   - Click "Load unpacked" → select this folder

2. **Try it out**
   - Click the icon to see the 2 default shortcuts
   - Add your own via the UI

3. **Use it**
   - Type `br` in any input field + press `Cmd+Space` (Mac) or `Ctrl+Space` (Windows)
   - It expands to `Best regards,`

## 📁 What's Included (MVP)

This is the **v0.1 MVP** — text shortcuts only. See [MVP.md](./MVP.md) for full scope.

- ✅ 2 text shortcuts (SQL, email)
- ✅ Settings UI to add/remove shortcuts
- ✅ Local storage (no cloud sync)
- ✅ No dependencies, lightweight
- ✅ Works on macOS, Windows, Linux with Chrome browser

## 🛠 Development

- [Development Guide](./readme-development.md) - Testing, debugging, project structure
- [MVP Scope](./MVP.md) - What's included and planned

## 📝 Example Shortcuts

```
br → Best regards,
eml → your@email.com
```

Add your own:
- `sig` → Your full signature
- `addr` → Your address
- `fn` → Function template
- `html` → HTML boilerplate

---

**Status:** MVP (v0.1) - Text shortcuts working, ready for feedback and v0.2 enhancements.
