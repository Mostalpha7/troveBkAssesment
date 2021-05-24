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

const estimateUseAblePortfolioVal = ({ totalPortfolioVal, userLoan }) => {
    const useAblePortfolioVal = totalPortfolioVal;

    userLoan.forEach((item) => {
        let collateralPortfolioValue = item.collateralPortfolioValue;
        useAblePortfolioVal -= parseFloat(collateralPortfolioValue);
    });
    return useAblePortfolioVal;
};

module.exports = {
    calcPortfolioVal,
    estimateUseAblePortfolioVal,
};