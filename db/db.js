let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const config = require("../config/config.js");
const db_path = config.db;

class Database {
    // contains the logic for the Database
    constructor() {
        this.db_connect();
    }
    db_connect() {
        mongoose
            .connect(db_path)
            .then(() => {
                console.log("Database connection successful");
            })
            .catch(err => {
                console.error(err);
            });
    }
}
module.exports = new Database();
