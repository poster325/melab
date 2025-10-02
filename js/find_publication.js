function currentYear(i){
    document.getElementById(i).scrollIntoView();
}

// Highlight active year based on scroll position
const years = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000];

function updateActiveYear() {
    const scrollPosition = window.scrollY + 200; // Trigger point from top
    
    let activeYear = null;
    
    // Find which year section is currently in view
    // Iterate through years to find the last one that's passed
    for (let i = 0; i < years.length; i++) {
        const yearSection = document.getElementById(years[i]);
        
        if (yearSection) {
            const rect = yearSection.getBoundingClientRect();
            const absoluteTop = rect.top + window.scrollY;
            
            // Keep updating activeYear as long as we've scrolled past this section
            if (scrollPosition >= absoluteTop) {
                activeYear = years[i];
            } else {
                // Once we hit a section we haven't reached yet, stop
                break;
            }
        }
    }
    
    // Update highlights
    years.forEach(year => {
        const yearElement = document.getElementById(`year_${year}`);
        if (yearElement) {
            if (year === activeYear) {
                yearElement.classList.add('active-year');
            } else {
                yearElement.classList.remove('active-year');
            }
        }
    });
}

// Debounce function for performance
let scrollTimeout;
function onScroll() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveYear, 50);
}

// Listen for scroll events
window.addEventListener('scroll', onScroll);

// Initial check after a short delay to let content load
setTimeout(updateActiveYear, 500);