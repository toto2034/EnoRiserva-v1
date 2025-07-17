// Configurazione paginazione
let currentPage = 1;
const itemsPerPage = 12;
let totalProducts = 0;
let filteredProducts = [];

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

    // Immagine grande in alto
    const img = document.createElement('img');
    img.src = articolo.img || '../../images/letto1.png';
    img.alt = articolo.nome;
    img.onerror = function () {
        this.src = '../../images/product-placeholder.jpg';
    };
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
            immagine: articolo.img
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
            prezzo: articolo.prezzo,
            quantita: 1,
            immagine: articolo.img // Usa l'URL dell'immagine dal database
        };
        console.log('DEBUG - Aggiunta al carrello:', cartItem);
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
    productList.innerHTML = ''; // Pulisci la lista

    // Calcola gli indici per la pagina corrente
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);

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
    pageNumbers.innerHTML = '';

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
            });
        }

        pageNumbers.appendChild(pageNum);
    }

    // Aggiorna i pulsanti prev/next
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;

    prevBtn.onclick = function () {
        if (currentPage > 1) {
            currentPage--;
            displayCurrentPage();
            updatePagination();
        }
    };

    nextBtn.onclick = function () {
        if (currentPage < totalPages) {
            currentPage++;
            displayCurrentPage();
            updatePagination();
        }
    };
}

// Inizializza la pagina
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('loading-indicator')) {
        document.getElementById('loading-indicator').style.display = 'block';
    }

    // --- FETCH ARTICOLI E POPOLA LE CARD ---
    let articoliData = [];
    fetch('/EnoRiserva-v1/articoli')
        .then(data => {
            articoliData = data;
            filteredProducts = data;
            totalProducts = data.length;
            displayCurrentPage();
            updatePagination();
        })
        .catch(err => {
            console.error("Errore: ", err);
            document.getElementById('product-list').innerHTML = '<p style="text-align:center;color:#666;margin-top:30px;">Errore nel caricamento dei prodotti.</p>';
            if (document.getElementById('loading-indicator')) {
                document.getElementById('loading-indicator').style.display = 'none';
            }
        });

    // Filtro prodotti
    const filterOptions = document.querySelectorAll('.product-filter span');
    let filtroAttivo = null;
    filterOptions.forEach(option => {
        option.addEventListener('click', function () {
            const filtro = this.textContent.trim().toLowerCase();
            if (filtroAttivo === filtro) {
                filtroAttivo = null;
                filterOptions.forEach(opt => opt.classList.remove('active'));
                filteredProducts = articoliData;
                totalProducts = articoliData.length;
                currentPage = 1;
                displayCurrentPage();
                updatePagination();
            } else {
                filtroAttivo = filtro;
                filterOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                let filtered = [];
                if (filtro === 'VINO ROSSO') {
                    filtered = articoliData.filter(a => a.nome && a.nome.toLowerCase().includes('rosso'));
                } else if (filtro === 'VINO BIANCO') {
                    filtered = articoliData.filter(a => a.nome && a.nome.toLowerCase().includes('bianco'));
                } else if (filtro === 'SPUMANTE') {
                    filtered = articoliData.filter(a => a.nome && a.nome.toLowerCase().includes('spumante'));
                } else if (filtro === 'molle') {
                    filtered = articoliData.filter(a => a.nome && a.nome.toLowerCase().includes('molle'));
                } else if (filtro === 'cashmere') {
                    filtered = articoliData.filter(a => a.nome && a.nome.toLowerCase().includes('cashmere'));
                } else if (filtro === 'lattice') {
                    filtered = articoliData.filter(a => a.nome && a.nome.toLowerCase().includes('lattice'));
                } else if (filtro === 'tutti') {
                    filtered = articoliData;
                }
                filteredProducts = filtered;
                totalProducts = filtered.length;
                currentPage = 1;
                if (filtered.length === 0) {
                    document.getElementById('product-list').innerHTML = "<p style='text-align:center;color:#666;margin-top:30px;'>Nessun articolo disponibile.</p>";
                } else {
                    displayCurrentPage();
                    updatePagination();
                }
            }
        });
    });

    // --- BARRA DI RICERCA LIVE AJAX ---
    const searchInput = document.querySelector('.search-input');
    const searchForm = document.querySelector('.search-form');
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
    });
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            filteredProducts = articoliData;
            totalProducts = articoliData.length;
            currentPage = 1;
            displayCurrentPage();
            updatePagination();
            return;
        }
        filtroAttivo = null;
        filterOptions.forEach(opt => opt.classList.remove('active'));
        filteredProducts = articoliData.filter(a =>
            (a.nome && a.nome.toLowerCase().includes(query)) ||
            (a.descrizione && a.descrizione.toLowerCase().includes(query))
        );
        totalProducts = filteredProducts.length;
        currentPage = 1;
        displayCurrentPage();
        updatePagination();
    });

    // Gestione dell'ordinamento
    const sortSelect = document.getElementById('sort-select');
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
});