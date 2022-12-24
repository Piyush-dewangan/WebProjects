let search = document.getElementById("search");
let cityInput = document.getElementById("city");
let displayarea = document.getElementById("displayarea");

cityInput.addEventListener("keyup", (event) => {
  if (event.code === "Enter" && event.target.value.length > 0) {
    searchCity(event.target.value);
    event.target.value = "";
  }
});

async function searchCity(city) {
  fetch(
    `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=fAil27iSW3Ta8z8prh2tAFIfzyzRN8SE&q=${city}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      cityInput.innerText = "";
      showClimate(data[0].Key, data[0].Country.ID, data[0].EnglishName);
    })
    .catch((error) => {
      alert("Please enter valid city name");
      cityInput.innerText = "";
    });
}

async function showClimate(key, country, city) {
  fetch(
    `http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=fAil27iSW3Ta8z8prh2tAFIfzyzRN8SE`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      displayCityTemp(data[0], country, city);
    })
    .catch((error) => {
      console.log(error);
    });
}
function displayCityTemp(data, countryname, cityname) {
  console.log(data);
  let fragment = document.createElement("div");
  let timeLogo = document.createElement("div");
  let city = document.createElement("h3");
  let temperature = document.createElement("h3");
  let country = document.createElement("h5");
  let status = document.createElement("p");
  status.innerText = `${data.WeatherText}`;
  city.innerText = `${cityname}`;
  country.innerText = `${countryname}`;
  temperature.innerText = `${Math.ceil(data.Temperature.Metric.Value)} 'C`;
  fragment.className = "card mx-3 my-3 py-2 px-2 rounded shadow-sm";
  fragment.style.width = "12rem";
  fragment.style.height = "15rem";
  console.log(data.IsDayTime);
  // <img src="" alt="" />
  if (data.WeatherIcon < 10) {
    data.WeatherIcon = "0" + data.WeatherIcon;
  }
  timeLogo.innerHTML = `<img src="https://developer.accuweather.com/sites/default/files/${data.WeatherIcon}-s.png"/>`;
  // if (data.IsDayTime) {
  //   timeLogo.innerHTML =
  //     '<i class="fa-solid fa-sun " style="font-size:5rem"></i>';
  // } else {
  //   timeLogo.innerHTML =
  //     ' <i class="fa-solid fa-moon" style="font-size:5rem"></i>';
  // }
  console.log(timeLogo);
  fragment.appendChild(city);
  fragment.appendChild(country);
  fragment.appendChild(temperature);
  fragment.appendChild(timeLogo);
  fragment.appendChild(status);
  displayarea.appendChild(fragment);
}
search.addEventListener("click", () => {
  searchCity(cityInput.value);
});
