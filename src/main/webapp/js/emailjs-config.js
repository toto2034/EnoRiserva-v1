// Configurazione EmailJS
// Sostituisci questi valori con quelli del tuo account EmailJS

const EMAILJS_CONFIG = {
    PUBLIC_KEY: "yQL_4iWAh-VW2yjqU", 
    SERVICE_ID: "service_41x63yi", // ID del servizio email (es. Gmail, Outlook, etc.)
    TEMPLATE_ID: "template_rewrf4d" // ID del template email
};

console.log('EmailJS Config caricato:', EMAILJS_CONFIG);

// Inizializzazione EmailJS
(function() {
    console.log('Inizializzazione EmailJS...');
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('EmailJS inizializzato con successo');
        
        // Notifica che EmailJS è pronto
        if (typeof window !== 'undefined') {
            window.emailjsReady = true;
            console.log('EmailJS pronto per l\'uso');
        }
    } else {
        console.error('EmailJS non è caricato!');
        if (typeof window !== 'undefined') {
            window.emailjsReady = false;
        }
    }
})();

// Funzione per generare la fattura HTML
function generateInvoiceHTML(orderData, userData) {
    const currentDate = new Date().toLocaleDateString('it-IT');
    const orderNumber = orderData.idOrdine || 'ORD-' + Date.now();
    
    let productsHTML = '';
    let subtotale = 0;
    
    orderData.prodotti.forEach(item => {
        // Assicurati che prezzo e quantità siano numeri validi
        const prezzo = parseFloat(item.prezzo || item.price) || 0;
        const quantita = parseInt(item.quantita || item.quantity) || 1;
        const itemTotal = prezzo * quantita;
        subtotale += itemTotal;
        
        productsHTML += `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.nome || item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${quantita}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">&euro;${prezzo.toFixed(2)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">&euro;${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    // Calcola spedizione e totale
    const spedizione = subtotale >= 700 ? 0 : 15.90;
    const totale = subtotale + spedizione;

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 20px;">
            <div style="text-align: center; border-bottom: 2px solid #2e3a59; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="color: #2e3a59; margin: 0;">Enoriserva</h1>
                <p style="color: #666; margin: 5px 0;">Fattura</p>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                <div>
                    <h3 style="color: #2e3a59; margin: 0 0 10px 0;">Fatturato a:</h3>
                    <p style="margin: 5px 0;">${userData.nome} ${userData.cognome}</p>
                    <p style="margin: 5px 0;">${userData.email}</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 5px 0;"><strong>Numero Ordine:</strong> ${orderNumber}</p>
                    <p style="margin: 5px 0;"><strong>Data:</strong> ${currentDate}</p>
                </div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #2e3a59;">Prodotto</th>
                        <th style="padding: 12px; text-align: center; border-bottom: 2px solid #2e3a59;">Quantit&agrave;</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #2e3a59;">Prezzo Unit.</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #2e3a59;">Totale</th>
                    </tr>
                </thead>
                <tbody>
                    ${productsHTML}
                </tbody>
            </table>
            
            <div style="text-align: right; border-top: 2px solid #eee; padding-top: 20px;">
                <p style="margin: 5px 0;"><strong>Subtotale:</strong> &euro;${subtotale.toFixed(2)}</p>
                <p style="margin: 5px 0;"><strong>Spedizione:</strong> ${spedizione === 0 ? 'Gratuita' : '&euro;' + spedizione.toFixed(2)}</p>
                <h2 style="color: #2e3a59; margin: 10px 0;"><strong>Totale: &euro;${totale.toFixed(2)}</strong></h2>
            </div>
            
            <div style="margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <h3 style="color: #2e3a59; margin: 0 0 10px 0;">Grazie per il tuo acquisto!</h3>
                <p style="margin: 5px 0;">Il tuo ordine &egrave; stato confermato e verr&agrave; spedito entro 2-4 giorni lavorativi.</p>
                <p style="margin: 5px 0;">Per qualsiasi domanda, contattaci a: supporto@enoriserva.it</p>
            </div>
        </div>
    `;
}

// Funzione per inviare email con fattura
function sendOrderConfirmationEmail(orderData, userData) {
    console.log('=== INIZIO sendOrderConfirmationEmail ===');
    
    if (!emailjs || !EMAILJS_CONFIG) {
        console.error('EmailJS o la sua configurazione non sono disponibili!');
        return;
    }
    
    // Controllo che EmailJS sia pronto
    if (typeof window !== 'undefined' && !window.emailjsReady) {
        console.error('EmailJS non è ancora pronto!');
        return;
    }
    
    // Genero l'HTML per la sola tabella della fattura
    const invoiceHTML = generateInvoiceHTML(orderData, userData);

    // Preparo i parametri ESATTAMENTE come li vuole il template EmailJS.
    const templateParams = {
        to_email: userData.email,
        to_name: `${userData.nome} ${userData.cognome}`,
        order_number: orderData.idOrdine || 'N/A',
        total_amount: `&euro;${orderData.totale.toFixed(2)}`,
        delivery_method: orderData.metodoPagamento === 'CARTA' ? 'Pagamento con carta' : 'Pagamento a domicilio',
        invoice_html: invoiceHTML // Questo va in {{{invoice_html}}}
    };

    console.log('Invio email a:', templateParams.to_email);
    console.log('Con parametri:', templateParams);

    // Invio l'email
    emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('SUCCESS! Email inviata.', response.status, response.text);
        }, function(error) {
            console.error('FAILED... Errore nell\'invio email:', error);
        });
}

// Espone la funzione globalmente per assicurarsi che sia disponibile
if (typeof window !== 'undefined') {
    window.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
    console.log('sendOrderConfirmationEmail esposta globalmente');
} 