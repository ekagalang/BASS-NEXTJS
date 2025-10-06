const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log("Password:", password);
  console.log("Hash:", hash);
  console.log("");
}

// Generate hash untuk semua password// scripts/hash-password.js
const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log("Password:", password);
  console.log("Hash:", hash);
  console.log("");
}

// Generate hash untuk semua password
hashPassword("admin123");
hashPassword("admin123");
