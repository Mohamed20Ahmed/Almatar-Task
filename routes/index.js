const ApiError = require("../utils/apiError");
const { sendSuccessResponse } = require("../utils/responseHandler");

const userRoute = require("./user.routes");
const authRoute = require("./auth.routes");
const transactionRoute = require("./transaction.routes");

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/transactions", transactionRoute);

  app.get("/", (req, res) => {
    sendSuccessResponse(res, { message: "Hello form server side!" }, 200);
  });

  app.all(/.*/, (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
};

module.exports = mountRoutes;
