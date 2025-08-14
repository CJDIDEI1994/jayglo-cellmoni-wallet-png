const express = require("express");
const path = require("path");
const multer = require("multer");
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// In-memory data
let users = [];
let transactions = [];
let testimonials = [
  { name: "Grains", message: "Quick and easy deposit!" },
  { name: "Salbung", message: "I love using CellMoni via Jayglo Agent!" },
  { name: "Shermila", message: "Fast withdrawals every time." },
  { name: "Kaylor", message: "Reliable and trustworthy." }
];

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "public", "dashboard.html")));
app.get("/deposit", (req, res) => res.sendFile(path.join(__dirname, "public", "deposit.html")));
app.get("/withdraw", (req, res) => res.sendFile(path.join(__dirname, "public", "withdraw.html")));
app.get("/history", (req, res) => res.sendFile(path.join(__dirname, "public", "history.html")));

// Registration
app.post("/register", (req, res) => {
  const { username, phone, password } = req.body;
  if (!username || !phone || !password) return res.json({ message: "All fields required" });
  users.push({ username, phone, password });
  res.json({ message: "Registration successful!", redirect: "/login" });
});

// Login
app.post("/login", (req, res) => {
  const { phone, password } = req.body;
  const user = users.find(u => u.phone === phone && u.password === password);
  if (user) res.json({ message: "Login successful!", redirect: "/dashboard" });
  else res.json({ message: "Invalid credentials" });
});

// Deposit
app.post("/deposit", upload.single("depositProof"), (req, res) => {
  const { bank, cellmoniNumber, amount } = req.body;
  const proof = req.file ? req.file.filename : "";
  transactions.push({ type: "Deposit", bank, cellmoniNumber, amount, proof, date: new Date() });
  res.json({ message: `Deposit submitted! Amount: K${amount}` });
});

// Withdraw
app.post("/withdraw", upload.single("withdrawProof"), (req, res) => {
  const { bank, accountNumber, amount } = req.body;
  const proof = req.file ? req.file.filename : "";
  transactions.push({ type: "Withdraw", bank, accountNumber, amount, proof, date: new Date(), withdrawalID: 19070 });
  res.json({ message: `Withdrawal submitted! Amount: K${amount}` });
});

// Transaction history
app.get("/history-data", (req, res) => res.json(transactions));

// Live user count
app.get("/live-users", (req, res) => res.json({ count: users.length }));

// Live testimonials
app.get("/testimonials", (req, res) => res.json(testimonials));

// 404
app.use((req, res) => res.status(404).send("Page not found"));

// Start server
app.listen(PORT, () => console.log(`✅ Jayglo CellMoni Agent running on port ${PORT}`));
