<!DOCTYPE html>
<html>
<head>
    <title>SleepingSmarttress - Home</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../css/home_style.css">
    <link rel="stylesheet" href="../css/carosello.css">
    <link rel="stylesheet" href="../css/carrello.css">
    <link rel="stylesheet" href="../css/navbar.css">
    <link rel="stylesheet" href="../css/wishlist.css">
    <style>
      html, body { height: 100%; margin: 0; padding: 0; }
      body { min-height: 100vh; display: flex; flex-direction: column; }
      .main-content { flex: 1; }
    </style>
</head>
<body>
    <% request.setAttribute("activePage", "home"); %>
    <% if ("login".equals(request.getAttribute("navbarType"))) { %>
    <jsp:include page="/components/navbarLogin.jsp" />
<% } else { %>
    <jsp:include page="/components/navbar.jsp" />
<% } %>    

    <div class="main-content">
        <!-- Hero Carousel -->
        <div class="hero-carousel">
            <div class="carousel-slides">
                <div class="slide active">
                    <img src="../images/banner.png" alt="Smart Mattress">
                    <div class="slide-content">
                        <h1>EnoRiserva</h1>
                        <p>Il sonno intelligente per una vita migliore</p>
                        <a href="#products" class="cta-btn">Scopri i Prodotti</a>
                    </div>
                </div>
                <div class="slide">
                    <img src="../images/lettoBanner1.png" alt="Premium Quality">
                    <div class="slide-content">
                        <h1>Qualit&agrave; Premium</h1>
                        <p>Materiali di alta qualit&agrave; per il tuo comfort</p>
                        <a href="#products" class="cta-btn">Esplora la Gamma</a>
                    </div>
                </div>
                <div class="slide">
                    <img src="../images/lettoBanner2.png" alt="Innovation">
                    <div class="slide-content">
                        <h1>Innovazione e Tecnologia</h1>
                        <p>Il futuro del riposo &egrave; qui con noi</p>
                        <a href="#products" class="cta-btn">Scopri di Pi&ugrave;</a>
                    </div>
                </div>
            </div>
            <div class="carousel-nav">
                <button class="carousel-btn prev-btn"><i class="fas fa-chevron-left"></i></button>
                <div class="carousel-dots">
                    <span class="dot active" data-slide="0"></span>
                    <span class="dot" data-slide="1"></span>
                    <span class="dot" data-slide="2"></span>
                </div>
                <button class="carousel-btn next-btn"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>

        <!-- Main Content -->
        <main id="products">
            <div class="section-title">
                <h2>I prodotti pi&ugrave; amati</h2>
            </div>
            
            <div class="search-container">
                <div class="container">
                    <form action="../search" method="get" class="search-form">
                        <input type="text" name="query" placeholder="Cerca prodotti..." class="search-input">
                        <button type="submit" class="search-button">
                            <i class="fas fa-search"></i>
                        </button>
                    </form>
                </div>
            </div>
            <div class="product-filter">
                <strong>Ordina per:</strong>
                <span>Smarttess</span>
                <span>Smartpillow</span>
                <span>MemoryFoam</span>
                <span>Molle</span>
                <span>Cashmere</span>
                <span>Lattice</span>
            </div>

            <div class="product-list" id="product-list">
                <!-- Le card verranno popolate dinamicamente tramite JS -->
            </div>
        </main>
    </div>
    <jsp:include page="/components/footer.jsp" />

    <script src="../js/wishlist.js"></script>
    <script src="../js/cart.js"></script>
    <script src="../js/home.js"></script>
</body>
</html>
