//Import modules
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const url = 'mongodb://127.0.0.1:27017'
const app = express();
const dbName = 'LaGrande';
const port = 8000;

//Connect to Mongo db
MongoClient.connect(url, { useNewUrlParser: true })
    .then(client => {
        // Storing a reference to the database so you can use it later
        const db = client.db(dbName)
        const accountCollection = db.collection('Accounts');
        const menuCollection = db.collection('Menu');
        const keywordCollection = db.collection('Keywords');
        console.log(`Connected MongoDB: ${url}`);
        console.log(`Database: ${dbName}`);

        //Body parser
        app.use(bodyParser.urlencoded({ extended: true}));
        app.use(cors({
            origin: "*",
            methods: ['GET', 'POST']
        }))

        //Handlers

        //Listen
        app.listen(port, () => {
            console.log('listening on ' + port);
        });
        //Get menu
        app.get("/menu", (req, res) => {
            menuCollection.find({}).toArray()
            .then((menu) => {
                res.send(menu).status(200);
            })
        });
        //Get menu
        app.get("/leaderboard", (req, res) => {
            accountCollection.find({}).toArray()
            .then((list) => {
                res.send(list).status(200);
            })
        });
         //Get menu
         app.get("/keywords", (req, res) => {
            keywordCollection.find({}).toArray()
            .then((list) => {
                res.send(list).status(200);
            })
        });
        //Create Menu item
        app.post('/createMenuItem', (req, res) => {
            let name = req.body.name;
            console.log(req.body);
            menuCollection.find({"name": name}).toArray()
            .then(result => {
                //Result == false if array is empty
                if (result == false) {
                    menuCollection.insertOne(req.body)
                        .then(result => {
                            console.log("Menuitem created");
                            //Send respons to browser
                            res.status(200);
                        })
                        .catch(error => console.error(error))
                }
                //Array is not empty
                else {
                    console.log("Menu item already exist");
                    res.status(403);
                }
            })
            .catch(error => console.error(error));
        });
        //Create person
        app.post('/createPerson', (req, res) => {
            let name = req.body.name;
            console.log(req.body);
            accountCollection.find({"name": name}).toArray()
            .then(result => {
                //Result == false if array is empty
                if (result == false) {
                    accountCollection.insertOne(req.body)
                        .then(result => {
                            console.log("Person created");
                            //Send respons to browser
                            res.status(200);
                        })
                        .catch(error => console.error(error))
                }
                //Array is not empty
                else {
                    console.log("Person already exist");
                    res.status(403);
                }
            })
            .catch(error => console.error(error));
        });
        //Create keyword
        app.post('/createKeyword', (req, res) => {
            let keyword = req.body.keyword;
            console.log(req.body);
            keywordCollection.find({"keyword": keyword}).toArray()
            .then(result => {
                //Result == false if array is empty
                if (result == false) {
                    keywordCollection.insertOne(req.body)
                        .then(result => {
                            console.log("keyword created");
                            //Send respons to browser
                            res.status(200);
                        })
                        .catch(error => console.error(error))
                }
                //Array is not empty
                else {
                    console.log("Keyword already exist");
                    res.status(403);
                }
            })
            .catch(error => console.error(error));
        });
        //Login user
        app.post('/login', (req, res) => {
            let name = req.body.name;
            let pass = req.body.pass;

            userCollection.find({ "name": name }).toArray()
                //Promise
                .then(result => {
                    //Check if pass is correct
                    if (result[0].pass === pass) {
                        console.log("Inloggad");
                        //Send respons to browser
                        res.redirect('/')
                    }
                    //Pass is incorrect
                    else {
                        console.log("Fel användarnamn eller lösenord");
                        //Send respons to browser
                        res.redirect('/');
                    }
                })
                .catch(error => console.error(error));
        });
        //Update user password
        app.post('/update', (req, res) => {
            let name = req.body.name;
            let oldPass = req.body.oldPass;
            let newPass = req.body.newPass;
            //Get this user from the db
            userCollection.find({ "name": name }).toArray()
                //Promise
                .then(result => {
                    //Check if pass is correct
                    if (result[0].pass == oldPass) {
                        console.log("Correct credentials")
                        updateUserPass(result[0].name, newPass);
                        //Send respons to browser
                        res.redirect('/')
                    }
                    //Pass is incorrect
                    else {
                        console.log("Incorrect password or username")
                        //Send respons to browser
                        res.redirect('/')
                    }
                })
                .catch(error => console.error(error))
        });
        //Delete user
        app.post('/delete', (req, res) => {
            let name = req.body.name;
            let pass = req.body.pass;
            userCollection.find({ "name": name }).toArray()

                .then(result => {
                    //Check if pass is correct
                    if (result[0].pass == pass) {
                        console.log("Correct credentials")
                        deleteUser(name);
                        //Send respons to browser
                        res.redirect('/')
                    }
                    //Pass is incorrect
                    else {
                        console.log("Incorrect password or username")
                        //Send respons to browser
                        res.redirect('/')
                    }
                })
                .catch(error => console.error(error))
        });
        //Update user pass after checking password
        app.put(updateUserPass = (name, newPass) => {
            userCollection.updateOne({ "name": name }, { $set: { pass: newPass } })
            .then(result => {
                console.log("Password changed")
            })
            .catch(error => console.error(error));
        });
        //Delete user after checking password
        app.delete(deleteUser = (name) => {
            db.collection('Users').deleteOne({ "name": name })
            .then(result => {
                console.log("User deleted")
            })
            .catch(error => console.error(error));
        });
    })
    .catch(error => console.error(error))