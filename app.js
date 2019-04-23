//app.js
let Util = require('/utils/storage.js');

App({
    onLaunch: function () {
    },
    /**
     * 基础数据
     */
    globalData: {
        vision: '1.0.0',
        host: 'https://api.darma.cn/mattress',
        userInfo: null, // {"accessToken":"71bc9ce1c95547459da2f31801f97a08","tokenType":"default","username":"ether"}
        isLogin: null,
        deviceNos: '641743000773' // 设备号 641743000773
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
    /**
     * 公共异步 二级接口 (需登录)
     * @param type 类型： post,get,put,delete
     * @param url 接口地址
     * @param data 参数
     * @param res 成功
     * @param reg 失败
     */
    myAjax2(type, url, data, res, reg) {
        let accessToken = Util.getCookie('accessToken');
        if (!accessToken) {
            wx.redirectTo({
                url: '../login/login'
            })
        }
        wx.request({
            url: this.globalData.host + url,
            data: data,
            header: {
                'content-type': 'application/json',
                'accessToken': accessToken
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
    setStorageSync(key, val, time) {
        wx.setStorageSync(key, val);
        var seconds = parseInt(time);
        if (seconds > 0) {
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000 + seconds;
            wx.setStorageSync(k + 'dtime', timestamp + "")
        } else {
            wx.removeStorageSync(k + 'dtime')
        }
    }
});
