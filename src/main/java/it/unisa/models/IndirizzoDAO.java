package it.unisa.models;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class IndirizzoDAO {
    public void salvaIndirizzo(Indirizzo indirizzo, Connection conn) throws SQLException {
        String sql = "INSERT INTO Indirizzo (nome, cognome, via, numeroCivico, citta, cap, provincia, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, indirizzo.getNome());
            ps.setString(2, indirizzo.getCognome());
            ps.setString(3, indirizzo.getVia());
            ps.setString(4, indirizzo.getNumeroCivico());
            ps.setString(5, indirizzo.getCitta());
            ps.setString(6, indirizzo.getCap());
            ps.setString(7, indirizzo.getProvincia());
            ps.setString(8, indirizzo.getUsername());
            ps.executeUpdate();
        }
    }

    public List<Indirizzo> indirizziPerUtente(String username, Connection conn) throws SQLException {
        List<Indirizzo> indirizzi = new ArrayList<>();
        String sql = "SELECT * FROM Indirizzo WHERE username = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Indirizzo i = new Indirizzo();
                    i.setId(rs.getInt("id"));
                    i.setNome(rs.getString("nome"));
                    i.setCognome(rs.getString("cognome"));
                    i.setVia(rs.getString("via"));
                    i.setNumeroCivico(rs.getString("numeroCivico"));
                    i.setCitta(rs.getString("citta"));
                    i.setCap(rs.getString("cap"));
                    i.setProvincia(rs.getString("provincia"));
                    i.setUsername(rs.getString("username"));
                    indirizzi.add(i);
                }
            }
        }
        return indirizzi;
    }

    public boolean eliminaIndirizzo(int id, String username, Connection conn) throws SQLException {
        String sql = "DELETE FROM Indirizzo WHERE id = ? AND username = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.setString(2, username);
            int affected = ps.executeUpdate();
            return affected > 0;
        }
    }

    public boolean aggiornaIndirizzo(Indirizzo indirizzo, Connection conn) throws SQLException {
        String sql = "UPDATE Indirizzo SET nome=?, cognome=?, via=?, numeroCivico=?, citta=?, cap=?, provincia=? WHERE id=? AND username=?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, indirizzo.getNome());
            ps.setString(2, indirizzo.getCognome());
            ps.setString(3, indirizzo.getVia());
            ps.setString(4, indirizzo.getNumeroCivico());
            ps.setString(5, indirizzo.getCitta());
            ps.setString(6, indirizzo.getCap());
            ps.setString(7, indirizzo.getProvincia());
            ps.setInt(8, indirizzo.getId());
            ps.setString(9, indirizzo.getUsername());
            int affected = ps.executeUpdate();
            return affected > 0;
        }
    }
}
