const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const {
    User,
    validate,
    validatePassword,
    sendMail,
    validateEmail,
    sendForgotEmail,
    validatePasswordWhenReset,
    validateWhenEdit,
    validateAddress
} = require('../model/user');

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

router.post('/resetpassword', async (req, res) => {
    const { error } = validatePasswordWhenReset({
        newPassword: req.body.newPassword
    });
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findOne({ reset_password_token: req.body.token });
        if (!user) return res.status(400).send('اعتبار لینک منقضی شده است');

        const salt = await bcrypt.genSalt(10);
        const cryptPassword = await bcrypt.hash(req.body.newPassword, salt);
        User.findByIdAndUpdate(user._id, {
            password: cryptPassword,
            reset_password_token: '',
            reset_password_expires: null
        }).then(() => {
            res.status(200).send(user);
            sendMail('changepassword', user);
        });
    } catch (error) {
        return res.status(400).send('token is expired');
    }
});

router.get('/validateTokenOfResetPassword', async (req, res) => {
    let token = req.query.token;
    try {
        let user = await User.findOne({ reset_password_token: token });

        if (!user) return res.status(400).send('لینک نا معتبر است');
        if (user.reset_password_expires > Date())
            return res.status(400).send('اعتبار لینک منقضی شده است');
        res.status(200).send('لینک معتبر است');
    } catch (error) {
        res.status(400).send('خطا در بررسی لینک');
    }
});

router.post('/forgotpassword', async (req, res) => {
    const { error } = validateEmail(req.body);
    if (!error) return res.status(400).send('ایمیل وارد شده معتبر نمیباشد');
    try {
        let user = await User.findOne({
            email: req.body.email
        });
        if (!user)
            return res.status(401).send('ایمیل وارد شده قبلا ثبت نشده است ');

        sendForgotEmail(user);
        res.status(200).send('ایمیل بازیابی برای شما ارسال شد');
    } catch (error) {
        res.status(402).send('خطا در بررسی ایمیل');
    }
});

router.post('/changepassword', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    const { error } = validatePassword(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');

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

router.get('/getUserInformation', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        res.status(200).send(user);
    } catch (error) {
        return res.status(400).send('token is expired');
    }
});

router.post('/editUserInformation', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    const { error } = validateWhenEdit(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let model = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        tel: req.body.tel,
        mobile: req.body.mobile
    };
    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');

        User.findByIdAndUpdate(user._id, {
            first_name: model.first_name,
            last_name: model.last_name,
            email: model.email,
            tel: model.tel,
            mobile: model.mobile
        }).then(() => {
            res.status(200).send(user);
            sendMail('editInformation', user);
        });
    } catch (error) {
        return res.status(400).send('token is expired');
    }
});

router.post('/editaddress', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    const { error } = validateAddress(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const addressId = req.query.id;

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');

        User.updateOne(
            { _id: user._id, 'addresses._id': addressId },
            {
                $set: {
                    'addresses.$.province_name': req.body.province_name,
                    'addresses.$.city_name': req.body.city_name,
                    'addresses.$.address': req.body.address,
                    'addresses.$.postal_code': req.body.postal_code,
                    'addresses.$.receiver_mobile': req.body.receiver_mobile,
                    'addresses.$.receiver_first_name':
                        req.body.receiver_first_name,
                    'addresses.$.receiver_last_name':
                        req.body.receiver_last_name
                }
            }
        ).then(() => {
            res.status(200).send('تغییرات با موفقیت انجام شد');
        });
    } catch (error) {
        return res.status(400).send('token is expired');
    }
});

router.post('/addaddress', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    const { error } = validateAddress(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.addresses.length >= 10) {
            res.status(400).send('حداکثر تعداد 10 آدرس قابل ثبت است');
            return;
        }
        user.addresses.push(req.body);
        user.save().then(() => {
            res.status(200).send('تغییرات با موفقیت انجام شد');
        });
    } catch (error) {
        return res.status(400).send('token is expired');
    }
});

router.post('/deleteaddress', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    const addressId = req.query.id;

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');

        user.addresses.id(addressId).remove();
        user.save().then(() => {
            res.status(200).send('حذف  با موفقیت انجام شد');
        });
    } catch (error) {
        return res.status(400).send('token is expired');
    }
});

module.exports = router;
