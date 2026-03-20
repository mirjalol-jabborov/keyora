# MVP Requirements

## Scope
This is the minimum viable product launch for the keyora Chrome extension.

### Core Features (Implemented)
- ✅ **Text field shortcuts** - Snippets that expand in input/textarea fields
  - 2 default examples: `br` (email closing), `eml` (email)
  - Triggered with Space key
  - Works in Gmail, Notion, forms, etc.

- ✅ **Settings popup UI** - Manage shortcuts without editing code
  - View all shortcuts grouped by type
  - Add new shortcuts via advanced form interface
  - Edit existing shortcuts with pre-populated forms
  - Delete existing shortcuts
  - Settings persist in browser storage

- ✅ **Advanced UI for editing shortcuts** - Form-based interface instead of prompts
  - Dedicated form with labeled input fields
  - Validation for required fields
  - Cancel/Save actions with proper UX

### What's NOT in MVP
- ❌ Browser search shortcuts (address bar)
- ❌ Cloud sync across devices
- ❌ Import/export functionality
- ❌ Custom trigger keys
- ❌ Template variables (e.g., {{date}}, {{clipboard}})
- ❌ Regex/pattern matching

### Default Shortcuts
**Text (2)**  
- `br` → Best regards,
- `eml` → your@email.com

### Technical Stack
- Chrome Manifest V3
- Vanilla JavaScript (no dependencies)
- Chrome storage API

### Browser Support
- Chrome 88+ (WebExtensions Manifest V3)

---

## Next Steps (for v0.2+)
1. Browser search shortcuts via omnibox/address bar
2. Advanced shortcut editor UI (instead of prompts)
3. Shortcut categories/groups
4. Export/import settings
5. Sync with Google Account
6. Custom trigger key configuration
7. Template variables for dynamic content
