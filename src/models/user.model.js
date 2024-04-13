import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        // required: true
    },
    age:{
        type: Number,
        required: true
    },
    rol:{
        type: String,
        default: 'user'
    },

});

export const userModel = mongoose.model('users', userSchema);