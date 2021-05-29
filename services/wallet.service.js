const { Wallet } = require("../models/index.shema");
const {
    calcPortfolioVal,
    estimateAvailablePortfolioVal,
    estimateUseablePortfolioVal,
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

                const availablePortfolioVal = await estimateAvailablePortfolioVal({
                    totalPortfolioVal,
                    userLoan,
                });

                const useablePortfolioVal = availablePortfolioVal * 0.6;

                wallet.portfolioVals = {
                    totalPortfolioVal,
                    availablePortfolioVal,
                    useablePortfolioVal,
                };
                resolve(wallet);
            } catch (error) {
                error.source = "Get wallet Service";
                return reject(error);
            }
        });
    }

    creditWallet({ userId, currentBalance, amount }) {
        return new Promise(async(resolve, reject) => {
            try {
                await Wallet.findOneAndUpdate({ userId }, {
                    $set: {
                        balance: parseFloat(currentBalance) + parseFloat(amount),
                    },
                }, { new: true });

                resolve(true);
            } catch (error) {
                error.source = "Credit wallet ==> WalletService";
                reject(error);
            }
        });
    }
}

module.exports = WalletService;