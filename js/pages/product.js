import apiConfig from "../constants/api.js";
import { displayError } from "../utils/displayError.js";

document.addEventListener("DOMContentLoaded", () => {
  const loadingIndicator = document.querySelector(".loading");
  const resultsContainer = document.querySelector(".results");
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId || !loadingIndicator) {
    return;
  }

  const { apiUrl, apiKey, apiSecret } = apiConfig;

  async function fetchProduct() {
    try {
      loadingIndicator.style.display = "block";

      const credentials = btoa(`${apiKey}:${apiSecret}`);
      const response = await fetch(`${apiUrl}/${productId}`, {
        headers: {
          "Authorization": `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }

      const product = await response.json();
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

    // Update page title
    document.title = product.name;

    // Update product image
    const jacketImage = document.querySelector(".jacket-image");
    jacketImage.src = product.images[0]?.src || "placeholder.jpg";
    jacketImage.alt = product.images[0]?.alt || product.name;

    // Update product info
    document.querySelector(".jacket-info h3").innerText =
      product.categories[0]?.name || "Uncategorized";
    document.querySelector(".jacket-info h2").innerText = product.name;
    document.querySelector(".jacket-info p:nth-of-type(1)").innerHTML =
      product.description || "No description available.";
    document.querySelector(".jacket-info p:nth-of-type(2)").innerText = `$${product.price}`;

    // Handle size attributes if available
    const sizeListElement = document.querySelector(".submenu");
    if (sizeListElement) {
      const sizes = product.attributes.find(attr => attr.name.toLowerCase() === "size")?.options || [];
      const sizeList = sizes
        .map(size => `<li><a href="#" data-size="${size}">${size}</a></li>`)
        .join("");
      sizeListElement.innerHTML = sizeList;
    }

    setupSizeDropdown();
    setupAddToCart(product);
    setupAddToFavorites(product);
  }

  function setupSizeDropdown() {
    document.querySelectorAll(".submenu a").forEach(sizeLink => {
      sizeLink.addEventListener("click", event => {
        event.preventDefault();
        const selectedSize = event.target.getAttribute("data-size");
        const dropdownToggle = document.querySelector(".dropdown-menu > ul > li > a");
        if (dropdownToggle) {
          dropdownToggle.innerText = selectedSize;
        }
        const dropdownMenu = document.querySelector(".submenu");
        if (dropdownMenu) {
          dropdownMenu.classList.remove("open");
        }
      });
    });

    const dropdownToggle = document.querySelector(".dropdown-menu > ul > li > a");
    if (dropdownToggle) {
      dropdownToggle.addEventListener("click", event => {
        event.preventDefault();
        const dropdownMenu = document.querySelector(".submenu");
        if (dropdownMenu) {
          dropdownMenu.classList.toggle("open");
        }
      });
    }
  }

  function setupAddToCart(product) {
    const addToCartBtn = document.querySelector(".add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", function (event) {
        event.preventDefault();

        const selectedSize = document.querySelector(".dropdown-menu > ul > li > a").innerText;
        if (!selectedSize || selectedSize === "Choose size") {
          showCustomPopup("Please select a size.");
          return;
        }

        const productToAdd = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0]?.src || "",
          size: selectedSize,
          quantity: 1,
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProductIndex = cart.findIndex(
          item => item.id === productToAdd.id && item.size === selectedSize
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
  }

  function setupAddToFavorites(product) {
    const addToFavoritesButton = document.getElementById("add-to-favorites");
    if (addToFavoritesButton) {
      addToFavoritesButton.addEventListener("click", function (event) {
        event.preventDefault();

        const productToAdd = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0]?.src || "",
        };

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const existingProduct = favorites.find(item => item.id === productToAdd.id);
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

  function showCustomPopup(message) {
    const popup = document.getElementById("custom-popup");
    popup.innerText = message;
    popup.classList.remove("hidden");
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
      popup.classList.add("hidden");
    }, 3000);
  }

  fetchProduct();
});