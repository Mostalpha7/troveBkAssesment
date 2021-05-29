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
    loanPeriod: {
        type: Number,
        required: true,
    },
    loanObjective: {
        type: String,
        required: true,
    },
    totalAmountReturned: {
        type: Number,
        default: 0,
    },
    repaymentAmount: {
        type: Number,
        required: true,
    },
    // prorated payment schedule
    paymentSchedule: {
        type: Array,
        required: true,
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