/**
 * Advanced Animation System
 * Based on modern web design patterns
 * Handles: Preloader, Text Reveals, Staggered Animations, Page Transitions
 */

class AdvancedAnimations {
    constructor() {
        this.isLoaded = false;
        this.animationQueue = [];
        this.init();
    }

    init() {
        // Add no-scroll class initially
        document.documentElement.classList.add('no-scroll', 'loading');
        
        // Wait for DOM and images to load
        this.waitForLoad();
    }

    async waitForLoad() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Preload critical images
        await this.preloadCriticalImages();

        // Small delay for smooth experience
        await this.wait(500);

        // Start revealing content
        this.revealPage();
    }

    async preloadCriticalImages() {
        const images = [];
        
        // Only preload if elements exist on page
        const earthImg = document.getElementById('earth');
        if (earthImg) {
            const earthGif = new Image();
            earthGif.src = './assets/index/earth_animation/earthanim.gif';
            images.push(this.loadImage(earthGif));

            // Background
            const bgImg = new Image();
            bgImg.src = './assets/index/earth_bg.jpg';
            images.push(this.loadImage(bgImg));
        }

        // If no images to preload, just continue
        if (images.length === 0) {
            return Promise.resolve();
        }

        // Wait for all critical images
        await Promise.all(images);
    }

    loadImage(img) {
        return new Promise((resolve, reject) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
                img.onerror = resolve; // Continue even if image fails
            }
        });
    }

    async revealPage() {
        // Hide preloader
        this.hidePreloader();

        // Small delay
        await this.wait(200);

        // Remove no-scroll and loading classes
        document.documentElement.classList.remove('no-scroll', 'loading');
        document.body.classList.remove('no-scroll', 'loading');
        document.documentElement.classList.add('loaded');

        // Reveal header
        this.revealHeader();

        // Reveal main content
        await this.wait(300);
        this.revealMainContent();
    }

    hidePreloader() {
        const preloader = document.getElementById('page-preloader');
        if (preloader) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }
    }

    revealHeader() {
        const navItems = document.querySelectorAll('.nav_item');
        const logo = document.querySelector('.header_icon');

        // Animate logo
        if (logo) {
            logo.style.opacity = '0';
            logo.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                logo.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
                logo.style.opacity = '1';
                logo.style.transform = 'translateY(0)';
            }, 100);
        }

        // Animate nav items with stagger
        navItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 200 + (index * 50));
        });
    }

    revealMainContent() {
        // Reveal sections with stagger
        const sections = document.querySelectorAll('.main_page');
        
        sections.forEach((section, index) => {
            this.revealSection(section, index * 150);
        });

        // Also reveal standalone elements with data-reveal (for new page structure)
        const standaloneElements = document.querySelectorAll('body > main [data-reveal], body > * [data-reveal]');
        standaloneElements.forEach((el, index) => {
            // Skip if already inside a .main_page
            if (!el.closest('.main_page')) {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, index * 150);
            }
        });

        // Reveal indicator
        setTimeout(() => {
            this.revealIndicator();
        }, 400);
    }

    revealSection(section, delay) {
        // Find all reveal elements in section
        const elements = section.querySelectorAll('[data-reveal]');
        
        setTimeout(() => {
            section.classList.add('revealed');
            
            // Reveal child elements with stagger
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, index * 100);
            });
        }, delay);
    }

    revealIndicator() {
        const indicator = document.querySelector('.page-indicator');
        if (indicator) {
            indicator.classList.add('revealed');
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Page Transition Handler
class PageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.attachToLinks();
    }

    attachToLinks() {
        const links = document.querySelectorAll('a[href]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Only attach to internal page links
            if (href && 
                !href.startsWith('#') && 
                !href.startsWith('javascript:') &&
                !href.startsWith('mailto:') &&
                !href.startsWith('tel:') &&
                link.target !== '_blank') {
                
                link.addEventListener('click', (e) => {
                    // Allow home links to work normally
                    if (href.includes('index.html')) {
                        return;
                    }
                    
                    e.preventDefault();
                    this.transitionToPage(href);
                });
            }
        });
    }

    async transitionToPage(url) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;

        // Add transitioning class
        document.documentElement.classList.add('page-transitioning');

        // Wait for transition
        await this.wait(600);

        // Navigate
        window.location.href = url;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Mark active navigation item
function markActiveNavItem() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav_item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href) {
            // Normalize paths for comparison
            const normalizedHref = href.replace('./', '/').replace(/\\/g, '/');
            const normalizedPath = currentPath.replace(/\\/g, '/');
            
            // Check if this nav item matches the current page
            if (normalizedPath.endsWith(normalizedHref) || 
                (normalizedHref.includes('about') && normalizedPath.includes('about')) ||
                (normalizedHref.includes('news') && normalizedPath.includes('news')) ||
                (normalizedHref.includes('people') && normalizedPath.includes('people')) ||
                (normalizedHref.includes('publication') && normalizedPath.includes('publication')) ||
                (normalizedHref.includes('contact') && normalizedPath.includes('contact'))) {
                item.classList.add('active');
            }
        }
    });
}

// Global function to trigger reveals for dynamically loaded content
function triggerContentReveals(selector = '[data-reveal]') {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        // Only reveal if not already revealed
        if (!el.classList.contains('revealed')) {
            setTimeout(() => {
                el.classList.add('revealed');
            }, index * 100);
        }
    });
}

// Expose globally
window.triggerContentReveals = triggerContentReveals;

// Initialize when script loads
const animations = new AdvancedAnimations();
const transitions = new PageTransitions();

// Mark active nav after a short delay
setTimeout(markActiveNavItem, 100);

// Expose globally if needed
window.advancedAnimations = animations;
window.pageTransitions = transitions;

