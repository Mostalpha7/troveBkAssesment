const bcrypt = require("bcrypt");
const axios = require("axios");

const confirmPassword = async({ password, user }) => {
    return bcrypt.compare(password, user.password);
};

const checkBankDetails = async({ accountNumber, bankCode }) => {
    return await axios
        .get(
            `https://sandbox.monnify.com/api/v1/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`
        )
        .then((result) => {
            var responseBody = result.data.responseBody;
            if (responseBody.accountName) {
                return responseBody;
            } else {
                return false;
            }
        })
        .catch((err) => {
            return false;
        });
};

module.exports = {
    confirmPassword,
    checkBankDetails,
};