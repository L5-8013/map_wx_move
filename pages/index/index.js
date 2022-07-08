// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  onLoad() {
    
  },
  tabClick(){
    let x =  Math.floor(Math.random() * 1348) + 1;
    let y =  Math.floor(Math.random() * 1348) + 1;
    const mapGame = this.selectComponent('#mapGame');
    mapGame.fixationShot(()=>{
      mapGame.followTarget(x,y);
    });
  }
})
