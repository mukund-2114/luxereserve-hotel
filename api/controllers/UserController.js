const User = require("../models/User");
const Booking = require("../models/Booking");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
require('dotenv').config()
const imagedownload = require('image-downloader');
const Place = require("../models/Place");
const path = require('path');


const registerUser = async (req, res) => {

    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(404).json({ message: "All fields are mandatory" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(404).json({ message: "User already registered" })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name, email, password: hashPassword
        })
        return res.status(201).json(user)
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error Please try again later" })
    }

}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(404).json({ message: "All fields are mandatory" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "15minutes" })
            res.cookie('token', token)
            res.status(200).json(user)
        }
        else {
            return res.status(404).json({ message: "Invalid username or password" })
        }
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error Please try again later" })
    }
}

const getProfile = (req, res) => {

    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {

            res.json(user);
        })

    }
    else {
        res.json(null);
    }
    // res.send({"Authenciated":true,data:req.user})
    // res.json(user)
}
const logoutUser = (req, res) => {
    res.clearCookie('token');

    res.status(200).json({ message: "hello" });
}

const uploadLinkPhoto = async (req, res) => {
    // console.log("------------",path.join(__dirname,"../uploads"))
    const { link } = req.body;
    const newName = Date.now() + '.jpg';
    const dest = path.join(__dirname,"../uploads/") + newName;
 
    await imagedownload.image({
        url: link,
        dest: dest,
    })
    res.status(200).json({ newName });
}

const addPlace = async (req, res) => {
    const { title, address, addedPhotos, price, description, perks, extraInfo, checkIn, checkOut, maxGuests } = req.body;
    const { token } = req.cookies;
    let user;

    jwt.verify(token, process.env.JWT_SECRET, {}, (err, currentUser) => {
        // console.log(user.id)
        if (err) throw err;
        user = currentUser
    })

    const placeData = await Place.create({
        owner: user.id,
        title, address, photos: addedPhotos, price, description, perks, extraInfo, checkIn, checkOut, maxGuests
    })

    return res.status(201).json({ placeData })

}

const getPlaces = async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, currentUser) => {
        // console.log(user.id)
        if (err) throw err;
        res.json(await Place.find({ owner: currentUser.id }))
    })

}
const getSinglePlace = async (req, res) => {
    const { id } = req.body;
    res.json(await Place.find({ _id: id }))
}

const updatePlace = async (req, res) => {
    const { id, title, address, addedPhotos, description, price, perks, extraInfo, checkIn, checkOut, maxGuests } = req.body;
    // const { token } = req.cookies;
    // console.log("debugging")

    const placeDoc = await Place.findById(id);
    // console.log(placeDoc)
    placeDoc.set({
        title, address, photos: addedPhotos, price, description, perks, extraInfo, checkIn, checkOut, maxGuests
    })
    const result = await placeDoc.save();
    // console.log(result)
    if(result){
        res.status(200).json({"message": "Place updated successfully"})
    }
    else{
        res.status(200).json({"message": "Error updating place"})
    }
    // jwt.verify(token, process.env.JWT_SECRET, {}, async (err, currentUser) => {
    //     if (err) throw err;
    //     if (currentUser.id === placeDoc.owner.toString()) {
            
    //         res.status(201).json('ok')

    //     }
    // })

}

const allPlaces = async (req, res) => {
    res.json(await Place.find())
}

const bookPlace = async (req, res) => {
    const { place, checkIn, checkOut, numberOfGuests, fullName, phone, price } = req.body;
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, currentUser) => {
        if (err) {
            return res.json('Please Login')
        }
        const bookingDoc = await Booking.create({
            place, userId: currentUser.id, checkIn, checkOut, numberOfGuests, fullName, phone, price
        })
        return res.status(201).json({ bookingDoc })
    })

}

const getBookings = async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, currentUser) => {
        // console.log(user.id)
        if (err) throw err;
        const bookings = await Booking.find({ userId: currentUser.id }).populate('place')


        // const instance = new Razorpay({
        //     key_id: 'rzp_test_cfkXColkzW1ZN9',
        //     key_secret: 'rzp_test_cfkXColkzW1ZN9'
        // });


        res.json(bookings)
    })
}

module.exports = { registerUser, loginUser, getProfile, logoutUser, uploadLinkPhoto, addPlace, getPlaces, getSinglePlace, updatePlace, allPlaces, bookPlace, getBookings };
