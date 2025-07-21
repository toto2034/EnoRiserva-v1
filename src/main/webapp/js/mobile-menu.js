// Mobile Menu JavaScript - Standalone implementation
(function() {
    'use strict';
    
    function initializeMobileMenu() {
        const openMobileMenuBtn = document.getElementById('openMobileMenu');
        const closeMobileMenuBtn = document.getElementById('closeMobileMenu');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const navTopbar = document.querySelector('.nav-topbar');

        // Debug mobile menu elements
        console.log('Mobile Menu Debug:', {
            openMobileMenuBtn: !!openMobileMenuBtn,
            closeMobileMenuBtn: !!closeMobileMenuBtn,
            mobileMenu: !!mobileMenu,
            mobileMenuOverlay: !!mobileMenuOverlay
        });

        function openMobileMenu() {
            console.log('Opening mobile menu...');
            if (mobileMenu && mobileMenuOverlay) {
                mobileMenu.classList.add('open');
                mobileMenuOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';
                console.log('Mobile menu opened successfully');
            } else {
                console.error('Mobile menu elements not found');
            }
        }
        
        function closeMobileMenu() {
            console.log('Closing mobile menu...');
            if (mobileMenu && mobileMenuOverlay) {
                mobileMenu.classList.remove('open');
                mobileMenuOverlay.classList.remove('open');
                document.body.style.overflow = '';
                console.log('Mobile menu closed successfully');
            } else {
                console.error('Mobile menu elements not found');
            }
        }
        
        if (openMobileMenuBtn && closeMobileMenuBtn && mobileMenu && mobileMenuOverlay) {
            // Remove existing event listeners to prevent duplicates
            openMobileMenuBtn.removeEventListener('click', openMobileMenu);
            closeMobileMenuBtn.removeEventListener('click', closeMobileMenu);
            mobileMenuOverlay.removeEventListener('click', closeMobileMenu);
            
            openMobileMenuBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openMobileMenu();
            });
            openMobileMenuBtn.addEventListener('keydown', function(e) { 
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openMobileMenu(); 
                }
            });
            closeMobileMenuBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeMobileMenu();
            });
            mobileMenuOverlay.addEventListener('click', function(e) {
                if (e.target === mobileMenuOverlay) {
                    closeMobileMenu();
                }
            });
            console.log('Mobile menu event listeners attached successfully');
        } else {
            console.error('Some mobile menu elements are missing:', {
                openMobileMenuBtn: !!openMobileMenuBtn,
                closeMobileMenuBtn: !!closeMobileMenuBtn,
                mobileMenu: !!mobileMenu,
                mobileMenuOverlay: !!mobileMenuOverlay
            });
        }
    }

    // Initialize mobile menu immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMobileMenu);
    } else {
        // DOM is already ready
        initializeMobileMenu();
    }

    // Also try to initialize after a short delay to catch any late-loading elements
    setTimeout(initializeMobileMenu, 100);
    
    // Try again after a longer delay to ensure it works
    setTimeout(initializeMobileMenu, 500);
})(); 