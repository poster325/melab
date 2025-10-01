// Year display animation configuration
const totalYears = 2100 - 1850; // 250 years
const totalFrames = 250; // Matching the GIF frame count
const frameDuration = 60; // 0.06 seconds = 60ms per frame
const animationDuration = totalFrames * frameDuration; // Total animation time in ms (15 seconds)
const yearInterval = frameDuration; // Update year every frame (60ms)
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

// Start animation with fade in when DOM is loaded
async function initAnimation() {
    // Set initial opacity to 0
    earthImage.style.opacity = '0';
    earthDate.style.opacity = '0';
    
    // Reset to start
    currentYear = 1850;
    earthDate.textContent = getYearLabel(currentYear);
    
    // Fade in
    await fadeIn();
    
    // Start year animation
    startYearAnimation();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimation);
} else {
    initAnimation();
}

