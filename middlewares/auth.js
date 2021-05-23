const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");
const { JsonResponse } = require("../utils/apiResponse");

const userInstance = new UserService();

const Auth = async(req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return JsonResponse({ res, status: 403, msg: "Access Denied" });

    try {
        const decoded = jwt.verify(token, process.env.jwtPrivateKey);
        req.user = await userInstance.getProfile(decoded);
        next();
    } catch (ex) {
        JsonResponse({
            res,
            status: 406,
            msg: "USER NOT FOUND or TOKEN INCOMPLETE",
        });
    }
};

module.exports = {
    Auth,
};