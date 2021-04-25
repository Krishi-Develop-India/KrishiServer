const jwt = require('jsonwebtoken');

const User = require('../models/user');

const create = (number, name, rating, uri) => (
    jwt.sign({number, name, rating, uri}, process.env.ACCESS_TOKEN_SECRET, {algorithm: 'HS256', expiresIn: '30d'}) //1 month expiry date
);

const validate = (req, res, next) => {
    const { token } = req.body;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, access_token_decoded) => {
        if(error) {
            console.log("Error verifying the jwt token", error);
            return res.status(401).send("Cannot validate jwt token");
        }
        let currentUser = await User.findOne({number: access_token_decoded.number});
        req.user = currentUser;
        next();
    });
}

module.exports = {
    create,
    validate,
}