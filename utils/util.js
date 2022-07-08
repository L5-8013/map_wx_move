const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const request = (obj)=>{
  if(obj?.loading){
    wx.showLoading({
      title: '加载中',
    });
  };
  return new Promise((resolve,reject)=>{
    wx.request({
      url: obj.url,
      method:obj.method?obj.method:'GET',
      data:obj.data,
      success:(data)=>{
        resolve && resolve(data)
      },
      fail:(err)=>{
        reject && reject(err)
      },
      complete:()=>{
        obj?.loading && wx.hideLoading()
      }
    })
  })
}

// rpx 转换为 px ，传参类型是数字（Number）
const rpxTopx = (rpx)=>{
  let deviceWidth = wx.getSystemInfoSync().windowWidth; //获取设备屏幕宽度
  let px = (deviceWidth / 750) * Number(rpx)
  return Math.floor(px);
}
// px 转换为 rpx ，传参类型是数字（Number）
const pxTopx = (px)=> {
  let deviceWidth = wx.getSystemInfoSync().windowWidth; //获取设备屏幕宽度
  let rpx = (750 / deviceWidth) * Number(px)
  return Math.floor(rpx);
}

const fixPage = ()=>{
  let rootInfo = wx.getSystemInfoSync();
  let psdRadio = (750 / 1450).toFixed(2);
  let pageRadio = +(rootInfo.windowWidth / rootInfo.windowHeight).toFixed(2);
  let pageScale = +(psdRadio/pageRadio).toFixed(2);
  return pageScale
}


module.exports = {
  formatTime,
  request,
  rpxTopx,
  fixPage
}
