// const validator = require('validator');
// const _ = require('lodash');
// const config = require('config');
const Joi = require('joi');

const { mongoose } = require('./../db/mongoose');

let productSchema = new mongoose.Schema({
    product_code: {
        type: Number,
        required: true
    },
    fullname: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    imgcounts: {
        type: Number,
        required: true,
        default: 1
    },
    discount: [
        {
            fromdate: {
                _id: false,
                type: Date,
                require: false
            },
            todate: {
                _id: false,
                type: Date,
                require: false
            },
            discountvalue: {
                _id: false,
                type: Number,
                require: false
            }
        }
    ],
    description: {
        type: String,
        required: true,
        minlength: 3
    },
    size: {
        type: String,
        required: true,
        minlength: 2
    },
    weight: {
        type: String,
        required: true,
        minlength: 2
    },
    insertdate: {
        type: Date,
        required: true,
        default: new Date().getDate()
    },
    madein: {
        type: String,
        required: false
    },
    tags: [String],
    countinpackage: {
        type: String,
        required: true,
        default: 1
    },
    deliverytime: {
        type: String,
        required: true,
        default: '1 تا 3 روز کاری'
    }
});

const validate = product => {
    const schema = {
        fullname: Joi.string().required(),
        price: Joi.number().required()
    };

    return Joi.validate(product, schema);
};

let Product = mongoose.model('Product', productSchema);

module.exports = {
    Product,
    validate
};
