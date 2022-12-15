var input = document.getElementById("ip");
var parent = document.getElementById("parent");

var todos = readTodosFromStorage();

todos.forEach(function (todo) {
  displayTodoOnUI(todo);
});

// btn.addEventListener("click", function () {
//   var value = input.value;

//   createTodo(value);

//   input.value = "";
// });

input.addEventListener("keyup", function (event) {
  if (event.code === "Enter" && event.target.value.length > 0) {
    var value = event.target.value;

    createTodo(value);

    event.target.value = "";
  }
});

function createTodo(value) {
  displayTodoOnUI(value);

  storeDataInStorage(value);
}

function displayTodoOnUI(value) {
  //   var documentFragment=document.createDocumentFragment();
  var parent2 = document.createElement("div");
  parent2.className = "d-flex  flex-nowrap";
  var p = document.createElement("h4");
  p.innerText = value;
  var editBtn = document.createElement("button");
  var deleteBtn = document.createElement("button");
  var checkBtn = document.createElement("input");
  checkBtn.type = "checkbox";
  checkBtn.className = "checkBtn";
  deleteBtn.className = "btn btn-primary text-right ml-2 my-2";
  deleteBtn.innerText = "Delete";
  editBtn.className = "btn btn-primary text-right ml-2 my-2";
  editBtn.innerText = "Edit";
  deleteBtn.addEventListener("click", (event) => {
    deleteTodo(value);
    parent2.remove();
  });
  editBtn.addEventListener("click", (event) => {
    var prevvalue = value;
    p.innerText = prompt("What to edit?");
    value = p.innerText;
    editTodo(prevvalue, value);
  });
  checkBtn.addEventListener("click", (event) => {
    p.classList.toggle("checked");
    if(p.style.textDecoration=="line-through"){

    }
    else {
      
    }
  });

  parent2.appendChild(p);
  if (p.innerText.length > 0) {
    parent2.appendChild(deleteBtn);
    parent2.appendChild(editBtn);
    parent2.appendChild(checkBtn);
    parent.appendChild(parent2);
  }
}
function editTodo(prevvalue, value) {
  var oldData = localStorage.getItem("todo");
  oldData = oldData.replace(prevvalue, value);
  localStorage.setItem("todo", oldData);
}
function deleteTodo(value) {
  var oldData = localStorage.getItem("todo");
  if (oldData.indexOf(value) === 0) {
    oldData = oldData.replace(value, "");
  } else {
    value = "," + value;
    oldData = oldData.replace(value, "");
  }
  localStorage.setItem("todo", oldData);
}

function storeDataInStorage(value) {
  value = replaceComma(value);

  var oldData = localStorage.getItem("todo");

  if (oldData) {
    oldData = oldData + "," + value;
  } else {
    oldData = value;
  }

  localStorage.setItem("todo", oldData);
}

function replaceComma(value) {
  return value.replaceAll(",", "@@^^**!!");
}

function readTodosFromStorage() {
  var todosString = localStorage.getItem("todo") || "";

  var todos = todosString.split(",");

  return todos.map(function (todo) {
    return todo.replaceAll("@@^^**!!", ",");
  });
}
