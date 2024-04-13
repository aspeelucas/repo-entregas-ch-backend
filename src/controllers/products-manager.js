import mongoose from "mongoose";
import { productModel } from "../models/product.model.js";

export class ProductManager {
  async addProduct({
    title,
    description,
    price,
    code,
    stock,
    category,
    thumbnails,

  }) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        throw new Error("Todos los campos son obligatorios");
      }

      const codeExist = await productModel.findOne({
        code: code,
      });

      if (codeExist) {
        throw new Error("El codigo ya existe");
      }

      const newProduct = new productModel({
        title,
        description,
        price,
        code,
        stock,
        category,
        status:true,
        thumbnails: thumbnails || [],
      });

      const product = await newProduct.save();

      console.log("Producto agregado con exito");
      return product;
    } catch (error) {
      console.log("Error al agregar producto", error);
      throw error;
    }
  }

  async getProducts(limit=10, page=1 ,sort, query = {}) {
    try {
      const products = await productModel.paginate(query, {limit, page,sort});
      return products;
    } catch (error) {
      console.log("Error al obtener productos", error);
      throw error;
    }
  }

  async getProductById(id) {
    const findProduct = await productModel.findById(id);
    if (findProduct) {
      console.log("Producto encontrado");
      return findProduct;
    } else {
      throw new Error(`Product Not Found`);
    }
  }

  async udpateProduct(id, product) {
    try {
      const productUpdate = await productModel.findByIdAndUpdate(id, product);
      if (productUpdate) {
        console.log("Producto actualizado");
        return productUpdate;
      } else {
        throw new Error(`No se pudo actualizar el producto`);
      }
    } catch (error) {
      console.error(`Error al actuliazar el producto:`, error.message);
    }
  }
  async deleteProduct(id) {
    try {
      const productDeleted = await productModel.findByIdAndDelete(id);
      if (productDeleted) {
        console.log("Producto borrado");
      } else {
        throw new Error(`No se pudo borrar el producto`);
      }
    } catch (error) {
      console.error(`Error al borrar el producto:`, error.message);
    }
  }
}
