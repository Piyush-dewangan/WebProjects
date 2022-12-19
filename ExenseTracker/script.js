let newexpence = document.getElementById("newexpence");
let add = document.getElementById("add");
let newexpence_screen = document.getElementById("newexpence_screen");
let history = document.getElementById("history");
let history_list = document.getElementById("history_list");
createHistoryItemsAll();
function createHistoryItemsAll() {
  history_list.innerText = "";
  console.log("createHIstory all");
  let datas = readExpenceFromStorage();
  datas.forEach((data) => {
    createHistoryUI(data);
  });
  updateExpencesOnUI();
}
function updateExpencesOnUI() {
  let credit = document.getElementById("credit");
  let debit = document.getElementById("debit");
  let expences1 = document.getElementById("expences1");
  let expences2 = document.getElementById("expences2");
  let expencestotal = document.getElementById("expencestotal");
  let sum = 0;
  let sum1 = 0;
  let datas = readExpenceFromStorage();
  datas.forEach((data) => {
    if (data.expences_in_number > 0) {
      sum = sum + parseFloat(data.expences_in_number);
    } else {
      sum1 = sum1 + parseFloat(data.expences_in_number);
    }
  });
  credit.innerText = sum;
  debit.innerText = sum1;

  expences1.style.width = (sum / (sum + -sum1)) * 100 + "%";
  //   console.log((sum / (sum - sum1)) * 100 + "%", sum, sum1);
  expences2.style.width = (-sum1 / (sum + -sum1)) * 100 + "%";

  expencestotal.innerText = sum + sum1;
  //   console.log("sum=", sum, "sum1=", sum1);
}

function createHistoryUI(historyobj) {
  let superfragment = document.createElement("div");
  let fragment = document.createElement("div");
  let heading = document.createElement("h5");
  let text = document.createElement("h6");
  let deleteBtn = document.createElement("div");
  let history_list = document.getElementById("history_list");
  let br = document.createElement("br");
  deleteBtn.innerHTML = ' <i class="fa-solid fa-trash"></i>';
  deleteBtn.className = "py-1 px-1";
  console.log(historyobj);

  heading.innerText = historyobj.expence_for;
  text.innerText = "$ " + historyobj.expences_in_number;
  if (historyobj.expences_in_number < 0) {
    superfragment.className =
      "bg-danger container-fluid my-1 px-3 shadow-sm rounded";
  } else {
    superfragment.className =
      "bg-success container-fluid  my-1 px-3 shadow-sm rounded";
  }
  fragment.className =
    "d-flex justify-content-between mx-1  py-3 bg-light shadow-sm rounded";
  deleteBtn.addEventListener("click", () => {
    console.log("deleter in prgress");
    oldData = readExpenceFromStorage();
    oldData = oldData.filter((element) => {
      return element._id != historyobj._id;
    });
    localStorage.setItem("expences", JSON.stringify(oldData));
    createHistoryItemsAll();
  });
  fragment.appendChild(heading);
  fragment.appendChild(br);
  fragment.appendChild(text);
  fragment.appendChild(deleteBtn);

  superfragment.appendChild(fragment);
  history_list.appendChild(superfragment);
}
function readExpenceFromStorage() {
  let expenceString = localStorage.getItem("expences");
  if (!expenceString) {
    return [];
  }

  return JSON.parse(expenceString);
}

newexpence.onclick = newExpenceScreen;
function newExpenceScreen() {
  newexpence_screen.style.display = "block";
  history.style.display = "none";
}
add.onclick = homeScreen;
function homeScreen() {
  newexpence_screen.style.display = "none";
  history.style.display = "block";
  let expence_for = document.getElementById("expence_for");
  let expences_in_number = document.getElementById("expences_in_number");
  let id = parseFloat(localStorage.getItem("id") || "1");
  if (isNaN(parseFloat(expences_in_number.value))) {
    alert("please enter valid details");
    expence_for.value = "";
    expences_in_number.value = "";
    createHistoryItemsAll();
  } else {
    let historyobj = new Object();
    historyobj._id = ++id;
    storeIntoStorageId(id);
    historyobj.expence_for = expence_for.value;
    historyobj.expences_in_number = expences_in_number.value;
    // console.log(expence_for.innerText, expences_in_number.innerText);
    expence_for.value = "";
    expences_in_number.value = "";
    storeExpenceIntoStorage(historyobj);
    createHistoryItemsAll();
  }
}
function storeIntoStorageId(value) {
  let oldData = localStorage.getItem("id");
  oldData = value.toString();
  localStorage.setItem("id", oldData);
}
function storeExpenceIntoStorage(object) {
  let oldData = localStorage.getItem("expences");
  if (oldData) {
    oldData = JSON.parse(oldData);
    oldData.push(object);
  } else {
    oldData = [object];
  }
  localStorage.setItem("expences", JSON.stringify(oldData));
}
