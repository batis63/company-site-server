const express = require('express');
const router = express.Router();

const { User, validate } = require('../model/user');

router.post('/signup', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            addresses: req.body.addresses,
            tel: req.body.tel,
            mobile: req.body.mobile,
            first_name:req.body.first_name,
            last_name:req.body.last_name,
        });

        user = await user.save();

        res.status(200).send(user);
    } catch (error) {
        if (error.code === 11000)
            return res.status(409).send('duplicate email');
        return res.status(404).send(`There is not post in database. ${error} `);
    }
});

module.exports = router;
