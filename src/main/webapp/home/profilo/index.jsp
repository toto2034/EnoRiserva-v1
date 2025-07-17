<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page session="true" %>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../../css/home_style.css">
    <link rel="stylesheet" href="../../css/profile.css">
    <link rel="stylesheet" href="../../css/carosello.css">
    <link rel="stylesheet" href="../../css/carrello.css">
    <link rel="stylesheet" href="../../css/navbar.css">
    <link rel="stylesheet" href="../../css/wishlist.css">
    <title>Profilo - EnoRiserva</title>
    <style>
      html, body { height: 100%; margin: 0; padding: 0; }
      body { min-height: 100vh; display: flex; flex-direction: column; }
      .main-content { flex: 1; }
    </style>
</head>
<body>
    <% request.setAttribute("activePage", "profilo"); %>
    <% if ("login".equals(request.getAttribute("navbarType"))) { %>
        <jsp:include page="/components/navbarLogin.jsp" />
    <% } else { %>
        <jsp:include page="/components/navbar.jsp" />
    <% } %>

    <div class="main-content">
        <div class="profile-container">
            <div class="profile-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <h1 style="text-align:center;font-family:'Montserrat',sans-serif;font-size:2.5em;margin-top:40px;letter-spacing:1px;font-weight:700;">Il tuo Profilo</h1>
            <div id="user-profile-data"></div>
            <div class="profile-sections">
                <button class="profile-tab" data-section="orders">Storico Ordini</button>
                <button class="profile-tab" data-section="wishlist">Wishlist</button>
                <button class="profile-tab" data-section="address">Indirizzo</button>
                <button class="profile-tab" data-section="admin" id="admin-tab">Admin</button>
                <button class="profile-tab logout-btn" data-section="logout">Logout</button>
            </div>
            <div class="profile-content">
                <div id="orders-section" class="profile-section" style="display:none;">
                    <h2>Storico Ordini</h2>
                    <div class="placeholder">Nessun ordine presente.</div>
                </div>
                <div id="wishlist-section" class="profile-section" style="display:none;">
                    <h2>Wishlist</h2>
                    <div class="placeholder">La tua wishlist è vuota.</div>
                </div>
                <div id="address-section" class="profile-section" style="display:none;">
                    <h2>Indirizzo</h2>
                    <div class="placeholder">Nessun indirizzo salvato.</div>
                </div>
                <div id="admin-section" class="profile-section" style="display:none;">
                    <h2>Pannello Amministratore</h2>
                    <div id="ordini-admin-filtri">
                        <label>Cliente:
                            <select id="filtro-cliente">
                                <option value="">Tutti</option>
                            </select>
                        </label>
                        <label>Data da:
                            <input type="date" id="filtro-data-da">
                        </label>
                        <label>a:
                            <input type="date" id="filtro-data-a">
                        </label>
                        <button id="applica-filtri">Applica filtri</button>
                        <button id="reset-filtri">Reset</button>
                    </div>
                    <div id="ordini-admin-tabella"></div>
                </div>
            </div>
        </div>
    </div>
    <% if (session.getAttribute("username") != null) { %>
    <script>window.username = '<%= session.getAttribute("username") %>';</script>
    <% } %>
    <script src="../../js/wishlist.js"></script>
    <script src="../../js/mobile-menu.js"></script>
    <script src="../../js/home.js"></script>
    <script src="../../js/profile.js"></script>
    <script src="../../js/auth.js"></script>
    <jsp:include page="/components/footer.jsp" />
</body>
</html>