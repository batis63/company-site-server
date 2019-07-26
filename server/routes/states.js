const express = require('express');
const { State } = require('../model/states');
const router = express.Router();

router.get('/getstates', async (req, res) => {
    try {
        const states = await State.find();
        if (!states) return res.status(400).send('not find any data');
        res.status(200).send(states);
    } catch (error) {
        res.status(400).send('something error');
    }
});

module.exports = router;
