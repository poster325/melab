// Elegant Page Transition System
// Inspired by modern web design with smooth curtain transitions

class PageTransition {
    constructor() {
        this.isTransitioning = false;
        this.curtain = null;
        this.init();
    }

    init() {
        // Create curtain overlay
        this.createCurtain();
        
        // Attach to all navigation links
        this.attachToLinks();
        
        // Handle browser back/forward
        this.handleBrowserNavigation();
        
        // Fade in on page load
        this.fadeInOnLoad();
    }

    createCurtain() {
        // Create curtain element
        const curtain = document.createElement('div');
        curtain.id = 'page-curtain';
        curtain.innerHTML = `
            <div class="curtain-content">
                <div class="curtain-logo">
                    <svg viewBox="0 0 50 50" class="loading-ring">
                        <circle cx="25" cy="25" r="20"></circle>
                    </svg>
                </div>
            </div>
        `;
        
        document.body.appendChild(curtain);
        this.curtain = curtain;
    }

    attachToLinks() {
        // Get all navigation links
        const links = document.querySelectorAll('a[href]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Only attach to internal page links (not anchors or external)
            if (href && 
                !href.startsWith('#') && 
                !href.startsWith('javascript:') &&
                !href.startsWith('mailto:') &&
                !href.startsWith('tel:') &&
                !link.target === '_blank') {
                
                link.addEventListener('click', (e) => {
                    // Allow home links to work normally without transition
                    if (href.includes('index.html')) {
                        return; // Let it navigate normally
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
        
        // Close curtain (animate in)
        this.curtain.classList.add('closing');
        
        // Wait for curtain animation
        await this.wait(600);
        
        // Navigate to new page
        window.location.href = url;
    }

    fadeInOnLoad() {
        // Add initial state
        this.curtain.classList.add('opening');
        
        // Wait a bit then fade out curtain
        setTimeout(() => {
            this.curtain.classList.remove('opening');
            
            // Clean up after animation
            setTimeout(() => {
                this.isTransitioning = false;
            }, 800);
        }, 100);
    }

    handleBrowserNavigation() {
        // Handle back/forward buttons
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                // Page loaded from cache
                this.fadeInOnLoad();
            }
        });
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PageTransition();
    });
} else {
    new PageTransition();
}

