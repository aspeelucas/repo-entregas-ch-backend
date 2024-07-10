import mongoose from "mongoose";
import { expect } from "chai";

import userServices from "../src/services/users.service.js";

mongoose.connect(
  "mongodb+srv://aspeelucas:1D4amlIQuSpEfW4E@backend.iwzkkok.mongodb.net/ecommercetest?retryWrites=true&w=majority&appName=backend"
);

describe("User Service test", function () {
  before(function () {
    this.user = new userServices();
  });

  it("el get de usuarios deberia devolver un array de usuarios", async function () {
    const users = await this.user.getUsers();
    expect(users).to.be.an("array");
  });

  it("el add de usuarios deberia crear un usuario", async function () {
    const user = {
      first_name: "Test User",
      last_name: "Test User",
      email: "testinguser@gmail.com",
      password: "1234",
      age: 25,
      rol: "user",
      cart: "1234",
    };
    const newUser = await this.user.addUser(user);
    expect(newUser).to.have.property("_id");
  });

  it("el find de usuarios deberia devolver un usuario por email", async function () {
    const result = await this.user.findUser("testinguser@gmail.com");
    expect(result).to.be.an("object");
  });
  it("el find de usuarios deberia devolver un usuario por cartId", async function () {
    const result = await this.user.findUserByCartId("1234");
    expect(result).to.be.an("object");
  });

  it("el delete de usuarios deberia eliminar un usuario por email", async function () {
    const result = await this.user.deleteUser("testinguser@gmail.com");
    expect(result).to.be.an("object");
  });

  after(async function () {
    await mongoose.disconnect();
  });
});
