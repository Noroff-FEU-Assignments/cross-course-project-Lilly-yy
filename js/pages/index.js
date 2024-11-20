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
        method: "GET",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response not ok");
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Unexpected data format");
      }

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
    // Filtrere på populære jakker
    const popularProducts = products.filter(
      (product) =>
        Array.isArray(product.tags) &&
        product.tags.some((tag) => tag.name.toLowerCase() === "popular")
    );

    if (popularProducts.length === 0) {
      resultsContainer.innerHTML = displayError(
        "No popular products found. Please try again later."
      );
      return;
    }

    productContainer.innerHTML = "";
    popularProducts.forEach((product) => {
      const imageUrl = product.images[0]?.src || "placeholder.jpg";
      const imageAlt = product.images[0]?.alt || product.name;
      const productId = product.id;
      const productPrice = `$${parseFloat(product.price).toFixed(2)}`;

      // Create product item element
      const productItem = document.createElement("li");
      productItem.className = "product-item";

      // Create product card container
      const productCard = document.createElement("div");
      productCard.className = "product-card";

      // Create product link
      const productLink = document.createElement("a");
      productLink.href = `product.html?id=${productId}`;

      // Create product image
      const productImage = document.createElement("img");
      productImage.src = imageUrl;
      productImage.alt = imageAlt;
      productImage.className = "product-image";

      // Append image to link
      productLink.appendChild(productImage);

      // Create separator line
      const separatorLine = document.createElement("hr");
      separatorLine.className = "separator-line";

      // Create product name
      const productName = document.createElement("h2");
      productName.className = "product-name";
      productName.textContent = product.name;

      // Create product price
      const productPriceElement = document.createElement("p");
      productPriceElement.className = "product-price";
      productPriceElement.textContent = productPrice;

      // Append all elements to product card
      productCard.appendChild(productLink);
      productCard.appendChild(separatorLine);
      productCard.appendChild(productName);
      productCard.appendChild(productPriceElement);

      // Append product card to product item
      productItem.appendChild(productCard);

      // Append product item to product container
      productContainer.appendChild(productItem);
    });
  }

  fetchProducts();
});
