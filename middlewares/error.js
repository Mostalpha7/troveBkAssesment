const { logError } = require("./logger");
const { JsonResponse } = require("../utils/apiResponse");
module.exports = async(err, req, res, next) => {
    logError({ name: "Error", error: err });

    // const errorMessage = err.msg || err.message || "Something went wrong";
    const errorMessage = err.msg || "Something went wrong";
    const statusCode = err.code || err.statusCode || 500;

    return JsonResponse({ res, status: statusCode, msg: errorMessage });
};