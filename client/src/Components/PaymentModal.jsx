import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Replace with your actual publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Return URL where the customer should be redirected after the payment
                    return_url: window.location.origin + '/account/bookings',
                },
                redirect: "if_required",
            });

            if (error) {
                console.error("Stripe Error:", error);
                setMessage(error.message);
                setIsLoading(false);
                if (onError) onError(error.message);
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                setMessage("Payment successful!");
                setIsLoading(false);
                onSuccess();
            } else {
                console.warn("Unexpected Stripe state:", paymentIntent);
                setMessage("Unexpected state. Please try again.");
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Stripe Exception:", err);
            setMessage("An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <PaymentElement />
            <button
                disabled={isLoading || !stripe || !elements}
                className="bg-primary text-white w-full rounded-full py-2 mt-4 disabled:opacity-50"
            >
                {isLoading ? "Processing..." : "Pay Now"}
            </button>
            {message && <div className="text-red-500 mt-2 text-sm">{message}</div>}
        </form>
    );
};

const PaymentModal = ({ price, onClose, onSuccess }) => {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        axios.post("/create-payment-intent", { price })
            .then((res) => setClientSecret(res.data.clientSecret))
            .catch((err) => console.error("Error creating payment intent", err));
    }, [price]);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl max-w-md w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
                <p className="mb-4 text-gray-600">Total: ${price} CAD</p>

                {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm onSuccess={onSuccess} />
                    </Elements>
                )}
                {!clientSecret && <p>Loading payment details...</p>}
            </div>
        </div>
    );
};

export default PaymentModal;
