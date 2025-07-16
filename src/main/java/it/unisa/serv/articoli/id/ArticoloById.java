package it.unisa.serv.articoli.id;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import it.unisa.models.Articolo;
import it.unisa.serv.connessione.ConnectionManager;

@WebServlet("/articoli/*")
public class ArticoloById extends javax.servlet.http.HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws javax.servlet.ServletException, java.io.IOException {
        String id = req.getPathInfo().substring(1); 
        
        try {
            int articoloId = Integer.parseInt(id);
            
            try (Connection conn = ConnectionManager.getConnection();
                PreparedStatement ps = conn.prepareStatement("SELECT * FROM Articolo WHERE id = ?")) {
                
                ps.setInt(1, articoloId);
                ResultSet rs = ps.executeQuery();
                
                if (rs.next()) {
                    // RIMUOVO I PRINTLN QUI DENTRO IL BLOCCO IF perché rs è già "consumato"
                    Articolo articolo = new Articolo(
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
                    
                    resp.setContentType("application/json");
                    resp.getWriter().print("{"
                            + "\"id\":" + articolo.getId() + ","
                            + "\"nome\":\"" + articolo.getNome() + "\","
                            + "\"descrizione\":\"" + articolo.getDescrizione() + "\","
                            + "\"prezzo\":" + articolo.getPrezzo() + ","
                            + "\"quantitaDisponibile\":" + articolo.getQuantitaDisponibile()
                            + ",\"img\":\"" + articolo.getImg() + "\""
                            + "}");
                            
                    System.out.println("Articolo recuperato con successo: " + articoloId);
                } else {
                    resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Articolo non trovato con ID: " + id);
                }
            }
        } catch (SQLException e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Errore durante il recupero dell'articolo con ID: " + id);
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID non valido: " + id);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws javax.servlet.ServletException, java.io.IOException {
        resp.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED, "Metodo non supportato");
    }


}