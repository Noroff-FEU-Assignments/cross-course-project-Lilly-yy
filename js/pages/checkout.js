document.addEventListener("DOMContentLoaded", function () {
  const cartSummaryContainer = document.getElementById("cart-summary");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Cart loaded from localStorage on checkout page:", cart);

  if (cart.length === 0) {
    cartSummaryContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let cartSummaryHtml = "";
  let totalPrice = 0;

  cart.forEach((product) => {
    totalPrice += product.price * product.quantity;

    cartSummaryHtml += `
            <div class="cart-summary-item">
                <img src="${product.image}" alt="${
      product.name
    }" class="cart-summary-image"/>
                <div class="cart-summary-details">
                    <p class="product-name">${product.name}</p>
                    <p class="product-size">Size: ${product.size}</p>
                    <p class="product-quantity">Quantity: ${
                      product.quantity
                    }</p>
                    <p class="product-price">$${(
                      product.price * product.quantity
                    ).toFixed(2)}</p>
                </div>
            </div>
        `;
  });

  const shippingCost = totalPrice < 100 ? 15 : 0;

  cartSummaryHtml += `
        <div class="cart-shipping-summary">Shipping: $${shippingCost.toFixed(
          2
        )}</div>
        <div class="cart-total-summary">Total: $${(
          totalPrice + shippingCost
        ).toFixed(2)}</div>
    `;
  cartSummaryContainer.innerHTML = cartSummaryHtml;
});

document.addEventListener("DOMContentLoaded", function () {
  const confirmPayButton = document.getElementById("confirm-pay-btn");

  if (confirmPayButton) {
    confirmPayButton.addEventListener("click", function (event) {
      // Prevent navigating to success.html immediately
      event.preventDefault();

      // Clear the cart from localStorage
      localStorage.removeItem("cart");

      // Redirect to the success page
      window.location.href = "success.html";
    });
  }
});
