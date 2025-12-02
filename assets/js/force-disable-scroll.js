// Aggressive scroll lock triggered when any tab is clicked or activated.
// Idempotent; once applied it blocks wheel/touch/keyboard and fixes page position.
// Only applies on desktop screens (width > 1024px)
//
// Usage: include this file with defer in your <head> so it's ready when tabs are used.

(function () {
  if (window.__forceDisableScrollInstalled) return;
  window.__forceDisableScrollInstalled = true;

  // Check if device is mobile/tablet (screen width <= 1024px)
  function isMobileOrTablet() {
    return window.innerWidth <= 1024;
  }

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

  var locked = false;
  var lockedScrollY = 0;
  var listeners = [];

  function prevent(e) {
    // Skip prevention on mobile/tablet
    if (isMobileOrTablet()) return;
    
    // only prevent if cancelable
    if (e && e.cancelable) {
      try { e.preventDefault(); } catch (err) {}
    }
  }

  function keyHandler(e) {
    // Skip on mobile/tablet
    if (isMobileOrTablet()) return;
    
    // Allow modifier combos (Ctrl/Meta/Alt) to still work
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var key = e.key || e.keyCode;
    // Block keys that scroll: Space, ArrowUp/Down/Left/Right, PageUp/Down, Home, End
    if (
      key === ' ' || key === 'Spacebar' || key === 32 ||
      key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight' ||
      key === 'PageUp' || key === 'PageDown' || key === 33 || key === 34 ||
      key === 'Home' || key === 'End' || key === 36 || key === 35
    ) {
      if (e && e.cancelable) {
        try { e.preventDefault(); } catch (err) {}
      }
    }
  }

  function enforcePosition() {
    // Skip on mobile/tablet
    if (isMobileOrTablet()) return;
    
    // force back to locked position if anything tries to scroll
    try {
      window.scrollTo(0, lockedScrollY);
      // for some browsers also set documentElement and body scrollTop
      document.documentElement.scrollTop = lockedScrollY;
      document.body.scrollTop = lockedScrollY;
    } catch (err) {}
  }

  function addGlobalPrevention() {
    // wheel and touchmove must use passive:false to allow preventDefault
    window.addEventListener('wheel', prevent, { passive: false });
    window.addEventListener('touchmove', prevent, { passive: false });
    window.addEventListener('keydown', keyHandler, { passive: false });
    // keep position if something triggers scroll
    window.addEventListener('scroll', enforcePosition, { passive: true });

    listeners.push({ el: window, type: 'wheel', fn: prevent, opts: { passive: false } });
    listeners.push({ el: window, type: 'touchmove', fn: prevent, opts: { passive: false } });
    listeners.push({ el: window, type: 'keydown', fn: keyHandler, opts: { passive: false } });
    listeners.push({ el: window, type: 'scroll', fn: enforcePosition, opts: { passive: true } });
  }

  function applyLock() {
    // Don't apply lock on mobile/tablet
    if (isMobileOrTablet()) return;
    
    if (locked) return;
    locked = true;
    lockedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // add CSS class to html/body and tab panels
    try {
      document.documentElement.classList.add('no-scroll-fixed');
    } catch (e) {}
    try {
      document.body.classList.add('no-scroll-fixed');
    } catch (e) {}

    // Lock body at current scroll position by fixing it and shifting top
    try {
      // record existing inline styles to avoid losing them if you later remove lock (not implemented)
      document.body.style.position = 'fixed';
      document.body.style.top = (-lockedScrollY) + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
    } catch (e) {}

    // apply to all tab panels (extra safety)
    try {
      var panels = document.querySelectorAll(TAB_PANEL_SELECTORS);
      for (var i = 0; i < panels.length; i++) {
        var p = panels[i];
        if (!p) continue;
        p.classList.add('no-scroll-fixed');
        try { p.style.overflow = 'hidden'; p.style.height = '100%'; } catch (e) {}
      }
    } catch (e) {}

    // add global prevention handlers
    addGlobalPrevention();

    // ensure immediate enforcement
    enforcePosition();
  }

  // Main click handler: delegation so it catches dynamically added tabs too
  function onClick(e) {
    var target = e.target;
    if (!target) return;
    var tab = (target.closest) ? target.closest(TAB_SELECTORS) : null;
    if (tab) {
      applyLock();
    }
  }

  function onKeydown(e) {
    // support keyboard activation (Enter/Space) when tab has focus
    var key = e.key || e.keyCode;
    if (key === 'Enter' || key === 13 || key === ' ' || key === 32) {
      var el = e.target;
      if (el && el.matches && el.matches(TAB_SELECTORS)) {
        applyLock();
      } else {
        var closestTab = el && el.closest ? el.closest(TAB_SELECTORS) : null;
        if (closestTab) applyLock();
      }
    }
  }

  // Install delegated listeners after DOM is ready
  function install() {
    if (document.__forceDisableScrollListenersInstalled) return;
    document.__forceDisableScrollListenersInstalled = true;
    document.addEventListener('click', onClick, { passive: true });
    document.addEventListener('keydown', onKeydown, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install);
  } else {
    install();
  }

  // Expose a debug/unlock function in case you need to remove the lock from console
  window.__forceDisableScroll_unlock = function () {
    // Remove fixed positioning and restore scroll position
    try {
      document.body.style.position = '';
      var top = document.body.style.top || '';
      var y = 0;
      if (top) {
        var m = parseInt(top, 10);
        if (!isNaN(m)) y = -m;
      }
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.classList.remove('no-scroll-fixed');
      document.body.classList.remove('no-scroll-fixed');

      var panels = document.querySelectorAll(TAB_PANEL_SELECTORS);
      for (var i = 0; i < panels.length; i++) {
        try {
          panels[i].classList.remove('no-scroll-fixed');
          panels[i].style.overflow = '';
          panels[i].style.height = '';
        } catch (e) {}
      }

      // remove listeners we added
      try {
        for (var j = 0; j < listeners.length; j++) {
          var L = listeners[j];
          if (L && L.el && L.fn) {
            L.el.removeEventListener(L.type, L.fn, L.opts);
          }
        }
      } catch (e) {}

      // restore scroll position
      try {
        window.scrollTo(0, y || lockedScrollY || 0);
      } catch (e) {}

      locked = false;
    } catch (err) {
      console.error('__forceDisableScroll_unlock error', err);
    }
  };

})();
