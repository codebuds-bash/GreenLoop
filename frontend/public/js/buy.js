const orderId = "GL" + Math.floor(Math.random() * 1000000); // Order ID
const quantity = 1;
const total = product.price;

const mailRes = await fetch('https://greenloop-67y2.onrender.com/api/send-email', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: "Greenloop Customer", // Replace if actual user name is available
        email,
        orderId,
        product: product.name,
        quantity,
        total,
        imageUrl: product.imageUrl
    })
});
