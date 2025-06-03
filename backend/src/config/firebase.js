const admin = require("firebase-admin");

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error(" Failed to initialize Firebase:", error.message);
  process.exit(1);
}

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server running in ${process.env.NODE_ENV} (production, deployment) mode on port ${PORT}`);
// });

module.exports = admin;
