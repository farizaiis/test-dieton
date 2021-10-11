require('dotenv').config();
// const { getUserData } = require('../helper/jwt')
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY_JWT

async function loginCheck(req, res, next) {
    const bearerToken = req.header("Authorization")

    try {
        const token = bearerToken.replace("Bearer ", "");
        const decoded = jwt.verify(token, secretKey);

        req.users = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: "failed",
            message: "please login first"
        })
    };
};

module.exports = { loginCheck };