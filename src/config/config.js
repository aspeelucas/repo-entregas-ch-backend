import dotenv from 'dotenv';
import program from '../utils/commander.js';

const { mode } = program.opts();
dotenv.config({
    path: mode === 'production' ? './.env.prod' : './.env'
});


const configObjet = {
    
   mongo_url:process.env.MONGO_CONNECTION_STRING
    
};


export default configObjet;