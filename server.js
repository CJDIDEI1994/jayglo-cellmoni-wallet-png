const express = require("express");
const path = require("path");
const multer = require("multer");
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// File upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// In-memory storage
let users = [];
let transactions = [];

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.post("/register", (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.json({ message: "All fields required" });
  if(users.find(u=>u.phone===phone)) return res.json({message:"Phone already registered"});
  users.push({ phone, password });
  res.json({ message: "Registration successful!" });
});

app.post("/login", (req, res) => {
  const { phone, password } = req.body;
  const user = users.find(u => u.phone === phone && u.password === password);
  if (user) res.json({ message: "Login successful!" });
  else res.json({ message: "Invalid credentials" });
});

app.post("/deposit", upload.single("proof"), (req, res) => {
  const { amount } = req.body;
  const proof = req.file ? req.file.filename : "";
  transactions.push({ type: "Deposit", amount, proof, date: new Date() });
  res.json({ message: `Deposit K${amount} submitted!` });
});

app.post("/withdraw", upload.single("proof"), (req, res) => {
  const { amount } = req.body;
  const proof = req.file ? req.file.filename : "";
  transactions.push({ type: "Withdraw", amount, proof, date: new Date() });
  res.json({ message: `Withdrawal K${amount} submitted!` });
});

app.get("/history", (req, res) => res.json(transactions));

app.listen(PORT, () => console.log(`✅ Jayglo App running on port ${PORT}`));
