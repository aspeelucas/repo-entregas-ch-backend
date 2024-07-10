import mongoose from "mongoose";
import { expect } from "chai";

import productServ from "../src/services/products.service.js";

mongoose.connect(
  "mongodb+srv://aspeelucas:1D4amlIQuSpEfW4E@backend.iwzkkok.mongodb.net/ecommercetest?retryWrites=true&w=majority&appName=backend"
);

describe("Product  test", function () {
  before(function () {
    this.product = new productServ();
  });

  it("el add de productos deberia crear un producto", async function () {
    const product = {
      title: "Test Product",
      description: "Test Product",
      price: 100,
      code: "1234",
      stock: 25,
      category: "Test",
      status: true,
      thumbnails: [],
      owner: "admin",
    };
    const newProduct = await this.product.addProduct(product);
    expect(newProduct).to.have.property("_id");
  });
  it("el get de productos deberia traer todos los productos", async function () {
    const products = await this.product.getProducts();
    expect(products).to.be.an("object");
  });
  it("el getProductById de productos deberia devolver un producto por id", async function () {
    const products = await this.product.getProducts();
    const productId = products.docs[0]._id;
    const result = await this.product.getProductById(productId);
    expect(result).to.be.an("object");
  });

  it("el delete de productos deberia eliminar un producto por id", async function () {
    const products = await this.product.getProducts();
    const productId = products.docs[0]._id;
    const result = await this.product.deleteProduct(productId);
    expect(result).to.be.an("undefined");
  });

  after(async function () {
    await mongoose.disconnect();
  });
});
