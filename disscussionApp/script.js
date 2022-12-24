let submit = document.getElementById("question-submit");
let div = document.getElementById("parent");
let question_area_div = document.getElementById("questionarea");
let response_area_div = document.getElementById("responsearea");
let response_display_div = document.getElementById("responsedisplay");
let responses_div = document.getElementById("responses");
let responsesubmit = document.getElementById("comment-submit");
let newquestion = document.getElementById("newquestion");
let search = document.getElementById("search");

search.addEventListener("keyup", (event) => {
  var value = event.target.value;

  searchQuestion(value);
  // location;
});
function searchQuestion(value) {
  let data = JSON.parse(localStorage.getItem("question"));
  let result = data.filter((element) => {
    if (
      element.subject.includes(value.toLowerCase()) ||
      element.question.includes(value.toLowerCase()) ||
      element.subject.includes(value.toUpperCase()) ||
      element.question.includes(value.toUpperCase())
    ) {
      return true;
    }
  });
  // console.log(result.length);
  if (result.length > 0) {
    div.innerText = "";
    result.forEach((value) => {
      displayQuestionOnUI(value);
    });
    questionstemp = result;
    clearInterval(disp);
  } else {
  
    let error = new Object();
    div.innerText = "";
    error.subject = "No Match Found :)";
    error.question = "Sorry ! there seems no matching result found";
    error.upvote = "";
    error.downvote = "";
    displayQuestionOnUI(error);  clearInterval(disp);
  }
}

newquestion.onclick = () => {
  location.reload();

  question_area_div.style.display = "block";
  response_area_div.style.display = "none";
};

submit.onclick = postQuestion;

var questionstemp = readQuestionFromStorage();
var temppp = 1;
displayQuestionAll();
const disp = function displayQuestionAll() {
  div.innerHTML = "";
  console.log(temppp++);
  var questions = questionstemp.sort(function (a, b) {
    return -a.upvote - -b.upvote;
  });
  questions.forEach(function (question) {
    displayQuestionOnUI(question);
  });
};
function displayQuestionAll() {
  div.innerHTML = "";
  var questions = questionstemp.sort(function (a, b) {
    return -a.upvote - -b.upvote;
  });
  questions.forEach(function (question) {
    displayQuestionOnUI(question);
  });
}
setInterval(disp, 1000);
function readResponseFromStorage() {
  var ResponseString = localStorage.getItem("responses");

  if (!ResponseString) {
    return [];
  }

  return JSON.parse(ResponseString);
}
function readQuestionFromStorage() {
  var QuestionsString = localStorage.getItem("question");

  if (!QuestionsString) {
    return [];
  }

  return JSON.parse(QuestionsString);
}
questions.forEach(function (question) {
  displayQuestionOnUI(question);
});

function postQuestion() {
  let subject = document.getElementById("subject");
  let question = document.getElementById("question");
  let temp1 = subject.value.trim();
  let temp2 = question.value.trim();
  if (temp1 == "" || temp2 == "") {
    alert("Please Enter the valid  Questions ");
    div.innerText = "";
    questionstemp = JSON.parse(localStorage.getItem("question"));
    displayQuestionAll();
  } else {
    var questionobj = new Object();
    //   console.log(subject.value, question.value);
    let id = parseInt(localStorage.getItem("id") || "1");
    questionobj._id = ++id;
    questionobj.subject = subject.value;
    questionobj.question = question.value;
    questionobj.upvote = 0;
    questionobj.downvote = 0;
    questionobj.date = new Date().toString();

    storeIntoStorageQuestion(questionobj);
    storeIntoStorageId(id);
    div.innerText = "";
    questionstemp = JSON.parse(localStorage.getItem("question"));
    displayQuestionAll();

    subject.value = "";
    question.value = "";
    // console.log(questionobj);
  }
}

function displayQuestionOnResponseUI(value) {
  // console.log(" response question", value);
  response_display_div.innerHTML = "";
  let fragment = document.createElement("div");
  let elementSubject = document.createElement("h1");
  let elementQuestion = document.createElement("p");
  let resolveBtn = document.getElementById("resolve-submit");
  value._id;
  //   fragment.className = "prevdiv";
  var oldData = localStorage.getItem("question");
  oldData = JSON.parse(oldData);
  resolveBtn.addEventListener("click", () => {
    oldData = oldData.filter((element) => {
      return element._id != value._id;
    });
    localStorage.setItem("question", JSON.stringify(oldData));
    div.innerText = "";
    questionstemp = JSON.parse(localStorage.getItem("question"));
    displayQuestionAll();
    question_area_div.style.display = "block";
    response_area_div.style.display = "none";
  });

  var oldData = localStorage.getItem("question");
  oldData = JSON.parse(oldData);
  oldData.forEach((element) => {
    if (element._id == value._id) {
      fragment.className = "questions-background";
      elementSubject.innerText = value.subject;
      elementQuestion.innerText = value.question;
      fragment.appendChild(elementSubject);
      fragment.appendChild(elementQuestion);
      response_display_div.appendChild(fragment);
      displayResponseOnUI(value);
    }
  });

  responsesubmit.onclick = function postResponse() {
    // console.log("post response is clicked");

    let responsername = document.getElementById("responsername");
    let comment = document.getElementById("comment");
    var responseobj = new Object();
    let temp1 = responsername.value.trim();
    let temp2 = comment.value.trim();
    if (temp1 == "" || temp2 == "") {
      alert("plese enter valid details");
      displayQuestionOnResponseUI(value);
    }
    //   console.log(subject.value, question.value);
    else {
      responseobj._id = value._id;
      // console.log(value);
      responseobj.responsername = responsername.value;
      responseobj.comment = comment.value;
      responsername.value = "";
      comment.value = "";

      // console.log(responseobj);
      storeIntoStorageResponses(responseobj);
      displayResponseOnUI(value);
    }
  };
}
function displayResponseOnUI(value) {
  var responses = readResponseFromStorage();
  responses_div.innerHTML = "";
  //   console.log(responses);

  responses.forEach((element) => {
    if (element._id == value._id) {
      //   console.log(element._id);
      let fragment = document.createElement("div");
      let elementSubject = document.createElement("h1");
      let elementQuestion = document.createElement("p");
      // console.log(element.responsername);
      fragment.className = "questions-background";
      elementSubject.innerText = element.responsername;
      elementQuestion.innerText = element.comment;
      //   //   console.log(elementSubject, elementQuestion);
      fragment.appendChild(elementSubject);
      fragment.appendChild(elementQuestion);
      responses_div.appendChild(fragment);

      //   console.log("child appended");

      // console.log(responses_div);
    }
  });
}

function displayQuestionOnUI(value) {
  let fragment = document.createElement("div");
  let elementSubject = document.createElement("h1");
  let elementQuestion = document.createElement("p");
  let upvote = document.createElement("div");
  let downvote = document.createElement("div");
  let date = document.createElement("div");
  date.className = "d-inline";

  let dateDiff = dateDiffer(value.date);

  date.innerHTML = `<h4>${dateDiff}</h4>`;
  upvote.innerHTML =
    '<i class="fa-solid fa-arrow-up ">' + value.upvote + "</i>";
  downvote.innerHTML =
    '<i class="fa-solid fa-arrow-down">' + value.downvote + "</i>";
  upvote.className = "d-inline bg-success mx-1 py-2 my-3";
  downvote.className = "d-inline bg-danger mx-1 py-2 my-3";
  fragment.className = "questions-background py-2";
  elementSubject.innerText = value.subject;
  elementQuestion.innerText = value.question;
  if (value.subject != "No Match Found :)") {
    upvote.addEventListener("click", () => {
      // console.log(count);
      value.upvote = value.upvote + 1;
      updateVote(value);
    });
    downvote.addEventListener("click", () => {
      // console.log(count);
      value.downvote = value.downvote - 1;
      updateDownvote(value);
    });
    function updateDownvote(value) {
      let oldData = JSON.parse(localStorage.getItem("question"));
      oldData.forEach((element) => {
        if (element._id == value._id) {
          element.downvote = value.downvote;
        }
      });
      questionstemp = data;
      localStorage.setItem("question", JSON.stringify(oldData));
    }
    function updateVote(value) {
      let oldData = JSON.parse(localStorage.getItem("question"));
      oldData.forEach((element) => {
        if (element._id == value._id) {
          element.upvote = value.upvote;
        }
      });
      questionstemp = oldData;
      localStorage.setItem("question", JSON.stringify(oldData));
    }

    fragment.addEventListener("click", () => {
      question_area_div.style.display = "none";
      response_area_div.style.display = "block";
      displayQuestionOnResponseUI(value);
    });
  }
  // console.log(upvote, downvote);
  fragment.appendChild(elementSubject);
  fragment.appendChild(elementQuestion);
  fragment.appendChild(upvote);
  fragment.appendChild(downvote);
  fragment.appendChild(date);
  div.appendChild(fragment);
}
function storeIntoStorageQuestion(object) {
  let oldData = localStorage.getItem("question");
  if (oldData) {
    oldData = JSON.parse(oldData);
    oldData.push(object);
  } else {
    oldData = [object];
  }
  localStorage.setItem("question", JSON.stringify(oldData));
}
function dateDiffer(date) {
  // 2022-12-23T11:19:43.206Z
  // Fri Dec 23 2022 17:53:47 GMT+0530 (India Standard Time)
  let newDate = new Date();
  let newminute = newDate.getMinutes();
  let seconds = parseInt(date[22] + date[23]);
  let day = parseInt(date[8] + date[9]);
  let hours = parseInt(date[16] + date[17]);
  let minute = parseInt(date[19] + date[20]);
  let newday = parseInt(newDate.getDate());
  let newhours = parseInt(newDate.getHours());
  let newseconds = parseInt(newDate.getSeconds());

  // console.log(day);
  // console.log("date is here",newDate.getDay(),date.toDate().getDay());
  // console.log(newDate.getDate());
  if (
    seconds < newseconds &&
    minute == newminute &&
    hours == newhours &&
    day == newday
  ) {
    return `created a few  seconds ago`;
  } else if (minute < newminute && hours == newhours && day == newday) {
    return `created at ${newminute - minute} minutes ago`;
  } else if (hours < newhours && day == newday) {
    return `created at ${newhours - hours}  hours ago`;
  } else if (day == newday) {
    return `created at ${newday - day} days ago`;
  } else {
    console.log("some error at time");
  }
  // if (newday - day > 0) {
  //   return `created at ${newday - day} days ago`;
  // } else if (newhours - hours > 0 && newminute > minute) {
  //   // console.log(newhours, hours, "sdfds");
  //   return `created at ${newhours - hours}  hours ago`;
  // } else if (newminute - minute > 0 || newhours > hours) {
  //   if (newhours > hours)
  //     return `created at ${newminute + 60 - minute} minutes ago`;
  //   return `created at ${newminute - minute} minutes ago`;
  // } else {
  //   if (newminute > minute)
  //     return `created at ${newseconds + 60 - seconds} minutes ago`;
  //   return `created at few seconds ago`;
  // }
}
function storeIntoStorageResponses(object) {
  let oldData = localStorage.getItem("responses");
  if (oldData) {
    oldData = JSON.parse(oldData);
    oldData.push(object);
  } else {
    oldData = [object];
  }
  localStorage.setItem("responses", JSON.stringify(oldData));
}
function storeIntoStorageId(value) {
  let oldData = localStorage.getItem("id");
  oldData = value.toString();
  localStorage.setItem("id", oldData);
}
