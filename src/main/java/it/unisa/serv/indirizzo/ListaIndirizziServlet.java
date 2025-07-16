package it.unisa.serv.indirizzo;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import it.unisa.models.Indirizzo;
import it.unisa.models.IndirizzoDAO;
import it.unisa.serv.connessione.ConnectionManager;

@WebServlet("/indirizzo/lista")
public class ListaIndirizziServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        HttpSession session = request.getSession(false);
        String username = (session != null) ? (String) session.getAttribute("username") : null;
        System.out.println("[DEBUG] ListaIndirizziServlet - username: " + username);
        if (username == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("[]");
            return;
        }
        try (Connection conn = ConnectionManager.getConnection()) {
            IndirizzoDAO dao = new IndirizzoDAO();
            List<Indirizzo> indirizzi = dao.indirizziPerUtente(username, conn);
            System.out.println("[DEBUG] ListaIndirizziServlet - indirizzi trovati: " + indirizzi.size());
            PrintWriter out = response.getWriter();
            out.print("[");
            for (int i = 0; i < indirizzi.size(); i++) {
                Indirizzo ind = indirizzi.get(i);
                out.print("{\"id\":" + ind.getId() + ",\"nome\":\"" + escape(ind.getNome()) + "\",\"cognome\":\"" + escape(ind.getCognome()) + "\",\"via\":\"" + escape(ind.getVia()) + "\",\"numeroCivico\":\"" + escape(ind.getNumeroCivico()) + "\",\"citta\":\"" + escape(ind.getCitta()) + "\",\"cap\":\"" + escape(ind.getCap()) + "\",\"provincia\":\"" + escape(ind.getProvincia()) + "\"}");
                if (i < indirizzi.size() - 1) out.print(",");
            }
            out.print("]");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("[]");
        }
    }
    private String escape(String s) {
        return s == null ? "" : s.replace("\"", "\\\"");
    }
}
