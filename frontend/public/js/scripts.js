function toggleSidebar() {
    let sidebar = document.querySelector(".sidebar");
    let hamburger = document.querySelector(".hamburger");

    sidebar.classList.toggle("open");

    // Hide the hamburger when sidebar is open
    if (sidebar.classList.contains("open")) {
        hamburger.style.display = "none";
    } else {
        hamburger.style.display = "block";
    }
}
