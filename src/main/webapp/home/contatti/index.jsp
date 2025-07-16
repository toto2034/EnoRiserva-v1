<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contatti</title>
    <link rel="stylesheet" href="../../css/contatti_style.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../../css/carosello.css">
    <link rel="stylesheet" href="../../css/carrello.css">
    <link rel="stylesheet" href="../../css/navbar.css">
</head>
<body>
    <div class="main-content">
        <% request.setAttribute("activePage", "contatti"); %>
        <% if ("login".equals(request.getAttribute("navbarType"))) { %>
        <jsp:include page="/components/navbarLogin.jsp" />
    <% } else { %>
        <jsp:include page="/components/navbar.jsp" />
    <% } %>    

        <div class="contact-container">
            <h1 style="text-align:center;font-family:'Montserrat',sans-serif;font-size:2.5em;margin-top:40px;letter-spacing:1px;font-weight:700;">Il Nostro Team</h1>
            <div class="team-members">
                <div class="member-card">
                    <div class="member-image">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <h2>Antonio Boccia</h2>
                    <p class="role">Studente</p>

                </div>

                <div class="member-card">
                    <div class="member-image">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <h2>Giuseppe Capriglione</h2>
                    <p class="role">Studente</p>

                </div>

                <div class="member-card">
                    <div class="member-image">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <h2>Armando Annunziata</h2>
                    <p class="role">Studente</p>

                </div>
            </div>

            <div class="contact-form">
                <h2 style="text-align:center;font-family:'Montserrat',sans-serif;font-size:2.5em;margin-top:40px;letter-spacing:1px;font-weight:700;">Contattaci</h2>
                <form action="#" method="POST">
                    <div class="form-group">
                        <label for="name">Nome:</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Messaggio:</label>
                        <textarea id="message" name="message" required></textarea>
                    </div>
                    <button type="submit">Invia Messaggio</button>
                </form>
            </div>
        </div>
    </div>
    <jsp:include page="/components/footer.jsp" />
    <script src="../../js/mobile-menu.js"></script>
    <script src="../../js/home.js"></script>
</body>
</html>