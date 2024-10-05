document.addEventListener("DOMContentLoaded", () => {
  const loadingIndicator = document.querySelector(".loading");
  const resultsContainer = document.querySelector(".results");
  const apiUrl = "https://v2.api.noroff.dev/rainy-days";
  const apiKey = "d3cfcc19-ffe8-49d3-8434-b118db1535af";
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId || !loadingIndicator) {
    return;
  }

  async function fetchProduct() {
    try {
      loadingIndicator.style.display = "block";
      if (!productId) {
        resultsContainer.innerHTML = displayError(
          "No product ID found in the URL. Please try again."
        );
        return;
      }
      const response = await fetch(`${apiUrl}/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const { data: product } = await response.json();

      if (!product) {
        throw new Error("Product not found");
      }
      displayProduct(product);
    } catch (error) {
      console.error("Error while fetching product:", error);
      resultsContainer.innerHTML = displayError(
        "An error occurred while fetching the product. Please try again later."
      );
    } finally {
      loadingIndicator.style.display = "none";
    }
  }

  function displayProduct(product) {
    if (!product) {
      throw new Error("Product data is not available");
    }

    document.title = product.title;
    const jacketImage = document.querySelector(".jacket-image");
    jacketImage.src = product.image.url;
    jacketImage.alt = product.image.alt || product.title;

    document.querySelector(".jacket-info h3").innerText = product.gender;
    document.querySelector(".jacket-info h2").innerText = product.title;
    document.querySelector(".jacket-info p:nth-of-type(1)").innerText =
      product.description;
    document.querySelector(
      ".jacket-info p:nth-of-type(2)"
    ).innerText = `$${product.price.toFixed(2)}`;

    const sizeListElement = document.querySelector(".submenu");
    if (sizeListElement) {
      const sizeList = product.sizes
        .map((size) => `<li><a href="#" data-size="${size}">${size}</a></li>`)
        .join("");
      sizeListElement.innerHTML = sizeList;
    }

    document.querySelectorAll(".submenu a").forEach((sizeLink) => {
      sizeLink.addEventListener("click", (event) => {
        event.preventDefault();
        const selectedSize = event.target.getAttribute("data-size");
        const dropdownToggle = document.querySelector(
          ".dropdown-menu > ul > li > a"
        );
        if (dropdownToggle) {
          dropdownToggle.innerText = selectedSize;
        }
        const dropdownMenu = document.querySelector(".submenu");
        if (dropdownMenu) {
          dropdownMenu.classList.remove("open");
        }
      });
    });

    const dropdownToggle = document.querySelector(
      ".dropdown-menu > ul > li > a"
    );
    if (dropdownToggle) {
      dropdownToggle.addEventListener("click", (event) => {
        event.preventDefault();
        const dropdownMenu = document.querySelector(".submenu");
        if (dropdownMenu) {
          dropdownMenu.classList.toggle("open");
        }
      });
    }

    const addToCartBtn = document.querySelector(".add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", function (event) {
        event.preventDefault();

        const selectedSize = document.querySelector(
          ".dropdown-menu > ul > li > a"
        ).innerText;
        if (!selectedSize || selectedSize === "Choose size") {
          showCustomPopup("Please select a size.");
          return;
        }

        const productToAdd = {
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image.url,
          size: selectedSize,
          quantity: 1,
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProductIndex = cart.findIndex(
          (item) => item.id === productToAdd.id && item.size === selectedSize
        );
        if (existingProductIndex !== -1) {
          cart[existingProductIndex].quantity += 1;
        } else {
          cart.push(productToAdd);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        showCustomPopup(`${productToAdd.name} has been added to your cart!`);
      });
    }

    function showCustomPopup(message) {
      const popup = document.getElementById("custom-popup");
      popup.innerText = message;
      popup.classList.remove("hidden");
      popup.classList.add("show");
  
      setTimeout(() => {
          popup.classList.remove("show");
          popup.classList.add("hidden");
      }, 3000); // Skjuler popup-en etter 3 sekunder
  }

    const addToFavoritesButton = document.getElementById("add-to-favorites");
    if (addToFavoritesButton) {
      addToFavoritesButton.addEventListener("click", function (event) {
        event.preventDefault();

        const productToAdd = {
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image.url,
        };

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const existingProduct = favorites.find(
          (item) => item.id === productToAdd.id
        );
        if (existingProduct) {
          showCustomPopup("Product is already in your favorites!");
        } else {
          favorites.push(productToAdd);
          localStorage.setItem("favorites", JSON.stringify(favorites));
          showCustomPopup(`${productToAdd.name} has been added to your favorites!`);
        }
      });
    }
  }

  fetchProduct();
});


