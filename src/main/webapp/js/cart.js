// Cart.js - Sistema carrello completo con gestione localStorage e server
if (typeof window !== 'undefined') {
    // Inizializza carrello localStorage
    let carrello = [];

    try {
        const savedCart = localStorage.getItem('carrello');
        if (savedCart) {
            carrello = JSON.parse(savedCart);
            console.log("Carrello recuperato dal localStorage:", carrello);
        }
    } catch (e) {
        console.error("Errore nel recupero del carrello dal localStorage:", e);
    }

    /**
     * Aggiunge un prodotto al carrello
     * Se utente loggato: aggiunge al database
     * Se utente non loggato: aggiunge al localStorage
     */
    function addToCart(product) {
        if (!product || !product.id) {
            console.error("Prodotto non valido:", product);
            return false;
        }

        // Controlla se l'utente è loggato
        const isAuth = (typeof userLoggedIn !== 'undefined' && 
                       (userLoggedIn === 'true' || userLoggedIn === true || 
                        userLoggedIn === 'True' || userLoggedIn === 'TRUE' || 
                        userLoggedIn === 'on' || userLoggedIn === '1'));

        if (isAuth) {
            // Utente loggato: aggiungi al database
            console.log("Utente loggato: aggiungo al database");
            return addToCartDatabase(product);
        } else {
            // Utente non loggato: aggiungi al localStorage
            console.log("Utente non loggato: aggiungo al localStorage");
            return addToCartLocalStorage(product);
        }
    }

    /**
     * Aggiunge un prodotto al carrello nel database
     */
    function addToCartDatabase(product) {
        const quantity = product.quantita || 1;
        
        fetch('/EnoRiserva-v1/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            credentials: 'include',
            body: `productId=${product.id}&quantity=${quantity}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Prodotto aggiunto al database con successo');
                aggiornaContatoreCarro();
                aggiornaStatoCarrelloButtons();
                mostraNotifica('Prodotto aggiunto al carrello!');
            } else {
                console.error('Errore nell\'aggiunta al database:', data.error);
                mostraNotifica('Errore nell\'aggiunta al carrello', 'error');
            }
        })
        .catch(error => {
            console.error('Errore nella chiamata API:', error);
            mostraNotifica('Errore nell\'aggiunta al carrello', 'error');
        });

        return true;
    }

    /**
     * Aggiunge un prodotto al carrello nel localStorage
     */
    function addToCartLocalStorage(product) {
        const esistente = carrello.find(item => item.id === product.id);

        if (esistente) {
            esistente.quantita += product.quantita || 1;
        } else {
            const nuovoProdotto = {
                id: product.id,
                nome: product.nome || "Prodotto senza nome",
                descrizione: product.descrizione || "Descrizione non disponibile",
                prezzo: product.prezzo || 0,
                quantita: product.quantita || 1,
                immagine: product.immagine // URL dell'immagine dal database
            };
            console.log('DEBUG - Aggiunto prodotto al localStorage:', nuovoProdotto);
            carrello.push(nuovoProdotto);
        }

        try {
            localStorage.setItem('carrello', JSON.stringify(carrello));
        } catch (e) {
            console.error("Errore nel salvataggio del carrello nel localStorage:", e);
        }

        aggiornaContatoreCarro();
        aggiornaStatoCarrelloButtons();
        mostraNotifica('Prodotto aggiunto al carrello!');
        return true;
    }

    /**
     * Rimuove un prodotto dal carrello localStorage
     */
    function removeFromCart(productId) {
        carrello = carrello.filter(item => item.id !== productId);
        try {
            localStorage.setItem('carrello', JSON.stringify(carrello));
        } catch (e) {
            console.error("Errore nel salvataggio del carrello nel localStorage:", e);
        }
        aggiornaContatoreCarro();
        aggiornaStatoCarrelloButtons();
        return true;
    }

    /**
     * Aggiorna quantità prodotto nel carrello localStorage
     */
    function updateQuantity(productId, change) {
        const item = carrello.find(item => item.id === productId);
        if (item) {
            const newQuantity = Math.max(1, item.quantita + change);
            if (newQuantity !== item.quantita) {
                item.quantita = newQuantity;
                try {
                    localStorage.setItem('carrello', JSON.stringify(carrello));
                } catch (e) {
                    console.error("Errore nel salvataggio del carrello nel localStorage:", e);
                }
                aggiornaContatoreCarro();
            }
        }
        return true;
    }

    /**
     * Aggiorna contatore carrello nell'header
     */
    function aggiornaContatoreCarro() {
        const contatore = document.querySelector('.cart-counter') || document.getElementById('cart-counter');
        if (!contatore) return;

        // Controlla se l'utente è loggato
        const isAuth = (typeof userLoggedIn !== 'undefined' && 
                       (userLoggedIn === 'true' || userLoggedIn === true || 
                        userLoggedIn === 'True' || userLoggedIn === 'TRUE' || 
                        userLoggedIn === 'on' || userLoggedIn === '1'));

        if (isAuth) {
            // Utente loggato: carica contatore dal database
            fetch('/EnoRiserva-v1/api/cart/get', {
                method: 'GET',
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    // Se errore, usa localStorage
                    const totalItems = carrello.reduce((sum, item) => sum + item.quantita, 0);
                    contatore.textContent = totalItems;
                    contatore.style.display = totalItems > 0 ? 'block' : 'none';
                } else {
                    // Usa dati dal database
                    const totalItems = data.reduce((sum, item) => sum + item.quantita, 0);
                    contatore.textContent = totalItems;
                    contatore.style.display = totalItems > 0 ? 'block' : 'none';
                }
            })
            .catch(() => {
                // In caso di errore, usa localStorage
                const totalItems = carrello.reduce((sum, item) => sum + item.quantita, 0);
                contatore.textContent = totalItems;
                contatore.style.display = totalItems > 0 ? 'block' : 'none';
            });
        } else {
            // Utente non loggato: usa localStorage
            const totalItems = carrello.reduce((sum, item) => sum + item.quantita, 0);
            contatore.textContent = totalItems;
            contatore.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    /**
     * Mostra notifica visiva
     */
    function mostraNotifica(messaggio, tipo = 'success') {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = messaggio;
        
        // Aggiungi classe per il tipo di notifica
        if (tipo === 'error') {
            notification.style.backgroundColor = '#ffebee';
            notification.style.color = '#c62828';
            notification.style.border = '1px solid #ef5350';
        } else if (tipo === 'warning') {
            notification.style.backgroundColor = '#fff3e0';
            notification.style.color = '#ef6c00';
            notification.style.border = '1px solid #ff9800';
        } else {
            // success (default)
            notification.style.backgroundColor = '#e8f5e8';
            notification.style.color = '#2e7d32';
            notification.style.border = '1px solid #4caf50';
        }
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    /**
     * Controlla se un prodotto è nel carrello
     * Per utenti loggati controlla nel database, per non loggati nel localStorage
     */
    function isInCart(productId) {
        // Controlla se l'utente è loggato
        const isAuth = (typeof userLoggedIn !== 'undefined' && 
                       (userLoggedIn === 'true' || userLoggedIn === true || 
                        userLoggedIn === 'True' || userLoggedIn === 'TRUE' || 
                        userLoggedIn === 'on' || userLoggedIn === '1'));

        if (isAuth) {
            // Per utenti loggati, controlla nel database
            // Questa funzione è sincrona, quindi per ora usa localStorage come fallback
            // In futuro si potrebbe implementare una cache locale del carrello del database
            return carrello.some(item => item.id === productId);
        } else {
            // Per utenti non loggati, controlla nel localStorage
            return carrello.some(item => item.id === productId);
        }
    }

    /**
     * Aggiorna lo stato visivo dei bottoni carrello
     */
    function aggiornaStatoCarrelloButtons() {
        const cartButtons = document.querySelectorAll('.cart-btn');
        if (cartButtons.length === 0) return;

        // Controlla se l'utente è loggato
        const isAuth = (typeof userLoggedIn !== 'undefined' && 
                       (userLoggedIn === 'true' || userLoggedIn === true || 
                        userLoggedIn === 'True' || userLoggedIn === 'TRUE' || 
                        userLoggedIn === 'on' || userLoggedIn === '1'));

        if (isAuth) {
            // Utente loggato: controlla nel database
            fetch('/EnoRiserva-v1/api/cart/get', {
                method: 'GET',
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    // Se errore, usa localStorage
                    updateCartButtonsFromLocalStorage(cartButtons);
                } else {
                    // Usa dati dal database
                    updateCartButtonsFromDatabase(cartButtons, data);
                }
            })
            .catch(() => {
                // In caso di errore, usa localStorage
                updateCartButtonsFromLocalStorage(cartButtons);
            });
        } else {
            // Utente non loggato: usa localStorage
            updateCartButtonsFromLocalStorage(cartButtons);
        }
    }

    /**
     * Aggiorna i bottoni carrello usando i dati del localStorage
     */
    function updateCartButtonsFromLocalStorage(cartButtons) {
        cartButtons.forEach(btn => {
            const productId = btn.getAttribute('data-product-id');
            if (productId && isInCart(parseInt(productId))) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-shopping-cart" style="color: #4CAF50;"></i>';
                btn.title = 'Prodotto già nel carrello';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
                btn.title = 'Aggiungi al carrello';
            }
        });
    }

    /**
     * Aggiorna i bottoni carrello usando i dati del database
     */
    function updateCartButtonsFromDatabase(cartButtons, serverCart) {
        const cartProductIds = serverCart.map(item => item.id);
        
        cartButtons.forEach(btn => {
            const productId = btn.getAttribute('data-product-id');
            if (productId && cartProductIds.includes(parseInt(productId))) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-shopping-cart" style="color: #4CAF50;"></i>';
                btn.title = 'Prodotto già nel carrello';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
                btn.title = 'Aggiungi al carrello';
            }
        });
    }

    // Espone funzioni globalmente
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateQuantity = updateQuantity;
    window.isInCart = isInCart;
    window.aggiornaStatoCarrelloButtons = aggiornaStatoCarrelloButtons;
    window.carrello = carrello;

    // Inizializza contatore all'avvio
    document.addEventListener('DOMContentLoaded', function () {
        aggiornaContatoreCarro();
        aggiornaStatoCarrelloButtons();
    });
}

// === SISTEMA CARRELLO PAGINA DEDICATA ===

document.addEventListener('DOMContentLoaded', function () {
    renderCart();
});

// Renderizza carrello principale
function renderCart() {
    const cartContentElement = document.getElementById('cart-content');
    if (!cartContentElement) return;

    // Controllo autenticazione
    const isAuth = (typeof userLoggedIn !== 'undefined' && 
                   (userLoggedIn === 'true' || userLoggedIn === true || 
                    userLoggedIn === 'True' || userLoggedIn === 'TRUE' || 
                    userLoggedIn === 'on' || userLoggedIn === '1'));
    
    if (isAuth) {
        // Utente autenticato: carrello SOLO su database
        loadCartFromServer(cartContentElement);
    } else {
        // Utente non autenticato: carrello solo localStorage
        renderLocalCart(cartContentElement);
    }
}

// Carica carrello dal database
function loadCartFromServer(cartContentElement) {
    // Sincronizza localStorage -> database solo al login
    const localCart = localStorage.getItem('carrello');
    if (localCart && localCart !== '[]') {
        syncLocalCartToServer().then(() => {
            localStorage.removeItem('carrello');
            actuallyLoadCartFromServer(cartContentElement);
        }).catch(() => {
            actuallyLoadCartFromServer(cartContentElement);
        });
    } else {
        actuallyLoadCartFromServer(cartContentElement);
    }
}

function syncLocalCartToServer() {
    const localCart = localStorage.getItem('carrello');
    if (!localCart || localCart === '[]') {
        return Promise.resolve();
    }
    const fullCart = JSON.parse(localCart);
    const cartData = fullCart.map(item => ({
        id: item.id,
        quantita: item.quantita
    }));
    const cartJson = JSON.stringify(cartData);
    return fetch('/EnoRiserva-v1/api/cart/sync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: cartJson
    }).then(response => response.json());
}

function actuallyLoadCartFromServer(cartContentElement) {
    fetch('/EnoRiserva-v1/api/cart/get', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            renderLocalCart(cartContentElement);
            return;
        }
        renderServerCart(data, cartContentElement);
    })
    .catch(() => {
        renderLocalCart(cartContentElement);
    });
}

function renderServerCart(serverCart, cartContentElement) {
    if (!serverCart || serverCart.length === 0) {
        cartContentElement.innerHTML = `
            <div class="cart-empty">
                <h2>Il tuo carrello &egrave; vuoto</h2>
                <p>Aggiungi alcuni prodotti per iniziare!</p>
                <a href="../" class="continue-shopping">Continua lo shopping</a>
                <div style="margin-top: 20px; padding: 10px; background: #e8f5e8; border-radius: 5px;">
                    <strong>&#10004; Sei autenticato</strong> - Il carrello &egrave; sincronizzato con il database
                </div>
            </div>
        `;
        return;
    }
    const totale = serverCart.reduce((sum, item) => sum + (item.prezzo * item.quantita), 0);
    const numArticoli = serverCart.reduce((sum, item) => sum + item.quantita, 0);
    
    // Calcola spedizione: gratuita sopra 99, altrimenti 4.90€
    const spedizione = totale >= 99 ? 0 : 4.90;
    const totaleConSpedizione = totale + spedizione;
    
    const articoliHTML = serverCart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.immagine}" alt="${item.nome}" onerror="this.src='../../images/product-placeholder.jpg'">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.nome}</div>
                <div class="cart-item-desc">${item.descrizione}</div>
            </div>
            <div class="cart-item-price">&euro;${item.prezzo.toFixed(2)}</div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button onclick="updateServerQuantity(${item.id}, -1)">-</button>
                    <input type="text" value="${item.quantita}" readonly>
                    <button onclick="updateServerQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeServerItem(${item.id})">
                    <i class="fas fa-trash-alt"></i> Rimuovi
                </button>
            </div>
        </div>
    `).join('');
    const riepilogoHTML = `
        <div class="cart-summary">
            <div class="summary-row">
                <span>Articoli (${numArticoli})</span>
                <span>&euro;${totale.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Spedizione</span>
                <span>${spedizione === 0 ? 'Gratuita' : '&euro;' + spedizione.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Totale</span>
                <span>&euro;${totaleConSpedizione.toFixed(2)}</span>
            </div>
            ${totale < 99 ? `<div class="shipping-info" style="margin: 10px 0; padding: 8px; background: #fff3cd; border-radius: 5px; font-size: 0.9em; color: #856404;">
                <i class="fas fa-info-circle"></i> Aggiungi altri &euro;${(99 - totale).toFixed(2)} per la spedizione gratuita!
            </div>` : ''}
            <div class="auth-message success">
                <i class="fas fa-check-circle"></i> Sei autenticato. Il carrello &egrave; sincronizzato con il database.
            </div>
            <button class="checkout-btn" onclick="proceedToCheckout()">Procedi all'acquisto</button>
        </div>
    `;
    cartContentElement.innerHTML = `
        <div class="cart-items">${articoliHTML}</div>
        ${riepilogoHTML}
    `;
}

// Renderizza carrello locale (utente non autenticato)
function renderLocalCart(cartContentElement) {
    if (!window.carrello || window.carrello.length === 0) {
        cartContentElement.innerHTML = `
            <div class="cart-empty">
                <h2>Il tuo carrello &egrave; vuoto</h2>
                <p>Aggiungi alcuni prodotti per iniziare!</p>
                <a href="../" class="continue-shopping">Continua lo shopping</a>
            </div>
        `;
        return;
    }

    const totale = window.carrello.reduce((sum, item) => sum + (item.prezzo * item.quantita), 0);
    const numArticoli = window.carrello.reduce((sum, item) => sum + item.quantita, 0);
    
    // Calcola spedizione: gratuita sopra 700€, altrimenti 15.90€
    const spedizione = totale >= 99 ? 0 : 4.90;
    const totaleConSpedizione = totale + spedizione;

    const articoliHTML = window.carrello.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.immagine}" alt="${item.nome}" onerror="this.src='../../images/product-placeholder.jpg'">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.nome}</div>
                <div class="cart-item-desc">${item.descrizione}</div>
            </div>
            <div class="cart-item-price">&euro;${item.prezzo.toFixed(2)}</div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button onclick="updateQuantityItem(${item.id}, -1)">-</button>
                    <input type="text" value="${item.quantita}" readonly>
                    <button onclick="updateQuantityItem(${item.id}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeItemFromCart(${item.id})">
                    <i class="fas fa-trash-alt"></i> Rimuovi
                </button>
            </div>
        </div>
    `).join('');

    const riepilogoHTML = `
        <div class="cart-summary">
            <div class="summary-row">
                <span>Articoli (${numArticoli})</span>
                <span>&euro;${totale.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Spedizione</span>
                <span>${spedizione === 0 ? 'Gratuita' : '&euro;' + spedizione.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Totale</span>
                <span>&euro;${totaleConSpedizione.toFixed(2)}</span>
            </div>
            ${totale < 99 ? `<div class="shipping-info" style="margin: 10px 0; padding: 8px; background: #fff3cd; border-radius: 5px; font-size: 0.9em; color: #856404;">
                <i class="fas fa-info-circle"></i> Aggiungi altri &euro;${(99 - totale).toFixed(2)} per la spedizione gratuita!
            </div>` : ''}
            <div class="auth-message warning">
                <i class="fas fa-exclamation-triangle"></i> Devi effettuare il login per procedere con l'acquisto.
            </div>
            <button class="checkout-btn disabled" onclick="showLoginPrompt()">Accedi per acquistare</button>
        </div>
    `;

    cartContentElement.innerHTML = `
        <div class="cart-items">${articoliHTML}</div>
        ${riepilogoHTML}
    `;
}

// === FUNZIONI CARRELLO LOCALE ===
window.updateQuantityItem = function (productId, change) {
    if (typeof window.updateQuantity === 'function') {
        window.updateQuantity(productId, change);
        renderCart();
    }
};

window.removeItemFromCart = function (productId) {
    if (typeof window.removeFromCart === 'function') {
        window.removeFromCart(productId);
        renderCart();
        location.reload(); 
    }
};

// === FUNZIONI CARRELLO SERVER ===
window.updateServerQuantity = function(productId, change) {
    const currentRow = document.querySelector(`[data-id="${productId}"]`);
    const quantityInput = currentRow.querySelector('input');
    const currentQuantity = parseInt(quantityInput.value);
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
        removeServerItem(productId);
        return;
    }
    fetch(`/EnoRiserva-v1/api/cart/update/${productId}?quantity=${newQuantity}`, {
        method: 'PUT',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderCart();
        }
    });
};

window.removeServerItem = function(productId) {
    fetch(`/EnoRiserva-v1/api/cart/remove/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderCart();
        }
    });
};

// === FUNZIONI GENERALI ===
window.showLoginPrompt = function() {
    if (confirm('Devi effettuare il login per procedere. Vuoi andare alla pagina di login?')) {
        window.location.href = '/EnoRiserva-v1/home/auth/';
    }
};

window.proceedToCheckout = function () {
    if (typeof userLoggedIn !== 'undefined' && userLoggedIn === 'true') {
        window.location.href = '/EnoRiserva-v1/home/carrello/checkout/';

    } else {
        showLoginPrompt();
    }
};