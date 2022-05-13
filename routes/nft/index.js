
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const Axios = require('axios');
const express = require('express');
const NFT = require('../../models/nft.js');


const router = express.Router();


router.post("/create", async (req, res) => {
    let url = req.body.url;
    let fileName = req.body.name;
    let filePath = path.join(process.env.nft_path, fileName);
    console.log(filePath)
    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filePath))
            .on('error', reject)
            .once('close', () => resolve(filePath));
            res.json({message: "hej"});
    });
    
})

module.exports = router;