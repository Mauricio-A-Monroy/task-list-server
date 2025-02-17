const { Router } = require("express");
const router = Router();
const tasks = require("../tasks");

router.get("/", function (req, res) {
    res.json(tasks);
});

router.use(["/filteredTasks/:isCompleted", "/task/:taskId"], function (req, res, next) {

    if (req.params.taskId !== undefined){
        const taskId = parseInt(req.params.taskId);
        const task = tasks.find(t => t.id === taskId);

        if (isNaN(taskId)) {
            return res.status(400).json({ error: "Invalid data format. Ensure taskId is a number" });
        }

        if (!task){
            return res.status(404).json({error: "Task not found"})
        }
    }

    if(req.params.isCompleted !== undefined){
        const isCompleted = req.params.isCompleted;

        // Validar que el parámetro sea "0" o "1"
        if (isCompleted !== "0" && isCompleted !== "1") {
            return res.status(400).json({ error: "Invalid parameter. Use 0 for not completed, 1 for completed." });
        }
    }

    next();
});

router.get("/task/:taskId", function (req, res) {
    const taskId = parseInt(req.params.taskId);
    const task = tasks.find(t => t.id === taskId);
    res.json(task);
});

router.get("/filteredTasks/:isCompleted", function (req, res) {
    const isCompleted = req.params.isCompleted;

    // Convertir el parámetro a booleano
    const completedStatus = isCompleted === "1";
    const filteredTasks = tasks.filter(t => t.isCompleted === completedStatus);

    // Si no hay tareas que coincidan
    if (filteredTasks.length === 0) {
        return res.status(404).json({ error: `No tasks found for status: ${completedStatus ? "completed" : "not completed"}` });
    }

    res.json(filteredTasks);
});

module.exports = router;
