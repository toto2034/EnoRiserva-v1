package it.unisa.serv.auth;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import it.unisa.serv.jwt.JwtUtil;

@WebFilter("/*")
public class SessionFilter implements Filter {
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}


    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String requestURI = httpRequest.getRequestURI();
        
        // Escludi risorse statiche dal controllo sessione
        if (isStaticResource(requestURI)) {
            chain.doFilter(request, response);
            return;
        }
        
        // Log solo per richieste non statiche
        System.out.println("\n=== VERIFICA SESSIONE ===");
        System.out.println("URI richiesto: " + requestURI);
        
        // Verifica se esiste già una sessione valida
        HttpSession existingSession = httpRequest.getSession(false);
        boolean isAuthenticated = false;

        if (existingSession != null && existingSession.getAttribute("userLoggedIn") != null) {
            System.out.println("Sessione esistente trovata - ID: " + existingSession.getId());
            System.out.println("Username in sessione: " + existingSession.getAttribute("username"));
            System.out.println("Stato login: " + existingSession.getAttribute("userLoggedIn"));
            isAuthenticated = true;
        } else {
            System.out.println("Nessuna sessione valida trovata");
        }
        
        // Verifica cookie JWT
        Cookie[] cookies = httpRequest.getCookies();
        String jwtToken = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    jwtToken = cookie.getValue();
                    System.out.println("Token JWT trovato nei cookie");
                    break;
                }
            }
        }

        // Se abbiamo un token JWT ma non una sessione, verifica il token e ricrea la sessione
        if (jwtToken != null) {
            try {
                System.out.println("Verifico validità token JWT...");
                String username = JwtUtil.getUsernameFromToken(jwtToken);
                if (username != null && JwtUtil.validateToken(jwtToken, username)) {
                    System.out.println("Token JWT valido per l'utente: " + username);
                    HttpSession newSession = httpRequest.getSession(true);
                    newSession.setAttribute("userLoggedIn", true);
                    newSession.setAttribute("username", username);
                    request.setAttribute("navbarType", "login");  // Imposta navbar per utenti autenticati
                    System.out.println("Nuova sessione creata - ID: " + newSession.getId());
                } else {
                    System.out.println("Token JWT non valido o scaduto");
                    request.setAttribute("navbarType", "default");  // Imposta navbar default
                }
            } catch (Exception e) {
                System.err.println("Errore nella verifica del token JWT: " + e.getMessage());
                httpRequest.getServletContext().log("JWT verification error", e);
            }
        } else {
            System.out.println("Nessun token JWT trovato");
        }
        
        // Imposta il tipo di navbar in base allo stato di autenticazione
        if (isAuthenticated) {
            request.setAttribute("navbarType", "login");
        } else {
            request.setAttribute("navbarType", "default");
        }

        chain.doFilter(request, response);
    }
    
    /**
     * Verifica se la richiesta è per una risorsa statica
     */
    private boolean isStaticResource(String requestURI) {
        return requestURI != null && (
            requestURI.contains("/images/") ||
            requestURI.contains("/css/") ||
            requestURI.contains("/js/") ||
            requestURI.contains("/favicon.ico") ||
            requestURI.endsWith(".jpg") ||
            requestURI.endsWith(".jpeg") ||
            requestURI.endsWith(".png") ||
            requestURI.endsWith(".gif") ||
            requestURI.endsWith(".svg") ||
            requestURI.endsWith(".css") ||
            requestURI.endsWith(".js") ||
            requestURI.endsWith(".woff") ||
            requestURI.endsWith(".woff2") ||
            requestURI.endsWith(".ttf") ||
            requestURI.endsWith(".eot")
        );
    }
    
    @Override
    public void destroy() {}
}