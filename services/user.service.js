const { User } = require("../models/index.shema");

const WalletService = require("./wallet.service");
const LoanService = require("./loan.service");

const walletInstance = new WalletService();
const loanInstance = new LoanService();

class UserService {
    getProfile(user) {
        return new Promise(async(resolve, reject) => {
            try {
                const toReturn = {
                    user: {},
                    wallet: {},
                    loans: [],
                    portfolioVals: {},
                };

                const userData = await User.findOne({ email: user.email })
                    .then((user) => (user ? user : false))
                    .catch(() => false);

                if (!userData) {
                    return reject({
                        code: 400,
                        msg: "User not found",
                    });
                }

                // get wallet
                const wallet = await walletInstance.getWallet(userData.userId);
                var userLoan = await loanInstance.getUserLoan(userData.userId);

                toReturn.user = userData;
                toReturn.wallet = wallet;
                toReturn.portfolioVals = wallet.portfolioVals;
                toReturn.loans = userLoan;

                delete toReturn.loans;
                resolve(toReturn);
            } catch (error) {
                error.source = "Get profile => UserService";
                return reject(error);
            }
        });
    }

    getOnlyUserData(email) {
        return new Promise(async(resolve, reject) => {
            try {
                const userData = await User.findOne({ email: email })
                    .then((user) => (user ? user : false))
                    .catch(() => false);

                if (!userData) {
                    return reject({
                        code: 400,
                        msg: "User not found",
                    });
                }
                resolve(userData);
            } catch (error) {
                error.source = "Get profile By Email => UserService";
                return reject(error);
            }
        });
    }

    updateBasicProfile(body, user) {
        return new Promise(async(resolve, reject) => {
            try {
                const updateBasicProfile = await User.findOneAndUpdate({ userId: user.userId }, {
                    $set: {
                        dob: new Date(body.dob),
                        bvn: body.bvn,
                        gender: body.gender,
                        city: body.city,
                        state: body.state,
                        address: body.address,
                        phoneNumber2: body.phoneNumber2,
                    },
                });
                resolve(updateBasicProfile);
            } catch (error) {
                error.source = "Update profile =>UserService";
                reject(error);
            }
        });
    }

    updateNokDetails(body, user) {
        return new Promise(async(resolve, reject) => {
            try {
                const updateNokDetails = await User.findOneAndUpdate({ userId: user.userId }, {
                    $set: {
                        nokFirstName: body.nokFirstName,
                        nokLastName: body.nokLastName,
                        nokPhoneNumber: body.nokPhoneNumber,
                        nokGender: body.nokGender,
                        nokAddress: body.nokAddress,
                        nokCity: body.nokCity,
                        nokState: body.nokState,
                    },
                });
                resolve(updateNokDetails);
            } catch (error) {
                error.source = "Update Nok => UserService";
                reject(error);
            }
        });
    }

    updateBankDetails(body, user) {
        return new Promise(async(resolve, reject) => {
            try {
                let updateBankDetails = await User.findOneAndUpdate({ userId: user.userId }, {
                    $set: {
                        accountNumber: body.accountNumber,
                        accountName: body.accountName,
                        bankName: body.bankName,
                        bankCode: body.bankCode,
                        bankDetailsEnterd: true,
                    },
                });

                resolve(updateBankDetails);
            } catch (error) {
                error.source = "Update bank details ==> UserService";
                reject(error);
            }
        });
    }

    updatePassword(body, user) {
        return new Promise(async(resolve, reject) => {
            try {
                let updatedPassword = await User.findOneAndUpdate({ userId: user.userId }, {
                    $set: {
                        password: body.password,
                    },
                });

                resolve(updatedPassword);
            } catch (error) {
                error.source = "Update password ==> UserService";
                reject(error);
            }
        });
    }
}

module.exports = UserService;