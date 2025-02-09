const express = require("express");
const path = require("path");  //modulo de node para acceder a un directorio
const viewRoute = require("./routes/list-view-router");
const editRoute = require("./routes/list-edit-router");
const app = express();
app.use(express.json()); // 👈 Middleware para que Express procese JSON

app.use("/list",viewRoute);

app.use("/list",editRoute);

app.listen(8080, () => {
    console.log("Listening by port: ", 8080);
});