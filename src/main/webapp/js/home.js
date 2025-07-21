// HOME.JS - Script per la pagina home
document.addEventListener('DOMContentLoaded', function () {
    // Gestione carosello hero
    const slides = document.querySelectorAll('.slide');
    const heroDots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    // Controllo che il carosello esista prima di inizializzarlo
    if (slides.length > 0 && heroDots.length > 0) {
        function showSlide(index) {
            if (slides[index] && heroDots[index]) {
                slides.forEach(slide => slide.classList.remove('active'));
                heroDots.forEach(dot => dot.classList.remove('active'));
                slides[index].classList.add('active');
                heroDots[index].classList.add('active');
            }
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Auto-slide ogni 10 secondi
        setInterval(nextSlide, 10000);
    }

    // Smooth scroll per i bottoni CTA
    document.querySelectorAll('.cta-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#products');
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- FETCH ARTICOLI E POPOLA LE CARD (HOME) ---
    let articoliData = [];
    fetch('/EnoRiserva-v1/articoli')
        .then(response => response.json())
        .then(data => {
            console.log("HOME - Articoli ricevuti:", data.length);
            articoliData = data;
            renderArticoli(data);
        })
        .catch(err => {
            console.error("HOME - Errore caricamento articoli:", err);
            const productList = document.getElementById('product-list');
            if (productList) {
                productList.innerHTML = '<p style="text-align:center;color:#666;margin-top:30px;">Errore nel caricamento dei prodotti.</p>';
            }
        });

    function renderArticoli(articoli) {
        const productList = document.getElementById('product-list');
        if (!productList) {
            console.log('HOME - product-list non trovato, saltando renderArticoli');
            return;
        }

        productList.innerHTML = '';

        // Definiamo il percorso dell'immagine di fallback
        const fallbackImagePath = '/EnoRiserva-v1/images/vino1.jpg';

        articoli.forEach(articolo => {
            const card = document.createElement('div');
            card.className = 'product-card clickable-card';
            card.tabIndex = 0;
            card.onclick = function(e) {
                if (e.target.closest('.card-btn')) return;
                window.location.href = `/EnoRiserva-v1/home/catalogo/articolo/index.jsp?id=${articolo.id}`;
            };
            card.onkeydown = function(e) {
                if (e.key === 'Enter') {
                    window.location.href = `/EnoRiserva-v1/home/catalogo/articolo/index.jsp?id=${articolo.id}`;
                }
            };

            // Immagine
            const img = document.createElement('img');
            img.src = articolo.img || fallbackImagePath;
            img.onerror = function() {
                this.onerror = null;
                this.src = fallbackImagePath;
            };
            img.alt = articolo.nome;
            img.className = 'product-image-large';
            card.appendChild(img);

            // Nome e prezzo su una riga
            const namePriceRow = document.createElement('div');
            namePriceRow.className = 'name-price-row';
            const title = document.createElement('h3');
            title.className = 'product-title';
            title.textContent = articolo.nome;
            const price = document.createElement('div');
            price.className = 'product-price';
            price.textContent = '\u20AC ' + articolo.prezzo;
            namePriceRow.appendChild(title);
            namePriceRow.appendChild(price);
            card.appendChild(namePriceRow);

            // Info prodotto: Tipologia, Regione, Annata
            const infoDiv = document.createElement('div');
            infoDiv.className = 'product-info';

            const tipologiaSpan = document.createElement('p');
            tipologiaSpan.textContent = `${articolo.tipologia || '-'}`;

            const regioneSpan = document.createElement('p');
            regioneSpan.textContent = `${articolo.regione || '-'}`;

            const annataSpan = document.createElement('p');
            annataSpan.textContent = `${articolo.annata || '-'}`;

            infoDiv.appendChild(tipologiaSpan);
            infoDiv.appendChild(regioneSpan);
            infoDiv.appendChild(annataSpan);
            card.appendChild(infoDiv);

            // Descrizione
            const desc = document.createElement('p');
            desc.className = 'product-description';
            desc.textContent = articolo.descrizione || 'Descrizione non disponibile';
            //card.appendChild(desc);

            // Stelle recensioni
            const ratingDiv = document.createElement('div');
            ratingDiv.className = 'product-rating';
            if (typeof reviewsManager !== 'undefined') {
                const reviewData = reviewsManager.getProductReviewData(articolo.id);
                ratingDiv.innerHTML = `
                    <div class="rating-stars">${reviewData.starsHtml}</div>
                    <span class="rating-count">(${reviewData.totalReviews} recensioni)</span>
                `;
            }
            card.appendChild(ratingDiv);

            // Determiniamo il percorso corretto dell'immagine
            const immagineCorretta = articolo.img || fallbackImagePath;

            // Pulsanti wishlist e carrello
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'product-card-buttons-bottom';

            const wishlistBtn = document.createElement('button');
            wishlistBtn.className = 'card-btn wishlist-btn';
            wishlistBtn.setAttribute('data-product-id', articolo.id);
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
            wishlistBtn.title = 'Aggiungi ai preferiti';
            wishlistBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                const wishlistItem = {
                    id: articolo.id,
                    nome: articolo.nome,
                    descrizione: articolo.descrizione || 'Descrizione non disponibile',
                    prezzo: articolo.prezzo,
                    immagine: immagineCorretta,
                    regione: articolo.regione,
                    tipologia: articolo.tipologia,
                    annata: articolo.annata
                };
                if (typeof window.addToWishlist === 'function') {
                    const success = window.addToWishlist(wishlistItem);
                    if (success) {
                        wishlistBtn.classList.add('active');
                        wishlistBtn.innerHTML = '<i class="fas fa-heart" style="color: red;"></i>';
                    }
                } else {
                    alert('Funzione wishlist non disponibile.');
                }
            };

            const cartBtn = document.createElement('button');
            cartBtn.className = 'card-btn cart-btn';
            cartBtn.setAttribute('data-product-id', articolo.id);
            cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
            cartBtn.title = 'Aggiungi al carrello';
            cartBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                const cartItem = {
                    id: articolo.id,
                    nome: articolo.nome,
                    descrizione: articolo.descrizione || 'Descrizione non disponibile',
                    prezzo: articolo.prezzo,
                    quantita: 1,
                    immagine: immagineCorretta
                };
                if (typeof window.addToCart === 'function') {
                    try {
                        const success = window.addToCart(cartItem);
                        if (success) {
                            cartBtn.classList.add('active');
                            cartBtn.innerHTML = '<i class="fas fa-shopping-cart" style="color: #4CAF50;"></i>';
                            cartBtn.title = 'Prodotto già nel carrello';
                        }
                    } catch(e) {
                        alert('Errore carrello: ' + e.message);
                    }
                } else {
                    alert('Funzione carrello non disponibile.');
                }
            };

            buttonsDiv.appendChild(wishlistBtn);
            buttonsDiv.appendChild(cartBtn);
            card.appendChild(buttonsDiv);
            productList.appendChild(card);
        });
    }

    // FILTRI PRODOTTI HOME - LOGICA CORRETTA
    const filterOptions = document.querySelectorAll('.product-filter span');
    let filtroAttivo = null;

    if (filterOptions.length > 0) {
        console.log('HOME - Filtri trovati:', filterOptions.length);

        filterOptions.forEach(option => {
            option.addEventListener('click', function () {
                const filtro = this.textContent.trim().toLowerCase();
                console.log('HOME - Click su filtro:', filtro);

                if (filtroAttivo === filtro) {
                    // Deseleziona il filtro attivo
                    filtroAttivo = null;
                    filterOptions.forEach(opt => opt.classList.remove('active'));
                    renderArticoli(articoliData);
                } else {
                    // Applica nuovo filtro
                    filtroAttivo = filtro;
                    filterOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');

                    let filtered = [];
                    if (filtro === 'vino rosso') {
                        filtered = articoliData.filter(a => a.tipologia && a.tipologia.toLowerCase().includes('rosso'));
                    } else if (filtro === 'vino bianco') {
                        filtered = articoliData.filter(a => a.tipologia && a.tipologia.toLowerCase().includes('bianco'));
                    } else if (filtro === 'spumante') {
                        filtered = articoliData.filter(a => a.tipologia && (
                            a.tipologia.toLowerCase().includes('spumante') ||
                            a.tipologia.toLowerCase().includes('prosecco') ||
                            a.tipologia.toLowerCase().includes('champagne')
                        ));
                    } else if (filtro === 'tutti') {
                        filtered = articoliData;
                    }

                    console.log('HOME - Prodotti filtrati:', filtered.length);

                    if (filtered.length === 0) {
                        const productList = document.getElementById('product-list');
                        if (productList) {
                            productList.innerHTML = "<p style='text-align:center;color:#666;margin-top:30px;'>Nessun articolo disponibile per questo filtro.</p>";
                        }
                    } else {
                        renderArticoli(filtered);
                    }
                }
            });
        });
    }

    // BARRA DI RICERCA HOME
    const searchInput = document.querySelector('.search-input');
    const searchForm = document.querySelector('.search-form');

    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = searchInput.value.trim().toLowerCase();
            console.log('HOME - Ricerca:', query);

            if (!query) {
                renderArticoli(articoliData);
                return;
            }

            // Reset filtri attivi quando si cerca
            filtroAttivo = null;
            if (filterOptions.length > 0) {
                filterOptions.forEach(opt => opt.classList.remove('active'));
            }

            const filtered = articoliData.filter(a =>
                (a.nome && a.nome.toLowerCase().includes(query)) ||
                (a.descrizione && a.descrizione.toLowerCase().includes(query)) ||
                (a.tipologia && a.tipologia.toLowerCase().includes(query)) ||
                (a.regione && a.regione.toLowerCase().includes(query))
            );

            console.log('HOME - Risultati ricerca:', filtered.length);
            renderArticoli(filtered);
        });
    }

    // MENU MOBILE
    function initializeMobileMenu() {
        const openMobileMenuBtn = document.getElementById('openMobileMenu');
        const closeMobileMenuBtn = document.getElementById('closeMobileMenu');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

        function openMobileMenu() {
            console.log('HOME - Opening mobile menu...');
            if (mobileMenu && mobileMenuOverlay) {
                mobileMenu.classList.add('open');
                mobileMenuOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeMobileMenu() {
            console.log('HOME - Closing mobile menu...');
            if (mobileMenu && mobileMenuOverlay) {
                mobileMenu.classList.remove('open');
                mobileMenuOverlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        }

        if (openMobileMenuBtn && closeMobileMenuBtn && mobileMenu && mobileMenuOverlay) {
            openMobileMenuBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openMobileMenu();
            });

            closeMobileMenuBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeMobileMenu();
            });

            mobileMenuOverlay.addEventListener('click', function(e) {
                if (e.target === mobileMenuOverlay) {
                    closeMobileMenu();
                }
            });
        }
    }

    // Initialize mobile menu
    initializeMobileMenu();
    setTimeout(initializeMobileMenu, 100);
});