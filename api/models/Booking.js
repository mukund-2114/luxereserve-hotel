const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
    place:{type: mongoose.Schema.Types.ObjectId, required: true, ref:'Places'},
    userId:{ type: String, required: true},
    checkIn:{ type: String, required: true},
    checkOut:{ type: String, required: true},
    numberOfGuests:{type: Number, required: true},
    fullName:{type: String, required: true},
    phone:{type: Number, required: true},
    price:{type: Number, required: true},
})

module.exports = mongoose.model('Booking',BookingSchema);