const app = require('express')();
const config = require("./config/config");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const mongoose = require("./db/db")
const user_routes = require("./app/modules/user/user.routes");

const env = process.env.NODE_ENV || "development";

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use("/api", user_routes);

app.listen(config.port, () => {
    console.log("Express server listening on port " + config.port);
});

