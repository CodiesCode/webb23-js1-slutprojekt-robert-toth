const DONE = 4;
const baseUrl = "https://api.openweathermap.org/"
const apiKey = "676c72c916e72c31ba00527baf05ec4e"

const getLatLongUrl = (searchTerm) => {
  return `${baseUrl}geo/1.0/direct?q=${searchTerm}&limit=1&appid=${apiKey}`;
}

const getWeatherDataUrl = (lat, lon) => {
  return `${baseUrl}data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
}

const makeRequest = (url) => {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === DONE) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(new Error('HTTP status code: ' + xhr.status));
        }
      }
    };

    xhr.onerror = function () {
      reject(new Error('Network error'));
    };

    try {
      xhr.send();
    } catch (error) {
      reject(error);
    }
  });
}

async function submitForm(event) {
  event.preventDefault(); // Prevent form from submitting and refreshing the page
  
  const container = document.getElementById("container");

  const errorElement = document.createElement("p");
  if (errorElement !== null) {
    errorElement.remove();
  }
  errorElement.className = "error";
  errorElement.textContent = "The site you’re looking for cannot be found. This might be due to our servers being down or that the city you’re searching for doesn’t exist in our database."
  
  const inputElement = document.getElementById("input-text");
  const searchTerm = inputElement.value;

  let box = document.getElementById("box");
  if (box !== null) {
    box.remove()
  }
  box = document.createElement("div");
  box.id = "box";
  container.appendChild(box);

  try {
    const getlatLong = await makeRequest(getLatLongUrl(searchTerm));
    const { lat, lon } = JSON.parse(getlatLong)[0];

    const getWeatherData = await makeRequest(getWeatherDataUrl(lat, lon));
    const weatherData = JSON.parse(getWeatherData);

    const temp = weatherData.main.temp;
    const windSpeed = weatherData.wind.speed;
    const weatherDescription = weatherData.weather[0].description;
    const iconSrc = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`;

    const searchTermElement = document.createElement("p");
    searchTermElement.className = "search-term";
    searchTermElement.textContent = searchTerm.toUpperCase();
    box.appendChild(searchTermElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.className = "description";
    descriptionElement.textContent = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
    box.appendChild(descriptionElement);

    const iconElement = document.createElement("img");
    iconElement.className = "temperature-icon"
    iconElement.src = iconSrc;
    box.appendChild(iconElement);

    const tempElement = document.createElement("p");
    box.appendChild(tempElement);
    tempElement.className = "temperature";
    tempElement.textContent = `Temperature: ${Math.round(temp)} C`;

    const windSpeedElement = document.createElement("p")
    windSpeedElement.className = "windspeed"
    windSpeedElement.textContent = `Windspeed: ${Math.round(windSpeed)} m/s`;
    box.appendChild(windSpeedElement);

  } catch (error) {
    console.error(error);
    box.appendChild(errorElement);
  }
}
