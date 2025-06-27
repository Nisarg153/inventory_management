# Serverless E-Commerce Order Processing System on AWS 
![Bootcamp5 drawio](https://github.com/user-attachments/assets/ec42a602-03e5-45b9-9d4e-85d049bf4a17)

## Inventory
1. Save Product
   Lambda Code:
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
