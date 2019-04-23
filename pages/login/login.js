// pages/login/login.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    inputPassWords: ''
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindPassInput(e) {
    this.setData({
      inputPassWords: e.detail.value
    })
  },
  /**
   * 用户名密码登录
   */
  toLogin() {
    let { inputValue, inputPassWords } = this.data;
    if (!inputValue || !inputPassWords) {
      console.log('请输入用户名、密码!');
      return false;
    }
    let obj = {
      username: inputValue,
      password: inputPassWords
    };
    app.myAjax('post', '/user/authorize', obj, function (res) {
      console.log(JSON.stringify(res))
    }, function (reg) {
      console.log(JSON.stringify(reg))
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})