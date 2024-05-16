const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../config.json");
const conUser = mongoose.createConnection(config.mongo.ticketingUrl);

const userSchema = require("../models/users");
const userModel = conUser.model("User", userSchema);



const errorResponse = {
    success: 0,
    message: "Access Denied! unauthorized user",
};

const accessDeniedResponse = {
    success: 0,
    message: "Access Denied! Account Deactivated"
};

const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json(errorResponse);
    }
    token = token.slice(7);
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(400).send({ ...errorResponse, ...err });
        }
        if (decoded.id?._id) {
            let userStatus = await userModel.findOne({
                    _id: decoded.id,
                    status: "active",
                });
            if (userStatus) {
                req.authUser = userStatus;
                next();
            } else {
                return res
                    .status(401)
                    .send(accessDeniedResponse);
            }
        } else {
            return res.status(400).send({ ...errorResponse, ...err });
        }
    });
};


const auth = {
    verifyToken,
};

module.exports = auth;
