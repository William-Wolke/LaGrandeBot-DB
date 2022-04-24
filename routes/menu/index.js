const express = require('express');
const Menu = require('../../models/menu.js');
const router = express.Router();

// Getting all
router.get("/", async (req, res) => {
    try {
        let result = await Menu.find();
        if (result) {
            res.status(200).json(result);
        }
        else {
            res.status(500).json({message: "Något gick snett, bäst att skylla på William!:rage:"});
        }
    } catch (e) {
        console.log(e);
    }
});

//Creating one
router.post('/create', async (req, res) => {
    try {
        let name = req.body.name;
        console.log(req.body);
        console.log(name);
        if (name === undefined) return res.status(403).json({message: "Inget namn angavs"});
        let result = await Menu.findDuplicateName(name)
        console.log(result);
        if (result) {
            res.status(403).json({message: "Namnet finns redan."});
            return;
        }
        const menuItem = new Menu();
        menuItem.name = name;
        if (req.body.price) menuItem.price = req.body.price;
        if (req.body.currency) menuItem.currency = req.body.currency;
        if (req.body.emoji) menuItem.emoji = req.body.emoji;
        await menuItem.save();
        res.status(201).json({message: "Måltid skapad, hoppas det smakar!"});

    } catch (e) {
        console.log(e.message);
        res.status(500).json({message: "Williams fel"});
    }
});

module.exports = router;