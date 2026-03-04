document.addEventListener('DOMContentLoaded', () => {
    // Redirect to dashboard if already logged in
    if (api.isLoggedIn()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const submitBtn = document.getElementById('submit-btn');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!email || !password) {
                showError('Por favor, completa todos los campos.');
                return;
            }

            // UI Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Conectando...';
            errorMessage.style.display = 'none';

            try {
                await api.login(email, password);
                // Redirect on success
                window.location.href = 'dashboard.html';
            } catch (error) {
                showError(error.message || 'Credenciales incorrectas. Inténtalo de nuevo.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Iniciar Sesión';
            }
        });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        // Add a small shake animation to draw attention
        errorMessage.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], { duration: 400, iterations: 1 });
    }
});
