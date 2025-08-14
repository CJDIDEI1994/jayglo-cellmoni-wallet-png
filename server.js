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
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/register", (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.json({ success: false, message: "All fields required" });
  const exists = users.find(u => u.phone === phone);
  if (exists) return res.json({ success: false, message: "User already exists" });
  users.push({ phone, password });
  res.json({ success: true, message: "Registration successful!" });
});

app.post("/login", (req, res) => {
  const { phone, password } = req.body;
  const user = users.find(u => u.phone === phone && u.password === password);
  if (user) res.json({ success: true, message: "Login successful!" });
  else res.json({ success: false, message: "Invalid credentials" });
});

app.post("/deposit", upload.single("depositProof"), (req, res) => {
  const { bank, cellmoniNumber, amount } = req.body;
  const proof = req.file ? req.file.filename : "";
  transactions.push({ type: "Deposit", bank, cellmoniNumber, amount, proof, date: new Date() });
  res.json({ message: `Deposit submitted! Amount: K${amount}` });
});

app.post("/withdraw", upload.single("withdrawProof"), (req, res) => {
  const { bank, accountNumber, amount } = req.body;
  const proof = req.file ? req.file.filename : "";
  transactions.push({ type: "Withdraw", bank, accountNumber, amount, proof, date: new Date(), withdrawalID: 19070 });
  res.json({ message: `Withdrawal submitted! Amount: K${amount}` });
});

app.get("/history", (req, res) => {
  res.json(transactions);
});

app.get("/live-users", (req, res) => {
  res.json({ count: users.length });
});

app.get("/testimonials", (req, res) => {
  res.json(testimonials);
});

app.use((req, res) => res.status(404).send("Page not found"));

app.listen(PORT, () => console.log(`✅ Jayglo CellMoni Agent running on port ${PORT}`));
