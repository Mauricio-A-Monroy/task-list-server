const express = require("express");
const path = require("path")  //modulo de node para acceder a un directorio

const app = express();

let tasks = [
    {
        id: 123456,
        isCompleted: false,
        description: "Walk the dog",
    },
    {
        id: 789012,
        isCompleted: true,
        description: "Buy groceries",
    }
];

app.get("/", (req, res) => {
    //res.sendFile("C:/Users/Mauricio Monroy/IETI/Lab 1/index.html");
    //res.sendFile(path.join(__dirname + "/index.html"))
    res.json(tasks);
});

app.listen(3000, () => {
    console.log("Listening by port: ", 3000);
});