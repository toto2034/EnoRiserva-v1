package it.unisa.models;
//nome, descrizione, tipologia, regione, annata, prezzo, quantita, img
public class Articolo {
    int id;
    String nome;
    String descrizione;
    String tipologia;
    String regione;
    int annata;
    double prezzo;
    int quantitaDisponibile;
    String img;


    public Articolo(int id, String nome, String descrizione, String tipologia, String regione, int annata, double prezzo, int quantitaDisponibile, String img) {
        this.id = id;
        this.nome = nome;
        this.descrizione = descrizione;
        this.tipologia = tipologia;
        this.regione = regione;
        this.annata = annata;
        this.prezzo = prezzo;
        this.quantitaDisponibile = quantitaDisponibile;
        this.img = img; 
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public int getAnnata() { return annata; }

    public void setAnnata(int annata) { this.annata = annata; }

    public String getRegione() { return regione; }

    public void setRegione(String regione) { this.regione = regione; }

    public String getTipologia() { return tipologia; }

    public void setTipologia(String tipologia) { this.tipologia = tipologia; }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public double getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(double prezzo) {
        this.prezzo = prezzo;
    }

    public int getQuantitaDisponibile() {
        return quantitaDisponibile;
    }

    public void setQuantitaDisponibile(int quantitaDisponibile) {
        this.quantitaDisponibile = quantitaDisponibile;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    @Override
    public String toString() {
        return "Articolo{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", descrizione='" + descrizione + '\'' +
                ", prezzo=" + prezzo +
                ", quantita=" + quantitaDisponibile +
                ", img='" + img + '\'' +
                '}';
    }
}
