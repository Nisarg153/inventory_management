# Serverless E-Commerce Order Processing System on AWS 
![Bootcamp5 drawio](https://github.com/user-attachments/assets/ec42a602-03e5-45b9-9d4e-85d049bf4a17)

## Inventory
here are the lambda function for Inventory.
1. Save Product
<pre>
    import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
    import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
    const client = new DynamoDBClient({ region: "us-east-1" });
    const dynamoDB = DynamoDBDocumentClient.from(client);
    export const handler = async (event) => {
      try {
        const { productId, quantity } = JSON.parse(event.body);
    
        const params = new PutCommand({
          TableName: "Inventory",
          Item: {
            productId: productId,
            quantity: quantity
          }
        });
        await dynamoDB.send(params);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Product data saved successfully!" })
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Failed to save product data", details: error.message })
        };
      }
    };
</pre>   
   
    
2. Get Products
<pre>
   import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const dynamoDB = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        const params = new ScanCommand({
            TableName: "Inventory"  // Fetch all products
        });

        const result = await dynamoDB.send(params);
        console.log("DynamoDB Scan Result:", result.Items);  // Debugging in CloudWatch

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items || [])  // Return array
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to retrieve products", details: error.message })
        };
    }
};

</pre>

## Order Processing
Here are the lambda functions for order processing.
1. Save Order (Order Processing Function)
<pre>
      import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
      import { PutCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
      
      const client = new DynamoDBClient({ region: "us-east-1" });
      const dynamoDB = DynamoDBDocumentClient.from(client);
      
      export const handler = async (event) => {
        try {
          console.log("Incoming event:", JSON.stringify(event, null, 2)); // ✅ Log full event for debugging
      
          let data;
          
          // ✅ Support both direct Lambda test events & API Gateway
          if (event.body) {
            // API Gateway request: body is a string (needs parsing)
            data = JSON.parse(event.body);
          } else {
            // Direct Lambda execution: event is already a JSON object
            data = event;
          }
      
          const { customerName, productId, quantity } = data;
      
          // ✅ Validate required fields
          if (!customerName || !productId || !quantity) {
            return {
              statusCode: 400,
              body: JSON.stringify({ message: "Missing required fields: customerName, productId, or quantity" })
            };
          }
          const getquantityCommand = new GetCommand({
            TableName: "Inventory",
            Key: {productId }
          });
          const currentQuantity = await dynamoDB.send(getquantityCommand);
      
          if (!currentQuantity.Item) {
            return {
              statusCode: 404,
              body: JSON.stringify({ message: `Product ${productId} not found in inventory` })
            };
          }
      
          const availableQuantity = Number(currentQuantity.Item.quantity);
      
          if(availableQuantity < Number(quantity)){
            return {
              statusCode: 400,
              body: JSON.stringify({ message: `Insufficient quantity for product ${productId}` })
            };
          }
          const updatequantityCommand = new PutCommand({
            TableName: "Inventory",
            Item: {
              productId,
              quantity: availableQuantity - Number(quantity)
            }
          });
          await dynamoDB.send(updatequantityCommand);
          console.log("Inventory updated successfully");
          // ✅ Use PutCommand properly
          const params = new PutCommand({
            TableName: "Orders",
            Item: {
              "orderId": `ORD-${Date.now()}`,
              "customerName": customerName,
              "productId": productId,
              "quantity": Number(quantity)  // Ensure quantity is stored as a number
            }
          });
      
          await dynamoDB.send(params);
          console.log("Order placed successfully:", params.Item); // ✅ Log successful order placement
      
          return {
            statusCode: 200,
            body: JSON.stringify({ message: "Order placed successfully" })
          };
        } catch (error) {
          console.error("Error placing order:", error); // ✅ Log error for debugging
          return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error placing order", error: error.message })
          };
        }
      };

</pre>
2. Get Orders
