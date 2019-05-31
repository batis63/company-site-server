// const validator = require('validator');
// const _ = require('lodash');
// const config = require('config');
const { mongoose } = require('./../db/mongoose');

let productSchema = new mongoose.Schema({
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
    imgurls: [String],
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
    size: [
        {
            width: {
                _id: false,
                type: Number,
                require: false
            },
            height: {
                _id: false,
                type: Number,
                require: false
            },
            depth: {
                _id: false,
                type: Number,
                require: false
            }
        }
    ],
    insertdate: {
        type: Date,
        required: true,
        default: new Date().getDate()
    },
    madein: {
        type: String,
        required: false
    },
    tags: [String]
});

let Product = mongoose.model('Product', productSchema);

module.exports = {
    Product
};
