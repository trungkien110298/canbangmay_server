var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ALBPOneSchema = new Schema({
    product_id: {
        type: ObjectId,
        required: true
    },
    input: {
        cycle_time:{
            type: Number,
            required: true
        },
        time: {
            type: Number,
            required: true
        },
        deviation:{
            type: Number,
            required: true
        },
        wattage: {
            type: Number,
            required: true
        }
    },
    output: {
        
    }
    
    


});

ALBPOneSchema.pre('save', function (next) {
    var ALBPOne = this;
    
    next();
});

module.exports = mongoose.model('ProblemOne', ALBPOneSchema);