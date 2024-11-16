import apiConfig from "../constants/api.js";
import { displayError } from "../utils/displayError.js";

document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.querySelector(".product-column ul");
  const loadingIndicator = document.querySelector(".loading");
  const resultsContainer = document.querySelector(".results");

  const { apiUrl, apiKey, apiSecret } = apiConfig;
  async function fetchProducts() {
    try {
      // Vis loading indicator
      loadingIndicator.style.display = "block";

      const credentials = btoa(`${apiKey}:${apiSecret}`);
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      displayProducts(data);
    } catch (error) {
      resultsContainer.innerHTML = displayError(
        "An error occurred while fetching products. Please try again later."
      );
    } finally {
      // Skjul loading indicator
      loadingIndicator.style.display = "none";
    }
  }

  function displayProducts(products) {
    if (!Array.isArray(products)) {
      resultsContainer.innerHTML = displayError(
        "Unexpected data format received. Please try again later."
      );
      return;
    }

    productContainer.innerHTML = "";

    // Filtrere på herrejakker
    const womenProducts = products.filter((product) =>
      product.categories.some(
        (category) => category.name.toLowerCase() === "female"
      )
    );
    if (womenProducts.length === 0) {
      resultsContainer.innerHTML = displayError(
        "No products found. Please try again later."
      );
      return;
    }

    womenProducts.forEach((product) => {
      const imageUrl = product.images[0]?.src || "placeholder.jpg"; 
      const imageAlt = product.images[0]?.alt || product.name;
      const productId = product.id;

      const productItem = document.createElement("li");
      productItem.className = "product-item";

      productItem.innerHTML = `
      <div class="product-card">
        <a href="product.html?id=${productId}">
          <img src="${imageUrl}" alt="${imageAlt}" class="product-image" />
          <hr class="separator-line" />
          <h2 class="product-name">${product.name}</h2>
          <p class="product-price">$${parseFloat(product.price).toFixed(2)}</p>
        </a>
      </div>
          `;

      productContainer.appendChild(productItem);
    });
  }

  fetchProducts();
});
