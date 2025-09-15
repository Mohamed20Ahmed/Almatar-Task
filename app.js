// Third-Party modules
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// Import
const dbConnection = require("./config/database");
const mountRoutes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

// Database connection
dbConnection();

// Express app
const app = express();

// Enable other domains to acccess your application
app.use(cors({ origin: true }));

// compress all responses
app.use(compression());

// Middlewares
app.use(express.json({ limit: "20kb" }));

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:
    "Too many requests created from this IP, please try again after an hour",
});

// Apply the rate limiting middleware to all requests
app.use("/api", limiter);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
mountRoutes(app);

// Global error handler middleware for express
app.use(errorMiddleware);

// Start server
const port = process.env.PORT || 8989;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle rejected requests outside express server
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection Errors: ${err}`);
  server.close(() => {
    console.log("Server closed");
    process.exit(1);
  });
});
