window.addEventListener('DOMContentLoaded', function () {
    const queryParams = new URLSearchParams(window.location.search);
    const dom = queryParams.get('dom');

    const modal = document.querySelector('.modal_wait');
    const mainContent = document.getElementById('main-confirm-content');

    if (dom === 'true') {
        modal.style.display = 'none';
        mainContent.style.display = 'block';
        mostraProdottiAcquistati();
        avviaRedirectHome();
    } else {
        // Mostra modale e nasconde contenuto principale
        modal.style.display = 'flex';
        mainContent.style.display = 'none';

        // Dopo 4 secondi mostra conferma
        setTimeout(function () {
            modal.style.display = 'none';
            mainContent.style.display = 'block';
            mostraProdottiAcquistati();
            avviaRedirectHome();
        }, 4000);
    }
});

function avviaRedirectHome() {
    let secondi = 7;
    const redirectMsg = document.getElementById('redirect-message');
    const countdownSpan = document.getElementById('countdown');

    // Aggiorna il contatore ogni secondo
    const interval = setInterval(function () {
        countdownSpan.textContent = secondi;
        secondi--;

        if (secondi < 0) {
            clearInterval(interval);
            window.location.href = '/SleepingSmarttress/home/';
        }
    }, 1000);

    // Inizializza il primo valore
    countdownSpan.textContent = secondi;
}

function mostraProdottiAcquistati() {
    const box = document.getElementById('order-summary-box');
    if (!box) return;
    const ul = box.querySelector('ul');
    ul.innerHTML = '';

    // DEBUG: controlla cosa c'è in localStorage
    console.log('Tutte le chiavi localStorage:', Object.keys(localStorage));
    console.log('Valore prodottiConfermati:', localStorage.getItem('prodottiConfermati'));

    // Leggi prodotti da localStorage
    let prodotti = [];
    try {
        const arr = JSON.parse(localStorage.getItem('prodottiConfermati'));
        if (arr && arr.length > 0) prodotti = arr;
    } catch (e) {
        console.error('Errore parsing prodottiConfermati:', e);
    }

    if (prodotti.length > 0) {
        prodotti.forEach(p => {
            const li = document.createElement('li');
            li.textContent = p;
            ul.appendChild(li);
        });
        // Cancella la chiave dopo aver mostrato i prodotti
        localStorage.removeItem('prodottiConfermati');
    } else {
        // Se non trova prodottiConfermati, prova a leggere dal carrello come fallback
        try {
            const carrello = JSON.parse(localStorage.getItem('carrello') || '[]');
            if (carrello.length > 0) {
                carrello.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = `${item.nome || item.name} x${item.quantita || item.quantity}`;
                    ul.appendChild(li);
                });
                return;
            }
        } catch (e) { }

        const li = document.createElement('li');
        li.textContent = 'Nessun prodotto trovato.';
        ul.appendChild(li);
    }
}