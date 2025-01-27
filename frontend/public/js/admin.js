// admin.js
document.getElementById("adminForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const product = {
      name: document.getElementById("name").value,
      material: document.getElementById("material").value,
      origin: document.getElementById("origin").value,
      timesRecycled: parseInt(document.getElementById("timesRecycled").value),
      status: document.getElementById("status").value,
      impact: document.getElementById("impact").value,
      timeline: JSON.parse(document.getElementById("timeline").value),
    };
  
    try {
      // Replace with your API endpoint
      const response = await fetch("https://your-backend-url/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
  
      if (response.ok) {
        alert("Product details added successfully!");
        document.getElementById("adminForm").reset();
      } else {
        throw new Error("Failed to add product details.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Unable to add product details.");
    }
  });
  