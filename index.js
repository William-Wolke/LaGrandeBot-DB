//Import modules
import { FindDuplicateName, FindAll, FindName } from './components/read.js';
import { InsertOne } from './components/create.js';
import { createRequire } from 'module';
import { UpdateMoney, UpdateTransactions } from './components/update.js';
const require = createRequire(import.meta.url);
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config();
const app = express();

//Connect to Mongo db
MongoClient.connect(process.env.url, { useNewUrlParser: true })
    .then(client => {
        // Storing a reference to the database so you can use it later
        const db = client.db(process.env.dbName)
        const accountCollection = db.collection(process.env.accounts);
        const menuCollection = db.collection(process.env.menus);
        const keywordCollection = db.collection(process.env.keywords);
        console.log(`Connected MongoDB: ${process.env.url}`);
        console.log(`Database: ${process.env.dbName}`);

        //Body parser
        app.use(bodyParser.urlencoded({ extended: true}));
        app.use(cors({
            origin: "*",
            methods: ['GET', 'POST']
        }))

        //Handlers

        //Listen
        app.listen(process.env.port, () => {
            console.log('listening on ' + process.env.port);
        });

        //Get menu
        app.get("/menu", (req, res) => {
            FindAll(menuCollection)
            .then((result) => {
                if (result) {
                    res.status(200).send(result);
                }
                else {
                    res.status(500).send({message: "Något gick snett, bäst att skylla på William!:rage:"});
                }
            });
        });
        //Get leaderBoard
        app.get("/leaderboard", (req, res) => {
            FindAll(accountCollection)
            .then((result) => {
                if (result) {
                    res.status(200).send(result);
                }
                else {
                    res.status(500).send({message: "Något gick snett, bäst att skylla på William!:rage:"});
                }
            });
        });
         //Get keywords
         app.get("/keywords", (req, res) => {
            FindAll(keywordCollection)
            .then((result) => {
                if (result) {
                    res.status(200).send(result);
                }
                else {
                    res.status(500).send({message: "Något gick snett, bäst att skylla på William!:rage:"});
                }
            });
        });

        app.post('/updateMoney', (req, res) => {
            let name = req.body.name;
            let money = req.body.money;
            FindName(accountCollection, name)
            .then((result) => {
                if (result.success) {
                    if (!result.person) return false;
                    else {
                        UpdateMoney(accountCollection, name, money)
                        .then((result) => {
                            if (result) {
                                res.status(200).send({message: "Pengar uppdaterade"});
                            }
                            else {
                                res.status(500).send({message: "Något gick snett, bäst att skylla på William!:rage:"});
                            }
                        });
                    }
                }
                else {
                    res.status(403).send({message: 'Pengarna uppdaterades inte.'});
                }
            });
        });

        app.post('/foodTransaction', (req, res) => {
            let name = req.body.name;
            let money = req.body.money;
            FindName(accountCollection, name)
            .then((result) => {
                if (result.success) {
                    UpdateTransactions(accountCollection, name, money)
                    .then((result) => {
                        if (result) {
                            res.status(200).send({message: "Transaktionen gick igenom"}); 
                        }
                        else {
                            res.status(403).send({message: "Ingen transaktion gick igenom"});
                        }
                    });

                }
                else {
                    res.status(403).send({message: 'Transaktionen uppdaterades inte.'});
                }
            });
        });
        //Create Menu item
        app.post('/createMenuItem', (req, res) => {
            let name = req.body.name;

            FindDuplicateName(menuCollection, name)
            .then((result) => {
                if (result) {
                    console.log("Menu item already exist");
                    res.status(403).send({message: `Meny föremålet med namn ${name} existerar redan`});
                }
                else {
                    InsertOne(menuCollection, req.body)
                    .then((result) => {
                        if (result) {
                            console.log("Menuitem created");
                            res.status(200).send({message: `Måltid skapad, hoppas det smakar!`});
                        }
                        else {
                            res.status(500).send({message: "Morr, vad har William gjort nu!:rage:"});
                        }
                    });
                }
            })
            .catch(error => console.error(error));
        });
        //Create person
        app.post('/createPerson', (req, res) => {
            let name = req.body.name;

            FindDuplicateName(accountCollection, name)
            .then((result) => {
                if (result) {
                    console.log("Person already exist");
                    res.status(403).send({message: `Personen: ${name} finns redan :face_with_raised_eyebrow:`});
                }
                else {
                    InsertOne(accountCollection, req.body)
                    .then((result) => {
                        if (result) {
                            console.log("Person created");
                            res.status(200).send({message: 'Person skapad'});
                        }
                        else {
                            res.status(500).send({message: "Morr, vad har William gjort nu!:rage:"});
                        }
                    });
                }
            })
            .catch(error => console.error(error));
        });
        //Create keyword
        app.post('/createKeyword', (req, res) => {
            let name = req.body.keyword;

            FindDuplicateName(keywordCollection, name)
            .then((result) => {
                if (result) {
                    console.log("Keyword already exist");
                    res.status(403).send({message: `Nyckelordet ${name} finns redan`});
                }
                else {
                    InsertOne(keywordCollection, req.body)
                    .then((result) => {
                        if (result) {
                            console.log("keyword created");
                            res.status(200).send({message: 'Nyckelord skapat'});
                        }
                        else {
                            res.status(500).send({message: "Morr, vad har William gjort nu!:rage:"});
                        }
                    });
                }
            })
            .catch(error => console.error(error));
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
        // app.put(updateUserPass = (name, newPass) => {
        //     userCollection.updateOne({ "name": name }, { $set: { pass: newPass } })
        //     .then(result => {
        //         console.log("Password changed")
        //     })
        //     .catch(error => console.error(error));
        // });
        //Delete user after checking password
        // app.delete(deleteUser = (name) => {
        //     db.collection('Users').deleteOne({ "name": name })
        //     .then(result => {
        //         console.log("User deleted")
        //     })
        //     .catch(error => console.error(error));
        // });
    })
    .catch(error => console.error(error))