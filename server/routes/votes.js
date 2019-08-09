const express = require('express');
const router = express.Router();

const { Vote, validate } = require('../model/vote');

router.post('/addvote', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {

        
        let vote = new Vote({
            email: req.body.email,
            vote: req.body.vote,
            title: req.body.title,
        });
        vote.save().then(() => {
            res.status(200).send('تغییرات با موفقیت انجام شد');
        });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});

module.exports = router;
