const mongoose = require('mongoose');

const PlaceSchema=  mongoose.Schema({
    owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    address: String,
    photos: [String],
    description: String,
    price: Number,
    perks:[String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
});

module.exports = mongoose.model('Places', PlaceSchema);