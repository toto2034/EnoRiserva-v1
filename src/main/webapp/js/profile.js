// Recupera l'username dalla sessione o da localStorage
let username = null;
if (window.username) {
    username = window.username;
} else if (localStorage.getItem('username')) {
    username = localStorage.getItem('username');
} else {
    // Prova a recuperare da un meta tag o altro metodo se necessario
}

if (username) {
    fetch(`/EnoRiserva-v1/utenti/userbyid?username=${encodeURIComponent(username)}`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('user-profile-data');
            if (data.error) {
                container.innerHTML = `<div class="error">${data.error}</div>`;
            } else {
                container.innerHTML = `
                    <div class="profile-info">
                        <p><i class="fas fa-user"></i> <strong>Username:</strong> <span>${data.username}</span></p>
                        <p><i class="fas fa-id-card"></i> <strong>Nome:</strong> <span>${data.nome}</span></p>
                        <p><i class="fas fa-id-card"></i> <strong>Cognome:</strong> <span>${data.cognome}</span></p>
                        <p><i class="fas fa-envelope"></i> <strong>Email:</strong> <span>${data.email}</span></p>
                        <p><i class="fas fa-user-tag"></i> <strong>Tipo:</strong> <span>${data.tipo}</span></p>
                    </div>
                `;

                // Gestione tab admin
                const adminTab = document.getElementById('admin-tab');
                if (data.tipo === 'Amministratore') {
                    adminTab.style.display = 'block';
                } else {
                    adminTab.style.display = 'none';
                }
            }
        })
        .catch(err => {
            document.getElementById('user-profile-data').innerHTML = `<div class="error">Errore nel recupero dati profilo</div>`;
        });
} else {
    document.getElementById('user-profile-data').innerHTML = '<div class="error">Utente non loggato</div>';
}

// Gestione tab delle sezioni profilo
const tabs = document.querySelectorAll('.profile-tab');
const sections = {
    orders: document.getElementById('orders-section'),
    wishlist: document.getElementById('wishlist-section'),
    address: document.getElementById('address-section'),
    admin: document.getElementById('admin-section')
};

function hideAllSections() {
    Object.values(sections).forEach(sec => {
        if (sec) sec.style.display = 'none';
    });
    tabs.forEach(tab => tab.classList.remove('active'));
}

tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        hideAllSections();
        if (sections[section]) {
            sections[section].style.display = 'block';
            this.classList.add('active');
        }
        if (section === 'logout') {
            // Logout completo tramite funzione globale
            if (typeof window.logout === 'function') {
                window.logout();
            } else {
                // Fallback: redirect
                window.location.href = '/EnoRiserva-v1/home/';
            }
        }
    });
});

// Funzione per mostrare lo storico ordini
function caricaStoricoOrdini() {
    const section = document.getElementById('orders-section');
    const container = document.createElement('div');
    container.className = 'orders-list';
    section.innerHTML = '<h2>Storico Ordini</h2>';
    section.appendChild(container);
    fetch('/EnoRiserva-v1/ordine/storico')
        .then(res => res.json())
        .then(ordini => {
            if (!Array.isArray(ordini) || ordini.length === 0) {
                container.innerHTML = '<div class="placeholder">Nessun ordine presente.</div>';
                return;
            }
            container.innerHTML = '';
            ordini.forEach(ordine => {
                const ordineDiv = document.createElement('div');
                ordineDiv.className = 'ordine-card';
                ordineDiv.innerHTML = `
                    <div class="ordine-header">
                        <span><b>Ordine #${ordine.idOrdine}</b></span>
                        <span>Data: ${ordine.dataOrdine.split(' ')[0]}</span>
                        <span>Totale: € ${ordine.totale.toFixed(2)}</span>
                        <span>Pagamento: ${ordine.metodoPagamento}</span>
                        <span>Stato: ${ordine.stato}</span>
                    </div>
                    <div class="ordine-prodotti">
                        ${ordine.prodotti.map(p => `
                            <div class="ordine-prodotto">
                                <span>${p.nomeProdotto}</span>
                                <span>Quantità: ${p.quantita}</span>
                                <span>Prezzo: € ${p.prezzo.toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
                container.appendChild(ordineDiv);
            });
        })
        .catch(() => {
            container.innerHTML = '<div class="placeholder">Errore nel caricamento ordini.</div>';
        });
}

// Hook tab storico ordini
const ordersTab = document.querySelector('.profile-tab[data-section="orders"]');
if (ordersTab) {
    ordersTab.addEventListener('click', caricaStoricoOrdini);
}

// Hook tab wishlist
const wishlistTab = document.querySelector('.profile-tab[data-section="wishlist"]');
if (wishlistTab) {
    wishlistTab.addEventListener('click', function() {
        if (typeof window.renderWishlist === 'function') {
            window.renderWishlist();
        } else {
            console.error('Funzione renderWishlist non disponibile');
        }
    });
}

// Funzione per mostrare la lista indirizzi
function caricaIndirizzi() {
    const section = document.getElementById('address-section');
    section.innerHTML = '<h2>Indirizzi</h2>';
    const container = document.createElement('div');
    container.className = 'address-list';
    section.appendChild(container);
    fetch('/EnoRiserva-v1/indirizzo/lista')
        .then(res => res.json())
        .then(indirizzi => {
            if (!Array.isArray(indirizzi) || indirizzi.length === 0) {
                container.innerHTML = '<div class="placeholder">Nessun indirizzo salvato.</div>';
                return;
            }
            container.innerHTML = '';
            indirizzi.forEach(ind => {
                const div = document.createElement('div');
                div.className = 'address-card';
                div.innerHTML = `
                    <div><b>${ind.nome} ${ind.cognome}</b></div>
                    <div>${ind.via} ${ind.numeroCivico}, ${ind.cap} ${ind.citta} (${ind.provincia})</div>
                `;
                container.appendChild(div);
            });
        })
        .catch(() => {
            container.innerHTML = '<div class="placeholder">Errore nel caricamento indirizzi.</div>';
        });
}

function mostraFormIndirizzo(section, indirizzo = null) {
    // Rimuovi eventuali altri form
    const oldForm = section.querySelector('.address-form');
    if (oldForm) oldForm.remove();
    const form = document.createElement('form');
    form.className = 'address-form';
    form.innerHTML = `
        <h3>${indirizzo ? 'Modifica Indirizzo' : 'Nuovo Indirizzo'}</h3>
        <input name="nome" placeholder="Nome" required value="${indirizzo ? indirizzo.nome : ''}">
        <input name="cognome" placeholder="Cognome" required value="${indirizzo ? indirizzo.cognome : ''}">
        <input name="via" placeholder="Via" required value="${indirizzo ? indirizzo.via : ''}">
        <input name="numeroCivico" placeholder="Numero Civico" required value="${indirizzo ? indirizzo.numeroCivico : ''}">
        <input name="cap" placeholder="CAP" required value="${indirizzo ? indirizzo.cap : ''}">
        <input name="citta" placeholder="Città" required value="${indirizzo ? indirizzo.citta : ''}">
        <input name="provincia" placeholder="Provincia" required value="${indirizzo ? indirizzo.provincia : ''}">
        <button type="submit">${indirizzo ? 'Salva Modifiche' : 'Aggiungi'}</button>
        <button type="button" class="address-cancel-btn">Annulla</button>
    `;
    form.onsubmit = e => {
        e.preventDefault();
        const formData = new FormData(form);
        if (indirizzo) formData.append('id', indirizzo.id);
        const data = new URLSearchParams(formData);
        let url = indirizzo ? '/EnoRiserva-v1/indirizzo/gestione' : '/EnoRiserva-v1/indirizzo/nuovo';
        let method = 'POST';
        fetch(url, {
            method,
            body: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(res => res.json())
            .then(r => {
                if (r.success) {
                    caricaIndirizzi();
                } else {
                    alert(r.message || 'Errore');
                }
            })
            .catch(() => alert('Errore di rete'));
    };
    form.querySelector('.address-cancel-btn').onclick = () => form.remove();
    section.appendChild(form);
}

let prodottiVisibili = false;
let prodottiCache = [];

function caricaProdottiAdmin() {
    const section = document.getElementById('admin-section');
    section.innerHTML = `
        <div class="admin-header">
            <i class="fas fa-crown admin-icon"></i>
            <h2>Pannello Amministratore</h2>
            <p class="admin-desc">Gestisci i prodotti del catalogo in modo semplice e veloce.</p>
        </div>
        <div class="admin-actions">
            <button id="admin-visualizza-btn" class="admin-prodotti-btn"><i class="fas fa-box-open"></i> Visualizza Prodotti</button>
            <button id="admin-aggiungi-btn" class="admin-prodotti-btn"><i class="fas fa-plus"></i> Inserisci nuovo prodotto</button>
        </div>
        <div id="admin-feedback" class="admin-feedback"></div>
    `;
    const btnVisualizza = document.getElementById('admin-visualizza-btn');
    const btnAggiungi = document.getElementById('admin-aggiungi-btn');
    btnVisualizza.onclick = () => {
        prodottiVisibili = !prodottiVisibili;
        if (prodottiVisibili) {
            mostraListaProdotti();
            btnVisualizza.innerHTML = '<i class="fas fa-eye-slash"></i> Nascondi Prodotti';
        } else {
            const oldList = section.querySelector('.prodotti-list');
            const oldSearch = section.querySelector('.admin-search-container');
            if (oldList) oldList.remove();
            if (oldSearch) oldSearch.remove();
            btnVisualizza.innerHTML = '<i class="fas fa-box-open"></i> Visualizza Prodotti';
        }
    };
    btnAggiungi.onclick = () => mostraFormProdotto(section);
}

function mostraListaProdotti() {
    const section = document.getElementById('admin-section');
    let oldList = section.querySelector('.prodotti-list');
    if (oldList) oldList.remove();
    let oldSearch = section.querySelector('.admin-search-container');
    if (oldSearch) oldSearch.remove();
    fetch('/EnoRiserva-v1/admin/prodotti')
        .then(res => res.json())
        .then(prodotti => {
            prodottiCache = prodotti;
            renderProdottiList(prodotti);
            renderSearchBar(section);
        })
        .catch(() => {
            const list = document.createElement('div');
            list.className = 'prodotti-list';
            list.innerHTML = '<div class="placeholder">Errore nel caricamento prodotti.</div>';
            section.appendChild(list);
        });
}

function renderProdottiList(prodotti) {
    const section = document.getElementById('admin-section');
    let oldList = section.querySelector('.prodotti-list');
    if (oldList) oldList.remove();
    const list = document.createElement('div');
    list.className = 'prodotti-list elenco';
    if (!Array.isArray(prodotti) || prodotti.length === 0) {
        list.innerHTML = '<div class="placeholder">Nessun prodotto presente.</div>';
    } else {
        prodotti.forEach(p => {
            const div = document.createElement('div');
            div.className = 'prodotto-card elenco';
            div.innerHTML = `
                <div class="prodotto-img-box">
                    <img src="${p.img}" alt="img" class="prodotto-img">
                </div>
                <div class="prodotto-details">
                    <b class="prodotto-nome">${p.nome}</b>
                    <span class="prodotto-prezzo">€ ${p.prezzo.toFixed(2)}</span>
                    <span class="prodotto-quantita">Quantità: ${p.quantitaDisponibile}</span>
                    <span class="prodotto-descrizione">${p.descrizione}</span>
                </div>
                <div class="prodotto-actions">
                    <button class="prodotto-edit-btn" title="Modifica"><i class="fas fa-edit"></i></button>
                    <button class="prodotto-delete-btn" title="Elimina"><i class="fas fa-trash"></i></button>
                </div>
            `;
            div.querySelector('.prodotto-edit-btn').onclick = () => mostraFormProdotto(section, p);
            div.querySelector('.prodotto-delete-btn').onclick = () => eliminaProdotto(p.id);
            list.appendChild(div);
        });
    }
    section.appendChild(list);
}

function renderSearchBar(section) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'admin-search-container search-container';
    searchContainer.innerHTML = `
        <form class="search-form" onsubmit="return false;">
            <input type="text" class="search-input" placeholder="Cerca prodotto...">
            <button class="search-button" tabindex="-1"><i class="fas fa-search"></i></button>
        </form>
    `;
    section.insertBefore(searchContainer, section.querySelector('.prodotti-list'));
    const input = searchContainer.querySelector('.search-input');
    input.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        const filtered = prodottiCache.filter(p => p.nome.toLowerCase().includes(value));
        renderProdottiList(filtered);
    });
}

function mostraFormProdotto(section, prodotto = null) {
    chiudiModaleProdotto();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.onclick = function(e) {
        if (e.target === overlay) chiudiModaleProdotto();
    };
    // Form prodotto
    const form = document.createElement('form');
    form.className = 'prodotto-form';
    // --- INIZIO SEZIONE MODIFICATA ---
    form.innerHTML = `
    <h3>${prodotto ? '<i class="fas fa-edit"></i> Modifica Prodotto' : '<i class="fas fa-plus"></i> Nuovo Prodotto'}</h3>
    <div class="prodotto-form-row">
        <div class="prodotto-form-col">
            <label>Nome</label>
            <input name="nome" placeholder="Nome del vino" required value="${prodotto ? prodotto.nome : ''}">
            
            <label>Descrizione</label>
            <input name="descrizione" placeholder="Descrizione" required value="${prodotto ? prodotto.descrizione : ''}">
            
            <label>Tipologia</label>
            <select name="tipologia" required>
                <option value="" disabled ${!prodotto ? 'selected' : ''}>-- Seleziona una tipologia --</option>
                <option value="VINO_ROSSO" ${prodotto && prodotto.tipologia === 'VINO_ROSSO' ? 'selected' : ''}>Vino Rosso</option>
                <option value="VINO_BIANCO" ${prodotto && prodotto.tipologia === 'VINO_BIANCO' ? 'selected' : ''}>Vino Bianco</option>
                <option value="SPUMANTE" ${prodotto && prodotto.tipologia === 'SPUMANTE' ? 'selected' : ''}>Spumante</option>
            </select>

            <label>Regione</label>
            <input name="regione" placeholder="es. Toscana" required value="${prodotto ? prodotto.regione : ''}">
            
        </div>
        <div class="prodotto-form-col">
            <label>URL Immagine</label>
            <input name="img" placeholder="URL Immagine" value="${prodotto ? prodotto.img : ''}">

            <label>Prezzo</label>
            <input name="prezzo" type="number" step="0.01" min="0" placeholder="Prezzo" required value="${prodotto ? prodotto.prezzo : ''}">
            
            <label>Quantità</label>
            <input name="quantitaDisponibile" type="number" min="0" placeholder="Quantità" required value="${prodotto ? prodotto.quantitaDisponibile : ''}">
            
            <label>Annata</label>
            <input name="annata" type="number" min="1900" placeholder="Anno" required value="${prodotto ? prodotto.annata : ''}">
        </div>
    </div>
    <div class="prodotto-form-actions">
        <button type="submit">${prodotto ? '<i class="fas fa-save"></i> Salva Modifiche' : '<i class="fas fa-plus"></i> Aggiungi'}</button>
        <button type="button" class="prodotto-cancel-btn"><i class="fas fa-times"></i> Annulla</button>
    </div>
`;
    // --- FINE SEZIONE MODIFICATA ---
    form.onsubmit = e => {
        e.preventDefault();
        const formData = new FormData(form);
        if (prodotto) formData.append('id', prodotto.id);
        const data = new URLSearchParams(formData);
        let url = '/EnoRiserva-v1/admin/prodotti';
        let method = 'POST';
        fetch(url, {
            method,
            body: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(res => res.json())
            .then(r => {
                if (r.success) {
                    mostraListaProdotti();
                    chiudiModaleProdotto();
                    mostraFeedbackAdmin('Operazione completata con successo!', true);
                } else {
                    mostraFeedbackAdmin(r.message || 'Errore', false);
                }
            })
            .catch(() => mostraFeedbackAdmin('Errore di rete', false));
    };
    form.querySelector('.prodotto-cancel-btn').onclick = chiudiModaleProdotto;
    overlay.appendChild(form);
    document.body.appendChild(overlay);
}

function chiudiModaleProdotto() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
}

function eliminaProdotto(id) {
    mostraModaleConferma('Sei sicuro di voler eliminare questo prodotto?', function() {
        fetch(`/EnoRiserva-v1/admin/prodotti?id=${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(r => {
                if (r.success) {
                    mostraListaProdotti();
                    mostraFeedbackAdmin('Prodotto eliminato con successo!', true);
                } else {
                    mostraFeedbackAdmin(r.message || 'Errore eliminazione', false);
                }
            })
            .catch(() => mostraFeedbackAdmin('Errore di rete', false));
    });
}

function mostraModaleConferma(msg, onConferma) {
    chiudiModaleConferma();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.onclick = function(e) { if (e.target === overlay) chiudiModaleConferma(); };
    const box = document.createElement('div');
    box.className = 'modal-content';
    box.style.maxWidth = '340px';
    box.style.textAlign = 'center';
    box.innerHTML = `<p style='margin-bottom: 22px; font-size: 1.1em;'>${msg}</p>`;
    const btns = document.createElement('div');
    btns.style.display = 'flex';
    btns.style.justifyContent = 'center';
    btns.style.gap = '16px';
    const conferma = document.createElement('button');
    conferma.textContent = 'Conferma';
    conferma.style.background = '#ff4d4f';
    conferma.style.color = '#fff';
    conferma.style.border = 'none';
    conferma.style.borderRadius = '6px';
    conferma.style.padding = '8px 18px';
    conferma.style.fontWeight = '600';
    conferma.onclick = function() {
        chiudiModaleConferma();
        if (typeof onConferma === 'function') onConferma();
    };
    const annulla = document.createElement('button');
    annulla.textContent = 'Annulla';
    annulla.style.background = '#eee';
    annulla.style.color = '#333';
    annulla.style.border = 'none';
    annulla.style.borderRadius = '6px';
    annulla.style.padding = '8px 18px';
    annulla.onclick = chiudiModaleConferma;
    btns.appendChild(conferma);
    btns.appendChild(annulla);
    box.appendChild(btns);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

function chiudiModaleConferma() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
}

function mostraFeedbackAdmin(msg, success) {
    const feedback = document.getElementById('admin-feedback');
    feedback.textContent = msg;
    feedback.className = 'admin-feedback ' + (success ? 'success' : 'error');
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 2500);
}

// === ADMIN ORDINI: FILTRI E TABELLA ===
let ordiniAdminCache = [];
let clientiAdminCache = [];

function caricaClientiAdmin() {
    return fetch('/EnoRiserva-v1/utenti')
        .then(res => res.json())
        .then(clienti => {
            clientiAdminCache = clienti;
            const select = document.getElementById('filtro-cliente');
            if (select) {
                select.innerHTML = '<option value="">Tutti</option>';
                clienti.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.username;
                    opt.textContent = `${c.nome} ${c.cognome} (${c.username})`;
                    select.appendChild(opt);
                });
            }
        });
}

function caricaOrdiniAdmin() {
    return fetch('/EnoRiserva-v1/admin/ordini')
        .then(res => res.json())
        .then(ordini => {
            ordiniAdminCache = ordini;
            mostraTabellaOrdiniAdmin(ordini);
        });
}

function mostraTabellaOrdiniAdmin(ordini) {
    const tabellaDiv = document.getElementById('ordini-admin-tabella');
    if (!tabellaDiv) return;
    if (!Array.isArray(ordini) || ordini.length === 0) {
        tabellaDiv.innerHTML = '<div class="placeholder">Nessun ordine presente.</div>';
        return;
    }
    let html = `<table class="admin-ordini-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Totale</th>
                <th>Prodotti</th>
            </tr>
        </thead>
        <tbody>
    `;
    ordini.forEach(o => {
        html += `<tr>
            <td>${o.idOrdine}</td>
            <td>${o.dataOrdine ? o.dataOrdine.split(' ')[0] : ''}</td>
            <td>${o.cliente ? o.cliente.nome + ' ' + o.cliente.cognome + ' (' + o.cliente.username + ')' : ''}</td>
            <td>${o.cliente ? o.cliente.email : ''}</td>
            <td>€ ${Number(o.totale).toFixed(2)}</td>
            <td>${Array.isArray(o.prodotti) ? o.prodotti.map(p => `${p.nomeProdotto} (x${p.quantita})`).join('<br>') : ''}</td>
        </tr>`;
    });
    html += '</tbody></table>';
    tabellaDiv.innerHTML = html;
}

function filtraOrdiniAdmin() {
    const cliente = document.getElementById('filtro-cliente').value;
    const dataDa = document.getElementById('filtro-data-da').value;
    const dataA = document.getElementById('filtro-data-a').value;
    let filtrati = ordiniAdminCache;
    if (cliente) {
        filtrati = filtrati.filter(o => o.cliente && o.cliente.username === cliente);
    }
    if (dataDa) {
        filtrati = filtrati.filter(o => o.dataOrdine && o.dataOrdine.substring(0,10) >= dataDa);
    }
    if (dataA) {
        filtrati = filtrati.filter(o => o.dataOrdine && o.dataOrdine.substring(0,10) <= dataA);
    }
    mostraTabellaOrdiniAdmin(filtrati);
}

// Nuova funzione per mostrare la UI ordini admin
function mostraAdminOrdiniUI() {
    const section = document.getElementById('admin-section');
    section.innerHTML = `
        <div class="admin-header">
            <i class="fas fa-crown admin-icon"></i>
            <h2>Pannello Amministratore</h2>
            <p class="admin-desc">Gestisci gli ordini e i prodotti del sito.</p>
        </div>
        <div class="admin-actions">
            <button id="admin-ordini-btn" class="admin-prodotti-btn" style="background:#2e3a59;">Gestione Ordini</button>
            <button id="admin-prodotti-btn" class="admin-prodotti-btn">Gestione Prodotti</button>
        </div>
        <div id="ordini-admin-filtri">
            <label>Cliente:
                <select id="filtro-cliente">
                    <option value="">Tutti</option>
                </select>
            </label>
            <label>Data da:
                <input type="date" id="filtro-data-da">
            </label>
            <label>a:
                <input type="date" id="filtro-data-a">
            </label>
            <button id="applica-filtri">Applica filtri</button>
            <button id="reset-filtri">Reset</button>
        </div>
        <div id="ordini-admin-tabella"></div>
    `;
    // Carica dati
    caricaClientiAdmin().then(caricaOrdiniAdmin);
    // Hook filtri
    const selectCliente = document.getElementById('filtro-cliente');
    const inputDataDa = document.getElementById('filtro-data-da');
    const inputDataA = document.getElementById('filtro-data-a');
    const btnFiltri = document.getElementById('applica-filtri');
    const btnReset = document.getElementById('reset-filtri');
    if (selectCliente && inputDataDa && inputDataA && btnFiltri && btnReset) {
        btnFiltri.addEventListener('click', filtraOrdiniAdmin);
        selectCliente.addEventListener('change', filtraOrdiniAdmin);
        inputDataDa.addEventListener('change', filtraOrdiniAdmin);
        inputDataA.addEventListener('change', filtraOrdiniAdmin);
        btnReset.addEventListener('click', function() {
            selectCliente.value = '';
            inputDataDa.value = '';
            inputDataA.value = '';
            mostraTabellaOrdiniAdmin(ordiniAdminCache);
        });
    }
    // Hook switch a prodotti
    document.getElementById('admin-prodotti-btn').onclick = mostraAdminProdottiUI;
    document.getElementById('admin-ordini-btn').onclick = mostraAdminOrdiniUI;
}

// Nuova funzione per mostrare la UI prodotti admin
function mostraAdminProdottiUI() {
    const section = document.getElementById('admin-section');
    section.innerHTML = `
        <div class="admin-header">
            <i class="fas fa-crown admin-icon"></i>
            <h2>Pannello Amministratore</h2>
            <p class="admin-desc">Gestisci gli ordini e i prodotti del sito.</p>
        </div>
        <div class="admin-actions">
            <button id="admin-ordini-btn" class="admin-prodotti-btn">Gestione Ordini</button>
            <button id="admin-prodotti-btn" class="admin-prodotti-btn" style="background:#2e3a59;">Gestione Prodotti</button>
        </div>
        <div class="admin-actions">
            <button id="admin-visualizza-btn" class="admin-prodotti-btn"><i class="fas fa-box-open"></i> Visualizza Prodotti</button>
            <button id="admin-aggiungi-btn" class="admin-prodotti-btn"><i class="fas fa-plus"></i> Inserisci nuovo prodotto</button>
        </div>
        <div id="admin-feedback" class="admin-feedback"></div>
    `;
    // Hook switch a ordini
    document.getElementById('admin-ordini-btn').onclick = mostraAdminOrdiniUI;
    document.getElementById('admin-prodotti-btn').onclick = mostraAdminProdottiUI;

    // Hook bottoni prodotti
    const btnVisualizza = document.getElementById('admin-visualizza-btn');
    const btnAggiungi = document.getElementById('admin-aggiungi-btn');
    btnVisualizza.onclick = () => {
        prodottiVisibili = !prodottiVisibili;
        if (prodottiVisibili) {
            mostraListaProdotti();
            btnVisualizza.innerHTML = '<i class="fas fa-eye-slash"></i> Nascondi Prodotti';
        } else {
            const oldList = section.querySelector('.prodotti-list');
            const oldSearch = section.querySelector('.admin-search-container');
            if (oldList) oldList.remove();
            if (oldSearch) oldSearch.remove();
            btnVisualizza.innerHTML = '<i class="fas fa-box-open"></i> Visualizza Prodotti';
        }
    };
    btnAggiungi.onclick = () => mostraFormProdotto(section);
}

// Hook tab admin: mostra la UI ordini admin di default
const adminTab = document.getElementById('admin-tab');
if (adminTab) {
    adminTab.addEventListener('click', function() {
        hideAllSections();
        sections.admin.style.display = 'block';
        adminTab.classList.add('active');
        mostraAdminOrdiniUI();
    });
}

// Hook tab indirizzi
const addressTab = document.querySelector('.profile-tab[data-section="address"]');
if (addressTab) {
    addressTab.addEventListener('click', caricaIndirizzi);
}