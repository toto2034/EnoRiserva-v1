<%
  String ctx = request.getContextPath();
  String activePage = (String) request.getAttribute("activePage");
  if (activePage == null) activePage = "";
%>
<link rel="stylesheet" href="/EnoRiserva-v1/css/footer.css">
<footer class="footer">
  <div class="footer-container">
    <div class="footer-col footer-brand">
      <img src="<%= ctx %>/images/logo.png" alt="Logo" class="logo-img">

      <h3>EnoRiserva</h3>
      <p class="footer-desc">Un calice al giorno... leva il medico di torno</p>
    </div>
    <div class="footer-col footer-links">
      <h4>Link Utili</h4>
      <ul>
        <li><a href="/EnoRiserva-v1/home/">Home</a></li>
        <li><a href="/EnoRiserva-v1/home/catalogo/">Catalogo</a></li>
        <li><a href="/EnoRiserva-v1/home/contatti/">Contatti</a></li>
        <li><a href="/EnoRiserva-v1/home/auth/">Accedi/Registrati</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Termini e Condizioni</a></li>
      </ul>
    </div>
    <div class="footer-col footer-contact">
      <h4>Contatti</h4>
      <ul>
        <li><span>Email:</span> enoriserva@gmail.com</li>
        <li><span>Telefono:</span> +39 3805894569</li>
        <li><span>Indirizzo:</span> Via Bacco, 59, 80100 Napoli</li>
      </ul>

    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2025 EnoRiserva. Tutti i diritti riservati.</p>
  </div>
</footer>