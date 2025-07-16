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
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Articolo> articoli = new ArrayList<>();
        try (Connection conn = ConnectionManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM prodotti")) {

            while (rs.next()) {
                Articolo a = new Articolo(
                        rs.getInt("id"),
                        rs.getString("nome"),
                        rs.getString("descrizione"),
                        rs.getString("tipologia"),
                        rs.getString("regione"),
                        rs.getInt("annata"),
                        rs.getDouble("prezzo"),
                        rs.getInt("quantita"),
                        rs.getString("img")
                );
                articoli.add(a);
            }
        } catch (SQLException e) {
            throw new ServletException(e);
        }

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        
        out.print("[");
        for (int i = 0; i < articoli.size(); i++) {
            Articolo a = articoli.get(i);
            out.print("{");
            out.print("\"id\":" + a.getId() + ",");
            out.print("\"nome\":\"" + escapeJson(a.getNome()) + "\",");
            out.print("\"descrizione\":\"" + escapeJson(a.getDescrizione()) + "\",");
            out.print("\"prezzo\":" + a.getPrezzo() + ",");
            out.print("\"quantitaDisponibile\":" + a.getQuantitaDisponibile());
            out.print(",\"img\":\"" + escapeJson(a.getImg()) + "\"");
            out.print("}");
            if (i < articoli.size() - 1) out.print(",");
        }
        out.print("]");
        out.flush();
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
}