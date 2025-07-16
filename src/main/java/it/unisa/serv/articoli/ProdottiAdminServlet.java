package it.unisa.serv.articoli;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import it.unisa.models.Articolo;
import it.unisa.models.ArticoloDao;
import it.unisa.serv.connessione.ConnectionManager;

@WebServlet("/admin/prodotti")
public class ProdottiAdminServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        try (Connection conn = ConnectionManager.getConnection()) {
            ArticoloDao dao = new ArticoloDao();
            List<Articolo> prodotti = dao.getAll(conn);
            PrintWriter out = response.getWriter();
            out.print("[");
            for (int i = 0; i < prodotti.size(); i++) {
                Articolo a = prodotti.get(i);
                out.print("{\"id\":" + a.getId() + ",\"nome\":\"" + escape(a.getNome()) + "\",\"descrizione\":\"" + escape(a.getDescrizione()) + "\",\"prezzo\":" + a.getPrezzo() + ",\"quantitaDisponibile\":" + a.getQuantitaDisponibile() + ",\"img\":\"" + escape(a.getImg()) + "\"}");
                if (i < prodotti.size() - 1) out.print(",");
            }
            out.print("]");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("[]");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        String idStr = request.getParameter("id");
        String nome = request.getParameter("nome");
        String tipologia = request.getParameter("tipologia");
        String regione = request.getParameter("regione");
        String annata = request.getParameter("annata");
        String descrizione = request.getParameter("descrizione");
        String prezzoStr = request.getParameter("prezzo");
        String quantitaStr = request.getParameter("quantitaDisponibile");
        String img = request.getParameter("img");
        System.out.println("--- DEBUG INSERIMENTO/MODIFICA PRODOTTO ---");
        System.out.println("id: " + idStr);
        System.out.println("nome: " + nome);
        System.out.println("descrizione: " + descrizione);
        System.out.println("prezzo: " + prezzoStr);
        System.out.println("quantitaDisponibile: " + quantitaStr);
        System.out.println("img: " + img);
        try (Connection conn = ConnectionManager.getConnection()) {
            ArticoloDao dao = new ArticoloDao();
            boolean ok;
            if (idStr != null && !idStr.isEmpty()) {
                Articolo a = new Articolo(Integer.parseInt(idStr), nome, descrizione, tipologia, regione, Integer.parseInt(annata), Double.parseDouble(prezzoStr), Integer.parseInt(quantitaStr), img);
                ok = dao.update(a, conn);
            } else {
                Articolo a = new Articolo(0, nome, descrizione, tipologia, regione, Integer.parseInt(annata), Double.parseDouble(prezzoStr), Integer.parseInt(quantitaStr), img);
                ok = dao.insert(a, conn);
            }
            response.getWriter().write("{\"success\":" + ok + "}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\":false,\"message\":\"Errore salvataggio/modifica\"}");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        String idStr = request.getParameter("id");
        if (idStr == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"success\":false,\"message\":\"ID mancante\"}");
            return;
        }
        try (Connection conn = ConnectionManager.getConnection()) {
            ArticoloDao dao = new ArticoloDao();
            boolean ok = dao.delete(Integer.parseInt(idStr), conn);
            response.getWriter().write("{\"success\":" + ok + "}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\":false,\"message\":\"Errore eliminazione\"}");
        }
    }

    private String escape(String s) {
        return s == null ? "" : s.replace("\"", "\\\"");
    }
} 