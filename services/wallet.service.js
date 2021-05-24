const { Wallet } = require("../models/index.shema");
const {
    calcPortfolioVal,
    estimateUseAblePortfolioVal,
} = require("../utils/walletUtils");
const LoanService = require("./loan.service");

const loanInstance = new LoanService();
class WalletService {
    createWallet(user) {
        return new Promise(async(resolve, reject) => {
            try {
                user.balance = 0;
                user.currency = "USD";
                const createdWallet = await new Wallet(user).save();
                resolve(createdWallet);
            } catch (error) {
                error.source = "Create wallet service";
                return reject(error);
            }
        });
    }

    getWallet(userId) {
        return new Promise(async(resolve, reject) => {
            try {
                const wallet = await Wallet.findOne({ userId: userId })
                    .then((wallet) => (wallet ? wallet : false))
                    .catch(() => false);
                const totalPortfolioVal = await calcPortfolioVal({ wallet });
                var userLoan = await loanInstance.getUserLoan(wallet.userId);

                const useAblePortfolioVal = await estimateUseAblePortfolioVal({
                    totalPortfolioVal,
                    userLoan,
                });

                wallet.portfolioVals = { totalPortfolioVal, useAblePortfolioVal };
                resolve(wallet);
            } catch (error) {
                error.source = "Get wallet Service";
                return reject(error);
            }
        });
    }
}

module.exports = WalletService;