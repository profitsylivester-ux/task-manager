# Task Manager

A simple, modern task manager and notes app built with React and Vite.

This app lets you manage daily tasks and write longer notes, all in one place. It is a learning project built step by step to understand React fundamentals — components, props, state, events, lists, conditional rendering, and useEffect.

---

## Live Demo

Coming soon — will be deployed on Vercel.

---

## Features

### Tasks
- Add new tasks
- Mark tasks as completed
- Edit task titles inline
- Delete tasks
- Copy task title to clipboard
- Share task using the browser's native share (on supported devices)
- Filter tasks by All / Active / Completed
- Live tab title showing task count

### Notes
- Add new notes with title and body
- Edit existing notes
- Delete notes
- Long-form text support (multi-line body)
- Notes are shown as cards with a left accent border

### UI
- Tab switcher between Tasks and Notes
- Clean, modern card layout
- Rounded corners, soft shadows
- Hover effects on buttons, tasks, and notes
- Fully responsive-ready structure

---

## Tech Stack

- **React** — UI library
- **Vite** — fast build tool and dev server
- **JavaScript (ES6+)** — application logic
- **CSS3** — styling (flexbox, transitions)
- **Git & GitHub** — version control

---

## Folder Structure

task-manager/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── TaskList.jsx
│   │   └── NotesList.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md

---

## What I Learned Building This

- Setting up a React project with Vite
- Understanding the React project structure
- Creating components
- Passing props between components
- Managing state with `useState`
- Handling events (clicks, input changes, key presses)
- Rendering lists with `map()` and `key`
- Conditional rendering (if, &&, ternary)
- Using `useEffect` for side effects
- Controlled inputs
- Building a real, working UI from scratch

---

## Roadmap

Planned improvements:

- [ ] Save tasks and notes to localStorage (survive page refresh)
- [ ] Pin important tasks to the top
- [ ] Group tasks by category
- [ ] Add due dates and priorities
- [ ] Add search
- [ ] Deploy to Vercel
- [ ] Connect to a backend and database (Node.js + MongoDB)
- [ ] Add authentication
- [ ] Rebuild with React Router for multiple pages

---

## How to Run Locally

1. Clone the repository:

git clone https://github.com/profitsylivester-ux/task-manager.git

2. Install dependencies:

npm install

3. Start the dev server:

npm run dev

4. Open the browser at:

http://localhost:5173/

---

## Deployment

This project will be deployed on **Vercel**.

Instructions will be added after deployment.

---

## Author

**Faida Sylivester Mosses**
Electronics & Embedded Systems Engineer | Frontend Developer
Dar es Salaam, Tanzania

- **GitHub:** https://github.com/profitsylivester-ux
- **LinkedIn:** https://www.linkedin.com/in/faida-sylivester-31b86a391/
- **Email:** profitsylivester@gmail.com

---

## License

This project is open for learning and reference.
