const express = require('express');
const router = express.Router();

const { NewsLetter, validate } = require('../model/newsLetter');

router.post('/addemail', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let find =await NewsLetter.findOne({ email: req.body.email });
        if (!find) {
            let newsLetter = new NewsLetter({
                email: req.body.email
            });
            newsLetter.save().then(() => {
                res.status(200).send('تغییرات با موفقیت انجام شد');
            });
        } else {
            res.status(200).send('تغییرات با موفقیت انجام شد');
        }
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});

module.exports = router;
