const express = require('express');
const User = require('../../models/user.js');
const router = express.Router();

//Get leaderBoard
router.get("/", async (req, res) => {
    try {
        let userList = await User.find();
        res.status(200).json(userList);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({message: "Något gick snett, bäst att skylla på William!:rage:"});
    }
});

router.get("/leaderboard", async (req, res) => {
    try {
        let userList = await User.leaderBoard();
        res.status(200).json(userList);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({message: "Något gick snett, bäst att skylla på William!:rage:"});
    }
});

//Create person
router.post('/create', async (req, res) => {
    try {
        let name = req.body.name;
        let result = await User.findDuplicateName(name);
        if (result) return res.status(403).json({message: `Personen: ${name} finns redan :face_with_raised_eyebrow:`});
        let user = new User();
        user.name = name;
        await user.save();
        res.status(201).json({message: 'Person skapad'});

    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({message: "Något gick snett, bäst att skylla på William!:rage:"})
    }
});

//Updating one
router.post('/addMoney', async (req, res) => {
    try {
        let name = req.body.name;
        let amount = req.body.amount;
        let result = await User.addMoney(name, amount);
        if (result) return res.status(200).json({ message: `Pengar updaterade du har nu ${result} pengar`}); 
        throw new Error("Sorg");
    } catch (e) {
        return res.status(500).json({message: 'Pengarna uppdaterades inte.'});
    }
});

//Updating one
router.post('/subtractMoney', async (req, res) => {
    try {
        let name = req.body.name;
        let amount = req.body.amount;
        let result = await User.subtractMoney(name, amount);
        if (result.success) return res.status(200).json(result.message); 
        throw new Error(result.message);
    } catch (e) {
        return res.status(500).json({message: e.message || "Något gick fel"});
    }
});

router.post('/foodTransaction', async (req, res) => {
    try {
        let name = req.body.name;
        let amount = req.body.amount;
        let result = await User.newFoodTransaction(name, amount);
        if (result.success) return res.status(200).json({message: result.message || "Något gick fel"});
        throw new Error(result.message);
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({message: e.message});
    }
});

module.exports = router;