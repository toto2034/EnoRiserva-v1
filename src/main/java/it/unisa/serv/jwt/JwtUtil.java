package it.unisa.serv.jwt;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtUtil {
    
    // Chiave fissa per evitare problemi al riavvio del server
    private static final String SECRET_STRING = "mySecretKeyForEnoRiservaProjectThatIsLongEnoughForHS256Algorithm";
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET_STRING.getBytes());
    private static final long JWT_TOKEN_VALIDITY = 5 * 60 * 60 * 1000; // 5 ore in millisecondi


    // Genera token per l'utente (basato su username come identificatore principale)
    public static String generateToken(String username, String userType) {
        System.out.println("JwtUtil: Generazione token per username: " + username + ", tipo: " + userType);
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        claims.put("userType", userType);
        
        String token = Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))
                .signWith(SECRET_KEY)
                .compact();
        
        System.out.println("JwtUtil: Token generato con successo. Lunghezza: " + token.length());
        return token;
    }
    
    // Verifica validità del token
    public static Boolean validateToken(String token, String username) {
        try {
            System.out.println("JwtUtil: Verifica token per username: " + username);
            final String tokenUsername = getUsernameFromToken(token);
            boolean isValid = (tokenUsername.equals(username) && !isTokenExpired(token));
            System.out.println("JwtUtil: Token validato: " + isValid + 
                             " (username corrispondente: " + tokenUsername.equals(username) + 
                             ", non scaduto: " + !isTokenExpired(token) + ")");
            return isValid;
        } catch (io.jsonwebtoken.security.SignatureException e) {
            System.out.println("JwtUtil: Token con firma non valida (probabilmente server riavviato): " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.out.println("JwtUtil: Errore durante la validazione del token: " + e.getMessage());
            return false;
        }
    }
    
    // Estrae username dal token
    public static String getUsernameFromToken(String token) {
        String username = getClaimFromToken(token, Claims::getSubject);
        System.out.println("JwtUtil: Username estratto dal token: " + username);
        return username;
    }
    
    // Estrae data di scadenza dal token
    public static Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }
    
    // Estrae proprietà dal token
    public static <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }
    
    // Estrae tutte le proprietà dal token
    private static Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    // Verifica se il token è scaduto
    public static Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        boolean isExpired = expiration.before(new Date());
        System.out.println("JwtUtil: Token scadenza: " + expiration + ", è scaduto: " + isExpired);
        return isExpired;
    }
    
    // Metodo per verificare un token e stampare tutte le info contenute
    public static void debugToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            System.out.println("======= DEBUG TOKEN =======");
            System.out.println("Subject: " + claims.getSubject());
            System.out.println("Emesso il: " + claims.getIssuedAt());
            System.out.println("Scade il: " + claims.getExpiration());
            System.out.println("Username: " + claims.get("username", String.class));
            System.out.println("Tipo utente: " + claims.get("userType", String.class));
            System.out.println("==========================");
        } catch (Exception e) {
            System.out.println("Errore durante il debug del token: " + e.getMessage());
        }
    }
}