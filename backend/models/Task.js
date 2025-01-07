const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    description: String,
    dateCompleted: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Task', TaskSchema);
