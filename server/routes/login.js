const Joi = require('joi');
const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../model/user');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!validPassword)
        return res.status(400).send('Invalid email or password.');

    const token = await user.generateAuthToken();

    res.status(200).send(token);
});

router.get('/islogined', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        res.status(200).send(user);
    } catch (error) {
        return res.status(400).send('token is expired');
    }
});



const validateLogin = req => {
    const schema = {
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email(),
        password: Joi.string()
            .min(5)
            .max(30)
            .required()
    };

    return Joi.validate(req, schema);
};

module.exports = router;
