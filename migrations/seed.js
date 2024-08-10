const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Customer = require("../src/models/Customer");
const User = require("../src/models/User");
require("../src/config/db"); // Ensure this uses the existing db connection setup

dotenv.config();

const seedCustomers = async () => {
  try {
    await Customer.deleteMany(); // Clear existing data

    const customers = [];

    for (let i = 0; i < 50; i++) {
      const customer = new Customer({
        prefix: faker.person.prefix(),
        surname: faker.person.firstName(),
        middleName: faker.person.firstName(),
        familyName: faker.person.lastName(),
        suffix: faker.person.suffix(),
        email: faker.internet.email().toLowerCase(),
        phoneNumber: faker.phone.number(),
      });
      customers.push(customer);
    }

    await Customer.insertMany(customers);
    console.log("Customers seeded successfully");

    await seedUsers();
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    mongoose.connection.close();
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany(); // Clear existing data

    const users = [];

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("admin", salt);

    const user = new User({
      email: "admin@admin.com",
      password: password,
      fullName: "John Doe",
    });

    users.push(user);

    await User.insertMany(users);
    console.log("Users seeded successfully");
  } catch (err) {
    console.error("Seed error:", err);
  }
};

seedCustomers();
