const bcrypt = require("bcrypt");
const ids = require("short-id");
const jwt = require("jsonwebtoken");
const Nexmo = require("nexmo");

const WalletService = require("./wallet.service");

const { User } = require("../models/index.shema");
const { formartPhoneNumber } = require("../utils/authUtils");

const walletInstance = new WalletService();
const nexmo = new Nexmo({
    apiKey: process.env.nexmoApiKey,
    apiSecret: process.env.nexmoApiSecretKey,
});

class AuthService {
    signUp(body) {
        return new Promise(async(resolve, reject) => {
            try {
                // check if user exists.
                let existingUser = await User.findOne({
                    $or: [{ email: body.email }, { phoneNumber: body.phoneNumber }],
                });

                if (existingUser) {
                    return reject({
                        code: 400,
                        msg: "Email or phone number already in use.",
                    });
                }

                // encrypt password
                const hashPassword = await bcrypt.hash(
                    body.password,
                    parseInt(process.env.bcryptSalt)
                );
                // generate Id
                const userId = ids.generate();

                body.password = hashPassword;
                body.userId = userId;

                // Save user to db
                const newUser = await new User(body).save({});

                if (!newUser) {
                    return reject({
                        code: 500,
                        msg: "Error occured, user was not created.",
                    });
                }

                const walletUser = {};
                walletUser.userId = newUser.userId;
                walletUser.email = newUser.email;

                const userWallet = await walletInstance.createWallet(walletUser);

                if (!userWallet) {
                    return reject({
                        code: 500,
                        msg: "Error occurred, could not create wallet.",
                    });
                }

                resolve(newUser);
            } catch (error) {
                error.source = "Sign Up Service";
                return reject(error);
            }
        });
    }

    signIn(body) {
        return new Promise(async(resolve, reject) => {
            try {
                const user = await User.findOne({ email: body.email })
                    .then((user) => (user ? user : false))
                    .catch(() => false);

                if (!user) {
                    return reject({
                        code: 400,
                        msg: "User not found",
                    });
                }

                const token = jwt.sign(user.toJSON(), process.env.jwtPrivateKey, {
                    expiresIn: "3d",
                });
                if (!token) {
                    return reject({
                        code: 500,
                        msg: "Could not sign user",
                    });
                }

                resolve({ user, token });
            } catch (error) {
                error.source = "Sign In Error";
                return reject(error);
            }
        });
    }

    create2FAuthCode(phoneNumber) {
        return new Promise(async(resolve, reject) => {
            try {
                const formarted = formartPhoneNumber(phoneNumber);

                nexmo.verify.request({
                        number: `${formarted}`,
                        brand: "TroveAssessment",
                        workflow_id: 6,
                        pin_expiry: 120,
                    },
                    (error, result) => {
                        console.log(result);
                        console.log(error);
                        if (result.status != 0) {
                            return reject({
                                code: 500,
                                msg: "Could not send OTP at the moment, please try again",
                            });
                        } else {
                            resolve(result.request_id);
                        }
                    }
                );
            } catch (error) {
                error.source = "Create 2F auth => AuthService";
                reject(error);
            }
        });
    }

    confirm2FAuthCode(body) {
        return new Promise(async(resolve, reject) => {
            try {
                nexmo.verify.check({
                        request_id: body.requestId,
                        code: body.code,
                    },
                    (error, result) => {
                        if (result.status != 0) {
                            return reject({
                                code: 400,
                                msg: "Could not validate code, please make a new request.",
                            });
                        } else {
                            resolve(true);
                        }
                    }
                );
            } catch (error) {
                error.source = "Confirm 2FAuth Request ==> AuthService";
                reject(error);
            }
        });
    }
    cancel2FAuthCode(requestId) {
        return new Promise(async(resolve, reject) => {
            try {
                nexmo.verify.check({
                        request_id: requestId,
                        code: "error",
                    },
                    (error, result) => {
                        console.log(result);
                        console.log(error);
                        resolve(true);
                    }
                );
            } catch (error) {
                error.source = "cancel2FAuthCode => AuthService";
                reject(error);
            }
        });
    }
}

module.exports = AuthService;