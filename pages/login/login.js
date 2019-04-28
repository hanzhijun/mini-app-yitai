// pages/login/login.js

const app = getApp();
let Util = require('../../utils/storage.js');

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
        let {inputValue, inputPassWords} = this.data;
        if (!inputValue || !inputPassWords) {
            console.log('请输入用户名、密码!');
            return false;
        }
        let obj = {
            username: inputValue,
            password: inputPassWords
        };
        app.myAjax('post', '/user/authorize', obj, function (res) {
            if (res.retCode == '10000') {
                app.globalData.userInfo = res.successData;
                Util.putCookie('accessToken', res.successData.accessToken, 3600);
                Util.putCookie('username', res.successData.username, 3600);
                wx.navigateTo({
                    url: '../detail/detail'
                })
            } else if (res.retCode == '10007') {
                console.log('⽤户名或密码错误')
            } else if (res.retCode == '10008') {
                console.log('token已过期，请重新登录')
            } else {
                console.log('未知错误，请重新登录')
            }
            console.log(JSON.stringify(res))
        }, function (reg) {
            console.log(JSON.stringify(reg))
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('123');
        let c = Util.getCookie('accessToken');
        console.log(c);
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
});

