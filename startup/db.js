const mongoose = require("mongoose");

const uri = `mongodb+srv://${process.env.mongoDbUsername}:${process.env.mongoDbPassword}@cluster0.2wjb7.mongodb.net/trovelTest?retryWrites=true&w=majority`;
const url = `mongodb://localhost/trovelTest`;

module.exports = async() => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });

        let readyState = mongoose.connection.readyState;
        if (readyState !== 1) {
            console.log(
                `Mongoose connection failed with readystate code ${readyState}`
            );
            return false;
        }

        console.log(`Database connection established.`);
        return true;
    } catch (error) {
        console.log("akdsal");
        console.log(error);
        return false;
    }
};