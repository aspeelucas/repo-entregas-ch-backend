import { userModel } from "../models/user.model.js";

class UsersService {
  async getUsers() {
    try {
      const users = await userModel.find();
      const usersData = users.map((user) => {
        return {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          rol: user.rol,
        };
      });
      return usersData;
    } catch (error) {
      throw new Error("Error al obtener los usuarios");
    }
  }

  async addUser(user) {
    return await userModel.create(user);
  }

  async findUser(email) {
    return await userModel.findOne({ email });
  }

  async findUserByCartId(cartId) {
    return await userModel.findOne({ cart: cartId });
  }

  async deleteUser(email) {
    try {
      const user = await userModel.findOneAndDelete({ email });
      return user;
    } catch (error) {
      throw new Error("Error al eliminar el usuario");
    }
  }

  async findUserDate() {
    const date = new Date();
    date.setDate(date.getDate() - 2);
    const usersFound = await userModel.find({
      last_connection: { $lt: date },
    });
    return usersFound;
  }

  async findUserForDelete() {
    const date = new Date();
    date.setDate(date.getDate() - 2);
    const usersDeleted = await userModel.deleteMany({
      last_connection: { $lt: date },
    });
    return usersDeleted;
  }
}

export default UsersService;
