const express = require("express");
const mongoose = require("mongoose");
const { User } = require("./user.model");
const _ = require("lodash");
const message = require("../../../config/messages");
const { errorHandler } = require("../../helpers/errorHandling.helper");
const validateInput = require("./user.validators");


// REGISTER NEW USER
exports.user_register = (req, res) => {
    let data = req.body;
    validateInput.password_validator(data.password)
        .then(result => {
            debugger
            if (!result) {
                throw message.invalidPassword;
            }
            var user = new User(data);
            return user.save().then(user => {
                return user.generateAuthToken().then(token => {
                    res.status(200).send({
                        result: PickResponseResult(user),
                        token: token,
                        status: 200,
                        message: message.userRegistered
                    });
                });
            });
        })
        .catch(e => {
            res.status(400).send(errorHandler(e))
        });
};

/*******LOGIN********/
exports.user_login = (req, res) => {
    const body = { email, password } = req.body;
    User.findByCredentials(body.email, body.password)
        .then(user => {
            return user.generateAuthToken().then(token => {
                res.status(200).json({
                    result: PickResponseResult(user),
                    status: 200,
                    token: token,
                    message: "Succesfully Logged in User"
                });
            });
        })
        .catch(e => {
            res.status(400).send({
                result: message.invalidCredentials,
                status: 400,
                message: message.invalidCredentials
            });
        });
};


/******GET USERS*******/
exports.getUsers = (req, res) => {
    let query;
    if (!req.params.id && !req.query.getAllUsers) {
        res.status(400).send(errorHandler(message.invalidRequest));
    } else {
        if (req.params.id) {
            query = { _id: req.params.id };
        } else if (!req.query.getAllUsers) {
            query = {};
        }
        User.find(query)
            .then(users => {
                if (!users) throw message.userNotFound;

                res.status(200).json({
                    result: PickGetUserResult(users),
                    status: 200,
                    message: message.success
                });

            })
            .catch(e => {
                res.status(400).send(errorHandler(e));
            });
    }
};


/*******DELETE USER********/
exports.deleteUser = (req, res) => {
    User.findOneAndRemove({ _id: req.params.id })
        .then(user => {
            if (!user) throw message.userNotFound;

            res.status(200).send({
                result: null,
                status: 200,
                message: message.success
            });

        })
        .catch(e => {
            res.status(400).json(errorHandler(e));
        });
};


// Response data format
function PickResponseResult(data) {
    console.log(data)
    let response = _.pick(data, [
        "isEmailVerified",
        "isPhoneVerified",
        "firstName",
        "lastName",
        "email",
        "phone",
        "id"
    ]);
    return response;
};


function PickGetUserResult(data) {
    var response = _.map(
        data,
        _.partialRight(_.pick, [
            "id",
            "firstName",
            "lastName",
            "email",
            "phone",
            "countryCode"
        ])
    );
    return response;
}


