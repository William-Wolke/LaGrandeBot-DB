const Keyword = require('../../models/keyword.js');
const express = require('express');
const router = express.Router();

//Get keywords
router.get("/", async (req, res) => {
    try {
        let result = await Keyword.find();
        if (result) {
            res.status(200).json(result);
        }
        else {
            res.status(500).json({message: "Något gick snett, bäst att skylla på William!:rage:"});
        }
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({message: e.message});
    }
});

//Create keyword
router.post('/create', async (req, res) => {
    try {
        let name = req.body.keyword;
        if (name === undefined) return res.status(403).json({message: "Inget namn angavs"});
        let result = await Keyword.findDuplicateName(name)
        if (result) {
            return res.status(403).json({message: `Nyckelordet ${name} finns redan`});
        }
        const keywordItem = new Keyword();
        keywordItem.name = name;
        if (req.body.callBack) keywordItem.callBack = req.body.callBack;
        await keywordItem.save();
        return res.status(201).json({message: "Nyckelord skapat"});

    } catch (e) {
        console.log(e.message);
        res.status(500).json({message: "Något gick snett, bäst att skylla på William!:rage:"})
    }
});

module.exports = router;
