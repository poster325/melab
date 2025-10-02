// Year display animation configuration
const totalYears = 2100 - 1850; // 250 years
const totalFrames = 250; // Matching the GIF frame count
const frameDuration = 60; // 0.06 seconds = 60ms per frame
const animationDuration = totalFrames * frameDuration; // Total animation time in ms (15 seconds)
const yearInterval = animationDuration / totalYears; // 60ms per year to match GIF exactly
const fadeOutDuration = 1000; // 1 second fade out
const waitDuration = 1000; // 1 second wait
const fadeInDuration = 1000; // 1 second fade in

let currentYear = 1850;
let yearAnimationInterval;
let animationTimer = null;
let isAnimating = false;

// Get DOM elements
const earthImage = document.getElementById('earth');
const earthDatePrefix = document.getElementById('earth_date_prefix');
const earthDateAd = document.getElementById('earth_date_ad');
const earthDateYear = document.getElementById('earth_date_year');

// Function to get year prefix
function getYearPrefix(year) {
    // Historical period up to around 2015, then SSP585 projection
    if (year <= 2015) {
        return 'Historical';
    } else {
        return 'SSP585';
    }
}

// Function to update year display
function updateYear() {
    earthDatePrefix.textContent = getYearPrefix(currentYear);
    earthDateYear.textContent = currentYear;
    
    // Increment year (will be capped at 2100)
    if (currentYear < 2100) {
        currentYear++;
    }
}

// Function to fade out
function fadeOut() {
    return new Promise((resolve) => {
        earthImage.style.transition = `opacity ${fadeOutDuration}ms ease-in-out`;
        earthDatePrefix.style.transition = `opacity ${fadeOutDuration}ms ease-in-out`;
        earthDateAd.style.transition = `opacity ${fadeOutDuration}ms ease-in-out`;
        earthDateYear.style.transition = `opacity ${fadeOutDuration}ms ease-in-out`;
        earthImage.style.opacity = '0';
        earthDatePrefix.style.opacity = '0';
        earthDateAd.style.opacity = '0';
        earthDateYear.style.opacity = '0';
        setTimeout(resolve, fadeOutDuration);
    });
}

// Function to fade in
function fadeIn() {
    return new Promise((resolve) => {
        earthImage.style.transition = `opacity ${fadeInDuration}ms ease-in-out`;
        earthDatePrefix.style.transition = `opacity ${fadeInDuration}ms ease-in-out`;
        earthDateAd.style.transition = `opacity ${fadeInDuration}ms ease-in-out`;
        earthDateYear.style.transition = `opacity ${fadeInDuration}ms ease-in-out`;
        earthImage.style.opacity = '1';
        earthDatePrefix.style.opacity = '1';
        earthDateAd.style.opacity = '1';
        earthDateYear.style.opacity = '1';
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
    earthDatePrefix.textContent = getYearPrefix(currentYear);
    earthDateYear.textContent = currentYear;
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
    
    // Set timer to trigger fade sequence after exactly animationDuration
    // This ensures GIF and fade are perfectly synchronized
    if (animationTimer) {
        clearTimeout(animationTimer);
    }
    animationTimer = setTimeout(() => {
        stopYearAnimation();
        startFadeOutSequence();
    }, animationDuration);
}

// Stop year animation
function stopYearAnimation() {
    if (yearAnimationInterval) {
        clearInterval(yearAnimationInterval);
        yearAnimationInterval = null;
    }
    if (animationTimer) {
        clearTimeout(animationTimer);
        animationTimer = null;
    }
}

// Start animation with fade in when DOM is loaded
async function initAnimation() {
    // Set initial opacity to 0
    earthImage.style.opacity = '0';
    earthDatePrefix.style.opacity = '0';
    earthDateAd.style.opacity = '0';
    earthDateYear.style.opacity = '0';
    
    // Reset to start
    currentYear = 1850;
    earthDatePrefix.textContent = getYearPrefix(currentYear);
    earthDateYear.textContent = currentYear;
    
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

