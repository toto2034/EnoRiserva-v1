<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<% String ctx = request.getContextPath(); %>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Articolo - EnoRiserva</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    <!-- Percorsi CSS corretti -->
    <link rel="stylesheet" href="<%= ctx %>/css/home_style.css">
    <link rel="stylesheet" href="<%= ctx %>/css/product_style.css">
    <link rel="stylesheet" href="<%= ctx %>/css/carosello.css">
    <link rel="stylesheet" href="<%= ctx %>/css/carrello.css">
    <link rel="stylesheet" href="<%= ctx %>/css/navbar.css">
    <link rel="stylesheet" href="<%= ctx %>/css/wishlist.css">
</head>
<body>
<div class="main-content">
    <% request.setAttribute("activePage", "catalogo"); %>
    <% if (session.getAttribute("username") != null) { %>
    <jsp:include page="/components/navbarLogin.jsp" />
    <% } else { %>
    <jsp:include page="/components/navbar.jsp" />
    <% } %>

    <div id="loading" style="text-align: center; padding: 50px;">
        <i class="fas fa-spinner fa-spin" style="font-size: 2em; color: #6e8efb;"></i>
        <p>Caricamento articolo...</p>
    </div>

    <%-- Il contenuto dinamico del prodotto verrà probabilmente inserito qui da product.js --%>

</div>
<jsp:include page="/components/footer.jsp" />

<!-- Percorsi JS corretti -->
<script src="<%= ctx %>/js/wishlist.js"></script>
<script src="<%= ctx %>/js/mobile-menu.js"></script>
<script src="<%= ctx %>/js/home.js"></script>
<script src="<%= ctx %>/js/cart.js"></script>
<script src="<%= ctx %>/js/reviews.js"></script>
<script src="<%= ctx %>/js/product.js"></script>
</body>
</html>