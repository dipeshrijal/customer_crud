const Customer = require("../models/Customer");
const logger = require("../config/logger");

class CustomerService {
  static async createCustomer(data) {
    try {
      const customer = new Customer(data);
      await customer.save();
      logger.info("Customer saved to database:", customer.toJSON());
      return customer;
    } catch (err) {
      // logger.error("Error saving customer to database:", err);
      throw err;
    }
  }

  static async searchCustomersByQuery(query, page = 1, limit = 10) {
    try {
      const searchCriteria = {};

      const { page: queryPage, limit: queryLimit, ...filterQuery } = query;

      // Build dynamic query based on provided query parameters
      Object.keys(filterQuery).forEach((key) => {
        searchCriteria[key] = { $regex: query[key], $options: "i" };
      });

      const skip = (page - 1) * limit;

      const customers = await Customer.find(searchCriteria)
        .skip(skip)
        .limit(limit);

      const totalCustomers = await Customer.countDocuments(searchCriteria);

      logger.info("Customers retrieved successfully with pagination:", {
        query,
        page,
        limit,
      });
      return {
        customers,
        totalCustomers,
        page,
        limit,
        totalPages: Math.ceil(totalCustomers / limit),
      };
    } catch (err) {
      logger.error("Error retrieving customers with pagination:", {
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
