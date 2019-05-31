// 预备变量
// 天气（英 : 中）
const weatherMap = {
  '晴': 'sunny',

  '少云': 'cloudy',
  '多云': 'cloudy',

  '阴': 'overcast',

  '雨': 'lightrain',
  '小雨': 'lightrain',
  '中雨': 'lightrain',

  '大雨': 'heavyrain',
  '阵雨': 'heavyrain',
  '雷阵雨': 'heavyrain',

  '雪': 'snow',
  '小雪': 'snow',
  '中雪': 'snow',
  '大雪': 'snow',
  '雨夹雪': 'snow'
}
// 天气 ：导航栏背景颜色
const weatherColorMap = {
  '晴': '#cbeefd',
  '少云': '#deeef6',
  '多云': '#deeef6',
  '阴': '#c6ced2',
  '雨': '#bdd5e1',
  '小雨': '#bdd5e1',
  '中雨': '#bdd5e1',
  '大雨': '#c5ccd0',
  '阵雨': '#c5ccd0',
  '雷阵雨': '#c5ccd0',
  '雪': '#aae1fc',
  '小雪': '#aae1fc',
  '中雪': '#aae1fc',
  '大雪': '#aae1fc',
  '雨夹雪': '#aae1fc',
}
//
const dayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
// 生活指数
const lifestyleMap = {
  'comf':'舒适度指数',
  'cw':'洗车指数',
  'drsg':'穿衣指数',
  'flu':'感冒指数',
  'sport':'运动指数',
  'trav':'旅游指数',
  'uv':'紫外线指数',
  'air':'空气污染扩散条件指数',
  'ac':'空调开启指数',
  'ag':'过敏指数',
  'gl':'太阳镜指数',
  'mu':'化妆指数',
  'airc':'晾晒指数',
  'ptfc':'交通指数',
  'fsh':'钓鱼指数',
  'spi':'防晒指数'
}

const bgcMap = {
  '晴': { 'from': 'rgb(183, 235, 235)', 'to':'rgba(129, 209, 255, 0.993)'},
  
  '少云': { 'from': 'rgb(178, 222, 241)', 'to': 'rgba(138, 214, 245, 0.993)'},
  '多云': { 'from': 'rgb(178, 222, 241)', 'to': 'rgba(138, 214, 245, 0.993)'},
  
  '阴': { 'from': 'rgb(197, 209, 209)', 'to': 'rgba(186, 210, 224, 0.993)'},

  '雨': { 'from': 'rgb(187, 235, 236)', 'to': 'rgba(138, 214, 245, 0.993)'},
  '小雨': { 'from': 'rgb(187, 235, 236)', 'to': 'rgba(138, 214, 245, 0.993)'},
  '中雨': { 'from': 'rgb(187, 235, 236)', 'to': 'rgba(138, 214, 245, 0.993)'},

  '大雨': { 'from': 'rgb(197, 209, 209)', 'to': 'rgba(186, 210, 224, 0.993)'},
  '阵雨': { 'from': 'rgb(197, 209, 209)', 'to': 'rgba(186, 210, 224, 0.993)'},
  '雷阵雨': { 'from': 'rgb(197, 209, 209)', 'to': 'rgba(186, 210, 224, 0.993)'},
//  
  '雪': { 'from': 'rgb(183, 235, 235)', 'to': 'rgba(129, 209, 255, 0.993)' },
  '小雪': { 'from': 'rgb(183, 235, 235)', 'to': 'rgba(129, 209, 255, 0.993)'},
  '中雪': { 'from': 'rgb(183, 235, 235)', 'to': 'rgba(129, 209, 255, 0.993)'},
  '大雪': { 'from': 'rgb(183, 235, 235)', 'to': 'rgba(129, 209, 255, 0.993)'},
  '雨夹雪': { 'from': 'rgb(183, 235, 235)', 'to': 'rgba(129, 209, 255, 0.993)'},

}

const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

Page({
  // 绑定index.wxml中的动态数据
  data:{
    nowTemp:'',
    nowWeather:'',
    nowWeatherBackground: '/images/sunny-bg.png',
    hourlyWeather: [],
    todayDate: '',
    weekday:'',
    todayTemp:'',
    city:'广州',
    searchCity:'',
    locationAuthType: UNPROMPTED,
    // 从城市选择页面跳转回来
    backFromCityChoose:'false',
    // 背景渐变颜色
    bgcFrom:'rgb(183, 235, 235)',
    bgcTo:'rgba(129, 209, 255, 0.993)',
    // 详细信息
    moreTmp:'',
    moreFeel:'',
    sunrise:'',
    sunset:'',
    windLevel:'',
    windDirection:'',
    chanceOfRain:'',
    precipitation:'',
    relaHumid:'',
    cloudage:'',
    airPressure:'',
    visibility:'',
    // 生活指数
    // lsdisplay:'',
    lsItem:[],
    // 是否已经弹出
    hasPopped: false,
    animationMain: {},
    animationOne: {},
    animationTwo: {},
    animationThree: {},
  },
  // 下拉刷新函数
  onPullDownRefresh() {
    //  匿名函数: 
    // () => {
    //   wx.stopPullDownRefresh()
    // }
    // 给getNow()传入wx.stopPullDownRefresh(),则会在请求完成后执行wx.stopPullDownRefresh()
    this.getNow(() => {
      wx.stopPullDownRefresh()
    });
    console.log("page_index refresh executed!");
  },
  // 小程序加载自动执行onLoad()
  onLoad(options) {
    this.qqmapsdk = new QQMapWX({
      key: 'EAXBZ-33R3X-AA64F-7FIPQ-BY27J-5UF5B'
    });
    wx.showToast({
      title: '加载中',
      icon:'loading'
    })
    if (options.backFromCityChoose) { // 从城市页面跳转回来
      this.setData({
        city: options.city,
      })
      this.getNow();
    }else {
      // 获取用户授权设置情况
      wx.getSetting({
        success: res => {
          let auth = res.authSetting['scope.userLocation'];
          let locationAuthType = auth ? AUTHORIZED :
            (auth === false) ? UNAUTHORIZED : UNPROMPTED;
          console.log('getSetting用户授权情况 : auth = ' + auth + ' ; locationAuthType = ' + locationAuthType);
          this.setData({
            locationAuthType: locationAuthType
          });
          if (auth)
            this.getCityAndWeather()
          else
            this.getNow() //使用默认城市广州
        },
        fail: () => {
          this.getNow()   //使用默认城市广州
        }
      })
    }
  },
  // onShow(){
  //   此代码实习的功能已被openSetting中使用回调函数替代
  //   console.log("onShow");
  //   wx.getSetting({
  //     success: res => {
  //       let auth = res.authSetting['scope.userLocation'];
  //       if(auth && this.data.locationAutoType !== AUTHORIZED) {
  //         // 权限从无到有
  //         this.setData({
  //           locationAutoType: AUTHORIZED,
  //           locationTipsText: AUTHORIZED_TIPS
  //         });
  //         this.getLocation()
  //       }
  //       //权限从有到无未处理
  //     }
  //   });
  // },
  //  发起http请求
  getNow(callback) {  //传入callback回调函数,则会在complete中执行
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather',
      data: {
        location: this.data.city,
        key: '3252741549ec47419ad542d9ac07f026'
      },
      success: res => {
        let result = res.data.HeWeather6[0];
        let now = result.now;                   //实况天气
        let today = result.daily_forecast[0];   //当日日期与温度差
        let hourly = result.hourly;             //逐小时天气
        let lifestyle = result.lifestyle;       //生活指数
        console.log('getNow success!' + ' ' + this.data.city + ' ' + now.tmp + ' ' + now.cond_txt);
        this.setNow(now);
        this.setToday(today);
        this.setHourlyWeather(hourly);
        this.setMore(now, today);
        this.setLifestyle(lifestyle);
      },
      // success完成后执行complete回调函数
      complete: () => {
        // 在callback不为空时执行callback()
        callback && callback()
        console.log('getNow -> callback');
      }
    })
  },
  //设置当前天气、温度、背景图片
  setNow(now) {
    let temp = now.tmp;
    let weather = now.cond_txt;
    // 为动态数据赋值
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weather,
      nowWeatherBackground: '/images/' + weatherMap[weather] + '-bg.png',
      bgcFrom: bgcMap[weather].from,
      bgcTo: bgcMap[weather].to
    });
    // 动态设置导航栏背景颜色
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather]
    });
  },
  //设置现在日期与温度差
  setToday(today) {
    let date = new Date();
    this.setData({
      // ` 不是单引号 '
      todayTemp: `${today.tmp_min}° - ${today.tmp_max}°`,
      weekday: `${dayMap[date.getDay()]}`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    });
  },
  //设置未来24小时天气预测
  setHourlyWeather(hourly) {
    let hourlyWeather = [];
    let nowHour = new Date().getHours();
    for (let i = 0; i < 8; i++) {
      hourlyWeather.push({
        time: (i*3 + nowHour) % 24 + '时',
        iconPath: '/images/' + hourly[i].cond_code + '.png',
        temp: hourly[i].tmp + '°'
      })
    }
    hourlyWeather[0].time = '现在';
    hourlyWeather[0].temp = this.data.nowTemp;
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },
  //设置更多信息
  setMore(now, today) {
    let moreTmp = now.tmp;
    let moreFeel = now.fl;
    let sunrise = today.sr;
    let sunset = today.ss;
    let windLevel = now.wind_sc;
    let windDirection = now.wind_dir;
    let chanceOfRain = today.pop;
    let precipitation = today.pcpn;
    let relaHumid = now.hum;
    let cloudage = now.cloud;
    let airPressure =now.pres;
    let visibility = today.vis;
    moreTmp = moreTmp + '°C';
    moreFeel = moreFeel + '°C';
    windLevel = windLevel + '级';
    chanceOfRain = chanceOfRain + '%';
    precipitation = precipitation + 'mm';
    relaHumid = relaHumid + '%';
    airPressure = airPressure + 'mb';
    visibility = visibility + 'km';
    this.setData({
      moreTmp: moreTmp,
      moreFeel: moreFeel,
      sunrise: sunrise,
      sunset: sunset,
      windLevel: windLevel,
      windDirection: windDirection,
      chanceOfRain: chanceOfRain,
      precipitation: precipitation,
      relaHumid: relaHumid,
      cloudage: cloudage,
      airPressure: airPressure,
      visibility: visibility
    });
  },
  // 设置生活指数
  setLifestyle(lifestyle){
    let lsItem = [];
    for(let i = 0; i < 8; i++) {
      lsItem.push({
        imgPath: '/images/lifestyle_' + lifestyle[i].type + '.png',
        title: lifestyleMap[lifestyle[i].type] + ' ' + lifestyle[i].brf,
        text: lifestyle[i].txt
      });
    }
    this.setData({
      lsItem: lsItem
    });
  },
  //搜索框
  searchInput:function(e) {
    let searchCity = e.detail.value;
    this.setData({                      //设置data中的数据
      searchCity:searchCity
    })
  },
  //搜索执行函数
  searchFun() {
    if(this.data.searchCity === 'HNUST')
      this.dance();
    else{
      wx.request({
        url: 'https://free-api.heweather.net/s6/weather',
        data: {
          location: this.data.searchCity,
          key: '3252741549ec47419ad542d9ac07f026'
        },
        success: res => {
          let result = res.data.HeWeather6[0];
          //查询成功
          if(result.status === 'ok') {
            let city = result.basic.location;       //城市名
            let now = result.now;                   //实况天气
            let today = result.daily_forecast[0];   //当日日期与温度差
            let hourly = result.hourly;             //逐小时天气
            let lifestyle = result.lifestyle;
            this.setData({
              city: city,
              searchCity: ''
            });
            console.log('searchFun(' + city + ' ' + now.tmp + '°)success!');
            this.setNow(now);
            this.setToday(today);
            this.setHourlyWeather(hourly);
            this.setMore(now, today);
            this.setLifestyle(lifestyle);
            wx.showToast({
              title: '查询' + city + '成功'
            })
          }else {
            //查询失败
            this.setData({
              searchCity: ''
            });
            wx.showToast({
              title: '查询失败',
              icon: 'none'
            })
          }
        }
      })
    }
  },
  //日期、天气触发事件，进入page2
  onTapDayWeather() {
    wx.navigateTo({
      url:'/pages/list/list?city=' + this.data.city
    });
  },
  //城市定位触发事件
  onTapLocation() { 
    console.log('onTapLocation');
    if (this.data.locationAuthType === UNAUTHORIZED)
      wx.openSetting({
        success: res => {
          let auth = res.authSetting['scope.userLocation'];
          console.log('getSetting用户授权情况 : auth = ' + auth + ' ; locationAuthType = ' + this.data.locationAuthType);
          if(auth) {
            this.getCityAndWeather()
          }
        }
      })
    else
      this.getCityAndWeather()
  },
  //获取城市
  getCityAndWeather() {
    wx.getLocation({
      success: res => {
        this.setData({
          locationAuthType:AUTHORIZED
        })
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            let city = res.result.address_component.city
            this.setData({
              city:city,
              locationTipsText:""
            }),
            this.getNow()
          }
        })
      },
      fail: () => {
        this.setData({
          locationAuthType:UNAUTHORIZED
        })
      }
    })
  },
  //xuan fu lan
  menuHide() {
    if (this.data.hasPopped) {
      this.takeback()
      this.setData({
        hasPopped: false,
      })
    }
  },
  menuMain() {
    if (!this.data.hasPopped) {
      this.popp()
      this.setData({
        hasPopped: true,
      })
    } else {
      this.takeback()
      this.setData({
        hasPopped: false,
      })
    }
  },
  popp() {
    let animationMain = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationTwo = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationThree = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationFour = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(180).step()
    animationOne.translate(0, -60).rotateZ(360).opacity(1).step()
    animationTwo.translate(-Math.sqrt(3600 - 400), -30).rotateZ(360).opacity(1).step()
    animationThree.translate(-Math.sqrt(3600 - 400), 30).rotateZ(360).opacity(1).step()
    animationFour.translate(0, 60).rotateZ(360).opacity(1).step()
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
      animationFour: animationFour.export(),
    })
  },
  takeback() {
    let animationMain = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationTwo = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationThree = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationFour = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(0).step();
    animationOne.translate(0, 0).rotateZ(0).opacity(0).step()
    animationTwo.translate(0, 0).rotateZ(0).opacity(0).step()
    animationThree.translate(0, 0).rotateZ(0).opacity(0).step()
    animationFour.translate(0, 0).rotateZ(0).opacity(0).step()
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
      animationFour: animationFour.export(),
    })
  },
  //xuan fu lan tiao zhuan
  menuToListPage() {
    console.log('skip to List page');
    wx.navigateTo({
      url: '/pages/list/list?city=' + this.data.city
    });
  },
  menuToAbout() {
    console.log('skip to abot page');
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },
  menuToCityChoose() {
    console.log('skip to CityChoose page');
    wx.navigateTo({
      url: '/pages/citychoose/citychoose'
    })
  }
})