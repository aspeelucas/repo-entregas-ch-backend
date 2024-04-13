import fs from "fs";



export class ProductManager {
  constructor(path) {
    this.path = path;
    try {
      const products = fs.readFileSync(this.path, "utf8");
      this.products = JSON.parse(products);
    } catch (error) {
      this.products = [];
    }
  }

  async addProduct(product) {
    const exitsteProducto = this.products.find(
      (producto) => producto.code === product.code
    );

    if (exitsteProducto) {
      console.log(
        `El producto con el codigo ${product.code} ya existe y no se agrego`
      );
    } else {
      let id = 1;
      while (this.products.some(({ id: pid }) => pid == id)) {
        id++;
      }
      if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.code ||
        !product.stock ||
        !product.status
      ) {
        console.log(`Error no se puede agregar el producto con campos vacios`);
      } else {
        this.products.push({ ...product, id });
        console.log(`El producto ${product.title} fue agregado con exito`);
        try {
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(this.products, null, "\t")
          );
          console.log(`El archivo fue guardado con exito`);
        } catch (error) {
          console.log(`error al guardar el archivo ${error}`);
        }
      }
    }
  }

  async getProducts() {
    const products = await fs.promises.readFile(this.path, "utf8");
    return JSON.parse(products);
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id === id);
      if (product) {
        return product;
      } else {
        throw new Error(`Not Found`);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  codeExist(code) {
    return this.products.find((product) => product.code === code);
  }

  async udpateProduct(id, product) {
    try {
      const productFound = await this.getProductById(id);

      if (!productFound) {
        throw new Error(`Producto no encontrado`);
      } else {
        const { title, description, price, thumbnail, code, stock } = product;
        console.log(product);
        if (this.codeExist(code) && code !== productFound.code) {
          throw new Error(`El codigo ${code} ya existe`);
        }
        const udpatedProduct = {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          id,
        };
        const udpatedProducts = this.products.map((product) => {
          if (product.id === id) {
            return udpatedProduct;
          }
          return product;
        });
        try {
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(udpatedProducts, null, "\t")
          );
          console.log(`El archivo fue guardado con exito`);
        } catch (error) {
          console.log(`error al guardar el archivo ${error}`);
        }
      }
    } catch (error) {
      console.error(`Error al actuliazar el producto:`, error.message);
    }
  }
  async deleteProduct(id) {
    try {
      const productFound = await this.getProductById(id);
      if (!productFound) {
        throw new Error(`Producto no encontrado`);
      } else {
        const udpatedProducts = this.products.filter(
          (product) => product.id !== id
        );
        try {
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(udpatedProducts, null, "\t")
          );
          console.log(`El archivo fue borrado con exito`);
        } catch (error) {
          console.log(`Error al guardar el archivo ${error}`);
        }
      }
    } catch (error) {
      console.error(`Error al eliminar el producto:`, error.message);
    }
  }
}

export class Product {
  constructor(title, description, price, thumbnail, code, stock, status) {
    this.id = null;
    this.title = title;
    this.price = price;
    this.description = description;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.status = status;
  }
}