document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = document.getElementById('loggedInUser');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Function to update navbar based on user login status
    function updateNavbar() {
        const token = sessionStorage.getItem('token');
        if (token) {
            loggedInUser.textContent = `Welcome, ${sessionStorage.getItem('username')}`;
            loggedInUser.style.display = 'block';
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
        } else {
            loggedInUser.style.display = 'none';
            loginLink.style.display = 'block';
            registerLink.style.display = 'block';
        }
    }

    // Event listener for login form submission
// Event listener for login form submission
// Event listener for login form submission
    async function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            console.log('Login response:', data); // Log the response data for debugging
            if (data.bSuccess === 1 && data.token) {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('username', username);
                window.location.href = '/game'; // Redirect to game page upon successful login
            } else {
                alert(data.sMsg || 'Login failed. Please try again.'); // Display error message
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }



    // Event listener for register form submission
    async function handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const email = document.getElementById('registerEmail').value;
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email })
            });
            const data = await response.json();
            if (data.user) {
                alert('Registration successful! You can now log in.');
                window.location.href = '/login';
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Event listeners for login and register form submissions
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);

    // Call updateNavbar on page load
    updateNavbar();
});
