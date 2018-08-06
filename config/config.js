const path = require("path");
const rootPath = path.normalize(__dirname + "/..");
const env = process.env.NODE_ENV || "development";

const config = {
    development: {
        root: rootPath,
        port: process.env.PORT || 8080,
        db: "mongodb://127.0.0.1:27017/chat-app",
        jwt_secret: "7c9682f12f5053233efe2e4734f53aaa"
    },
};

module.exports = config[env];
