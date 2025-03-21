const apiBaseUrl = "https://r5h13rdfs4.execute-api.us-east-1.amazonaws.com/dev";


// Function to save user
async function saveOrder() {
    const customerNameElement = document.getElementById("customerName")
    const productIdElement = document.getElementById("productId");
    const quantityElement = document.getElementById("quantity");

    if (!productIdElement || !quantityElement || !customerNameElement) {
        alert("Product ID or Quantity field is missing in the HTML.");
        return;
    }
    const customerName = customerNameElement.value;
    const productId = productIdElement.value;
    const quantity = quantityElement.value;

    if (!customerName || !productId || !quantity) {
        alert("Please fill all fields!");
        return;
    }

    const Orders = { customerName, productId, quantity };

    try {
        const response = await fetch(`${apiBaseUrl}/saveOrder`, {
            method: "POST",
            headers: { "content-Type": "application/json" },
            body: JSON.stringify(Orders)
        });

        const result = await response.json();
        alert(result.message || "Order placed successfully!");
    } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order.");
    }
}

// Function to get users
async function getOrders() {
    try {
        const response = await fetch(`${apiBaseUrl}/getOrders`, {
            method: "GET"
        });

        const data = await response.json();
        console.log("API Response:", data);  // ✅ Debugging output

        // ✅ Ensure data is an array
        const orders = Array.isArray(data) ? data : data.items || [];

        const ordersList = document.getElementById("orderList");
        ordersList.innerHTML = "<h3>Orders List</h3>";

        if (!Array.isArray(orders) || orders.length === 0) {
            ordersList.innerHTML += "<p>No orders found</p>";
            return;
        }

        orders.forEach(order => {
            ordersList.innerHTML += `<p><strong>Order ID:</strong> ${order.orderId} | 
                                     <strong>Customer:</strong> ${order.customerName} | 
                                     <strong>Product:</strong> ${order.productId} | 
                                     <strong>Quantity:</strong> ${order.quantity}</p>`;
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to retrieve orders.");
    }
}


