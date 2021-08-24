<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>
<script>
export default {
  name: "App",
  provide(){
    return{
      reload:this.reload
    }
  },
  data () {
    return {
      isRouterAlive:true
    }
  },
  beforeCreate(){
    let count = 0;
    let imgs = [
    //用require的方式添加图片地址，直接添加图片地址的话，在build打包之后会查找不到图片，因为打包之后的图片名称会有一个加密的字符串
        require('./views/404/404.gif')
    ]
    for (let img of imgs) {
        let image = new Image();
        image.src = img;
        image.onload = () => {
            count++;
        };
    }
  },
  methods: {
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(function(){
      this.isRouterAlive = true;
      })
    }
  },
    mounted() {
      window.addEventListener('offline', ()=>{
       // 网络由正常常到异常时触发
       sessionStorage.locationUrl=window.location.href;
       this.$router.replace('/error')
      });
      window.addEventListener('online',()=>{
        window.location.href=sessionStorage.locationUrl
      });
    }
};
</script>
<style lang="less">
@import "./assets/css/base.css";
@import "./assets/css/popup.less";
*{
-webkit-touch-callout:none; /*系统默认菜单被禁用*/
-webkit-user-select:none; /*webkit浏览器*/
-khtml-user-select:none; /*早期浏览器*/
-moz-user-select:none; /*火狐*/
-ms-user-select:none; /*IE10*/
user-select:none;
}
*{
	margin: 0;
	padding: 0;
}
html,body,#app{
	height: 100%;
	width: 100%;
  overflow-x: hidden;
  background: #242838;
}
    #statusBar{
      height: 24px;
      background: #242838;
  }
.esri-view .esri-view-surface--inset-outline:focus::after {
    outline: none !important;
}
#tab-bar{
	height: 50px !important;
}
::-webkit-scrollbar  
{  
	display: none!important;
    width: 0px;  
    height: 0px;  
}
li{
  list-style: none;
}
 .diffuseBubbles {
    position: absolute;
    text-align: center;
    top:0px;
    left:0px;
    background: transparent;
    border: none;
  }
  .diffuseBubbles:before {
    content: " ";
    position: absolute;
    text-align: center;
    top: 4px;
    left: 1px;
    background-color: #fff;
    width: 8px;
    height: 2px;
    z-index: 1;
  }
  .diffuseBubbles-up:after {
    content: " ";
    position: absolute;
    text-align: center;
    top: 1px;
    left: 4px;
    background-color: #fff;
    width: 2px;
    height: 8px;
  }
  .diffuseBubbles-circle-icon .blue {
    background-color: #05AEFD;
    animation: pulse 4s ease-out infinite 1s;
  }
  .diffuseBubbles-circle-icon .blue:after {
    box-shadow: 0 0 2px 2px #05AEFD;
    background: rgba(5, 174, 253, 0.4);
    animation: pulsate 4s ease-out infinite 1s;
  }
  .diffuseBubbles-circle-icon .red {
    background-color: rgba(213, 22, 22, 0.8);
    animation: pulse 4s ease-out infinite 0s;
  }
  .diffuseBubbles-circle-icon .red:after {
    box-shadow: 0 0 2px 2px rgba(213, 22, 22, 0.8);
    background: rgba(213, 22, 22, 0.4);
    animation: pulsate 4s ease-out infinite 0s;
  }
  .diffuseBubbles-circle-icon .green {
    background-color: rgba(29, 198, 41, 0.8);
    animation: pulse 4s ease-out infinite 0.5s;
  }
  .diffuseBubbles-circle-icon .green:after {
    box-shadow: 0 0 2px 2px rgba(29, 198, 41, 0.8);
    background: rgba(29, 198, 41, 0.4);
    animation: pulsate 4s ease-out infinite 0.5s;
  }
  .diffuseBubbles-circle-icon {
    position: absolute;
    text-align: center;
    top:0px;
    left:0px;
    width: 10px;
    height: 10px;
    border-radius: 100%;
  }
  .diffuseBubbles-circle-icon:after {
    content: "";
    -webkit-border-radius: 100%;
    border-radius: 100%;
    height: 300%;
    width: 300%;
    position: absolute;
    text-align: center;
    top:0px;
    left:0px;
    margin: -100% 0 0 -100%;
    opacity: 0;
  }
  @keyframes pulsate {
    40% {
      transform: scale(0.1, 0.1);
      opacity: 0;
      -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
      filter: alpha(opacity=0);
    }
    80% {
      opacity: 1;
      -ms-filter: none;
      filter: none;
    }
    100% {
      transform: scale(1.2, 1.2);
      opacity: 0;
      -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
      filter: alpha(opacity=0);
    }
  }
  @keyframes pulse {
    40% {
      transform: scale(1, 1);
    }
    65% {
      transform: scale(2, 2);
    }
    100% {
      transform: scale(1, 1);
    }
  }
//*************************************************popupEcharts*************************************************
.popupEcharts {
    position: absolute;
    text-align: center;
    top:0px;
    left:0px;
    &:hover {
        z-index: 1;
    }
}

.close-button-popupEcharts {
    position: absolute;
    top: 0;
    right: 0;
    padding: 6px 6px 0 0;
    text-align: center;
    width: 18px;
    height: 14px;
    font-size: 14px;
    font-family: "Microsoft YaHei";
    color: #c3c3c3;
    text-decoration: none;
    font-weight: bold;
    background: transparent;
}

.content-wrapper-popupEcharts-pressure {
    text-align: center;
    min-width: 100px;
    overflow-y: auto;
    background-image: url('../static/imag/waterFactory/pressurebg_01.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
    text-align: left;
    border-radius: 4px;
    border: 1px solid #310E81;
}
.content-wrapper-popupEcharts-traffic {
    text-align: center;
    min-width: 130px;
    overflow-y: auto;
    background-image: url('../static/imag/waterFactory/trafficbg_01.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
    text-align: left;
    border-radius: 4px;
    border: 1px solid #05798B;
}

.content-popupEcharts {
    margin: 3px 6px;
    line-height: 1.4;
    max-width: 300px;
}

.content-txttitle-popupEcharts {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #FFFFFF;
    text-shadow: 0px 1px 0px rgba(18, 2, 8, 0.6);
    margin-right: 6px;
    cursor: default;
}
.tbImg-popupEcharts {
    padding: 8px;
    float: right;
    margin-top: 5px;
    background-image: url('../static/imag/waterFactory/tk_03.png');
    background-repeat: no-repeat;
    cursor: pointer;
}

.content-value-popupEcharts-pressure {
    background-image: url('../static/imag/waterFactory/pressurebg_02.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    border-radius: 2px;
    margin-bottom: 5px;
    margin-top: 3px;
}

.content-value-popupEcharts-traffic {
    background-image: url('../static/imag/waterFactory/trafficbg_02.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    border-radius: 2px;
    margin-bottom: 5px;
    margin-top: 3px;
}

.content-txtcontent-popupEcharts {
    margin: 10px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #FFFFFF;
    text-shadow: 0px 1px 0px #190A3D;
}

.content-txtcontent-yj-popupEcharts {
    margin: 10px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: red;
    text-shadow: 0px 1px 0px #190A3D;
}

.tip-container-popupEcharts {
    margin: 0 auto;
    height: 20px;
    overflow: hidden;
    position: absolute;
    width: 100%;
    // top: 57px;
}

.tip-popupEcharts-pressure {
    width: 16px;
    height: 12px;
    background-image: url('../static/imag/waterFactory/pressurebg_03.png');
    background-repeat: no-repeat;
    background-position: center center;
    margin: 0px auto 0;
}
.tip-popupEcharts-traffic {
    width: 16px;
    height: 12px;
    background-image: url('../static/imag/waterFactory/trafficbg_03.png');
    background-repeat: no-repeat;
    background-position: center center;
    margin: 0px auto 0;
}

//*************************************************popupTable*************************************************

.popupTable {
    position: absolute;
    text-align: center;
    top:0px;
    left:0px;
    &:hover {
        z-index: 1;
    }
}

.close-button-popupTable {
    position: absolute;
    top: 0;
    right: 0;
    padding: 6px 6px 0 0;
    text-align: center;
    width: 18px;
    height: 14px;
    font-size: 14px;
    font-family: "Microsoft YaHei";
    color: #c3c3c3;
    text-decoration: none;
    font-weight: bold;
    background: transparent;
}

.content-wrapper-popupTable {
    text-align: center;
    min-width: 120px;
    overflow-y: auto;
    // background-image: url('~@/assets/popup/dummybg_01.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
    text-align: left;
    border-radius: 4px;
    border: 1px solid #055715;
}

.content-popupTable {
    margin: 3px 6px;
    line-height: 1.4;
    max-width: 300px;
}

.content-txttitle-popupTable {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #FFFFFF;
    text-shadow: 0px 1px 0px rgba(18, 2, 8, 0.6);
    margin: 0px 3px;
    cursor: default;
}

.content-txtcontent-popupTable {
    margin: 10px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #FFFFFF;
    text-shadow: 0px 1px 0px #190A3D;
    margin-bottom: 5px;
    margin-top: 3px;
}

.content-txtcontent-yj-popupTable {
    margin: 10px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: yellow;
    text-shadow: 0px 1px 0px #190A3D;
    margin-bottom: 5px;
    margin-top: 3px;
}

.tip-container-popupTable {
    margin: 0 auto;
    width: 40px;
    height: 20px;
    position: relative;
    overflow: hidden;
}

.tip-popupTable {
    width: 16px;
    height: 12px;
    // background-image: url('~@/assets/popup/dummybg_03.png');
    background-repeat: no-repeat;
    background-position: center center;
    margin: 0px auto 0;
}
.echarts-popupTable{
    border-top: 1px solid #ccc;
    height:150px;
    width:300px;
}
.table-popupTable{
    border-top: 1px solid rgba(255,255,255,0.2);
    padding: 5px 0px 3px 0px;
}
.table-thead-popupTable {
    color: #909399;
    font-weight: 500;
}

.table-td-b-popupTable{
    border: 1px solid #dcdfe6;
    text-align: center;
    background: #dcdfe6;
}

.table-td-l-popupTable{
    text-align: left;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #FFFFFF;
    text-shadow: 1px 1px 0px #190A3D;
    line-height: 20px;
    width: 30px;
}

.table-td-r-popupTable{
    text-align: left;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #FFFFFF;
    text-shadow: 1px 1px 0px #190A3D;
    line-height: 20px;
    // background-image: url('~@/assets/popup/dummybg_02.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    border-radius: 2px;
}

.tbImg-popupTable {
    padding: 8px;
    float: right;
    margin-top: 5px;
    // background-image: url('~@/assets/popup/弹框_03.png');
    background-repeat: no-repeat;
    cursor: pointer;
}

.tab-popupTable {
    position: absolute;
    right: 15px;
    z-index: 1;
    margin-top: 4px;
    cursor: pointer;
    background-color: #606266;
}

.tab-popupTable .tab-radio-popupTable{
    display: none;
}

.tab-handler-popupTable{
    position: relative;
    z-index: 2;
    display: block;
    float: left;
    padding: 3px;
    color: white;
    cursor: pointer;
    font-size: 12px;
    font-weight: normal;
}

.tab-radio-popupTable:checked + .tab-handler-popupTable{
    color: #fff;
    background-color: #58a632;
}

//*************************************************popupLable*************************************************
.bgSpan-popupLable {
    font-size: 18px;
    font-weight: bold;
    background: #05294b;
    margin-right: 10px;
    padding: 0px 3px;
    cursor: default;
}
.bgSpan-popupLable1 {
    // background-image: url('~@/assets/popup/blackinfowin1.png');
    background-repeat: no-repeat;
    margin-right: 10px;
    padding-right: 21px;
    cursor: default;
}
.popupLable {
    position: absolute;
    text-align: center;
    top:0px;
    left:0px;
    &:hover {
        z-index: 1;
    }
}


.close-button-popupLable {
    position: absolute;
    top: 0;
    right: 0;
    padding: 6px 6px 0 0;
    text-align: center;
    width: 18px;
    height: 14px;
    font-size: 14px;
    font-family: "Microsoft YaHei";
    color: #c3c3c3;
    text-decoration: none;
    font-weight: bold;
    background: transparent;
}

.content-wrapper-popupLable {
    text-align: center;
    min-height: 30px;
    overflow-y: auto;
    // background: #040f1d;
    // background-image: linear-gradient(#d3d4d9,#040f1d,#040f1d,#040f1d);
    // border: 0.3pt solid rgba(4,15,29,0.5);
    // background-image: url('~@/assets/popup/blackinfowinBg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    box-shadow: 0 3px 14px rgba(4,15,29, 0.4);
    padding: 1px;
    text-align: left;
    border-radius: 6px;
    font-size: 9px;
}

.content-popupLable {
    margin: 3px 10px;
    line-height: 1.4;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    color: white;
    max-width: 300px;
}

.content-txttitle-popupLable {
    cursor: default;
}

.tip-container-popupLable {
    margin: 0 auto;
    width: 40px;
    height: 20px;
    position: relative;
    overflow: hidden;
}

.tip-popupLable {
    background: #040f1d;
    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
    width: 17px;
    height: 17px;
    padding: 1px;
    margin: -10px auto 0;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
}

//*************************************************popupLableBg*************************************************
.popupLableBg {
    position: absolute;
    text-align: center;
    top:0px;
    left:0px;
    &:hover {
        z-index: 1;
    }
}

.content-wrapper-popupLableBg {
    text-align: center;
    min-height: 25px;
    overflow-y: auto;
    background: #2E60DE;
    border: 1px solid #0F3B60;
    // border-radius: 1px;
}

.content-popupLableBg {
    margin: 3px 3px;
    line-height: 1.4;
    font-family: "Microsoft YaHei";
    font-size: 12px;
    color: #ffffff;
    max-width: 300px;
    font-weight: bold;
}

.content-txttitle-popupLableBg {
    cursor: default;
}

//*************************************************popupTableWater*************************************************

.popupTableWater {
    position: absolute;
    text-align: center;
    top:0px;
    left:0px;
    &:hover {
        z-index: 1;
    }
}
.content-popupTableWater {
    line-height: 1.4;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    color: #333;
    max-width: 300px;
}
.tip-container-popupTableWater {
    margin: 0 auto;
    width: 40px;
    height: 20px;
    position: relative;
    overflow: hidden;
}
.tip-popupTableWater {
    background: #EB8D32;
    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
    width: 17px;
    height: 17px;
    padding: 1px;
    margin: -10px auto 0;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
}
.table-popupTableWater{
    background: #EB8D32;
    width: 200px;
    padding: 8px;
    border-radius: 3px;
    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
}
.table1-popupTableWater{
    border-top: 1px solid #C06914;
    width: 100%;
}
.table-td-l-popupTableWater{
    border-left: 1px solid #C06914;
    border-right: 1px solid #C06914;
    border-bottom: 1px solid #C06914;
    text-align: right;
    background-color: #DC822B;
    width: 45%;
    padding-right: 5px;
}
.table-td-r-popupTableWater{
    border-left: 0;
    border-right: 1px solid #C06914;
    border-bottom: 1px solid #C06914;
    text-align: center;
    background-color: #F1A357;
    width: 55%;
}

//*************************************************popupTitle*************************************************

.popupTitle {
    position: absolute;
    text-align: center;
    top:0px;
    left:0px;
    &:hover {
        z-index: 1;
    }
}
.content-popupTitle {
    line-height: 1.4;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    color: #333;
    max-width: 300px;
}
.table-popupTitle{
    background: #ffffff;
    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
}
.table1-popupTitle{
    border-top: 1px solid #19293D;
    width: 100%;
}
.table-td-l-popupTitle{
    border-left: 1px solid #19293D;
    border-right: 1px solid #19293D;
    border-bottom: 1px solid #19293D;
    text-align: right;
    background-color: #294260;
    padding: 3px 10px;
    color: #ffffff;
    font-weight: bold;
    cursor: default;
}
.table-td-r-popupTitle{
    border-left: 0;
    border-right: 1px solid #19293D;
    border-bottom: 1px solid #19293D;
    text-align: center;
    background-color: #ffffff;
    padding: 3px 10px;
    color: #374049;
    font-weight: bold;
}
</style>
