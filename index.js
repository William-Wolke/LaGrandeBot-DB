//Import modules
import { FindDuplicateName, FindAll, FindName } from './components/read.js';
import { InsertOne } from './components/create.js';
import { createRequire } from 'module';
import { UpdateMoney, UpdateTransactions } from './components/update.js';
const require = createRequire(import.meta.url);
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

//Connect to Mongo db
mongoose.connect(process.env.url, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected'));

app.use(express.json)
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST']
}));

const grandeRouter = require('./routes/grande');
app.use('/grande');

    /*.then(client => {
        // Storing a reference to the database so you can use it later
        const db = client.db(process.env.dbName)
        const accountCollection = db.collection(process.env.accounts);
        const menuCollection = db.collection(process.env.menus);
        const keywordCollection = db.collection(process.env.keywords);
        console.log(`Connected MongoDB: ${process.env.url}`);
        console.log(`Database: ${process.env.dbName}`);*/