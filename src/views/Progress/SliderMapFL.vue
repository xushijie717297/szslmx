<template>
  <div id="sliderContainer" class="esri-widget" v-show="isSlider">
    <span class="sliderValue">
      <el-select class="dateselect" v-model="couponSelected" @change="getCouponSelected">
        <el-option v-for="item in couponList" :key="item.code" :value="item.code" :label="item.name"></el-option>
      </el-select>
    </span>
    <div id="sliderInnerContainer">
      <div id="slider"></div>
    </div>
    <div id="playButton" class="esri-widget esri-widget--button toggle-button">
      <div>
        <span class="toggle-button-icon esri-icon-play" aria-label="play icon"></span>
        播放
      </div>
      <div>
        <span class="toggle-button-icon esri-icon-pause" aria-label="pause icon"></span>
        暂停
      </div>
    </div>
  </div>
</template>

<script>
// import WindowsEvent from "@/components/js/WindowsEvent";

export default {
  name: "sliderMapFL",
  components: {
  },
  data() {
    return {
      esriAPI: null,
      view: null,
      seattleLayer: null,
      selItem: null,
      couponList: [],
      animation: null,
      couponSelected: "", 
      playButton: null,
      slider: null,
      isSlider: false,
      sliderMax: 120,
      direction: 0.2,
      delay: 1000 / 30
    };
  },
  mounted() {
    console.log("SliderMapFL==>mounted");
    window.addEventListener("event_name", this.myEventListener);//初始化注册事件
    var self = this;
    this.playButton = document.getElementById("playButton");
    this.playButton.addEventListener("click", function() {
      if (self.playButton.classList.contains("toggled")) {
        self.stopAnimation();
      } else {
        self.startAnimation();
      }
    });
  },
  methods: {
    getCouponSelected() {
      for (let i = 0; i < this.couponList.length; i++) {
        const element = this.couponList[i];
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
        this.sliderMax = 120;
        this.direction = 0.2;
        this.delay = 1000 / 30;
      }else if(this.selItem.code == "variety"){
        this.sliderMax = 23;
        this.direction = 1;
        this.delay = 5000;
      }
    },
    myEventListener(event) {
      var typeMy = event.detail.type;
      var obj = event.detail.data;
      if (typeMy == "initSlider") {
        this.esriAPI = obj.esriAPI;
        this.view = obj.view;
        this.seattleLayer = obj.seattleLayer;
        this.couponList = obj.couponList;
        this.couponSelected = this.couponList[0].code;
        this.selItem = this.couponList[0];
        this.initSlider();
      }else if(typeMy == "setInitSlider"){
        const isBool = obj;
        this.setInitSlider(isBool);
      }else if(typeMy == "closeSlider"){
        this.closeSlider();
      }
    },
    initSlider(){//初始化加载
      console.log("initSlider");
      var self = this;
      this.isSlider = true;
      this.animation = null;
      this.setPropertyBind();
      if (!this.slider) {
        this.slider = new this.esriAPI.Slider({
          container: "slider",
          min: 0,
          max: this.sliderMax,
          values: [0],
          step: 1,
          labelsVisible: true,
          rangeLabelsVisible: true,
          precision: 0
        });
        this.slider.on("thumb-drag", function(event){
          self.stopAnimation();
          self.setResultAge(event.value);
        });
      }else{
        this.slider.max = this.sliderMax;
      }
      this.setResultAge(this.slider.min);
      this.viewUpdating();
    },
    setInitSlider(isBool){//重新初始化加载
      this.isSlider = true;
      this.setPropertyBind();
      console.log("setInitSlider");
      if (!this.slider) {
        return;
      }else{
        this.slider.max = this.sliderMax;
      }
      console.log("setInitSlider==>" + isBool);
      if (isBool) {
        this.setResultAge(this.slider.min);
        this.viewUpdating();
      }else{
        this.setResultAge(this.slider.max);
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
      this.slider.viewModel.setValue(0, value);
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
        renderer.visualVariables = [];
        renderer.field = this.selItem.playField + age;
      }
      return renderer;
    },
    startAnimation() {
      this.stopAnimation();
      if (this.slider.values[0] == this.slider.max) {
        this.slider.viewModel.setValue(0, 0);
      }
      this.animation = this.animate(this.slider.values[0]);
      this.playButton.classList.add("toggled");
    },
    stopAnimation() {
      if (!this.animation) {
        return;
      }
      this.animation.remove();
      this.animation = null;
      this.playButton.classList.remove("toggled");
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
        if (value > self.slider.max) {
          self.setResultAge(self.slider.max);
          self.stopAnimation();
          return;
        }
        self.setResultAge(value);
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
      console.log("SliderMapFL==>destroyed");
      window.removeEventListener('event_name', this.myEventListener);
  }
};
</script>

<style scoped>
/**
* slider
*/
#sliderContainer {
  flex: 0 0 80px;
  order: 2;
  display: flex;
  flex-flow: row;
  padding: 0 12px;
  /* background-color: rgba(204,204,204,0.7); */
  background-color: var(--mian-bg);
  position: absolute;
  width: 100%;
  z-index: 1;
  bottom: 0;
  color: #575e6d;
  -moz-box-shadow: 0 0 5px #acb4c3;
  -webkit-box-shadow: 0 0 5px #acb4c3;
  box-shadow: 0 0 5px #acb4c3;
}

.sliderValue {
  flex: 0 0 100px;
  order: 1;

  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  font-size: 150%;
}

#sliderInnerContainer {
  flex: 1 1 auto;
  order: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
}

#slider {
  color: #808080;
  width: 100%;
  background-color: transparent;
}
/**
* Play/Stop toggle button
*/

#playButton {
  flex: 0 0 100px;
  order: 3;

  margin: 20px 0;
}

.toggle-button {
  display: flex;
}

.toggle-button.toggled .toggle-button-icon {
  color: #cc1b1b;
}

.toggle-button .toggle-button-icon {
  color: #1bcc1b;
}

.toggle-button > :nth-child(2) {
  display: none;
}

.toggle-button.toggled > :nth-child(1) {
  display: none;
}

.toggle-button.toggled > :nth-child(2) {
  display: block;
}
.dateselect {
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 20px;
}
</style>

<style lang="less" scoped>
  /deep/ .el-select {
    width: 200px;
  }
</style>