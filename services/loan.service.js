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

    getUserActiveLoan(userId) {
        return new Promise(async(resolve, reject) => {
            try {
                const userLoan = await Loan.find({ userId });

                var activeLoan = userLoan.filter((item) => {
                    return item.totalAmountReturned < item.loanAmount;
                });
                resolve(activeLoan);
            } catch (error) {
                error.source = "Get user loan ==> LoanService";
                reject(error);
            }
        });
    }

    processNewLoan(loanPayload) {
        return new Promise(async(resolve, reject) => {
            try {
                console.log(loanPayload);
                await new Loan(loanPayload).save({});
                resolve(true);
            } catch (error) {
                error.source = "Create new loan ==> LoanService";
                reject(error);
            }
        });
    }
}

module.exports = LoanService;