<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Pagina non trovata </title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="/EnoRiserva-v1/css/home_style.css">
    <link rel="stylesheet" href="/EnoRiserva-v1/css/navbar.css">
    <style>
        body {
            min-height: 100vh;
            margin: 0;
            font-family: 'Montserrat', sans-serif;
            background: #f8f9fc;
            display: flex;
            flex-direction: column;
        }
        .error-404-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .error-404-icon {
            font-size: 6em;
            color: #6e8efb;
            margin-bottom: 20px;
        }
        .error-404-title {
            font-size: 3em;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
        .error-404-message {
            font-size: 1.3em;
            color: #555;
            margin-bottom: 30px;
        }
        .error-404-actions a {
            display: inline-block;
            margin: 0 10px;
            padding: 12px 28px;
            background: linear-gradient(90deg, #6e8efb 0%, #a777e3 100%);
            color: #fff;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1em;
            transition: background 0.2s;
        }
        .error-404-actions a:hover {
            background: linear-gradient(90deg, #a777e3 0%, #6e8efb 100%);
        }
    </style>
</head>
<body>
    <jsp:include page="/components/navbar.jsp" />
    <div class="error-404-container">
        <div class="error-404-icon">
            <i class="fas fa-bed"></i>
        </div>
        <div class="error-404-title">404 - Pagina non trovata</div>
        <div class="error-404-message">
            Oops! La pagina che stai cercando non esiste o è stata rimossa.<br>
            Torna alla home o esplora il nostro catalogo.
        </div>
        <div class="error-404-actions">
            <a href="/EnoRiserva-v1/home">Home</a>
            <a href="/EnoRiserva-v1/home/catalogo/">Catalogo</a>
        </div>
    </div>
    <jsp:include page="/components/footer.jsp" />
</body>
</html>
