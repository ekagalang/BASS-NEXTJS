// scripts/create-admin.js
// Migrated to use Prisma ORM
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log("✅ Connected to database via Prisma");

    // Password to hash
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("\n📝 Password Info:");
    console.log("Plain password:", password);
    console.log("Hashed password:", hashedPassword);
    console.log("Hash length:", hashedPassword.length);

    // Delete existing admin if exists
    const deleted = await prisma.user.deleteMany({
      where: { email: "admin@basstrainingacademy.com" },
    });
    console.log("\n🗑️  Deleted old admin user (if exists):", deleted.count);

    // Create new admin user
    const admin = await prisma.user.create({
      data: {
        name: "Admin BASS",
        email: "admin@basstrainingacademy.com",
        password: hashedPassword,
        role: "admin",
        phone: "081234567890",
        status: "active",
      },
    });

    console.log("✅ New admin user created!");
    console.log("User ID:", admin.id);

    // Verify the user
    const createdUser = await prisma.user.findUnique({
      where: { email: "admin@basstrainingacademy.com" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        password: true,
      },
    });

    console.log("\n👤 User created:");
    console.log({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      status: createdUser.status,
      password_preview: createdUser.password.substring(0, 20) + "...",
    });

    // Test password comparison
    const isMatch = await bcrypt.compare(password, createdUser.password);
    console.log(
      "\n🔐 Password verification:",
      isMatch ? "✅ MATCH" : "❌ NO MATCH"
    );

    await prisma.$disconnect();
    console.log("\n✅ Done! You can now login with:");
    console.log("Email: admin@basstrainingacademy.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("❌ Error:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAdmin();
