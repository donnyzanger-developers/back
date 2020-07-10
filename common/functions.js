
const {OAuth2Client} = require('google-auth-library');
const userModel = require('../models/userModel');
const imagesToPdf = require("images-to-pdf");
const PDF2Pic = require("pdf2pic");
const fs = require('fs');

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
    }, 


    imageToPdf: async function(file) {
        fs.writeFileSync(`./users/1/files/${file.originalname}`, file.buffer, 'binary');
        
        const res = await imagesToPdf([`users/1/files/${file.originalname}`], "users/1/files/pdf2jpg2pdf.pdf");

        return res;
    }, 

    pdfToImage: async function(file) {
        var res = {}
        try {
            fs.writeFileSync(`./users/1/files/${file.originalname}`, file.buffer, 'binary'); // write jpg to disk with this filename
            const pdf2pic = new PDF2Pic({
                // density: 100, // output pixels per inch
                savename: "pdf2jpg2pdf", // output file name
                savedir: "./users/1/files", // output file location
                format: "jpeg", 
                // size: "600x600" // output size in pixels
            });
            res = await pdf2pic.convert(`./users/1/files/${file.originalname}`) // jpg to convert
        } catch (err) {
            console.log(err);
        }

        return res;
    }

}