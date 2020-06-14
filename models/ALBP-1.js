var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ALBPOneSchema = new Schema({
    product_id: {
        type: ObjectId,
        required: true
    },
    input: {
        cycle_time: {
            type: Number,
            required: true
        },
        time: {
            type: Number,
            required: true
        },
        deviation: {
            type: Number,
            required: true
        },
        wattage: {
            type: Number,
            required: true
        }
    },
    output: {
        num_workstations: {
            type: Number
        },
        workstations: [
            {
                workstation_id: {
                    type: String,
                    require: true
                },
                tasks: [{
                    task_id: {
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
        total_worker: {
            type: Number,
            require: true
        },
        total_save: {
            type: Number,
            require: false
        },
        balance_efficiency: {
            type: Number,
            require: true
        },
        line_1: [
            {
                id: Number,
                label: String
            }
        ],
        line_2: [
            {
                id: Number,
                label: String
            }
        ],
        edges: [
            {
                u: Number,
                v: Number
            }
        ]
    }

});

ALBPOneSchema.pre('save', function (next) {
    var ALBPOne = this;

    next();
});

module.exports = mongoose.model('ProblemOne', ALBPOneSchema);