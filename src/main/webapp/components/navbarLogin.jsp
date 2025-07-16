<% 
    String ctx = request.getContextPath(); 
    String activePage = (String) request.getAttribute("activePage");
    if (activePage == null) activePage = "";
%>
<nav class="navbar">
    <div class="nav-container">
        <div class="logo-container">
            <img src="<%= ctx %>/images/logo.png" alt="Logo" class="logo-img">
            <div class="logo-text">SleepingSmarttress</div>
        </div>
        <ul class="nav-links">
            <li><a href="<%= ctx %>/home/" class="<%= "home".equals(activePage) ? "active" : "" %>">Home</a></li>
            <li><a href="<%= ctx %>/home/contatti/" class="<%= "contatti".equals(activePage) ? "active" : "" %>">Contatti</a></li>
            <li><a href="<%= ctx %>/home/catalogo/" class="<%= "catalogo".equals(activePage) ? "active" : "" %>">Catalogo</a></li>
            <li><a href="<%= ctx %>/home/profilo/" class="<%= "auth".equals(activePage) ? "active" : "" %>">Profilo</a></li>
            <li><a href="<%= ctx %>/home/carrello/" class="<%= "carrello".equals(activePage) ? "active" : "" %>" title="Carrello">
                <i class="fas fa-shopping-cart"></i>
            </a></li>
        </ul>
        <div class="hamburger" id="openMobileMenu" aria-label="Apri menu mobile" tabindex="0">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</nav>
<!-- Overlay oscurante per il menu mobile -->
<div id="mobileMenuOverlay" class="mobile-menu-overlay"></div>
<!-- Menu mobile a tendina stile Apple -->
<nav id="mobileMenu" class="mobile-menu" aria-label="Menu mobile">
    <button class="close-btn" id="closeMobileMenu" aria-label="Chiudi menu">&times;</button>
    <ul class="menu-list">
        <li><a href="<%= ctx %>/home/" class="<%= "home".equals(activePage) ? "active" : "" %>">Home</a></li>
        <li><a href="<%= ctx %>/home/contatti/" class="<%= "contatti".equals(activePage) ? "active" : "" %>">Contatti</a></li>
        <li><a href="<%= ctx %>/home/catalogo/" class="<%= "catalogo".equals(activePage) ? "active" : "" %>">Catalogo</a></li>
        <li><a href="<%= ctx %>/home/profilo/" class="<%= "auth".equals(activePage) ? "active" : "" %>">Profilo</a></li>
        <li><a href="<%= ctx %>/home/carrello/" class="<%= "carrello".equals(activePage) ? "active" : "" %>" title="Carrello">
            <i class="fas fa-shopping-cart"></i>
        </a></li>
    </ul>
</nav>