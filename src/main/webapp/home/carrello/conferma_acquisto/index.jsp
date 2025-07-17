<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acquisto Confermato </title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../../css/conferma_ordine.css">
    <link rel="stylesheet" href="../../../css/navbar.css">
</head>
<body>
    <div class="main-content">
        <div class="modal_wait">
            <h1>Attendendo conferma dalla tua banca</h1>
            <div class="spinner"></div>
        </div>
        <div id="main-confirm-content">
            <h1>Grazie per il tuo ordine!</h1>
            <div class="subtitle">Il tuo acquisto &egrave; stato registrato con successo nel nostro sistema.</div>
            <div id="order-summary-box">
                <h2>Cosa hai acquistato</h2>
                <ul></ul>
                <div class="delivery-estimate">Consegna stimata: 2-4 giorni lavorativi</div>
            </div>
            <div class="support-text">
                &#128231; Riceverai una <strong>mail di conferma</strong> con i dettagli dell&rsquo;ordine entro pochi minuti.<br>
                &#127919; Per qualsiasi necessit&agrave; contatta il nostro <a href="mailto:supporto@enoriserva.it">servizio clienti</a>.
            </div>
            <div id="redirect-message" class="redirect-message">
                &#8634; Sarai automaticamente reindirizzato alla home page tra <span id="countdown">7</span> secondi.
            </div>
        </div>
    </div>
    <jsp:include page="/components/footer.jsp" />
    <script src="../../../js/conferma_ordine.js"></script>
</body>
</html>