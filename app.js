let key = ''

document.getElementById('searchBtn').addEventListener('click', event => {
  event.preventDefault()

  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []
  let city = document.getElementById('citySearch').value
  searchHistory.push(city)
  let lat = ''
  let lon = ''
  
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`)
    .then(res => {
      
      document.getElementById('cityConditions').innerHTML = `
      <h3 id="cityName">${res.data.name} (${moment().format('l')}) <img src="http://openweathermap.org/img/w/${res.data.weather[0].icon}.png"></h3>
      <p id="temp">Temperature: ${res.data.main.temp} \xB0F</p>
      <p id="humidity">Humidity: ${res.data.main.humidity}%</p>
      <p id="windSpeed">Wind Speed: ${res.data.wind.speed} MPH</p>
      `

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

  axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`)
    .then(res => {
      let forecast = res.data.list
      document.getElementById('forecast').innerHTML = ''
      for (let i = 5; i < forecast.length; i += 8) {
        
        let forecastElem = document.createElement('div')
        forecastElem.className = 'card bg-primary text-light rounded days'
        forecastElem.innerHTML = `
        <h4>${moment(forecast[i].dt_txt.slice(0, 10)).format('l')}</h4>
        <img src="http://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png">
        <p>Temp: ${forecast[i].main.temp} \xB0F</p>
        <p>Humidity: ${forecast[i].main.humidity}%</p>
        `
        document.getElementById('forecast').append(forecastElem)
      }
    })
    .catch(err => { console.log(err) })
})


{/* <h3 id="uv">UV Index: <span id="uvNumber" class="rounded">${res} */}
// axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`)
//         .then(res => {
//           let forecast = res.data.list

//           for (let i = 5; i < forecast.length; i += 8) {
//             console.log(forecast[i])
//             let forecastElem = document.createElement('div')
//             forecastElem.innerHTML = `
//             <h1>${forecast[i].dt_txt}</h1>
//             <h2>Weather: ${forecast[i].weather[0].description}</h2>
//             <h3>Temperature: ${forecast[i].main.temp}</h3>
//             <h3>Humidity: ${forecast[i].main.humidity}</h3>
//             <h3>Wind Speed: ${forecast[i].wind.speed}</h3>
//             `
//             document.getElementById('forecast').append(forecastElem)
//           }
//         })
//         .catch(err => { console.log(err) })