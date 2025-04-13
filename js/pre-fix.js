/**
 * Pre-emptive fix for the mmenu binding error
 * This must load BEFORE the merged JS file
 */
(function() {
    console.log('Applying pre-emptive menu fix');
    
    // Override jQuery's mmenu method to return a dummy object with proper methods
    if (jQuery && jQuery.fn) {
        console.log('Patching jQuery.fn.mmenu');
        
        // Store original mmenu if it exists
        var originalMmenu = jQuery.fn.mmenu;
        
        // Override with our version that protects against errors
        jQuery.fn.mmenu = function() {
            // Check if the selector is #menu
            if (this.is('#menu')) {
                console.log('Creating safe mmenu instance for #menu');
                
                // Return a safe object with all required methods
                var safeMenu = {
                    bind: function() { return this; },
                    open: function() { return this; },
                    close: function() { return this; }
                };
                
                // Allow this to be used with .data()
                this.data = function(key) {
                    if (key === 'mmenu') {
                        return safeMenu;
                    }
                    return null;
                };
                
                return safeMenu;
            }
            
            // If not #menu, call original if available
            if (typeof originalMmenu === 'function') {
                return originalMmenu.apply(this, arguments);
            }
            
            // Fallback if no original
            return this;
        };
    }
})(); 