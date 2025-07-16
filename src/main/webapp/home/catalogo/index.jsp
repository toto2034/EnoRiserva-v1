<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../../css/home_style.css">
    <link rel="stylesheet" href="../../css/catalogo.css">
    <link rel="stylesheet" href="../../css/carosello.css">
    <link rel="stylesheet" href="../../css/carrello.css">
    <link rel="stylesheet" href="../../css/navbar.css">
    <link rel="stylesheet" href="../../css/wishlist.css">
    <title>Catalogo</title>
    <style>
      html, body { height: 100%; margin: 0; padding: 0; }
      body { min-height: 100vh; display: flex; flex-direction: column; }
      .main-content { flex: 1; }
    </style>
</head>
<body>
    <% request.setAttribute("activePage", "catalogo"); %>
    <% if ("login".equals(request.getAttribute("navbarType"))) { %>
    <jsp:include page="/components/navbarLogin.jsp" />
<% } else { %>
    <jsp:include page="/components/navbar.jsp" />
<% } %>    
    
    <div class="main-content">
        <div class="container">
            <h1 class="section-title" style="text-align:center;font-family:'Montserrat',sans-serif;font-size:2.5em;margin-top:40px;letter-spacing:1px;font-weight:700;">Catalogo Prodotti</h1>
            
            <!-- Barra di ricerca -->
            <div class="search-container">
                <div class="container">
                    <form action="../../search" method="get" class="search-form">
                        <input type="text" name="query" placeholder="Cerca prodotti..." class="search-input">
                        <button type="submit" class="search-button">
                            <i class="fas fa-search"></i>
                        </button>
                    </form>
                </div>
            </div>
            
            <!-- Riga con filtri e ordinamento -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin:20px 0;flex-wrap:wrap;gap:15px;">
                <!-- Filtri prodotti -->
                <div class="product-filter" style="flex:1;min-width:60%;">
                    <strong>Filtra per:</strong>
                    <span class="active">Tutti</span>
                    <span>VINO_ROSSO</span>
                    <span>VINO_BIANCO</span>
                    <span>SPUMANTE</span>
                    <span>Cashmere</span>
                    <span>Lattice</span>
                </div>
                
                <!-- Opzioni di ordinamento -->
                <div class="sort-options" style="white-space:nowrap;">
                    <label for="sort-select" style="font-weight:500;margin-right:8px;position:relative;top:10px;">Ordina per:</label>
                    <select id="sort-select" style="position:relative;top:10px;padding:8px 12px;border-radius:8px;border:1px solid #ddd;box-shadow:0 2px 5px rgba(0,0,0,0.08);background:#f8f9fa;font-size:0.95em;">
                        <option value="price-asc">Prezzo: dal più basso</option>
                        <option value="price-desc">Prezzo: dal più alto</option>
                        <option value="name-asc">Nome: A-Z</option>
                        <option value="name-desc">Nome: Z-A</option>
                        <option value="newest">Più recenti</option>
                    </select>
                </div>
            </div>
            
            <!-- Lista prodotti -->
            <div class="product-list" id="product-list">
                <!-- Le card verranno popolate dinamicamente tramite JS -->
                <div id="loading-indicator" style="text-align:center;padding:30px;">
                    <i class="fas fa-spinner fa-spin" style="font-size:2em;color:#6e8efb;"></i>
                    <p>Caricamento prodotti...</p>
                </div>
            </div>
            
            <!-- Paginazione -->
            <div class="pagination" style="text-align:center;margin:30px 0;display:flex;justify-content:center;">
                <button class="pagination-btn" id="prev-page" disabled style="margin:0 5px;padding:8px 15px;border:none;background:#f0f0f0;border-radius:5px;cursor:pointer;">
                    <i class="fas fa-chevron-left"></i> Precedente
                </button>
                <div id="page-numbers" style="display:flex;align-items:center;">
                    <!-- I numeri di pagina saranno generati dinamicamente -->
                </div>
                <button class="pagination-btn" id="next-page" style="margin:0 5px;padding:8px 15px;border:none;background:#f0f0f0;border-radius:5px;cursor:pointer;">
                    Successiva <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    </div>
    <jsp:include page="/components/footer.jsp" />
    
    <script src="../../js/wishlist.js"></script>
    <script src="../../js/cart.js"></script>
    <script src="../../js/reviews.js"></script>
    <script src="../../js/catalogo.js"></script>
    <script src="../../js/home.js"></script>
</body>
</html>