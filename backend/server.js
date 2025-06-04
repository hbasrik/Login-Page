const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const hpp = require("hpp");

dotenv.config();

app.use(helmet());

const configRoutes = require("./src/routes/configRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(configRoutes);
app.use(hpp());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
