
const mongoose = require('mongoose');
const {config}=require("../config/secret")

main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', false);
    await mongoose.connect(`mongodb+srv://${config.userDB}:${config.passDB}@cluster0.pa1epkq.mongodb.net/HitchhikerManagmentSystem`);
    console.log("mongo connect HitchhikerManagmentSystem");
}
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled


    // mongodb+srv://hadassahdevelop:bMHyhsl4Yuwj4Hgs@cluster0.pa1epkq.mongodb.net/