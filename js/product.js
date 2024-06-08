document.addEventListener("DOMContentLoaded", () => {
    const loadingIndicator = document.querySelector(".loading");
    const resultsContainer = document.querySelector(".results")
    const apiUrl = "https://v2.api.noroff.dev/rainy-days";
    const apiKey = "d3cfcc19-ffe8-49d3-8434-b118db1535af"; 
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGlsbHl5eXkiLCJlbWFpbCI6ImFubmhhdTU0Mzg4QHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzE3NTI3NDI0fQ.WlIOorj7M-r4S0_d7Df5LSqxNrwfRfE193pZH63975g"; 
  
    // Hent produkt-id fra URL-en
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
  
    if (!productId) {
      resultsContainer.innerHTML = displayError("No product ID found in the URL. Please try again.");
      return;
    }
  
    async function fetchProduct() {
      try {
              // Vis loading indicator
      loadingIndicator.style.display = "block";

     
        const response = await fetch(`${apiUrl}/${productId}`, {
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
  
        const { data: product } = await response.json();
        displayProduct(product);
      } catch (error) {
        resultsContainer.innerHTML = displayError("An error occurred while fetching the product. Please try again later.");
        } finally {
        // Skjul loading indicator
        loadingIndicator.style.display = "none";
      }
    }
  
    function displayProduct(product) {
    // Oppdater bilde
    const jacketImage = document.querySelector(".jacket-image");
    jacketImage.src = product.image.url;
    jacketImage.alt = product.image.alt || product.title;
  

      // Oppdater tittel og informasjon
      document.querySelector(".jacket-info h3").innerText = product.gender;
      document.querySelector(".jacket-info h2").innerText = product.title;
      document.querySelector(".jacket-info p:nth-of-type(1)").innerText = product.description;
      document.querySelector(".jacket-info p:nth-of-type(2)").innerText = `$${product.price.toFixed(2)}`;
        
  
    // Oppdater tilgjengelige størrelser
    const sizeListElement = document.querySelector(".submenu");
    if (sizeListElement) {
    const sizeList = product.sizes.map(size => `<li><a href="#" data-size="${size}">${size}</a></li>`).join("");
    sizeListElement.innerHTML = sizeList;
    }

    // Legg til klikkhendelse for størrelser
    document.querySelectorAll(".submenu a").forEach(sizeLink => {
        sizeLink.addEventListener("click", (event) => {
          event.preventDefault();
          const selectedSize = event.target.getAttribute("data-size");
          
          // Oppdater tekstinnholdet i knappen
          const dropdownToggle = document.querySelector(".dropdown-menu > ul > li > a");
          if (dropdownToggle) {
            dropdownToggle.innerText = selectedSize;
          }
  
          // Lukk størrelsesmenyen
          const dropdownMenu = document.querySelector(".submenu");
          if (dropdownMenu) {
            dropdownMenu.classList.remove("open");
          }
        });
      });
  
      // Legg til klikkhendelse for å åpne/lukke størrelsesmenyen
      const dropdownToggle = document.querySelector(".dropdown-menu > ul > li > a");
      if (dropdownToggle) {
        dropdownToggle.addEventListener("click", (event) => {
          event.preventDefault();
          const dropdownMenu = document.querySelector(".submenu");
          if (dropdownMenu) {
            dropdownMenu.classList.toggle("open");
          }
        });
      }
    }
  
    fetchProduct();
  });