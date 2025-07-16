package it.unisa.models;

import java.sql.Timestamp;

public class Carrello {
    private int id;
    private String username;
    private int idArticolo;
    private int quantita;
    private Timestamp dataAggiunta;
    private Timestamp dataModifica;
    
    public Carrello() {
    }
    
    public Carrello(String username, int idArticolo, int quantita) {
        this.username = username;
        this.idArticolo = idArticolo;
        this.quantita = quantita;
    }
    
    public Carrello(int id, String username, int idArticolo, int quantita, Timestamp dataAggiunta, Timestamp dataModifica) {
        this.id = id;
        this.username = username;
        this.idArticolo = idArticolo;
        this.quantita = quantita;
        this.dataAggiunta = dataAggiunta;
        this.dataModifica = dataModifica;
    }
    
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public int getIdArticolo() {
        return idArticolo;
    }
    
    public void setIdArticolo(int idArticolo) {
        this.idArticolo = idArticolo;
    }
    
    public int getQuantita() {
        return quantita;
    }
    
    public void setQuantita(int quantita) {
        this.quantita = quantita;
    }
    
    public Timestamp getDataAggiunta() {
        return dataAggiunta;
    }
    
    public void setDataAggiunta(Timestamp dataAggiunta) {
        this.dataAggiunta = dataAggiunta;
    }
    
    public Timestamp getDataModifica() {
        return dataModifica;
    }
    
    public void setDataModifica(Timestamp dataModifica) {
        this.dataModifica = dataModifica;
    }
}
