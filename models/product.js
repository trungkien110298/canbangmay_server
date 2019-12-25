var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProductSchema = new Schema({
    product_id: {
        type: String,
        unique: true,
        lowercase: true,
        required: false
    },
    product_name: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    input:{
        type: JSON,
        required: false
    },
    output:{
        type: JSON,
        required: false
    }
});

ProductSchema.pre('save', function (next) {
    var user = this;
    // if (this.isModified('password') || this.isNew) {
    //     bcrypt.genSalt(10, function (err, salt) {
    //         if (err) {
    //             return next(err);
    //         }
    //         bcrypt.hash(user.password, salt, null, function (err, hash) {
    //             if (err) {
    //                 return next(err);
    //             }
    //             user.password = hash;
    //             next();
    //         });
    //     });
    // } else {
    //     return next();
    // }
    next();
});

module.exports = mongoose.model('Product', ProductSchema);