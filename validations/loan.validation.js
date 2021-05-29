const Joi = require("joi");

const validateTakeLoan = (data) => {
    const Schema = Joi.object({
        loanAmount: Joi.number().positive().min(1000).required(),
        loanPeriod: Joi.number().positive().min(6).max(12).required(),
        loanObjective: Joi.string().max(30).required(),
    });
    return Schema.validate(data);
};

module.exports = {
    validateTakeLoan,
};