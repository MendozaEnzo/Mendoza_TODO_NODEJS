const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');  // importo cors
const app = express();

// Middleware per CORS
app.use(cors());  // Permette a tutte le origini di fare richieste (se vuoi limitare, configura qui)


// Middleware per il parsing del corpo delle richieste
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servire la parte statica (HTML, CSS, JS)
app.use("/", express.static(path.join(__dirname, "public")));

let todos = [];

// Endpoint per aggiungere una nuova Todo
app.post("/todo/add", (req, res) => {
    const todo = req.body;
    todo.id = "" + new Date().getTime(); // Creazione ID univoco
    todos.push(todo);
    res.json({ result: "Ok" });
});

// Endpoint per ottenere la lista delle Todo
app.get("/todo", (req, res) => {
    res.json({ todos: todos });
});

// Endpoint per completare una Todo
app.put("/todo/complete", (req, res) => {
    const todo = req.body;
    todos = todos.map((item) => {
        if (item.id === todo.id) {
            item.completed = true;
        }
        return item;
    });
    res.json({ result: "Ok", todos: todos });
});

// Endpoint per eliminare una Todo
app.delete("/todo/:id", (req, res) => {
    todos = todos.filter((item) => item.id !== req.params.id);
    res.json({ result: "Ok", todos: todos });
});

// Creazione del server
const server = require('http').createServer(app);
server.listen(80, () => {
    console.log("- server running on http://localhost:80");
});
