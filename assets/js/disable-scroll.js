/**
 * disable-scroll.js
 * Disables scrolling site-wide when any tab is clicked
 */

(function() {
    'use strict';
    
    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Prevent duplicate listeners by checking for marker
        if (document.body.hasAttribute('data-disable-scroll-initialized')) {
            return;
        }
        document.body.setAttribute('data-disable-scroll-initialized', 'true');
        
        // Tab selectors that commonly represent tabs
        const tabSelectors = [
            '[role="tab"]',
            '[data-toggle="tab"]',
            '[data-bs-toggle="tab"]',
            '.tab',
            '.tab-link',
            '.tab-button',
            '.nav-tabs a',
            '.tabs a'
        ];
        
        // Tab panel selectors
        const tabPanelSelectors = [
            '[role="tabpanel"]',
            '.tab-panel',
            '.tab-content',
            '.tab-pane'
        ];
        
        // Use delegated listener on document
        document.addEventListener('click', function(event) {
            // Check if clicked element or any parent matches tab selectors
            let element = event.target;
            let isTab = false;
            
            // Check up to 5 levels up the DOM tree
            for (let i = 0; i < 5 && element; i++) {
                if (tabSelectors.some(selector => element.matches && element.matches(selector))) {
                    isTab = true;
                    break;
                }
                element = element.parentElement;
            }
            
            if (isTab) {
                disableScrolling();
            }
        }, false);
    }
    
    function disableScrolling() {
        // Add .no-scroll class to html and body
        document.documentElement.classList.add('no-scroll');
        document.body.classList.add('no-scroll');
        
        // Also set inline styles as fallback
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        // Find all tab panels and disable scrolling on them
        const tabPanelSelectors = [
            '[role="tabpanel"]',
            '.tab-panel',
            '.tab-content',
            '.tab-pane'
        ];
        
        tabPanelSelectors.forEach(function(selector) {
            const panels = document.querySelectorAll(selector);
            panels.forEach(function(panel) {
                panel.classList.add('no-scroll');
                panel.style.overflow = 'hidden';
            });
        });
    }
})();
