import mongoose from "mongoose";
import { expect } from "chai";

import cartServices from "../src/services/carts.service.js";

mongoose.connect(
    "mongodb+srv://aspeelucas:1D4amlIQuSpEfW4E@backend.iwzkkok.mongodb.net/ecommercetest?retryWrites=true&w=majority&appName=backend"
  );

describe("Cart  test", function () {

    before(function () {
        this.cart = new cartServices();
    });

    it("el add de carritos deberia crear un carrito", async function () {
        const user = "1234";
        const newCart = await this.cart.addCart(user);
        expect(newCart).to.have.property("_id");
    });

   it("el get de carritos deberia traer todos los carritos", async function () {
    
        const carts = await this.cart.getCarts();
        expect(carts).to.be.an("array");
    });

    it("cada carrito deberia tener un usuario asignado", async function () {
        const carts = await this.cart.getCarts();
        carts.forEach(cart => {
            expect(cart).to.have.property("user");
        });
    });

    after(async function () {
        await mongoose.disconnect();
    });
});