<template>
  <div class="wrapper">
   
    <div class="search-container">
  <label for="city-input">Введіть назву міста:</label>
  <div v-if="selectedCities.length >= 5" class="max-cities-warning">
    Максимум 5 міст
  </div>
  
</div>
<div class="wrapper-search_autocomplete">
    <input type="text" id="city-input" v-model="city" @input="getAutocompleteSuggestions" :disabled="selectedCities.length >= 5" />
    <ul class="autocomplete" v-if="showAutocomplete" >
      <li v-for="(suggestion, index) in autocompleteSuggestions" :key="index" @click="selectAutocompleteSuggestion(suggestion)">
        {{ suggestion.name }}
      </li>
    </ul>
</div>


<div class="weather-container" v-for="(city, index) in selectedCitiesWithHighlight" :key="index" :class="{ 'highlighted-city': city.isHighlighted }">
  <h1>{{ city.name }}</h1>
  <div>
        <img :src="'http://openweathermap.org/img/w/' + city.icon + '.png'" alt="Weather Icon" />
        <h3>{{ city.weather }}</h3>
      </div>
  
 <div class="weather_desc">
    
    <h3>Температура {{ city.temperature }}°C </h3>
    <p>Тиск: {{ city.pressure }} гПа</p>
    <p>Швидкість вітру: {{ city.windSpeed }} м/с</p>
 </div>
  <div class="weather-btn">
    <button class="weather-btn_delete" @click="showDeleteConfirmation(index)">Видалити</button>
    <button class="weather-btn_add" @click="addNewCity(index)">Додати</button>
     <button class="btn btn-primary" @click="showGraphModal(city)">Відкрити графік</button>
<button class="btn btn-primary" @click="showGraph = false">Сховати графік</button>
  </div>
  <weather-chart v-if="showGraph" :cityData="selectedCityData" ref="weatherChart" />
</div>

<div class="modal" v-if="showMaxCitiesWarning">
  <div class="modal-overlay"></div>
  <div class="modal-content">
    <h3>Для додавання видаліть місто</h3>
    <p>Ви перевищели лімит додатих міст</p>
    <div class="modal-buttons">
      
      <button class="modal-button modal-cancel" @click="closeMaxCitiesWarning">Закрити</button>

    </div>
  </div>
</div>

<div class="modal" v-if="showDeleteModal">
  <div class="modal-overlay"></div>
  <div class="modal-content">
    <p>Ви впевнені, що хочете видалити {{ selectedCities[selectedCityIndex].name }} зі списку вибраних міст?</p>
    <div class="modal-buttons">
      <button class="modal-button modal-confirm" @click="deleteCity(selectedCityIndex)">Підтвердити</button>
      <button class="modal-button modal-cancel" @click="closeDeleteConfirmation">Скасувати</button>
    </div>
  </div>
</div>

<div class="modal" v-if="newCityArray.length > 5">
  <div class="modal-overlay"></div>
  <div class="modal-content">
    <p>Досягнуто ліміту</p>
  </div>
</div>
 </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { createStore } from 'vuex';
import WeatherChart from '@/components/WeatherChart.vue';


export default {
  name: 'WeatherCity',
 components: {
  WeatherChart,
},
  data() {
    return {
      city: '',
      autocompleteSuggestions: [],
      showAutocomplete: false,
      selectedCities: [],
      showMaxCitiesWarning: false,
      showDeleteModal: false,
      selectedCityIndex: null,
      showGraph: false,
      selectedCityData: null,
    };
  },
  created() {
   this.$store.commit('setNewCityArray', JSON.parse(localStorage.getItem('newCityArray') || '[]'));
  
  axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${this.getRandomCity()}&units=metric&appid=9e0c0b81e69f8f703822e588b6e3cf05`)
    .then((response) => {
      const cityData = {
         name: response.data.name,
              temperature: response.data.main.temp.toFixed(1),
              icon: response.data.weather[0].icon,
              windSpeed: response.data.wind.speed,
              pressure: response.data.main.pressure,
              weather: response.data.weather[0].description,
              humidity: response.data.main.humidity,
      };
      this.selectedCities.push(cityData);
    })
    .catch(() => {
      console.log('Error getting weather data for random city');
    });
    
},
  methods: {
    getRandomCity() {
      const cities = ['London', 'New York', 'Paris', 'Tokyo', 'London'];
      return cities[Math.floor(Math.random() * cities.length)];
    },
    getAutocompleteSuggestions() {
      if (this.city.length < 3) {
        this.showAutocomplete = false;
        return;
      }
      axios
        .get(`https://api.openweathermap.org/geo/1.0/direct?q=${this.city}&limit=5&appid=9e0c0b81e69f8f703822e588b6e3cf05`)
        .then((response) => {
          this.autocompleteSuggestions = response.data;
          this.showAutocomplete = true;
        })
        .catch(() => {
          this.autocompleteSuggestions = [];
          this.showAutocomplete = false;
        });
    },
    selectAutocompleteSuggestion(suggestion) {
      if (this.selectedCities.length >= 5) {
  this.city = '';
  this.showAutocomplete = false;
  this.showMaxCitiesWarning = true;
  return;
} else {
  this.showMaxCitiesWarning = false;
}
if (!this.selectedCities.some((city) => city.name === suggestion.name)) {
        axios
          .get(`https://api.openweathermap.org/data/2.5/weather?lat=${suggestion.lat}&lon=${suggestion.lon}&units=metric&appid=9e0c0b81e69f8f703822e588b6e3cf05`)
          .then((response) => {
            const cityData = {
              name: response.data.name,
              temperature: response.data.main.temp.toFixed(1),
              icon: response.data.weather[0].icon,
              windSpeed: response.data.wind.speed,
              pressure: response.data.main.pressure,
              weather: response.data.weather[0].description,
            };
            this.selectedCities.push(cityData);
            this.city = '';
            this.showAutocomplete = false;
          })
          .catch(() => {
            this.showAutocomplete = false;
          });
      }
    },
 addNewCity(index) {
  if (this.newCityArray.length < 5) {
    const newCityData = this.selectedCities[index];
    if (!this.newCityArray.some(city => city.name === newCityData.name)) {
      this.newCityArray.push(newCityData);
      localStorage.setItem('newCityArray', JSON.stringify(this.newCityArray));
    } else {
      // show error message 
    }
  } else {
    this.showMaxCitiesWarning = true;
  }
},


    showDeleteConfirmation(index) {
    this.selectedCityIndex = index;
    this.showDeleteModal = true;
  },
  deleteCity(index) {
    this.selectedCities.splice(index, 1);
    this.showDeleteModal = false;
    this.selectedCityIndex = null;
  },
  closeDeleteConfirmation() {
    this.showDeleteModal = false;
    this.selectedCityIndex = null;
  },
    removeCity(index) {
      this.selectedCities.splice(index, 1);
    },
    closeMaxCitiesWarning() {
    this.showMaxCitiesWarning = false;
  },
showGraphModal(city) {
  this.selectedCityData = { ...city };
  this.showGraph = true;
  if (this.$refs.weatherChart && typeof this.$refs.weatherChart.setData === 'function') {
    this.$refs.weatherChart.setData(this.selectedCityData);
  }
}


  },
  
  computed: {
    ...mapState({
      newCityArray: state => state.newCityArray,
    }),
    selectedCitiesWithHighlight() {
    return this.selectedCities.map(city => {
      const isHighlighted = this.newCityArray.some(newCity => newCity.name === city.name);
      return {
        ...city,
        isHighlighted
      };
    });
  }
  },
  
  store: createStore({
    state: {
      newCityArray: []
    },
    mutations: {
      setNewCityArray(state, newArray) {
        state.newCityArray = newArray;
      },
    },
    actions: {
    },
    getters: {
    },
  }),
          watch: {
        newCityArray(newValue) {
        if (newValue.length > 5) {
        this.showMaxCitiesWarning = true;
        } else {
        this.showMaxCitiesWarning = false;
        }
        },
        },
};
</script>

<style scoped>
.weather-container.highlighted-city {
  border: 5px solid yellow;
}

h1 {
  color: white;
  font-size: 36px;
  
  margin-bottom: 40px;
}
h3 {
  color: white;
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.weather_desc {
  margin-top: 10px;
}



.weather_desc p {
  margin: 10px 0;
  font-size: 20px;
}

.wrapper-search_autocomplete{
  position: relative;
  margin-bottom: 10px;
}
.weather-btn{
  display: flex;
}

.wrapper {
  display: flex;
 
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  
}

.weather-container {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: rgba(38, 131, 155, 0.5);
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  position: relative;
}

.weather-container .weather_desc {
  margin-top: 10px;
}

.weather-container h2 {
  margin-top: 0;
}

.weather-container .weather-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.weather-container img {
  margin-right: 10px;
}


.max-cities-warning {
  color: red;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.search-container label {
  margin-bottom: 5px;
}

.autocomplete {
  margin: 0;
  padding: 0;
  list-style-type: none;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1;
}

.autocomplete li {
  padding: 5px;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
}

.modal-content p {
  margin: 0;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.modal-button {
  margin-left: 10px;
}

.modal-cancel {
  background-color: #ccc;
}

.modal-confirm {
  background-color: #f00;
  color: #fff;
}

.btn {
  padding: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
  margin-left: 10px;
}

.weather-chart {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

label[for="city-input"] {
  font-size: 17px;
  color: #030303;
  padding-left: 10px;
  padding-right: 10px;
  font-weight: bold;
}
.wrapper-autocomplete {
  position: relative;
}
#city-input {
  border-radius: 7px;
  margin-right: 10px;
  padding: 5px;
  position: relative;
}
.autocomplete {
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  z-index: 1;
  background-color: rgba(50, 158, 185, 0.5);
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 250px;
  width: 200px;
  overflow-y: scroll;
  top: 100%;
  
}
.autocomplete li {
  padding: 5px;
  cursor: pointer;
}
.autocomplete li:hover {
  background-color: #f1f1f1;
}
.selected-cities {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.selected-cities h3 {
  text-align: center;
}
.selected-cities ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.selected-cities li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  width: 100%;
}
.selected-cities button {
  padding: 8px;
  margin-top: 15px;
  background-color: #b82727;
  border: none;
  border-radius: 50px;
  color: rgb(248, 243, 243);
  font-size: 16px;
  cursor: pointer;
}
.selected-cities button:hover {
  color: rgb(8, 1, 1);
}
.selected-cities div {
  font-style: italic;
  font-size: 14px;
  color: #666;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-content {
  position: relative;
  z-index: 1;
  background-color: #2796a0;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
}
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.modal-button {
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
  font-weight: bold;
}
.modal-confirm {
  background-color: #4CAF50;
  color: #fff;
}
.modal-cancel {
  background-color: #f44336;
  color: #fff;
}

.weather-btn_delete{
  margin: 10px;
  background-color: #f44336;
  border-radius: 10px;
  padding: 10px;
  border: none;
}
.weather-btn_delete:hover {
  background-color: #da3b3b;
  color: white;
}

.weather-btn_add{
  margin: 10px;
  background-color: #4CAF50;
  border-radius: 10px;
  padding: 10px;
  border: none;
}
.weather-btn_add:hover {
  background-color: rgb(14, 197, 14);
  color: white;
}
@media (max-width: 900px) {
  h1 {
    font-size: 32px;
  }
  
  h3 {
    font-size: 22px;
  }

  .btn-primary{
    margin-top: 10px;
  }

  .autocomplete {
    margin-left: 170px;
    width: 180px;
  }

  .selected-cities li {
    flex-direction: column;
    align-items: flex-start;
    text-align: center;
  }

  .selected-cities li div {
    margin-bottom: 5px;
  }

  .selected-cities li button {
    margin-top: 5px;
  }

  .wrapper {
    padding: 10px;
  }

  .wrapper-autocomplete {
    margin-bottom: 20px;
  }

  .weather-container {
    border-radius: 10px;
    padding: 5px;
    margin-bottom: 10px;
    max-width: 400px;
  }

  .weather-container img {
    margin-right: 5px;
  }

  .weather-container .weather-btn {
    flex-direction: column;
    align-items: center;
  }

  .weather-chart {
    position: static;
    margin-top: 10px;
  }

  .autocomplete li {
    padding: 5px 10px;
  }

  .max-cities-warning {
    font-size: 16px;
  }

}

@media (max-width: 360px) {
  h1 {
    font-size: 28px;
  }
  
  h3 {
    font-size: 20px;
  }

  .autocomplete {
    margin-left: 120px;
    width: 140px;
  }

  .selected-cities li div {
    margin-bottom: 2px;
    font-size: 14px;
  }

  .selected-cities li button {
    margin-top: 2px;
    padding: 5px;
    font-size: 14px;
  }

  .wrapper {
    padding: 5px;
  }

  .wrapper-autocomplete {
    margin-bottom: 10px;
  }

  .weather-container {
    padding: 2px;
    margin-bottom: 5px;
    max-width: 300px;
  }

  .weather-container img {
    margin-right: 3px;
  }

  .weather_desc p {
    font-size: 16px;
  }

  .weather-container .weather-btn {
    flex-direction: column;
    align-items: center;
    margin-top: 5px;
  }

  .weather-chart {
    margin-top: 5px;
  }

  .autocomplete li {
    padding: 2px 5px;
    font-size: 14px;
  }

  .max-cities-warning {
    font-size: 14px;
  }
}

</style>

