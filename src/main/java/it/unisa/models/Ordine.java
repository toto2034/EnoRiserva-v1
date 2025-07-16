package it.unisa.models;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

public class Ordine {
    private int idOrdine;
    private String username;
    private BigDecimal totale;
    private Timestamp dataOrdine;
    private int idIndirizzo;
    private String metodoPagamento;
    private String stato; // es: "CONFERMATO", "SPEDITO", "CONSEGNATO"
    
    // Lista prodotti dell'ordine (per il modello Java)
    private List<OrdineDettaglio> prodotti;
    
    public Ordine() {}
    
    public Ordine(int idOrdine, String username, BigDecimal totale, Timestamp dataOrdine, 
                  int idIndirizzo, String metodoPagamento, String stato) {
        this.idOrdine = idOrdine;
        this.username = username;
        this.totale = totale;
        this.dataOrdine = dataOrdine;
        this.idIndirizzo = idIndirizzo;
        this.metodoPagamento = metodoPagamento;
        this.stato = stato;
    }
    
    // Getter e Setter
    public int getIdOrdine() { return idOrdine; }
    public void setIdOrdine(int idOrdine) { this.idOrdine = idOrdine; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public BigDecimal getTotale() { return totale; }
    public void setTotale(BigDecimal totale) { this.totale = totale; }
    
    public Timestamp getDataOrdine() { return dataOrdine; }
    public void setDataOrdine(Timestamp dataOrdine) { this.dataOrdine = dataOrdine; }
    
    public int getIdIndirizzo() { return idIndirizzo; }
    public void setIdIndirizzo(int idIndirizzo) { this.idIndirizzo = idIndirizzo; }
    
    public String getMetodoPagamento() { return metodoPagamento; }
    public void setMetodoPagamento(String metodoPagamento) { this.metodoPagamento = metodoPagamento; }
    
    public String getStato() { return stato; }
    public void setStato(String stato) { this.stato = stato; }
    
    public List<OrdineDettaglio> getProdotti() { return prodotti; }
    public void setProdotti(List<OrdineDettaglio> prodotti) { this.prodotti = prodotti; }
}
