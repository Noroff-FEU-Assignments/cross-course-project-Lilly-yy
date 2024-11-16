document.addEventListener("DOMContentLoaded", function () {
  const favoritesContainer = document.getElementById("favorites-container");

  // Load favorites from localStorage
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  console.log("Favorites loaded from localStorage:", favorites);

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "<p>You have no favorites yet.</p>";
  } else {
    renderFavorites(favorites, favoritesContainer);
  }
});

/**
 * Renders the list of favorite products.
 * @param {Array} favorites - The array of favorite products.
 * @param {HTMLElement} container - The container element where products will be displayed.
 */
function renderFavorites(favorites, container) {
  let favoritesHtml = "";

  favorites.forEach((product) => {
    favoritesHtml += `
      <div class="favorite-product">
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" class="favorite-product-image" />
        </a>
        <div class="favorite-product-details">
          <a href="product.html?id=${product.id}" class="product-link">
            <p class="product-name">${product.name}</p>
          </a>
          <p class="product-price">$${parseFloat(product.price).toFixed(2)}</p>
          <button class="remove-favorite" data-id="${product.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = favoritesHtml;

  // Attach event listeners for remove buttons
  container.querySelectorAll(".remove-favorite").forEach((button) => {
    button.addEventListener("click", handleRemoveFavorite);
  });
}

/**
 * Handles the removal of a product from favorites.
 * @param {Event} event - The click event triggered by the remove button.
 */
function handleRemoveFavorite(event) {
  const productId = event.target.closest("button").getAttribute("data-id");
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Remove the product from favorites
  favorites = favorites.filter((item) => item.id !== productId);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Reload the page to reflect changes
  location.reload();
}
