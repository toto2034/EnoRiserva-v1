package it.unisa.models;

public class Indirizzo {
    private int id;
    private String nome;
    private String cognome;
    private String via;
    private String numeroCivico;
    private String citta;
    private String cap;
    private String provincia;
    private String username;

    public Indirizzo() {}

    public Indirizzo(int id, String nome, String cognome, String via, String numeroCivico, String citta, String cap, String provincia, String username) {
        this.id = id;
        this.nome = nome;
        this.cognome = cognome;
        this.via = via;
        this.numeroCivico = numeroCivico;
        this.citta = citta;
        this.cap = cap;
        this.provincia = provincia;
        this.username = username;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCognome() { return cognome; }
    public void setCognome(String cognome) { this.cognome = cognome; }

    public String getVia() { return via; }
    public void setVia(String via) { this.via = via; }

    public String getNumeroCivico() { return numeroCivico; }
    public void setNumeroCivico(String numeroCivico) { this.numeroCivico = numeroCivico; }

    public String getCitta() { return citta; }
    public void setCitta(String citta) { this.citta = citta; }

    public String getCap() { return cap; }
    public void setCap(String cap) { this.cap = cap; }

    public String getProvincia() { return provincia; }
    public void setProvincia(String provincia) { this.provincia = provincia; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}
