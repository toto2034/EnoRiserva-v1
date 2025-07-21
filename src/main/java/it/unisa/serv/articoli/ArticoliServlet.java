package it.unisa.serv.articoli;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import it.unisa.models.Articolo;
import it.unisa.serv.connessione.ConnectionManager;

@WebServlet("/articoli")
public class ArticoliServlet extends HttpServlet {

    private static final long serialVersionUID = 1L; // Buona pratica per le servlet

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Articolo> articoli = new ArrayList<>();

        try (Connection conn = ConnectionManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM Articolo")) {

            while (rs.next()) {
                Articolo a = new Articolo(
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
                articoli.add(a);
            }
        } catch (SQLException e) {
            System.err.println("Errore SQL durante il recupero degli articoli: " + e.getMessage());
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Errore nel recupero dei dati.");
            return;
        }

        // === INIZIO MODIFICHE FONDAMENTALI ===

        // Imposta il tipo di contenuto
        resp.setContentType("application/json");

        // Imposta la codifica dei caratteri della risposta su UTF-8 (RISOLVE IL PROBLEMA)
        resp.setCharacterEncoding("UTF-8");

        // === FINE MODIFICHE ===

        PrintWriter out = resp.getWriter();

        // Il tuo codice originale per costruire il JSON a mano
        out.print("[");
        for (int i = 0; i < articoli.size(); i++) {
            Articolo a = articoli.get(i);
            out.print("{");
            out.print("\"id\":" + a.getId() + ",");
            out.print("\"nome\":\"" + escapeJson(a.getNome()) + "\",");
            out.print("\"descrizione\":\"" + escapeJson(a.getDescrizione()) + "\",");
            out.print("\"tipologia\":\"" + escapeJson(a.getTipologia()) + "\",");
            out.print("\"regione\":\"" + escapeJson(a.getRegione()) + "\",");
            out.print("\"annata\":" + a.getAnnata() + ",");
            out.print("\"prezzo\":" + a.getPrezzo() + ",");
            out.print("\"quantita\":" + a.getQuantitaDisponibile()); // Nota: ho corretto il nome del getter
            out.print(",\"img\":\"" + escapeJson(a.getImg()) + "\"");
            out.print("}");
            if (i < articoli.size() - 1) out.print(",");
        }
        out.print("]");
        out.flush();
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        // Sostituisce i caratteri speciali per un JSON valido
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}