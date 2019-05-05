//index.js
//获取应用实例
const app = getApp();
let Util = require('../../utils/storage.js');

Page({
  data: {
    userInfo: null
  },
  onLoad() {

  },
  onReady() {
  },
  onShow() {
    let accessToken = Util.getCookie('accessToken');
    setTimeout(function() {
      if (!accessToken) {
        wx.redirectTo({
          url: '../login/login'
        })
      } else {
        wx.redirectTo({
          url: '../detail/detail'
        })
        // wx.switchTab({
        //   url: '../detail/detail',
        //   success(res) {
        //     console.log('成功')
        //   },
        //   fail(res) {
        //     console.log('失败')
        //   }
        // })
      }
    },5000);
  },
  onHide() {
    clearInterval(this.data.timer)
  },
  onUnload() {
    clearInterval(this.data.timer)
  }
});

