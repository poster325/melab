document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-info');

    // Function to parse query parameters from the URL
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');
        for (let pair of pairs) {
            const [key, value] = pair.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
        return params;
    }

    // Function to group publications by year
    function groupByYear(publications) {
        return publications.reduce((acc, publication) => {
            const year = publication.year;
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(publication);
            return acc;
        }, {});
    }

    // Function to load member data based on the name parameter
    function loadMemberData(name, members) {
        const person = members[name];

        if (person) {
            // Build the HTML content
            let html = '';

            // Main info
            html += `<div class="main-info">`;

            // About section (Research Interest and Background only)
            html += `
                <div>
                    <h2>Research</h2>
                    <h4>Research Interest</h4>
                    <p class="research-theme">${person.ResearchTheme || 'No research theme provided.'}</p>
                    <h4>Background</h4>
                    <p class="research-theme">${person.Background || 'No background information provided.'}</p>
                </div>
            `;

            // Education section
            html += `
                <div class="education">
                    <h2>Education</h2>
            `;

            if (person.education) {
                if (person.education.bachelor) {
                    html += `<p>BS: ${person.education.bachelor.university || ''}</p>`;
                }
                if (person.education.master) {
                    html += `<p>MS: ${person.education.master.university || ''}</p>`;
                }
                if (person.education.phd) {
                    html += `<p>PhD: ${person.education.phd.university || ''}</p>`;
                }
            } else {
                html += `<p>No education information provided.</p>`;
            }

            html += `</div>`; // Close education div

            // Publications section
            html += `
                <div class="publications">
                    <h2>Publications</h2>
                    <div class="publications-list">
            `;

            if (person.hasPublished && person.publications && person.publications.length > 0) {
                const publicationsByYear = groupByYear(person.publications);
                const sortedYears = Object.keys(publicationsByYear).sort((a, b) => b - a);

                sortedYears.forEach(year => {
                    html += `<div class="year-group"><h3>${year}</h3>`;

                    publicationsByYear[year].forEach((publication, index) => {
                        html += `<div class="publication-item">`;

                        html += `<h4><a href="${publication.link || '#'}">${publication.title}</a></h4>`;

                        // Authors
                        html += `<p>`;
                        publication.authors.forEach((author, idx) => {
                            const isPerson = author.includes(person.name);
                            html += `<span style="${isPerson ? 'font-weight: bold; color: black;' : ''}">${author}</span>`;
                            if (idx < publication.authors.length -1) {
                                html += ', ';
                            }
                        });
                        html += `</p>`;

                        // Publication details
                        html += `<p>`;
                        html += `${publication.journal || 'N/A'}`;
                        if (publication.volume) html += `, Volume: ${publication.volume}`;
                        if (publication.issue) html += `, Issue: ${publication.issue}`;
                        if (publication.pages) html += `, Pages: ${publication.pages}`;
                        if (publication.article_number) html += `, Article Number: ${publication.article_number}`;
                        html += `</p>`;

                        html += `</div>`; // Close publication-item div
                    });

                    html += `</div>`; // Close year-group div
                });
            } else {
                html += `<p>No publications available.</p>`;
            }

            html += `</div>`; // Close publications-list div
            html += `</div>`; // Close publications div

            html += `</div>`; // Close main-info div

            // Insert the HTML content into mainContent
            mainContent.innerHTML = html;

        } else {
            mainContent.innerHTML = '<p>No member found.</p>';
        }
    }

    // Fetch members data and display the member
    fetch('./js/members.json')
        .then(response => response.json())
        .then(members => {
            const params = getQueryParams();
            const name = params['name'];

            if (name) {
                loadMemberData(name, members);
            } else {
                mainContent.innerHTML = '<p>No member specified.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading members data:', error);
            mainContent.innerHTML = '<p>Error loading members data.</p>';
        });
});
