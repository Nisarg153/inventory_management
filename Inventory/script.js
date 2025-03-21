const apiBaseUrl = "https://r5h13rdfs4.execute-api.us-east-1.amazonaws.com/dev";


// Function to save user
async function saveProduct() {
    const productIdElement = document.getElementById("productId");
    const quantityElement = document.getElementById("quantity");

    if (!productIdElement || !quantityElement) {
        alert("Product ID or Quantity field is missing in the HTML.");
        return;
    }

    const productId = productIdElement.value;
    const quantity = quantityElement.value;

    if (!productId || !quantity) {
        alert("Please fill all fields!");
        return;
    }

    const Inventory = { productId, quantity };

    try {
        const response = await fetch(`${apiBaseUrl}/saveProduct`, {
            method: "POST",
            headers: { "content-Type": "application/json" },
            body: JSON.stringify(Inventory)
        });

        const result = await response.json();
        alert(result.message || "Product saved successfully!");
    } catch (error) {
        console.error("Error saving product:", error);
        alert("Failed to save product.");
    }
}

// Function to get users
async function getProducts() {
    try {
        const response = await fetch(`${apiBaseUrl}/getProducts`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();
        console.log("API Response:", products);  // Debugging

        const productList = document.getElementById("productList");
        productList.innerHTML = "<h3>Products List</h3>";

        if (!Array.isArray(products) || products.length === 0) {
            productList.innerHTML += "<p>No products found</p>";
            return;
        }

        products.forEach(product => {
            productList.innerHTML += `<p><strong>Product ID:</strong> ${product.productId}, 
                                      <strong>Quantity:</strong> ${product.quantity}</p>`;
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to retrieve products.");
    }
}

