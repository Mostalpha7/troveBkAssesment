const Joi = require("joi");
const { JoiPasswordComplexity } = require("joi-password");

const validateBasicProfile = (user) => {
    const Schema = Joi.object({
        dob: Joi.string().required(),
        gender: Joi.string().max(10).required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        address: Joi.string().required(),
        phoneNumber2: Joi.string().min(11).max(11).required(),
    });
    return Schema.validate(user);
};

const validateNokDetails = (details) => {
    const Schema = Joi.object({
        nokFirstName: Joi.string().max(30).required(),
        nokLastName: Joi.string().max(30).required(),
        nokPhoneNumber: Joi.string().max(11).min(11).required(),
        nokGender: Joi.string().max(10).required(),
        nokAddress: Joi.string().required(),
        nokCity: Joi.string().required(),
        nokState: Joi.string().required(),
        password: Joi.string().required(),
    });
    return Schema.validate(details);
};

const validateBankDetails = (data) => {
    const Schema = Joi.object({
        accountNumber: Joi.string().min(10).max(10).required(),
        bankName: Joi.string().required(),
        bankCode: Joi.string().required(),
        password: Joi.string().required(),
    });

    return Schema.validate(data);
};

const validatePasswordUpdate = (data) => {
    const Schema = Joi.object({
        password: JoiPasswordComplexity.string()
            .minOfSpecialCharacters(2)
            .minOfLowercase(2)
            .minOfUppercase(1)
            .minOfNumeric(2)
            .required()
            .messages({
                "password.minOfSpecialCharacters": "Password should contain a minimum of 2 special character",
                "password.minOfLowercase": "Password should contain a minimun of two lowercase",
                "password.minOfUppercase": "Password should contain one uppercase ",
                "password.minOfNumeric": "Password should contain a minimun of two numbers",
            }),
        newPassword: JoiPasswordComplexity.string()
            .minOfSpecialCharacters(2)
            .minOfLowercase(2)
            .minOfUppercase(1)
            .minOfNumeric(2)
            .required()
            .messages({
                "password.minOfSpecialCharacters": "Password should contain a minimum of 2 special character",
                "password.minOfLowercase": "Password should contain a minimun of two lowercase",
                "password.minOfUppercase": "Password should contain one uppercase ",
                "password.minOfNumeric": "Password should contain a minimun of two numbers",
            }),
    });

    return Schema.validate(data);
};

module.exports = {
    validateBasicProfile,
    validateNokDetails,
    validateBankDetails,
    validatePasswordUpdate,
};