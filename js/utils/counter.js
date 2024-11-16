export function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountElement = document.getElementById("cart-count");

  const totalItems = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );

  cartCountElement.innerText = totalItems;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
