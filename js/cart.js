document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("cart-items");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    let cartHtml = "";
    let totalPrice = 0;

    cart.forEach((product, index) => {
      totalPrice += product.price * product.quantity;
      cartHtml += `
          <div class="cart-product-details">
            <div class="cart-product-info">
              <img src="${product.image}" alt="${
        product.name
      }" class="cart-product-image"/>
              <h3>${product.name}</h3>
              <p>Price: $${product.price.toFixed(2)}</p>
              <p>Quantity: ${product.quantity}</p>
              <button class="remove-item" data-index="${index}">Remove</button>
            </div>
          </div>
        `;
    });

    cartHtml += `<div class="cart-total">Total: $${totalPrice.toFixed(
      2
    )}</div>`;
    cartItemsContainer.innerHTML = cartHtml;

    // Legg til event listener for å fjerne produkter
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload(); // Last siden på nytt for å oppdatere handlekurven
      });
    });
  }
});
