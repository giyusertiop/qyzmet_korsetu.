
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");

const addTaskBtn = document.getElementById("addTaskBtn");
const searchInput = document.getElementById("searchInput");
const filterTasks = document.getElementById("filterTasks");
const themeBtn = document.getElementById("themeBtn");

// Тапсырма қосу
addTaskBtn.addEventListener("click", function () {
    const title = taskInput.value.trim();

    if (title === "") {
        alert("Тапсырма атауын енгізіңіз!");
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        date: taskDate.value,
        priority: taskPriority.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskDate.value = "";
    taskPriority.value = "Орташа";
});

// Enter арқылы қосу
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTaskBtn.click();
    }
});

// Тапсырмаларды сақтау
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Тапсырмаларды көрсету
function renderTasks() {
    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const filter = filterTasks.value;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchText);

        const matchesFilter =
            filter === "all" ||
            (filter === "completed" && task.completed) ||
            (filter === "pending" && !task.completed);

        return matchesSearch && matchesFilter;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = "<p>Тапсырмалар табылмады.</p>";
    }

    filteredTasks.forEach(task => {
        const div = document.createElement("div");

        div.className = "task";

        if (task.completed) {
            div.classList.add("completed");
        }

        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const date = document.createElement("p");
        date.textContent = "Мерзімі: " + (task.date || "Көрсетілмеген");

        const priority = document.createElement("span");
        priority.className = "priority";
        priority.textContent = "Маңыздылығы: " + task.priority;

        info.append(title, date, priority);

        const buttons = document.createElement("div");
        buttons.className = "task-buttons";

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "↩" : "✓";
        completeBtn.title = "Орындалу күйін өзгерту";

        completeBtn.addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        const editBtn = document.createElement("button");
        editBtn.textContent = "✎";
        editBtn.className = "edit-btn";
        editBtn.title = "Өңдеу";

        editBtn.addEventListener("click", () => {
            const newTitle = prompt("Жаңа тапсырма атауы:", task.title);

            if (newTitle !== null && newTitle.trim() !== "") {
                task.title = newTitle.trim();
                saveTasks();
                renderTasks();
            }
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.className = "delete-btn";
        deleteBtn.title = "Өшіру";

        deleteBtn.addEventListener("click", () => {
            if (confirm("Тапсырманы өшіргіңіз келе ме?")) {
                tasks = tasks.filter(item => item.id !== task.id);
                saveTasks();
                renderTasks();
            }
        });

        buttons.append(completeBtn, editBtn, deleteBtn);

        div.append(info, buttons);

        taskList.appendChild(div);
    });

    updateStatistics();
}

// Статистиканы жаңарту
function updateStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
}

// Іздеу
searchInput.addEventListener("input", renderTasks);

// Сүзгілеу
filterTasks.addEventListener("change", renderTasks);

// Қараңғы режим
themeBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "☀️";
    } else {
        themeBtn.textContent = "🌙";
    }
});

// Бастапқыда тапсырмаларды көрсету
renderTasks();
