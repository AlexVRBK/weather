<template>
  <div class="weather-app">
      <div class="weather_forecast">
        <WeatherForecast />
      </div>
      <div class="weather_city">
        <weather-city />
      </div>
  </div>
</template>
<script>
import WeatherForecast from '@/components/WeatherForecast.vue';
import WeatherCity from '@/components/WeatherCity.vue';

export default {
  name: 'WeatherApp',
  components: {
    WeatherForecast,
    WeatherCity,
  },
  data() {
    return {
      city: '',
    };
  },
};
</script>
<style>
.weather_forecast{
  margin-bottom: 50px;
}

.weather-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
</style>
