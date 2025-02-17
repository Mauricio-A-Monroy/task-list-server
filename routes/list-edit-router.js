const { Router } = require("express");
const router = Router();
const tasks = require("../tasks");

// Middleware de validación para POST y PUT
router.use(["/task", "/task/:taskId"], function (req, res, next) {
    if (req.method !== "POST" && req.method !== "PUT") {
        return next(); // No afecta otras rutas o métodos
    }

    const { id, isCompleted, description } = req.body;

    // Validar si el body está vacío
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Body of request is empty" });
    }

    // Validar campos requeridos
    if (id === undefined || isCompleted === undefined || description === undefined) {
        return res.status(400).json({ error: "Missing required fields: id, isCompleted, and description." });
    }

    // Validar tipos de datos
    if (typeof id !== "number" || typeof isCompleted !== "boolean" || typeof description !== "string") {
        return res.status(400).json({ error: "Invalid data format. Ensure id is a number, isCompleted is a boolean, and description is a string." });
    }

    // Validar ID único solo en POST (PUT no necesita esta validación)
    if (req.method === "POST" && tasks.find(t => t.id === id)) {
        return res.status(400).json({ error: "Id is already in use, please choose a different one." });
    }

    // Validar que la descripción no esté vacía
    if (description.trim().length === 0) {
        return res.status(400).json({ error: "Description is empty, please provide a valid description." });
    }

    next(); // Continuar con la solicitud
});

router.post("/task", function (req, res) {
    const { id, isCompleted, description } = req.body;

    // Crear nueva tarea
    const newTask = { id, isCompleted, description };
    
    // Agregar la tarea a la lista
    tasks.push(newTask);

    // Devolver la tarea agregada
    res.status(201).json(tasks);
});

router.delete("/task/:taskId", function (req, res) {
    const taskId = parseInt(req.params.taskId);
    
    // Buscar el índice de la tarea en el array
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    // Eliminar la tarea usando splice()
    const deletedTask = tasks.splice(taskIndex, 1);

    res.status(200).json({ message: "Task deleted successfully", deletedTask });
});

router.put("/task/:taskId", function (req, res) {
    const taskId = parseInt(req.params.taskId);
    const task = tasks.find(t => t.id === taskId);
    const { isCompleted, description } = req.body;

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    // Validaciones antes de actualizar
    if (isCompleted !== undefined && typeof isCompleted !== "boolean") {
        return res.status(400).json({ error: "Invalid data format: isCompleted must be a boolean." });
    }

    if (description !== undefined) {
        if (typeof description !== "string" || description.trim().length === 0) {
            return res.status(400).json({ error: "Invalid data format: description must be a non-empty string." });
        }
        task.description = description.trim(); // Actualizar la descripción si es válida
    }

    // Actualizar el estado de completado si se envió en el body
    if (isCompleted !== undefined) {
        task.isCompleted = isCompleted;
    }

    res.status(200).json({ message: "Task updated successfully", task });
});

module.exports = router;