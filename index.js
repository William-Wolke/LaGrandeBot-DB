//Import modules
require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const menu = require('./routes/menu');
const user = require('./routes/user');
const keyword = require('./routes/keyword');
const nft = require('./routes/nft');


const app = express();

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}

const dir = path.join(__dirname, 'public');

//Connect to Mongo db
mongoose.connect(process.env.url, options);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected'));

// app.use(express.json);
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST']
}));
//Serve static files
app.use('/statics', express.static(dir));
//Use other routers
app.use('/menu', menu);
app.use('/keyword', keyword);
app.use('/user', user);
app.use('/nft', nft);

app.listen(process.env.port, () => console.log(`Server Started on port ${process.env.port}`));