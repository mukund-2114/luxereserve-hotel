import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const CheckoutForm = ({ place, checkIn, checkOut, numberOfGuests, fullName, phone }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        const response = await axios.post('/pay', {
            payment_method_id: paymentMethod.id,    
            amount: place.price * numberOfGuests * (checkOut - checkIn), // adjust the amount as needed
            currency: 'CAD', // adjust the currency as needed
            description: 'Booking at ' + place.name,
            customer_name: fullName,
            customer_phone: phone,
            checkIn,
            checkOut,
            numberOfGuests
        });

        if (response.status === 200) {
            // Payment successful, handle accordingly
            alert('Payment successful!');
            setLoading(false);
        } else {
            setError('Failed to process payment');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>
                    Card details
                </label>
                <CardElement />
            </div>
            <button className="btn btn-primary" type="submit" disabled={!stripe || loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
    );
};

export default CheckoutForm;
