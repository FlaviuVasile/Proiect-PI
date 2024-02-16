async function loginUser() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log(data);

        // Verifică dacă login-ul a avut succes și dacă un token a fost returnat
        if (response.ok && data.email) {
            // Stocarea tokenului în sessionStorage
            sessionStorage.setItem('email', data.email);
            window.location = '/dashboard';
            return { success: true, message: 'Login successful.' };
        } else {
            // Tratarea cazurilor în care login-ul nu reușește
            return { success: false, message: data.message || 'Login failed.' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'An error occurred during login.' };
    }
}
