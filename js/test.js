document.addEventListener("DOMContentLoaded", () => {
  const loadingIndicator = document.querySelector(".loading");
  const resultsContainer = document.querySelector(".results");
  const apiUrl = "https://v2.api.noroff.dev/rainy-days";
  const apiKey = "d3cfcc19-ffe8-49d3-8434-b118db1535af";
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  const productContainer = document.querySelector(".product-container");

  products.array.forEach((product) => {
    productContainer.innerHTML += `div class="product">
    <h4>${product.name}</h4>
    <i class="fas fa-heart"></i>
    </div>`;
  });

  fetchProduct();
});
