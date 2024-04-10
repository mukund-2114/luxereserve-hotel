const express = require('express');
const app = express();
const cors  = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const connectDatabase = require('./config/database');
const registerUser = require('./controllers/UserController');
const router = require('./routes/userRoutes');
const cookieParser  = require('cookie-parser')

connectDatabase();
app.use(cors({
    credentials:true,
    origin:'https://luxereserve-hotel.onrender.com'

}));
app.use('/uploads', express.static(__dirname+'/uploads'));

app.use(cookieParser())
app.use(express.json());

app.use(router)

app.listen(3000, (req, res) => {
    console.log('Server listening on port 3000')
})