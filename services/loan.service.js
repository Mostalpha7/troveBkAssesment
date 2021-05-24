const { Loan } = require("../models/index.shema");

class LoanService {
    getUserLoan(userId) {
        return new Promise(async(resolve, reject) => {
            try {
                const userLoan = await Loan.find({ userId });
                resolve(userLoan);
            } catch (error) {
                error.source = "Get user loan ==> LoanService";
                reject(error);
            }
        });
    }
}

module.exports = LoanService;