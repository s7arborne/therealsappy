import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Usage: npx tsx scripts/hash-password.ts <password>");
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  // Next.js expands $ in .env — escape each $ so the hash is not stripped
  const escaped = hash.replace(/\$/g, "\\$");
  console.log(`\nADMIN_PASSWORD_HASH="${escaped}"\n`);
  console.log("Paste this into your .env file.");
});
