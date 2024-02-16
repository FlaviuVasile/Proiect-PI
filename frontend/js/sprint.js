


function fetchSprintDetails(sprintId) {
    console.log(sprintId);
    fetch(`/getSprint/${sprintId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Sprintul nu a fost găsit.');
            }
            return response.json();
        })
        .then(sprintData => {
            console.log(sprintData);
            updateSprintDetailsInHtml(sprintData);
        })
        .catch(error => {
            console.error('Eroare la obținerea datelor sprintului:', error);
        });
}
function updateSprintDetailsInHtml(sprint) {
    // Actualizează fiecare element în funcție de cheia corespunzătoare din obiectul sprint
    const updateElementText = (elementId, text) => {
        const container = document.getElementById(elementId);
        if (container) {
            // Find the span inside the container
            const span = container.querySelector('span');
            if (span) span.textContent = text;
        }
    }


    updateElementText('id', sprint.id);
    updateElementText('sprint_name', sprint.sprint_name);
    updateElementText('start_date', `${sprint.start_date}`);
    updateElementText('end_date', `${sprint.end_date}`);
    updateElementText('goal', `${sprint.goal}`);
    updateElementText('status', `${sprint.status}`);
    updateElementText('indicator', `${sprint.indicator}`);
    updateElementText('hours_worked', `${sprint.hours_worked}`);
    updateElementText('capacity', `${sprint.capacity}`);
    updateElementText('story_points_completed', `${sprint.story_points_completed}`);
    updateElementText('total_story_points', `${sprint.total_story_points}`);

    // Presupunem că ai o variabilă `sprint` care conține datele sprintului
    const sprintData = {
        sprintName: sprint.sprint_name,
        startDate: new Date(sprint.start_date),
        endDate: new Date(sprint.end_date),
        goal: sprint.goal,
        status: sprint.status,
        indicator: sprint.indicator,
        hoursWorked: sprint.hours_worked,
        capacity: sprint.capacity,
        storyPointsCompleted: sprint.story_points_completed,
        totalStoryPoints: sprint.total_story_points
    };

    // Calculăm numărul de zile din sprint
    const dayDifference = (sprintData.endDate - sprintData.startDate) / (1000 * 3600 * 24);
    const labels = [];
    for (let i = 0; i <= dayDifference; i++) {
        let date = new Date(sprintData.startDate.getTime());
        date.setDate(date.getDate() + i);
        labels.push(date.toLocaleDateString());
    }

    const idealLineData = labels.map((_, i) => sprintData.totalStoryPoints - (sprintData.totalStoryPoints / dayDifference) * i);
    const actualLineData = []; // Aici vei adăuga datele tale reale

    // Datele pentru grafic
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Linia Ideală',
                data: idealLineData,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                borderDash: [5, 5], // Linie punctată pentru linia ideală
                tension: 0.1
            },
            {
                label: 'Linia Actuală',
                data: actualLineData,
                fill: false,
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
            }
        ]
    };
    // Configurația graficului
    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    // Crearea graficului
    const myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    // Calculăm story points-urile rămase
    const remainingPoints = sprintData.totalStoryPoints - sprintData.storyPointsCompleted;

    // Datele pentru Pie Chart-ul de completare a sprintului
    const completionChartData = {
        labels: ['Puncte Completate', 'Puncte Rămase'],
        datasets: [{
            data: [sprintData.storyPointsCompleted, remainingPoints],
            backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 205, 86)']
        }]
    };

    // Configurația pentru Pie Chart-ul de completare a sprintului
    const completionChartConfig = {
        type: 'pie',
        data: completionChartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Procentajul de Completare al Sprintului'
                }
            }
        },
    };

    // Verificăm dacă elementul canvas pentru Pie Chart există înainte de a crea graficul
    const sprintCompletionCanvas = document.getElementById('sprintCompletionChartCanvas');
    if (sprintCompletionCanvas) {
        const sprintCompletionChart = new Chart(sprintCompletionCanvas, completionChartConfig);
    }
    updateSprintCapacityUtilization(sprintData);
}
function updateSprintCapacityUtilization(sprint) {
    const sprintCapacityData = {
        hoursWorked: sprint.hoursWorked,
        capacity: sprint.capacity
    };
    console.log(sprintCapacityData);
    // Calculăm orele neutilizate
    const unusedHours = sprintCapacityData.capacity - sprintCapacityData.hoursWorked;

    // Datele pentru Pie Chart-ul de utilizare a capacității
    const capacityUtilizationChartData = {
        labels: ['Ore Lucrate', 'Capacitate Neutilizată'],
        datasets: [{
            data: [sprintCapacityData.hoursWorked, unusedHours],
            backgroundColor: ['rgb(153, 102, 255)', 'rgb(255, 159, 64)']
        }]
    };

    // Configurația pentru Pie Chart-ul de utilizare a capacității
    const capacityUtilizationChartConfig = {
        type: 'pie',
        data: capacityUtilizationChartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Procentajul de Utilizare a Capacității Sprintului'
                }
            }
        },
    };

    // Crearea Pie Chart-ului de utilizare a capacității
    const capacityUtilizationChart = new Chart(
        document.getElementById('capacityUtilizationChartCanvas'),
        capacityUtilizationChartConfig
    );
}

// Presupunem că ai un obiect 'sprint' cu datele necesare
// Exemplu: updateSprintCapacityUtilization(sprint);


function saveDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    // Replace 'sprintId' with the actual sprint ID you want to use
    const sprintId = urlParams.get('id');

    // Collecting data from each editable span
    const sprintDetails = {
        sprint_name: document.querySelector('#sprint_name span').textContent,
        start_date: document.querySelector('#start_date span').textContent,
        end_date: document.querySelector('#end_date span').textContent,
        goal: document.querySelector('#goal span').textContent,
        status: document.querySelector('#status span').textContent,
        indicator: document.querySelector('#indicator span').textContent,
        hours_worked: document.querySelector('#hours_worked span').textContent,
        capacity: document.querySelector('#capacity span').textContent,
        story_points_completed: document.querySelector('#story_points_completed span').textContent,
        total_story_points: document.querySelector('#total_story_points span').textContent
    };

    console.log(sprintDetails);

    // Sending the data to the backend
    fetch(`/modifySprint/${sprintId}`, {
        method: 'POST', // or 'PUT', depending on your backend requirement
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sprintDetails)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Handle success response
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors here
        });
}


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sprintId = urlParams.get('id'); // Extrage ID-ul sprintului din URL

    if (!sprintId) {
        console.error('No sprint ID found in URL.');
        return;
    }

    fetchSprintDetails(sprintId);
});
