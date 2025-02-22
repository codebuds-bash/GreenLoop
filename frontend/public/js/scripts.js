function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}
function checkLoginStatus() {
    const token = localStorage.getItem('token');

    // Navbar elements
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const profileLink = document.getElementById('profile-link');
    const logoutLink = document.getElementById('logout-link');
    const cartIcon = document.getElementById('cart-icon');

    // Sidebar elements
    const sidebarLoginLink = document.querySelector('.sidebar #login-link');
    const sidebarRegisterLink = document.querySelector('.sidebar #register-link');
    const sidebarProfileLink = document.querySelector('.sidebar #profile-link');
    const sidebarLogoutLink = document.querySelector('.sidebar #logout-link');

    if (token) {
        // User is authenticated
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        profileLink.style.display = 'block';
        logoutLink.style.display = 'block';
        cartIcon.style.display = 'block';

        sidebarLoginLink.style.display = 'none';
        sidebarRegisterLink.style.display = 'none';
        sidebarProfileLink.style.display = 'block';
        sidebarLogoutLink.style.display = 'block';
    } else {
        // User is not authenticated
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        profileLink.style.display = 'none';
        logoutLink.style.display = 'none';
        cartIcon.style.display = 'none';

        sidebarLoginLink.style.display = 'block';
        sidebarRegisterLink.style.display = 'block';
        sidebarProfileLink.style.display = 'none';
        sidebarLogoutLink.style.display = 'none';
    }
}