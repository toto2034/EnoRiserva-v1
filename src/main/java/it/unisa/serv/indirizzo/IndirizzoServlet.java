package it.unisa.serv.indirizzo;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import it.unisa.models.Indirizzo;
import it.unisa.models.IndirizzoDAO;
import it.unisa.serv.connessione.ConnectionManager;

@WebServlet("/indirizzo/nuovo")
public class IndirizzoServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");

        // Recupera i parametri dal form
        String nome = request.getParameter("nome");
        String cognome = request.getParameter("cognome");
        String via = request.getParameter("via");
        String numeroCivico = request.getParameter("numeroCivico");
        String citta = request.getParameter("citta");
        String cap = request.getParameter("cap");
        String provincia = request.getParameter("provincia");

        // Recupera lo username dalla sessione
        HttpSession session = request.getSession(false);
        String username = (session != null) ? (String) session.getAttribute("username") : null;

        // DEBUG: stampa tutti i parametri ricevuti
        System.out.println("--- DEBUG IndirizzoServlet ---");
        System.out.println("nome: " + nome);
        System.out.println("cognome: " + cognome);
        System.out.println("via: " + via);
        System.out.println("numeroCivico: " + numeroCivico);
        System.out.println("citta: " + citta);
        System.out.println("cap: " + cap);
        System.out.println("provincia: " + provincia);
        System.out.println("username (session): " + username);
        System.out.println("-----------------------------");

        if (username == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"success\":false, \"message\":\"Utente non autenticato\"}");
            return;
        }

        Indirizzo indirizzo = new Indirizzo();
        indirizzo.setNome(nome);
        indirizzo.setCognome(cognome);
        indirizzo.setVia(via);
        indirizzo.setNumeroCivico(numeroCivico);
        indirizzo.setCitta(citta);
        indirizzo.setCap(cap);
        indirizzo.setProvincia(provincia);
        indirizzo.setUsername(username);

        try (Connection conn = ConnectionManager.getConnection()) {
            IndirizzoDAO dao = new IndirizzoDAO();
            dao.salvaIndirizzo(indirizzo, conn);

            PrintWriter out = response.getWriter();
            out.write("{\"success\":true}");
        } catch (Exception e) {
            System.err.println("Errore durante il salvataggio dell'indirizzo: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\":false, \"message\":\"Errore salvataggio\"}");
        }
    }
}