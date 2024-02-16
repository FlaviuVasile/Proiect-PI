function deleteItem(item) {
    const url = `http://localhost:3000/delete/${item}`;
    const email = sessionStorage.getItem('email');

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Email': email
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const projectsSection = document.getElementById('projects');
            projectsSection.innerHTML = '';
            loadProjects();
        })
        .catch(error => {
            console.log('Error loading projects:', error);
        });
}