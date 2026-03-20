let shortcuts = { text: [] };
let editingIndex = -1; // -1 means not editing, otherwise the index being edited

window.addEventListener('DOMContentLoaded', loadShortcuts);
loadShortcuts();

document.addEventListener('DOMContentLoaded', () => {
  const addTextBtn = document.getElementById('add-text-btn');
  if (addTextBtn) {
    addTextBtn.addEventListener('click', () => {
      showAddForm();
    });
  }

  // Form event listeners
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveNewShortcut();
    });
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      hideAddForm();
    });
  }
});

function loadShortcuts() {
  try {
    chrome.runtime.sendMessage({ action: 'getShortcuts' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting shortcuts:', chrome.runtime.lastError);
        shortcuts = { text: [] };
      } else if (response) {
        shortcuts = response;
        console.log('Shortcuts loaded:', shortcuts);
      }
      renderShortcuts();
    });
  } catch (error) {
    console.error('Failed to load shortcuts:', error);
    shortcuts = { text: [] };
    renderShortcuts();
  }
}

function renderShortcuts() {
  const list = document.getElementById('text-list');
  if (!list) return;

  list.innerHTML = '';

  if (!shortcuts.text || shortcuts.text.length === 0) {
    const empty = document.createElement('div');
    empty.style.padding = '12px';
    empty.style.color = '#999';
    empty.style.fontSize = '13px';
    empty.textContent = 'No text shortcuts yet. Click "+ Add" to create one.';
    list.appendChild(empty);
    return;
  }

  shortcuts.text.forEach((shortcut, index) => {
    const item = document.createElement('div');
    item.className = 'shortcut-item';

    const info = document.createElement('div');
    info.className = 'shortcut-info';

    const keyword = document.createElement('div');
    keyword.className = 'shortcut-keyword';
    keyword.textContent = shortcut.keyword;

    const desc = document.createElement('div');
    desc.className = 'shortcut-desc';
    desc.textContent = shortcut.description || shortcut.replacement;

    info.appendChild(keyword);
    info.appendChild(desc);

    const actions = document.createElement('div');
    actions.className = 'shortcut-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'shortcut-edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editShortcut(index));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'shortcut-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteShortcut(index));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(info);
    item.appendChild(actions);
    list.appendChild(item);
  });
}

function deleteShortcut(index) {
  if (shortcuts.text) {
    shortcuts.text.splice(index, 1);
    saveShortcuts();
    renderShortcuts();
  }
}

function editShortcut(index) {
  if (shortcuts.text && shortcuts.text[index]) {
    editingIndex = index;
    const shortcut = shortcuts.text[index];
    
    // Populate form with existing data
    document.getElementById('keyword-input').value = shortcut.keyword;
    document.getElementById('replacement-input').value = shortcut.replacement;
    document.getElementById('description-input').value = shortcut.description || '';
    
    // Update form title
    document.querySelector('.add-form h3').textContent = 'Edit Shortcut';
    
    showAddForm();
  }
}

function showAddForm() {
  const form = document.getElementById('add-form');
  const addBtn = document.getElementById('add-text-btn');
  
  if (form && addBtn) {
    form.style.display = 'block';
    addBtn.style.display = 'none';
    
    // Focus on keyword input
    const keywordInput = document.getElementById('keyword-input');
    if (keywordInput) {
      keywordInput.focus();
    }
  }
}

function hideAddForm() {
  const form = document.getElementById('add-form');
  const addBtn = document.getElementById('add-text-btn');
  
  if (form && addBtn) {
    form.style.display = 'none';
    addBtn.style.display = 'block';
    
    // Clear form and reset state
    document.getElementById('keyword-input').value = '';
    document.getElementById('replacement-input').value = '';
    document.getElementById('description-input').value = '';
    
    // Reset form title and editing state
    document.querySelector('.add-form h3').textContent = 'Add New Shortcut';
    editingIndex = -1;
  }
}

function saveNewShortcut() {
  const keyword = document.getElementById('keyword-input').value.trim();
  const replacement = document.getElementById('replacement-input').value.trim();
  const description = document.getElementById('description-input').value.trim();

  if (!keyword || !replacement) {
    alert('Keyword and replacement text are required.');
    return;
  }

  if (!shortcuts.text) shortcuts.text = [];

  if (editingIndex >= 0) {
    // Editing existing shortcut
    shortcuts.text[editingIndex] = {
      keyword: keyword,
      replacement: replacement,
      description: description || ''
    };
  } else {
    // Adding new shortcut
    shortcuts.text.push({
      keyword: keyword,
      replacement: replacement,
      description: description || ''
    });
  }

  saveShortcuts();
  hideAddForm();
}

function saveShortcuts() {
  try {
    chrome.runtime.sendMessage(
      { action: 'saveShortcuts', shortcuts },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error saving shortcuts:', chrome.runtime.lastError);
        } else if (response?.success) {
          console.log('Shortcuts saved');
          // Broadcast updated shortcuts to all tabs
          broadcastShortcutsUpdate();
          renderShortcuts();
        }
      }
    );
  } catch (error) {
    console.error('Failed to save shortcuts:', error);
  }
}

function broadcastShortcutsUpdate() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      try {
        chrome.tabs.sendMessage(tab.id, {
          action: 'shortcutsUpdated',
          shortcuts: shortcuts
        });
      } catch (error) {
        // Some tabs may not have the content script loaded, ignore errors
      }
    });
  });
}