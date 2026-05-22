const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let cart = [];
let orders = [];

const menu = [
  { id: 1, name: "Dumplings", price: 50, image: "Dumplings.jpg" },
  { id: 2, name: "Brownies", price: 80, image: "Brownies.jpg" },
  { id: 3, name: "Cookies", price: 40, image: "Cookies.jpg" },
  { id: 4, name: "Fries", price: 90, image: "Fries.jpg" },
  { id: 5, name: "Chicken Fries", price: 70, image: "Chicken Fries.jpg" },
  { id: 6, name: "Whopper", price: 99, image: "Whopper.jpg" },
];

app.get('/apimenu/', (req, res) => res.json(menu));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    res.json({ success: true, username });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.get('/api/cart', (req, res) => res.json(cart));

app.post('/api/cart', (req, res) => {
  cart.push(req.body);
  res.json({ success: true, cart });
});

app.post('/api/order', (req, res) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const order = {
    id: 'BK' + Date.now().toString().slice(-6),
    items: [...cart],
    subtotal: subtotal,
    delivery: 2.99,
    total: subtotal + 2.99,
    status: "Confirmed",
    driver: "ALRICH JAY S. TAPOC",
    vehicle: "Honda Civic (Yellow)",
    phone: "0975-881-4018",
    estimatedTime: "25 minutes"
  };
  orders.push(order);
  cart = [];
  res.json({ success: true, order });
});

app.get('/api/order/latest', (req, res) => {
  res.json(orders.length > 0 ? orders[orders.length - 1] : { error: "No order found" });
});

app.listen(PORT, () => {
  console.log(`🍔 Burger King Server running at http://localhost:${PORT}`);
});