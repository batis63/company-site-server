const express = require('express');
const _ = require('lodash');
const router = express.Router();

const { Product,validate } = require('../model/product');

router.get('/', async (req, res) => {
    try {

        const products = await Product.find();
        if (!products)
            return res.status(400).send('There is not post in database.');

        res.status(200).send(products);
    } catch (error) {
        return res.status(404).send(`There is not post in database. ${error} ${req.params.id}`);
    }
});

router.get('/product', async (req, res) => {
    try {

        let id = req.query.id;
        const product = await Product.findById(id);
        if (!product)
            return res.status(400).send('There is not post in database.');

        res.status(200).send(product);
    } catch (error) {
        return res.status(404).send(`There is not post in database. ${error} ${req.params.id}`);
    }
});

module.exports = router;
