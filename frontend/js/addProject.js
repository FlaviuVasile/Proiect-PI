async function adaugaProiect() {
    const titlu = document.getElementById('titlu').value;
    const descriere = document.getElementById('descriere').value;

    const url = 'http://localhost:3000/add';
    const email = sessionStorage.getItem('email');

    const data = { titlu, descriere, email };

    try {
        const response = await fetch(url, {
            method: 'POST', // Specificarea metodei HTTP POST
            headers: {
                'Content-Type': 'application/json', // Specificarea faptului că trimitem date JSON
            },
            body: JSON.stringify(data) // Convertirea datelor într-un string JSON
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Proiect adaugat cu succes:', responseData);
            document.getElementById("header-label").textContent = "Ai adaugat acest proiect cu succes!"
        } else {
            console.error('Eroare la adaugarea proiectului:', response.status);
        }
    } catch (error) {
        console.error('Eroare la trimiterea datelor:', error);
    }
}