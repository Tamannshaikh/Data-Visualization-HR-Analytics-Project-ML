const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

console.log("Testing connection to:", uri.replace(/:([^@]+)@/, ":****@")); // Mask password

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Connection failed!");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    if (err.reason) {
        console.error("Error Reason:", JSON.stringify(err.reason, null, 2));
    }
    process.exit(1);
  });
