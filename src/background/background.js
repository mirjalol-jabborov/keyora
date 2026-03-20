// Background service worker for handling storage and requests

function getDefaultShortcuts() {
  return {
    text: [
      {
        keyword: 'br',
        replacement: 'Best regards,',
        description: 'Email closing'
      },
      {
        keyword: 'eml',
        replacement: 'your@email.com',
        description: 'Email shortcut'
      }
    ]
  };
}

// Initialize on startup
chrome.runtime.onStartup.addListener(() => {
  initializeShortcuts();
});

function initializeShortcuts() {
  chrome.storage.local.get('shortcuts', (data) => {
    if (!data.shortcuts) {
      chrome.storage.local.set({ shortcuts: getDefaultShortcuts() });
    }
  });
}

// Initialize storage on first install
chrome.runtime.onInstalled.addListener(() => {
  initializeShortcuts();
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === 'getShortcuts') {
      chrome.storage.local.get('shortcuts', (data) => {
        const shortcuts = data.shortcuts || getDefaultShortcuts();
        sendResponse(shortcuts);
      });
      return true; // Will respond asynchronously
    }

    if (request.action === 'saveShortcuts') {
      chrome.storage.local.set({ shortcuts: request.shortcuts }, () => {
        sendResponse({ success: true });
      });
      return true;
    }
  } catch (error) {
    console.error('Background script error:', error);
    sendResponse({ success: false, error: error.message });
  }
});