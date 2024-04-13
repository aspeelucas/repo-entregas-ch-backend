import fs from "fs";


export class CartManager {
  constructor(path) {
    this.path = path;
    try {
      const carts = fs.readFileSync(this.path, "utf8");
      this.carts = JSON.parse(carts);
    } catch (error) {
      this.carts = [];
    }
  }

  async addCart() {
    let id = 1;
    while (this.carts.some(({ id: pid }) => pid == id)) {
      id++;
    }

    this.carts.push({ products: [], id });
    console.log(`El carrito ${id} fue agregado con exito`);
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, "\t")
      );
      console.log(`El archivo fue guardado con exito`);
      return id;
    } catch (error) {
      console.log(`error al guardar el archivo ${error}`);
    }
  }

  async addProductToCart(id, productId) {
    const cart = await this.getCart(id);
    if (!cart) {
      console.log(`El carrito con el id ${id} no existe`);
    } else {
      const productIndex = cart.products.findIndex(
        (product) => Number(productId) === product.id
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ id: Number(productId), quantity: 1 });
        console.log(`El producto ${productId} fue agregado con exito`);
      }
      try {
        console.log(cart);
        const carts = await this.getCarts();
        const updatedCart = carts.map((c) => (c.id === Number(id) ? cart : c));
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(updatedCart, null, "\t")
        );
        console.log(`El archivo fue guardado con exito`);
      } catch (error) {
        console.log(`error al guardar el archivo ${error}`);
      }
    }
  }

  async getCarts() {
    try {
      const carts = await fs.promises.readFile(this.path, "utf8");
      return JSON.parse(carts);
    } catch (error) {
      await fs.promises.writeFile(this.path, JSON.stringify([], null, "\t"));
      return [];
    }
  }
  async getCart(id) {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === Number(id));
    if (!cart) {
      console.log(`El carrito con el id ${id} no existe`);
      return null;
    } else {
      return cart;
    }
  }
}

class Cart {
  constructor() {
    this.products = [];
  }
}


