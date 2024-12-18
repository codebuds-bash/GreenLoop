
    // Function to check if the user is logged in
    function checkLoginStatus() {
        const token = localStorage.getItem('token');
        const loginLink = document.getElementById('login-link');
        const registerLink = document.getElementById('register-link');
        const profileLink = document.getElementById('profile-link');
        const logoutLink = document.getElementById('logout-link');

        if (token) {
            // User is authenticated
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            profileLink.style.display = 'block';
            logoutLink.style.display = 'block';
        } else {
            // User is not authenticated
            loginLink.style.display = 'block';
            registerLink.style.display = 'block';
            profileLink.style.display = 'none';
            logoutLink.style.display = 'none';
        }
    }

    function logout() {
        localStorage.removeItem('token'); // Remove the token
        checkLoginStatus(); // Update UI
        window.location.href = '/index.html'; // Redirect to homepage
    }

    // Function to hide profile and logout links when clicking outside
    function hideDropdownOnClickOutside() {
        document.addEventListener("click", function (event) {
            const profileLink = document.getElementById("profile-link");
            const logoutLink = document.getElementById("logout-link");

            if (profileLink.style.display === "block" || logoutLink.style.display === "block") {
                const isClickInside = profileLink.contains(event.target) || logoutLink.contains(event.target);
                if (!isClickInside) {
                    profileLink.style.display = "none";
                    logoutLink.style.display = "none";
                }
            }
        });
    }

    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:3000/api/products'); // Replace with your API endpoint
            const products = await response.json();

            const productList = document.getElementById('product-list');
            productList.innerHTML = ''; // Clear the existing list

            products.forEach(product => {
                // Create a product card for each product in the array
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');

                // Create the HTML content for each product
                productCard.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                    <div class="product-details">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <span class="product-price">$${product.price}</span>
                    </div>
                `;

                // Append the product card to the product list
                productList.appendChild(productCard);
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Failed to load products. Please try again later.');
        }
    }

    // Call the function to load products when the page loads
    window.onload = function () {
        checkLoginStatus();
        hideDropdownOnClickOutside();
        loadProducts();
    };
