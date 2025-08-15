const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// In-memory data
let users = [];
let transactions = [];

// Routes
app.get("/", (req, res) => res.redirect("/login.html"));

app.post("/register", upload.fields([{ name: "profilePhoto" }, { name: "idPhoto" }]), (req, res) => {
  const { fullName, phone, password, confirmPassword } = req.body;
  const profilePhoto = req.files["profilePhoto"] ? req.files["profilePhoto"][0].filename : "";
  const idPhoto = req.files["idPhoto"] ? req.files["idPhoto"][0].filename : "";

  if (!fullName || !phone || !password || !confirmPassword || !profilePhoto || !idPhoto) {
    return res.json({ success: false, message: "All fields are required" });
  }
  if (password !== confirmPassword) {
    return res.json({ success: false, message: "Passwords do not match" });
  }
  if (users.find(u => u.phone === phone)) return res.json({ success: false, message: "User already exists" });

  users.push({ fullName, phone, password, profilePhoto, idPhoto });
  res.json({ success: true, message: "Registration successful!" });
});

app.post("/login", (req, res) => {
  const { phone, password } = req.body;
  const user = users.find(u => u.phone === phone && u.password === password);
  if (user) res.json({ success: true, message: "Login successful!" });
  else res.json({ success: false, message: "Invalid credentials" });
});

app.get("/getUser", (req, res) => {
  const { phone } = req.query;
  const user = users.find(u => u.phone === phone);
  if (user) res.json({ success: true, fullName: user.fullName, phone: user.phone, profilePhoto: user.profilePhoto });
  else res.json({ success: false, message: "User not found" });
});

app.post("/deposit", upload.single("depositProof"), (req, res) => {
  const { bank, cellmoniNumber, amount } = req.body;
  const proof = req.file ? req.file.filename : "";
  if (!bank || !cellmoniNumber || !amount || !proof) return res.json({ success: false, message: "All fields required" });
  transactions.push({ type: "Deposit", bank, cellmoniNumber, amount, proof, status: "Pending", date: new Date() });
  res.json({ success: true, message: `Deposit received: K${amount}` });
});

app.post("/withdraw", upload.single("withdrawProof"), (req, res) => {
  const { bank, accountNumber, amount } = req.body;
  const proof = req.file ? req.file.filename : "";
  if (!bank || !accountNumber || !amount || !proof) return res.json({ success: false, message: "All fields required" });
  transactions.push({ type: "Withdraw", bank, accountNumber, amount, proof, status: "Pending", date: new Date() });
  res.json({ success: true, message: `Withdrawal requested: K${amount}` });
});

app.get("/history", (req, res) => res.json(transactions));

// 404
app.use((req, res) => res.status(404).send("Page not found"));

app.listen(PORT, () => console.log(`✅ Jayglo CellMoni Agent running on port ${PORT}`));
