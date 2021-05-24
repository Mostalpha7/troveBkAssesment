const AuthService = require("../services/auth.service");
const UserService = require("../services/user.service");
const { JsonResponse } = require("../utils/apiResponse");
const { confirmPassword } = require("../utils/userUtils");
const {
    validateRegistration,
    validateLogin,
    validate2Fauth,
} = require("../validations/auth.validation");

const authInstance = new AuthService();
const userInstance = new UserService();

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

        const getUser = await userInstance.getOnlyUserData(req.body.email);

        // Confirm password
        const isPasswordMatch = await confirmPassword({
            password: req.body.password,
            user: getUser,
        });
        if (!isPasswordMatch) {
            return JsonResponse({ res, status: 400, msg: "Invalid password" });
        }

        const requestId = await authInstance.create2FAuthCode(getUser.phoneNumber);
        JsonResponse({
            res,
            status: 200,
            msg: "Please verify otp send to your phone number",
            data: { requestId },
        });
    } catch (error) {
        next(error);
    }
};

exports.verify2Fauth = async(req, res, next) => {
    try {
        const { error } = await validate2Fauth(req.body);
        if (error) {
            return JsonResponse({
                res,
                status: 400,
                msg: error.details[0].message,
            });
        }

        // verify Code
        // TODO uncomment this code
        // const verifyCode = await authInstance.confirm2FAuthCode(req.body);

        // Sign User

        const { user, token } = await authInstance.signIn(req.body);
        // Get user details with wallet
        const userData = await userInstance.getProfile(user);
        JsonResponse({
            res,
            code: 200,
            msg: "Login successful",
            data: {
                userData,
                token,
            },
        });

        await authInstance.notifyLogin(user);
    } catch (error) {
        error.source = "verify2Fauth controller";
        next(error);
    }
};