const mongoose = require("mongoose");
const { create } = require("./user");

const ticketSchema = new mongoose.Schema({
    description: String,
    createdAt: Date,
    priority: {
        type: String,
        enum: ['Low','Normal','High','Critical']
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