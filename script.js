document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.querySelector(".todo-form");
  const todoInput = document.querySelector(".todo-input");
  const todoList = document.querySelector(".todo-list");
  const filterButtons = document.querySelectorAll(".filter-button");

  // Get user's name every time page loads
  let userName = prompt("Welcome! What's your name?");

  // Handle empty/null username
  if (!userName) {
    userName = "Guest";
  }
  // Display welcome message
  const welcomeMessage = `Welcome ${userName}! What would you like to accomplish today?`;
  const title = document.querySelector(".todo-title");
  title.textContent = welcomeMessage;
  title.style.color = "#fefae0";

  let todos = [];

  function addTodo(text) {
    const todo = {
      text,
      completed: false,
    };
    todos.push(todo);
    renderTodo(todo);
    saveTodos();
  }

  function renderTodo(todo) {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${todo.text}</span>
      <div>
        <button class="complete-button">${
          todo.completed ? "Undo" : "Complete"
        }</button>
        <button class="delete-button">Delete</button>
      </div>
    `;
    if (todo.completed) li.classList.add("completed");

    li.querySelector(".complete-button").onclick = () => {
      todo.completed = !todo.completed;
      li.classList.toggle("completed");
      li.querySelector(".complete-button").textContent = todo.completed
        ? "Undo"
        : "Complete";
      saveTodos();
    };

    li.querySelector(".delete-button").onclick = () => {
      todos = todos.filter((t) => t !== todo);
      li.remove();
      saveTodos();
    };

    todoList.appendChild(li);
  }

  function saveTodos() {
    // Save todos with the username as key
    localStorage.setItem(`tasks_${userName}`, JSON.stringify(todos));
  }

  function loadTodos() {
    // Load todos specific to the username
    todos = JSON.parse(localStorage.getItem(`tasks_${userName}`)) || [];
    todoList.innerHTML = "";
    todos.forEach(renderTodo);
  }

  todoForm.onsubmit = (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
      addTodo(text);
      todoInput.value = "";
    }
  };

  filterButtons.forEach((button) => {
    button.onclick = () => {
      const filter = button.dataset.filter;
      const items = todoList.children;

      for (let item of items) {
        const isCompleted = item.classList.contains("completed");
        item.style.display =
          filter === "all"
            ? ""
            : filter === "completed"
            ? isCompleted
              ? ""
              : "none"
            : filter === "pending"
            ? !isCompleted
              ? ""
              : "none"
            : "";
      }
    };
  });

  loadTodos();
});
