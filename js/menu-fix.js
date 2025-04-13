/**
 * This file overrides and fixes the mmenu initialization in the merged script
 */
(function($) {
    $(document).ready(function() {
        console.log('Applying menu fix');
        
        // Prevent errors by creating a dummy menu object
        if (typeof window.$menu === 'undefined' || window.$menu === null) {
            console.log('Creating dummy $menu');
            window.$menu = {
                bind: function() { return this; },
                open: function() { return this; },
                close: function() { return this; }
            };
        }
        
        // Make sure menu click handlers work properly
        $('#menu-click').off('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            $(this).toggleClass('open');
            
            if ($(this).hasClass('open')) {
                $('#menu-complete').show().css({
                    'position': 'fixed',
                    'top': '0',
                    'right': '0',
                    'height': '100%',
                    'width': '300px',
                    'background': '#fff',
                    'z-index': '9999',
                    'overflow-y': 'auto',
                    'box-shadow': '-5px 0 15px rgba(0,0,0,0.1)'
                });
            } else {
                $('#menu-complete').hide();
            }
            
            return false;
        });
        
        // Close menu when clicking outside
        $(document).on('click', function(e) {
            if ($('#menu-click').hasClass('open') && 
                !$(e.target).closest('#menu-complete').length &&
                !$(e.target).closest('#menu-click').length) {
                $('#menu-click').removeClass('open');
                $('#menu-complete').hide();
            }
        });
        
        // Handle submenu toggling
        $('#menu-complete').find('li:has(ul)').addClass('has-submenu');
        
        $('#menu-complete').on('click', '.has-submenu > a', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var $submenu = $(this).next('ul');
            var $parent = $(this).parent();
            
            if ($submenu.is(':visible')) {
                $submenu.slideUp(200);
                $parent.removeClass('opened');
            } else {
                // Close other open submenus at the same level
                $parent.siblings('.opened').removeClass('opened').children('ul').slideUp(200);
                
                $submenu.slideDown(200);
                $parent.addClass('opened');
            }
        });
        
        // ESC key closes menu
        $(document).keyup(function(e) {
            if (e.key === 'Escape' && $('#menu-click').hasClass('open')) {
                $('#menu-click').removeClass('open');
                $('#menu-complete').hide();
            }
        });
    });
})(jQuery); 