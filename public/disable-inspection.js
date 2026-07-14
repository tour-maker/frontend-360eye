// Comprehensive Security Protection
(function() {
  'use strict';
  // Disable right-click, text selection, and clipboard actions
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    e.stopPropagation();
  }, true);
  document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    e.stopPropagation();
  }, true);
  document.addEventListener('copy', function(e) {
    e.preventDefault();
    e.stopPropagation();
  }, true);
  document.addEventListener('cut', function(e) {
    e.preventDefault();
    e.stopPropagation();
  }, true);
  document.addEventListener('paste', function(e) {
    e.preventDefault();
    e.stopPropagation();
  }, true);
  
  // Minimal anti-inspect logic: block only common DevTools shortcuts.
  // No restrictions on drag, zoom, resize, or rotation.
  const prevent = (e) => { e.preventDefault(); e.stopPropagation(); return false; };

  document.addEventListener('keydown', function(e) {
    // F12 (DevTools)
    if (e.key === 'F12' || e.keyCode === 123) return prevent(e);

    // Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (macOS) - Open DevTools
    if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) ||
        (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73))) {
      return prevent(e);
    }

    // Ctrl+Shift+C or Cmd+Option+C - Inspect Element
    if ((e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) ||
        (e.metaKey && e.altKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67))) {
      return prevent(e);
    }

    // Ctrl+Shift+J or Cmd+Option+J - Console
    if ((e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) ||
        (e.metaKey && e.altKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74))) {
      return prevent(e);
    }
  }, true);

})();
