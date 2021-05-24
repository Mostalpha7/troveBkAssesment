const Joi = require("joi");

const validateTakeLoan = (data) => {
    const Schema = Joi.object({});
    return Schema.validate(data);
};

module.exports = {
    validateTakeLoan,
};