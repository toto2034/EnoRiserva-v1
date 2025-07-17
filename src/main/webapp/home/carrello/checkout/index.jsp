<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout </title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../../../css/home_style.css">
    <link rel="stylesheet" href="../../../css/carrello.css">
    <link rel="stylesheet" href="../../../css/carosello.css">
    <link rel="stylesheet" href="../../../css/navbar.css">
    <link rel="stylesheet" href="../../../css/checkout.css">
    <!-- EmailJS CDN -->
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
</head>
<body>
    <% if (session.getAttribute("username") != null) { %>
        <jsp:include page="/components/navbarLogin.jsp" />
    <% } else { %>
        <jsp:include page="/components/navbar.jsp" />
    <% } %>
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
                        <button class="dropdown-option" id="show-new-shipping">Inserisci nuovo indirizzo</button>
                        <button class="dropdown-option" id="show-existing-shipping">Seleziona indirizzo esistente</button>
                        <form id="new-shipping-form" class="address-form" style="display:none;">
                            <input type="text" name="nome" placeholder="Nome" class="address-input" required>
                            <input type="text" name="cognome" placeholder="Cognome" class="address-input" required>
                            <input type="text" name="via" placeholder="Via" class="address-input" required>
                            <input type="text" name="numeroCivico" placeholder="Numero civico" class="address-input" required>
                            <input type="text" name="citta" placeholder="Citt&agrave;" class="address-input" required>
                            <input type="text" name="cap" placeholder="CAP" class="address-input" required>
                            <input type="text" name="provincia" placeholder="Provincia" class="address-input" required>
                            <button type="submit" class="submit-address-btn">Salva indirizzo</button>
                        </form>
                        <div id="existing-shipping-select" style="display:none;">
                            <select class="address-select"></select>
                        </div>
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
                        <!-- Gli articoli verranno inseriti qui dal JavaScript -->
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
        <div id="address-success-popup" style="display:none;position:fixed;top:30px;left:50%;transform:translateX(-50%);background:#4caf50;color:#fff;padding:16px 32px;border-radius:8px;z-index:9999;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
            Indirizzo salvato correttamente!
        </div>
        <div id="order-error-modal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);z-index:10000;align-items:center;justify-content:center;">
          <div style="background:#fff;padding:32px 24px;border-radius:10px;max-width:350px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.2);position:relative;">
            <span id="order-error-modal-close" style="position:absolute;top:8px;right:16px;cursor:pointer;font-size:22px;">&times;</span>
            <div id="order-error-modal-msg" style="font-size:17px;color:#c00;margin-bottom:10px;"></div>
            <button onclick="document.getElementById('order-error-modal').style.display='none'" style="margin-top:10px;padding:7px 18px;font-size:15px;border:none;background:#4caf50;color:#fff;border-radius:5px;cursor:pointer;">OK</button>
          </div>
        </div>
        <script src="../../../js/emailjs-config.js"></script>
        <script src="../../../js/checkout.js"></script>
        <script src="../../../js/home.js"></script>
        <script>
            console.log('=== CHECKOUT PAGE LOADED ===');
            console.log('EmailJS disponibile:', typeof emailjs !== 'undefined');
            console.log('Funzione sendOrderConfirmationEmail disponibile:', typeof sendOrderConfirmationEmail !== 'undefined');
            console.log('EmailJS pronto:', window.emailjsReady);
            
            // Controllo che EmailJS sia completamente caricato
            if (typeof emailjs !== 'undefined') {
                console.log('EmailJS configurato correttamente');
            } else {
                console.error('ERRORE: EmailJS non è caricato!');
            }
        </script>
        <%
        boolean isLoggedIn = false;
        if (session != null && session.getAttribute("userLoggedIn") != null) {
            isLoggedIn = true;
        }
        %>
        <script>
            const userLoggedIn = "<%= isLoggedIn %>";
            console.log("userLoggedIn variabile JS:", userLoggedIn);
            console.log("Tipo:", typeof userLoggedIn);
        </script>
        <% if (session.getAttribute("username") != null) { %>
        <script>
            window.username = '<%= session.getAttribute("username") %>';
            console.log('Username dalla sessione:', window.username);
        </script>
        <% } else { %>
        <script>
            console.log('Nessun username nella sessione');
        </script>
        <% } %>
    </div>
    <jsp:include page="/components/footer.jsp" />
</body>
</html>