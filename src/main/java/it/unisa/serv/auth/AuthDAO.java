package it.unisa.serv.auth;

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
import javax.servlet.http.HttpSession;

import it.unisa.models.User;
import it.unisa.serv.connessione.ConnectionManager;
import it.unisa.serv.jwt.JwtUtil;

@WebServlet(name = "AuthServlet", urlPatterns = {"/auth/register", "/auth/login"})
public class AuthDAO extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("doPost chiamato con path: " + request.getServletPath());
        String path = request.getServletPath();
        if ("/auth/register".equals(path)) {
            handleRegister(request, response);
        } else if ("/auth/login".equals(path)) {
            handleLogin(request, response);
        }
    }

    private void handleRegister(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String username = request.getParameter("username");
        String nome = request.getParameter("nome");
        String cognome = request.getParameter("cognome");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String tipo = request.getParameter("tipo"); // Get tipo from request
        
        if (tipo == null || tipo.isEmpty()) {
            tipo = "Cliente"; // default to "Cliente" if not specified
        }
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        // Validazione lato backend
        if (username == null || username.length() < 4 || !username.matches("[a-zA-Z0-9._-]{4,}")) {
            out.print("{\"success\":false,\"error\":\"Username non valido (min 4 caratteri, solo lettere, numeri, . _ -)\"}");
            return;
        }
        if (password == null || password.length() < 8) {
            out.print("{\"success\":false,\"error\":\"La password deve essere di almeno 8 caratteri\"}");
            return;
        }
        if (email == null || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            out.print("{\"success\":false,\"error\":\"Email non valida\"}");
            return;
        }

        try (Connection conn = ConnectionManager.getConnection()) {
            // Controllo se la mail esiste già
            String checkEmailQuery = "SELECT COUNT(*) FROM Utente WHERE email = ?";
            try (PreparedStatement checkStmt = conn.prepareStatement(checkEmailQuery)) {
                checkStmt.setString(1, email);
                ResultSet rs = checkStmt.executeQuery();
                rs.next();
                if (rs.getInt(1) > 0) {
                    out.print("{\"success\":false,\"error\":\"Email già registrata. Scegli un'altra email.\"}");
                    return;
                }
            }
            // Controllo se username esiste già
            String checkUserQuery = "SELECT COUNT(*) FROM Utente WHERE username = ?";
            try (PreparedStatement checkStmt = conn.prepareStatement(checkUserQuery)) {
                checkStmt.setString(1, username);
                ResultSet rs = checkStmt.executeQuery();
                rs.next();
                if (rs.getInt(1) > 0) {
                    out.print("{\"success\":false,\"error\":\"Username già esistente. Scegli un altro username.\"}");
                    return;
                }
            }
            // Inserimento nuovo utente con tutti i campi obbligatori
            String insertQuery = "INSERT INTO Utente (username, nome, cognome, email, password, tipo) VALUES (?, ?, ?, ?, SHA2(?, 512), ?)";
            try (PreparedStatement insertStmt = conn.prepareStatement(insertQuery)) {
                insertStmt.setString(1, username);
                insertStmt.setString(2, nome);
                insertStmt.setString(3, cognome);
                insertStmt.setString(4, email);
                insertStmt.setString(5, password);
                insertStmt.setString(6, tipo);
                insertStmt.executeUpdate();
                
                String jsonResponse = String.format(
                    "{\"success\":true,\"message\":\"Benvenuto %s, Grazie per esserti registrato! Inizia ad acquistare su SleepingSmarttress\",\"redirect\":\"%s/home/\"}",
                    nome,
                    request.getContextPath()
                );
                out.print(jsonResponse);
            }
        } catch (SQLException e) {
            String jsonError = String.format("{\"success\":false,\"error\":\"%s\"}", e.getMessage().replace("\"", "'"));
            out.print(jsonError);
        }
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {
        System.out.println("\n============= INIZIO PROCESSO DI LOGIN =============");
        System.out.println("Timestamp: " + new java.util.Date());
        System.out.println("=== PARAMETRI RICEVUTI ===");
        request.getParameterMap().forEach((k, v) -> System.out.println(k + ": " + java.util.Arrays.toString(v)));
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
    System.out.println("DEBUG LOGIN - username: " + username + ", password: " + password);
    
    // Non impostiamo subito il content type perché potremmo fare redirect
    PrintWriter out = response.getWriter();
    
    if (username == null || password == null) {
        System.out.println("ERROR: Username o password null");
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        out.print("{\"error\":\"Parametri mancanti\"}");
        return;
    }
    
    Connection conn = null;
    try {
        System.out.println("Tentativo di connessione al DB...");
        conn = ConnectionManager.getConnection();
        if (conn == null) {
            System.err.println("ERRORE: Connessione al database fallita - connection è null");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"Errore di connessione al database\"}");
            return;
        }
        System.out.println("Connessione DB stabilita, eseguo query...");
        String query = "SELECT * FROM Utente WHERE username = ? AND password = SHA2(?, 512)";
        try (PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, username);
            stmt.setString(2, password);
            System.out.println("Query preparata, eseguo...");
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                // Utente trovato nel database
                String nome = rs.getString("nome");
                String cognome = rs.getString("cognome");
                String email = rs.getString("email");
                String tipo = rs.getString("tipo");
                
                // Creiamo un oggetto Utente e lo mettiamo in sessione
                User utente = new User(username, nome, cognome, email, tipo);
                
                // Salva in sessione
                HttpSession session = request.getSession(true); // Crea nuova sessione se non esiste
                session.setAttribute("user", utente);
                session.setAttribute("userLoggedIn", true);
                session.setAttribute("username", username);
                session.setMaxInactiveInterval(3600); // 1 ora di timeout
                
                // Genera JWT e salvalo come cookie
                String token = JwtUtil.generateToken(username, tipo);
                
                // Crea il cookie JWT
                javax.servlet.http.Cookie jwtCookie = new javax.servlet.http.Cookie("jwt", token);
                jwtCookie.setMaxAge(3600); // 1 ora
                jwtCookie.setPath("/");
                jwtCookie.setHttpOnly(true); // Per sicurezza
                response.addCookie(jwtCookie);
                
                // Debug info sessione e token
                System.out.println("\n=== DEBUG SESSIONE ===");
                System.out.println("ID Sessione: " + session.getId());
                System.out.println("Creata il: " + new java.util.Date(session.getCreationTime()));
                System.out.println("Ultimo accesso: " + new java.util.Date(session.getLastAccessedTime()));
                System.out.println("Max Inactive Interval: " + session.getMaxInactiveInterval());
                System.out.println("Attributi sessione:");
                System.out.println("- user: " + session.getAttribute("user"));
                System.out.println("- userLoggedIn: " + session.getAttribute("userLoggedIn"));
                System.out.println("- username: " + session.getAttribute("username"));
                
                // Debug info token
                System.out.println("\n=== DEBUG TOKEN ===");
                JwtUtil.debugToken(token);
                
                System.out.println("Login riuscito: " + nome + " " + cognome);
                
                // Invia JSON di successo invece di redirect per permettere al frontend di mostrare il messaggio
                response.setContentType("application/json");
                String jsonResponse = String.format(
                    "{\"success\":true,\"message\":\"Login effettuato correttamente\",\"redirect\":\"/SleepingSmarttress/home/\"}",
                    username, nome, cognome, email, tipo, token
                );
                out.print(jsonResponse);
            } else {
                System.out.println("\n=== ERRORE AUTENTICAZIONE ===");
                System.out.println("Nessun utente trovato con username=" + username);
                System.out.println("Timestamp: " + new java.util.Date());
                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                out.print("{\"error\":\"Username o password errati\"}");
            }
        }
    } catch (SQLException e) {
        System.err.println("Errore SQL: " + e.getMessage());
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.print("{\"error\":\"Errore durante il login: " + e.getMessage() + "\"}");
    } catch (Exception e) {
        System.err.println("Errore generico: " + e.getMessage());
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.print("{\"error\":\"Errore interno del server\"}");
    } finally {
        if (conn != null) {
            try {
                conn.close();
                System.out.println("Connessione al DB chiusa");
            } catch (SQLException e) {
                System.err.println("Errore nella chiusura della connessione: " + e.getMessage());
            }
        }
    }
}

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/plain");
        response.getWriter().print("Auth servlet attivo. Usa POST per login o registrazione.");
    }
}