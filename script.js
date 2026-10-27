const STORAGE_KEY = "task-manager-tasks";

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

// reads saved tasks from localStorage and returns them as an array
function loadTasks() {
    // getItem returns a string or null if nothing exists has been saved yet
    const saved = localStorage.getItem(STORAGE_KEY);

    // first visit - nothing is saved so start with an empty array
    if (saved === null) {
        return [];
    }

    return JSON.parse(saved);
}

// saves new talks to localStorage as a JSON string
function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// the single source of truth: the page gets drawn from this array
// let not const because it's going to be reassigned when we load tasks from localStorage or delete a task
let tasks = loadTasks();

// creates a new task object and adds it to the tasks array
function addTask(text) {
    // remove spaces from both ends 
    const cleanText = text.trim();

    // don't add empty tasks
    if (cleanText === "") {
        return;
    }

    // build the task object; Date.now() gives a unique id
    const newTask = {
        id:Date.now(),
        text: cleanText,
        completed: false, // every new task starts out as not completed
    };

    // add it to the array, save, then redraw the page
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
}

// flips a task between done and not done
function toggleTask(id) {
    const task = tasks.find(function (t) {
        return t.id === id;
    });

    // flip the value: true becomes false, false becomes true
    task.completed = !task.completed;

    saveTasks(tasks);
    renderTasks();
}

// removes a task from the list
function deleteTask(id) {
    // filter builds a new array with only the tasks whose id doesn't match 
    tasks = tasks.filter(function (t) {
        return t.id !== id;
    });
    
    saveTasks(tasks);
    renderTasks();
}

// draws the whole task list on the page from the tasks array
function renderTasks() {
    // wipe the list first so we don't duplicate tasks
    taskList.innerHTML = "";

    //build one <li> for every task
    tasks.forEach(function (task) {
        const li = document.createElement("li");
        li.className = "task-item";

        // if completed tasks get an extra class so CSS can style them differently
        if (task.completed) {
            li.classList.add("completed");
        }

        // checkbox reflects and controls the completed state
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        // the text of the task
        const text = document.createElement("span");
        text.textContent = task.text;

        // delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", function () {
            deleteTask(task.id);
        });

        // put the pieces together
        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
    
    // shows the empty message only when there are not tasks
    emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
}

// runs when the form is submitted (user presses enter or clicks the submit button)
taskForm.addEventListener("submit", function (event) {
    // stops the browser's default behavoiur of reloading the page on submit
    event.preventDefault();

    addTask(taskInput.value);

    // clear the box and put the cursor back in it
    taskInput.value = "";
    taskInput.focus();
});

// initial render when the page loads
renderTasks();

