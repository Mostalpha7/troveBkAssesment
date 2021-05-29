// Developed by (mostalpha7@gmail.com)
require("dotenv").config();
if (process.env.envDateEntered == undefined) {
    console.log("Env variables is required for app to start");
    return;
}

const app = require("./startup/routes");
const http = require("http").createServer(app);
const db = require("./startup/db");

const port = process.env.PORT || 1000;

const startServer = async() => {
    const createDbConnection = await db();
    if (!createDbConnection) {
        console.log(`Error connection to mongodb databse.`);
        return;
    }
    http.listen(port, () => {
        console.log(`App is running on port ${port}`);
    });
};

startServer();