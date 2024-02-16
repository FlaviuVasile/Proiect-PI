window.onload = function () {
    // Selectează formularul
    var form = document.querySelector('.add-sprint-form');

    // Adaugă un ascultător pentru evenimentul de trimitere
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var urlParams = new URLSearchParams(window.location.search);
        var id = urlParams.get('id');

        var formData = new FormData(form);

        if (id) {
            formData.append('id', id);
        }

        fetch(form.action, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                window.location.href = `http://localhost:3000/project?id=${id}`;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
}