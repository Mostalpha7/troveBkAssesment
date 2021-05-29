const { JsonResponse } = require("../utils/apiResponse");
const { validateTakeLoan } = require("../validations/loan.validation");

const WalletService = require("../services/wallet.service");
const LoanService = require("../services/loan.service");
const { portfolioSufficiency } = require("../utils/loanUtils");

const walletInstance = new WalletService();
const loanInstance = new LoanService();
exports.takeLoan = async(req, res, next) => {
    try {
        const userId = req.user.userId;
        const { loanObjective } = req.body;
        const loanAmount = parseFloat(req.body.loanAmount);
        const loanPeriod = parseInt(req.body.loanPeriod);

        // validate input field
        const { error } = await validateTakeLoan(req.body);
        if (error) {
            return JsonResponse({ res, status: 400, msg: error.details[0].message });
        }

        if (!req.user.bankDetailsEnterd) {
            return JsonResponse({
                res,
                status: 400,
                msg: "Please enter your bank details",
            });
        }

        const userWallet = await walletInstance.getWallet(req.user.userId);

        // check is useablePortfolio value if sufficient
        if (userWallet.portfolioVals.useablePortfolioVal < req.body.loanAmount) {
            JsonResponse({ res, status: 400, msg: "Insufficient portfolio value" });
            return;
        }

        // calculate the payment schedule
        let paymentSchedule = [];
        for (let i = 1; i < loanPeriod + 1; i++) {
            let date = new Date();
            let nextDate = 30 * i;
            let schedule = {
                nextDue: new Date(date.setDate(date.getDate() + nextDate)),
                paid: false,
            };
            paymentSchedule.push(schedule);
        }
        // get loan
        const loanPayload = {
            userId: userId,
            loanAmount: loanAmount,
            loanPeriod: loanPeriod,
            loanObjective: loanObjective,
            collateralPortfolioValue: loanAmount,
            repaymentAmount: loanAmount / loanPeriod,
            paymentSchedule: paymentSchedule,
        };

        const processLoan = await loanInstance.processNewLoan(loanPayload);

        // credit user main wallet
        const creditWallet = await walletInstance.creditWallet({
            userId: req.user.userId,
            currentBalance: parseFloat(userWallet.balance),
            amount: parseFloat(req.body.loanAmount),
        });

        JsonResponse({
            res,
            status: 200,
            msg: "Loan request was successful and your account has been credit. Enjoy!",
        });
    } catch (error) {
        error.source = "takeLoan ==> Loan Controller";
        next(error);
    }
};

exports.viewActiveLoan = async(req, res, next) => {
    try {
        const activeLoan = await loanInstance.getUserActiveLoan(req.user.userId);

        JsonResponse({
            res,
            status: 200,
            msg: "Active Loan Fetched",
            data: activeLoan,
        });
    } catch (error) {
        error.source = "viewActiveLoan ==>Loan Controller";
        next(error);
    }
};

exports.viewLoan = async(req, res, next) => {
    try {
        const userLoan = await loanInstance.getUserLoan(req.user.userId);

        JsonResponse({
            res,
            status: 200,
            msg: "Loan data fetched",
            data: userLoan,
        });
    } catch (error) {
        error.source = "View loan ==>  Loan Controller ";
        next(error);
    }
};