var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProblemTwoSchema = new Schema({
    product_id: {
        type: ObjectId,
        required: true
    },
    input: {
        num_workers:{ 
            type: Number,
            required: true
        },
        wattage: {
            type: Number,
            required: true
        }
    },
    output: {
        workstations: [
            {
                workstations_id: {
                    type:  String,
                    require: true
                },
                tasks: [{
                    tasks_id: {
                        type: String,
                        require: true
                    },
                    device: {
                        type: String,
                        require: true
                    },
                    cycle_time: {
                        type: Number,
                        require: true
                    }
                }],
                level: {
                    type: Number,
                    require: true
                },
                total_time: {
                    type: Number,
                    require: true
                },
                rj: {
                    type: Number,
                    require: true
                },
                balance: {
                    type: Boolean,
                    require: false
                }
            }
        ],
        total_workers: {
            type: Number,
            require: true
        },
        total_saved: {
            type: Number,
            require: true
        },
        balance_efficiency: {
            type: Number,
            require: true
        }
    }
});

ProductSchema.pre('save', function (next) {
    var user = this;
    
    next();
});

module.exports = mongoose.model('ProblemTwo', ProblemTwoSchema);