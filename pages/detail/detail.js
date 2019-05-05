//index.js
//获取应用实例
const app = getApp();
let Util = require('../../utils/storage.js');

Page({
  data: {
    userInfo: null,
    deviceNo: '641743000773', // 设备号
    accessToken: null,
    breath: null, // 呼吸值 -100_⽆效值，其他为正常值
    deviceStatus: null, // 设备状态 3_离床，4_在床，5_光纤故障，6_离线，9_传感器负荷，10_信号弱
    heart: null, // ⼼率值 65436_⽆效值，其他为正常值
    markTime: null, // 发⽣的时间戳
    motion: null, // 体动值 0_正常，3_轻微体动，4_中度体动，5_⼤幅体动，-100_⽆效值
    timer: null,
    toast: 0,
    toastTxt: '',
    loading: 0,
    warning: 0,
    warningText: '',
    leaveTime: null
  },
  onLoad() {
    // app.showToast(this, '提示语操作');
  },
  onReady() {
  },
  onShow() {
    let accessToken = Util.getCookie('accessToken');
    let userInfo = Util.getCookie('username');
    let _this = this;
    if (!accessToken) {
      wx.redirectTo({
        url: '../login/login'
      })
    } else {
      this.setData({
        userInfo: userInfo,
        accessToken: accessToken
      });
      _this.getActual();
      // _this.getBatch();
      // _this.history();
      // _this.deviceStatus();
      _this.setSocketTask();
      _this.data.timer = setInterval(function () {
        _this.getActual()
      }, 20000);

    }
  },
  onHide() {
    clearInterval(this.data.timer)
  },
  onUnload() {
    clearInterval(this.data.timer)
  },
  /**
   * 03. 获取设备当前的状态/⼼率/呼吸/体动数据
   */
  getActual() {
    let obj = {
      deviceNos: app.globalData.deviceNos
    };
    let _this = this;
    app.myAjax2('post', '/device/physiology/actual', obj, function (res) {
      if (res.retCode == '10000') {
        // console.log('请求成功');
        if (res.successData[0].deviceStatus == 3 && _this.data.leaveTime) {
          let time = Date.parse(new Date());
          if (time - _this.data.leaveTime > 30) {
            _this.setData({
              warningText: '离床报警已触发',
              warning: 1
            });
            wx.vibrateLong({
              success: function () {
                console.log('震动设置成功!')
              },
              fail: function () {
                console.log('震动设置失败!')
              },
              complete: function () {
                console.log('震动设置完成!')
              }
            })
          }
        }
        _this.setData({
          breath: res.successData[0].breath,
          deviceStatus: res.successData[0].deviceStatus,
          heart: res.successData[0].heart,
          markTime: res.successData[0].markTime,
          motion: res.successData[0].motion
        });
      } else {
        console.log('未知错误，请重新登录')
      }
      // console.log(JSON.stringify(res))
    }, function (reg) {
      console.log(JSON.stringify(reg))
    })
  },
  /**
   * 04. 获取设备的历史⼼率/呼吸/体动数据
   */
  history() {
    let obj = {
      deviceNos: app.globalData.deviceNos,
      startTime: '1556423359',
      endTime: '1556509759'
    };
    let _this = this;
    app.myAjax2('post', '/device/physiology/history', obj, function (res) {
      if (res.retCode == '10000') {
        console.log('history请求成功');
      } else {
        console.log('history未知错误')
      }
      console.log(JSON.stringify(res))
    }, function (reg) {
      console.log(JSON.stringify(reg))
    })
  },
  /**
   * 05. 量获取设备的历史状态数据
   */
  deviceStatus() {
    let obj = {
      deviceNos: app.globalData.deviceNos,
      startTime: '1556423359',
      endTime: '1556509759'
    };
    let _this = this;
    app.myAjax2('post', '/device/deviceStatus/history', obj, function (res) {
      if (res.retCode == '10000') {
        console.log('deviceStatus请求成功');
      } else {
        console.log('deviceStatus未知错误')
      }
      console.log(JSON.stringify(res))
    }, function (reg) {
      console.log(JSON.stringify(reg))
    })
  },
  /**
   * 06. 获取设备的睡眠质量数据
   */
  sleepState() {
    let obj = {
      deviceNos: app.globalData.deviceNos,
      startTime: '1556423359',
      endTime: '1556509759'
    };
    let _this = this;
    app.myAjax2('post', '/device/sleepState', obj, function (res) {
      if (res.retCode == '10000') {
        console.log('sleepState请求成功');
      } else {
        console.log('sleepState未知错误')
      }
      console.log(JSON.stringify(res))
    }, function (reg) {
      console.log(JSON.stringify(reg))
    })
  },
  /**
   * 07. 获取设备的历史推送信息数据
   */
  warnInfo() {
    let obj = {
      deviceNos: app.globalData.deviceNos,
      startTime: '1556423359',
      endTime: '1556509759'
    };
    let _this = this;
    app.myAjax2('post', '/device/warnInfo', obj, function (res) {
      if (res.retCode == '10000') {
        console.log('warnInfo请求成功');
      } else {
        console.log('warnInfo未知错误')
      }
      console.log(JSON.stringify(res))
    }, function (reg) {
      console.log(JSON.stringify(reg))
    })
  },
  /**
   * 08. 获取设备的信息
   */
  deviceInfo() {
    let obj = {
      deviceNos: app.globalData.deviceNos
    };
    let _this = this;
    app.myAjax2('post', '/device/deviceInfo', obj, function (res) {
      if (res.retCode == '10000') {
        console.log('deviceInfo请求成功');
      } else {
        console.log('deviceInfo未知错误')
      }
      console.log(JSON.stringify(res))
    }, function (reg) {
      console.log(JSON.stringify(reg))
    })
  },
  /**
   * 09. 获取设备当前的状态
   */
  netInfo() {
    let obj = {
      deviceNos: app.globalData.deviceNos
    };
    let _this = this;
    app.myAjax2('post', '/device/netInfo', obj, function (res) {
      if (res.retCode == '10000') {
        console.log('netInfo请求成功');
      } else {
        console.log('netInfo未知错误')
      }
      console.log(JSON.stringify(res))
    }, function (reg) {
      console.log(JSON.stringify(reg))
    })
  },
  /**
   * 10. 设置设备告警配置信息
   * @param type 配置的类型(0_⼼率的配置信息，1_呼吸的配置信息)。
   */
  deviceConfig(type) {
    let obj = {
      deviceNos: app.globalData.deviceNos, // 设备号
      maxValue: 120, // 最⼤值
      minValue: 40, // 最⼩值
      rate: 0.6, // 变化率
      warnSecond: 30, // 持续时间
      configType: type // 配置的类型
    };
    let _this = this;
    app.myAjax2('post', '/device/deviceConfig', obj, function (res) {
      if (res.retCode == '10000') {
        console.log('deviceConfig请求成功');
      } else {
        console.log('deviceConfig未知错误')
      }
      console.log(JSON.stringify(res))
    }, function (reg) {
      console.log(JSON.stringify(reg))
    })
  },
  /**
   * 11. 获取设备的告警配置信息
   */
  getBatch() {
    let obj = {
      deviceNos: app.globalData.deviceNos
    };
    let _this = this;
    app.myAjax2('post', '/device/deviceConfig/batch', obj, function (res) {
      if (res.retCode == '10000') {
        console.log('getBatch请求成功');
        _this.setData({
          breath: res.successData[0].breath,
          deviceStatus: res.successData[0].deviceStatus,
          heart: res.successData[0].heart,
          markTime: res.successData[0].markTime,
          motion: res.successData[0].motion
        });
      } else {
        console.log('getBatch未知错误')
      }
      console.log(JSON.stringify(res))
    }, function (reg) {
      console.log(JSON.stringify(reg))
    })
  },
  setSocketTask() {
    let accessToken = Util.getCookie('accessToken');
    let deviceNo = this.data.deviceNo;
    let _this = this;
    //建立连接
    console.log('建立连接!');
    wx.connectSocket({
      url: "ws://stream.darma.cn:17004/ws",
      sluccess() {
        console.log('连接成功...')
      },
      fail() {
        console.log('连接失败...')
      }
    });
    //连接成功
    wx.onSocketOpen(function () {
      console.log('连接成功!');
      let obj = {
        // 消息类型msgType⽬前有 login（登录消息），deviceStatus（设备状态消息）healthData（⼼率呼吸数据消息），paramError（参数错误消息）
        msgType: 'login',
        data: {
          token: accessToken,
          // 订阅类型subType有“ALL”,“SINGLETON”(区分⼤⼩写);
          // subType: 'SINGLETON', /*订阅所有的设备*/
          deviceNo: deviceNo
        }
      };
      wx.sendSocketMessage({
        data: JSON.stringify(obj),
      })
    });
    //接收数据
    wx.onSocketMessage(function (data) {
      // console.log('websocket返回数据');
      // console.log(JSON.parse(data.data).msgType)
      // heartBreathBcg、healthBreathData、deviceStatus
      if (JSON.parse(data.data).msgType == 'healthBreathData' || JSON.parse(data.data).msgType == 'deviceStatus') {
        console.log(data.data)
      }
      // 当状态发生变化会初始化时，会推送此条数据
      if (JSON.parse(data.data).msgType == 'deviceStatus') {
        if (JSON.parse(data.data).data.deviceStatus == '3') {
          console.log('离床已记录，以此时间为基准开始计算报警数据');
          _this.setData({
            leaveTime: Date.parse(new Date())
          });
        } else {
          _this.setData({
            leaveTime: null
          });
          console.log('解除离床报警计算数据');
        }
      }

    });
    //连接失败
    wx.onSocketError(function () {
      console.log('websocket连接失败！');
    })
  }
});
