require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/customerRoutes");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
require("./config/db"); // Ensure database connection is established

const app = express();

app.use(bodyParser.json());
app.use("/api", customerRoutes);
app.use("/api/auth", authRoutes);
app.use(errorMiddleware);

app.listen(process.env.PORT || "3000", () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
