package it.unisa.serv.connessione;


import java.sql.*;

public class ConnectionManager {
    private static final String user= "root";
    private static final String pwd= "root";
    private static final String url="jdbc:mysql://127.0.0.1:3306/enoriserva";

    private static Connection conn;

    public static Connection getConnection() throws SQLException {
        try{
            Class.forName("com.mysql.cj.jdbc.Driver");
            //Class.forName("com.mysql.jdbc.Driver");
        }
        catch(Exception e){
            throw new SQLException("db non trovato");
        }
        if(conn==null || conn.isClosed()){
            conn= DriverManager.getConnection(url, user, pwd);
        }
        return conn;
    }


    public static void main(String[] args) {
        String user= "root";
        String pwd= "root";
        String url="jdbc:mysql://127.0.0.1:3306/enoriserva";

        try(Connection c =  DriverManager.getConnection(url, user, pwd)) {
            System.out.println("Connessione con successo");
            Statement stmt = c.createStatement();
            ResultSet rs = stmt.executeQuery("Show tables");

            while(rs.next()){
                System.out.println(rs.getString(1));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}