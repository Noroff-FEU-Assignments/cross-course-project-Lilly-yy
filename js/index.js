document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.querySelector(".product-column ul");
  const loadingIndicator = document.querySelector(".loading");
  const resultsContainer = document.querySelector(".results");
  const apiUrl = "https://v2.api.noroff.dev/rainy-days";
  const apiKey = "d3cfcc19-ffe8-49d3-8434-b118db1535af";

  async function fetchProducts() {
    try {
      // Vis loading indicator
      loadingIndicator.style.display = "block";

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Network response not ok");
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

  function displayProducts(data) {
    const products = data.data;
    if (!Array.isArray(products)) {
      resultsContainer.innerHTML = displayError(
        "Unexpected data format received. Please try again later."
      );
      return;
    }

    // Filtrere på favorittjakker
    const favProducts = products.filter((product) => product.favorite === true);

    if (favProducts.length === 0) {
      resultsContainer.innerHTML = displayError(
        "No popular products found. Please try again later."
      );
      return;
    }

    productContainer.innerHTML = "";
    favProducts.forEach((product) => {
      const imageUrl = product.image.url;
      const imageAlt = product.image.alt || product.title; // Use product title if alt is empty
      const productId = product.id;

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
      productName.textContent = product.title;

      // Create product price
      const productPrice = document.createElement("p");
      productPrice.className = "product-price";
      productPrice.textContent = `$${product.price.toFixed(2)}`;

      // Append all elements to product card
      productCard.appendChild(productLink);
      productCard.appendChild(separatorLine);
      productCard.appendChild(productName);
      productCard.appendChild(productPrice);

      // Append product card to product item
      productItem.appendChild(productCard);

      // Append product item to product container
      productContainer.appendChild(productItem);
    });
  }

  fetchProducts();
});
