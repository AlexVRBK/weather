<template>
  <div class="app-wrapper_container" :class="{ 'dark-mode': darkMode }">
    <div class="app-container">
      <div class="app-wrapper">
          <div class="weather">
            <div v-if="loading" class="loader"></div>
              <div v-else>
                <h1>{{ city }}</h1>
                <img :src="weatherIcon" :alt="weather">
                <h1>{{ currentTranslations.weather.temperature }}: {{ temperature }}°C</h1>
                <p>{{ currentTranslations.weather.weather }}: {{ weather }}</p>
                <p>{{ currentTranslations.weather.humidity }}: {{ humidity }}%</p>
                <p>{{ currentTranslations.weather.wind_speed }}: {{ windSpeed }} m/s</p>
              </div>
        </div>
        <div class="btn-dark">
          <div class="label-wrapper">
            <label for="dark-mode-toggle">{{ currentTranslations.dark_mode_toggle }}</label>
            <input type="checkbox" id="dark-mode-toggle" v-model="darkMode">
          </div>
          
          <div class="logo-title_wrapper">
            <div class="logo_title"><img class="logo-title_img" src="@/assets/images/logo2.png" alt=""> {{ currentTranslations.logo_title }}</div>
          </div>

           <div class="btn-language">
            <button id="language-toggle" @click="toggleLanguage">{{ currentLanguage }}</button>

          </div>
        </div>
        <div>
          <img alt="Vue logo" src="@/assets/logo.png" class="logo">
        </div>
      </div> 
      <nav class="nav-wrapper">
        <router-link to="/">{{ currentTranslations.nav.home }}</router-link> |
        <router-link to="/favorite">{{ currentTranslations.nav.favorite }}</router-link> |
        <router-link to="/chart">{{ currentTranslations.nav.chart }}</router-link>
      </nav>
    </div>
    <router-view/>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      loading: true,
      city: '',
      temperature: '',
      weather: '',
      humidity: '',
      windSpeed: '',
      weatherIcon: '',
      darkMode: false,
      language: 'en',
    translations: {
      en: {
        nav: {
          home: 'Home',
          favorite: 'Favorite',
          chart: 'Chart'
        },
        weather: {
          temperature: 'Temperature',
          weather: 'Weather',
          humidity: 'Humidity',
          wind_speed: 'Wind Speed'
        },
        dark_mode_toggle: 'Dark Mode',
        logo_title: 'Weather-App',
        label_city: 'Write'
      },
      uk: {
        nav: {
          home: 'Головна',
          favorite: 'Улюблені',
          chart: 'Графік'
        },
        weather: {
          temperature: 'Температура',
          weather: 'Погода',
          humidity: 'Вологість',
          wind_speed: 'Швидкість вітру'
        },
        dark_mode_toggle: 'Перемкнути режим',
        logo_title: 'Додаток Погоди',
        label_city: 'Введите название города'
      }
    },
    }
  },
  async created() {
    await this.getLocation();
    await this.getWeather();
  },
  methods: {
    async getLocation() {
      const response = await axios.get('https://ipapi.co/json/');
      this.city = response.data.city;
    },
    async getWeather() {
      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&lang=${this.language}&appid=9e0c0b81e69f8f703822e588b6e3cf05`); // добавляем языковый параметр к запросу API
      const weatherData = weatherResponse.data;
      this.temperature = weatherData.main.temp;
      this.weather = weatherData.weather[0].description;
      this.humidity = weatherData.main.humidity;
      this.windSpeed = weatherData.wind.speed;
      this.weatherIcon = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
      this.loading = false;
    },
  toggleLanguage() {
  this.language = this.language === 'en' ? 'uk' : 'en';
  this.getWeather();
},


  },
  computed: {
    currentLanguage() { 
      if (this.language === 'en') {
        return 'EN';
      } else {
        return 'UK';
      }
    },
    currentTranslations() {
    return this.translations[this.language];
  },
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;900&display=swap');
#app {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  transition: all 0.5s ease-in-out;
}

nav {
  padding: 30px;
  font-size: 22px;
  a {
    font-weight: bold;
    font-size: 20px;
    color: #06080a;
    text-decoration: none;

    &.router-link-exact-active {
      color: #2cb1bd;
    }
  }
}

.app-container{
  max-width: 1200px;
  margin: 0 auto;
}

.nav-wrapper{
  background: #2796a0;
  border-radius: 10px;
}

.logo-title_wrapper{
  margin-top: 70px;
}

.logo_title{
  font-family: 'Saira Condensed', sans-serif;
  font-weight: bold;
  font-size: 50px;
  color: #01808b;
}

.logo-title_img{
  width: 50px;
  height: 50px;
}

.label-wrapper{
  margin-top: 20px;
}

.btn-language{
  margin-top: 150px;
  padding-bottom: 20px;
}

.app-wrapper{
  display: flex;
  justify-content: space-between;
}

.weather {
  min-width: 350px;
  padding-bottom: 15px;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 270px;
  font-family: Arial, sans-serif;
  font-size: 1.2rem;
  color: #1d1c1c;
  background-color: rgba(145, 206, 221, 0.5);
  border-radius: 10px;
    & p{
      font-size: 18px;
      font-weight: bold;
    }
}

.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
  margin-top: 50px;
 
  
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.logo{
  margin-top: 35px;
  width: 150px;
  height: 150px;
}

#language-toggle {
  display: inline-block;
  background-color: #2796a0;
  color: #0c0b0b;
  font-weight: bold;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

#language-toggle:hover {
  background-color: #0b494e;
}


h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

p {
  margin: 0;
}

.temperature {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.weather-description {
  font-size: 1.5rem;
}

.app-wrapper_container{
    background-image: url("@/assets/images/day.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    min-height: 100vh;
    
}

.dark-mode {
  background-image: url("@/assets/images/dark.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}

.dark-mode nav a {
  color: #fff;
}

.dark-mode .weather {
  color: #fff;
}





label[for="dark-mode-toggle"] {
  font-size: 20px;
  font-weight: bold;
  color: #030303;
  margin-right: 10px;
}


#dark-mode-toggle[type="checkbox"] {
  appearance: none;
  width: 40px;
  height: 20px;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  background-color: #b3b3b3;
}


#dark-mode-toggle[type="checkbox"]::before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: rgb(248, 245, 245);
  border-radius: 50%;
  transition: 0.2s;
}


#dark-mode-toggle[type="checkbox"]:checked::before {
  transform: translateX(20px);
  background-color: #0f4449;
}


#dark-mode-toggle[type="checkbox"]:checked {
  background-color: #2796a0;
}

@media only screen and (max-width: 1400px) {
  
  
  .app-wrapper {
    margin-right: 30px;
    margin-left: 30px;
  }
}
@media only screen and (max-width: 1200px) {
  
  .app-container {
    max-width: 100%;
    padding: 0 15px;
  }
  
  .logo-title_wrapper {
    margin-top: 50px;
  }
  
  .btn-language {
    margin-top: 100px;
  }
  
  .weather {
    min-width: 250px;
  }
}

@media only screen and (max-width: 768px) {
  .app-wrapper{
   justify-content: center;
  }
  .weather {
    display: none;
  }
}

@media only screen and (max-width: 450px) {
  .app-wrapper{
   flex-direction: column;
  }
  .logo_title {
    font-size: 40px;
  }
}

</style>
