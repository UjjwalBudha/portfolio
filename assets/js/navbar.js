/**
 * Reusable Navigation Bar Component for Portfolio Website
 * Author: Ujwal Budha
 * 
 * Features:
 * - Fixed navigation bar with dark background
 * - Responsive hamburger menu for mobile devices
 * - Smooth slide-in animation
 * - Auto-close on outside click or menu item selection
 * - Supports both root and subdirectory pages
 */

(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    logoText: 'Ujwal Budha',
    logoUrl: '/',
    brandColor: '#18d26e',
    mobileBreakpoint: 992,
    menuItems: [
      { text: 'Home', href: '/#header' },
      { text: 'About', href: '/#about' },
      { text: 'Resume', href: '/#resume' },
      { text: 'Certifications', href: '/#certifications' },
      { text: 'Blogs', href: '/#blogs' },
      { text: 'Contact', href: '/#contact' }
    ]
  };

  /**
   * Inject CSS styles for the navigation bar
   */
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Navigation Bar Base Styles */
      #shared-navbar {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 9999 !important;
        background: rgba(0, 0, 0, 0.95) !important;
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3) !important;
        padding: 18px 0 !important;
        margin: 0 !important;
        transition: all 0.3s ease;
        font-family: "Poppins", "Open Sans", "Raleway", sans-serif !important;
      }

      #shared-navbar .navbar-container {
        max-width: 1200px !important;
        margin: 0 auto !important;
        padding: 0 30px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
      }

      /* Logo Styles */
      #shared-navbar .navbar-logo {
        font-size: 22px !important;
        font-weight: 700 !important;
        color: ${CONFIG.brandColor} !important;
        text-decoration: none !important;
        transition: all 0.3s ease;
        letter-spacing: 0.5px !important;
        line-height: normal !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
      }

      #shared-navbar .navbar-logo:hover {
        color: #1de07e !important;
        transform: scale(1.05);
      }

      /* Desktop Menu Styles */
      #shared-navbar .navbar-menu {
        display: flex !important;
        list-style: none !important;
        margin: 0 !important;
        padding: 0 !important;
        gap: 35px;
        line-height: normal !important;
      }

      #shared-navbar .navbar-menu li {
        margin: 0 !important;
        padding: 0 !important;
        list-style: none !important;
      }

      #shared-navbar .navbar-menu a {
        color: rgba(255, 255, 255, 0.7) !important;
        text-decoration: none !important;
        font-size: 15px !important;
        font-weight: 400 !important;
        padding: 8px 0 !important;
        margin: 0 !important;
        position: relative;
        transition: all 0.3s ease;
        text-transform: none !important;
        letter-spacing: 0 !important;
        line-height: normal !important;
        border-bottom: none !important;
        font-family: "Poppins", sans-serif !important;
      }

      #shared-navbar .navbar-menu a::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: var(--underline-width, 0);
        height: 2px;
        background: ${CONFIG.brandColor};
        transition: width 0.3s ease;
        visibility: visible;
      }

      #shared-navbar .navbar-menu a:hover {
        color: #fff !important;
      }

      #shared-navbar .navbar-menu a:hover::after {
        width: 25px;
      }

      /* Hamburger Icon */
      #shared-navbar .navbar-toggle {
        display: none;
        flex-direction: column;
        cursor: pointer;
        gap: 5px;
        background: none;
        border: none;
        padding: 5px;
        z-index: 10001;
      }

      #shared-navbar .navbar-toggle span {
        width: 28px;
        height: 3px;
        background: #fff;
        transition: all 0.3s ease;
        border-radius: 2px;
      }

      #shared-navbar .navbar-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(8px, 8px);
      }

      #shared-navbar .navbar-toggle.active span:nth-child(2) {
        opacity: 0;
      }

      #shared-navbar .navbar-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -7px);
      }

      /* Mobile Menu Overlay */
      #shared-navbar .navbar-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9998;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      #shared-navbar .navbar-overlay.active {
        display: block;
        opacity: 1;
      }

      /* Page Content Spacing */
      body.has-navbar {
        padding-top: 75px !important;
      }

      /* Mobile Responsive Styles */
      @media (max-width: ${CONFIG.mobileBreakpoint - 1}px) {
        #shared-navbar .navbar-toggle {
          display: flex;
        }

        #shared-navbar .navbar-menu {
          position: fixed;
          top: 0;
          right: -300px;
          width: 280px;
          height: 100vh;
          background: rgba(0, 0, 0, 0.98);
          flex-direction: column;
          padding: 80px 30px 30px;
          gap: 0;
          transition: right 0.3s ease;
          box-shadow: -2px 0 15px rgba(0, 0, 0, 0.3);
          overflow-y: auto;
          z-index: 10000;
        }

        #shared-navbar .navbar-menu.active {
          right: 0;
        }

        #shared-navbar .navbar-menu li {
          margin: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        #shared-navbar .navbar-menu a {
          display: block;
          padding: 15px 0;
          font-size: 16px;
        }

        #shared-navbar .navbar-menu a::after {
          display: none;
        }
      }

      /* Tablet Adjustments */
      @media (max-width: 768px) {
        #shared-navbar .navbar-logo {
          font-size: 20px !important;
        }

        body.has-navbar {
          padding-top: 60px;
        }
      }

      /* Animation for menu items */
      @media (max-width: ${CONFIG.mobileBreakpoint - 1}px) {
        #shared-navbar .navbar-menu.active li {
          animation: slideInRight 0.3s ease forwards;
          opacity: 0;
        }

        #shared-navbar .navbar-menu.active li:nth-child(1) { animation-delay: 0.1s; }
        #shared-navbar .navbar-menu.active li:nth-child(2) { animation-delay: 0.15s; }
        #shared-navbar .navbar-menu.active li:nth-child(3) { animation-delay: 0.2s; }
        #shared-navbar .navbar-menu.active li:nth-child(4) { animation-delay: 0.25s; }
        #shared-navbar .navbar-menu.active li:nth-child(5) { animation-delay: 0.3s; }
        #shared-navbar .navbar-menu.active li:nth-child(6) { animation-delay: 0.35s; }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Determine the correct base path for links
   * Returns '/' for root pages, '../' for subdirectory pages
   */
  function getBasePath() {
    const path = window.location.pathname;
    // Check if we're in a subdirectory (e.g., /blogs/)
    const pathSegments = path.split('/').filter(segment => segment.length > 0);

    // If we have more than one segment and it's not just the filename, we're in a subdirectory
    if (pathSegments.length > 1 || (pathSegments.length === 1 && pathSegments[0].includes('/'))) {
      return '../';
    }
    return '/';
  }

  /**
   * Adjust menu item URLs based on current page location
   */
  function adjustMenuUrls() {
    const basePath = getBasePath();

    // Only adjust if we're not on the root
    if (basePath === '../') {
      return CONFIG.menuItems.map(item => ({
        ...item,
        href: item.href.replace('/', basePath)
      }));
    }

    return CONFIG.menuItems;
  }

  /**
   * Build the navigation HTML structure
   */
  function buildNavbar() {
    const nav = document.createElement('nav');
    nav.id = 'shared-navbar';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');

    const basePath = getBasePath();
    const logoHref = basePath === '../' ? '../' : CONFIG.logoUrl;
    const menuItems = adjustMenuUrls();

    nav.innerHTML = `
      <div class="navbar-container">
        <a href="${logoHref}" class="navbar-logo" aria-label="Home">${CONFIG.logoText}</a>
        
        <button class="navbar-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul class="navbar-menu" role="menu">
          ${menuItems.map(item => `
            <li role="none">
              <a href="${item.href}" role="menuitem">${item.text}</a>
            </li>
          `).join('')}
        </ul>

        <div class="navbar-overlay" aria-hidden="true"></div>
      </div>
    `;

    return nav;
  }

  /**
   * Initialize mobile menu functionality
   */
  function initMobileMenu(navbar) {
    const toggle = navbar.querySelector('.navbar-toggle');
    const menu = navbar.querySelector('.navbar-menu');
    const overlay = navbar.querySelector('.navbar-overlay');
    const menuLinks = navbar.querySelectorAll('.navbar-menu a');

    if (!toggle || !menu || !overlay) return;

    // Toggle menu
    function toggleMenu() {
      const isActive = menu.classList.contains('active');

      toggle.classList.toggle('active');
      menu.classList.toggle('active');
      overlay.classList.toggle('active');

      // Update ARIA attribute
      toggle.setAttribute('aria-expanded', !isActive);

      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? '' : 'hidden';
    }

    // Close menu
    function closeMenu() {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      overlay.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    // Event listeners
    toggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // Close menu when clicking on a menu item
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Small delay to allow the link to be processed
        setTimeout(closeMenu, 100);
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        closeMenu();
      }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth >= CONFIG.mobileBreakpoint) {
          closeMenu();
        }
      }, 250);
    });
  }

  /**
   * Add active state to current menu item based on URL hash or page location
   */
  function updateActiveMenuItem(navbar) {
    const menuLinks = navbar.querySelectorAll('.navbar-menu a');
    const currentHash = window.location.hash || '#header';
    const currentPath = window.location.pathname;

    // Check if we're on a blog page
    const isOnBlogPage = currentPath.includes('/blogs/') && currentPath.endsWith('.html');

    menuLinks.forEach(link => {
      const href = link.getAttribute('href');
      const linkText = link.textContent.trim();

      // Highlight "Blogs" if we're on any blog page
      if (isOnBlogPage && linkText === 'Blogs') {
        link.style.color = '#fff';
        link.style.setProperty('--underline-width', '100%');
      }
      // Otherwise, check for hash-based highlighting (for homepage sections)
      else {
        const linkHash = href.split('#')[1];
        if (linkHash && `#${linkHash}` === currentHash && !isOnBlogPage) {
          link.style.color = '#fff';
          link.style.setProperty('--underline-width', '100%');
        } else {
          link.style.color = '';
          link.style.fontWeight = '';
          link.style.removeProperty('--underline-width');
        }
      }
    });

    // Update on hash change (only relevant for homepage)
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash;
      menuLinks.forEach(link => {
        const linkHash = link.getAttribute('href').split('#')[1];
        const linkText = link.textContent.trim();

        // Don't change highlighting if on blog page
        if (isOnBlogPage && linkText === 'Blogs') {
          return;
        }

        if (linkHash && `#${linkHash}` === newHash) {
          link.style.color = '#fff';
          link.style.setProperty('--underline-width', '100%');
        } else {
          link.style.color = '';
          link.style.fontWeight = '';
          link.style.removeProperty('--underline-width');
        }
      });
    });
  }

  /**
   * Initialize the navigation bar
   */
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Inject styles
    injectStyles();

    // Build and insert navbar
    const navbar = buildNavbar();
    document.body.insertBefore(navbar, document.body.firstChild);

    // Add body class for spacing
    document.body.classList.add('has-navbar');

    // Initialize mobile menu
    initMobileMenu(navbar);

    // Update active menu item
    updateActiveMenuItem(navbar);

    // Smooth scroll for anchor links (optional enhancement)
    const menuLinks = navbar.querySelectorAll('.navbar-menu a[href*="#"]');
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const hashIndex = href.indexOf('#');

        // Only handle smooth scroll if we're on the same page
        if (hashIndex > 0 && href.substring(0, hashIndex) === window.location.pathname) {
          e.preventDefault();
          const targetId = href.substring(hashIndex + 1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, null, `#${targetId}`);
          }
        }
      });
    });
  }

  // Auto-initialize
  init();
})();
