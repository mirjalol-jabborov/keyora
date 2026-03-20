console.log('Content script loaded');

let shortcuts = null;

chrome.runtime.sendMessage({ action: 'getShortcuts' }, (response) => {
  if (response) shortcuts = response;
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'shortcutsUpdated') shortcuts = request.shortcuts;
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && handleTextShortcut(document.activeElement)) e.preventDefault();
});

// ── CORE ──────────────────────────────────────────────────────────────────────

function handleTextShortcut(el) {
  if (!shortcuts?.text?.length || !el) return false;

  const isInput = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
  if (!isInput && !getEditableRoot(el)) return false;

  return isInput ? handleInput(el) : handleContentEditable();
}

// ── INPUT / TEXTAREA ──────────────────────────────────────────────────────────

function handleInput(el) {
  const { match, beforeKeyword, afterCursor } = extractMatch(el.value, el.selectionStart);
  if (!match) return false;

  const inserted = match.replacement + ' ';
  el.value = beforeKeyword + inserted + afterCursor;
  el.selectionStart = el.selectionEnd = beforeKeyword.length + inserted.length;

  dispatchEvents(el);
  return true;
}

// ── CONTENTEDITABLE ───────────────────────────────────────────────────────────

function handleContentEditable() {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return false;

  const range = selection.getRangeAt(0);
  const root = getEditableRoot(document.activeElement);

  const preRange = document.createRange();
  preRange.selectNodeContents(root);
  preRange.setEnd(range.startContainer, range.startOffset);

  const { match, beforeKeyword } = extractMatch(preRange.toString());
  if (!match) return false;

  deleteCharsBefore(match.keyword.length);

  const node = document.createTextNode(match.replacement + ' ');
  const r = window.getSelection().getRangeAt(0);
  r.insertNode(node);
  r.setStartAfter(node);
  r.collapse(true);
  selection.removeAllRanges();
  selection.addRange(r);

  dispatchEvents(document.activeElement);
  return true;
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function extractMatch(text, cursorPos = text.length) {
  const before = text.slice(0, cursorPos);
  const lastWord = before.split(/\s+/).pop();
  if (!lastWord) return { match: null };

  const match = shortcuts.text.find((s) => s.keyword === lastWord);
  if (!match) return { match: null };

  return {
    match,
    beforeKeyword: before.slice(0, before.length - lastWord.length),
    afterCursor: text.slice(cursorPos)
  };
}

function deleteCharsBefore(count) {
  const sel = window.getSelection();
  if (!sel?.rangeCount) return;

  const range = sel.getRangeAt(0);
  const node = range.startContainer;

  if (node.nodeType !== Node.TEXT_NODE) return;

  const offset = range.startOffset;
  node.textContent = node.textContent.slice(0, offset - count) + node.textContent.slice(offset);

  const r = document.createRange();
  r.setStart(node, offset - count);
  r.collapse(true);
  sel.removeAllRanges();
  sel.addRange(r);
}

function getEditableRoot(el) {
  let node = el;
  while (node) {
    if (node.contentEditable === 'true') return node;
    node = node.parentElement;
  }
  return null;
}

function dispatchEvents(el) {
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}