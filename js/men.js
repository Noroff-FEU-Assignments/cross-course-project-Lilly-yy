document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.querySelector(".product-column ul");
    const loadingIndicator = document.querySelector(".loading");
    const resultsContainer = document.querySelector(".results")
    const apiUrl = "https://v2.api.noroff.dev/rainy-days";
    const apiKey = "d3cfcc19-ffe8-49d3-8434-b118db1535af"; 
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGlsbHl5eXkiLCJlbWFpbCI6ImFubmhhdTU0Mzg4QHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzE3NTI3NDI0fQ.WlIOorj7M-r4S0_d7Df5LSqxNrwfRfE193pZH63975g"; // Sett inn din tilgangstoken
  
    async function fetchProducts() {
        try {
                  // Vis loading indicator
      loadingIndicator.style.display = "block";

          const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
              "x-api-key": apiKey
            }
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
    
          const data = await response.json();
          displayProducts(data);
        } catch (error) {
          resultsContainer.innerHTML = displayError("An error occurred while fetching products. Please try again later.");
        } finally {
            // Skjul loading indicator
            loadingIndicator.style.display = "none";
        }
      }


      function displayProducts(data) {
    
        const products = data.data;
        if (!Array.isArray(products)) {
          resultsContainer.innerHTML = displayError("Unexpected data format received. Please try again later.");
          return;
        }
    
        productContainer.innerHTML = "";
        
        // Filtrere på herrejakker
        const menProducts = products.filter((product => product.gender.toLowerCase() === "male"));
        if (menProducts.length === 0) {
        resultsContainer.innerHTML = displayError("No products found. Please try again later.");
        return;
        }

        menProducts.forEach(product => {
          const imageUrl = product.image.url;
          const imageAlt = product.image.alt || product.title; // Use product title if alt is empty
          const productId = product.id;
            
          const productItem = document.createElement("li");
          productItem.className = "product-item";
    
          productItem.innerHTML = `
            <div class="product-card">
            <a href="product.html?id=${productId}">
            <img src="${imageUrl}" alt="${imageAlt}" class="product-image" />
            <hr class="separator-line" />
            <h2 class="product-name">${product.title}</h2>
            <p class="product-price">$${product.price.toFixed(2)}</p>
          </div>
          `;
    
          productContainer.appendChild(productItem);
        });
      }
    
      fetchProducts();
    });