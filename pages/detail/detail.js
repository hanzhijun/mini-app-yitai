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
    timer: null
  },
  onLoad() {

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

      // _this.data.timer = setInterval(function () {
      //   _this.getActual()
      // }, 5000);

      _this.setSocketTask();
    }
  },
  onHide() {
    clearInterval(this.data.timer)
  },
  onUnload() {
    clearInterval(this.data.timer)
  },
  setSocketTask() {
    let accessToken = Util.getCookie('accessToken');
    let deviceNo = this.data.deviceNo;
    //建立连接
    console.log('建立连接!');
    wx.connectSocket({
      url: "ws://stream.darma.cn:18105/ws",
      sluccess() {
        console.log('连接成功...')
      },
      fail() {
        console.log('连接失败...')
      }
    });
    //连接成功
    wx.onSocketOpen(function() {
      console.log('连接成功!');
      let obj = {
        // 消息类型msgType⽬前有 login（登录消息），deviceStatus（设备状态消息）healthData（⼼率呼吸数据消息），paramError（参数错误消息）
        msgType: 'login',
        msgData: {
          token: accessToken,
          // 订阅类型subType有“ALL”,“SINGLETON”(区分⼤⼩写);
          subType: 'SINGLETON', /*订阅所有的设备*/
          deviceNo: deviceNo
        }
      };
      wx.sendSocketMessage({
        data: JSON.stringify(obj),
      })
    });
    //接收数据
    wx.onSocketMessage(function(data) {
      console.info(data.data.byteLength);
      console.log(data.data)
    });
    //连接失败
    wx.onSocketError(function() {
      console.log('websocket连接失败！');
    })
  },
  /**
   * 获取设备当前的状态/⼼率/呼吸/体动数据
   */
  getActual() {
    let obj = {
      deviceNos: app.globalData.deviceNos
    };
    let _this = this;
    app.myAjax2('post', '/device/physiology/actual', obj, function (res) {
      if (res.retCode == '10000') {
        // console.log('请求成功');
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
   * 获取设备的告警配置信息
   */
  getBatch() {
    let obj = {
      deviceNos: app.globalData.deviceNos
    };
    let _this = this;
    app.myAjax2('post', '/device/deviceConfig/batch', obj, function (res) {
      if (res.retCode == '10000') {
        console.log('请求成功');
        _this.setData({
          breath: res.successData[0].breath,
          deviceStatus: res.successData[0].deviceStatus,
          heart: res.successData[0].heart,
          markTime: res.successData[0].markTime,
          motion: res.successData[0].motion
        });
      } else {
        console.log('未知错误')
      }
      console.log(JSON.stringify(res))
    }, function (reg) {
      console.log(JSON.stringify(reg))
    })
  }
});

