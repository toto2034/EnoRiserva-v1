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
    <link rel="stylesheet" href="../../css/cart_style.css">
    <link rel="stylesheet" href="../../css/carosello.css">
    <link rel="stylesheet" href="../../css/carrello.css">
    <link rel="stylesheet" href="../../css/navbar.css">
    <title>Il tuo Carrello </title>
</head>
<body>

    <% request.setAttribute("activePage", "carrello"); %>
    <% if ("login".equals(request.getAttribute("navbarType"))) { %>
    <jsp:include page="/components/navbarLogin.jsp" />
<% } else { %>
    <jsp:include page="/components/navbar.jsp" />
<% } %>

    <div class="main-content">
        <div class="cart-container">
            <div class="cart-title">
                <h1 style="color: black;">Il tuo Carrello</h1>
            </div>

            <div id="cart-content">
                <!-- Il contenuto del carrello sarà caricato dinamicamente -->
                <div class="cart-empty">
                    <p>Caricamento del carrello...</p>
                </div>
            </div>

            <!-- Aggiungo un messaggio di stato per l'autenticazione -->
            <div id="auth-status" class="cart-info" style="margin-top: 20px; text-align: center; display: none;">
                <p></p>
            </div>
        </div>
    </div>

    <%
        // Controlla l'autenticazione in modo coerente con CartServlet
        Boolean isLoggedIn = Boolean.FALSE;
        if (session != null && session.getAttribute("userLoggedIn") != null) {
            isLoggedIn = Boolean.TRUE;
        }
        pageContext.setAttribute("isLoggedIn", isLoggedIn);

        // Debug info sessione
        out.println("<!-- DEBUG SESSIONE -->");
        out.println("<!-- ID Sessione: " + session.getId() + " -->");
        out.println("<!-- Creata il: " + new java.util.Date(session.getCreationTime()) + " -->");
        out.println("<!-- Ultimo accesso: " + new java.util.Date(session.getLastAccessedTime()) + " -->");
        out.println("<!-- User attribute: " + session.getAttribute("user") + " -->");
        out.println("<!-- UserLoggedIn attribute: " + session.getAttribute("userLoggedIn") + " -->");
        out.println("<!-- IsLoggedIn calcolato: " + isLoggedIn + " -->");
    %>
    <script>
        const userLoggedIn = "<%= isLoggedIn %>";
        console.log("===== DEBUG AUTENTICAZIONE JSP =====");
        console.log("Valore raw da JSP:", "<%= isLoggedIn %>");
        console.log("userLoggedIn variabile JS:", userLoggedIn);
        console.log("Tipo:", typeof userLoggedIn);
        console.log("===================================");
    </script>
    <script src="../../js/mobile-menu.js"></script>
    <script src="../../js/home.js"></script>
    <script src="../../js/cart.js"></script>
    <jsp:include page="/components/footer.jsp" />
</body>
</html>