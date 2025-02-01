let todos = []; // Lista delle todo
const todoInput = document.getElementById('todoInput');
const insertButton = document.getElementById('insertButton');
const todoTable = document.getElementById('todoTable');

// Funzione di rendering della tabella
const render = () => {
    let html = `
        <thead>
            <tr>
                <th>Task</th>
                <th>Completato</th>
                <th>Azione</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    todos.forEach(todo => {
        let completedClass = '';
        let completedText = 'No';
        
        if (todo.completed) {
            completedClass = 'completed';
            completedText = 'Sì';
        }

        html += `
            <tr class="${completedClass}">
                <td>${todo.name}</td>
                <td>${completedText}</td>
                <td>
                    <button class="complete" onclick="completeTodo('${todo.id}')">Completato</button>
                    <button class="delete" onclick="deleteTodo('${todo.id}')">Elimina</button>
                </td>
            </tr>
        `;
    });

    html += `</tbody>`;
    todoTable.innerHTML = html;
};


// Funzione per inviare una nuova Todo al server
const send = (todo) => {
    console.log("Sending todo:", todo);
    return new Promise((resolve, reject) => {
        fetch("http://localhost/todo/add", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)
        })
        .then(response => response.json())
        .then(json => {
            console.log("Server response:", json);
            resolve(json);
        })
        .catch(err => {
            console.error("Error:", err);
            reject(err);
        });
    });
};

// Funzione per caricare la lista delle Todo dal server
const load = () => {
    return new Promise((resolve, reject) => {
        fetch("http://localhost/todo")
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => reject(err));
    });
};

// Funzione per completare una Todo
const completeTodo = (id) => {
    const todo = todos.find(todo => todo.id === id);
    
    if (!todo) {
        console.error('Todo non trovata!');
        return;
    }
    todo.completed = true;

    // Chiamata al server per aggiornare lo stato della todo
    fetch("http://localhost/todo/complete", {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todo)
    })
    .then(response => response.json())
    .then(json => {
        todos = json.todos;  
        render(); 
    })
    .catch(err => console.error("Errore:", err));
};



// Funzione per eliminare una Todo
const deleteTodo = (id) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost/todo/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(json => {
            todos = json.todos;
            render();
            resolve(json);
        })
        .catch(err => reject(err));
    });
};

// Gestore del bottone di aggiunta Todo
insertButton.onclick = () => {
    const todo = {
        name: todoInput.value,
        completed: false
    };

    send(todo)
        .then(() => load())
        .then((json) => {
            todos = json.todos;
            todoInput.value = '';
            render();
        });
};

// Caricamento iniziale della lista
load().then((json) => {
    todos = json.todos;
    render();
});
setInterval(() => {

    load().then((json) => {
 
       todos = json.todos;
 
       todoInput.value = "";
 
       render();
 
    });
 
 }, 30000);