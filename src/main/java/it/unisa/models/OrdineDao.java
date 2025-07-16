package it.unisa.models;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class OrdineDao {
    
    // Salva un nuovo ordine e restituisce l'ID generato
    public int salvaOrdine(Ordine ordine, Connection conn) throws SQLException {
        String sql = "INSERT INTO Ordine (username, totale, dataOrdine, idIndirizzo, metodoPagamento, stato) VALUES (?, ?, NOW(), ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setBigDecimal(2, ordine.getTotale());
            ps.setString(1, ordine.getUsername());
            ps.setInt(3, ordine.getIdIndirizzo());
            ps.setString(4, ordine.getMetodoPagamento());
            ps.setString(5, ordine.getStato());
            ps.executeUpdate();
            
            // Recupera l'ID generato
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        return -1;
    }
    
    // Salva i dettagli dell'ordine (prodotti)
    public void salvaDettagliOrdine(int idOrdine, List<OrdineDettaglio> dettagli, Connection conn) throws SQLException {
        String sql = "INSERT INTO ordineDettaglio (idOrdine, idProdotto, nomeProdotto, quantita, prezzo) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            for (OrdineDettaglio dettaglio : dettagli) {
                ps.setInt(1, idOrdine);
                ps.setInt(2, dettaglio.getIdProdotto());
                ps.setString(3, dettaglio.getNomeProdotto());
                ps.setInt(4, dettaglio.getQuantita());
                ps.setBigDecimal(5, dettaglio.getPrezzo());
                ps.addBatch();
            }
            ps.executeBatch();
        }
    }
    
    // Recupera un ordine per ID
    public Ordine getOrdineById(int idOrdine, Connection conn) throws SQLException {
        String sql = "SELECT * FROM Ordine WHERE idOrdine = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, idOrdine);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Ordine ordine = new Ordine();
                    ordine.setIdOrdine(rs.getInt("idOrdine"));
                    ordine.setUsername(rs.getString("username"));
                    ordine.setTotale(rs.getBigDecimal("totale"));
                    ordine.setDataOrdine(rs.getTimestamp("dataOrdine"));
                    ordine.setIdIndirizzo(rs.getInt("idIndirizzo"));
                    ordine.setMetodoPagamento(rs.getString("metodoPagamento"));
                    ordine.setStato(rs.getString("stato"));
                    return ordine;
                }
            }
        }
        return null;
    }
    
    // Recupera i dettagli di un ordine
    public List<OrdineDettaglio> getDettagliOrdine(int idOrdine, Connection conn) throws SQLException {
        List<OrdineDettaglio> dettagli = new ArrayList<>();
        String sql = "SELECT * FROM ordineDettaglio WHERE idOrdine = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, idOrdine);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    OrdineDettaglio dettaglio = new OrdineDettaglio();
                    dettaglio.setIdDettaglio(rs.getInt("idDettaglio"));
                    dettaglio.setIdOrdine(rs.getInt("idOrdine"));
                    dettaglio.setIdProdotto(rs.getInt("idProdotto"));
                    dettaglio.setNomeProdotto(rs.getString("nomeProdotto"));
                    dettaglio.setQuantita(rs.getInt("quantita"));
                    dettaglio.setPrezzo(rs.getBigDecimal("prezzo"));
                    dettagli.add(dettaglio);
                }
            }
        }
        return dettagli;
    }
    
    // Recupera tutti gli ordini di un utente
    public List<Ordine> getOrdiniPerUtente(String username, Connection conn) throws SQLException {
        List<Ordine> ordini = new ArrayList<>();
        String sql = "SELECT * FROM Ordine WHERE username = ? ORDER BY dataOrdine DESC";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
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
        return ordini;
    }
}
