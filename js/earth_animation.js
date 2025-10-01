// Earth animation configuration
const totalFrames = 250;
const fps = 15;
const frameInterval = 1000 / fps; // ~66.67ms per frame

let currentFrame = 1;
let animationInterval;

// Get DOM elements
const earthImage = document.getElementById('earth');
const earthDate = document.getElementById('earth_date');

// Function to pad frame number with zeros
function padFrameNumber(num) {
    return String(num).padStart(4, '0');
}

// Function to get current year based on frame (smooth transition from 1850 to 2100)
function getCurrentYear(frame) {
    // Linear interpolation from 1850 to 2100 over 250 frames
    const year = 1850 + Math.round((frame - 1) / (totalFrames - 1) * (2100 - 1850));
    return year;
}

// Function to get year label
function getYearLabel(year) {
    // Historical period up to around 2015, then SSP585 projection
    if (year <= 2015) {
        return `Historical, A.D. ${year}`;
    } else {
        return `SSP585, A.D. ${year}`;
    }
}

// Function to update frame
function updateFrame() {
    // Update image
    earthImage.src = `./assets/index/earth_animation/${padFrameNumber(currentFrame)}.png`;
    
    // Update year
    const currentYear = getCurrentYear(currentFrame);
    earthDate.textContent = getYearLabel(currentYear);
    
    // Move to next frame
    currentFrame++;
    if (currentFrame > totalFrames) {
        currentFrame = 1; // Loop back to start
    }
}

// Start animation when page loads
function startAnimation() {
    // Initial frame
    updateFrame();
    
    // Set interval for animation
    animationInterval = setInterval(updateFrame, frameInterval);
}

// Stop animation
function stopAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
    }
}

// Start animation when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAnimation);
} else {
    startAnimation();
}

// Optional: Pause animation when user leaves the page (performance optimization)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAnimation();
    } else {
        startAnimation();
    }
});

