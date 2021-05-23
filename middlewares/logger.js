const chalk = require("chalk");

exports.loggerMiddleware = async(req, res, next) => {
    let currentDate = new Date();
    console.log(chalk.blue(`${req.method}:: ${req.path} -- ${currentDate}`));
    next();
};

exports.logError = async({ name, error }) => {
    let currentDate = new Date();

    console.log(chalk.redBright(`${name} -- ${error.source}`));
    console.log(chalk.red(`${error} -- ${currentDate}`));
};