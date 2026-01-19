const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    const { price } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price * 100, // Stripe expects amount in cents
            currency: 'cad',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createPaymentIntent };
