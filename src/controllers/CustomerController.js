const { customerSchema } = require("../validators/customerValidator");
const logger = require("../config/logger");
const CustomerService = require("../services/customerService");
const AppError = require("../utils/AppError");

class CustomerController {
  static async create(req, res, next) {
    try {
      const { error, value } = customerSchema.validate(req.body);
      if (error) {
        return res.status(400).send(error.details);
      }
      const customer = await CustomerService.createCustomer(value);

      logger.info(`Customer created successfully:`, customer.toJSON());
      res.status(201).send(customer);
    } catch (err) {
      logger.debug("error");
      logger.error(`Error while creating customer, ${err}`);
      if (err.code === 11000) {
        return res.status(409).send({ message: "Email already exists" });
      }
      next(new AppError("Error while creating customer", err.code, true));
    }
  }

  static async read(req, res, next) {
    try {
      const customers = await CustomerService.getAllCustomers();
      res.status(200).send(customers);
    } catch (err) {
      next(err);
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
      next(new AppError("Error retrieving customer", err.code, true));
    }
  }

  static async searchCustomers(req, res, next) {
    const { page = 1, limit = 10 } = req.query;

    try {
      const customersData = await CustomerService.searchCustomersByQuery(
        req.query,
        parseInt(page),
        parseInt(limit)
      );
      logger.info("Customers found with pagination:", { page, limit });
      res.status(200).json(customersData);
    } catch (err) {
      logger.error("Error searching customers with pagination:", err);
      next(new AppError("Error searching customer", err.code, true));
    }
  }

  static async getCustomerByEmail(req, res, next) {
    const { email } = req.params;
    try {
      const customer = await CustomerService.getCustomerByEmail(email);
      logger.info("Customer found:", customer.toJSON());
      res.status(200).json(customer);
    } catch (err) {
      if (err.message === "Customer not found") {
        logger.warn("Customer not found:", { email });
        return res.status(404).json({ message: "Customer not found" });
      }
      logger.error("Error retrieving customer:", err);
      next(new AppError("Error retrieving customer by Email", err.code, true));
    }
  }

  static async update(req, res, next) {
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
        return res.status(404).send({ message: "Customer not found!" });
      }
      res.status(200).send(customer);
    } catch (err) {
      logger.error("Error updating customer", err);
      if (err.code === 11000) {
        return res.status(409).send({ message: "Email already exists" });
      }
      next(new AppError("Error updating customer", err.code, true));
    }
  }

  static async delete(req, res, next) {
    try {
      const customer = await CustomerService.deleteCustomer(req.params.id);
      if (!customer) {
        return res.status(404).send({ message: "Customer Not Found!" });
      }
      res.status(200).send(customer);
    } catch (err) {
      logger.error("Error deleting customer", err);
      next(new AppError("Error deleting customer", err.code, true));
    }
  }
}

module.exports = CustomerController;
