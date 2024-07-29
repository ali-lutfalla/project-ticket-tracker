const mongoose = require("mongoose");
const { create } = require("./user");

const ticketSchema = new mongoose.Schema({
    description: String,
    createdAt: {
        type: Date,
        default: Date.now,
        min: [new Date(), Date.now]
    },
    priority: {
        type: String,
        enum: ['Low','Normal','High','Critical'],
        required: true
    },
    status: {
        type:String,
        enum: ['Open','In-progress','On-hold','Under-review','Resolved','Closed'],
        required: true
    }
},{timestamps: true});

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    tickets: [ticketSchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
});

const Project = mongoose.model('Project',projectSchema);

module.exports = Project;