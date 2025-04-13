// Execute as soon as possible, don't wait for DOMContentLoaded
(function() {
  // Make sure script runs only once
  if (window.gksMenuInitialized) return;
  window.gksMenuInitialized = true;
  
  // Function to initialize the menu
  function initMenu() {
    console.log('Trying to initialize GKS menu...');
    
    // Mobile menu functionality
    const toggle = document.getElementById('gks-menu-toggle');
    const panel = document.getElementById('gks-menu-panel');
    const overlay = document.getElementById('gks-menu-overlay');
    const close = document.querySelector('.gks-menu-close');
    
    if (!toggle || !panel || !overlay) {
      console.error('Menu elements not found. Retrying in 200ms...', {
        toggle: toggle ? 'Found' : 'Missing',
        panel: panel ? 'Found' : 'Missing',
        overlay: overlay ? 'Found' : 'Missing'
      });
      setTimeout(initMenu, 200);
      return;
    }

    function toggleMobileMenu(e) {
      e.preventDefault();
      console.log('Toggle menu clicked');
      panel.classList.toggle('active');
      overlay.classList.toggle('active');
      if (panel.classList.contains('active')) {
        document.body.style.overflow = 'hidden'; // Prevent scroll
      } else {
        document.body.style.overflow = ''; // Restore scroll
      }
    }

    // Remove any existing event listeners to prevent duplicates
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    const newOverlay = overlay.cloneNode(true);
    overlay.parentNode.replaceChild(newOverlay, overlay);
    
    if (close) {
      const newClose = close.cloneNode(true);
      close.parentNode.replaceChild(newClose, close);
      newClose.addEventListener('click', toggleMobileMenu);
    }
    
    // Add event listeners to the new elements
    newToggle.addEventListener('click', toggleMobileMenu);
    newOverlay.addEventListener('click', toggleMobileMenu);

    // Close mobile menu on ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.getElementById('gks-menu-panel').classList.contains('active')) {
        document.getElementById('gks-menu-panel').classList.remove('active');
        document.getElementById('gks-menu-overlay').classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Set active menu item based on current URL
    function setActiveMenuItem() {
      const currentPath = window.location.pathname;
      const menuItems = document.querySelectorAll('.navbar-menu2 ul li a, .gks-menu-list li a');
      
      // Remove all active classes first (except from submenu items)
      document.querySelectorAll('.navbar-menu2 > ul > li, .gks-menu-list > li').forEach(item => {
        item.classList.remove('active');
      });
      
      // Find matching menu item and add active class
      menuItems.forEach(item => {
        const href = item.getAttribute('href');
        // Check if current URL contains the link path
        if (currentPath.includes(href) && href !== '/en/index.html') {
          // Only mark as active if it's a direct child of the main menu
          if (item.parentElement.parentElement.classList.contains('navbar-menu2') ||
              item.parentElement.parentElement.classList.contains('gks-menu-list')) {
            item.parentElement.classList.add('active');
          }
        } else if (currentPath === '/en/' || currentPath === '/en/index.html') {
          // Special case for home page
          if (href === '/en/index.html') {
            item.parentElement.classList.add('active');
          }
        }
      });
      
      // Highlight specific submenu items without keeping parent menus open
      if (currentPath.includes('/products/') || currentPath.includes('/services/')) {
        document.querySelectorAll('.navbar-menu2 .submenu li a, .gks-menu-list .submenu li a').forEach(link => {
          if (currentPath.includes(link.getAttribute('href'))) {
            link.parentElement.classList.add('active');
          }
        });
      }
    }
    
    // Initialize active menu item
    setActiveMenuItem();
    
    // Add event listeners for mobile submenu toggles
    const submenuItems = document.querySelectorAll('.gks-menu-list .has-submenu > a');
    
    submenuItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const parent = this.parentElement;
        parent.classList.toggle('open');
      });
    });
    
    console.log('GKS Menu initialized successfully');
  }
  
  // Delay initialization to ensure DOM is ready
  setTimeout(initMenu, 100);
  
  // Also try after window load in case elements are not yet available
  window.addEventListener('load', function() {
    if (!document.getElementById('gks-menu-toggle')) {
      console.log('Elements not found after load, retrying...');
      setTimeout(initMenu, 300);
    }
  });
})();