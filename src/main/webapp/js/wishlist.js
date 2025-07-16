// Wishlist.js - Sistema wishlist completo con gestione localStorage
if (typeof window !== 'undefined') {
    // Inizializza wishlist localStorage
    let wishlist = [];

    try {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            wishlist = JSON.parse(savedWishlist);
            console.log("Wishlist recuperata dal localStorage:", wishlist);
        }
    } catch (e) {
        console.error("Errore nel recupero della wishlist dal localStorage:", e);
    }

    /**
     * Aggiunge un prodotto alla wishlist localStorage
     */
    function addToWishlist(product) {
        if (!product || !product.id) {
            console.error("Prodotto non valido:", product);
            return false;
        }

        const esistente = wishlist.find(item => item.id === product.id);

        if (esistente) {
            console.log('Prodotto già presente nella wishlist:', product.nome);
            return false;
        } else {
            const nuovoProdotto = {
                id: product.id,
                nome: product.nome || "Prodotto senza nome",
                descrizione: product.descrizione || "Descrizione non disponibile",
                prezzo: product.prezzo || 0,
                immagine: product.immagine || product.img || '../images/letto1.png',
                dataAggiunta: new Date().toISOString()
            };
            console.log('DEBUG - Aggiunto prodotto alla wishlist:', nuovoProdotto);
            wishlist.push(nuovoProdotto);
        }

        try {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } catch (e) {
            console.error("Errore nel salvataggio della wishlist nel localStorage:", e);
            return false;
        }

        mostraNotificaWishlist('Prodotto aggiunto ai preferiti!');
        aggiornaStatoWishlistButtons();
        return true;
    }

    /**
     * Rimuove un prodotto dalla wishlist localStorage
     */
    function removeFromWishlist(productId) {
        const index = wishlist.findIndex(item => item.id === productId);
        
        if (index === -1) {
            console.log('Prodotto non trovato nella wishlist');
            return false;
        }

        const prodottoRimosso = wishlist[index];
        wishlist.splice(index, 1);

        try {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } catch (e) {
            console.error("Errore nel salvataggio della wishlist nel localStorage:", e);
            return false;
        }

        console.log('Prodotto rimosso dalla wishlist:', prodottoRimosso.nome);
        mostraNotificaWishlist('Prodotto rimosso dai preferiti!');
        aggiornaStatoWishlistButtons();
        return true;
    }

    /**
     * Controlla se un prodotto è nella wishlist
     */
    function isInWishlist(productId) {
        return wishlist.some(item => item.id === productId);
    }

    /**
     * Ottiene tutti i prodotti nella wishlist
     */
    function getWishlist() {
        return [...wishlist];
    }

    /**
     * Svuota completamente la wishlist
     */
    function clearWishlist() {
        wishlist = [];
        try {
            localStorage.removeItem('wishlist');
        } catch (e) {
            console.error("Errore nella rimozione della wishlist dal localStorage:", e);
        }
        aggiornaStatoWishlistButtons();
        return true;
    }

    /**
     * Aggiorna lo stato visivo dei bottoni wishlist
     */
    function aggiornaStatoWishlistButtons() {
        const wishlistButtons = document.querySelectorAll('.wishlist-btn');
        wishlistButtons.forEach(btn => {
            const productId = btn.getAttribute('data-product-id');
            if (productId && isInWishlist(parseInt(productId))) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-heart" style="color: red;"></i>';
                btn.title = 'Rimuovi dai preferiti';
                
                // Aggiorna l'event listener per la rimozione
                btn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const success = removeFromWishlist(parseInt(productId));
                    if (success) {
                        btn.classList.remove('active');
                        btn.innerHTML = '<i class="fas fa-heart"></i>';
                        btn.title = 'Aggiungi ai preferiti';
                        
                        // Ripristina l'event listener per l'aggiunta
                        btn.onclick = function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            const wishlistItem = {
                                id: parseInt(productId),
                                nome: btn.closest('.product-card').querySelector('.product-title')?.textContent || 'Prodotto',
                                descrizione: btn.closest('.product-card').querySelector('.product-description')?.textContent || 'Descrizione non disponibile',
                                prezzo: parseFloat(btn.closest('.product-card').querySelector('.product-price')?.textContent.replace('€ ', '') || 0),
                                immagine: btn.closest('.product-card').querySelector('.product-image-large')?.src || '../images/letto1.png'
                            };
                            if (typeof window.addToWishlist === 'function') {
                                const success = window.addToWishlist(wishlistItem);
                                if (success) {
                                    btn.classList.add('active');
                                    btn.innerHTML = '<i class="fas fa-heart" style="color: red;"></i>';
                                    btn.title = 'Rimuovi dai preferiti';
                                }
                            }
                        };
                    }
                };
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                btn.title = 'Aggiungi ai preferiti';
            }
        });
    }

    /**
     * Mostra notifica per la wishlist
     */
    function mostraNotificaWishlist(message) {
        // Crea una notifica temporanea
        const notification = document.createElement('div');
        notification.className = 'wishlist-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Anima l'entrata
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Rimuovi dopo 3 secondi
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Renderizza la wishlist nella sezione profilo
     */
    function renderWishlist() {
        const wishlistSection = document.getElementById('wishlist-section');
        if (!wishlistSection) return;

        wishlistSection.innerHTML = '<h2>Wishlist</h2>';
        
        if (wishlist.length === 0) {
            wishlistSection.innerHTML += '<div class="placeholder">La tua wishlist &egrave; vuota.</div>';
            return;
        }

        const container = document.createElement('div');
        container.className = 'wishlist-container';

        wishlist.forEach(item => {
            const card = document.createElement('div');
            card.className = 'wishlist-card';
            card.style.cursor = 'pointer'; // Indica che è cliccabile

            card.innerHTML = `
                <div class="wishlist-card-header">
                    <h3>${item.nome}</h3>
                    <button class="remove-wishlist-btn" data-product-id="${item.id}" title="Rimuovi dai preferiti">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="wishlist-card-image">
                    <img src="${item.immagine}" alt="${item.nome}" onerror="this.src='../images/letto1.png'">
                </div>
                <div class="wishlist-card-info">
                    <p>${item.descrizione}</p>
                    <div>
                        <span>&euro; ${item.prezzo}</span>
                    </div>
                </div>
            `;

            // Event listener per cliccare sulla card e andare alla scheda prodotto
            card.addEventListener('click', (e) => {
                // Non navigare se si clicca sul bottone rimuovi
                if (e.target.closest('.remove-wishlist-btn')) {
                    return;
                }
                
                // Naviga alla scheda prodotto
                window.location.href = `/SleepingSmarttress/home/catalogo/articolo/?id=${item.id}`;
            });

            // Event listeners per i bottoni
            const removeBtn = card.querySelector('.remove-wishlist-btn');
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFromWishlist(item.id);
                renderWishlist(); // Ricarica la wishlist
            });

            container.appendChild(card);
        });

        wishlistSection.appendChild(container);
    }

    // Esponi le funzioni globalmente
    window.addToWishlist = addToWishlist;
    window.removeFromWishlist = removeFromWishlist;
    window.isInWishlist = isInWishlist;
    window.getWishlist = getWishlist;
    window.clearWishlist = clearWishlist;
    window.renderWishlist = renderWishlist;
    window.aggiornaStatoWishlistButtons = aggiornaStatoWishlistButtons;

    // Inizializza lo stato dei bottoni quando il DOM è pronto
    document.addEventListener('DOMContentLoaded', function() {
        aggiornaStatoWishlistButtons();
        
        // Aggiorna anche i bottoni carrello
        if (typeof window.aggiornaStatoCarrelloButtons === 'function') {
            window.aggiornaStatoCarrelloButtons();
        }
        
        // Se siamo nella pagina del profilo, inizializza anche la wishlist
        if (document.getElementById('wishlist-section')) {
            // Mostra la wishlist se il tab è attivo
            const wishlistTab = document.querySelector('.profile-tab[data-section="wishlist"]');
            if (wishlistTab && wishlistTab.classList.contains('active')) {
                renderWishlist();
            }
        }
    });

    // Inizializza anche dopo un breve delay per catturare elementi caricati dinamicamente
    setTimeout(function() {
        aggiornaStatoWishlistButtons();
        if (typeof window.aggiornaStatoCarrelloButtons === 'function') {
            window.aggiornaStatoCarrelloButtons();
        }
    }, 500);

    console.log('Wishlist system initialized');
} 