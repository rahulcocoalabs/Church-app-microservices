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

const MatrimonySchema = mongoose.Schema({
    name: String,
    churchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Church'
    },
    gender: String,
    age: Number,
    phone: String,
    image: String,
    subImages: Array,
    height: Number,
    weight: Number,
    education: String,
    profession: String,
    address: String,
    nativePlace: String,
    workPlace: String,
    preferredAgeFrom: Number,
    preferredAgeTo: Number,
    preferredHeightFrom: Number,
    preferredHeightTo: Number,
    description: String,
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    profileStatus : String,
    status: Number,
    tsCreatedAt: Number,
    tsModifiedAt: Number

}, options);
module.exports = mongoose.model('Matrimony', MatrimonySchema, 'Matrimonies');