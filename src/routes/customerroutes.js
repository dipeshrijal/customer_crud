const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/customers", authMiddleware, CustomerController.create);
// router.get("/customers", authMiddleware, CustomerController.read);
router.get("/customers", authMiddleware, CustomerController.searchCustomers);
router.get("/customers/:id", authMiddleware, CustomerController.readOne);
router.patch("/customers/:id", authMiddleware, CustomerController.update);
router.delete("/customers/:id", authMiddleware, CustomerController.delete);
router.get(
  "/customers/email/:email",
  authMiddleware,
  CustomerController.getCustomerByEmail
);

module.exports = router;
