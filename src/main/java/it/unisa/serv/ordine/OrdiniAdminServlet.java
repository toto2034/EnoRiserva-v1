package it.unisa.serv.ordine;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import it.unisa.models.Ordine;
import it.unisa.models.OrdineDao;
import it.unisa.models.OrdineDettaglio;
import it.unisa.models.User;
import it.unisa.serv.connessione.ConnectionManager;

@WebServlet("/admin/ordini")
public class OrdiniAdminServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        try (Connection conn = ConnectionManager.getConnection()) {
            // Recupera tutti gli ordini
            List<Ordine> ordini = new ArrayList<>();
            String sql = "SELECT * FROM Ordine ORDER BY dataOrdine DESC";
            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        Ordine ordine = new Ordine();
                        ordine.setIdOrdine(rs.getInt("idOrdine"));
                        ordine.setUsername(rs.getString("username"));
                        ordine.setTotale(rs.getBigDecimal("totale"));
                        ordine.setDataOrdine(rs.getTimestamp("dataOrdine"));
                        ordine.setIdIndirizzo(rs.getInt("idIndirizzo"));
                        ordine.setMetodoPagamento(rs.getString("metodoPagamento"));
                        ordine.setStato(rs.getString("stato"));
                        ordini.add(ordine);
                    }
                }
            }
            // Costruisci JSON
            StringBuilder json = new StringBuilder();
            json.append("[");
            for (int i = 0; i < ordini.size(); i++) {
                Ordine ordine = ordini.get(i);
                // Recupera info cliente
                User user = null;
                String userSql = "SELECT username, nome, cognome, email FROM Utente WHERE username = ?";
                try (PreparedStatement ups = conn.prepareStatement(userSql)) {
                    ups.setString(1, ordine.getUsername());
                    try (ResultSet urs = ups.executeQuery()) {
                        if (urs.next()) {
                            user = new User(
                                urs.getString("username"),
                                urs.getString("nome"),
                                urs.getString("cognome"),
                                urs.getString("email"),
                                null,
                                null
                            );
                        }
                    }
                }
                // Recupera dettagli prodotti
                OrdineDao ordineDao = new OrdineDao();
                List<OrdineDettaglio> dettagli = ordineDao.getDettagliOrdine(ordine.getIdOrdine(), conn);
                // Serializza ordine
                json.append("{\"idOrdine\":").append(ordine.getIdOrdine())
                    .append(",\"dataOrdine\":\"").append(ordine.getDataOrdine()).append("\"")
                    .append(",\"totale\":").append(ordine.getTotale())
                    .append(",\"cliente\":{")
                    .append("\"username\":\"").append(user != null ? escapeJson(user.getUsername()) : "").append("\",")
                    .append("\"nome\":\"").append(user != null ? escapeJson(user.getNome()) : "").append("\",")
                    .append("\"cognome\":\"").append(user != null ? escapeJson(user.getCognome()) : "").append("\",")
                    .append("\"email\":\"").append(user != null ? escapeJson(user.getEmail()) : "").append("\"}")
                    .append(",\"prodotti\":[");
                for (int j = 0; j < dettagli.size(); j++) {
                    OrdineDettaglio d = dettagli.get(j);
                    json.append("{\"nomeProdotto\":\"").append(escapeJson(d.getNomeProdotto()))
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

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
} 