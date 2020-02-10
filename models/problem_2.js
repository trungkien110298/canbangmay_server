var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProblemTwoSchema = new Schema({
    product_id: {
        type: String,
        unique: true,
        lowercase: true,
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
    
    next();
});

module.exports = mongoose.model('ProblemTwo', ProblemTwoSchema);