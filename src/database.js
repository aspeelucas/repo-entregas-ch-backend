import mongoose from "mongoose";
import dotenv from "dotenv";
import configObjet from "./config/config.js";
const {mongo_url} = configObjet;



class DataBase{
  static #instance ;
  constructor(){
    mongoose.connect(mongo_url);
  }
  static getInstance(){
    if(this.#instance){
      console.log("Ya existe una instancia de la base de datos");
      return this.#instance;
    }
    this.#instance = new DataBase();
    console.log("Se ha creado una instancia de la base de datos");
    return this.#instance;
  }
}


export default DataBase.getInstance();