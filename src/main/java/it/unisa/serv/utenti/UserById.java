package it.unisa.serv.utenti;

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

import it.unisa.serv.connessione.ConnectionManager;

@WebServlet(name = "UserByIdServlet", urlPatterns = {"/utenti/userbyid"})
public class UserById extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        if (username == null || username.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"error\":\"Parametro username mancante\"}");
            return;
        }
        try (Connection conn = ConnectionManager.getConnection()) {
            String query = "SELECT * FROM Utente WHERE username = ?";
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setString(1, username);
                ResultSet rs = stmt.executeQuery();
                if (rs.next()) {
                    String nome = rs.getString("nome");
                    String cognome = rs.getString("cognome");
                    String email = rs.getString("email");
                    String tipo = rs.getString("tipo");
                    String json = String.format("{\"username\":\"%s\",\"nome\":\"%s\",\"cognome\":\"%s\",\"email\":\"%s\",\"tipo\":\"%s\"}",
                            username, nome, cognome, email, tipo);
                    out.print(json);
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"error\":\"Utente non trovato\"}");
                }
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"Errore database: " + e.getMessage() + "\"}");
        }
    }
}
