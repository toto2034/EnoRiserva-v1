<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../../css/home_style.css">
    <link rel="stylesheet" href="../../css/auth.css">
    <link rel="stylesheet" href="../../css/carosello.css">
    <link rel="stylesheet" href="../../css/carrello.css">
    <link rel="stylesheet" href="../../css/navbar.css">
    <title>Autenticazione</title>
</head>
<body>
    <div class="main-content">
        <% request.setAttribute("activePage", "auth"); %>
        <jsp:include page="/components/navbar.jsp" />
        <div class="auth-container">
            <div class="auth-card slider-card" id="auth-slider">
                <div class="form-wrapper login-wrapper active" id="login-wrapper">
                    <h1 style="text-align:center;font-family:'Montserrat',sans-serif;font-size:2.5em;margin-top:40px;letter-spacing:1px;font-weight:700;">Accedi</h1>
                    <form id="login-form" action="/EnoRiserva-v1/auth/login" method="post" class="auth-form">
                        <label for="login-username">Username:</label>
                        <input type="text" id="login-username" name="username" required>
                        <label for="login-password">Password:</label>
                        <input type="password" id="login-password" name="password" required>
                        <button type="submit" class="auth-button">Accedi</button>
                    </form>
                    <p class="switch-text">Non sei registrato?
                        <button type="button" class="switch-link" id="show-register">Registrati</button>
                    </p>
                </div>
                <div class="form-wrapper register-wrapper" id="register-wrapper">
                    <h1 style="text-align:center;font-family:'Montserrat',sans-serif;font-size:2.5em;margin-top:40px;letter-spacing:1px;font-weight:700;">Registrati</h1>
                    <form action="/EnoRiserva-v1/auth/register" method="post" class="auth-form" id="register-form">
                        <label for="register-username">Username:</label>
                        <input type="text" id="register-username" name="username" required>
                        <label for="register-nome">Nome:</label>
                        <input type="text" id="register-nome" name="nome" required>
                        <label for="register-cognome">Cognome:</label>
                        <input type="text" id="register-cognome" name="cognome" required>
                        <label for="register-email">Email:</label>
                        <input type="email" id="register-email" name="email" required>
                        <label for="register-password">Password:</label>
                        <input type="password" id="register-password" name="password" required>
                        <button type="submit">Registrati</button>
                    </form>
                    <p class="switch-text">Hai gi&agrave; un account?
                        <button type="button" class="switch-link" id="show-login">Accedi</button>
                    </p>
                    <p><a href="EnoRiserva-v1/home" class="back-home"><i class="fa fa-arrow-left"></i> Torna alla home</a></p>
                </div>
            </div>
        </div>
    </div>
    <jsp:include page="/components/footer.jsp" />
    <script src="../../js/mobile-menu.js"></script>
    <script src="../../js/auth.js"></script>
    <script src="../../js/home.js"></script>
</body>
</html>