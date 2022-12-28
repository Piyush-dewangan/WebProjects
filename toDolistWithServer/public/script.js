var input = document.getElementById("ip");
var parent = document.getElementById("parent");
displayTodoFirst();
function displayTodoFirst() {
  fetch("/savetodo", {})
    .then((response) => {
      // console.log(response.json());
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      displayTodoAll(data);
    })
    .catch((err) => {
      console.log(err);
    });
}
// var todos = readTodosFromStorage();

// todos.forEach(function (todo) {
//   displayTodoOnUI(todo);
// });

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
  fetch("/savetodo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({ task: value, iscompleted: false, id: null }),
  })
    .then((response) => {
      // console.log(response.json());
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      displayTodoAll(data);
    })
    .catch((err) => {
      console.log(err);
    });
}
async function createTodoMod(value) {
  fetch("/checked", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(value),
  })
    .then((response) => {
      // console.log(response.json());
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      if (data) displayTodoAll(data);
    })
    .catch((err) => {
      console.log(err);
    });
}
function displayTodoAll(todos) {
  // let todos = JSON.parse(data);
  parent.innerText = "";
  todos.forEach(function (todo) {
    // console.log("for each me to do", todo);
    displayTodoOnUI(todo);
  });
}
function displayTodoOnUI(value) {
  //   var documentFragment=document.createDocumentFragment();
  var parent2 = document.createElement("div");
  parent2.className = "d-flex  flex-nowrap";
  var p = document.createElement("h4");
  p.innerText = value.task;

  var deleteBtn = document.createElement("button");
  var checkBtn = document.createElement("input");
  checkBtn.type = "checkbox";
  checkBtn.className = "checkBtn";
  deleteBtn.className = "btn btn-primary text-right ml-2 my-2";
  deleteBtn.innerText = "Delete";
  if (value.iscompleted) {
    p.style.textDecoration = "line-through";
    checkBtn.checked = true;
  } else {
    p.style.textDecoration = "none";
  }
  deleteBtn.addEventListener("click", (event) => {
    deleteTodo(value.id);
  });

  checkBtn.addEventListener("click", (event) => {
    if (checkBtn.checked) {
      value.iscompleted = true;
    } else {
      value.iscompleted = false;
    }
    createTodoMod(value);
  });

  parent2.appendChild(p);
  if (p.innerText.length > 0) {
    parent2.appendChild(deleteBtn);

    parent2.appendChild(checkBtn);
    parent.appendChild(parent2);
  }
}

function deleteTodo(value) {
  fetch("/deletetodo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({ id: value }),
  })
    .then((response) => {
      // console.log(response.json());
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      if (data) displayTodoAll(data);
    })
    .catch((err) => {
      console.log(err);
    });
}
