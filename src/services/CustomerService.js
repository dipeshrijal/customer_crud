const Customer = require("../models/Customer");
const logger = require("../config/logger");

class CustomerService {
  static async createCustomer(data) {
    try {
      const customer = new Customer(data);
      await customer.save();
      logger.info("Customer saved to database:", customer);
      return customer;
    } catch (err) {
      logger.error("Error saving customer to database:", err);
      throw err;
    }
  }

  static async searchCustomersByQuery(query) {
    try {
      const searchCriteria = {};

      // Build dynamic query based on provided query parameters
      Object.keys(query).forEach((key) => {
        searchCriteria[key] = { $regex: query[key], $options: "i" };
      });

      const customers = await Customer.find(searchCriteria);
      logger.info("Customers retrieved successfully by query:", { query });
      return customers;
    } catch (err) {
      logger.error("Error retrieving customers by query:", {
        query,
        error: err.message,
      });
      throw err;
    }
  }

  static async getCustomerByEmail(email) {
    try {
      const customer = await Customer.findOne({ email });
      if (!customer) {
        throw new Error("Customer not found");
      }
      logger.info("Customer retrieved successfully by email:", { email });
      return customer;
    } catch (err) {
      logger.error("Error retrieving customer by email:", {
        email,
        error: err.message,
      });
      throw err;
    }
  }

  static async getAllCustomers() {
    return Customer.find();
  }

  static async getCustomerById(id) {
    try {
      const customer = await Customer.findById(id);
      if (!customer) {
        logger.error("Customer not found", id);
        throw new Error("Customer not found");
      }

      return customer;
    } catch (err) {
      logger.error("Error retrieving customer by id:", {
        id,
        error: err.message,
      });
      throw err;
    }
  }

  static async updateCustomer(id, data) {
    return Customer.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  static async deleteCustomer(id) {
    return Customer.findByIdAndDelete(id);
  }
}

module.exports = CustomerService;
