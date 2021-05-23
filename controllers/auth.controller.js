const AuthService = require("../services/auth.service");
const { JsonResponse } = require("../utils/apiResponse");
const {
    validateRegistration,
    validateLogin,
} = require("../validations/user.validation");

const authInstance = new AuthService();

exports.register = async(req, res, next) => {
    try {
        // validate request body
        const { error } = validateRegistration(req.body);
        if (error) {
            return JsonResponse({ res, status: 400, msg: error.details[0].message });
        }
        const registeredUser = await authInstance.signUp(req.body);

        JsonResponse({
            res,
            status: 200,
            msg: "Registration success",
            data: registeredUser,
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async(req, res, next) => {
    try {
        // validate login request body
        const { error } = validateLogin(req.body);

        if (error) {
            return JsonResponse({ res, status: 400, msg: error.details[0].message });
        }
        // sign user
        const { user, token } = await authInstance.signIn(req.body);
        JsonResponse({
            res,
            code: 200,
            msg: "Login successful",
            data: { user, token },
        });
    } catch (error) {
        next(error);
    }
};