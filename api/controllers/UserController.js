const User = require("../models/User");
const Booking = require("../models/Booking");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
require('dotenv').config()
const imagedownload = require('image-downloader');
const Place = require("../models/Place");


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
            const token = jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "10seconds" })
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
    try {
        if (!token) {
            throw new Error('NoTokenProvided');
        }
        const user = verifyToken(token);
        res.json(user);
    } catch (error) {
        if (error.message === 'TokenExpiredError') {
            res.status(401).json({ message: 'Session Expired. Please log in again.' });
        } else if (error.message === 'NoTokenProvided') {
            res.status(401).json({ message: 'No token provided. Please log in.' });
        } else {
            res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
        }
    }
};


const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('TokenExpiredError');
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('token');

    res.status(200).json({ message: "hello" });
}

const uploadLinkPhoto = async (req, res) => {

    const { link } = req.body;
    const newName = Date.now() + '.jpg';
    const dest = 'C:/Users/mdrkk/OneDrive/Desktop/airbnbreact/api/uploads/' + newName;
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

    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET);
        const places = await Place.find({ owner: currentUser.id });
        res.json(places);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // Handle JWT expiration error
            res.status(401).json({ message: 'Session expired. Please log in again.' });
        } else {
            // Handle other JWT verification errors or internal server errors
            console.error('JWT verification error:', error.message);
            res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
        }
    }
};

const getSinglePlace = async (req, res) => {
    const { id } = req.body;
    res.json(await Place.find({ _id: id }))
}

const updatePlace = async (req, res) => {
    const { id, title, address, addedPhotos, description, price, perks, extraInfo, checkIn, checkOut, maxGuests } = req.body;
    const { token } = req.cookies;


    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, currentUser) => {
        const placeDoc = await Place.findById(id);
        if (err) throw err;
        if (currentUser.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, photos: addedPhotos, price, description, perks, extraInfo, checkIn, checkOut, maxGuests
            })
            await placeDoc.save()
            res.status(201).json({message:"Place Updated successfully"})

        }
    })

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
