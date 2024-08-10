const { customerSchema } = require("../validators/customerValidator");
const logger = require("../config/logger");
const CustomerService = require("../services/customerService");

class CustomerController {
  static async create(req, res, next) {
    try {
      const { error, value } = customerSchema.validate(req.body);
      if (error) {
        return res.status(400).send(error.details);
      }
      const customer = await CustomerService.createCustomer(value);
      logger.info("Customer created successfully:", customer);
      res.status(201).send(customer);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).send({ message: "Email already exists" });
      }
      next(err);
    }
  }

  static async read(req, res) {
    try {
      const customers = await CustomerService.getAllCustomers();
      res.status(200).send(customers);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  static async readOne(req, res, next) {
    try {
      const customer = await CustomerService.getCustomerById(req.params.id);

      logger.info("Customer Found!", customer);
      res.status(200).send(customer);
    } catch (err) {
      if (err.message === "Customer not found") {
        logger.warn("Customer not found:", req.params.id);
        return res.status(404).json({ message: "Customer not found" });
      }
      logger.error("Error retrieving customer:", err);
      next(err); // Pass to global error handler
    }
  }

  static async searchCustomers(req, res, next) {
    try {
      const customers = await CustomerService.searchCustomersByQuery(req.query);
      logger.info("Customers found by query:", req.query);
      res.status(200).json(customers);
    } catch (err) {
      logger.error("Error searching customers by query:", err);
      next(err);
    }
  }

  static async getCustomerByEmail(req, res, next) {
    const { email } = req.params;
    try {
      const customer = await CustomerService.getCustomerByEmail(email);
      logger.info("Customer found:", customer);
      res.status(200).json(customer);
    } catch (err) {
      if (err.message === "Customer not found") {
        logger.warn("Customer not found:", { email });
        return res.status(404).json({ message: "Customer not found" });
      }
      logger.error("Error retrieving customer:", err);
      next(err);
    }
  }

  static async update(req, res) {
    try {
      const { error, value } = customerSchema.validate(req.body);
      if (error) {
        return res.status(400).send(error.details);
      }
      const customer = await CustomerService.updateCustomer(
        req.params.id,
        value
      );
      if (!customer) {
        return res.status(404).send("Customer not found!å");
      }
      res.status(200).send(customer);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const customer = await CustomerService.deleteCustomer(req.params.id);
      if (!customer) {
        return res.status(404).send();
      }
      res.status(200).send(customer);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CustomerController;
