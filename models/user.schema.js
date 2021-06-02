const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    // Basic
    userId: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, default: "user" },

    // kyc
    dob: { type: Date },
    gender: { type: String },
    city: { type: String },
    state: { type: String },
    address: { type: String },
    phoneNumber2: { type: String },

    // bank Info
    // bvn: { type: String },
    accountNumber: { type: String },
    accountName: { type: String },
    bankName: { type: String },
    bankCode: { type: String },
    bankDetailsEnterd: { type: Boolean, default: false },

    // Nok
    nokFirstName: { type: String },
    nokLastName: { type: String },
    nokPhoneNumber: { type: String },
    nokGender: { type: String },
    nokCity: { type: String },
    nokState: { type: String },
    nokAddress: { type: String },

    // Security
    otp: { type: String },
    otpExpiry: { type: Date },

    regDate: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model("User", UserSchema);