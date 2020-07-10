var express = require('express');
var router = express.Router();
const userRoutes = require('./userRoutes');
const functions = require('../common/functions');
const {OAuth2Client} = require('google-auth-library');
const checks = require('../middleware/checks');

require('dotenv').config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/config', async (req, res) => {
    const price = await stripe.prices.retrieve(process.env.PRICE);
    res.send({
      publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
      unitAmount: price.unit_amount,
      currency: price.currency,
    });
});

async function verify(token) {
    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload['email'];

    return email;
}

router.get('/content', async (req, res) => {
    var googleToken = req.header('Authorization');
    const email = await verify(googleToken)
    const user = await functions.user(email);
    if (user && user.paid)
        res.status(200).send('secret content');
    else
        res.status(400).send('not paid')
});

// Fetch the Checkout Session to display the JSON result on the success page
router.get('/checkout-session', async (req, res) => {
    const { sessionId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.send(session);
});
  
router.post('/create-checkout-session', async (req, res) => {
    const domainURL = process.env.DOMAIN;
    const { quantity, locale } = req.body;
    // Create new Checkout Session for the order
    // Other optional params include:
    // [billing_address_collection] - to display billing address details on the page
    // [customer] - if you have an existing Stripe Customer ID
    // [customer_email] - lets you prefill the email input in the Checkout page
    // For full details see https://stripe.com/docs/api/checkout/sessions/create
    const session = await stripe.checkout.sessions.create({
        payment_method_types: process.env.PAYMENT_METHODS.split(', '),
        mode: 'payment',
        locale: locale,
        line_items: [
            {
                price: process.env.PRICE,
                quantity: quantity
            },
        ],
        // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
        success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domainURL}/canceled.html`,
    });

    res.send({
        sessionId: session.id,
    });
});

router.post('/image_to_pdf', async (req, res) => {
    try {
        if (req.files.length > 0 && (req.files[0].originalname.endsWith('.jpg') || req.files[0].originalname.endsWith('.jpeg'))) {
            await functions.imageToPdf(req.files[0])
            await res.download('./users/1/files/pdf2jpg2pdf.pdf')
        } else {
            res.status(400).send()
        }
    } catch(err) {
        res.status(500).send()
    } 
});

router.post('/pdf_to_image', async (req, res) => {
    try {
        if (req.files.length > 0  && (req.files[0].originalname.endsWith('.pdf'))) {
            await functions.pdfToImage(req.files[0])
            await res.download('./users/1/files/pdf2jpg2pdf_1.jpeg')
        } else {
            res.status(400).send()
        }
    } catch(err) {
        res.status(500).send()
    }
});

router.post('/paid', async (req, res) => {
    var googleToken = req.header('Authorization');
    const email = await functions.verify(googleToken)
    if (email) {
        const user = functions.set_paid_true(email);
    }

    return
});

router.post('/tokensignin', async (req, res) => {
    const token = req.body.idtoken;
    try {
        const email = await functions.verify(token)
        const user = await functions.find_or_create_user(email);
        res.status(200).send(user.email);
    } catch(error) {
        console.log(error)
        res.status(400).send(error)
    };
});

router.get('user_paid', async (req, res) => { // not using put / in front if using
    const googleToken = req.header('Authorization');
    const email = await functions.verify(googleToken);
    const user = await functions.user(email);

    res.status(200).send(user.paid)
});

router.get('/user_admin', async (req, res) => {
    const googleToken = req.header('Authorization');
    const email = await functions.verify(googleToken);
    const user = await functions.user(email);
    if (user && user.admin)
        res.status(200).send(true);
    else
        res.status(400).send(false);
});
  
router.post('/webhook', async (req, res) => {
    let data;
    let eventType;
   
    if (process.env.STRIPE_WEBHOOK_SECRET) {
        let event;
        let signature = req.headers['stripe-signature'];

        try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
        }
        data = event.data;
        eventType = event.type;
    } else {
        data = req.body.data;
        eventType = req.body.type;
    }

    if (eventType === 'checkout.session.completed') {
        console.log(`🔔  Payment received!`);
    }

    res.sendStatus(200);
});

router.use('/admin/users', checks.user_admin, userRoutes);
// router.use('/users', checks.verify, userRoutes);

module.exports = router;
