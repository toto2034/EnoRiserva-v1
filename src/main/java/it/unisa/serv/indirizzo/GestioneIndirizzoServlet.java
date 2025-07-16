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

@WebServlet("/indirizzo/gestione")
public class GestioneIndirizzoServlet extends HttpServlet {
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        HttpSession session = request.getSession(false);
        String username = (session != null) ? (String) session.getAttribute("username") : null;
        String idStr = request.getParameter("id");
        System.out.println("[DEBUG] doDelete - username: " + username + ", id: " + idStr);
        if (username == null || idStr == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"success\":false,\"message\":\"Dati mancanti\"}");
            return;
        }
        int id = Integer.parseInt(idStr);
        try (Connection conn = ConnectionManager.getConnection()) {
            IndirizzoDAO dao = new IndirizzoDAO();
            boolean ok = dao.eliminaIndirizzo(id, username, conn);
            PrintWriter out = response.getWriter();
            if (ok) out.write("{\"success\":true}");
            else out.write("{\"success\":false,\"message\":\"Indirizzo non trovato\"}");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\":false,\"message\":\"Errore eliminazione\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        HttpSession session = request.getSession(false);
        String username = (session != null) ? (String) session.getAttribute("username") : null;
        String idStr = request.getParameter("id");
        if (username == null || idStr == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"success\":false,\"message\":\"Dati mancanti\"}");
            return;
        }
        int id = Integer.parseInt(idStr);
        String nome = request.getParameter("nome");
        String cognome = request.getParameter("cognome");
        String via = request.getParameter("via");
        String numeroCivico = request.getParameter("numeroCivico");
        String citta = request.getParameter("citta");
        String cap = request.getParameter("cap");
        String provincia = request.getParameter("provincia");
        try (Connection conn = ConnectionManager.getConnection()) {
            IndirizzoDAO dao = new IndirizzoDAO();
            Indirizzo indirizzo = new Indirizzo(id, nome, cognome, via, numeroCivico, citta, cap, provincia, username);
            boolean ok = dao.aggiornaIndirizzo(indirizzo, conn);
            PrintWriter out = response.getWriter();
            if (ok) out.write("{\"success\":true}");
            else out.write("{\"success\":false,\"message\":\"Indirizzo non trovato\"}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\":false,\"message\":\"Errore aggiornamento\"}");
        }
    }
} 