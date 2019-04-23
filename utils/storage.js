/**
 * 设置缓存失效时间
 */

let dtime = '_deadtime';

function putCookie(k, v, t) {
  wx.setStorageSync(k, v)
  let seconds = parseInt(t);
  if (seconds > 0) {
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    wx.setStorageSync(k + dtime, timestamp + "")
  } else {
    wx.removeStorageSync(k + dtime)
  }
}

function getCookie(k, def) {
  let deadtime = parseInt(wx.getStorageSync(k + dtime))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      if (def) {
        return def
      } else {
        return
      }
    }
  }
  let res = wx.getStorageSync(k);
  if (res) {
    return res
  } else {
    return def
  }
}

function removeCookie(k) {
  wx.removeStorageSync(k);
  wx.removeStorageSync(k + dtime)
}

function clearCookie() {
  wx.clearStorageSync()
}

module.exports = {
  putCookie: putCookie,
  getCookie: getCookie,
  removeCookie: removeCookie,
  clearCookie: clearCookie
}