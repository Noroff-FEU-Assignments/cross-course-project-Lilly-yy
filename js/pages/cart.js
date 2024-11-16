import { updateCartCount } from "../utils/counter.js";

document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("cart-items");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Cart loaded from localStorage on cart page:", cart);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    renderCartItems(cart, cartItemsContainer);
  }

  function renderCartItems(cart, container) {
    let cartHtml = "";
    let totalPrice = 0;

    cart.forEach((product, index) => {
      totalPrice += product.price * product.quantity;

      cartHtml += `
                <div class="cart-product">
                    <img src="${product.image}" alt="${
        product.name
      }" class="cart-product-image"/>
                    <div class="cart-product-details">
                        <p class="product-name">${product.name}</p>
                        <p class="product-size">Size: ${product.size}</p>
                        <div class="cart-product-controls">
                            <button class="decrease-quantity" data-index="${index}">-</button>
                            <span class="product-quantity">${
                              product.quantity
                            }</span>
                            <button class="increase-quantity" data-index="${index}">+</button>
                            <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
  <div class="product-price">$${(product.price * product.quantity).toFixed(
    2
  )}</div>
                </div>
            `;
    });

    const shippingCost = totalPrice < 100 ? 15 : 0;

    cartHtml += `
        <div class="cart-shipping">Shipping: $${shippingCost.toFixed(2)}</div>
        <div class="cart-total">Total: $${(totalPrice + shippingCost).toFixed(
          2
        )}</div>
    `;
    container.innerHTML = cartHtml;

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartItems(cart, container);
      });
    });

    document.querySelectorAll(".increase-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        cart[index].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartItems(cart, container);
      });
    });

    document.querySelectorAll(".decrease-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartItems(cart, container);
      });
    });
  }
});
