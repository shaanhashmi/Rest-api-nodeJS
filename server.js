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

app.use("/api", user_routes);

app.listen(config.port, () => {
    console.log("Express server listening on port " + config.port);
});

