const Joi = require("joi");
const { JoiPasswordComplexity } = require("joi-password");

const validateRegistration = (user) => {
    const Schema = Joi.object({
        email: Joi.string().email().required(),
        firstName: Joi.string().min(2).max(20).required(),
        lastName: Joi.string().min(2).max(20).required(),
        phoneNumber: Joi.string().min(11).max(11).required(),
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
    });

    return Schema.validate(user);
};

const validateLogin = (user) => {
    const Schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    return Schema.validate(user);
};

const validate2Fauth = (data) => {
    const Schema = Joi.object({
        email: Joi.string().email().max(30).required(),
        requestId: Joi.string().required(),
        code: Joi.string().required(),
    });

    return Schema.validate(data);
};

module.exports = {
    validateRegistration,
    validateLogin,
    validate2Fauth,
};