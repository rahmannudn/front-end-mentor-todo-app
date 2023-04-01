"use strict";

const sectionList = document.querySelectorAll(".section");
const todosLength = document.querySelector(".todos-length");
const todoSectionContainer = document.querySelector(".todos-section");
const todosContainer = document.querySelector(".todos-list");
const btnClearCompleted = document.querySelector(".btn-clear");
const btnToggleTheme = document.querySelector("#theme-toggle");
const iconToggleTheme = document.querySelector("#icon-toggle");
const inputTodo = document.querySelector(".input-todo");
const todosLengthLabel = document.querySelector(".todos-length");
const html = document.querySelector("html");

class Todo {
  constructor(task) {
    this.taskName = task;
    this.isCompleted = false;
  }
}

class App {
  #temporaryTodo = [];
  constructor() {
    btnToggleTheme.addEventListener("click", this._toggleTheme.bind(this));
    todoSectionContainer.addEventListener(
      "click",
      this._clearActiveStyle.bind(this)
    );
    btnClearCompleted.addEventListener(
      "click",
      this._clearAllCompletedTask.bind(this)
    );
    inputTodo.addEventListener("keypress", this._newTodo.bind(this));
    this._createStorage();
    this._renderTodo(this.#temporaryTodo);
    this._displayTodosLength();
    this._setTheme();
  }

  _clearAllCompletedTask() {
    const completedTasks = this.#temporaryTodo.filter(
      (data) => data.isCompleted
    );
    completedTasks.forEach((data) => {
      const index = this.#temporaryTodo.indexOf(data);
      this.#temporaryTodo.splice(index, 1);
    });

    this._pullTodosToStorage();
    this._getTodosFromStorage();
    this._renderTodo(this.#temporaryTodo);
    this._displayTodosLength();
  }

  _createStorage() {
    if (!localStorage.getItem("task")) {
      localStorage.setItem("task", "");
      return;
    }
    this._getTodosFromStorage();
  }

  _pullTodosToStorage() {
    localStorage.setItem("task", JSON.stringify(this.#temporaryTodo));
  }

  _displayTodosLength(length = this.#temporaryTodo.length) {
    todosLengthLabel.innerText = length;
  }

  _getTodosFromStorage() {
    this.#temporaryTodo = JSON.parse(localStorage.getItem("task"));
  }

  _newTodo(e) {
    const inputValue = inputTodo.value;
    if (e.key !== "Enter" || !inputValue) return;
    const currentTodo = new Todo(inputValue);
    this.#temporaryTodo.push(currentTodo);

    if (this.#temporaryTodo.length > 6) {
      this.#temporaryTodo.splice(0, 1);
    }

    this._pullTodosToStorage();
    this._getTodosFromStorage();
    this._renderTodo(this.#temporaryTodo);
    this._displayTodosLength();
    inputTodo.value = "";
    this._setTheme();
  }

  _setTheme(theme = "light") {
    localStorage.getItem("theme") || localStorage.setItem("theme", theme);
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "light") {
      html.classList = "";
      iconToggleTheme.src = "./images/icon-moon.svg";
    }

    if (currentTheme === "dark") {
      html.classList.add("dark");
      btnToggleTheme.classList.remove("light");
      btnToggleTheme.classList.add("dark");
      iconToggleTheme.src = "./images/icon-sun.svg";
    }
  }
  _renderTodo(todos) {
    todosContainer.innerHTML = "";

    todos.forEach((data, index) => {
      const html = `
      <div
          class="todo-item p-5 flex items-center gap-x-4 bg-veryLightGray border-b-[.2px] border-lightGrayishBlue dark:bg-veryDarkDesaturatedBlue first:rounded-tr-md first:rounded-tl-md"
        >
          <label
            for="check"
            class="w-full h-7 border-none bg-veryLightGray text-slate-600 hover:text-slate-900 flex items-center gap-x-4 dark:bg-transparent dark:text-slate-300 dark:hover:text-white"
          >
            <input
              type="checkbox"
              class="relative w-6 h-6 rounded-full border-[1px] appearance-none checked:bg-gradient-to-br checked:from-firstGradientColor checked:to-secondGradientColor before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-full checked:before:bg-[url('./images/icon-check.svg')] checked:before:bg-no-repeat checked:before:bg-center checked:before:bg-[length:.9rem] focus:ring-0 focus:outline-none peer check-todo check-todo" ${
                data.isCompleted ? "checked" : ""
              }
            />
            <span class="text-lg peer-checked:line-through"
              >${data.taskName}</span
            >
          </label>

          <button class="btn-delete">
            <img src="images/icon-cross.svg" alt="" />
          </button>
        </div> 
    `;
      todosContainer.insertAdjacentHTML("afterbegin", html);

      const btnDelete = document.querySelector(".btn-delete");
      btnDelete.addEventListener("click", () => {
        todos.splice(index, 1);
        this.#temporaryTodo = todos;
        this._pullTodosToStorage();
        this._getTodosFromStorage();
        this._renderTodo(todos);
        this._displayTodosLength();
      });

      const btnCheckTodo = document.querySelector(".check-todo");
      btnCheckTodo.addEventListener("click", () => {
        const currentTodo = this.#temporaryTodo[index];
        currentTodo.isCompleted
          ? (currentTodo.isCompleted = false)
          : (currentTodo.isCompleted = true);

        this._pullTodosToStorage();
        this._getTodosFromStorage();
        this._renderTodo(this.#temporaryTodo);
        this._displayTodosLength();
      });
    });
  }

  _darkState(element) {
    element.classList = "";
    element.classList.add("light");
    localStorage.setItem("theme", "dark");
    iconToggleTheme.src = "./images/icon-sun.svg";
    html.classList.add("dark");
  }

  _lightState(element) {
    element.classList = "";
    element.classList.add("dark");
    localStorage.setItem("theme", "light");
    iconToggleTheme.src = "./images/icon-moon.svg";
    html.classList.remove("dark");
  }

  _toggleTheme(e) {
    const target = e.target;
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "light") {
      this._darkState(target);
    }

    if (currentTheme === "dark") {
      this._lightState(target);
    }
  }

  _clearActiveClass() {
    sectionList.forEach((el) => {
      el.classList = "section cursor-pointer hover:text-black";
    });
  }

  _clearActiveStyle(e) {
    const target = e.target;
    if (!target.classList.contains("section")) return;
    this._clearActiveClass();
    target.classList =
      "section cursor-pointer text-transparent bg-clip-text bg-gradient-to-br from-firstGradientColor to-secondGradientColor font-bold section-active";

    const activeSection = document.querySelector(
      ".todos-section .section-active"
    );

    if (activeSection.innerText === "All") {
      this._renderTodo(this.#temporaryTodo);
      this._displayTodosLength();
    }

    const completeTodos = this.#temporaryTodo.filter(
      (task) => task.isCompleted
    );
    if (activeSection.innerText === "Completed") {
      this._renderTodo(completeTodos);
      this._displayTodosLength(completeTodos.length);
    }

    const activeTodos = this.#temporaryTodo.filter((task) => !task.isCompleted);
    if (activeSection.innerText === "Active") {
      this._renderTodo(activeTodos);
      this._displayTodosLength(activeTodos.length);
    }
  }
}

const app = new App();
