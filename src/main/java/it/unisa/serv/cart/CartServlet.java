/**
 * CartServlet - Gestisce il carrello SOLO su database per utenti autenticati
 * 
 * Funzionamento:
 * 1. NON LOGGATO: carrello solo in localStorage (JS)
 * 2. LOGGATO: carrello solo su database
 * 3. Al login: sincronizza localStorage -> database
 */
package it.unisa.serv.cart;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import it.unisa.models.Articolo;
import it.unisa.models.Carrello;
import it.unisa.models.CarrelloDAO;
import it.unisa.models.CarrelloItem;

@WebServlet(urlPatterns = {"/api/cart/add", "/api/cart/get", "/api/cart/remove/*", "/api/cart/update/*", "/api/cart/sync", "/api/cart/clear", "/api/cart/test"})
public class CartServlet extends HttpServlet {


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        String requestURI = request.getRequestURI();
        if (requestURI.endsWith("/test")) {
            out.print("{\"status\":\"CartServlet attiva\",\"timestamp\":\"" + new java.util.Date() + "\"}");
            return;
        }
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userLoggedIn") == null) {
            out.print("{\"error\":\"Non autenticato\"}");
            return;
        }
        String username = (String) session.getAttribute("username");
        if (username == null) {
            out.print("{\"error\":\"Username non trovato nella sessione\"}");
            return;
        }
        if (requestURI.endsWith("/get")) {
            try {
                CarrelloDAO cartDAO = new CarrelloDAO();
                List<CarrelloItem> carrelloList = cartDAO.getCarrelloCompletoByUsername(username);
                StringBuilder json = new StringBuilder("[");
                boolean first = true;
                for (CarrelloItem item : carrelloList) {
                    if (!first) json.append(",");
                    Articolo articolo = item.getArticolo();
                    if (articolo != null) {
                        json.append("{")
                            .append("\"id\":").append(item.getIdArticolo()).append(",")
                            .append("\"nome\":\"").append(articolo.getNome().replace("\"", "\\\"")).append("\",")
                            .append("\"descrizione\":\"").append(articolo.getDescrizione().replace("\"", "\\\"")).append("\",")
                            .append("\"prezzo\":").append(articolo.getPrezzo()).append(",")
                            .append("\"quantita\":").append(item.getQuantita()).append(",")
                            .append("\"immagine\":\"").append(articolo.getImg()).append("\"")
                            .append("}");
                    }
                    first = false;
                }
                json.append("]");
                out.print(json.toString());
            } catch (SQLException e) {
                out.print("{\"error\":\"Errore nel recupero carrello\"}");
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userLoggedIn") == null) {
            out.print("{\"error\":\"Non autenticato\"}");
            return;
        }
        String username = (String) session.getAttribute("username");
        if (username == null) {
            out.print("{\"error\":\"Username non trovato nella sessione\"}");
            return;
        }
        String requestURI = request.getRequestURI();
        if (requestURI.endsWith("/add")) {
            String productId = request.getParameter("productId");
            String quantityStr = request.getParameter("quantity");
            if (productId == null) {
                out.print("{\"error\":\"ID prodotto mancante\"}");
                return;
            }
            int quantity = 1;
            if (quantityStr != null) {
                try {
                    quantity = Integer.parseInt(quantityStr);
                } catch (NumberFormatException e) {
                    quantity = 1;
                }
            }
            try {
                Carrello carrello = new Carrello(username, Integer.parseInt(productId), quantity);
                CarrelloDAO cartDAO = new CarrelloDAO();
                cartDAO.addCarrello(carrello);
                out.print("{\"success\":true,\"message\":\"Prodotto aggiunto al carrello\"}");
            } catch (SQLException e) {
                out.print("{\"error\":\"Errore nell'aggiunta al carrello\"}");
            } catch (NumberFormatException e) {
                out.print("{\"error\":\"ID prodotto non valido\"}");
            }
        } else if (requestURI.endsWith("/sync")) {
            String body = request.getReader().lines().reduce("", (acc, line) -> acc + line);
            try {
                if (body != null && !body.trim().isEmpty() && !body.equals("[]")) {
                    CarrelloDAO cartDAO = new CarrelloDAO();
                    String[] items = body.replace("[", "").replace("]", "").split("\\},\\{");
                    for (int i = 0; i < items.length; i++) {
                        String item = items[i];
                        item = item.replace("{", "").replace("}", "");
                        String[] fields = item.split(",");
                        String productId = null;
                        int quantity = 0;
                        for (String field : fields) {
                            String[] keyValue = field.split(":");
                            if (keyValue.length == 2) {
                                String key = keyValue[0].trim().replace("\"", "");
                                String value = keyValue[1].trim().replace("\"", "");
                                if ("id".equals(key)) {
                                    productId = value;
                                } else if ("quantita".equals(key)) {
                                    try {
                                        quantity = Integer.parseInt(value);
                                    } catch (NumberFormatException e) {
                                        quantity = 1;
                                    }
                                }
                            }
                        }
                        if (productId != null && quantity > 0) {
                            Carrello carrello = new Carrello(username, Integer.parseInt(productId), quantity);
                            cartDAO.addCarrello(carrello);
                        }
                    }
                }
                out.print("{\"success\":true,\"message\":\"Carrello sincronizzato\"}");
            } catch (Exception e) {
                out.print("{\"success\":false,\"error\":\"Errore nella sincronizzazione\"}");
            }
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userLoggedIn") == null) {
            out.print("{\"error\":\"Non autenticato\"}");
            return;
        }
        String username = (String) session.getAttribute("username");
        if (username == null) {
            out.print("{\"error\":\"Username non trovato nella sessione\"}");
            return;
        }
        String requestURI = request.getRequestURI();
        try {
            CarrelloDAO cartDAO = new CarrelloDAO();
            if (requestURI.contains("/remove/")) {
                String productId = requestURI.substring(requestURI.lastIndexOf("/") + 1);
                cartDAO.deleteCarrelloByProductId(username, Integer.parseInt(productId));
                out.print("{\"success\":true}");
            } else if (requestURI.endsWith("/clear")) {
                cartDAO.deleteCarrelloByUsername(username);
                out.print("{\"success\":true,\"message\":\"Carrello svuotato con successo\"}");
            }
        } catch (Exception e) {
            out.print("{\"error\":\"Errore nella rimozione dal carrello\"}");
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userLoggedIn") == null) {
            out.print("{\"error\":\"Non autenticato\"}");
            return;
        }
        String username = (String) session.getAttribute("username");
        if (username == null) {
            out.print("{\"error\":\"Username non trovato nella sessione\"}");
            return;
        }
        String requestURI = request.getRequestURI();
        if (requestURI.contains("/update/")) {
            String productId = requestURI.substring(requestURI.lastIndexOf("/") + 1);
            String quantityStr = request.getParameter("quantity");
            if (quantityStr != null) {
                try {
                    int newQuantity = Integer.parseInt(quantityStr);
                    CarrelloDAO cartDAO = new CarrelloDAO();
                    if (newQuantity <= 0) {
                        cartDAO.deleteCarrelloByProductId(username, Integer.parseInt(productId));
                    } else {
                        cartDAO.updateQuantitaByProductId(username, Integer.parseInt(productId), newQuantity);
                    }
                    out.print("{\"success\":true}");
                } catch (NumberFormatException | SQLException e) {
                    out.print("{\"error\":\"Quantità non valida o errore DB\"}");
                }
            } else {
                out.print("{\"error\":\"Quantità mancante\"}");
            }
        }
    }
}