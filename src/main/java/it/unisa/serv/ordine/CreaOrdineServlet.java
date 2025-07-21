package it.unisa.serv.ordine;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import it.unisa.models.Ordine;
import it.unisa.models.OrdineDao;
import it.unisa.models.OrdineDettaglio;
import it.unisa.serv.connessione.ConnectionManager;

@WebServlet("/ordine/crea")
public class CreaOrdineServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        
        HttpSession session = request.getSession(false);
        String username = (session != null) ? (String) session.getAttribute("username") : null;


        if (username == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"success\":false, \"message\":\"Utente non autenticato\"}");
            return;
        }
        
        try {
            // Recupera parametri ordine
            String idIndirizzoStr = request.getParameter("idIndirizzo");
            String metodoPagamento = request.getParameter("metodoPagamento");
            String totaleStr = request.getParameter("totale");
            String prodottiJson = request.getParameter("prodotti");
            
            if (idIndirizzoStr == null || metodoPagamento == null || totaleStr == null || prodottiJson == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"success\":false, \"message\":\"Parametri mancanti\"}");
                return;
            }
            
            int idIndirizzo = Integer.parseInt(idIndirizzoStr);
            BigDecimal totale = new BigDecimal(totaleStr);
            
            // Parsing prodotti (formato JSON semplice: [{"id":1,"nome":"..","quantita":2,"prezzo":100.00},...])
            // Per semplicità uso una parsing manuale, in produzione meglio usare Gson/Jackson
            List<OrdineDettaglio> dettagli = parseProdotti(prodottiJson);
            
            try (Connection conn = ConnectionManager.getConnection()) {
                conn.setAutoCommit(false);
                
                // Crea ordine
                Ordine ordine = new Ordine();
                ordine.setUsername(username);
                ordine.setTotale(totale);
                ordine.setIdIndirizzo(idIndirizzo);
                ordine.setMetodoPagamento(metodoPagamento);
                ordine.setStato("CONFERMATO");
                
                OrdineDao dao = new OrdineDao();
                int idOrdine = dao.salvaOrdine(ordine, conn);
                
                if (idOrdine > 0) {
                    // Salva dettagli ordine
                    for (OrdineDettaglio dettaglio : dettagli) {
                        dettaglio.setIdOrdine(idOrdine);
                    }
                    dao.salvaDettagliOrdine(idOrdine, dettagli, conn);
                    
                    conn.commit();
                    response.getWriter().write("{\"success\":true, \"idOrdine\":" + idOrdine + "}");
                } else {
                    conn.rollback();
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.getWriter().write("{\"success\":false, \"message\":\"Errore creazione ordine\"}");
                }
            }
            
        } catch (NumberFormatException | java.sql.SQLException e) {
            System.err.println("Errore durante la creazione dell'ordine: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\":false, \"message\":\"Errore server: " + e.getMessage() + "\"}");
        }
    }
    
    private List<OrdineDettaglio> parseProdotti(String prodottiJson) {
        List<OrdineDettaglio> dettagli = new ArrayList<>();
        // Parsing JSON semplice - in produzione meglio usare una libreria JSON
        // Assumendo formato: [{"id":1,"nome":"Prodotto","quantita":1,"prezzo":"100.00"}]
        prodottiJson = prodottiJson.trim();
        if (prodottiJson.startsWith("[") && prodottiJson.endsWith("]")) {
            prodottiJson = prodottiJson.substring(1, prodottiJson.length()-1);
            String[] prodotti = prodottiJson.split("\\},\\{");
            for (String prod : prodotti) {
                prod = prod.replace("{", "").replace("}", "");
                String[] campi = prod.split(",");
                OrdineDettaglio dettaglio = new OrdineDettaglio();
                for (String campo : campi) {
                    String[] kv = campo.split(":");
                    if (kv.length == 2) {
                        String key = kv[0].trim().replace("\"", "");
                        String value = kv[1].trim().replace("\"", "");
                        switch (key) {
                            case "id": dettaglio.setIdProdotto(Integer.parseInt(value)); break;
                            case "nome": dettaglio.setNomeProdotto(value); break;
                            case "quantita": dettaglio.setQuantita(Integer.parseInt(value)); break;
                            case "prezzo": dettaglio.setPrezzo(new BigDecimal(value)); break;
                        }
                    }
                }
                dettagli.add(dettaglio);
            }
        }
        return dettagli;
    }
}