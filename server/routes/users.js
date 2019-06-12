const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const { User, validate, validatePassword, sendMail } = require('../model/user');

router.post('/signup', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const salt = await bcrypt.genSalt(10);
        const cryptPassword = await bcrypt.hash(req.body.password, salt);

        let user = new User({
            password: cryptPassword,
            email: req.body.email,
            addresses: req.body.addresses,
            tel: req.body.tel,
            mobile: req.body.mobile,
            first_name: req.body.first_name,
            last_name: req.body.last_name
        });

        await user.save();
        sendMail('signup', user);

        res.status(200).send(user);
    } catch (error) {
        if (error.code === 11000)
            return res.status(409).send('ایمیل قبلا ثبت شده است');
        return res.status(404).send(`خطا در ثبت اطلاعات کاربر جدید. ${error} `);
    }
});

router.post('/changepassword', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    const { error } = validatePassword(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findByToken(token);

        let validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validPassword)
            return res.status(401).send('رمز عبور قبلی صحیح نمیباشد');

        validPassword = await bcrypt.compare(
            req.body.newPassword,
            user.password
        );

        if (validPassword)
            return res
                .status(401)
                .send('رمز عبور جدید نمیتواند با رمز عبور قبلی یکسان باشد ');

        const salt = await bcrypt.genSalt(10);
        const cryptPassword = await bcrypt.hash(req.body.newPassword, salt);
        User.findByIdAndUpdate(user._id, { password: cryptPassword }).then(
            () => {
                res.status(200).send(user);
                sendMail('changepassword', user);
            }
        );
    } catch (error) {
        return res.status(400).send('token is expired');
    }
});

module.exports = router;
