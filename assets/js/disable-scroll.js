// Idempotent helper that disables scrolling when any tab is activated.
// Usage: include this file with defer in your <head> so it runs after the DOM is parsed.
(function () {
  if (window.__disableScrollScriptInstalled) return;
  window.__disableScrollScriptInstalled = true;

  var TAB_SELECTORS = [
    '[role="tab"]',
    '[data-toggle="tab"]',
    '[data-bs-toggle="tab"]',
    '.tab',
    '.tab-link',
    '.tab-button',
    '.nav-tabs a',
    '.tabs a'
  ].join(',');

  var TAB_PANEL_SELECTORS = [
    '[role="tabpanel"]',
    '.tab-panel',
    '.tab-content',
    '.tab-pane'
  ].join(',');

  function applyNoScroll() {
    try {
      var els = [];
      // html and body
      els.push(document.documentElement);
      els.push(document.body);
      // all matching tab panels
      Array.prototype.forEach.call(document.querySelectorAll(TAB_PANEL_SELECTORS), function (el) {
        if (el) els.push(el);
      });

      els.forEach(function (el) {
        if (!el) return;
        // add class (preferred)
        if (!el.classList.contains('no-scroll')) {
          el.classList.add('no-scroll');
        }
        // inline fallback to be extra sure
        try {
          el.style.overflow = 'hidden';
          el.style.height = '100%';
        } catch (e) {
          // ignore (some elements may be read-only)
        }
      });
    } catch (err) {
      // fail silently
      console.error('applyNoScroll error:', err);
    }
  }

  // handle keyboard activation (Enter/Space) when a tab has focus
  function handleKeydown(e) {
    var key = e.key || e.keyCode;
    if (key === 'Enter' || key === ' ' || key === 13 || key === 32) {
      var el = e.target;
      if (el && el.matches && el.matches(TAB_SELECTORS)) {
        applyNoScroll();
      }
    }
  }

  function handleClick(e) {
    var el = e.target;
    if (!el) return;
    // use closest to allow clicks on children inside a tab element
    var tab = el.closest ? el.closest(TAB_SELECTORS) : null;
    if (tab) {
      applyNoScroll();
    }
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function onLoad() {
      document.removeEventListener('DOMContentLoaded', onLoad);
      document.addEventListener('click', handleClick, { passive: true });
      document.addEventListener('keydown', handleKeydown, { passive: true });
    });
  } else {
    document.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('keydown', handleKeydown, { passive: true });
  }

  // Ensure dynamically added tab panels get the class if already toggled
  // (if you want to proactively apply to new panels after a tab click, we could add a MutationObserver —
  //  let me know if you'd like that).
})();
