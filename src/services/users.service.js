import { userModel } from "../models/user.model.js";

class UsersService {
    // async getUsers() {
    //     return await userModel.find({});
    // }
    
    async addUser(user) {
        return await userModel.create(user);
    }

    async findUser(email){
        return await userModel.findOne({email});
    }
    
    // async deleteUser(_id) {
    //     return await userModel.findByIdAndDelete(_id);
    // }
}

export default UsersService;