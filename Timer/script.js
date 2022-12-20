let [minutes, seconds, milliseconds] = [0, 0, 0];
let start = document.getElementById("start");
let reset = document.getElementById("reset");
let lapOn = document.getElementById("lap");
let timer = document.getElementById("timer");
let lap = 1;
let time = null;
start.addEventListener("click", () => {
  if (start.style.backgroundColor == "black") {
    start.style.backgroundColor = "red";
    clearInterval(time);

    lapOn.style.display = "none";
    reset.style.display = "inline";
    reset.addEventListener("click", () => {
      time = null;
      minutes = 0;
      seconds = 0;
      milliseconds = 0;
      let laparea = document.getElementById("laparea");
      laparea.innerHTML = "";
      // lapOn.removeEventListener("click");
      timer.innerHTML = `00:00:000`;
      lap = 1;
    });
  } else {
    lapOn.style.display = "inline";
    reset.style.display = "none";

    start.style.backgroundColor = "black";
    time = setInterval(displayTimer, 10);
  }
});
lapOn.addEventListener("click", () => {
  createTimeLap(minutes, seconds, milliseconds);
});
function createTimeLap(minutes, seconds, milliseconds) {
  let laparea = document.getElementById("laparea");
  let fragmentment = document.createElement("div");
  fragmentment.className = "d-flex justify-content-between";
  let h1 = document.createElement("h1");

  let h2 = document.createElement("h1");
  let m = minutes < 10 ? "0" + minutes : minutes;
  let s = seconds < 10 ? "0" + seconds : seconds;
  let ml = milliseconds < 10 ? "0" + milliseconds : milliseconds;

  h1.innerText = ` Lap:-` + "     " + `     ${lap}`;
  h2.innerText = `   ${m}:${s}:${ml}`;

  fragmentment.appendChild(h1);
  fragmentment.appendChild(h2);
  laparea.appendChild(fragmentment);
  lap++;
}
function displayTimer() {
  milliseconds += 10;
  if (milliseconds == 1000) {
    milliseconds = 0;
    seconds += 1;
    if (seconds == 60) {
      seconds = 0;
      minutes += 1;
    }
  }
  let m = minutes < 10 ? "0" + minutes : minutes;
  let s = seconds < 10 ? "0" + seconds : seconds;
  let ml = milliseconds < 10 ? "0" + milliseconds : milliseconds;

  timer.innerHTML = `${m}:${s}:${ml}`;
}
