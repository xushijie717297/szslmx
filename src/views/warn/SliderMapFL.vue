<template>
  <div class="sliderMapFL">
    <div class="sliderContainer">
      <SliderFL @changeClick="changeClick" @playClick="playClick"
        :sliderLabelArray="sliderLabelArray"
        :sliderResizeTime="sliderResizeTime" 
        :sliderValue="sliderValue" 
        :isPlay="isPlay" 
        :sliderOmitLocation="sliderOmitLocation" 
        :sliderType="sliderType" 
        :sliderMax="sliderMax" 
        :sliderMin="sliderMin" 
      />
    </div>
  </div>
</template>

<script>
import SliderFL from "./SliderFL";

export default {
  name: "sliderMapFL",
  components: {
    SliderFL
  },
  data() {
    return {
      esriAPI: null,
      view: null,
      seattleLayer: null,
      selItem: {code:"", name:""},
      couponList: [],
      animation: null,
      couponSelected: "", 
      playButton: null,
      isSlider: false,
      sliderLabelArray: ['00:00','04:00','08:00','12:00','16:00','20:00'],
      sliderResizeTime: 0,
      sliderValue: 0,
      isPlay: false,
      sliderOmitLocation: "center",//left,center,right
      sliderType: "time",//time,value
      sliderMax: 6,//24,121
      sliderMin: 0,
      direction: 1,
      delay: 5000
    };
  },
  mounted() {
    // console.log("SliderMapFL==>mounted");
    // window.addEventListener("event_name", this.myEventListener);//初始化注册事件
  },
  methods: {
    getCouponSelected() {
      for (let i = 0; i < this.couponList.length; i++) {
        const element = this.couponList[i];
        // console.log(element)
        if (this.couponSelected == element.code) {
          this.selItem = element;
          break;
        }
      }
      this.stopAnimation();
      this.setInitSlider(false);
    },
    setPropertyBind(){
      if (this.selItem.code == "Diffusion") {
        this.sliderType = "value";
        this.sliderMax = 121;
        this.direction = 1;
        this.delay = 100;
      }else if(this.selItem.code == "variety"){
        this.sliderType = "time";
        this.sliderMax = 24;
        this.direction = 1;
        this.delay = 5000;
      }
    },
    // myEventListener(event) {
    //   var typeMy = event.detail.type;
    //   var obj = event.detail.data;
    //   if (typeMy=="dummyResize") {
    //     if (this.isSlider) {
    //       this.sliderResizeTime = new Date().getTime();
    //     }
    //   }else if (typeMy == "initSlider") {
    //     this.esriAPI = obj.esriAPI;
    //     this.view = obj.view;
    //     this.seattleLayer = obj.seattleLayer;
    //     this.couponList = obj.couponList;
    //     this.couponSelected = this.couponList[0].code;
    //     this.selItem = this.couponList[0];
    //     this.initSlider();
    //   }else if(typeMy == "setInitSlider"){
    //     const isBool = obj;
    //     this.setInitSlider(isBool);
    //   }else if(typeMy == "closeSlider"){
    //     this.closeSlider();
    //   }
    // },
    changeClick(_selValue){
      this.stopAnimation();
      this.setResultAge(_selValue);
    },
    playClick(_isPlay){
      this.isPlay = !_isPlay;
      if (this.isPlay) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    },
    initSlider(obj){//初始化加载
    // debugger
    // console.log(obj)
      this.esriAPI = obj.esriAPI;
      this.view = obj.view;
      this.seattleLayer = obj.seattleLayer;
      this.couponList = obj.couponList;
      this.couponSelected = this.couponList[0].code;
      this.selItem = this.couponList[0];
      // console.log("initSlider");
      this.isSlider = true;
      this.animation = null;
      // this.setPropertyBind();
      this.sliderResizeTime = new Date().getTime();
      this.setResultAge(this.sliderMin);
      // this.viewUpdating();
    },
    setInitSlider(isBool){//重新初始化加载
      this.isSlider = true;
      this.setPropertyBind();
      this.sliderResizeTime = new Date().getTime();
      // console.log("setInitSlider==>" + isBool);
      if (isBool) {
        this.setResultAge(this.sliderMin);
        this.viewUpdating();
      }else{
        this.setResultAge(this.sliderMax - 1);
      }
    },
    viewUpdating(){
      var self = this;
      var handle = this.view.watch('updating', function(newValue, oldValue){
        if (newValue != oldValue && !newValue) {
          handle.remove();
          setTimeout(function() {
            self.startAnimation();
          }, 1000);
        }
      });
    },
    setResultAge(value) {
      this.sliderValue = value;
      this.seattleLayer.renderer = this.createRenderer(value);
    },
    createRenderer(age) {
      var renderer = this.seattleLayer.renderer.clone();
      if (this.selItem.code == "Diffusion") {
        const visualVariables = [
          {
            type: "opacity",
            field: this.selItem.playField,
            stops: [
                { value: age, opacity: 1},
                { value: age + 1, opacity: 0}
            ]
          }
        ];
        renderer.visualVariables = visualVariables;
      }else if(this.selItem.code == "variety"){
        if (this.selItem.playField.indexOf("Pressure") == -1) {
          renderer.visualVariables = [];
        }
        renderer.field = this.selItem.playField + age;
      }
      return renderer;
    },
    startAnimation() {
      this.stopAnimation();
      // console.log(this.stopAnimation())
      if (this.sliderValue > this.sliderMax - 2) {
        this.sliderValue = this.sliderMin;
      }
      this.animation = this.animate(this.sliderValue);
      this.isPlay = true;
    },
    stopAnimation() {
      if (!this.animation) {
        return;
      }
      this.animation.remove();
      this.animation = null;
      this.isPlay = false;
    },
    animate(startValue) {
      var self = this;
      var animating = true;
      var value = startValue;
      var frame = function(timestamp) {
        if (!animating || !self.isSlider) {
          return;
        }
        value += self.direction;

        if (value > self.sliderMax - 1) {
          self.setResultAge(self.sliderMax - 1);
          self.stopAnimation();
          return;
        }
        self.setResultAge(Math.floor(value));
        setTimeout(function() {
          requestAnimationFrame(frame);
        }, self.delay);
      };
      frame();
      return {
        remove: function() {
          animating = false;
        }
      };
    },
    closeSlider(){
      this.isSlider = false;
      this.stopAnimation();
    }
  },
  destroyed() {
      // console.log("SliderMapFL==>destroyed");
      // window.removeEventListener('event_name', this.myEventListener);
  }
};
</script>

<style scoped>
@media screen and (orientation: landscape) {
    /* 横屏 */
.sliderMapFL{
  /* position: fixed; */
  width: 75%;
  /* z-index: 1; */
  /* bottom: 24px; */
}
}

@media screen and (orientation: portrait) {
    /* 竖屏 */
.sliderMapFL{
  /* position: fixed; */
  width: 100%;
  /* z-index: 1; */
  /* bottom: 24px; */
}
}
/* .sliderMapFL{ */
  /* position: fixed; */
  /* width: 100%; */
  /* z-index: 1; */
  /* bottom: 24px; */
/* } */
.sliderContainer {
  height: 40px;
  flex: 0 0 80px;
  order: 2;
  display: flex;
  flex-flow: row;
  padding: 0 6px 0 17px;
  margin: 0 20px;
  border-radius: 20px;
  background-color: #0d161d;
  color: #657984;
  -moz-box-shadow: 0 0 1px #080D12;
  -webkit-box-shadow: 0 0 1px #080D12;
  box-shadow: 0 0 1px #080D12;
}
.sliderLable {
  font-weight: bold;
  font-size: 18px;
  width: 200px;
}
.sliderFLValue {
  flex: 0 0 100px;
  order: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  font-size: 150%;
}
</style>
