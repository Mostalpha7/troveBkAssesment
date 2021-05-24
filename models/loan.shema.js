const mongoose = require("mongoose");

const LoanSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    loanAmount: {
        type: Number,
        required: true,
    },
    totalAmountReturned: {
        type: Number,
        default: 0,
    },
    paymentLog: {
        type: Array,
        default: [],
    },
    collateralPortfolioValue: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Loan", LoanSchema);