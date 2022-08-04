const yarr = [];
const xarr = [];
const yarr2 = [];

const datetime = () => {
  const date = new Date();
  day =
    date.getFullYear() +
    "-" +
    digit(date.getMonth() + 1) +
    "-" +
    digit(date.getDate());
  xarr[0] = day;
  document.getElementById("date").innerText = day;
  document.getElementById("time").innerText =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
};

const apiKey = "ae2ec1ff3789c66a7496bbffc74fbeef";

function fetchweather(city) {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=metric&appid=" +
      apiKey
  )
    .then((response) => {
      if (!response.ok) {
        alert("No weather found.");
        throw new Error("No weather found.");
      }
      return response.json();
    })
    .then((data) => displayweather(data));
}

const fetchweathercoord = (lat, long) => {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      long +
      "&units=metric&appid=" +
      apiKey
  )
    .then((response) => {
      if (!response.ok) {
        alert("No weather found.");
        throw new Error("No weather found.");
      }
      return response.json();
    })
    .then((data) => displayweather(data));
};

function fetchweatherdaily(city) {
  fetch(
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&units=metric&appid=" +
      apiKey
  )
    .then((response) => {
      if (!response.ok) {
        alert("No weather found.");
        throw new Error("No weather found.");
      }
      return response.json();
    })
    .then((data) => displayweatherforecast(data));
}

function fetchweatherdailycoord(lat, long) {
  fetch(
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      long +
      "&units=metric&appid=" +
      apiKey
  )
    .then((response) => {
      if (!response.ok) {
        alert("No weather found.");
        throw new Error("No weather found.");
      }
      return response.json();
    })
    .then((data) => displayweatherforecast(data));
}

const displayweather = (data) => {
  const { name } = data;
  const { icon, description } = data.weather[0];
  const { temp, humidity } = data.main;
  const { speed, deg } = data.wind;
  yarr[0] = Math.round(temp);
  yarr2[0] = humidity;
  document.getElementById("city").innerText = name;
  document.getElementById("temp").innerText = temp + "°C";
  document.getElementById("icon").src =
    "https://openweathermap.org/img/wn/" + icon + "@2x.png";
  document.getElementById("description").innerText = description;
  document.getElementById("humidity").innerText =
    "Humidity : " + humidity + "%";
  document.getElementById("wind-speed").innerText = "Wind Speed : " + speed;
  document.getElementById("wind-direction").innerText =
    "Wind Direction : " + deg + "°";
};

const displayweatherforecast = (data) => {
  const date = new Date();
  for (j = 1; j < 5; j++) {
    for (i = 0; i < 40; i++) {
      listdate = data.list[i].dt_txt;
      day = date.getDate() + j;
      d =
        date.getFullYear() +
        "-" +
        digit(date.getMonth() + 1) +
        "-" +
        digit(day) +
        " 00:00:00";
      if (d.localeCompare(listdate) === 0) {
        const { temp, humidity } = data.list[i].main;
        const { icon, description } = data.list[i].weather[0];

        yarr[j] = Math.round(temp);
        yarr2[j] = Math.round(humidity);
        xarr[j] = listdate.split(" ")[0];

        document.getElementById("date-" + j).innerText =
          date.getDate() +
          j +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getFullYear();
        document.getElementById("temp-forecast-" + j).innerText = temp + "°C";
        document.getElementById("icon-forecast-" + j).src =
          "https://openweathermap.org/img/wn/" + icon + ".png";
        document.getElementById("description-" + j).innerText = description;
      }
    }
  }

  day =
    date.getFullYear() +
    "-" +
    digit(date.getMonth() + 1) +
    "-" +
    digit(date.getDate());
  xarr[0] = day;

  new Chart("tempChart", {
    type: "line",
    data: {
      labels: xarr,
      datasets: [
        {
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(255,0,255,1.0)",
          borderColor: "rgba(0,0,0,0.1)",
          data: yarr,
        },
      ],
    },
    options: {
      legend: { display: false },
    },
  });
  new Chart("humidityChart", {
    type: "line",
    data: {
      labels: xarr,
      datasets: [
        {
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(255,0,255,1.0)",
          borderColor: "rgba(0,0,0,0.1)",
          data: yarr2,
        },
      ],
    },
    options: {
      legend: { display: false },
    },
  });
};

const digit = (md) => {
  if (md < 10) {
    d = "0" + md;
    return d;
  } else {
    return md;
  }
};

const search = () => {
  input = document.getElementById("search-input").value;
  fetchweather(input);
  fetchweatherdaily(input);
};

document.querySelector(".search button").addEventListener("click", function () {
  search();
});

document
  .getElementById("search-input")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      search();
    }
  });

const getlocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

const position = (position) => {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;

  fetchweathercoord(lat, long);
  fetchweatherdailycoord(lat, long);
};

fetchweatherdaily("delhi");
fetchweather("delhi");

setInterval(() => {
  datetime();
}, 1000);
