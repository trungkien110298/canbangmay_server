var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlackListSchema = new Schema({
    usedToken: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model('BlackList', BlackListSchema);