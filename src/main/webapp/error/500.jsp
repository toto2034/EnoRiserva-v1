<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>500 - Errore interno del server </title>
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
        .error-500-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .error-500-icon {
            font-size: 6em;
            color: #e57373;
            margin-bottom: 20px;
        }
        .error-500-title {
            font-size: 3em;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
        .error-500-message {
            font-size: 1.3em;
            color: #555;
            margin-bottom: 30px;
        }
        .error-500-actions a {
            display: inline-block;
            margin: 0 10px;
            padding: 12px 28px;
            background: linear-gradient(90deg, #e57373 0%, #ffb199 100%);
            color: #fff;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1em;
            transition: background 0.2s;
        }
        .error-500-actions a:hover {
            background: linear-gradient(90deg, #ffb199 0%, #e57373 100%);
        }
    </style>
</head>
<body>
    <jsp:include page="/components/navbar.jsp" />
    <div class="error-500-container">
        <div class="error-500-icon">
            <i class="fas fa-server"></i>
        </div>
        <div class="error-500-title">500 - Errore interno del server</div>
        <div class="error-500-message">
            Oops! Qualcosa è andato storto sul server.<br>
            Stiamo lavorando per risolvere il problema.<br>
            Puoi tornare alla home o riprovare più tardi.
        </div>
        <div class="error-500-actions">
            <a href="/EnoRiserva-v1/">Home</a>
            <a href="javascript:location.reload();">Ricarica pagina</a>
        </div>
    </div>
    <jsp:include page="/components/footer.jsp" />
</body>
</html>
