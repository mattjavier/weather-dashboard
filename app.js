let key = ''

document.getElementById('searchBtn').addEventListener('click', event => {
  event.preventDefault()

  let city = document.getElementById('citySearch').value
  let lat = ''
  let lon = ''
  
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`)
    .then(res => {
      lat = res.data.coord.lat
      lon = res.data.coord.lon
      document.getElementById('cityConditions').innerHTML = `
      <h3 id="cityName">${res.data.name}</h3>
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
})


{/* <h3 id="uv">UV Index: <span id="uvNumber" class="rounded">${res} */}
// axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
      //   .then(res => {
      //     let forecast = res.data.list

      //     for (let i = 5; i < forecast.length; i += 8) {
      //       console.log(forecast[i])
      //       let forecastElem = document.createElement('div')
      //       forecastElem.innerHTML = `
      //       <h1>${forecast[i].dt_txt}</h1>
      //       <h2>Weather: ${forecast[i].weather[0].description}</h2>
      //       <h3>Temperature: ${forecast[i].main.temp}</h3>
      //       <h3>Humidity: ${forecast[i].main.humidity}</h3>
      //       <h3>Wind Speed: ${forecast[i].wind.speed}</h3>
      //       `
      //       document.getElementById('forecast').append(forecastElem)
      //     }
      //   })
      //   .catch(err => { console.log(err) })