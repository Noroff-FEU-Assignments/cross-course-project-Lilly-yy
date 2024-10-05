document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();

    // Funksjon for å oppdatere handlekurv-telleren
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartCountElement = document.getElementById("cart-count");
        const totalItems = cart.reduce((total, product) => total + product.quantity, 0);

        cartCountElement.innerText = totalItems;
    }

    // Oppdatere når en vare legges til i handlekurven
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Kjør oppdateringsfunksjonen etter at et produkt er lagt til i handlekurven
            updateCartCount();
        });
    });
});
