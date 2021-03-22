import * as mongoose from 'mongoose';
import config from '../config/main';

export default() =>{
    let db = mongoose.connection;

    mongoose.connect(config.db,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    db.once("open", _ => {
        console.log("Database Info: Connected to ", config.db);
    });

    db.on("error", (error) => {
        console.log("Database Error: ", error);
    });
}

