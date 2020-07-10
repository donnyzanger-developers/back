var mongoose = require('mongoose');
const dotenv = require("dotenv").config();
const userModel = require('../models/userModel');

mongoose.connect(process.env.DB_HOST, {
    auth: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    useUnifiedTopology: true, 
    useNewUrlParser: true
});

var db = mongoose.connection

db.on('error', () => {
     console.error('Error occured in db connection');
});

db.on('open', () => {
    console.log('DB Connection established successfully');
});

async function main() {
    const users = await userModel.deleteMany({});
    const admin = await userModel.insertMany([
        {
            email: 'schillerj78@gmail.com', 
            paid: true, 
            admin: true
        }
    ]);

    console.log("seed complete")
    process.exit()
}

main() 


