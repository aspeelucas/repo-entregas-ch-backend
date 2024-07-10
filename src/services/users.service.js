import { userModel } from "../models/user.model.js";

class UsersService {
    async getUsers() {
        return await userModel.find({});
    }
    
    async addUser(user) {
        return await userModel.create(user);
    }

    async findUser(email){
        return await userModel.findOne({email});
    }

    async findUserByCartId(cartId){
        return await userModel.findOne({cart:cartId});
    } 

    async deleteUser(email){
        return await userModel.findOneAndDelete({email});
    }
    
    
}

export default UsersService;