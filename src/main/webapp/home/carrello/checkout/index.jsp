<!--<link rel="stylesheet" href="${pageContext.request.contextPath}/css/home_style.css">-->

<%@ page import="it.unisa.models.User" %>
<%--
  Questo blocco Java in cima alla pagina gestisce tutta la logica di sessione.
  Recupera l'utente dalla sessione. Se l'utente non è loggato, lo reindirizza
  immediatamente alla pagina di login.
--%>
<%
    User utente = (User) session.getAttribute("user");

    if (utente == null) {
        response.sendRedirect(request.getContextPath() + "/home/auth/");
        return; // Interrompe l'esecuzione della pagina
    }
%>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout - EnoRiserva</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    <%-- ==== PERCORSI CSS RIPRISTINATI ALLA TUA VERSIONE ORIGINALE E FUNZIONANTE ==== --%>
    <link rel="stylesheet" href="../../../css/home_style.css">
    <link rel="stylesheet" href="../../../css/carrello.css">
    <link rel="stylesheet" href="../../../css/carosello.css">
    <link rel="stylesheet" href="../../../css/navbar.css">
    <link rel="stylesheet" href="../../../css/checkout.css">

    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
</head>
<body>

<jsp:include page="/components/navbarLogin.jsp" />

<div class="main-content">
    <h1 class="checkout-title">Checkout</h1>
    <div class="checkout-amazon-layout">
        <div class="checkout-main-col">
            <!-- Indirizzo di Spedizione -->
            <section class="checkout-section dropdown-section">
                <button class="dropdown-toggle" id="shipping-toggle">
                    <i class="fas fa-map-marker-alt"></i> Indirizzo di spedizione <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-content" id="shipping-content">
                    <button class="dropdown-option" id="show-existing-shipping">Seleziona indirizzo esistente</button>
                    <button class="dropdown-option" id="show-new-shipping">Inserisci nuovo indirizzo</button>
                    <div id="existing-shipping-select">
                        <select class="address-select"></select>
                    </div>
                    <form id="new-shipping-form" class="address-form" style="display:none;">
                        <input type="text" name="nome" placeholder="Nome" class="address-input" required>
                        <input type="text" name="cognome" placeholder="Cognome" class="address-input" required>
                        <input type="text" name="via" placeholder="Via" class="address-input" required>
                        <input type="text" name="numeroCivico" placeholder="Numero civico" class="address-input">
                        <input type="text" name="citta" placeholder="Città" class="address-input" required>
                        <input type="text" name="cap" placeholder="CAP" class="address-input" required>
                        <input type="text" name="provincia" placeholder="Provincia" class="address-input" required>
                        <button type="submit" class="submit-address-btn">Salva indirizzo</button>
                    </form>
                </div>
            </section>

            <!-- Metodo di Pagamento -->
            <section class="checkout-section dropdown-section">
                <button class="dropdown-toggle" id="payment-toggle">
                    <i class="fas fa-credit-card"></i> Metodo di pagamento <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-content" id="payment-content">
                    <div class="payment-options">
                        <label class="payment-option">
                            <input type="radio" name="payment" value="card" checked id="pay-card">
                            <i class="fas fa-credit-card"></i> Carta di Credito
                        </label>
                        <div id="card-form" style="margin:10px 0 0 30px; display:block;">
                            <input type="text" class="address-input" placeholder="Numero carta">
                            <input type="text" class="address-input" placeholder="Intestatario">
                            <input type="text" class="address-input" placeholder="MM/AA" style="width:100px;display:inline-block;">
                            <input type="text" class="address-input" placeholder="CVV" style="width:80px;display:inline-block; margin-left:10px;">
                        </div>
                        <label class="payment-option">
                            <input type="radio" name="payment" value="domicilio" id="pay-home">
                            <i class="fas fa-truck"></i> Pagamento a domicilio
                        </label>
                    </div>
                </div>
            </section>

            <!-- Articoli nel carrello -->
            <section class="checkout-section cart-items-section">
                <h2><i class="fas fa-shopping-cart"></i> Articoli nel carrello</h2>
                <div class="cart-summary" id="cart-summary-list">
                    <div class="cart-empty">Caricamento carrello...</div>
                </div>
            </section>
        </div>

        <div class="checkout-side-col">
            <section class="checkout-section order-summary">
                <h2>Riepilogo Ordine</h2>
                <div class="summary-row">
                    <span>Spedizione</span>
                    <span id="shipping-cost">Gratis</span>
                </div>
                <div class="summary-row total">
                    <span>Totale</span>
                    <span id="checkout-total">€0.00</span>
                </div>
                <div id="selection-summary" style="margin:20px 0 10px 0; padding:10px; background:#f7f7f7; border-radius:8px; font-size:15px;"></div>
                <div class="checkout-actions">
                    <button type="button" class="checkout-btn" id="confirm-order-btn">Conferma Ordine</button>
                </div>
            </section>
        </div>
    </div>

    <%-- Le tue modali e popup possono rimanere qui --%>

</div>
<jsp:include page="/components/footer.jsp" />

<script src="../../../js/emailjs-config.js"></script>
<script src="../../../js/checkout.js"></script>


</body>
</html>