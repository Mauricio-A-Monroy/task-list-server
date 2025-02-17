const express = require("express");
const path = require("path");  //modulo de node para acceder a un directorio
const viewRoute = require("./routes/list-view-router");
const editRoute = require("./routes/list-edit-router");
const app = express();
app.use(express.json()); // 👈 Middleware para que Express procese JSON

app.use((req, res, next) => {
    const validMethods = ["GET", "POST", "PUT", "DELETE"];

    if (!validMethods.includes(req.method)) {
        return res.status(400).json({ error: "Invalid HTTP request method" });
    }

    next(); // Continuar con la siguiente capa de middleware
});

app.use("/list",viewRoute);

app.use("/list",editRoute);

app.listen(8080, () => {
    console.log("Listening by port: ", 8080);
});