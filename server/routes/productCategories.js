const express = require('express');
const router = express.Router();

const { ProductCategory, validate } = require('../model/productCategory');
const { User } = require('../model/user');

//#region addProductCategory
router.post('/addproductcategory', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }

        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let productCategory = new ProductCategory(req.body);
        productCategory
            .save()
            .then(() => {
                res.status(200).send('تغییرات با موفقیت انجام شد');
            })
            .catch(error => {
                res.status(400).send(error);
            });
    } catch (error) {
        return res.status(400).send(error);
    }
});
//#endregion addProductCategory

//#region editProductCategory
router.post('/editproductcategory', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');

        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        await ProductCategory.findByIdAndUpdate(req.query.id, req.body)
            .then(() => {
                res.status(200).send('ویرایش با موفقیت انجام شد');
            })
            .catch(error => {
                res.status(400).send(error);
            });
    } catch (error) {
        return res.status(400).send(error);
    }
});
//#endregion editProductCategory

//#region removeProductCategory
router.post('/removeproductcategory', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('User Unauthorized');
        }

        await ProductCategory.findByIdAndRemove(req.query.id)
            .then(() => {
                res.status(200).send('حذف با موفقیت انجام شد');
            })
            .catch(error => {
                res.status(400).send(error);
            });
    } catch (error) {
        return res.status(400).send(error);
    }
});
//#endregion removeProductCategory

//#region getoneProductCategory
router.get('/getoneproductcategory', async (req, res) => {
    try {
        let productCategory = await ProductCategory.findById(req.query.id);
        if (!productCategory) return res.status(400).send('اطلاعات یافت نشد');

        res.status(200).send(productCategory);
    } catch (error) {
        return res.status(400).send(error);
    }
});
//#endregion getOneProductCategory

module.exports = router;
