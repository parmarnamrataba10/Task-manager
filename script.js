
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editId = null;

if (tasks.length == 0) {
    tasks = [
        {
            id: 1,
            title: "Complete Project",
            description: "Finish the Task Manager project",
            dueDate: "2026-10-30",
            priority: "high"
        },
        {
            id: 2,
            title: "Learn Bootstrap",
            description: "Practice Bootstrap tables and forms",
            dueDate: "2026-10-28",
            priority: "medium"
        },
      
    ];

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

let form = document.getElementById("taskForm");
let title = document.getElementById("title");
let description = document.getElementById("description");
let dueDate = document.getElementById("dueDate");
let priority = document.getElementById("priority");
let tbody = document.getElementById("taskTableBody");
let search = document.getElementById("search");
let filterPriority = document.getElementById("filterPriority");
let message = document.getElementById("message");
let cancelBtn = document.getElementById("cancelBtn");
let saveBtn = document.getElementById("saveBtn");

let priorityOrder = {
    high: 1,
    medium: 2,
    low: 3
};

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    let task = {
        id: editId === null ? Date.now() : editId,
        title: title.value.trim(),
        description: description.value.trim(),
        dueDate: dueDate.value,
        priority: priority.value
    };

    if (editId === null) {
        tasks.push(task);
        message.textContent = "Task added successfully!";
    } else {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === editId) {
                tasks[i] = task;
                break;
            }
        }

        message.textContent = "Task updated successfully!";
    }

    saveTasks();
    resetForm();
    displayTasks();
});

function displayTasks() {
    tbody.innerHTML = "";

    let searchText = search.value.toLowerCase();
    let selectedPriority = filterPriority.value;

    let sortedTasks = tasks.slice();

    sortedTasks.sort(function(a, b) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    let count = 0;

    for (let i = 0; i < sortedTasks.length; i++) {
        let task = sortedTasks[i];

        let titleMatch = task.title.toLowerCase().includes(searchText);
        let descriptionMatch = (task.description || "").toLowerCase().includes(searchText);

        let priorityMatch =
            selectedPriority === "all" ||
            task.priority === selectedPriority;

        if ((titleMatch || descriptionMatch) && priorityMatch) {
            count++;

            let row = document.createElement("tr");

            let cell1 = document.createElement("td");
            cell1.textContent = count;
            row.appendChild(cell1);

            let cell2 = document.createElement("td");
            cell2.textContent = task.title;
            row.appendChild(cell2);

            let cell3 = document.createElement("td");
            cell3.textContent = task.description || "No description";
            row.appendChild(cell3);

            let cell4 = document.createElement("td");
            cell4.textContent = task.dueDate;
            row.appendChild(cell4);

            let cell5 = document.createElement("td");
            cell5.textContent = task.priority.toUpperCase();
            cell5.className = task.priority;
            row.appendChild(cell5);

            let cell6 = document.createElement("td");
            let editBtn = document.createElement("button");

            editBtn.textContent = "Edit";
            editBtn.className = "btn btn-primary btn-sm";
            editBtn.type = "button";

            editBtn.onclick = function() {
                editTask(task.id);
            };

            cell6.appendChild(editBtn);
            row.appendChild(cell6);

            let cell7 = document.createElement("td");
            let deleteBtn = document.createElement("button");

            deleteBtn.textContent = "Delete";
            deleteBtn.className = "btn btn-danger btn-sm";
            deleteBtn.type = "button";

            deleteBtn.onclick = function() {
                deleteTask(task.id);
            };

            cell7.appendChild(deleteBtn);
            row.appendChild(cell7);

            tbody.appendChild(row);
        }
    }

    if (count === 0) {
        let row = document.createElement("tr");
        let cell = document.createElement("td");

        cell.colSpan = 7;
        cell.textContent = "No tasks found";

        row.appendChild(cell);
        tbody.appendChild(row);
    }
}

function editTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            title.value = tasks[i].title;
            description.value = tasks[i].description;
            dueDate.value = tasks[i].dueDate;
            priority.value = tasks[i].priority;

            editId = id;
            break;
        }
    }

    saveBtn.textContent = "Update Task";
    cancelBtn.hidden = false;
    message.textContent = "";

    title.focus();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(function(task) {
            return task.id !== id;
        });

        if (editId === id) {
            resetForm();
        }

        saveTasks();
        displayTasks();
        message.textContent = "Task deleted successfully!";
    }
}

function resetForm() {
    form.reset();
    editId = null;
    saveBtn.textContent = "Add Task";
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", function() {
    resetForm();
    message.textContent = "";
});

search.addEventListener("input", displayTasks);

filterPriority.addEventListener("change", displayTasks);

displayTasks();
