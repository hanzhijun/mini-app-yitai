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
        motion: null // 体动值 0_正常，3_轻微体动，4_中度体动，5_⼤幅体动，-100_⽆效值
    },
    onLoad() {
        let accessToken = Util.getCookie('accessToken');
        let userInfo = Util.getCookie('username');
        console.log(accessToken);
        if (!accessToken) {
            wx.redirectTo({
                url: '../login/login'
            })
        } else {
            this.setData({
                userInfo: userInfo
            });
            this.getActual();
            this.setSocketTask()
        }
    },
    setSocketTask() {
        let socketOpen = false;
        let socketMsgQueue = ['login', 'deviceStatus', 'healthData', 'paramError'];
        wx.connectSocket({
            url: 'ws://stream.darma.cn:18105/ws',
            header: {
                'content-type': 'application/json'
            },
            method: 'GET',
            success(res) {
                console.log(JSON.stringify(res))
            },
            fail(reg) {
                console.log(JSON.stringify(reg))
            },
            complete(data) {
                console.log(JSON.stringify(data))
            }
        });

        wx.onSocketOpen(function (res) {
            console.log(JSON.stringify(res));
            socketOpen = true;
            for (let i = 0; i < socketMsgQueue.length; i++) {
                sendSocketMessage(socketMsgQueue[i])
            }
            socketMsgQueue = []
        });
        let _this = this;
        function sendSocketMessage(msg) {
            if (socketOpen) {
                wx.sendSocketMessage({
                    data: {
                        msgType: msg,
                        msgData: {
                            token: _this.accessToken,
                            subType: 'ALL',
                            deviceNo: _this.deviceNo
                        }
                    }
                })
            } else {
                socketMsgQueue.push(msg)
            }
        }
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
                console.log('请求成功');
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
            console.log(JSON.stringify(res))
        }, function (reg) {
            console.log(JSON.stringify(reg))
        })
    },
    getDeviceInfo() {

    },
});

