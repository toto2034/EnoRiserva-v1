package it.unisa.serv.utenti;

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

import it.unisa.models.User;
import it.unisa.serv.connessione.ConnectionManager;

@WebServlet("/utenti")
public class AllUsers extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<User> utenti = new ArrayList<>();
        try (Connection conn = ConnectionManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM Utente")) {

            while (rs.next()) {
                User u = new User(
                    rs.getString("username"),
                    rs.getString("nome"),
                    rs.getString("cognome"),
                    rs.getString("email"),
                    rs.getString("password"),
                    rs.getString("tipo")
                );
                utenti.add(u);
            }
        } catch (SQLException e) {
            throw new ServletException(e);
        }

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        
        out.print("[");
        for (int i = 0; i < utenti.size(); i++) {
            User u = utenti.get(i);
            out.print("{");
            out.print("\"username\":\"" + escapeJson(u.getUsername()) + "\",");
            out.print("\"nome\":\"" + escapeJson(u.getNome()) + "\",");
            out.print("\"cognome\":\"" + escapeJson(u.getCognome()) + "\",");
            out.print("\"email\":\"" + escapeJson(u.getEmail()) + "\",");
            out.print("\"tipo\":\"" + escapeJson(u.getTipo()) + "\"");
            out.print("}");
            if (i < utenti.size() - 1) out.print(",");
        }
        out.print("]");
        out.flush();
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
}
