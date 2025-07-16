const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const loginWrapper = document.getElementById('login-wrapper');
const registerWrapper = document.getElementById('register-wrapper');
showRegister.addEventListener('click', () => {
    loginWrapper.classList.remove('active');
    registerWrapper.classList.add('active');
});
showLogin.addEventListener('click', () => {
    registerWrapper.classList.remove('active');
    loginWrapper.classList.add('active');
});

// Funzione per pulire cookie JWT corrotti
function clearCorruptedJWT() {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Cookie JWT pulito");
}

// Funzione per logout completo
function logout() {
    // Pulisci cookie JWT
    clearCorruptedJWT();
    
    // Pulisci localStorage
    localStorage.removeItem('carrello');
    localStorage.removeItem('username'); // Rimuovi anche username
    
    // Rimuovi variabile globale username
    if (window.username) {
        window.username = null;
    }
    // Logout lato server
    fetch('/SleepingSmarttress/auth/logout', { method: 'POST' })
        .finally(() => {
            // Redirect alla home
            window.location.href = '/SleepingSmarttress/home/';
        });
}

// Gestione errori JWT automatica
function handleJWTError() {
    console.log("Token JWT non valido rilevato, eseguo logout automatico...");
    clearCorruptedJWT();
    alert("La tua sessione è scaduta. Effettua nuovamente il login.");
    window.location.href = '/SleepingSmarttress/home/';
}

// Gestione del form di login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('#login-wrapper form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.querySelector('#login-wrapper input[name="username"]').value;
            const password = document.querySelector('#login-wrapper input[name="password"]').value;
            
            // Rimuovi messaggi precedenti
            const oldMessage = document.querySelector('.login-message');
            if (oldMessage) oldMessage.remove();
            
            // Invia richiesta di login
            fetch('/SleepingSmarttress/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            })
            .then(response => response.json())
            .then(data => {
                // Crea elemento per il messaggio
                const messageDiv = document.createElement('div');
                messageDiv.className = 'login-message';
                messageDiv.style.marginTop = '10px';
                messageDiv.style.padding = '10px';
                messageDiv.style.borderRadius = '5px';
                messageDiv.style.textAlign = 'center';
                
                if (data.success) {
                    // Login riuscito
                    messageDiv.style.backgroundColor = '#d4edda';
                    messageDiv.style.color = '#155724';
                    messageDiv.style.border = '1px solid #c3e6cb';
                    messageDiv.textContent = data.message;
                    loginForm.appendChild(messageDiv);
                    sessionStorage.setItem('userAuthenticated', 'true');
                    // Sincronizza carrello e redirect
                    if (!syncLocalCartToServer(data.redirect)) {
                        setTimeout(() => { window.location.href = data.redirect; }, 1500);
                    }
                    return;
                } else {
                    // Login fallito
                    messageDiv.style.backgroundColor = '#f8d7da';
                    messageDiv.style.color = '#721c24';
                    messageDiv.style.border = '1px solid #f5c6cb';
                    messageDiv.textContent = data.error;
                    
                    // Aggiungi messaggio sotto il form
                    loginForm.appendChild(messageDiv);
                }
            })
            .catch(error => {
                console.error('Errore durante il login:', error);
                
                // Messaggio di errore generico
                const messageDiv = document.createElement('div');
                messageDiv.className = 'login-message';
                messageDiv.style.marginTop = '10px';
                messageDiv.style.padding = '10px';
                messageDiv.style.borderRadius = '5px';
                messageDiv.style.textAlign = 'center';
                messageDiv.style.backgroundColor = '#f8d7da';
                messageDiv.style.color = '#721c24';
                messageDiv.style.border = '1px solid #f5c6cb';
                messageDiv.textContent = 'Errore di connessione';
                
                loginForm.appendChild(messageDiv);
            });
        });
    }
});

// Funzione per mostrare la modale di benvenuto
function showWelcomeModal(nome, redirect) {
    // Crea l'overlay
    const overlay = document.createElement('div');
    overlay.className = 'welcome-modal-overlay';

    // Crea la modale
    const modal = document.createElement('div');
    modal.className = 'welcome-modal';
    modal.innerHTML = `
        <h2 style="font-family: 'Montserrat', sans-serif; font-size: 2rem; font-weight: 700; color: #2d3a4b;">Benvenuto ${nome}!</h2>
        <p style="font-family: 'Montserrat', sans-serif; font-size: 1.2rem; color: #2d3a4b;">Grazie per esserti registrato!<br>Effettua il login per iniziare ad acquistare su SleepingSmarttress</p>
        <button class="welcome-modal-btn">Vai al Login</button>
    `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Gestione click bottone
    modal.querySelector('.welcome-modal-btn').onclick = function() {
        window.location.href = '/SleepingSmarttress/home/auth/';
    };
}

// Funzione per sincronizzare il carrello locale col server
function syncLocalCartToServer(redirectUrl) {
    const localCart = localStorage.getItem('carrello');
    if (localCart && localCart !== '[]') {
        try {
            const fullCart = JSON.parse(localCart);
            const simplifiedCart = fullCart.map(item => ({ id: item.id, quantita: item.quantita }));
            fetch('/SleepingSmarttress/api/cart/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(simplifiedCart)
            })
            .then(() => {
                localStorage.removeItem('carrello');
                setTimeout(() => { window.location.href = redirectUrl; }, 500);
            });
            return true;
        } catch(e) { /* fallback sotto */ }
    }
    return false;
}

// Gestione del form di registrazione
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('#register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Rimuovi vecchi messaggi
            const oldError = registerForm.querySelector('.error-message');
            if (oldError) oldError.remove();

            const username = document.getElementById('register-username').value.trim();
            const nome = document.getElementById('register-nome').value.trim();
            const cognome = document.getElementById('register-cognome').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;

            // Regex email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // Username: almeno 4 caratteri, solo lettere/numeri/._-
            const usernameRegex = /^[a-zA-Z0-9._-]{4,}$/;

            let errorMsg = '';
            if (!usernameRegex.test(username)) {
                errorMsg = 'Username non valido (min 4 caratteri, solo lettere, numeri, . _ -)';
            } else if (!emailRegex.test(email)) {
                errorMsg = 'Email non valida';
            } else if (password.length < 8) {
                errorMsg = 'La password deve essere di almeno 8 caratteri';
            }
            if (errorMsg) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'error-message';
                messageDiv.style.backgroundColor = '#f8d7da';
                messageDiv.style.color = '#721c24';
                messageDiv.style.padding = '10px';
                messageDiv.style.borderRadius = '5px';
                messageDiv.style.marginTop = '10px';
                messageDiv.textContent = errorMsg;
                registerForm.appendChild(messageDiv);
                return;
            }

            const formData = new FormData(registerForm);
            fetch('/SleepingSmarttress/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showWelcomeModal(formData.get('nome'), data.redirect);
                } else {
                    // Mostra errore in una modale più piccola o in un messaggio inline
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'error-message';
                    messageDiv.style.backgroundColor = '#f8d7da';
                    messageDiv.style.color = '#721c24';
                    messageDiv.style.padding = '10px';
                    messageDiv.style.borderRadius = '5px';
                    messageDiv.style.marginTop = '10px';
                    messageDiv.textContent = data.error || 'Errore durante la registrazione';
                    registerForm.appendChild(messageDiv);
                }
            })
            .catch(error => {
                console.error('Errore:', error);
                const messageDiv = document.createElement('div');
                messageDiv.className = 'error-message';
                messageDiv.style.backgroundColor = '#f8d7da';
                messageDiv.style.color = '#721c24';
                messageDiv.style.padding = '10px';
                messageDiv.style.borderRadius = '5px';
                messageDiv.style.marginTop = '10px';
                messageDiv.textContent = 'Errore di connessione';
                registerForm.appendChild(messageDiv);
            });
        });
    }
});

// Espone funzioni globalmente
window.clearCorruptedJWT = clearCorruptedJWT;
window.logout = logout;
window.handleJWTError = handleJWTError;