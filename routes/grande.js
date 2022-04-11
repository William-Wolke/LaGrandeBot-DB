const express = require('express');
const router = express.Router();

//Getting all
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

//Creating one
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

//Updating one
app.patch('/updateMoney', (req, res) => {
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

app.patch('/foodTransaction', (req, res) => {
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

module.exports = router 