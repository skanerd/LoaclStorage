// ライト・ダークモード

var mode = localStorage.getItem("darkMode");

$(".btn_theme").on("click", function () {
  $("body").toggleClass("dark");

  if ($("body").hasClass("dark")) {
    activateDarkMode();
    localStorage.setItem("darkMode", "enabled");
  } else {
    deactivateDarkMode();
    localStorage.setItem("darkMode", "disabled");
  }
});

if (mode == "enabled") {
  activateDarkMode();
} else if (mode == "disabled") {
  deactivateDarkMode();
}

function activateDarkMode() {
  $("body").addClass("dark");
}

function deactivateDarkMode() {
  $("body").removeClass("dark");
}

// memo list

window.onload = loadTasks;
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

function loadTasks() {
  if (localStorage.getItem("tasks") == null) return;
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

  tasks.forEach((task) => {
    const list = document.querySelector("ul");
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${
      task.completed ? "checked" : ""
    }>
          <input type="text" value="${task.task}" class="task ${
      task.completed ? "completed" : ""
    }" onfocus="getCurrentTask(this)" onblur="editTask(this)">
          <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
    list.insertBefore(li, list.children[0]);
  });
}

function addTask() {
  const task = document.querySelector("form input");
  const list = document.querySelector("ul");
  // 内容が空白
  if (task.value === "") {
    alert("メモを入力してください。");
    return false;
  }
  // すでに存在する
  if (document.querySelector(`input[value="${task.value}"]`)) {
    alert("入力内容を確認してくだい。");
    return false;
  }
  
  localStorage.setItem(
    "tasks",
    JSON.stringify([
      ...JSON.parse(localStorage.getItem("tasks") || "[]"),
      { task: task.value, completed: false },
    ])
  );

  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
      <input type="text" value="${task.value}" class="task" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
  list.insertBefore(li, list.children[0]);
  task.value = "";
}

function taskComplete(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach((task) => {
    if (task.task === event.nextElementSibling.value) {
      task.completed = !task.completed;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.nextElementSibling.classList.toggle("completed");
}

function removeTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach((task) => {
    if (task.task === event.parentNode.children[1].value) {
      // メモ削除
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.parentElement.remove();
}

var currentTask = null;

function getCurrentTask(event) {
  currentTask = event.value;
}

function editTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  // 空白チェック
  if (event.value === "") {
    alert("空白は登録できません。");
    event.value = currentTask;
    return;
  }
  // すでに存在
  tasks.forEach((task) => {
    if (task.task === event.value) {
      alert("すでに存在する内容です。");
      event.value = currentTask;
      return;
    }
  });
  // 内容修正
  tasks.forEach((task) => {
    if (task.task === currentTask) {
      task.task = event.value;
    }
  });
  // ローカルストレージに保存
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
