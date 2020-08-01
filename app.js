let key = ''

const populateHistory = () => {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []

  for (let i = 0; i < searchHistory.length; i++) {
    let btnElem = document.createElement('button')
    btnElem.className = 'btn btn-light border border-secondary text-left text-secondary bg-white history'
    btnElem.dataset.city = searchHistory[i]
    btnElem.textContent = searchHistory[i]

    document.getElementById('cityButtons').prepend(btnElem)

    if (i === searchHistory.length-1) {
      lookup(searchHistory[i])
    }
  }
}

const addToHistory = city => {

  // get local storage 'searchHistory' array or create one
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []
  searchHistory.push(city)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory))

  // dynamically create search history buttons
  let btnElem = document.createElement('button')
  btnElem.className = 'btn btn-light border border-secondary text-left text-secondary bg-white history'
  btnElem.dataset.city = city
  btnElem.textContent = city

  document.getElementById('cityButtons').prepend(btnElem)
}

const lookup = city => {

  // axios request to lookup weather data for city
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`)
    .then(res => {
      
      // create html for cityConditions section
      document.getElementById('cityConditions').innerHTML = `
      <h3 id="cityName">${res.data.name} (${moment().format('l')}) <img src="http://openweathermap.org/img/w/${res.data.weather[0].icon}.png"></h3>
      <p id="temp">Temperature: ${res.data.main.temp} \xB0F</p>
      <p id="humidity">Humidity: ${res.data.main.humidity}%</p>
      <p id="windSpeed">Wind Speed: ${res.data.wind.speed} MPH</p>
      `

      // axios request to get uv index, lat and lon values from response required
      axios.get(`https://api.openweathermap.org/data/2.5/uvi?lat=${res.data.coord.lat}&lon=${res.data.coord.lon}&appid=${key}`)
        .then(res => {
          let uv = document.createElement('p')
          uv.id = 'uv'
          uv.textContent = 'UV Index: '

          let uvSpan = document.createElement('span')
          uvSpan.id = 'uvNumber'
          uvSpan.classList.add('rounded')
          let index = res.data.value
          if (index <= 3) {
            uvSpan.classList.add('bg-success')
          } else if (index > 3 && index <= 7) {
            uvSpan.classList.add('bg-warning')
          } else if (index > 7) {
            uvSpan.classList.add('bg-danger')
          }
          uvSpan.textContent = index

          uv.append(uvSpan)
          document.getElementById('cityConditions').append(uv)
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
    })

  // axios request to get data for five day forecast
  axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`)
    .then(res => {
      let forecast = res.data.list
      document.getElementById('forecast').innerHTML = ''
      for (let i = 5; i < forecast.length; i += 8) {
        
        let forecastElem = document.createElement('div')
        forecastElem.className = 'col ml-3 mr-5 card bg-primary text-light rounded days'
        forecastElem.innerHTML = `
        <h5>${moment(forecast[i].dt_txt.slice(0, 10)).format('l')}</h5>
        <figure><img src="http://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png"></figure>
        <p>Temp: ${forecast[i].main.temp} \xB0F</p>
        <p>Humidity: ${forecast[i].main.humidity}%</p>
        `
        document.getElementById('forecast').append(forecastElem)
      }
    })
    .catch(err => { console.log(err) })
}

populateHistory()

// event listener for search button
document.getElementById('searchBtn').addEventListener('click', event => {
  event.preventDefault()

  let cityName = document.getElementById('citySearch').value
  document.getElementById('citySearch').value = ''

  // add city to search history (render and save to local storage)
  addToHistory(cityName)
  // perform axios requests for city
  lookup(cityName)

})

// event listener for search history buttons
document.addEventListener('click', event => {
  if (event.target.classList.contains('history')) {
    lookup(event.target.dataset.city)
  }
})