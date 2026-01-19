const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const connectDatabase = require('./config/database');
const registerUser = require('./controllers/UserController');
const router = require('./routes/userRoutes');
const cookieParser = require('cookie-parser')

connectDatabase();
// app.use(cors({
//     credentials:true,
//     origin:'https://luxereserve-hotel.onrender.com',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],

// }));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'

}));

// app.options('/places', (req, res) => {
//     res.header('Access-Control-Allow-Origin', 'https://luxereserve-hotel.onrender.com');
//     res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.sendStatus(200);
//   });

app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(cookieParser())
app.use(express.json());

app.use(router)

// app.use(cors({
//     origin: 'https://luxereserve-hotel.onrender.com',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow PUT method
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   }));

app.listen(3000, (req, res) => {
    console.log('Server listening on port 3000')
})