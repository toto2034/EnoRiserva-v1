package it.unisa.serv.connessione;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class TestAivenConnessione {
    public static void main(String[] args) {
        String url = "";
        String user = "";
        String password = "";

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("✅ Connessione riuscita!");
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SHOW TABLES");

            while (rs.next()) {
                System.out.println("Tabella: " + rs.getString(1));
            }
        } catch (SQLException e) {
            System.out.println("❌ Errore di connessione:");
            e.printStackTrace();
        }
    }
}
