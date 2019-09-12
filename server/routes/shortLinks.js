const express = require('express');
const router = express.Router();
const { User } = require('../model/user');

const { ShortLink, validate } = require('../model/shortLink');

//#region addshortlink
router.post('/addshortlink', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        let findExist = await ShortLink.findOne({
            shortLink: req.body.shortLink
        });
        if (findExist) return res.status(401).send('short link is duplicated');
        let shortLink = new ShortLink({
            mainLink: req.body.mainLink,
            shortLink: req.body.shortLink
        });
        shortLink.save().then(() => {
            res.status(200).send('تغییرات با موفقیت انجام شد');
        });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion addshortlink

//#region editshortlink
router.post('/editshortlink', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }
        let findExist = await ShortLink.findOne({
            shortLink: req.body.shortLink
        });
        if (findExist && !findExist._id.equals(req.query.id))
            return res.status(401).send('short link is duplicated');

        await ShortLink.findByIdAndUpdate(req.query.id, req.body)
            .then(() => {
                res.status(200).send('ویرایش با موفقیت انجام شد');
            })
            .catch(error => {
                res.status(400).send(error);
            });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion editshortlink

//#region removeshortlink
router.post('/removeshortlink', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        await ShortLink.findByIdAndRemove(req.query.id)
            .then(() => {
                res.status(200).send('حذف با موفقیت انجام شد');
            })
            .catch(error => {
                res.status(400).send(error);
            });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion removeshortlink

//#region getshortlinks
router.get('/getshortlinks', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        const result = await ShortLink.find();
        res.status(200).send(result);
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion getshortlinks

//#region getOneshortlinks
router.get('/getshortlink', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        const result = await ShortLink.findById(req.query.id);
        if (!result) return res.status(400).send('اطلاعاتی یافت نشد');
        res.status(200).send(result);
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion getOneshortlinks

//#region getOneshortlinks
router.get('/getshortlinkbyname', async (req, res) => {
    try {
        const result = await ShortLink.findOne({
            shortLink: req.query.name
        });
        if (!result) return res.status(400).send('اطلاعاتی یافت نشد');
        res.status(200).send(result);
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion getOneshortlinks

module.exports = router;
