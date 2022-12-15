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
  location;
});
function searchQuestion(value) {
  let data = JSON.parse(localStorage.getItem("question"));
  let result = data.filter((element) => {
    if (element.subject.toLowerCase().includes(value)) {
      return true;
    }
    if (element.subject.toUpperCase().includes(value)) {
      return true;
    }
  });
  // console.log(result.length);
  if (result.length > 0) {
    div.innerText = "";
    result.forEach((value) => {
      displayQuestionOnUI(value);
    });
  } else {
    let error = new Object();
    div.innerText = "";
    error.subject = "No Match Found :)";
    error.question = "Sorry ! there seems no matching result found";
    error.upvote = 0;
    error.downvote = 0;
    displayQuestionOnUI(error);
  }
}

newquestion.onclick = () => {
  // location.reload();

  question_area_div.style.display = "block";
  response_area_div.style.display = "none";
};

submit.onclick = postQuestion;

var questionstemp = readQuestionFromStorage();
var questions = questionstemp.sort(function (a, b) {
  return -a.upvote - -b.upvote;
});

function displayQuestionAll() {
  var questions = readQuestionFromStorage();

  var questions = questionstemp.sort(function (a, b) {
    return -a.upvote - -b.upvote;
  });
  questions.forEach(function (question) {
    displayQuestionOnUI(question);
  });
}
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

  if (subject.value < 1 || question.value < 1) {
    alert("Please Enter the valid  Questions ");
    div.innerText = "";
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

    storeIntoStorageQuestion(questionobj);
    storeIntoStorageId(id);
    subject.value = "";
    question.value = "";
    console.log(questionobj);
    location.reload();
  }
}

function displayQuestionOnResponseUI(value) {
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
    let data = JSON.parse(localStorage.getItem("question"));
    data.forEach((value) => {
      displayQuestionOnUI(value);
    });
    question_area_div.style.display = "block";
    response_area_div.style.display = "none";
  });
  var oldData = localStorage.getItem("question");
  oldData = JSON.parse(oldData);
  oldData.forEach((element) => {
    if (
      (element._id == value._id && value.subject.length > 0) ||
      value.question.length > 0
    ) {
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
    console.log("post response is clicked");

    let responsername = document.getElementById("responsername");
    let comment = document.getElementById("comment");
    var responseobj = new Object();
    if (responsername.value.length < 1 || comment.value.length < 1) {
      alert("plese enter valid details");
      displayQuestionOnResponseUI(value);
    }
    //   console.log(subject.value, question.value);
    else {
      responseobj._id = value._id;
      console.log(value);
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
      console.log(element.responsername);
      fragment.className = "questions-background";
      elementSubject.innerText = element.responsername;
      elementQuestion.innerText = element.comment;
      //   //   console.log(elementSubject, elementQuestion);
      fragment.appendChild(elementSubject);
      fragment.appendChild(elementQuestion);
      responses_div.appendChild(fragment);

      //   console.log("child appended");

      console.log(responses_div);
    }
  });
}

function displayQuestionOnUI(value) {
  let fragment = document.createElement("div");
  let elementSubject = document.createElement("h1");
  let elementQuestion = document.createElement("p");
  let upvote = document.createElement("div");
  let downvote = document.createElement("div");

  upvote.innerHTML =
    '<i class="fa-solid fa-arrow-up ">' + value.upvote + "</i>";
  downvote.innerHTML =
    '<i class="fa-solid fa-arrow-down">' + value.downvote + "</i>";
  upvote.className = "d-inline bg-success mx-1 py-2 my-3";
  downvote.className = "d-inline bg-danger mx-1 py-2 my-3";
  fragment.className = "questions-background py-2";
  elementSubject.innerText = value.subject;
  elementQuestion.innerText = value.question;

  upvote.addEventListener("click", () => {
    // console.log(count);
    value.upvote = value.upvote + 1;
    updateVote(value);
    div.innerText = "";
    displayQuestionAll();
  });
  downvote.addEventListener("click", () => {
    // console.log(count);
    value.downvote = value.downvote - 1;
    updateDownvote(value);
    div.innerText = "";
    displayQuestionAll();
  });
  function updateDownvote(value) {
    let oldData = JSON.parse(localStorage.getItem("question"));
    oldData.forEach((element) => {
      if (element._id == value._id) {
        element.downvote = value.downvote;
      }
    });
    localStorage.setItem("question", JSON.stringify(oldData));
  }
  function updateVote(value) {
    let oldData = JSON.parse(localStorage.getItem("question"));
    oldData.forEach((element) => {
      if (element._id == value._id) {
        element.upvote = value.upvote;
      }
    });
    localStorage.setItem("question", JSON.stringify(oldData));
  }

  fragment.addEventListener("click", () => {
    question_area_div.style.display = "none";
    response_area_div.style.display = "block";
    displayQuestionOnResponseUI(value);
  });
  console.log(upvote, downvote);
  fragment.appendChild(elementSubject);
  fragment.appendChild(elementQuestion);
  fragment.appendChild(upvote);
  fragment.appendChild(downvote);
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
