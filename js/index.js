const API_KEY = "09bb1067c7ed223efc355e91ebf386ed";
const pattern = /^[a-zA-Z\s]+$/
const formSearchCity = document.querySelector('#form-search-city');
const inputSearchCity = document.querySelector('#city');

const formAddCity = document.querySelector('#form-add-city');
const inputAddCity = document.querySelector('#add-city');


let watchList = JSON.parse(localStorage.getItem("Watch cities")) || [];

document.addEventListener('DOMContentLoaded', () =>
{
  displayWatchList();
});

formSearchCity.addEventListener('submit', (e) =>
{
  e.preventDefault();
  const city = inputSearchCity.value.trim();
  const message = document.querySelector('.search-message');
  if (city.length === 0 || city.length === "")
  {
    message.classList.add('error');
    message.innerText = ` Veuillez saisir un nom de ville correct !`;
    clearMessage(message);
    return
  }

  if (pattern.test(city))
  {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=fr&units=metric`, {
    }).then(response =>
    {
      return response.json();
    }).then(data =>
    {
      console.log(data);

      if (data.name)
      {
        displayInfo(data);
        inputSearchCity.value = "";
        return
      }
      message.classList.add('error');
      message.innerText = ` Aucune ville ne correspond à votre recherche !`
      clearMessage(message);
      inputSearchCity.value = "";
      return

    })
  } else
  {
    message.classList.add('error');
    message.innerText = ` Merci de saisir un nom de ville valide !`
    clearMessage(message);
    inputSearchCity.value = "";
    return
  }

})

formAddCity.addEventListener('submit', (e) =>
{
  e.preventDefault();
  const city = inputAddCity.value.trim();
  const message = document.querySelector('.add-message');

  if (pattern.test(city))
  {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=fr&units=metric`, {
      method: "POST",
    }).then(response =>
    {
      return response.json();
    })
      .then(data =>
      {
        console.log(data)
        if (!data.name)
        {
          message.classList.add('error');
          message.innerText = ` Aucune ville correspondante à votre recherche trouvée !`
          clearMessage(message);
          inputAddCity.value = "";
          return
        }
        console.log(data);
        addCity(data);;
        inputAddCity.value = "";
        clearMessage(message);
        displayInfo(data);


      })
      .catch(e =>
      {
        console.log(e)
      })
  } else
  {
    message.classList.add('error');
    message.innerText = ` Merci de saisir un nom de ville valide !`
    clearMessage(message);
    inputAddCity.value = "";
    return
  }



})


const addCity = (data) =>
{

  const message = document.querySelector('.add-message');
  if (watchList.includes(`${data.name}`))
  {
    message.classList.add('error');
    message.innerText = `${data.name} figure déjà dans votre liste de suivie !`;
    clearMessage(message);
    inputAddCity.value = "";
    return
  }
  watchList.push(data.name);
  const dataString = JSON.stringify(watchList);
  localStorage.setItem("Watch cities", dataString);

  message.classList.add('success');
  message.innerText = `${data.name} a bien été ajouté à votre liste de suivie !`;
  // Affichage de la liste de suivie
  displayWatchList();

}

const displayInfo = (data) =>
{
  console.log(data)
  const temp = Math.round(data.main.temp);
  const tempMin = Math.round(data.main.temp_min);
  const tempMax = Math.round(data.main.temp_max);
  const wind = Math.round(data.wind.speed * 3.6);
  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);
  const iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@4x.png`;
  document.querySelector('.meteo-infos').innerHTML = `
  <h2> Météo à ${data.name} </h2>
  <img src="${iconUrl}" alt="Weather icon">
   <p>Température : ${temp} °C</p>
   <p>Minimun : ${tempMin} °C</p>
   <p>Maximum : ${tempMax} °C</p>
   <p>Taux d'humidité : ${data.main.humidity} %</p>
        <p>Temps : ${data.weather[0].description}</p>
        <p>Vent : ${wind} km/h</p>
        <p>Lever du soleil : ${sunrise.getHours()}h${sunrise.getMinutes()}</p>
        <p>Coucher : ${sunset.getHours()}h${sunset.getMinutes()} </p>
  
  `;
}

const removeCity = (data) => 
{
  watchList = watchList.filter(city => city !== data);
  localStorage.setItem("Watch cities", JSON.stringify(watchList));
  displayWatchList();
}

const clearMessage = (target) =>
{
  setTimeout(() =>
  {
    target.classList.remove('success', 'error');
    target.innerText = "";
  }, 3000);

}


const displayWatchList = () =>
{
  //  console.log(watchList)
  const container = document.querySelector('.watch-list-container');
  container.innerHTML = "";
  watchList.forEach((city) =>
  {
    container.innerHTML += `
  <div class="city-in-list">
        <span name-city-list>${city}</span> <button class="btn-remove">Retirer de la liste</button>
      </div>
  `
  })
  const spansCityName = document.querySelectorAll('.city-in-list > span');
  spansCityName.forEach((span) =>
  {
    span.addEventListener('click', (e) =>
    {
      e.preventDefault();
      const city = e.target.innerText;
      getWeather(city)
    })
  })

  const removeBtns = document.querySelectorAll('.btn-remove');
  removeBtns.forEach((btn) =>
  {
    btn.addEventListener('click', (e) =>
    {
      removeCity(e.target.parentElement.children[0].innerText);
      displayWatchList();
    })

  })

};

const getWeather = async (city) =>
{
  try
  {
    const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=fr&units=metric`, {
    });
    const response = await request.json();
    // console.log(response);
    displayInfo(response)
  } catch (error)
  {
    console.log(error)
  }

}




