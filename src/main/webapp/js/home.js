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

    // --- FETCH ARTICOLI E POPOLA LE CARD ---
    let articoliData = [];
    fetch('/EnoRiserva-v1/articoli')
        .then(response => response.json())
        .then(data => {
            articoliData = data;
            renderArticoli(data);
        })
        .catch(err => {
            const productList = document.getElementById('product-list');
            if (productList) {
                productList.innerHTML = '<p>Errore nel caricamento dei prodotti.</p>';
            }
        });

    // Funzione per gestire immagini mancanti (NON PIÙ NECESSARIA, la logica è dentro renderArticoli)
    // function handleImageError(img) {
    //     img.onerror = null; // Previene loop infiniti
    //     img.src = '../images/product-placeholder.jpg';
    // }

    function renderArticoli(articoli) {
        const productList = document.getElementById('product-list');
        if (!productList) {
            console.log('product-list non trovato, saltando renderArticoli');
            return;
        }

        productList.innerHTML = '';

        // Definiamo il percorso dell'immagine di fallback UNA SOLA VOLTA
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

            // --- INIZIO BLOCCO IMMAGINE MODIFICATO ---
            const img = document.createElement('img');

            // Logica principale: usa l'URL dal DB o, se mancante, il fallback.
            img.src = articolo.img || fallbackImagePath;

            // Gestione errori: se l'URL dal DB è rotto, usa comunque il fallback.
            img.onerror = function() {
                this.onerror = null; // Previene loop infiniti
                this.src = fallbackImagePath;
            };

            img.alt = articolo.nome;
            img.className = 'product-image-large';
            card.appendChild(img);
            // --- FINE BLOCCO IMMAGINE MODIFICATO ---

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

            // Descrizione
            const desc = document.createElement('p');
            desc.className = 'product-description';
            desc.textContent = articolo.descrizione || 'Descrizione non disponibile';
            card.appendChild(desc);

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

            // Determiniamo il percorso corretto dell'immagine da passare alle altre funzioni
            const immagineCorrettaPerFunzioni = articolo.img || fallbackImagePath;

            // Pulsanti wishlist e carrello in basso
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
                    immagine: immagineCorrettaPerFunzioni // CORRETTO
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
                    immagine: immagineCorrettaPerFunzioni // CORRETTO
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

    // Filtro prodotti
    const filterOptions = document.querySelectorAll('.product-filter span');
    let filtroAttivo = null;
    if (filterOptions.length > 0) {
        filterOptions.forEach(option => {
            option.addEventListener('click', function () {
                const filtro = this.textContent.trim().toLowerCase();
                if (filtroAttivo === filtro) {
                    filtroAttivo = null;
                    filterOptions.forEach(opt => opt.classList.remove('active'));
                    renderArticoli(articoliData);
                } else {
                    filtroAttivo = filtro;
                    filterOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                    let filtered = [];
                    if (filtro === 'smarttess') {
                        filtered = articoliData.filter(a => a.nome && a.nome.toLowerCase().includes('smart'));
                    } else if (filtro === 'smartpillow') {
                        filtered = articoliData.filter(a => a.nome && a.nome.toLowerCase().includes('pillow'));
                    } else if (filtro === 'memoryfoam') {
                        filtered = articoliData.filter(a => a.nome && a.nome.toLowerCase().includes('memory'));
                    } else if (filtro === 'molle') {
                        filtered = articoliData.filter(a => a.nome && a.nome.toLowerCase().includes('molle'));
                    } else if (filtro === 'cashmere') {
                        filtered = articoliData.filter(a => a.nome && a.nome.toLowerCase().includes('cashmere'));
                    } else if (filtro === 'lattice') {
                        filtered = articoliData.filter(a => a.nome && a.nome.toLowerCase().includes('lattice'));
                    } else {
                        filtered = articoliData;
                    }
                    if (filtered.length === 0) {
                        const productList = document.getElementById('product-list');
                        if (productList) {
                            productList.innerHTML = "<p>Nessun articolo disponibile.</p>";
                        }
                    } else {
                        renderArticoli(filtered);
                    }
                }
            });
        });
    }

    // --- BARRA DI RICERCA LIVE AJAX ---
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
            if (!query) {
                renderArticoli(articoliData);
                return;
            }
            filtroAttivo = null;
            if (filterOptions.length > 0) {
                filterOptions.forEach(opt => opt.classList.remove('active'));
            }
            renderArticoli(articoliData.filter(a =>
                (a.nome && a.nome.toLowerCase().includes(query)) ||
                (a.descrizione && a.descrizione.toLowerCase().includes(query))
            ));
        });
    }

    // --- MENU MOBILE APPLE STYLE ---
    function initializeMobileMenu() {
        const openMobileMenuBtn = document.getElementById('openMobileMenu');
        const closeMobileMenuBtn = document.getElementById('closeMobileMenu');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

        // Debug mobile menu elements
        console.log('Mobile Menu Debug:', {
            openMobileMenuBtn: !!openMobileMenuBtn,
            closeMobileMenuBtn: !!closeMobileMenuBtn,
            mobileMenu: !!mobileMenu,
            mobileMenuOverlay: !!mobileMenuOverlay
        });

        function openMobileMenu() {
            console.log('Opening mobile menu...');
            if (mobileMenu && mobileMenuOverlay) {
                mobileMenu.classList.add('open');
                mobileMenuOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';
                console.log('Mobile menu opened successfully');
            } else {
                console.error('Mobile menu elements not found');
            }
        }

        function closeMobileMenu() {
            console.log('Closing mobile menu...');
            if (mobileMenu && mobileMenuOverlay) {
                mobileMenu.classList.remove('open');
                mobileMenuOverlay.classList.remove('open');
                document.body.style.overflow = '';
                console.log('Mobile menu closed successfully');
            } else {
                console.error('Mobile menu elements not found');
            }
        }

        if (openMobileMenuBtn && closeMobileMenuBtn && mobileMenu && mobileMenuOverlay) {
            // Remove existing event listeners to prevent duplicates
            openMobileMenuBtn.removeEventListener('click', openMobileMenu);
            closeMobileMenuBtn.removeEventListener('click', closeMobileMenu);
            mobileMenuOverlay.removeEventListener('click', closeMobileMenu);

            openMobileMenuBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openMobileMenu();
            });
            openMobileMenuBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openMobileMenu();
                }
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
            console.log('Mobile menu event listeners attached successfully');
        } else {
            console.error('Some mobile menu elements are missing:', {
                openMobileMenuBtn: !!openMobileMenuBtn,
                closeMobileMenuBtn: !!closeMobileMenuBtn,
                mobileMenu: !!mobileMenu,
                mobileMenuOverlay: !!mobileMenuOverlay
            });
        }
    }

    // Initialize mobile menu immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMobileMenu);
    } else {
        // DOM is already ready
        initializeMobileMenu();
    }

    // Also try to initialize after a short delay to catch any late-loading elements
    setTimeout(initializeMobileMenu, 100);

});