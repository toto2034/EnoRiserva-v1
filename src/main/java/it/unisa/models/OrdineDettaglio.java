package it.unisa.models;

import java.math.BigDecimal;

public class OrdineDettaglio {
    private int idDettaglio;
    private int idOrdine;
    private int idProdotto;
    private String nomeProdotto;
    private int quantita;
    private BigDecimal prezzo;
    
    public OrdineDettaglio() {}
    
    public OrdineDettaglio(int idDettaglio, int idOrdine, int idProdotto, 
                          String nomeProdotto, int quantita, BigDecimal prezzo) {
        this.idDettaglio = idDettaglio;
        this.idOrdine = idOrdine;
        this.idProdotto = idProdotto;
        this.nomeProdotto = nomeProdotto;
        this.quantita = quantita;
        this.prezzo = prezzo;
    }
    
    // Getter e Setter
    public int getIdDettaglio() { return idDettaglio; }
    public void setIdDettaglio(int idDettaglio) { this.idDettaglio = idDettaglio; }
    
    public int getIdOrdine() { return idOrdine; }
    public void setIdOrdine(int idOrdine) { this.idOrdine = idOrdine; }
    
    public int getIdProdotto() { return idProdotto; }
    public void setIdProdotto(int idProdotto) { this.idProdotto = idProdotto; }
    
    public String getNomeProdotto() { return nomeProdotto; }
    public void setNomeProdotto(String nomeProdotto) { this.nomeProdotto = nomeProdotto; }
    
    public int getQuantita() { return quantita; }
    public void setQuantita(int quantita) { this.quantita = quantita; }
    
    public BigDecimal getPrezzo() { return prezzo; }
    public void setPrezzo(BigDecimal prezzo) { this.prezzo = prezzo; }
}