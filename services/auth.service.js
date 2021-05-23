const bcrypt = require("bcrypt");
const ids = require("short-id");
const jwt = require("jsonwebtoken");

const { User } = require("../models/index.shema");
const WalletService = require("./wallet.service");
const { confirmPassword } = require("../utils/userUtils");

const walletInstance = new WalletService();

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
                const newUser = await new User(body).save();

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

                // check password
                const isPasswordMatch = await confirmPassword({
                    password: body.password,
                    user: user,
                });

                if (!isPasswordMatch) {
                    return reject({
                        code: 400,
                        msg: "Invalid password",
                    });
                }

                delete user.password;
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
}

module.exports = AuthService;