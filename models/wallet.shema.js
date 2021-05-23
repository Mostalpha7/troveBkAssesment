const mongoose = require("mongoose");

const Wallet = new mongoose.Schema({
    userId: { type: String, required: true },
    balance: { type: Number, required: true },
    currency: { type: String, required: true },

    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Wallet", Wallet);