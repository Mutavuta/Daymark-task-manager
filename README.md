# Daymark · Student Task Manager

Daymark is a responsive student task manager designed to help organise tasks, track progress, and keep daily priorities clear. It has a clean dashboard, light and dark themes, and saves tasks in the browser so they remain available after a refresh.

## Features

- **Create tasks** with a task name, priority, category, and optional due date.
- **Complete and delete tasks** from the task list.
- **Task priorities:** High, Medium, and Low.
- **Categories:** Study, Work, Personal, and Other.
- **Dashboard statistics:** total tasks, completed tasks, remaining tasks, and outstanding high-priority tasks.
- **Progress tracking** with a completion percentage and progress bar.
- **Search** tasks by task name, category, or priority.
- **Task views:** All Tasks, Today, Upcoming, and Completed.
- **Priority filters** to show High, Medium, or Low priority tasks.
- **Light and dark modes**, with the selected theme remembered in the browser.
- **Responsive layout** for desktop and smaller screens.
- **Browser storage** using `localStorage`, so tasks and theme preference persist across page refreshes in the same browser and site origin.

## Tech Stack

- HTML5
- Tailwind CSS 4
- JavaScript (vanilla JavaScript, ES modules)
- Vite
- Browser `localStorage`

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) and npm. The project uses Vite to run the local development server and Tailwind CSS to build the styles.

### 1. Clone the repository

Replace `YOUR-USERNAME` with the GitHub account that owns the repository.

```bash
git clone https://github.com/YOUR-USERNAME/daymark-student-task-manager.git
cd daymark-student-task-manager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Vite will print a local URL in the terminal, typically `http://localhost:5173/`. Open that URL in your browser. Keep the terminal running while you use the development server.

### 4. Build for production

```bash
npm run build
```

Vite creates the production build in the `dist/` directory. To preview that build locally, run:

```bash
npm run preview
```

## Project Structure

```text
daymark-student-task-manager/
├── index.html          # Dashboard structure and form
├── style.css           # Tailwind CSS entry point and dark-mode variant
├── script.js           # Task logic, filters, statistics, and theme toggle
├── vite.config.js      # Vite and Tailwind plugin configuration
├── package.json        # Project scripts and dependencies
├── package-lock.json   # Locked npm dependency versions
├── .gitignore          # Files and folders Git should ignore
└── README.md           # Project documentation
```

## How Data Is Stored

Daymark currently uses the browser's `localStorage` for tasks and the chosen theme. No backend or account system is required for the current version.

- Tasks are stored under the key `daymark-tasks`.
- The theme preference is stored under the key `daymark-theme`.
- Stored data belongs to the browser profile and site origin being used. It does not automatically sync to another device or browser.
- Clearing the browser's site data can remove saved tasks and theme preferences. Export or backup functionality is not currently included.

## Using Daymark

1. Enter a task name in **Capture a task**.
2. Choose its priority and category, and optionally select a due date.
3. Select **Create task**.
4. Use the checkbox to mark a task complete or the **Delete** button to remove it.
5. Use the sidebar, priority filters, or search field to find tasks.
6. Select the theme button in the header to switch between light and dark modes.

## Development Notes

- Do not commit `node_modules/` or `dist/`; both are generated locally and should be ignored by Git.
- Keep `package.json` and `package-lock.json` in version control so others can install the project dependencies.
- This project is a front-end application. Task data is stored locally in the browser and is not sent to a server.

## License

No license has been added yet. Unless a license is added to the repository, others should not assume they have permission to reuse or redistribute the code.