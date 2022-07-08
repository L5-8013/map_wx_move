// components/mapGame/mapGame.js
const app = getApp()
const util = require('../../utils/util');
let startTouch = {
  x: 0,
  y: 0
};
let isMove = false;
let isRun = false;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    px: 0,
    py: 0,
    mainDom: null,
    mapDom: null,
    signDom: null,
    runData: [],
    animationSign: null, //动画输出
    animationMap: null, //动画输出
  },
  ready: function() {
    //在组件在视图层布局完成后执行
    const query = wx.createSelectorQuery().in(this)
    query.select('#mainId').boundingClientRect();
    query.select('#mapId').boundingClientRect();
    query.select('#signId').boundingClientRect();
    query.exec((res) => {
      this.setData({
        mainDom: res[0],
        mapDom: res[1],
        signDom: res[2]
      })
      //定位到目标处
      this.fixationShot();
    });
    //目标动画对象
    this.signAnimation = wx.createAnimation({
      duration: 0,
    });
    //地图动画对象
    this.mapAnimation = wx.createAnimation({
      duration: 0,
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    touchStart(e) {
      this.setData({
        animationMap:null
      })
      startTouch = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }
      isMove = true;
    },
    touchMove(e) {
      if (isMove && !isRun) {
        let sx = (e.touches[0].clientX - startTouch.x);
        let sy = (e.touches[0].clientY - startTouch.y);
  
        let addNumX = this.data.px + (sx);
        let addNumY = this.data.py + (sy);
    
        let dealData = this.disposeMax(addNumX,addNumY);
        startTouch = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        }
        this.mapAnimation.top(dealData.y).left(dealData.x).step();
        this.setData({
          animationMap: this.mapAnimation.export(),
          px: dealData.x,
          py: dealData.y,
        });
      }
    },
    touchEnd() {
      isMove = false;
    },
  
    //镜头定住
    fixationShot(callback) {
      const query = wx.createSelectorQuery().in(this);
      query.select('#signId').fields({rect:true,scrollOffset:true});
      query.select('#mapId').fields({rect:true,scrollOffset:true});
      query.exec((res)=>{      
        let sigiDom ={
          left:res[0].left-res[1].left,
          top:res[0].top-res[1].top
        };
        // console.log(sigiDom.left,sigiDom.top);
        let centreXY = {
          x: this.data.mainDom.width / 2,
          y: this.data.mainDom.height / 2
        };
        let scrollX = sigiDom.left > centreXY.x ? sigiDom.left - centreXY.x : 0;
        let scrollY = sigiDom.top > centreXY.y ? sigiDom.top - centreXY.y : 0;
        let maxY = this.data.mapDom.height - this.data.mainDom.height;
        let maxX = this.data.mapDom.width - this.data.mainDom.width;
        // console.log(scrollX, scrollY);
        if (scrollX >= maxX) {
          scrollX = maxX
        }
        if (scrollY >= maxY) {
          scrollY = maxY
        }
  
        this.mapAnimation.top(-scrollY).left(-scrollX).step();
        this.setData({
          animationMap: this.mapAnimation.export(),
          px: -scrollX,
          py: -scrollY
        });
  
        setTimeout(()=>{
          isRun=true;
          callback && callback();
        },100)
       
      })
    },
    //镜头跟随
    followTarget(x,y,callback){
      //rpx 转 px
      let pxc= util.rpxTopx(x);
      let pyc = util.rpxTopx(y);
  
      let followX = this.data.px - (pxc-this.data.signDom.left);
      let followY = this.data.py - (pyc-this.data.signDom.top);
  
      let followDeal = this.disposeMax(followX,followY);
  
      this.signAnimation.top(pyc).left(pxc).step({duration:1000});
  
      this.mapAnimation.top(followDeal.y).left(followDeal.x).step({duration:1000});
      this.setData({
        animationSign: this.signAnimation.export(), //输出动画  
        animationMap: this.mapAnimation.export(), //输出动画  
        ['signDom.left']:pxc,
        ['signDom.top']:pyc,
        px: followDeal.x,
        py: followDeal.y,
      });
      setTimeout(()=>{
        isRun=false;
        callback && callback();
      },1100)
    },
    disposeMax(item,item2){
      let maxY = this.data.mapDom.height - this.data.mainDom.height;
      let maxX = this.data.mapDom.width - this.data.mainDom.width;
      if (item >= 0) {
        item = 0
      } else if (item <= -maxX) {
        item = -maxX
      }
      if (item2 >= 0) {
        item2 = 0
      } else if (item2 <= -maxY) {
        item2 = 0 - maxY
      }
      return {
        x:item,
        y:item2
      }
    },
  }
})