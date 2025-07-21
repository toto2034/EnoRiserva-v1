package it.unisa.serv.articoli.id;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import it.unisa.models.Articolo;
import it.unisa.serv.connessione.ConnectionManager;

@WebServlet("/articoli/*")
public class ArticoloById extends HttpServlet {

    private static final long serialVersionUID = 1L; // Buona pratica

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID articolo mancante.");
            return;
        }

        String id = pathInfo.substring(1);

        try {
            int articoloId = Integer.parseInt(id);

            try (Connection conn = ConnectionManager.getConnection();
                 PreparedStatement ps = conn.prepareStatement("SELECT * FROM Articolo WHERE id = ?")) {

                ps.setInt(1, articoloId);
                ResultSet rs = ps.executeQuery();

                if (rs.next()) {
                    Articolo articolo = new Articolo(
                            rs.getInt("id"),
                            rs.getString("nome"),
                            rs.getString("descrizione"),
                            rs.getString("tipologia"),
                            rs.getString("regione"),
                            rs.getInt("annata"),
                            rs.getDouble("prezzo"),
                            rs.getInt("quantitaDisponibile"),
                            rs.getString("img")
                    );

                    // === INIZIO MODIFICHE FONDAMENTALI ===

                    // 1. Imposta il tipo di contenuto
                    resp.setContentType("application/json");

                    // 2. Imposta la codifica dei caratteri (RISOLVE IL PROBLEMA)
                    resp.setCharacterEncoding("UTF-8");

                    // 3. Scrivi la risposta JSON in modo pulito
                    PrintWriter out = resp.getWriter();
                    String json = "{"
                            + "\"id\":" + articolo.getId() + ","
                            + "\"nome\":\"" + escapeJson(articolo.getNome()) + "\","
                            + "\"descrizione\":\"" + escapeJson(articolo.getDescrizione()) + "\","
                            + "\"tipologia\":\"" + escapeJson(articolo.getTipologia()) + "\","
                            + "\"regione\":\"" + escapeJson(articolo.getRegione()) + "\","
                            + "\"annata\":" + articolo.getAnnata() + "," // Annata è un numero, non ha bisogno di virgolette
                            + "\"prezzo\":" + articolo.getPrezzo() + ","
                            + "\"quantitaDisponibile\":" + articolo.getQuantitaDisponibile() + ","
                            + "\"img\":\"" + escapeJson(articolo.getImg()) + "\""
                            + "}";
                    out.print(json);
                    out.flush();

                    // === FINE MODIFICHE ===

                } else {
                    resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Articolo non trovato con ID: " + id);
                }
            }
        } catch (SQLException e) {
            System.err.println("Errore SQL per ID " + id + ": " + e.getMessage());
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Errore durante il recupero dell'articolo.");
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID non valido: " + id);
        }
    }

    // Aggiungiamo la stessa funzione di escape per sicurezza
    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}