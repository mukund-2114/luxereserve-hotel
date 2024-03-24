const express  = require('express');
const { registerUser, loginUser, getProfile, logoutUser, uploadLinkPhoto,addPlace,getPlaces,getSinglePlace,updatePlace,allPlaces, bookPlace,getBookings} = require('../controllers/UserController');
const router = express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser) 
router.get('/profile',getProfile)
router.get('/logout',logoutUser)
router.post('/uploads',uploadLinkPhoto)
router.post('/places',addPlace)
router.put('/places',updatePlace)
router.get('/places',getPlaces)
router.post('/places/id',getSinglePlace)
router.get('/allPlaces',allPlaces)
router.post('/bookings',bookPlace)
router.get('/bookings',getBookings)

module.exports = router