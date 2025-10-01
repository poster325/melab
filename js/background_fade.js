// Background fade-out effect when navigating away from home page

document.addEventListener('DOMContentLoaded', function() {
    const background = document.getElementById('space_background');
    const navigationLinks = document.querySelectorAll('.nav_item');
    
    // Add click event to all navigation links except home
    navigationLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Only fade out when navigating away from index.html
        if (href && !href.includes('index.html')) {
            link.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent immediate navigation
                
                // Fade out background
                background.style.opacity = '0';
                
                // Navigate after fade completes
                setTimeout(() => {
                    window.location.href = href;
                }, 500); // Match the CSS transition duration
            });
        }
    });
});

