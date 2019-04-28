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
    // let accessToken = Util.getCookie('accessToken');
    // let userInfo = Util.getCookie('username');
    // let _this = this;
    // if (!accessToken) {
    //   wx.redirectTo({
    //     url: '../login/login'
    //   })
    // } else {
    //   this.setData({
    //     userInfo: userInfo,
    //     accessToken: accessToken
    //   });
    //   _this.getActual();
    //   // _this.getBatch();
    //
    //   // _this.data.timer = setInterval(function () {
    //   //   _this.getActual()
    //   // }, 5000);
    //
    //   _this.setSocketTask();
    // }
  },
  onHide() {
    clearInterval(this.data.timer)
  },
  onUnload() {
    clearInterval(this.data.timer)
  }
});

