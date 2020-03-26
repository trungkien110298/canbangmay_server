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
    tasks: [
        {
            task_id: String,
            name: String,
            description: String,
            device: String,
            time: Number,
            level: Number,
            task_type: Number
        }
    ],
    precedence_relations:[
        {
            previous_task_id: String,
            posterior_task_id: String
        }
    ]
});

ProductSchema.pre('save', function (next) {
    var product = this;
    next();
});

module.exports = mongoose.model('Product', ProductSchema);