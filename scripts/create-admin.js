// scripts/create-admin.js
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  try {
    // Database connection
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "Samphistik@7", // <-- GANTI INI!
      database: "bass_training",
    });

    console.log("✅ Connected to database");

    // Password to hash
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("\n📝 Password Info:");
    console.log("Plain password:", password);
    console.log("Hashed password:", hashedPassword);
    console.log("Hash length:", hashedPassword.length);

    // Delete existing admin if exists
    await connection.query(
      "DELETE FROM users WHERE email = 'admin@basstrainingacademy.com'"
    );
    console.log("\n🗑️  Deleted old admin user (if exists)");

    // Insert new admin user
    const [result] = await connection.query(
      `INSERT INTO users (name, email, password, role, phone, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        "Admin BASS",
        "admin@basstrainingacademy.com",
        hashedPassword,
        "admin",
        "081234567890",
        "active",
      ]
    );

    console.log("✅ New admin user created!");
    console.log("Insert ID:", result.insertId);

    // Verify the user
    const [users] = await connection.query(
      "SELECT id, name, email, role, status, LEFT(password, 20) as password_preview FROM users WHERE email = 'admin@basstrainingacademy.com'"
    );

    console.log("\n👤 User created:");
    console.log(users[0]);

    // Test password comparison
    const [fullUser] = await connection.query(
      "SELECT password FROM users WHERE email = 'admin@basstrainingacademy.com'"
    );

    const isMatch = await bcrypt.compare(password, fullUser[0].password);
    console.log(
      "\n🔐 Password verification:",
      isMatch ? "✅ MATCH" : "❌ NO MATCH"
    );

    await connection.end();
    console.log("\n✅ Done! You can now login with:");
    console.log("Email: admin@basstrainingacademy.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createAdmin();
