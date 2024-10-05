document.addEventListener("DOMContentLoaded", function () {
  const favoritesContainer = document.getElementById("favorites-container");

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  console.log("Favorites loaded from localStorage:", favorites);

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "<p>You have no favorites yet.</p>";
  } else {
    let favoritesHtml = "";

    favorites.forEach((product) => {
      favoritesHtml += `
                <div class="favorite-product">
                    <a href="product.html?id=${product.id}">
                        <img src="${product.image}" alt="${
        product.name
      }" class="favorite-product-image"/>
                    </a>
                    <div class="favorite-product-details">
                        <a href="product.html?id=${
                          product.id
                        }" class="product-link">
                            <p class="product-name">${product.name}</p>
                        </a>
                        <p class="product-price">$${product.price.toFixed(
                          2
                        )}</p>
                        <button class="remove-favorite" data-id="${
                          product.id
                        }"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
    });
    favoritesContainer.innerHTML = favoritesHtml;

    document.querySelectorAll(".remove-favorite").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        favorites = favorites.filter((item) => item.id !== productId);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        location.reload();
      });
    });
  }
});
