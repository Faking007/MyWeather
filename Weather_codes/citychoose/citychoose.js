let InlandData = require('../../data/InlandData.js')
let OverseasData = require('../../data/OverseasData.js')
let utils = require('../../utils/utils.js')
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

Page({
  data: {
    alternative: null,
    city: '',
    cities: [],
    // 需要显示的城市
    showItems: null,
    inputText: '',
    InlandClicked:'border-bottom: 5rpx solid #40a7e7',
    OverseasClicked:''
  },
  tapTab(e) {
    console.log(e.target.id);
    if(e.target.id == 'Inland' && this.data.OverseasClicked != '') {
      let cities = this.getSortedAreaObj(InlandData.cities || [])
      this.setData({
        cities,
        showItems: cities,
        InlandClicked: 'border-bottom: 5rpx solid #40a7e7',
        OverseasClicked:''
      })
    }
    else if(e.target.id == 'Overseas' && this.data.InlandClicked != ''){
      let cities = this.getSortedAreaObj(OverseasData.cities || [])
      this.setData({
        cities,
        showItems: cities,
        InlandClicked: '',
        OverseasClicked: 'border-bottom: 5rpx solid #40a7e7'
      })
    }
  }
  ,
  cancel () {
    this.setData({
      inputText: '',
      showItems: this.data.cities,
    })
  },
  inputFilter (e) {
    let alternative = {}
    let cities = this.data.cities
    let value = e.detail.value.replace(/\s+/g, '')
    if (value.length) {
      for (let i in cities) {
        let items = cities[i]
        for (let j = 0, len = items.length; j < len; j++) {
          let item = items[j]
          if (item.name.indexOf(value) !== -1) {
            if (utils.isEmptyObject(alternative[i])) {
              alternative[i] = []
            }
            alternative[i].push(item)
          }
        }
      }
      if (utils.isEmptyObject(alternative)) {
        alternative = null
      }
      this.setData({
        alternative,
        showItems: alternative,
      })
    } else {
      this.setData({
        alternative: null,
        showItems: cities,
      })
    }
  },
  // 按照字母顺序生成需要的数据格式
  getSortedAreaObj(areas) {
    // let areas = staticData.areas
    areas = areas.sort((a, b) => {
      if (a.letter > b.letter) {
        return 1
      }
      if (a.letter < b.letter) {
        return -1
      }
      return 0
    })
    let obj = {}
    for (let i = 0, len = areas.length; i < len; i++) {
      let item = areas[i]
      delete item.districts
      let letter = item.letter
      if (!obj[letter]) {
        obj[letter] = []
      }
      obj[letter].push(item)
    }
    // 返回一个对象，直接用 wx:for 来遍历对象，index 为 key，item 为 value，item 是一个数组
    return obj
  },
  choose(e) {
    let item = e.currentTarget.dataset
    let name = item.name
    console.log('citychoose = ' + name);
    wx.reLaunch({
      url: '/pages/index/index?city=' + name + '&backFromCityChoose=true',
    })
  },
  onLoad () {
    this.qqmapsdk = new QQMapWX({
      key: 'EAXBZ-33R3X-AA64F-7FIPQ-BY27J-5UF5B'
    });
    let cities = this.getSortedAreaObj(InlandData.cities || [])
    this.setData({
      cities,
      showItems: cities,
    })
  },
})