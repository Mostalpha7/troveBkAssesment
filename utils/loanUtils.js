// returns a boolean
const portfolioSufficiency = ({ portfolioBalance, amountRequested }) => {
    const calcPercent = 0.6 * portfolioBalance;

    if (calcPercent < amountRequested) {
        return false;
    }

    return true;
};

module.exports = {
    portfolioSufficiency,
};