const mongoose = require("mongoose");
const validator = require("validator");
var config = require("../../../config/config");
var secret = config.jwt_secret;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// defining the schema for the Model User

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            unique: true,
            sparse: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            sparse: true,
            trim: true,
            minlength: 1,
            validate: {
                validator: validator.isEmail,
                message: "{VALUE} is not a valid email"
            }
        },
        password: {
            type: String,
            minlength: 8
        },
        token: String,
        isEmailVerified: Boolean,
        isPhoneVerified: Boolean,
        acceptTerms: {
            type: Boolean,
            required: true
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    let token = jwt
        .sign(
            {
                _id: user._id.toHexString()
            },
            secret
        )
        .toString();
    user.token = token;

    return user.save().then(() => {
        return token;
    });
};

// for validating jwt auth token


UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({
        email: email
    }).then(user => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        }).catch(e => {
            console.log(e);
        });
    });
};

UserSchema.pre("save", function (next) {
    var user = this;
    if (user.isModified("password")) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.pre("findOneAndUpdate", function (next) {
    const password = this.getUpdate().$set.password;
    if (!password) {
        return next();
    }
    try {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        this.getUpdate().$set.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
});

var User = mongoose.model("User", UserSchema);

module.exports = {
    User
};
