package it.unisa.models;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import it.unisa.serv.connessione.ConnectionManager;

public class CarrelloDAO {

    public void addCarrello(Carrello carrello) throws SQLException {
        String sql = "INSERT INTO Carrello (username, id_articolo, quantita, data_aggiunta, data_modifica) VALUES (?, ?, ?, NOW(), NOW())";
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, carrello.getUsername());
            stmt.setInt(2, carrello.getIdArticolo());
            stmt.setInt(3, carrello.getQuantita());
            stmt.executeUpdate();
        }
    }

    public void updateQuantita(int id, int quantita) throws SQLException {
        String sql = "UPDATE Carrello SET quantita = ?, data_modifica = NOW() WHERE id = ?";
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, quantita);
            stmt.setInt(2, id);
            stmt.executeUpdate();
        }
    }

    public void updateQuantitaByProductId(String username, int idArticolo, int quantita) throws SQLException {
        String sql = "UPDATE Carrello SET quantita = ?, data_modifica = NOW() WHERE username = ? AND id_articolo = ?";
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, quantita);
            stmt.setString(2, username);
            stmt.setInt(3, idArticolo);
            stmt.executeUpdate();
        }
    }

    public void deleteCarrello(int id) throws SQLException {
        String sql = "DELETE FROM Carrello WHERE id = ?";
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    public void deleteCarrelloByProductId(String username, int idArticolo) throws SQLException {
        String sql = "DELETE FROM Carrello WHERE username = ? AND id_articolo = ?";
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, username);
            stmt.setInt(2, idArticolo);
            stmt.executeUpdate();
        }
    }

    public void deleteCarrelloByUsername(String username) throws SQLException {
        String sql = "DELETE FROM Carrello WHERE username = ?";
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, username);
            stmt.executeUpdate();
        }
    }

    public List<Carrello> getCarrelloByUsername(String username) throws SQLException {
        String sql = "SELECT * FROM Carrello WHERE username = ?";
        List<Carrello> carrelloList = new ArrayList<>();
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, username);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    carrelloList.add(extractCarrello(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("Errore SQL in getCarrelloByUsername: " + e.getMessage());
            throw e;
        }
        return carrelloList;
    }

    public List<CarrelloItem> getCarrelloCompletoByUsername(String username) throws SQLException {
        String sql = "SELECT c.*, a.nome, a.descrizione, a.prezzo, a.quantitaDisponibile, a.img " +
                    "FROM Carrello c " +
                    "JOIN Articolo a ON c.id_articolo = a.id " +
                    "WHERE c.username = ?";
        List<CarrelloItem> carrelloList = new ArrayList<>();
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, username);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    carrelloList.add(extractCarrelloItem(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("Errore SQL in getCarrelloCompletoByUsername: " + e.getMessage());
            throw e;
        }
        return carrelloList;
    }

    private Carrello extractCarrello(ResultSet rs) throws SQLException {
        return new Carrello(
            rs.getInt("id"),
            rs.getString("username"),
            rs.getInt("id_articolo"),
            rs.getInt("quantita"),
            rs.getTimestamp("data_aggiunta"),
            rs.getTimestamp("data_modifica")
        );
    }

    private CarrelloItem extractCarrelloItem(ResultSet rs) throws SQLException {
        // Estrai i dati del carrello
        int id = rs.getInt("id");
        String username = rs.getString("username");
        int idArticolo = rs.getInt("id_articolo");
        int quantita = rs.getInt("quantita");
        java.sql.Timestamp dataAggiunta = rs.getTimestamp("data_aggiunta");
        java.sql.Timestamp dataModifica = rs.getTimestamp("data_modifica");
        
        // Estrai i dati dell'articolo
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
        
        return new CarrelloItem(id, username, idArticolo, quantita, dataAggiunta, dataModifica, articolo);
    }
}