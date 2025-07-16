document.addEventListener('DOMContentLoaded', function() {
    // Leggi l'ID dal parametro URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    console.log('URL completo:', window.location.href);
    console.log('Parametri URL:', window.location.search);
    console.log('ID estratto:', articleId);
    console.log('Tipo di articleId:', typeof articleId);
    console.log('isNaN test:', isNaN(articleId));
    
    // Controlla se l'ID esiste ed è un numero valido
    if (articleId && articleId.trim() !== '' && !isNaN(parseInt(articleId))) {
        loadArticle(parseInt(articleId));
    } else {
        console.error('ID articolo non valido nella URL. ID ricevuto:', articleId);
        document.getElementById('loading').innerHTML = '<h1>Errore: ID articolo non valido</h1>';
    }
});

// Variabile globale per memorizzare l'articolo corrente
let currentArticle = null;

function loadArticle(id) {
    console.log('Caricamento articolo con ID:', id);
    
    // Usa la servlet corretta
    fetch(`/SleepingSmarttress/articoli/${id}`)
        .then(response => {
            console.log('Risposta servlet status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(articolo => {
            // DEBUG COMPLETO RISPOSTA
            console.log('=== DEBUG ARTICOLO DAL SERVER ===');
            console.log('Articolo completo:', articolo);
            console.log('Proprietà articolo:', Object.keys(articolo));
            console.log('img:', articolo.img);
            console.log('=================================');
            
            // Forza il campo img se non presente
            if (!articolo.img) {
                articolo.img = '/SleepingSmarttress/images/letto1.png';
            }
            
            currentArticle = articolo; // Salva l'articolo globalmente
            displayArticle(articolo);
        })
        .catch(error => {
            console.error('Errore nel caricamento dell\'articolo:', error);
            document.getElementById('loading').innerHTML = '<h1>Errore nel caricamento dell\'articolo: ' + error.message + '</h1>';
        });
}

function displayArticle(articolo) {
    document.title = articolo.nome + ' - SleepingSmarttress';
    
    // Nascondi il loading
    document.getElementById('loading').style.display = 'none';
    
    // Crea struttura DOM invece di innerHTML con stili
    createProductLayout(articolo);
    setupEventListeners();
}

function createProductLayout(articolo) {
    // Salva l'articolo corrente globalmente
    currentArticle = articolo;
    
    const container = document.createElement('div');
    container.className = 'product-container';
    
    // Breadcrumb
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.innerHTML = `
        <a href="/SleepingSmarttress/home/">Home</a> > 
        <a href="/SleepingSmarttress/home/catalogo/">Catalogo</a> > 
        <span>${articolo.nome}</span>
    `;
    
    // Main product section
    const productMain = document.createElement('div');
    productMain.className = 'product-main';
    
    // Images section
    const imagesSection = createImagesSection(articolo);
    
    // Product info section
    const infoSection = createProductInfo(articolo);
    
    productMain.appendChild(imagesSection);
    productMain.appendChild(infoSection);
    
    // Reviews section
    const reviewsSection = createReviewsSection();
    
    container.appendChild(breadcrumb);
    container.appendChild(productMain);
    container.appendChild(reviewsSection);
    
    // Inserisci il container dentro .main-content invece che in fondo al body
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.appendChild(container);
    } else {
        document.body.appendChild(container);
    }
}

function createImagesSection(articolo) {
    const section = document.createElement('div');
    section.className = 'product-images';
    
    // Usa l'immagine esattamente come nel catalogo 
    const imageUrl = articolo.img;
    console.log('Uso immagine dal DB:', imageUrl);
    
    const mainImage = document.createElement('div');
    mainImage.className = 'main-image';
    mainImage.innerHTML = `<img src="${imageUrl}" alt="${articolo.nome}" onerror="this.src='/SleepingSmarttress/images/letto1.png';">`;
    
    const gallery = document.createElement('div');
    gallery.className = 'image-gallery';
    gallery.innerHTML = `
        <img src="${imageUrl}" onclick="changeMainImage(this.src)" onerror="this.src='/SleepingSmarttress/images/letto1.png';">
        <img src="${imageUrl}" onclick="changeMainImage(this.src)" onerror="this.src='/SleepingSmarttress/images/letto1.png';">
        <img src="${imageUrl}" onclick="changeMainImage(this.src)" onerror="this.src='/SleepingSmarttress/images/letto1.png';">
    `;
    
    section.appendChild(mainImage);
    section.appendChild(gallery);
    return section;
}

function createProductInfo(articolo) {
    const section = document.createElement('div');
    section.className = 'product-info';
    
    // Title
    const title = document.createElement('h1');
    title.className = 'product-title';
    title.textContent = articolo.nome;
    
    // Rating
    const rating = document.createElement('div');
    rating.className = 'product-rating';
    
    // Usa il sistema recensioni unificato
    const reviewData = reviewsManager.getProductReviewData(articolo.id);
    
    rating.innerHTML = `
        <div class="rating-stars">
            ${reviewData.starsHtml} <span class="rating-text">(${reviewData.formattedRating}/5 - ${reviewData.totalReviews} recensioni)</span>
        </div>
    `;
    
    // Price section
    const priceSection = document.createElement('div');
    priceSection.className = 'price-section';
    priceSection.innerHTML = `
        <div class="current-price">€${articolo.prezzo.toFixed(2)}</div>
        <div class="original-price">€${(articolo.prezzo * 1.2).toFixed(2)}</div>
        <div class="savings">Risparmi €${(articolo.prezzo * 0.2).toFixed(2)}!</div>
    `;
    
    // Description
    const description = document.createElement('div');
    description.className = 'product-description';
    description.textContent = articolo.descrizione;
    
    // Availability
    const availability = document.createElement('div');
    availability.className = 'availability';
    const availabilityClass = articolo.quantitaDisponibile > 0 ? 'available' : 'unavailable';
    const availabilityText = articolo.quantitaDisponibile > 0 ? 
        `✓ Disponibile (${articolo.quantitaDisponibile} pezzi)` : 
        '✗ Non disponibile';
    availability.innerHTML = `<span class="availability-text ${availabilityClass}">${availabilityText}</span>`;
    
    section.appendChild(title);
    section.appendChild(rating);
    section.appendChild(priceSection);
    section.appendChild(description);
    section.appendChild(availability);
    
    // Quantity selector (only if available)
    if (articolo.quantitaDisponibile > 0) {
        const quantitySection = createQuantitySelector(articolo.quantitaDisponibile);
        section.appendChild(quantitySection);
    }
    
    // Action buttons
    const actionsSection = createActionButtons(articolo.quantitaDisponibile === 0);
    section.appendChild(actionsSection);
    
    // Features
    const features = createFeaturesSection();
    section.appendChild(features);
    
    // Back button
    const backBtn = document.createElement('button');
    backBtn.className = 'btn-back';
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Torna al Catalogo';
    backBtn.onclick = goBack;
    section.appendChild(backBtn);
    
    return section;
}

function createQuantitySelector(maxQuantity) {
    const section = document.createElement('div');
    section.className = 'quantity-selector';
    
    section.innerHTML = `
        <label class="quantity-label">Quantità:</label>
        <div class="quantity-controls">
            <button class="quantity-btn" onclick="decreaseQuantity()">-</button>
            <input type="number" id="quantity-input" class="quantity-input" value="1" min="1" max="${maxQuantity}" onchange="validateQuantity()">
            <button class="quantity-btn" onclick="increaseQuantity()">+</button>
            <span class="quantity-info">Max ${maxQuantity} disponibili</span>
        </div>
    `;
    
    return section;
}

function createActionButtons(isDisabled) {
    const section = document.createElement('div');
    section.className = 'product-actions';
    
    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'btn-add-cart';
    addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Aggiungi al Carrello';
    addToCartBtn.onclick = addCurrentProductToCart;
    if (isDisabled) addToCartBtn.disabled = true;
    
    const wishlistBtn = document.createElement('button');
    wishlistBtn.className = 'btn-wishlist';
    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
    wishlistBtn.onclick = addCurrentProductToWishlist;
    
    section.appendChild(addToCartBtn);
    section.appendChild(wishlistBtn);
    
    return section;
}

function createFeaturesSection() {
    const section = document.createElement('div');
    section.className = 'product-features';
    
    section.innerHTML = `
        <h3 class="features-title">Caratteristiche principali:</h3>
        <ul class="features-list">
            <li><i class="fas fa-check feature-icon"></i>Garanzia 2 anni</li>
            <li><i class="fas fa-check feature-icon"></i>Spedizione gratuita</li>
            <li><i class="fas fa-check feature-icon"></i>Reso entro 30 giorni</li>
            <li><i class="fas fa-check feature-icon"></i>Assistenza 24/7</li>
        </ul>
    `;
    
    return section;
}

function createReviewsSection() {
    const section = document.createElement('div');
    section.className = 'reviews-section';
    
    // Ottieni dati recensioni per l'articolo corrente
    const reviewData = reviewsManager.getProductReviewData(currentArticle ? currentArticle.id : 1);
    
    section.innerHTML = `
        <h2 class="reviews-title">Recensioni Clienti</h2>
        
        <div class="review-summary">
            <div class="rating-overview">
                <div class="rating-number">${reviewData.formattedRating}</div>
                <div class="rating-stars-large">${reviewData.starsHtml}</div>
                <div class="rating-count">${reviewData.totalReviews} recensioni</div>
            </div>
            <div class="rating-bars">
                ${reviewsManager.generateRatingBarsHtml(reviewData.starsDistribution, reviewData.totalReviews)}
            </div>
        </div>
        
        <div class="reviews-list">
            ${reviewsManager.generateReviewsListHtml(reviewData.reviews)}
        </div>
        
        <div class="add-review">
            <h3 class="review-form-title">Scrivi una recensione</h3>
            <div class="rating-input">
                <label class="rating-label">Valutazione:</label>
                <div class="star-rating">
                    <span onclick="setRating(1)">★</span>
                    <span onclick="setRating(2)">★</span>
                    <span onclick="setRating(3)">★</span>
                    <span onclick="setRating(4)">★</span>
                    <span onclick="setRating(5)">★</span>
                </div>
            </div>
            <textarea class="review-textarea" placeholder="Scrivi la tua recensione qui..."></textarea>
            <button class="btn-submit-review">Pubblica Recensione</button>
        </div>
    `;
    
    return section;
}

function setupEventListeners() {
    // Aggiungi event listeners per responsive design
    window.addEventListener('resize', handleResize);
}

function handleResize() {
    const productMain = document.querySelector('.product-main');
    if (window.innerWidth <= 768 && productMain) {
        productMain.style.flexDirection = 'column';
        productMain.style.gap = '20px';
    } else if (productMain) {
        productMain.style.flexDirection = 'row';
        productMain.style.gap = '40px';
    }
}

// Nuova funzione che usa l'articolo completo
function addCurrentProductToCart() {
    if (!currentArticle) {
        console.error('Nessun articolo caricato');
        return;
    }
    
    const quantityInput = document.getElementById('quantity-input');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    const productToAdd = {
        id: currentArticle.id,
        nome: currentArticle.nome,
        descrizione: currentArticle.descrizione,
        prezzo: currentArticle.prezzo,
        quantita: quantity,
        immagine: currentArticle.img || "/SleepingSmarttress/images/letto1.png" // Usa immagine dal DB
    };
    
    console.log('Aggiungendo prodotto al carrello:', productToAdd);
    
    if (typeof window.addToCart === 'function') {
        window.addToCart(productToAdd);
        showAddToCartSuccess(quantity);
    } else {
        console.error('Funzione addToCart non disponibile');
    }
}

// Funzioni di utilità per le recensioni e interazioni
function setRating(rating) {
    console.log('Rating selezionato:', rating);
    // Aggiorna le stelle visualizzate
    const stars = document.querySelectorAll('.star-rating span');
    stars.forEach((star, index) => {
        star.style.color = index < rating ? '#ffcd3c' : '#ddd';
    });
}

function addCurrentProductToWishlist() {
    console.log('=== DEBUG ADD TO WISHLIST ===');
    console.log('currentArticle:', currentArticle);
    
    if (!currentArticle) {
        console.error('Nessun articolo caricato');
        return;
    }
    
    const wishlistItem = {
        id: currentArticle.id,
        nome: currentArticle.nome,
        descrizione: currentArticle.descrizione || 'Descrizione non disponibile',
        prezzo: currentArticle.prezzo,
        immagine: currentArticle.img || '../images/letto1.png'
    };
    
    console.log('wishlistItem da aggiungere:', wishlistItem);
    console.log('window.addToWishlist disponibile:', typeof window.addToWishlist);
    
    if (typeof window.addToWishlist === 'function') {
        console.log('Chiamo window.addToWishlist...');
        const success = window.addToWishlist(wishlistItem);
        console.log('Risultato addToWishlist:', success);
        
        if (success) {
            console.log('Prodotto aggiunto con successo alla wishlist');
            // Feedback visivo
            const btn = document.querySelector('.btn-wishlist');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-heart" style="color: red;"></i>';
            btn.style.borderColor = 'red';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.borderColor = '#6e8efb';
            }, 2000);
        } else {
            console.log('Prodotto già presente nella wishlist o errore');
        }
    } else {
        console.error('ERRORE: window.addToWishlist non è disponibile!');
        console.log('Aggiunto alla wishlist:', currentArticle.nome);
        
        // Feedback visivo fallback
        const btn = document.querySelector('.btn-wishlist');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-heart" style="color: red;"></i>';
        btn.style.borderColor = 'red';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.borderColor = '#6e8efb';
        }, 2000);
    }
}

// Funzione per tornare al catalogo
function goBack() {
    window.location.href = '/SleepingSmarttress/home/catalogo/';
}

// Funzioni per la gestione della quantità
function increaseQuantity() {
    const input = document.getElementById('quantity-input');
    const max = parseInt(input.max);
    const current = parseInt(input.value);
    
    if (current < max) {
        input.value = current + 1;
    }
}

function decreaseQuantity() {
    const input = document.getElementById('quantity-input');
    const min = parseInt(input.min);
    const current = parseInt(input.value);
    
    if (current > min) {
        input.value = current - 1;
    }
}

function validateQuantity() {
    const input = document.getElementById('quantity-input');
    const max = parseInt(input.max);
    const min = parseInt(input.min);
    let value = parseInt(input.value);
    
    if (value > max) {
        input.value = max;
        showQuantityWarning(`Massimo ${max} pezzi disponibili`);
    } else if (value < min) {
        input.value = min;
    } else if (isNaN(value)) {
        input.value = min;
    }
}

function showQuantityWarning(message) {
    // Rimuovi eventuali warning precedenti
    const existingWarning = document.querySelector('.quantity-warning');
    if (existingWarning) {
        existingWarning.remove();
    }
    
    // Crea nuovo warning
    const warning = document.createElement('div');
    warning.className = 'quantity-warning';
    warning.style.cssText = 'color: #dc3545; font-size: 0.9em; margin-top: 5px; animation: fadeIn 0.3s ease-in;';
    warning.textContent = message;
    
    const quantitySelector = document.querySelector('.quantity-selector');
    quantitySelector.appendChild(warning);
    
    // Rimuovi dopo 3 secondi
    setTimeout(() => {
        if (warning) warning.remove();
    }, 3000);
}

function changeMainImage(src) {
    const mainImg = document.querySelector('.main-image img');
    if (mainImg) {
        mainImg.src = src;
    }
    
    // Aggiorna border delle thumbnail
    document.querySelectorAll('.image-gallery img').forEach(img => {
        img.style.border = img.src === src ? '2px solid #6e8efb' : '2px solid transparent';
    });
}

function showAddToCartSuccess(quantity) {
    const button = document.querySelector('.btn-add-cart');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-check"></i> Aggiunto!';
    button.style.background = '#28a745';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = 'linear-gradient(135deg, #6e8efb, #a777e3)';
    }, 2000);
}