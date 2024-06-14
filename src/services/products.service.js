import { productModel } from "../models/product.model.js";
import CustomError from "./errors/custom-error.js";
import { EErrors } from "./errors/enum.js";
import { getErrorInfo } from "./errors/info.js";

class ProductService {
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
        throw CustomError.createError({
          name:"Todos los campos son obligatorios",
          source:getErrorInfo({title,description,price,code,stock,category},2),
          message:"Error al crear un producto",
          code:EErrors.MISSING_FIELDS
        })
      }

      const codeExist = await productModel.findOne({
        code: code,
      });

      if (codeExist) {
        throw CustomError.createError({
          name:"Codigo ya existe",
          source:getErrorInfo({code},4),
          message:"Codigo ya existe",
          code:EErrors.INVALID_CODE
        })
      }

      const newProduct = new productModel({
        title,
        description,
        price,
        code,
        stock,
        category,
        status: true,
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

  async getProducts(limit = 10, page = 1, sort, query = {}) {
    try {
      const products = await productModel.paginate(query, {
        limit,
        page,
        sort,
      });
      if (products.docs.length === 0) {
        throw CustomError.createError({
          name:"Productos no encontrados",
          source:getErrorInfo({},7),
          message:"Productos no encontrados",
          code:EErrors.NOT_FOUND
        })
      }
      return products;
    } catch (error) {
      console.log("Error al obtener productos", error);
      throw error;
    }
  }

  async getProductById(id) {
    const findProduct = await productModel.findById(id);
    if (findProduct) {
      return findProduct;
    } else {
      throw CustomError.createError({
        name:"Producto no encontrado",
        source:getErrorInfo({_id:id},3),
        message:"Producto no encontrado",
        code:EErrors.NOT_FOUND
      })
    }
  }

  async getProducstById(ids) {
    try {
      const products = await productModel.find({ _id: { $in: ids } });
      return products;
    } catch (error) {
      console.log("Error al obtener productos", error);
      throw error;
    }
  }

  async udpateProduct(id, product) {
    try {
      const productUpdate = await productModel.findByIdAndUpdate(id, product);
      if (productUpdate) {
        return productUpdate;
      } else {
        throw CustomError.createError({
          name:"Error al actualizar el producto",
          source:getErrorInfo({_id:id, product},8),
          message:"Error al actualizar el producto",
          code:EErrors.MISSING_FIELDS
        })
      }
    } catch (error) {
      console.error(`Error al actuliazar el producto:`, error.message);
    }
  }

  async deleteProduct(id) {
    try {
      const productDeleted = await productModel.findByIdAndDelete(id);
      if (productDeleted) {
      } else {
        throw CustomError.createError({
          name:"Error al borrar el producto",
          source:getErrorInfo({_id:id},3),
          message:"Error al borrar el producto",
          code:EErrors.NOT_FOUND
        })
      }
    } catch (error) {
      console.error(`Error al borrar el producto:`, error.message);
    }
  }
}

export default ProductService;
