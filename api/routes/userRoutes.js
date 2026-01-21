const express = require('express');
const { registerUser, loginUser, getProfile, logoutUser, uploadLinkPhoto, uploadPhoto, addPlace, getPlaces, getSinglePlace, updatePlace, allPlaces, bookPlace, getBookings, deletePlace } = require('../controllers/UserController');
const { createPaymentIntent } = require('../controllers/PaymentController');
const { upload } = require('../config/cloudinary');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Luxereserve API Running')
})
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', getProfile)
router.get('/logout', logoutUser)
router.post('/uploads', uploadLinkPhoto)
router.post('/upload-files', upload.array('photos', 100), uploadPhoto)
router.post('/places', addPlace)
router.put('/places', updatePlace)
router.get('/places', getPlaces)
router.delete('/places/:id', deletePlace)
router.post('/places/id', getSinglePlace)
router.get('/allPlaces', allPlaces)
router.post('/bookings', bookPlace)
router.get('/bookings', getBookings)
router.post('/create-payment-intent', createPaymentIntent)


module.exports = router