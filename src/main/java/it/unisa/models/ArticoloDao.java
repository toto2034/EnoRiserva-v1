package it.unisa.models;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ArticoloDao {
    public List<Articolo> getAll(Connection conn) throws SQLException {
        List<Articolo> list = new ArrayList<>();
        String sql = "SELECT * FROM Articolo";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(mapArticolo(rs));
            }
        }
        return list;
    }

    public Articolo getById(int id, Connection conn) throws SQLException {
        String sql = "SELECT * FROM Articolo WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapArticolo(rs);
        }
        return null;
    }

    public boolean insert(Articolo a, Connection conn) throws SQLException {
        String sql = "INSERT INTO Articolo (nome, descrizione, tipologia, regione, annata, prezzo, quantitaDisponibile, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, a.getNome());
            ps.setString(2, a.getDescrizione());
            ps.setString(3, a.getTipologia());
            ps.setString(4, a.getRegione());
            ps.setInt(5, a.getAnnata());
            ps.setDouble(6, a.getPrezzo());
            ps.setInt(7, a.getQuantitaDisponibile());
            ps.setString(8, a.getImg());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean update(Articolo a, Connection conn) throws SQLException {
        String sql = "UPDATE Articolo SET nome=?, descrizione=?, tipologia=?, regione=?, annata=?, prezzo=?, quantitaDisponibile=?, img=? WHERE id=?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, a.getNome());
            ps.setString(2, a.getDescrizione());
            ps.setString(3, a.getTipologia());
            ps.setString(4, a.getRegione());
            ps.setInt(5, a.getAnnata());
            ps.setDouble(6, a.getPrezzo());
            ps.setInt(7, a.getQuantitaDisponibile());
            ps.setString(8, a.getImg());
            ps.setInt(9, a.getId());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean delete(int id, Connection conn) throws SQLException {
        String sql = "DELETE FROM Articolo WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private Articolo mapArticolo(ResultSet rs) throws SQLException {
        return new Articolo(
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
    }
} 