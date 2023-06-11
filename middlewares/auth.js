const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

exports.auth = (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token) {
        return res.status(401).json({ msg: "you need to send token to this endpoint url" })
    }

    try {
        let decodeToken = jwt.verify(token, config.tokenSecret)
        req.tokenData = decodeToken;
        next()

    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ msg: "token invalid or expired,log in again or you hacker!" })
    }
}

exports.authadmin = (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token) {
        return res.status(401).json({ msg: "you need to send token to this endpoint url" })
    }

    try {
        let decodeToken = jwt.verify(token, config.tokenSecret)
        if (decodeToken.role != "ADMIN") {
            return res.status(401).json({ msg: "token is valid or expired, code :3" })
        }

        req.tokenData = decodeToken;

        next()
    }

    catch (err) {
        console.log(err);
        return res.status(401).json({ msg: "token invalid or expired,log in again or you hacker!" })
    }
}