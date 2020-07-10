
const {OAuth2Client} = require('google-auth-library');
const functions = require('../common/functions');

require('dotenv').config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

module.exports = {
    
    verify: async function(req, res, next) {
        const googleToken = req.header('Authorization');
        const ticket = await googleClient.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const email = payload['email'];
        if (email) {
            next()
        } else {
            return res.status(401).json({
                status: 401,
                error: 'Invalid token',
                result: ''
            });
        }
    }, 

    user_admin: async function(req, res, next) {
        const googleToken = req.header('Authorization');
        const email = await functions.verify(googleToken);
        const user = await functions.user(email);
        if (user && user.admin)
            next();
        else
            res.status(400).send(false);
    }

}