const { JsonResponse } = require("../utils/apiResponse");
const { validateTakeLoan } = require("../validations/loan.validation");

exports.takeLoan = async(req, res, next) => {
    try {
        // validate input field
        const { error } = await validateTakeLoan();
        if (error) {
            return JsonResponse({ res, status: 400, msg: error.details[0].message });
        }
        // TODO cont.
        // Get users useAblePortfolioVal
    } catch (error) {
        error.source = "takeLoan ==> Loan Controller";
        next(error);
    }
};