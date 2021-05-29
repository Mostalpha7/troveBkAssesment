const calcPortfolioVal = ({ wallet }) => {
    const portfolio = wallet.portfolio;
    var totalSum = 0;

    portfolio.forEach((item) => {
        let pricePerShare = item.pricePerShare;
        let totalQuantity = item.totalQuantity;
        let totalValue = parseFloat(pricePerShare) * parseFloat(totalQuantity);
        totalSum += totalValue;
    });
    return totalSum;
};

const estimateAvailablePortfolioVal = ({ totalPortfolioVal, userLoan }) => {
    var useablePortfolioVal = totalPortfolioVal;

    userLoan.forEach((item) => {
        let collateralPortfolioValue = item.collateralPortfolioValue;
        useablePortfolioVal -= parseFloat(collateralPortfolioValue);
    });

    return useablePortfolioVal;
};

module.exports = {
    calcPortfolioVal,
    estimateAvailablePortfolioVal,
};