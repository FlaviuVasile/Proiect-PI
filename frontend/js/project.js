
function loadSprints() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); // Extrage ID-ul din URL

    if (!id) {
        console.error('No ID found in URL.');
        return;
    }

    const email = sessionStorage.getItem('email');
    if (!email) {
        console.error('No email found in sessionStorage.');
        return;
    }

    fetch('http://localhost:3000/sprints', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ID': id,
            'Email': email
        }
    })
        .then(response => response.json())
        .then(sprints => {
            const sprintsSection = document.querySelector('.sprint-stats');

            // Iterează prin fiecare sprint și creează elemente HTML
            sprints.forEach(sprint => {
                const sprintCard = document.createElement('div');
                sprintCard.className = 'sprint-card';
                sprintCard.innerHTML = `
                    <div onclick="goToSprint(${sprint.id})" class="sprint-details" style="width: 25rem; ">
                    <div style="    display: flex;
                    justify-content: space-between;
                    align-items: center;" class="sprint-container">
                    <div>
                        <h3>${sprint.sprint_name}</h3>
                        <p>Goal: ${sprint.goal}</p>
                        </div>
                        <div>
                        <p>Start Date: ${sprint.start_date}</p>
                        <p>End Date: ${sprint.end_date}</p>
                        </div>
                    </div>
                </div>
            `;

                sprintsSection.appendChild(sprintCard);
            });
        })
        .catch(error => {
            console.log('Error loading sprints:', error);
        });
}

function goToSprint(sprintId) {
    window.location.href = `/sprint?id=${sprintId}`;
}

document.addEventListener('DOMContentLoaded', loadSprints);


window.onload = function () {
    const projectId = getProjectIdFromUrl();
    if (projectId) {
        fetchProjectName(projectId);
    } else {
        console.log('ID-ul proiectului nu este specificat în URL.');
    }
    // Presupunând că ai ID-ul proiectului disponibil
    fetchSprintStats(projectId);
    if (document.getElementsByClassName('add-sprint').length > 0) {
        document.getElementsByClassName('add-sprint')[0].addEventListener('click', () => {
            window.location = '/addSprint?id=' + projectId;
        });
    }
};

function getProjectIdFromUrl() {
    // Presupunând că ID-ul proiectului este transmis ca un parametru de query, de exemplu: ?projectId=123
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}


function fetchProjectName(projectId) {
    console.log(projectId);
    fetch(`/getProject/${projectId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Proiectul nu a fost găsit.');
            }
            return response.json();
        })
        .then(projectData => {
            console.log(projectData);
            updateProjectNameInHtml(projectData[0].title);
        })
        .catch(error => {
            console.error('Eroare la obținerea datelor proiectului:', error);
        });
}

function updateProjectNameInHtml(projectName) {
    // Actualizează toate locurile unde apare `{PROJECT NAME}` cu numele proiectului
    document.querySelectorAll('.projectTitle').forEach(element => {
        element.textContent = projectName;
    });
}

function fetchSprintStats(projectId) {
    fetch(`/getSprint/${projectId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la preluarea datelor.');
            }
            return response.json();
        })
        .then(data => {
            updateSprintStats(data);
        })
        .catch(error => {
            console.error('Eroare:', error);
        });
}
function updateSprintStats(data) {
    const sprintStatsSection = document.querySelector('.sprint-stats');
    if (data == 'error: "no sprints"')
        sprintStatsSection.innerHTML = "Nu s-au gasit sprint-uri in acest proiect, adauga un sprint nou";
}
