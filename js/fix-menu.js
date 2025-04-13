/**
 * Fix for the mmenu binding error
 * This script adds a fix for the "Cannot read properties of undefined (reading 'bind')" error
 */
(function() {
    // Run this code after everything else has loaded
    window.addEventListener('load', function() {
        // Check if $menu is undefined (the source of our error)
        if (typeof $menu === 'undefined' || $menu === null) {
            // Create a dummy $menu object with all required methods
            window.$menu = {
                bind: function() { return this; },
                open: function() { return this; },
                close: function() { return this; }
            };
            
            console.log('Menu fix applied successfully');
        }
        
        // Also check for the click handler on #menu-click
        var $menuClick = $("#menu-click");
        if ($menuClick.length) {
            // Make sure it has a working click handler
            $menuClick.off('click').on('click', function(e) {
                e.preventDefault();
                $(this).toggleClass('open');
                
                // Toggle the menu-complete visibility
                $('#menu-complete').toggle();
                
                return false;
            });
        }
    });
})(); 