const bcrypt = require("bcrypt");

const UserService = require("../services/user.service");
const { JsonResponse } = require("../utils/apiResponse");
const {
    validateBasicProfile,
    validateNokDetails,
    validateBankDetails,
    validatePasswordUpdate,
} = require("../validations/user.validation");
const { confirmPassword, checkBankDetails } = require("../utils/userUtils");

const userInstance = new UserService();

exports.updateBasicProfile = async(req, res, next) => {
    try {
        const { error } = validateBasicProfile(req.body);
        if (error) {
            return JsonResponse({ res, status: 400, msg: error.details[0].message });
        }

        const updateBasic = await userInstance.updateBasicProfile(
            req.body,
            req.user
        );

        JsonResponse({ res, code: 200, msg: "Basic profile updated successfully" });
    } catch (error) {
        next(error);
    }
};

exports.updateNokDetails = async(req, res, next) => {
    try {
        const { error } = await validateNokDetails(req.body);
        if (error) {
            return JsonResponse({ res, status: 400, msg: error.details[0].message });
        }

        const isPasswordMatch = await confirmPassword({
            password: req.body.password,
            user: req.user,
        });

        if (!isPasswordMatch) {
            return JsonResponse({ res, status: 400, msg: "Invalid Password" });
        }

        const updateNokDetails = await userInstance.updateNokDetails(
            req.body,
            req.user
        );
        JsonResponse({ res, status: 200, msg: "Next of kin updated successfully" });
    } catch (error) {
        next(error);
    }
};

exports.updateBankInfo = async(req, res, next) => {
    try {
        const { error } = validateBankDetails(req.body);
        if (error) {
            return JsonResponse({ res, status: 400, msg: error.details[0].message });
        }

        const isPasswordMatch = await confirmPassword({
            password: req.body.password,
            user: req.user,
        });

        if (!isPasswordMatch) {
            return JsonResponse({ res, status: 400, msg: "Invalid Password" });
        }

        const confrimBankInfo = await checkBankDetails({
            accountNumber: req.body.accountNumber,
            bankCode: req.body.bankCode,
        });

        if (!confrimBankInfo) {
            return JsonResponse({
                res,
                status: 400,
                msg: "Bank details does not match",
            });
        }

        req.body.accountName = confrimBankInfo.accountName;

        const updateBank = await userInstance.updateBankDetails(req.body, req.user);

        JsonResponse({
            res,
            status: 200,
            msg: "Bank details updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

exports.updatePassword = async(req, res, next) => {
    // console.log();
    try {
        const { error } = validatePasswordUpdate(req.body);
        if (error) {
            return JsonResponse({ res, status: 400, msg: error.details[0].message });
        }

        const isPasswordMatch = await confirmPassword({
            password: req.body.password,
            user: req.user,
        });

        if (!isPasswordMatch) {
            return JsonResponse({ res, status: 400, msg: "Invalid Password" });
        }

        // encrypt password
        const hashPassword = await bcrypt.hash(
            req.body.newPassword,
            parseInt(process.env.bcryptSalt)
        );

        req.body.password = hashPassword;

        const updatePass = await userInstance.updatePassword(req.body, req.user);
        JsonResponse({ res, status: 200, msg: "Password updated successfully" });
    } catch (error) {
        next(error);
    }
};