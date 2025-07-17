// Gestione dropdown indirizzo
        document.getElementById('shipping-toggle').addEventListener('click', function() {
            const content = document.getElementById('shipping-content');
            content.style.display = content.style.display === 'none' || content.style.display === '' ? 'block' : 'none';
        });

        document.getElementById('show-new-shipping').addEventListener('click', function() {
            document.getElementById('new-shipping-form').style.display = 'block';
            document.getElementById('existing-shipping-select').style.display = 'none';
        });

        document.getElementById('show-existing-shipping').addEventListener('click', function() {
            document.getElementById('new-shipping-form').style.display = 'none';
            document.getElementById('existing-shipping-select').style.display = 'block';
        });

        // Gestione dropdown pagamento
        document.getElementById('payment-toggle').addEventListener('click', function() {
            const content = document.getElementById('payment-content');
            content.style.display = content.style.display === 'none' || content.style.display === '' ? 'block' : 'none';
        });

        // Mostra/nascondi form carta di credito
        document.getElementById('pay-card').addEventListener('change', function() {
            document.getElementById('card-form').style.display = 'block';
        });
        document.getElementById('pay-home').addEventListener('change', function() {
            document.getElementById('card-form').style.display = 'none';
        });

function getCartItems() {
    return new Promise((resolve) => {
        
        // Controlla se l'utente è loggato usando la stessa logica di cart.js
        const isAuth = (typeof userLoggedIn !== 'undefined' && 
                       (userLoggedIn === 'true' || userLoggedIn === true || 
                        userLoggedIn === 'True' || userLoggedIn === 'TRUE' || 
                        userLoggedIn === 'on' || userLoggedIn === '1'));
                                
        if (isAuth) {
            fetch('/EnoRiserva-v1/api/cart/get', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Cache-Control': 'no-cache' }
            })
            .then(res => {
                 return res.json();
            })
            .then(data => {
                 if (data.error) {
                     resolve([]);
                } else if (data.carrello && Array.isArray(data.carrello)) {
                    // Nuovo formato: data.carrello contiene l'array
                     resolve(data.carrello);
                } else if (Array.isArray(data)) {
                    // Vecchio formato: data è direttamente l'array
                     resolve(data);
                } else {
                     resolve([]);
                }
            })
            .catch(err => {
                console.error('Errore nel caricamento del carrello:', err);
                resolve([]);
            });
        } else {
            console.log('Utente non autenticato, carico dal localStorage...');
            const local = localStorage.getItem('carrello');
            try {
                const items = local ? JSON.parse(local) : [];
                console.log('Carrello localStorage:', items);
                resolve(items);
            } catch (err) {
                console.error('Errore parsing localStorage:', err);
                resolve([]);
            }
        }
    });
}

function renderCartItems(items) {
    const el = document.getElementById('cart-summary-list');
    
    if (!el) {
        console.error('Element cart-summary-list not found');
        return;
    }
    
    el.innerHTML = '';
    
    if (!items || items.length === 0) {
        el.innerHTML = '<div class="cart-empty">Il carrello &egrave; vuoto</div>';
        document.getElementById('checkout-total').textContent = '\u20AC0.00';
        if(document.getElementById('shipping-cost')) document.getElementById('shipping-cost').textContent = 'Gratis';
        return;
    }
    
    let total = 0;
    items.forEach(item => {
        // Gestisce sia il nuovo formato (item.articolo) che il vecchio formato
        const articolo = item.articolo || item;
        const nome = articolo.nome || articolo.name || item.nome || item.name;
        
        // Assicurati che prezzo e quantità siano numeri validi
        let prezzo = 0;
        let quantita = 1;
        
        try {
            prezzo = parseFloat(articolo.prezzo || articolo.price || item.prezzo || item.price) || 0;
            quantita = parseInt(item.quantita || item.quantity) || 1;
        } catch (e) {
            console.error('Errore parsing numeri per item:', item, e);
            prezzo = 0;
            quantita = 1;
        }
        
        const img = articolo.img || articolo.immagine || item.img || item.immagine;
        
        const itemTotal = prezzo * quantita;
        total += itemTotal;
        
        console.log('Debug item checkout:', {
            id: item.id || item.idArticolo,
            nome: nome,
            prezzo: prezzo,
            quantita: quantita,
            itemTotal: itemTotal
        });
        
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';

        console.log('Debug immagine prodotto:', item.id || item.idArticolo, img);
        
        itemElement.innerHTML = `
            <img src="${img}" alt="${nome}" class="checkout-item-image">
            <div class="checkout-item-details">
                <div class="checkout-item-name">${nome}</div>
                <div class="checkout-item-price">
                    \u20AC${prezzo.toFixed(2)}
                    <span class="checkout-item-quantity">x${quantita}</span>
                </div>
            </div>
            <div class="checkout-item-total">\u20AC${itemTotal.toFixed(2)}</div>
        `;
        el.appendChild(itemElement);
    });
    let shipping = 0;
    if (total < 700) {
        shipping = 15.90;
        if(document.getElementById('shipping-cost')) document.getElementById('shipping-cost').textContent = '\u20AC15,90';
    } else {
        if(document.getElementById('shipping-cost')) document.getElementById('shipping-cost').textContent = 'Gratis';
    }
    document.getElementById('checkout-total').textContent = `\u20AC${(total+shipping).toFixed(2)}`;
}

function emptyCartAndRedirect(callback) {
    // Controlla se l'utente è loggato usando la stessa logica di cart.js
    const isAuth = (typeof userLoggedIn !== 'undefined' && 
                   (userLoggedIn === 'true' || userLoggedIn === true || 
                    userLoggedIn === 'True' || userLoggedIn === 'TRUE' || 
                    userLoggedIn === 'on' || userLoggedIn === '1'));
    
    if (isAuth) {
        // Utente loggato: svuota carrello nel database
        fetch('/EnoRiserva-v1/api/cart/clear', {
            method: 'DELETE', 
            credentials: 'include' 
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Carrello svuotato con successo nel database');
            } else {
                console.error('Errore nello svuotamento del carrello:', data.error);
            }
            callback();
        })
        .catch(error => {
            console.error('Errore nella chiamata API per svuotare il carrello:', error);
            callback();
        });
    } else {
        // Utente non loggato: svuota localStorage
        localStorage.removeItem('carrello');
        console.log('Carrello svuotato dal localStorage');
        callback();
    }
}

function caricaIndirizziUtente() {
    fetch('/EnoRiserva-v1/indirizzo/lista', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        const selectDiv = document.getElementById('existing-shipping-select');
        const select = selectDiv.querySelector('select.address-select');
        select.innerHTML = '';
        if (!data || data.length === 0) {
            select.style.display = 'none';
            if (!document.getElementById('no-address-msg')) {
                const msg = document.createElement('div');
                msg.id = 'no-address-msg';
                msg.textContent = 'Non hai indirizzi salvati.';
                selectDiv.appendChild(msg);
            }
        } else {
            select.style.display = '';
            const msg = document.getElementById('no-address-msg');
            if (msg) msg.remove();
            data.forEach(ind => {
                const opt = document.createElement('option');
                opt.value = ind.id;
                opt.textContent = `${ind.nome} ${ind.cognome}, ${ind.via} ${ind.numeroCivico}, ${ind.citta} (${ind.provincia}), ${ind.cap}`;
                select.appendChild(opt);
            });
        }
    })
    .catch(() => {
        const selectDiv = document.getElementById('existing-shipping-select');
        selectDiv.innerHTML = '<div style="color:red">Errore nel caricamento degli indirizzi</div>';
    });
}

/**
 * Valida il formato MM/AA della data di scadenza della carta
 * @param {string} scad - La data nel formato MM/AA
 * @returns {boolean} - true se la data è valida, false altrimenti
 */
function validaDataScadenza(scad) {
    // Verifica formato MM/AA
    if (!/^\d{2}\/\d{2}$/.test(scad)) {
        return false;
    }
    
    // Estrai mese e anno
    const [mese, anno] = scad.split('/');
    const meseNum = parseInt(mese, 10);
    const annoNum = parseInt(anno, 10);
    
    // Verifica che il mese sia valido (01-12)
    if (meseNum < 1 || meseNum > 12) {
        return false;
    }
    
    // Calcola l'anno completo (assumiamo anni 2000+)
    const annoCompleto = 2000 + annoNum;
    
    // Verifica che la data non sia scaduta
    const oggi = new Date();
    const annoCorrente = oggi.getFullYear();
    const meseCorrente = oggi.getMonth() + 1; // getMonth() restituisce 0-11
    
    // Se l'anno è passato, la carta è scaduta
    if (annoCompleto < annoCorrente) {
        return false;
    }
    
    // Se è lo stesso anno, verifica che il mese non sia passato
    if (annoCompleto === annoCorrente && meseNum < meseCorrente) {
        return false;
    }
    
    return true;
}

function validaFormCheckout() {
    console.log('Avvio validazione form checkout...');
    
    // 1. Validazione Metodo di Pagamento
    const payCard = document.getElementById('pay-card');
    const payHome = document.getElementById('pay-home');
    const paymentSelected = payCard.checked || payHome.checked;

    if (!paymentSelected) {
        console.warn('Validazione fallita: metodo di pagamento non selezionato.');
        return { isValid: false, message: 'Seleziona un metodo di pagamento.' };
    }

    // 2. Validazione Dati Carta (solo se la carta è selezionata)
    if (payCard.checked) {
        const cardForm = document.getElementById('card-form');
        const num = cardForm.querySelector('input[placeholder="Numero carta"]').value;
        const int = cardForm.querySelector('input[placeholder="Intestatario"]').value;
        const scad = cardForm.querySelector('input[placeholder="MM/AA"]').value;
        const cvv = cardForm.querySelector('input[placeholder="CVV"]').value;
        
        // Validazione base dei campi
        if (!num || !int || !scad || !cvv) {
            console.warn('Validazione fallita: campi carta incompleti.');
            return { isValid: false, message: 'Compila tutti i campi della carta di credito.' };
        }
        
        // Validazione numero carta
        if (!/^\d{13,19}$/.test(num)) {
            console.warn('Validazione fallita: numero carta non valido.');
            return { isValid: false, message: 'Il numero della carta deve contenere 13-19 cifre.' };
        }
        
        // Validazione CVV
        if (!/^\d{3,4}$/.test(cvv)) {
            console.warn('Validazione fallita: CVV non valido.');
            return { isValid: false, message: 'Il CVV deve contenere 3-4 cifre.' };
        }
        
        // Validazione data di scadenza
        if (!validaDataScadenza(scad)) {
            console.warn('Validazione fallita: data di scadenza non valida.');
            return { isValid: false, message: 'Attenzione: la data di scadenza non \u00E8 valida.' };
        }
    }

    // 3. Validazione Indirizzo
    const newForm = document.getElementById('new-shipping-form');
    const newFormVisible = newForm && newForm.style.display !== 'none';
    let indirizzoOk = false;
    if (newFormVisible) {
        indirizzoOk = Array.from(newForm.elements).every(el => !el.required || el.value.trim() !== '');
    } else {
        const select = document.querySelector('#existing-shipping-select select.address-select');
        indirizzoOk = select && select.style.display !== 'none' && select.value;
    }

    if (!indirizzoOk) {
        console.warn('Validazione fallita: indirizzo non selezionato o incompleto.');
        return { isValid: false, message: 'Seleziona o inserisci un indirizzo di spedizione valido.' };
    }

    console.log('Validazione completata con successo.');
    return { isValid: true, message: 'OK' };
}

window.addEventListener('DOMContentLoaded', function() {
    console.log('Inizializzazione checkout...');
    getCartItems()
        .then(items => {
            console.log('Articoli caricati:', items);
            renderCartItems(items);
        })
        .catch(err => {
            console.error('Errore durante il caricamento degli articoli:', err);
        });
    const form = document.getElementById('new-shipping-form');
    if (form) {
        form.addEventListener('submit', salvaNuovoIndirizzo);
    }
    document.getElementById('show-existing-shipping').addEventListener('click', function() {
        document.getElementById('new-shipping-form').style.display = 'none';
        document.getElementById('existing-shipping-select').style.display = 'block';
        caricaIndirizziUtente();
    });
    
    function aggiornaRiepilogoSelezione() {
        const summary = document.getElementById('selection-summary');
        if (!summary) return;
        // Indirizzo
        let indirizzo = '';
        const newForm = document.getElementById('new-shipping-form');
        const newFormVisible = newForm && newForm.style.display !== 'none';
        if (newFormVisible) {
            const nome = newForm.querySelector('[name="nome"]').value;
            const cognome = newForm.querySelector('[name="cognome"]').value;
            const via = newForm.querySelector('[name="via"]').value;
            const numeroCivico = newForm.querySelector('[name="numeroCivico"]').value;
            const citta = newForm.querySelector('[name="citta"]').value;
            const cap = newForm.querySelector('[name="cap"]').value;
            const provincia = newForm.querySelector('[name="provincia"]').value;
            if (nome && cognome && via && numeroCivico && citta && cap && provincia) {
                indirizzo = `${nome} ${cognome}, ${via} ${numeroCivico}, ${citta} (${provincia}), ${cap}`;
            }
        } else {
            const selectDiv = document.getElementById('existing-shipping-select');
            const select = selectDiv ? selectDiv.querySelector('select.address-select') : null;
            if (select && select.style.display !== 'none' && select.selectedOptions.length > 0) {
                indirizzo = select.selectedOptions[0].textContent;
            }
        }
        // Metodo di pagamento
        let pagamento = '';
        const payCard = document.getElementById('pay-card');
        const payHome = document.getElementById('pay-home');
        if (payCard && payCard.checked) {
            const cardForm = document.getElementById('card-form');
            const num = cardForm.querySelector('input[placeholder="Numero carta"]').value;
            const int = cardForm.querySelector('input[placeholder="Intestatario"]').value;
            const scad = cardForm.querySelector('input[placeholder="MM/AA"]').value;
            // Maschera la carta
            let masked = '';
            if (num && num.length >= 7) {
                masked = num.substring(0,3) + '*'.repeat(num.length-7) + num.substring(num.length-4);
            } else if (num) {
                masked = num;
            }
            pagamento = `Carta di credito${masked ? ' ('+masked+')' : ''}${int ? ', '+int : ''}${scad ? ', scad. '+scad : ''}`;
        } else if (payHome && payHome.checked) {
            pagamento = 'Pagamento a domicilio';
        }
        summary.innerHTML =
            `<b>Indirizzo:</b> ${indirizzo ? indirizzo : '<span style="color:#c00">Non selezionato</span>'}<br>`+
            `<b>Pagamento:</b> ${pagamento ? pagamento : '<span style="color:#c00">Non selezionato</span>'}`;
    }

    setInterval(aggiornaRiepilogoSelezione, 400); // Aggiorna ogni 400ms

    // Blocco conferma ordine se non selezionati indirizzo e pagamento e validazione carta
    const confirmBtn = document.getElementById('confirm-order-btn');
    if (confirmBtn) {
        // Rimuovi tutti gli event listener esistenti
        const newBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('=== CLICK CONFERMA ORDINE ===');
            const validationResult = validaFormCheckout();
            console.log('Risultato validazione:', validationResult);
            
            if (!validationResult.isValid) {
                console.log('Validazione fallita:', validationResult.message);
                mostraOrderErrorModal(validationResult.message);
            } else {
                console.log('Validazione OK, chiamo creaOrdineBackend');
                // Chiama la funzione per creare l'ordine nel backend
                creaOrdineBackend();
            }
        });
    }
});

// Funzione per mostrare il popup di successo
function showAddressSuccessPopup() {
    const popup = document.getElementById('address-success-popup');
    if (!popup) return;
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
}

// Funzione per mostrare la modale di errore
function mostraOrderErrorModal(msg) {
    const modal = document.getElementById('order-error-modal');
    const msgDiv = document.getElementById('order-error-modal-msg');
    if (modal && msgDiv) {
        msgDiv.textContent = msg;
        modal.style.display = 'flex';
    }
    const closeBtn = document.getElementById('order-error-modal-close');
    if (closeBtn) {
        closeBtn.onclick = () => { modal.style.display = 'none'; };
    }
}

// Funzione per inviare il nuovo indirizzo
function salvaNuovoIndirizzo(event) {
    event.preventDefault();
    const form = document.getElementById('new-shipping-form');
    if (!form) return;
    // Serializza i dati manualmente per application/x-www-form-urlencoded
    const formData = new URLSearchParams();
    for (const el of form.elements) {
        if (el.name && !el.disabled) {
            formData.append(el.name, el.value);
        }
    }
    fetch('/EnoRiserva-v1/indirizzo/nuovo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString(),
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showAddressSuccessPopup();
            form.reset();
        } else {
            alert('Errore: ' + (data.message || 'Impossibile salvare l\'indirizzo'));
        }
    })
    .catch(() => alert('Errore di comunicazione col server'));
}

function creaOrdineBackend() {
    console.log('=== INIZIO creaOrdineBackend ===');
    
    // Verifica che l'utente sia loggato usando la stessa logica di cart.js
    const isAuth = (typeof userLoggedIn !== 'undefined' && 
                   (userLoggedIn === 'true' || userLoggedIn === true || 
                    userLoggedIn === 'True' || userLoggedIn === 'TRUE' || 
                    userLoggedIn === 'on' || userLoggedIn === '1'));
    
    if (!isAuth) {
        console.error('Utente non loggato');
        mostraOrderErrorModal('Devi essere loggato per completare l\'ordine.');
        return;
    }
    
    console.log('Username:', window.username);
    
    // Recupera articoli dal carrello
    getCartItems().then(prodotti => {
        console.log('Prodotti dal carrello:', prodotti);
        
        if (!prodotti || prodotti.length === 0) {
            console.log('Carrello vuoto, mostro errore');
            mostraOrderErrorModal('Il carrello è vuoto.');
            return;
        }
        
        // Calcola totale
        let totale = 0;
        prodotti.forEach(item => {
            // Gestisce sia il nuovo formato (item.articolo) che il vecchio formato
            const articolo = item.articolo || item;
            
            // Assicurati che prezzo e quantità siano numeri validi
            let prezzo = 0;
            let quantita = 1;
            
            try {
                prezzo = parseFloat(articolo.prezzo || articolo.price || item.prezzo || item.price) || 0;
                quantita = parseInt(item.quantita || item.quantity) || 1;
            } catch (e) {
                console.error('Errore parsing numeri per item:', item, e);
                prezzo = 0;
                quantita = 1;
            }
            
            totale += prezzo * quantita;
        });
        if (totale < 700) totale += 15.90; // Spedizione
        
        console.log('Totale calcolato:', totale);
        
        // Recupera ID indirizzo
        let idIndirizzo = null;
        const newForm = document.getElementById('new-shipping-form');
        const newFormVisible = newForm && newForm.style.display !== 'none';
        if (!newFormVisible) {
            const select = document.querySelector('#existing-shipping-select select.address-select');
            if (select && select.value) {
                idIndirizzo = select.value;
            }
        }
        
        console.log('ID Indirizzo:', idIndirizzo);
        
        if (!idIndirizzo) {
            console.log('Nessun indirizzo selezionato, mostro errore');
            mostraOrderErrorModal('Seleziona un indirizzo esistente per procedere.');
            return;
        }
        
        // Metodo pagamento
        let metodoPagamento = '';
        if (document.getElementById('pay-card').checked) {
            metodoPagamento = 'CARTA';
        } else if (document.getElementById('pay-home').checked) {
            metodoPagamento = 'DOMICILIO';
        }
        
        console.log('Metodo pagamento:', metodoPagamento);
        
        // Prepara dati per servlet
        const prodottiJson = JSON.stringify(prodotti.map(item => {
            // Gestisce sia il nuovo formato (item.articolo) che il vecchio formato
            const articolo = item.articolo || item;
            
            // Assicurati che prezzo e quantità siano numeri validi
            let prezzo = 0;
            let quantita = 1;
            
            try {
                prezzo = parseFloat(articolo.prezzo || articolo.price || item.prezzo || item.price) || 0;
                quantita = parseInt(item.quantita || item.quantity) || 1;
            } catch (e) {
                console.error('Errore parsing numeri per item:', item, e);
                prezzo = 0;
                quantita = 1;
            }
            
            return {
                id: item.id || item.idArticolo,
                nome: articolo.nome || articolo.name || item.nome || item.name,
                quantita: quantita,
                prezzo: prezzo.toString()
            };
        }));
        
        const formData = new URLSearchParams();
        formData.append('idIndirizzo', idIndirizzo);
        formData.append('metodoPagamento', metodoPagamento);
        formData.append('totale', totale.toString());
        formData.append('prodotti', prodottiJson);
        
        console.log('Dati da inviare al server:', formData.toString());
        
        // Invia alla servlet
        fetch('/EnoRiserva-v1/ordine/crea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString(),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            console.log('Risposta dal server:', data);
            
            if (data.success) {
                console.log('Ordine creato con successo, procedo con email');
                
                // Salva i prodotti per la pagina di conferma. Questa riga è FONDAMENTALE.
                const prodottiNomi = prodotti.map(item => {
                    // Gestisce sia il nuovo formato (item.articolo) che il vecchio formato
                    const articolo = item.articolo || item;
                    const nome = articolo.nome || articolo.name || item.nome || item.name;
                    
                    // Assicurati che quantità sia un numero valido
                    let quantita = 1;
                    try {
                        quantita = parseInt(item.quantita || item.quantity) || 1;
                    } catch (e) {
                        console.error('Errore parsing quantità per item:', item, e);
                        quantita = 1;
                    }
                    
                    return nome + ' x' + quantita;
                });
                localStorage.setItem('prodottiConfermati', JSON.stringify(prodottiNomi));
                
                // Recupera dati utente per l'email
                const username = window.username || sessionStorage.getItem('username') || localStorage.getItem('username');
                console.log('Username per recupero dati:', username);
                
                if (!username) {
                    console.error('Utente non loggato, redirect al login');
                    mostraOrderErrorModal('Devi essere loggato per completare l\'ordine. Verrai reindirizzato alla pagina di login.');
                    setTimeout(() => {
                        window.location.href = '/EnoRiserva-v1/home/auth/';
                    }, 2000);
                    return;
                }
                
                fetch('/EnoRiserva-v1/utenti/userbyid?username=' + encodeURIComponent(username))
                    .then(res => res.json())
                    .then(userData => {
                        console.log('Dati utente recuperati:', userData);
                        if (!userData.error) {
                            // Prepara dati ordine per l'email
                            const orderData = {
                                idOrdine: data.idOrdine,
                                prodotti: prodotti,
                                totale: totale,
                                metodoPagamento: metodoPagamento
                            };
                            
                            console.log('Dati ordine per email:', orderData);
                            console.log('Email destinatario:', userData.email);
                            
                            // Invia email di conferma
                            console.log('=== DEBUG EMAIL ===');
                            console.log('EmailJS disponibile:', typeof emailjs !== 'undefined');
                            console.log('sendOrderConfirmationEmail disponibile:', typeof sendOrderConfirmationEmail !== 'undefined');
                            console.log('orderData:', orderData);
                            console.log('userData:', userData);
                            
                            if (typeof sendOrderConfirmationEmail === 'function') {
                                sendOrderConfirmationEmail(orderData, userData);
                                console.log('Email inviata, procedo con redirect');
                            } else {
                                console.error('ERRORE: sendOrderConfirmationEmail non è disponibile!');
                            }
                            
                            // Svuota carrello e redirect DOPO l'invio email
                            emptyCartAndRedirect(function() {
                                if (metodoPagamento === 'CARTA') {
                                    window.location.href = '/EnoRiserva-v1/home/carrello/conferma_acquisto/?ordine=' + data.idOrdine + '&dom=false';
                                    return;
                                }else if(metodoPagamento === 'DOMICILIO') {
                                    window.location.href = '/EnoRiserva-v1/home/carrello/conferma_acquisto/?ordine=' + data.idOrdine+ '&dom=true';
                                    return;
                                }
                            });
                        } else {
                            console.error('Errore nel recupero dati utente:', userData.error);
                        }
                    })
                    .catch(err => {
                        console.error('Errore nel recupero dati utente per email:', err);
                    });
            } else {
                console.log('Errore nella creazione ordine:', data.message);
                mostraOrderErrorModal('Errore nella creazione dell\'ordine: ' + (data.message || 'Errore sconosciuto'));
            }
        })
        .catch((error) => {
            console.error('Errore di comunicazione con il server:', error);
            mostraOrderErrorModal('Errore di comunicazione con il server.');
        });
    }).catch(err => {
        console.error('Errore nel recupero prodotti dal carrello:', err);
        mostraOrderErrorModal('Errore nel recupero prodotti dal carrello.');
    });
}

// Rendi la funzione globale
window.creaOrdineBackend = creaOrdineBackend;
