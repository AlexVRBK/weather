"use strict";(self["webpackChunkweather_app"]=self["webpackChunkweather_app"]||[]).push([[77],{5077:function(e,t,a){a.r(t),a.d(t,{default:function(){return A}});var r=a(6252),i=a(3577);const n=e=>((0,r.dD)("data-v-31bcc63f"),e=e(),(0,r.Cn)(),e),s={class:"wrapper-favorite"},o=n((()=>(0,r._)("h1",null,"Улюблені міста:",-1))),c=["src","alt"],l=["onClick"],y=["onClick"],w={key:0},p=n((()=>(0,r._)("h4",null,"Прогноз погоди на 5 днів:",-1))),d={class:"p_date"},h=n((()=>(0,r._)("strong",null,"Температура: ",-1))),g={class:"p_desc"};function u(e,t,a,n,u,m){return(0,r.wg)(),(0,r.iD)("div",s,[o,((0,r.wg)(!0),(0,r.iD)(r.HY,null,(0,r.Ko)(e.newCityArray,((e,t)=>((0,r.wg)(),(0,r.iD)("div",{class:(0,i.C_)(["weather-container",{"highlighted-city":e.isHighlighted}]),key:t},[(0,r._)("h2",null,(0,i.zw)(e.name),1),(0,r._)("img",{src:"https://openweathermap.org/img/w/"+e.icon+".png",alt:e.description},null,8,c),(0,r._)("h3",null,"Температура "+(0,i.zw)(e.temperature)+"°C ",1),(0,r._)("p",null,"Тиск: "+(0,i.zw)(e.pressure)+" гПа",1),(0,r._)("p",null,"Швидкість вітру: "+(0,i.zw)(e.windSpeed)+" м/с",1),(0,r._)("button",{class:"weather-btn_delete",onClick:e=>m.deleteCity(t)},"Видалити",8,l),(0,r._)("button",{class:"weather-btn_5days",onClick:t=>m.get5DayForecast(e)},"Показати погоду на 5 днів",8,y),e.show5DaysForecast?((0,r.wg)(),(0,r.iD)("div",w,[p,((0,r.wg)(!0),(0,r.iD)(r.HY,null,(0,r.Ko)(e.forecast,((e,t)=>((0,r.wg)(),(0,r.iD)("div",{class:"container_five_days",key:t},[(0,r._)("p",d,(0,i.zw)(e.date),1),(0,r._)("p",null,[h,(0,r.Uk)((0,i.zw)(e.temperature)+"°C",1)]),(0,r._)("p",g,(0,i.zw)(e.description),1)])))),128))])):(0,r.kq)("",!0)],2)))),128))])}var m=a(3907),C={name:"FavoriteView",computed:{...(0,m.rn)(["newCityArray"])},created(){this.$store.commit("setNewCityArray",JSON.parse(localStorage.getItem("newCityArray")||"[]")),window.addEventListener("storage",(()=>{this.$store.commit("setNewCityArray",JSON.parse(localStorage.getItem("newCityArray")||"[]"))}))},methods:{deleteCity(e){this.newCityArray.splice(e,1),localStorage.setItem("newCityArray",JSON.stringify(this.newCityArray))},async get5DayForecast(e){const t={...e,show5DaysForecast:!e.show5DaysForecast},a=this.newCityArray.findIndex((t=>t.name===e.name));if(this.newCityArray.splice(a,1,t),localStorage.setItem("newCityArray",JSON.stringify(this.newCityArray)),t.show5DaysForecast)try{const a=await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${e.name}&appid=9e0c0b81e69f8f703822e588b6e3cf05&units=metric`),r=await a.json();if(a.ok){const a=r.list.filter(((e,t)=>t%8===0)).map((e=>({date:new Date(1e3*e.dt).toLocaleDateString(),temperature:Math.round(e.main.temp),description:e.weather[0].description})));t.forecast=a;const i=this.newCityArray.findIndex((t=>t.name===e.name));this.newCityArray.splice(i,1,t),localStorage.setItem("newCityArray",JSON.stringify(this.newCityArray))}else console.log("Error getting 5-day forecast")}catch(r){console.log(r)}}}},f=a(3744);const _=(0,f.Z)(C,[["render",u],["__scopeId","data-v-31bcc63f"]]);var A=_}}]);
//# sourceMappingURL=77.b0a5ae79.js.map