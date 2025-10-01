// Year display animation configuration
const totalYears = 2100 - 1850; // 250 years
const totalFrames = 250; // Matching the GIF frame count
const fps = 15; // Matching GIF fps
const animationDuration = (totalFrames / fps) * 1000; // Total animation time in ms
const yearInterval = animationDuration / totalYears; // Time per year update

let currentYear = 1850;
let yearAnimationInterval;

// Get DOM element
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
        currentYear = 1850; // Loop back to start
    }
}

// Start year animation when page loads
function startYearAnimation() {
    // Initial year
    updateYear();
    
    // Set interval for year updates
    yearAnimationInterval = setInterval(updateYear, yearInterval);
}

// Stop year animation
function stopYearAnimation() {
    if (yearAnimationInterval) {
        clearInterval(yearAnimationInterval);
        currentYear = 1850; // Reset to start
    }
}

// Start animation when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startYearAnimation);
} else {
    startYearAnimation();
}

