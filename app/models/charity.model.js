const mongoose = require('mongoose');

function transform(ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.status;
    delete ret.tsModifiedAt;
}
var options = {
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
            transform(ret);
        }
    },
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            transform(ret);
        }
    }
};

const CharitiesSchema = mongoose.Schema({
    caption: String,
    title: String,
    trustName: String,
    address: String,
    images: Array,
    fund: String,
    phone: String,
    about: String,
    churchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Church'
    },
    charityPayments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CharityPayment'
    }],
    status: Number,
    tsCreatedAt: Number,
    tsModifiedAt: Number

}, options);
module.exports = mongoose.model('Charity', CharitiesSchema, 'Charities');