<template>
  <div class="wrapper-favorite">
    <h1>Улюблені міста:</h1>
    <div class="weather-container" v-for="(city, index) in newCityArray" :key="index" :class="{ 'highlighted-city': city.isHighlighted }">
      <h2>{{ city.name }}</h2>
      <img :src="'https://openweathermap.org/img/w/' + city.icon + '.png'" :alt="city.description">
      <h3>Температура {{ city.temperature }}°C </h3>
      <p>Тиск: {{ city.pressure }} гПа</p>
      <p>Швидкість вітру: {{ city.windSpeed }} м/с</p>
      <button class="weather-btn_delete" @click="deleteCity(index)">Видалити</button>
      <button class="weather-btn_5days" @click="get5DayForecast(city)">Показати погоду на 5 днів</button>
      <div v-if="city.show5DaysForecast">
        <h4>Прогноз погоди на 5 днів:</h4>
        <div class="container_five_days" v-for="(day, i) in city.forecast" :key="i">
          <p class="p_date">{{ day.date }}</p>
          <p><strong>Температура: </strong>{{ day.temperature }}°C</p>
          <p class="p_desc">{{ day.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex';
export default {
  name: 'FavoriteView',
  computed: {
    ...mapState(['newCityArray']),
  },
  created() {
    this.$store.commit('setNewCityArray', JSON.parse(localStorage.getItem('newCityArray') || '[]'));
    window.addEventListener('storage', () => {
      this.$store.commit('setNewCityArray', JSON.parse(localStorage.getItem('newCityArray') || '[]'));
    });
  },
  methods: {
    deleteCity(index) {
      this.newCityArray.splice(index, 1);
      localStorage.setItem('newCityArray', JSON.stringify(this.newCityArray));
    },
   async get5DayForecast(city) {
  const updatedCity = { ...city, show5DaysForecast: !city.show5DaysForecast };
  const updatedCityIndex = this.newCityArray.findIndex((item) => item.name === city.name);
  this.newCityArray.splice(updatedCityIndex, 1, updatedCity);
  localStorage.setItem('newCityArray', JSON.stringify(this.newCityArray));
  if (updatedCity.show5DaysForecast) {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city.name}&appid=9e0c0b81e69f8f703822e588b6e3cf05&units=metric`);
      const data = await response.json();
      if (response.ok) {
        const forecastData = data.list.filter((item, index) => index % 8 === 0).map((item) => ({
          date: new Date(item.dt * 1000).toLocaleDateString(),
          temperature: Math.round(item.main.temp),
          description: item.weather[0].description,
        }));
        updatedCity.forecast = forecastData;
        const updatedCityIndex = this.newCityArray.findIndex((item) => item.name === city.name);
        this.newCityArray.splice(updatedCityIndex, 1, updatedCity);
        localStorage.setItem('newCityArray', JSON.stringify(this.newCityArray));
      } else {
        console.log('Error getting 5-day forecast');
      }
    } catch (error) {
      console.log(error);
    }
  }
},

},
};
</script>
<style scoped>

h1 {
  color: white;
  font-size: 36px;
  margin-top: 30px;
  margin-bottom: 30px;
}

h2 {
  color: white;
  font-size: 28px;
  margin-bottom: 10px;
}

h3 {
  color: white;
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 10px;
}

h4 {
  color: white;
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.p_date{
  color: white;
  font-size: 20px;
  margin-bottom: 10px;
}

.p_desc{
  margin-top: 7px;
  font-size: 19px;
}


.weather-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.weather-btn_delete {
  margin: 10px;
  background-color: #f44336;
  border-radius: 10px;
  padding: 10px;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.weather-btn_delete:hover {
  background-color: #da3b3b;
}

.weather-btn_5days {
  margin: 10px;
  background-color: #3b9fa8;
  border-radius: 10px;
  padding: 10px;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.weather-btn_5days:hover {
  background-color: #327c87;
}


.weather_desc {
  margin-top: 10px;
  color: white;
  font-size: 20px;
}

.weather_desc p {
  margin: 5px 0;
}


.wrapper-favorite {
  min-width: 1200px;
  margin: 0 auto;
  background-color: rgba(38, 131, 155, 0.5);
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

.weather-container {
  border-radius: 20px;
  padding: 20px;
  margin: 20px 20px;
  width: 300px;
  background: #3b9fa8;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

.weather-container.highlighted-city {
  border: 5px solid yellow;
}

.container_five_days {
  border-radius: 20px;
  padding: 20px;
  margin: 10px;
  background: #327c87;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}
@media screen and (max-width: 1200px) {
  .wrapper-favorite {
    min-width: 960px;
  }
  
  .weather-container {
    width: 200px;
  }
}




@media screen and (max-width: 1058px) {
  .wrapper-favorite {
    min-width: 500px;
  }
  
  .weather-container {
    width: 150px;
  }
}

@media screen and (max-width: 600px) {
  .wrapper-favorite {
    min-width: 300px;
  }
  
  .weather-container {
    width: 150px;
  }
}
</style>
