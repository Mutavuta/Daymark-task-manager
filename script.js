// 1. Get the HTML elements we need
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// 2. Load saved tasks from the browser
const STORAGE_KEY = "daymark-tasks";

let tasks = [];

try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    tasks = savedTasks ? JSON.parse(savedTasks) : [];

    if (!Array.isArray(tasks)) {
        tasks = [];
    }
} catch {
    tasks = [];
}

// 3. Save tasks to localStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// 4. Display the tasks on the page
function renderTasks() {
    taskList.replaceChildren();

    if (tasks.length === 0) {
        const emptyMessage = document.createElement("li");

        emptyMessage.className =
            "rounded-xl border border-dashed border-stone-300 px-4 py-8 text-center text-sm text-stone-500";

        emptyMessage.textContent =
            "No tasks yet. Add your first task above.";

        taskList.appendChild(emptyMessage);
        return;
    }

    tasks.forEach(function (task) {
        const listItem = document.createElement("li");

        listItem.className =
            "flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white px-4 py-4 shadow-sm";

        const leftSide = document.createElement("div");

        leftSide.className = "flex min-w-0 items-center gap-3";

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.className = "h-4 w-4 shrink-0 cursor-pointer accent-lime-600";
        checkbox.setAttribute("aria-label", "Mark task as completed");

        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        const taskText = document.createElement("span");

        taskText.textContent = task.text;

        taskText.className = task.completed
            ? "break-words text-stone-400 line-through"
            : "break-words text-stone-800";

        leftSide.append(checkbox, taskText);

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.className =
            "shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50";

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        listItem.append(leftSide, deleteButton);
        taskList.appendChild(listItem);
    });
}

// 5. Add a new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const newTask = {
        id: crypto.randomUUID(),
        text: taskText,
        completed: false
    };

    tasks.unshift(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

// 6. Mark a task as completed or incomplete
function toggleTask(taskId) {
    tasks = tasks.map(function (task) {
        if (task.id === taskId) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// 7. Delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });

    saveTasks();
    renderTasks();
}

// 8. Display saved tasks when the page opens
renderTasks();
