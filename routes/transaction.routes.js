const router = require("express").Router();

const {
  getUserTransactionsValidator,
  createTransferValidator,
  confirmTransferValidator,
} = require("../validators/trancation.validator");
const {
  getUserTransactions,
  createTransfer,
  confirmTransfer,
} = require("../controllers/transaction.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect);

router.get("/", getUserTransactionsValidator, getUserTransactions);

router.post("/", createTransferValidator, createTransfer);

router.patch("/:transactionId", confirmTransferValidator, confirmTransfer);

module.exports = router;
