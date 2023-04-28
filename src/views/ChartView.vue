<template>
  <div class="wrapper_chart-view">
    <div class="wrapper_input">
        <input class="city_search" type="text" v-model="city" @input="getAutocompleteSuggestions" placeholder="Enter city name">
      <div v-if="showAutocomplete">
        <ul>
          <li v-for="(suggestion, index) in autocompleteSuggestions" :key="index" @click="selectAutocompleteSuggestion(suggestion)">
            {{ suggestion.name }}
          </li>
        </ul>
     </div>
    </div>
   <div class="chart-container">
    <div class="chart-header" v-if="selectedCity">
      <h2>{{ selectedCity.name }}</h2>
    </div>
    <canvas ref="chart"></canvas>
    
  </div>
  </div>
</template>
<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
export default {
  data() {
    return {
      city: '',
      autocompleteSuggestions: [],
      showAutocomplete: false,
      selectedCity: null,
      chart: null,
    };
  },
  methods: {
    getAutocompleteSuggestions() {
      if (this.city.length >= 3) {
        axios
          .get(`https://api.openweathermap.org/geo/1.0/direct?q=${this.city}&limit=5&appid=9e0c0b81e69f8f703822e588b6e3cf05`)
          .then(response => {
            this.autocompleteSuggestions = response.data;
            this.showAutocomplete = true;
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.showAutocomplete = false;
      }
    },
    selectAutocompleteSuggestion(suggestion) {
      this.city = suggestion.name;
      this.showAutocomplete = false;
      this.getSelectedCityData(suggestion);
    },
    getSelectedCityData(city) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/forecast?q=${city.name}&appid=9e0c0b81e69f8f703822e588b6e3cf05&units=metric`)
        .then(response => {
          const hourlyData = response.data.list.slice(0, 8);
          const labels = hourlyData.map(data => new Date(data.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }));
          const temperatures = hourlyData.map(data => data.main.temp);
          this.selectedCity = { name: city.name, labels, temperatures };
        })
        .catch(error => {
          console.log(error);
        });
    },
    renderChart() {
      if (this.$refs.chart && this.selectedCity) {
        const canvas = this.$refs.chart;
        const ctx = canvas.getContext('2d');
        const data = {
          labels: this.selectedCity.labels,
          datasets: [
            {
              label: 'Temperature (°C)',
              data: this.selectedCity.temperatures,
              fill: true,
              backgroundColor: 'rgba(0, 119, 204, 0.3)',
              borderColor: 'rgba(0, 119, 204, 1)',
              borderWidth: 1,
              pointRadius: 0,
            },
          ],
        };
        const options = {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
                  },
                  },
                  };
                  if (this.chart) {
                  this.chart.destroy();
                  }
                  this.chart = new Chart(ctx, {
                  type: 'line',
                  data: data,
                  options: options,
                  });
                  }
                  },
                  },
                  watch: {
                  selectedCity() {
                  this.renderChart();
                  }
                }
              };
</script>

<style scoped>
.wrapper_chart-view {
  min-width: 1200px;
  margin: 0 auto;
  background-color: rgba(38, 131, 155, 0.5);
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
 
}

.wrapper_input{
  margin-top: 20px;
}

.city_search{
  border-radius: 7px;
  margin-right: 10px;
  padding: 5px;
  position: relative;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  cursor: pointer;
  padding: 5px;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}
li:hover {
  background-color: #e2e2e2;
}
canvas {
  width: 100%;
  height: 400px;
}
.chart-container {
  position: relative;
  margin: auto;
  height: 400px;
  width: 500px;
}
.chart-header {
  text-align: center;
  margin-bottom: 30px;
}
.chart-header h2 {
  font-size: 36px;
  font-weight: bold;
}
.chart-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 20px;
  font-size: 14px;
  font-style: italic;
}
.chart-footer a {
  color: #0077CC;
  text-decoration: none;
}
@media (max-width: 1000px) {
  .wrapper_chart-view {
    margin-right: 50px;
   margin-left: 50px;
    padding: 0 20px;
  }
  
 
}

</style>

