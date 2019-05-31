// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    github: 'https://github.com/Faking007',
    email:'Faking007@163.com',
    qq: '742863722'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('entered about page')
  },
  copy(e) {
    let dataset = (e.currentTarget || {}).dataset || {}
    let title = dataset.title || ''
    let content = dataset.content || ''
    wx.setClipboardData({
      data: content,
      success() {
        wx.showToast({
          title: `已复制${title}`,
          duration: 2000,
        })
      },
    })
  }
})