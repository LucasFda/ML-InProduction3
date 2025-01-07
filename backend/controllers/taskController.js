const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const task = new Task({ description: req.body.description });
        const savedTask = await task.save();
        console.log(task);
        res.status(201).json(savedTask);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ dateCompleted: -1 });
        console.log("getting tasks", tasks);
        res.status(200).json(tasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Method to get daily progress report
exports.getDailyReport = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tasks = await Task.find({
            dateCompleted: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
        });

        res.status(200).json({
            date: today.toDateString(),
            totalTasks: tasks.length,
            tasks,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Method to get weekly progress report
exports.getWeeklyReport = async (req, res) => {
    try {
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        firstDayOfWeek.setHours(0, 0, 0, 0);

        const lastDayOfWeek = new Date(firstDayOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);

        const tasks = await Task.find({
            dateCompleted: {
                $gte: firstDayOfWeek,
                $lt: lastDayOfWeek,
            },
        });

        res.status(200).json({
            weekStart: firstDayOfWeek.toDateString(),
            weekEnd: new Date(lastDayOfWeek - 1).toDateString(),
            totalTasks: tasks.length,
            tasks,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};