const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

//добавление задачи
form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);

function addTask(event) {
  //отменяет стандартное поведение(перезагрузку страницы)
  event.preventDefault();

  const taskText = taskInput.value;

  //описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  //добавляем задачу в массив с задачами
  tasks.push(newTask);
  saveToLocalStorage();

  renderTask(newTask);

  //очищаем поле ввода и возвращаем на него фокус
  taskInput.value = "";
  taskInput.focus();
  checkEmptyList();
}
//class="btn-action" на кнопке какбы убирает изображение и кликает именно по кнопке
function deleteTask(event) {
  //работаем по событию в tasksList. если прошел клик по элементу без датаатрибута delete, выходим из функции
  if (event.target.dataset.action !== "delete") return;
  const parentNode = event.target.closest("li");

  //определяем ID задачи
  const id = Number(parentNode.id);

  //удаляем задачу из массива. Будут выведены те, у которых индекс не совпадает
  tasks = tasks.filter((task) => task.id !== id);
  saveToLocalStorage();

  //удаляем задачу из разметки
  parentNode.remove();
  checkEmptyList();
}

function doneTask(event) {
  //работаем по событию в tasksList. если прошел клик по элементу без датаатрибута done, выходим из функции
  if (event.target.dataset.action !== "done") return;
  //если по done, функция выполняется дальше
  const parentNode = event.target.closest("li");

  //определяем id задачи
  const id = Number(parentNode.id);
  //возвращаем элемент массива с равными id
  const task = tasks.find((task) => task.id === id);
  //меняем true на false или наоборот
  task.done = !task.done;
  saveToLocalStorage();

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
    <div class="empty-list__title">Список дел пуст</div>
  </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  //формируем CSS класс
  const cssClass = task.done ? "task-title task-title--done" : "task-title";
  //формируем разметку для новой задачи
  const taskHTML = `
<li  id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
  <span class="${cssClass}">${task.text}</span>
  <div class="task-item__buttons">
    <button type="button" data-action="done" class="btn-action">
      <img src="./img/tick.svg" alt="Done" width="18" height="18" />
    </button>
    <button type="button" data-action="delete" class="btn-action">
      <img src="./img/cross.svg" alt="Done" width="18" height="18" />
    </button>
  </div>
</li>`;

  //добавляем задачу на страницу
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
