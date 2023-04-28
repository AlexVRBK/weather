<template>
    <div class="weather-forecast_wrapper">
      <h2>{{ city }} </h2>
      <div class="weather-forecast">
        <div class="forecast-item" v-for="(data, index) in forecastData" :key="index">
          <div class="date">{{ formatDate(data.dt) }}</div>
          <div class="description">
            <img :src="`http://openweathermap.org/img/w/${data.weather[0].icon}.png`" :alt="data.weather[0].description" class="weather-icon">
            {{ data.weather[0].description }}
          </div>
          <div class="temperature">{{ data.main.temp }}°C</div>
          <div class="feels-like">Відчувається: {{ data.main.feels_like }}°C</div>
          <div class="wind-speed">Швидкість вітру: {{ data.wind.speed }} m/s</div>
          <div class="humidity">Вологість: {{ data.main.humidity }} %</div>
          <div class="pressure">Тиск: {{ data.main.pressure }} hPa</div>
        </div>
        <div v-if="isLoading" class="loader"></div>
    </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'WeatherForecast',
  data() {
    return {
      city: '',
      forecastData: [],
      errorMessage: '',
      isLoading: false,
     
    };
  },
  mounted() {
    axios
      .get('https://ipapi.co/json/')
      .then((response) => {
        this.city = response.data.city;
        this.getForecast();
      })
      .catch((error) => {
        console.error(error);
        this.errorMessage = 'Could not determine your location.';
      });

    
  },
  methods: {
    getForecast() {
      const apiKey = '9e0c0b81e69f8f703822e588b6e3cf05';
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&units=metric&appid=${apiKey}`;
      this.isLoading = true;
      axios
        .get(apiUrl)
        .then((response) => {
          this.forecastData = response.data.list.filter((data, index) => index % 8 === 0);
         
        })
        .catch((error) => {
          console.error(error);
          this.errorMessage = 'Could not retrieve weather data.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    formatDate(timestamp) {
      const date = new Date(timestamp * 1000);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const day = days[date.getDay()];
      const month = date.getMonth() + 1;
      const dateNum = date.getDate();
      return `${day}, ${month}/${dateNum}`;
    },
     
    
},
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@400;600&display=swap');
h2 {
  color: black;
  font-family: 'Saira Condensed', sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: #01808b;
}
.chart-container {
  margin-top: 40px;
  width: 100%;
  height: 300px;
}
.weather-forecast {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.forecast-item {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  font-family: Arial, sans-serif;
  font-size: 1.1rem;
  color: #1d1c1c;
  background-color: rgba(145, 206, 221, 0.5);
  border-radius: 10px;
}
.weather-forecast {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  gap: 10px;
}

.forecast-item {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  
}

.forecast-item .date {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.forecast-item .description {
  margin-bottom: 10px;
}

.forecast-item .temperature {
  font-size: 30px;
  font-weight: bold;
}

.error {
  color: red;
  font-weight: bold;
}
@media screen and (max-width: 1200px) {
  .weather-forecast {
    max-width: 800px;
  }
}

@media screen and (max-width: 850px) {
  .weather-forecast {
    max-width: 600px;
    display: flex;
    flex-direction: column;
  }
}

@media screen and (max-width: 480px) {
  .weather-forecast {
    max-width: 360px;
  }
}

@media screen and (max-width: 360px) {
  h2 {
    font-size: 25px;
  }
  
  .chart-container {
    height: 200px;
  }
  
  .forecast-item {
    padding: 10px;
    font-size: 1rem;
    margin-top: 10px;
  }
  
  .forecast-item .date {
    font-size: 16px;
  }
  
  .forecast-item .temperature {
    font-size: 24px;
  }
}

</style>