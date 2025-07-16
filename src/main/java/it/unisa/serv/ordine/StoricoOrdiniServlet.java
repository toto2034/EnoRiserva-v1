package it.unisa.serv.ordine;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
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

@WebServlet(name = "StoricoOrdiniServlet", urlPatterns = {"/ordine/storico"})
public class StoricoOrdiniServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("username") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"error\":\"Utente non autenticato\"}");
            return;
        }
        String username = (String) session.getAttribute("username");
        try (Connection conn = ConnectionManager.getConnection()) {
            OrdineDao ordineDao = new OrdineDao();
            List<Ordine> ordini = ordineDao.getOrdiniPerUtente(username, conn);
            StringBuilder json = new StringBuilder();
            json.append("[");
            for (int i = 0; i < ordini.size(); i++) {
                Ordine ordine = ordini.get(i);
                List<OrdineDettaglio> dettagli = ordineDao.getDettagliOrdine(ordine.getIdOrdine(), conn);
                json.append("{\"idOrdine\":").append(ordine.getIdOrdine())
                    .append(",\"totale\":").append(ordine.getTotale())
                    .append(",\"dataOrdine\":\"").append(ordine.getDataOrdine())
                    .append("\",\"metodoPagamento\":\"").append(ordine.getMetodoPagamento())
                    .append("\",\"stato\":\"").append(ordine.getStato())
                    .append("\",\"prodotti\":[");
                for (int j = 0; j < dettagli.size(); j++) {
                    OrdineDettaglio d = dettagli.get(j);
                    json.append("{\"nomeProdotto\":\"").append(d.getNomeProdotto())
                        .append("\",\"quantita\":").append(d.getQuantita())
                        .append(",\"prezzo\":").append(d.getPrezzo())
                        .append("}");
                    if (j < dettagli.size() - 1) json.append(",");
                }
                json.append("]}");
                if (i < ordini.size() - 1) json.append(",");
            }
            json.append("]");
            out.print(json.toString());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"Errore nel recupero ordini\"}");
        }
    }
} 