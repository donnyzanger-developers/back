
const {OAuth2Client} = require('google-auth-library');
const userModel = require('../models/userModel');

require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

module.exports = {

    verify: async function(token) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const email = payload['email'];

        return email;
    }, 

    find_or_create_user: async function(email) {
        const user = await userModel.findOne({email: email})
        if (user) {
            return user
        } else {
            let newuser = new userModel();
            newuser.email = email;
            
            return newuser.save();
        }
    }, 

    set_paid_true: async function(email) {
        const user = userModel.findOneAndUpdate({email: email}, {paid: true})

        return user;
    }, 

    user: async function(email) {
        const user = userModel.findOne({email: email});

        return user;
    }

}