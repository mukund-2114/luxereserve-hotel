const User = require("../models/User");
const Booking = require("../models/Booking");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
require('dotenv').config()
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
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds since Unix epoch
            const expirationTime = currentTime + (15 * 60);
            const token = jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: expirationTime })
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            })

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
    res.cookie('token', null)
    res.status(200).json({ message: "Logged out successfully" });
}

const { cloudinary } = require('../config/cloudinary');

const uploadLinkPhoto = async (req, res) => {
    const { link } = req.body;
    try {
        const result = await cloudinary.uploader.upload(link, {
            folder: 'luxereserve',
        });
        res.status(200).json({ newName: result.secure_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading from link" });
    }
}

const uploadPhoto = (req, res) => {
    const uploadedFiles = [];
    if (req.files) {
        req.files.forEach(file => {
            uploadedFiles.push(file.path);
        });
    }
    res.json(uploadedFiles);
}

const addPlace = async (req, res) => {
    try {
        const { title, address, addedPhotos, price, description, perks, extraInfo, checkIn, checkOut, maxGuests } = req.body;
        const { token } = req.cookies;
        let user;

        jwt.verify(token, process.env.JWT_SECRET, {}, (err, currentUser) => {
            if (err) throw err;
            user = currentUser
        })

        // Validation
        if (!title || !address || !price || !checkIn || !checkOut || !maxGuests) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        if (isNaN(price) || isNaN(maxGuests)) {
            return res.status(400).json({ message: "Price and Max Guests must be numbers" });
        }

        const placeData = await Place.create({
            owner: user.id,
            title, address, photos: addedPhotos, price, description, perks, extraInfo, checkIn, checkOut, maxGuests
        })

        return res.status(201).json({ placeData })
    } catch (err) {
        console.error("Error in addPlace:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
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
    try {
        const { id, title, address, addedPhotos, description, price, perks, extraInfo, checkIn, checkOut, maxGuests } = req.body;

        const placeDoc = await Place.findById(id);

        // Validation
        if (!title || !address || !price || !checkIn || !checkOut || !maxGuests) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        if (isNaN(price) || isNaN(maxGuests)) {
            return res.status(400).json({ message: "Price and Max Guests must be numbers" });
        }

        placeDoc.set({
            title, address, photos: addedPhotos, price, description, perks, extraInfo, checkIn, checkOut, maxGuests
        })
        const result = await placeDoc.save();
        if (result) {
            res.status(200).json({ "message": "Place updated successfully" })
        }
        else {
            res.status(200).json({ "message": "Error updating place" })
        }
    } catch (err) {
        console.error("Error in updatePlace:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const allPlaces = async (req, res) => {
    res.json(await Place.find())
}

const bookPlace = async (req, res) => {
    try {
        const { place, checkIn, checkOut, numberOfGuests, fullName, phone, price } = req.body;
        const { token } = req.cookies;
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, currentUser) => {
            if (err) throw err;
            try {
                const bookingDoc = await Booking.create({
                    place, userId: currentUser.id, checkIn, checkOut, numberOfGuests, fullName, phone, price
                })
                return res.status(201).json({ bookingDoc })
            } catch (err) {
                return res.status(500).json({ message: "Booking failed" })
            }
        })
    } catch (err) {
        console.error("Error in bookPlace:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
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

const deletePlace = async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, currentUser) => {
        if (err) throw err;
        try {
            const place = await Place.findOne({ _id: id, owner: currentUser.id });
            if (!place) {
                return res.status(404).json({ message: "Place not found or unauthorized" });
            }

            if (place.photos && place.photos.length > 0) {
                const deletePromises = place.photos.map(async (photoUrl) => {
                    if (photoUrl.includes('cloudinary.com')) {
                        // Extract public ID: matches everything after 'upload/' (plus optional version) up to the file extension
                        const matches = photoUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
                        if (matches && matches[1]) {
                            const publicId = matches[1];
                            await cloudinary.uploader.destroy(publicId);
                        }
                    }
                });
                await Promise.all(deletePromises);
            }

            await Place.deleteOne({ _id: id, owner: currentUser.id });
            res.status(200).json({ message: "Place and images deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting place" });
        }
    })
}

module.exports = { registerUser, loginUser, getProfile, logoutUser, uploadLinkPhoto, uploadPhoto, addPlace, getPlaces, getSinglePlace, updatePlace, allPlaces, bookPlace, getBookings, deletePlace };
