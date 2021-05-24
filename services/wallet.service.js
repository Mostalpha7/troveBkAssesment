const { Wallet } = require("../models/index.shema");

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
                let wallet = await Wallet.findOne({ userId: userId })
                    .then((wallet) => (wallet ? wallet : false))
                    .catch(() => false);

                resolve(wallet);
            } catch (error) {
                error.source = "Get wallet Service";
                return reject(error);
            }
        });
    }
}

module.exports = WalletService;