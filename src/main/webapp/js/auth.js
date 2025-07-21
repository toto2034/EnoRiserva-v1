const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const loginWrapper = document.getElementById('login-wrapper');
const registerWrapper = document.getElementById('register-wrapper');

if (showRegister && showLogin && loginWrapper && registerWrapper) {
    showRegister.addEventListener('click', () => {
        loginWrapper.classList.remove('active');
        registerWrapper.classList.add('active');
    });
    showLogin.addEventListener('click', () => {
        registerWrapper.classList.remove('active');
        loginWrapper.classList.add('active');
    });
}

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
    localStorage.removeItem('username');

    // Pulisci sessionStorage
    sessionStorage.removeItem('userAuthenticated');

    // Rimuovi variabile globale username
    if (window.username) {
        window.username = null;
    }

    // Logout lato server
    fetch('/EnoRiserva-v1/auth/logout', { method: 'POST' })
        .finally(() => {
            // Redirect alla home
            window.location.href = '/EnoRiserva-v1/home/';
        });
}

// Gestione errori JWT automatica
function handleJWTError() {
    console.log("Token JWT non valido rilevato, eseguo logout automatico...");
    clearCorruptedJWT();
    sessionStorage.removeItem('userAuthenticated');
    alert("La tua sessione è scaduta. Effettua nuovamente il login.");
    window.location.href = '/EnoRiserva-v1/home/';
}

// Funzione per verificare se l'utente è autenticato
function isUserAuthenticated() {
    // PRIORITÀ 1: Controlla variabile JSP (se esiste)
    if (typeof window.userLoggedIn !== 'undefined') {
        const jspAuth = window.userLoggedIn === true || window.userLoggedIn === 'true';
        console.log('Auth check - JSP userLoggedIn:', window.userLoggedIn, 'Parsed:', jspAuth);
        if (jspAuth) return true;
    }

    // PRIORITÀ 2: Verifica sessionStorage
    const sessionAuth = sessionStorage.getItem('userAuthenticated') === 'true';

    // PRIORITÀ 3: Verifica se esiste il cookie JWT
    const hasJWTCookie = document.cookie
        .split(';')
        .some(cookie => cookie.trim().startsWith('jwt=') && cookie.trim().length > 4);

    console.log('Auth check - JSP:', typeof window.userLoggedIn !== 'undefined' ? window.userLoggedIn : 'non definito',
        'Session:', sessionAuth, 'JWT Cookie:', hasJWTCookie);

    return sessionAuth && hasJWTCookie;
}

// Funzione per verificare l'autenticazione lato server
async function verifyServerAuthentication() {
    try {
        const response = await fetch('/EnoRiserva-v1/auth/verify', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.authenticated === true;
        }
        return false;
    } catch (error) {
        console.error('Errore verifica autenticazione server:', error);
        return false;
    }
}

// Funzione per sincronizzare lo stato di autenticazione
async function syncAuthenticationState() {
    const isLocalAuth = isUserAuthenticated();
    const isServerAuth = await verifyServerAuthentication();

    console.log('Sync auth - Local:', isLocalAuth, 'Server:', isServerAuth);

    if (isServerAuth && !isLocalAuth) {
        // Server dice che siamo autenticati ma localmente no
        sessionStorage.setItem('userAuthenticated', 'true');
        console.log('Sincronizzato stato auth: ora autenticato localmente');
        return true;
    } else if (!isServerAuth && isLocalAuth) {
        // Localmente siamo autenticati ma server dice di no
        console.log('Token scaduto o non valido, pulisco stato locale');
        sessionStorage.removeItem('userAuthenticated');
        return false;
    }

    return isServerAuth;
}

// Funzione per controllare l'autenticazione nel carrello
async function checkAuthenticationForCart() {
    console.log('Controllo autenticazione per carrello...');

    // Prima verifica locale veloce (include JSP)
    const isLocalAuth = isUserAuthenticated();
    console.log('Risultato verifica locale:', isLocalAuth);

    if (!isLocalAuth) {
        console.log('Utente non autenticato localmente');
        return false;
    }

    // Se JSP dice che siamo autenticati, fidati (evita chiamata server non necessaria)
    if (typeof window.userLoggedIn !== 'undefined' &&
        (window.userLoggedIn === true || window.userLoggedIn === 'true')) {
        console.log('Autenticazione confermata da JSP');
        return true;
    }

    // Altrimenti verifica con il server
    try {
        const isAuthenticated = await syncAuthenticationState();

        if (!isAuthenticated) {
            console.log('Autenticazione server fallita');
            return false;
        }

        console.log('Utente autenticato correttamente');
        return true;
    } catch (error) {
        console.error('Errore durante verifica autenticazione:', error);
        // Se c'è un errore ma JSP non è definito, assumiamo non autenticato
        return false;
    }
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
            fetch('/EnoRiserva-v1/auth/login', {
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

                        // Imposta stato di autenticazione
                        sessionStorage.setItem('userAuthenticated', 'true');
                        if (data.username) {
                            window.username = data.username;
                        }

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
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;

    // Crea la modale
    const modal = document.createElement('div');
    modal.className = 'welcome-modal';
    modal.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    modal.innerHTML = `
        <h2 style="font-family: 'Montserrat', sans-serif; font-size: 2rem; font-weight: 700; color: #2d3a4b; margin-bottom: 15px;">Benvenuto ${nome}!</h2>
        <p style="font-family: 'Montserrat', sans-serif; font-size: 1.2rem; color: #2d3a4b; margin-bottom: 25px;">Grazie per esserti registrato!<br>Effettua il login per iniziare ad acquistare su EnoRiserva</p>
        <button class="welcome-modal-btn" style="background: #007bff; color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-size: 16px;">Vai al Login</button>
    `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Gestione click bottone
    modal.querySelector('.welcome-modal-btn').onclick = function() {
        document.body.removeChild(overlay);
        window.location.href = '/EnoRiserva-v1/home/auth/';
    };

    // Chiudi cliccando fuori
    overlay.onclick = function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            window.location.href = '/EnoRiserva-v1/home/auth/';
        }
    };
}

// Funzione per sincronizzare il carrello locale col server
function syncLocalCartToServer(redirectUrl) {
    const localCart = localStorage.getItem('carrello');
    if (localCart && localCart !== '[]') {
        try {
            const fullCart = JSON.parse(localCart);
            const simplifiedCart = fullCart.map(item => ({ id: item.id, quantita: item.quantita }));
            fetch('/EnoRiserva-v1/api/cart/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(simplifiedCart)
            })
                .then(() => {
                    localStorage.removeItem('carrello');
                    setTimeout(() => { window.location.href = redirectUrl; }, 500);
                })
                .catch(error => {
                    console.error('Errore sync carrello:', error);
                    setTimeout(() => { window.location.href = redirectUrl; }, 500);
                });
            return true;
        } catch(e) {
            console.error('Errore parsing carrello:', e);
        }
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
            fetch('/EnoRiserva-v1/auth/register', {
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
                        // Mostra errore
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

    // NUOVO: Controllo autenticazione per pagine carrello/checkout
    if (window.location.pathname.includes('/carrello') ||
        window.location.pathname.includes('/checkout') ||
        document.querySelector('.cart-page, #cart-container, .checkout-container')) {

        console.log('Rilevata pagina carrello/checkout, controllo autenticazione...');

        checkAuthenticationForCart().then(isAuthenticated => {
            if (!isAuthenticated) {
                // Nascondi pulsanti di checkout
                const checkoutButtons = document.querySelectorAll(
                    '.checkout-btn, .order-btn, #checkout-button, [onclick*="checkout"], [onclick*="ordine"]'
                );
                checkoutButtons.forEach(btn => {
                    btn.style.display = 'none';
                });

                // Mostra messaggio di login richiesto
                const cartContainer = document.querySelector('#cart-container, .cart-page, .checkout-container') || document.body;

                const loginMessage = document.createElement('div');
                loginMessage.className = 'auth-required-message';
                loginMessage.style.cssText = `
                    background-color: #fff3cd;
                    color: #856404;
                    border: 1px solid #ffeaa7;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    text-align: center;
                    font-weight: 500;
                    font-family: 'Montserrat', sans-serif;
                `;
                loginMessage.innerHTML = `
                    <p style="margin: 0 0 15px 0; font-size: 18px;">⚠️ Devi effettuare il login per completare l'ordine</p>
                    <button onclick="window.location.href='/EnoRiserva-v1/home/auth/'" 
                            style="background: #007bff; color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: 600;">
                        Vai al Login
                    </button>
                `;

                // Inserisci il messaggio in cima al contenitore
                cartContainer.insertBefore(loginMessage, cartContainer.firstChild);
            }
        }).catch(error => {
            console.error('Errore controllo autenticazione carrello:', error);
        });
    }
});

// Espone funzioni globalmente
window.clearCorruptedJWT = clearCorruptedJWT;
window.logout = logout;
window.handleJWTError = handleJWTError;
window.isUserAuthenticated = isUserAuthenticated;
window.checkAuthenticationForCart = checkAuthenticationForCart;
window.syncAuthenticationState = syncAuthenticationState;