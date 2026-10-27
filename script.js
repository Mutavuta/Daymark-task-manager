// 1. FIND THE HTML ELEMENTS

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");
const categoryInput = document.getElementById("categoryInput");
const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

const STORAGE_KEY = "daymark-tasks";
const THEME_KEY = "daymark-theme";


// 2. GET TODAY'S DATE

function getToday() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);

    return new Intl.DateTimeFormat("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(date);
}

document.getElementById("currentDate").textContent =
    new Intl.DateTimeFormat("en-KE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date());


// 3. LOAD SAVED TASKS

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (!savedTasks) {
            return [];
        }

        const parsedTasks = JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        return parsedTasks
            .filter(task =>
                task &&
                typeof task === "object" &&
                typeof task.text === "string"
            )
            .map(task => ({
                id: typeof task.id === "string"
                    ? task.id
                    : crypto.randomUUID(),

                text: task.text,

                completed: task.completed === true,

                priority: ["high", "medium", "low"].includes(task.priority)
                    ? task.priority
                    : "medium",

                dueDate: typeof task.dueDate === "string"
                    ? task.dueDate
                    : "",

                category: typeof task.category === "string"
                    ? task.category
                    : "Other"
            }));
    } catch (error) {
        console.error("Could not load tasks:", error);
        return [];
    }
}

let tasks = loadTasks();


// 4. SAVE TASKS

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error("Could not save tasks:", error);
    }
}


// 5. DARK AND LIGHT MODE

function getSavedTheme() {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch {
        return null;
    }
}

const savedTheme = getSavedTheme();

let isDarkMode = savedTheme
    ? savedTheme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;

function applyTheme() {
    document.documentElement.classList.toggle("dark", isDarkMode);

    themeIcon.textContent = isDarkMode ? "☀" : "☾";

    themeLabel.textContent = isDarkMode
        ? "Light mode"
        : "Dark mode";

    themeToggle.setAttribute(
        "aria-label",
        isDarkMode ? "Switch to light mode" : "Switch to dark mode"
    );

    document.querySelector('meta[name="theme-color"]').content =
        isDarkMode ? "#101410" : "#f5f6f2";

    try {
        localStorage.setItem(
            THEME_KEY,
            isDarkMode ? "dark" : "light"
        );
    } catch (error) {
        console.error("Could not save theme:", error);
    }
}

themeToggle.addEventListener("click", function () {
    isDarkMode = !isDarkMode;
    applyTheme();
});

applyTheme();


// 6. FILTER SETTINGS

let currentFilter = "all";
let currentPriorityFilter = "all";
let searchTerm = "";

const filterDetails = {
    all: {
        title: "Your tasks",
        description: "Your plans, all in one place."
    },

    today: {
        title: "Today's tasks",
        description: "Focus on what is due today."
    },

    upcoming: {
        title: "Upcoming tasks",
        description: "See what's coming up next."
    },

    completed: {
        title: "Completed tasks",
        description: "Look at everything you've finished."
    }
};


// 7. UPDATE SIDEBAR FILTER STYLES

function updateSidebarStyles() {
    const buttons = document.querySelectorAll("[data-filter]");

    buttons.forEach(function (button) {
        const isActive = button.dataset.filter === currentFilter;

        button.className = isActive
            ? "filter-button flex items-center gap-3 rounded-xl bg-stone-900 px-4 py-3 text-left text-sm font-semibold text-white dark:bg-lime-300 dark:text-stone-950"
            : "filter-button flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-stone-500 transition hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-white/5";
    });
}


// 8. UPDATE PRIORITY FILTER STYLES

function updatePriorityStyles() {
    const buttons = document.querySelectorAll("[data-priority-filter]");

    buttons.forEach(function (button) {
        const isActive =
            button.dataset.priorityFilter === currentPriorityFilter;

        button.className = isActive
            ? "priority-filter rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white dark:bg-lime-300 dark:text-stone-950"
            : "priority-filter rounded-full bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-600 dark:bg-white/5 dark:text-stone-300";
    });
}


// 9. CALCULATE DASHBOARD STATISTICS

function updateStatistics() {
    const total = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const remaining = total - completed;

    const highPriority = tasks.filter(function (task) {
        return task.priority === "high" && !task.completed;
    }).length;

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("remainingTasks").textContent = remaining;

    document.getElementById("highPriorityTasks").textContent = highPriority;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progressPercent").textContent =
        `${percentage}%`;

    document.getElementById("progressBar").style.width =
        `${percentage}%`;

    let message;

    if (total === 0) {
        message = "Add your first task and start making progress.";
    } else if (percentage === 100) {
        message = "Everything is done. Excellent progress!";
    } else {
        message = `${completed} of ${total} tasks completed. Keep going.`;
    }

    document.getElementById("progressMessage").textContent = message;
}



// 10. CHECK WHICH TASKS SHOULD BE DISPLAYED

function matchesCurrentFilter(task) {
    const today = getToday();

    switch (currentFilter) {
        case "today":
            return task.dueDate === today && !task.completed;

        case "upcoming":
            return task.dueDate !== "" &&
                task.dueDate > today &&
                !task.completed;

        case "completed":
            return task.completed;

        default:
            return true;
    }
}

function getVisibleTasks() {
    return tasks.filter(function (task) {
        const matchesView = matchesCurrentFilter(task);

        const matchesPriority =
            currentPriorityFilter === "all" ||
            task.priority === currentPriorityFilter;

        const searchContent =
            `${task.text} ${task.category} ${task.priority}`
                .toLowerCase();

        const matchesSearch = searchContent.includes(searchTerm);

        return matchesView && matchesPriority && matchesSearch;
    });
}


// 11. DISPLAY TASKS

function renderTasks() {
    taskList.replaceChildren();

    const visibleTasks = getVisibleTasks();

    const filterInfo = filterDetails[currentFilter];

    document.getElementById("taskSectionTitle").textContent =
        filterInfo.title;

    document.getElementById("taskSectionDescription").textContent =
        filterInfo.description;

    document.getElementById("visibleTaskCount").textContent =
        `${visibleTasks.length} ${visibleTasks.length === 1 ? "task" : "tasks"}`;

    if (visibleTasks.length === 0) {
        const emptyMessage = document.createElement("li");

        emptyMessage.className =
            "rounded-2xl border border-dashed border-stone-300 px-5 py-12 text-center dark:border-white/15";

        const emptyTitle = document.createElement("p");

        emptyTitle.className = "font-semibold";

        const emptyDescription = document.createElement("p");

        emptyDescription.className =
            "mt-2 text-sm text-stone-500 dark:text-stone-400";

        if (tasks.length === 0) {
            emptyTitle.textContent = "Your list starts here";
            emptyDescription.textContent =
                "Add a task using the form on the right.";
        } else {
            emptyTitle.textContent = "No matching tasks";
            emptyDescription.textContent =
                "Try another filter or add a new task.";
        }

        emptyMessage.append(emptyTitle, emptyDescription);

        taskList.appendChild(emptyMessage);

        return;
    }

    visibleTasks.forEach(function (task) {
        const listItem = document.createElement("li");

        listItem.className =
            "flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-lime-400 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#171d17] dark:hover:border-lime-300/40";

        // LEFT SIDE: checkbox and task information

        const leftSide = document.createElement("div");

        leftSide.className = "flex min-w-0 items-start gap-3";

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.className =
            "mt-1 h-4 w-4 shrink-0 cursor-pointer accent-lime-600";

        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.text} as completed`
        );

        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        const details = document.createElement("div");

        details.className = "min-w-0";

        const taskText = document.createElement("p");

        taskText.textContent = task.text;

        taskText.className = task.completed
            ? "break-words text-sm font-medium text-stone-400 line-through"
            : "break-words text-sm font-semibold text-stone-800 dark:text-stone-100";

        const metadata = document.createElement("div");

        metadata.className =
            "mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 dark:text-stone-400";

        const category = document.createElement("span");

        category.textContent = task.category;

        const separator = document.createElement("span");

        separator.textContent = "·";

        const dueDate = document.createElement("span");

        const today = getToday();

        if (!task.dueDate) {
            dueDate.textContent = "No due date";
        } else if (!task.completed && task.dueDate < today) {
            dueDate.textContent = `Overdue · ${formatDate(task.dueDate)}`;
            dueDate.className = "font-semibold text-rose-600 dark:text-rose-300";
        } else if (!task.completed && task.dueDate === today) {
            dueDate.textContent = "Due today";
            dueDate.className = "font-semibold text-amber-700 dark:text-amber-300";
        } else {
            dueDate.textContent = `Due ${formatDate(task.dueDate)}`;
        }

        metadata.append(category, separator, dueDate);

        details.append(taskText, metadata);

        leftSide.append(checkbox, details);

        // RIGHT SIDE: priority and delete button

        const rightSide = document.createElement("div");

        rightSide.className =
            "flex flex-wrap items-center gap-2 pl-7 sm:pl-0";

        const priorityBadge = document.createElement("span");

        const priorityStyles = {
            high: "bg-rose-100 text-rose-700 dark:bg-rose-300/10 dark:text-rose-300",
            medium: "bg-amber-100 text-amber-800 dark:bg-amber-300/10 dark:text-amber-300",
            low: "bg-sky-100 text-sky-700 dark:bg-sky-300/10 dark:text-sky-300"
        };

        priorityBadge.className =
            `rounded-full px-3 py-1.5 text-xs font-semibold ${priorityStyles[task.priority]}`;

        priorityBadge.textContent =
            task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.className =
            "rounded-lg px-3 py-2 text-xs font-semibold text-stone-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-stone-400 dark:hover:bg-rose-300/10 dark:hover:text-rose-300";

        deleteButton.setAttribute(
            "aria-label",
            `Delete task: ${task.text}`
        );

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        rightSide.append(priorityBadge, deleteButton);

        listItem.append(leftSide, rightSide);

        taskList.appendChild(listItem);
    });
}


// 12. ADD A TASK

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        return;
    }

    const newTask = {
        id: crypto.randomUUID(),
        text: text,
        completed: false,
        priority: priorityInput.value,
        dueDate: dueDateInput.value,
        category: categoryInput.value
    };

    tasks.unshift(newTask);

    saveTasks();

    taskForm.reset();

    // Return the form to its default priority.
    priorityInput.value = "medium";

    // Show the newly created task.
    currentFilter = "all";
    currentPriorityFilter = "all";
    searchTerm = "";
    searchInput.value = "";

    updateSidebarStyles();
    updatePriorityStyles();

    refreshDashboard();

    taskInput.focus();
});


// 13. COMPLETE OR UNCOMPLETE A TASK

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

    refreshDashboard();
}


// 14. DELETE A TASK

function deleteTask(taskId) {
    tasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });

    saveTasks();

    refreshDashboard();
}


// 15. CONNECT THE SIDEBAR FILTERS

document.querySelectorAll("[data-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        updateSidebarStyles();

        renderTasks();
    });
});


// 16. CONNECT THE PRIORITY FILTERS

document.querySelectorAll("[data-priority-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
        currentPriorityFilter = button.dataset.priorityFilter;

        updatePriorityStyles();

        renderTasks();
    });
});


// 17. CONNECT SEARCH


searchInput.addEventListener("input", function () {
    searchTerm = searchInput.value.trim().toLowerCase();

    renderTasks();
});


// 18. REFRESH ALL DASHBOARD INFORMATION

function refreshDashboard() {
    updateStatistics();
    renderTasks();
}


// 19. START THE APPLICATION

updateSidebarStyles();
updatePriorityStyles();
refreshDashboard();