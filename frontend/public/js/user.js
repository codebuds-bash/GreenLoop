// user.js
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
  
    if (!id) {
      alert("No product ID provided!");
      return;
    }
  
    try {
      // Replace with your API endpoint
      const response = await fetch(`https://your-backend-url/api/products/${id}`);
      const product = await response.json();
  
      // Populate product details
      document.getElementById("productName").textContent = `Product Name: ${product.name}`;
      document.getElementById("material").textContent = `Material: ${product.material}`;
      document.getElementById("origin").textContent = `Origin: ${product.origin}`;
      document.getElementById("timesRecycled").textContent = `Times Recycled: ${product.timesRecycled}`;
      document.getElementById("status").textContent = `Recycling Status: ${product.status}`;
      document.getElementById("impact").textContent = `Environmental Impact: ${product.impact}`;
  
      // Populate recycling journey timeline
      const timeline = document.getElementById("timeline");
      product.timeline.forEach(event => {
        const li = document.createElement("li");
        li.textContent = `${event.date}: ${event.description}`;
        timeline.appendChild(li);
      });
  
      // Generate QR Code
      const qrCanvas = document.getElementById("qrCodeCanvas");
      QRCode.toCanvas(qrCanvas, `${window.location.origin}/user.html?id=${id}`, (error) => {
        if (error) console.error(error);
      });
    } catch (error) {
      console.error("Error fetching product details:", error);
      alert("Unable to fetch product details.");
    }
  });
  