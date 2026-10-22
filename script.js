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

//