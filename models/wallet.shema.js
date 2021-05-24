const mongoose = require("mongoose");

const Wallet = new mongoose.Schema({
    userId: { type: String, required: true },
    balance: { type: Number, required: true },
    currency: { type: String, required: true },

    // portfolio is hard coded as this is just a test case
    portfolio: {
        type: Array,
        default: [{
                symbol: "AAPL",
                totalQuantity: 20,
                equityValue: 2500.0,
                pricePerShare: 125.0,
            },
            {
                symbol: "TSLA",
                totalQuantity: 5.0,
                equityValue: 3000.0,
                pricePerShare: 600.0,
            },
            {
                symbol: "AMZN",
                totalQuantity: 1.38461538,
                equityValue: 4500.0,
                pricePerShare: 150.0,
            },
        ],
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Wallet", Wallet);