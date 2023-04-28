<template>
  <div class="wrapper">
   <div class="chart-container">
    <canvas ref="chart"></canvas>
  </div>
  </div>
</template>
<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
  name: 'WeatherChart',
  props: {
    cityData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      hourlyData: [],
      chart: null,
    }
  },
  mounted() {
    this.getHourlyData();
  },
  methods: {
    async getHourlyData() {
      const city = this.cityData.name;
      if (!city) return; 
      const apiKey = '9e0c0b81e69f8f703822e588b6e3cf05';
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
      this.hourlyData = response.data.list.map(item => ({
        time: item.dt,
        temperature: item.main.temp
      }));
      this.createChart();
    },

    createChart() {
  if (this.$refs.chart && this.hourlyData.length) { 
    const canvas = this.$refs.chart;
    const ctx = canvas.getContext('2d');
    const data = {
      labels: this.hourlyData.map(item => new Date(item.time * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})),
      datasets: [
        {
          label: 'Temperature (°C)',
          data: this.hourlyData.map(item => item.temperature),
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
};
</script>

<style scoped>
.datasets {
  padding: 10px;
}

.chart-container {
  position: relative;
  margin: auto;
  height: 400px;
  width: 500px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
}

.chart-header {
  text-align: center;
  margin-bottom: 30px;
}
.chart-header h2 {
  font-size: 36px;
  font-weight: bold;
  color: #0077CC;
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
  color: #555;
}

.chart-footer a {
  color: #0077CC;
  text-decoration: none;
}

.chart-legend {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.chart-legend-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.chart-legend-color {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.chart-legend-label {
  font-size: 16px;
}

</style>

