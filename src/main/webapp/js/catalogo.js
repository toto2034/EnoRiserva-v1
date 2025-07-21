// CATALOGO.JS - Script per la pagina catalogo con paginazione
// Configurazione paginazione
let currentPage = 1;
const itemsPerPage = 12;
let totalProducts = 0;
let filteredProducts = [];
let articoliData = []; // Array principale dei dati

// Funzione per creare una card prodotto (riutilizzabile, DRY)
function createProductCard(articolo) {
    const card = document.createElement('div');
    card.className = 'product-card clickable-card';
    card.tabIndex = 0;
    card.onclick = function (e) {
        // Evita che il click sui bottoni propaghi
        if (e.target.closest('.card-btn')) return;
        window.location.href = `/EnoRiserva-v1/home/catalogo/articolo/index.jsp?id=${articolo.id}`;
    };
    card.onkeydown = function (e) {
        if (e.key === 'Enter') {
            window.location.href = `/EnoRiserva-v1/home/catalogo/articolo/index.jsp?id=${articolo.id}`;
        }
    };

    // Definisci il percorso dell'immagine di fallback
    const fallbackImagePath = '/EnoRiserva-v1/images/vino1.jpg';

    // Immagine grande in alto
    const img = document.createElement('img');
    img.src = articolo.img || fallbackImagePath;
    img.alt = articolo.nome;
    img.onerror = function () {
        this.onerror = null;
        this.src = fallbackImagePath;
    };
    img.className = 'product-image-large';
    card.appendChild(img);

    console.log("CATALOGO - articolo create product: " + JSON.stringify(articolo));

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

    // Determina l'immagine corretta per le funzioni
    const immagineCorrettaPerFunzioni = articolo.img || fallbackImagePath;

    // Pulsanti wishlist e carrello in basso
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'product-card-buttons-bottom';

    const wishlistBtn = document.createElement('button');
    wishlistBtn.className = 'card-btn wishlist-btn';
    wishlistBtn.setAttribute('data-product-id', articolo.id);
    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
    wishlistBtn.title = 'Aggiungi ai preferiti';
    wishlistBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        const wishlistItem = {
            id: articolo.id,
            nome: articolo.nome,
            descrizione: articolo.descrizione || 'Descrizione non disponibile',
            prezzo: articolo.prezzo,
            immagine: immagineCorrettaPerFunzioni,
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
    cartBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        const cartItem = {
            id: articolo.id,
            nome: articolo.nome,
            descrizione: articolo.descrizione || 'Descrizione non disponibile',
            tipologia: articolo.tipologia,
            annata: articolo.annata,
            regione: articolo.regione,
            prezzo: articolo.prezzo,
            quantita: 1,
            immagine: immagineCorrettaPerFunzioni
        };
        console.log('CATALOGO - DEBUG - Aggiunta al carrello:', cartItem);
        if (typeof window.addToCart === 'function') {
            try {
                const success = window.addToCart(cartItem);
                if (success) {
                    cartBtn.classList.add('active');
                    cartBtn.innerHTML = '<i class="fas fa-shopping-cart" style="color: #4CAF50;"></i>';
                    cartBtn.title = 'Prodotto già nel carrello';
                }
            } catch (e) {
                alert('Errore carrello: ' + e.message);
            }
        } else {
            alert('Funzione carrello non disponibile.');
        }
    };

    buttonsDiv.appendChild(wishlistBtn);
    buttonsDiv.appendChild(cartBtn);
    card.appendChild(buttonsDiv);

    return card;
}

// Funzione per mostrare la pagina corrente
function displayCurrentPage() {
    const productList = document.getElementById('product-list');
    if (!productList) {
        console.log('CATALOGO - product-list non trovato');
        return;
    }

    productList.innerHTML = ''; // Pulisci la lista

    // Calcola gli indici per la pagina corrente
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);

    console.log(`CATALOGO - Mostrando prodotti da ${startIndex} a ${endIndex - 1} di ${filteredProducts.length}`);

    // Mostra solo i prodotti per la pagina corrente
    for (let i = startIndex; i < endIndex; i++) {
        const card = createProductCard(filteredProducts[i]);
        productList.appendChild(card);
    }

    // Se non ci sono prodotti
    if (filteredProducts.length === 0) {
        productList.innerHTML =
            '<p style="text-align:center;color:#666;margin-top:30px;">Nessun prodotto trovato. Prova a cambiare i filtri.</p>';
    }

    // Nascondi l'indicatore di caricamento
    if (document.getElementById('loading-indicator')) {
        document.getElementById('loading-indicator').style.display = 'none';
    }
}

// Funzione per aggiornare la paginazione
function updatePagination() {
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const pageNumbers = document.getElementById('page-numbers');

    if (!pageNumbers) {
        console.log('CATALOGO - page-numbers non trovato');
        return;
    }

    pageNumbers.innerHTML = '';

    console.log(`CATALOGO - Aggiornamento paginazione: pagina ${currentPage} di ${totalPages}`);

    // Crea i numeri di pagina
    for (let i = 1; i <= totalPages; i++) {
        const pageNum = document.createElement('button');
        pageNum.textContent = i;
        pageNum.className = 'page-number';
        pageNum.style.margin = '0 5px';
        pageNum.style.padding = '8px 12px';
        pageNum.style.border = 'none';
        pageNum.style.borderRadius = '5px';
        pageNum.style.cursor = 'pointer';

        if (i === currentPage) {
            pageNum.style.backgroundColor = '#6e8efb';
            pageNum.style.color = '#fff';
        } else {
            pageNum.style.backgroundColor = '#f0f0f0';
            pageNum.addEventListener('click', function () {
                currentPage = i;
                displayCurrentPage();
                updatePagination();
                // Scroll to top per una migliore UX
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        pageNumbers.appendChild(pageNum);
    }

    // Aggiorna i pulsanti prev/next
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = function () {
            if (currentPage > 1) {
                currentPage--;
                displayCurrentPage();
                updatePagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        nextBtn.onclick = function () {
            if (currentPage < totalPages) {
                currentPage++;
                displayCurrentPage();
                updatePagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };
    }
}

// Funzione per applicare i filtri
function applyFilter(filterType) {
    console.log('CATALOGO - Applicando filtro:', filterType);
    console.log('CATALOGO - Dati disponibili:', articoliData.length, 'articoli');

    let filtered = [];

    if (filterType === 'tutti' || !filterType) {
        filtered = articoliData;
    } else if (filterType === 'vino rosso') {
        filtered = articoliData.filter(a =>
            a.tipologia && a.tipologia.toLowerCase().includes('rosso')
        );
    } else if (filterType === 'vino bianco') {
        filtered = articoliData.filter(a =>
            a.tipologia && a.tipologia.toLowerCase().includes('bianco')
        );
    } else if (filterType === 'spumante') {
        filtered = articoliData.filter(a =>
                a.tipologia && (
                    a.tipologia.toLowerCase().includes('spumante') ||
                    a.tipologia.toLowerCase().includes('prosecco') ||
                    a.tipologia.toLowerCase().includes('champagne')
                )
        );
    }

    console.log('CATALOGO - Prodotti filtrati:', filtered.length);

    filteredProducts = filtered;
    totalProducts = filtered.length;
    currentPage = 1; // Reset alla prima pagina quando si applica un filtro

    displayCurrentPage();
    updatePagination();
}

// Inizializza la pagina catalogo
document.addEventListener('DOMContentLoaded', function () {
    console.log('CATALOGO - DOM Content Loaded');

    if (document.getElementById('loading-indicator')) {
        document.getElementById('loading-indicator').style.display = 'block';
    }

    // --- FETCH ARTICOLI E POPOLA LE CARD ---
    fetch('/EnoRiserva-v1/articoli')
        .then(response => response.json())
        .then(data => {
            console.log("CATALOGO - Articoli ricevuti:", data.length);
            if (data.length > 0) {
                console.log("CATALOGO - Esempio articolo:", data[0]);
                console.log("CATALOGO - Chiavi disponibili:", Object.keys(data[0]));
            }

            articoliData = data;
            filteredProducts = data;
            totalProducts = data.length;
            displayCurrentPage();
            updatePagination();
        })
        .catch(err => {
            console.error("CATALOGO - Errore nel caricamento articoli: ", err);
            const productList = document.getElementById('product-list');
            if (productList) {
                productList.innerHTML = '<p style="text-align:center;color:#666;margin-top:30px;">Errore nel caricamento dei prodotti.</p>';
            }
            if (document.getElementById('loading-indicator')) {
                document.getElementById('loading-indicator').style.display = 'none';
            }
        });

    // FILTRI PRODOTTI - LOGICA CORRETTA
    const filterOptions = document.querySelectorAll('.product-filter span');
    let filtroAttivo = null;

    console.log('CATALOGO - Filtri trovati:', filterOptions.length);

    filterOptions.forEach(option => {
        option.addEventListener('click', function () {
            const filtro = this.textContent.trim().toLowerCase();
            console.log('CATALOGO - Click su filtro:', filtro);

            if (filtroAttivo === filtro) {
                // Deseleziona il filtro attivo
                filtroAttivo = null;
                filterOptions.forEach(opt => opt.classList.remove('active'));
                applyFilter('tutti');
            } else {
                // Applica nuovo filtro
                filtroAttivo = filtro;
                filterOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                applyFilter(filtro);
            }
        });
    });

    // --- BARRA DI RICERCA LIVE ---
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
            console.log('CATALOGO - Ricerca:', query);

            if (!query) {
                filteredProducts = articoliData;
                totalProducts = articoliData.length;
                currentPage = 1;
                displayCurrentPage();
                updatePagination();
                return;
            }

            // Reset filtri attivi quando si cerca
            filtroAttivo = null;
            filterOptions.forEach(opt => opt.classList.remove('active'));

            filteredProducts = articoliData.filter(a =>
                (a.nome && a.nome.toLowerCase().includes(query)) ||
                (a.descrizione && a.descrizione.toLowerCase().includes(query)) ||
                (a.tipologia && a.tipologia.toLowerCase().includes(query))
            );

            totalProducts = filteredProducts.length;
            currentPage = 1;
            displayCurrentPage();
            updatePagination();
        });
    }

    // Gestione dell'ordinamento
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            const sort = this.value;

            // Ordina i prodotti filtrati
            if (sort === 'price-asc') {
                filteredProducts.sort((a, b) => a.prezzo - b.prezzo);
            } else if (sort === 'price-desc') {
                filteredProducts.sort((a, b) => b.prezzo - a.prezzo);
            } else if (sort === 'name-asc') {
                filteredProducts.sort((a, b) => a.nome.localeCompare(b.nome));
            } else if (sort === 'name-desc') {
                filteredProducts.sort((a, b) => b.nome.localeCompare(a.nome));
            }

            // Aggiorna la visualizzazione con i prodotti ordinati
            currentPage = 1;
            displayCurrentPage();
            updatePagination();
        });
    }
});