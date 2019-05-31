// pages/list/list.js
const dayMap=['星期日','星期一','星期二','星期三','星期四','星期五','星期六']

Page({
  date: {
    weekWeather:[],
    city:'广州'
  },
  onLoad(options) {
    console.log("onLoad");
    this.setData({
      //huo qu zhu jie mian de city
      city:options.city 
    })
    this.getWeekWeather()
  },
  onPullDownRefresh() {
    this.getWeekWeather(()=>{
      wx.stopPullDownRefresh();
    });
  },
  getWeekWeather(callback){
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather',
      data: {
        location: this.data.city,
        key: '3252741549ec47419ad542d9ac07f026'
      },
      success: res => {
        let forecast = res.data.HeWeather6[0].daily_forecast;
        this.setWeekWeather(forecast);
      },
      complete: ()=>{
        callback && callback()
      }
    })
  },
  setWeekWeather(forecast){
    let weekWeather = [];
    for(let i = 0; i < 7; i++){
      let date = new Date();
      date.setDate(date.getDate() + i);
      weekWeather.push({
        day: dayMap[date.getDay()],
        date:`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        temp: `${forecast[i].tmp_min}° - ${forecast[i].tmp_max}°`,
        text: `${forecast[i].cond_txt_d}`,
        iconPath: `/images/` + forecast[i].cond_code_d + `.png`
      });
    }
    weekWeather[0].day = '今天';
    this.setData({
      weekWeather:weekWeather
    })
  }
})