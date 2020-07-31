let key = 'b46e0399b18e0132c4c34e7071caa187'

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

      
    })
    .catch(err => {
      console.log(err)
    })

  axios.get(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}`)
    .then(res => {
      let uv = document.createElement('p')
      uv.id = 'uv'
      uv.textContent = 'UV Index: '

      let uvSpan = document.createElement('span')
      uvSpan.id = 'uvNumber'
      uv.classList.add('rounded')


    })
})


<h3 id="uv">UV Index: <span id="uvNumber" class="rounded">${res}