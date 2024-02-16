// Funcție pentru a încărca proiectele
function loadProjects() {
    const email = sessionStorage.getItem('email'); // Obține emailul din sessionStorage
    if (!email) {
        console.error('No email found in sessionStorage.');
        return;
    }

    fetch('http://localhost:3000/projects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Email': email
        }
    })
        .then(response => response.json())
        .then(projects => {
            console.log(projects);
            const projectsSection = document.getElementById('projects');

            // Iterează prin fiecare proiect și creează elemente HTML
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `
                    <div class="project-thumbnail" onclick="goToProject(${project.id})">
                        <!-- Poți adăuga o imagine a proiectului aici, dacă este disponibilă -->
                    </div>
                    <div class="project-details">
                        <div class="project-container">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                        </div>
                    </div>
                    <div class="project-actions">
                        <a href="#" class="action-button">
                            <span class="icon">🗑️</span>
                            <span class="title" onclick="deleteItem(${project.id})">Delete</span>
                        </a>
                    </div>
                `;

                // Adaugă cardul de proiect în secțiune
                projectsSection.appendChild(projectCard);
            });

            const projectPlus = document.createElement('a');
            projectPlus.style.textDecoration = 'none';
            projectPlus.href = '/add';
            projectPlus.innerHTML = `
                <div class="project-card-plus" >
                    <p>+</p>
                </div >`;

            projectsSection.appendChild(projectPlus);
        })
        .catch(error => {
            console.log('Error loading projects:', error);
        });
}

function goToProject(project) {
    window.location.href = `/project?id=${project}`;
}

// Apel la încărcarea paginii
document.addEventListener('DOMContentLoaded', loadProjects);