//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    vision: '1.0.0',
    host: 'https://api.darma.cn/mattress',
    userInfo: null,
    isLogin: null
  },
  /**
   * 公共异步 一级接口 (不需登录)
   * @param type 类型： post,get,put,delete
   * @param url 接口地址
   * @param data 参数
   * @param res 成功
   * @param reg 失败
   */
  myAjax(type, url, data, res, reg) {
    wx.request({
      url: this.globalData.host + url,
      data: data,
      header: {
        'content-type': 'application/json'
      },
      method: type,
      success(data) {
        res && res(data.data)
      },
      fail(data) {
        reg && reg(data.data)
      }
    })

  },
})