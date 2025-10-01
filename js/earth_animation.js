// Year display animation configuration
const totalYears = 2100 - 1850; // 250 years
const totalFrames = 250; // Matching the GIF frame count
const fps = 15; // Matching GIF fps
const animationDuration = (totalFrames / fps) * 1000; // Total animation time in ms
const yearInterval = animationDuration / totalYears; // Time per year update
const fadeOutDuration = 1000; // 1 second fade out
const waitDuration = 1000; // 1 second wait
const fadeInDuration = 1000; // 1 second fade in

let currentYear = 1850;
let yearAnimationInterval;
let isAnimating = false;

// Get DOM elements
const earthImage = document.getElementById('earth');
const earthDate = document.getElementById('earth_date');

// Function to get year label
function getYearLabel(year) {
    // Historical period up to around 2015, then SSP585 projection
    if (year <= 2015) {
        return `Historical, A.D. ${year}`;
    } else {
        return `SSP585, A.D. ${year}`;
    }
}

// Function to update year display
function updateYear() {
    earthDate.textContent = getYearLabel(currentYear);
    
    // Increment year
    currentYear++;
    if (currentYear > 2100) {
        // Stop the year animation and start fade out sequence
        stopYearAnimation();
        startFadeOutSequence();
    }
}

// Function to fade out
function fadeOut() {
    return new Promise((resolve) => {
        earthImage.style.transition = `opacity ${fadeOutDuration}ms ease-in-out`;
        earthDate.style.transition = `opacity ${fadeOutDuration}ms ease-in-out`;
        earthImage.style.opacity = '0';
        earthDate.style.opacity = '0';
        setTimeout(resolve, fadeOutDuration);
    });
}

// Function to fade in
function fadeIn() {
    return new Promise((resolve) => {
        earthImage.style.transition = `opacity ${fadeInDuration}ms ease-in-out`;
        earthDate.style.transition = `opacity ${fadeInDuration}ms ease-in-out`;
        earthImage.style.opacity = '1';
        earthDate.style.opacity = '1';
        setTimeout(resolve, fadeInDuration);
    });
}

// Function to wait
function wait(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}

// Function to reset to start
function resetToStart() {
    // Reset GIF by changing src
    const currentSrc = earthImage.src;
    earthImage.src = '';
    earthImage.src = currentSrc;
    
    // Reset year
    currentYear = 1850;
    earthDate.textContent = getYearLabel(currentYear);
}

// Fade out sequence
async function startFadeOutSequence() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Fade out
    await fadeOut();
    
    // Wait
    await wait(waitDuration);
    
    // Reset to start
    resetToStart();
    
    // Fade in
    await fadeIn();
    
    // Restart animation
    isAnimating = false;
    startYearAnimation();
}

// Start year animation
function startYearAnimation() {
    // Initial year
    currentYear = 1850;
    updateYear();
    
    // Set interval for year updates
    yearAnimationInterval = setInterval(updateYear, yearInterval);
}

// Stop year animation
function stopYearAnimation() {
    if (yearAnimationInterval) {
        clearInterval(yearAnimationInterval);
        yearAnimationInterval = null;
    }
}

// Start animation when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startYearAnimation);
} else {
    startYearAnimation();
}

