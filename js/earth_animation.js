// Earth animation configuration
const totalFrames = 250;
const fps = 20;
const frameInterval = 1000 / fps; // 50ms per frame

// Year configuration
const years = [1850, 1900, 1950, 2000, 2050, 2100];
const framesPerYear = totalFrames / (years.length - 1); // 50 frames per year transition

let currentFrame = 1;
let animationInterval;

// Get DOM elements
const earthImage = document.getElementById('earth');
const earthDate = document.getElementById('earth_date');

// Function to pad frame number with zeros
function padFrameNumber(num) {
    return String(num).padStart(4, '0');
}

// Function to get current year based on frame
function getCurrentYear(frame) {
    const yearIndex = Math.floor((frame - 1) / framesPerYear);
    return years[Math.min(yearIndex, years.length - 1)];
}

// Function to get year label
function getYearLabel(year) {
    if (year <= 1900) {
        return `Historical, AD ${year}`;
    } else if (year <= 2020) {
        return `Historical, AD ${year}`;
    } else {
        return `Future Projection, AD ${year}`;
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

