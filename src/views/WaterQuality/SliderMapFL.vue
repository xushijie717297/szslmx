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
// import WindowsEvent from "@/components/js/WindowsEvent";
import SliderFL from "./SliderFL";
export default {
  name: "sliderMapFL",
  components: {
    SliderFL
  },
  props: [
    'silderMapStep',
    'sliderMapResizeTime'
  ],
  watch: {
    sliderMapResizeTime() {
      let _step = this.silderMapStep / 5;
      let _sliderLabelArray = [0, 1, 2, 3, 4, 5];
      for (var i = 0; i <= 5; i++) {
        _sliderLabelArray[i] = (i * _step).toFixed(2);
      }
      this.isPlay = false;
      this.sliderValue = 5;
      this.sliderLabelArray = _sliderLabelArray;
      this.initSlider();
    }
  },
  data() {
    return {
      animation: null,
      sliderLabelArray: [],
      sliderResizeTime: 0,
      sliderValue: 5,
      isPlay: false,
      sliderOmitLocation: "center",//left,center,right
      sliderType: "time",//time,value
      sliderMax: 6,//24,121
      sliderMin: 0,
      direction: 1,
      delay: 1000,
    };
  },
  methods: {
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
    initSlider(){//初始化加载
      this.animation = null;
      this.sliderResizeTime = new Date().getTime();
      this.setResultAge(this.sliderValue);
    },
    setResultAge(value) {
      this.sliderValue = value;
      var _sliderValue = Number(this.sliderLabelArray[this.sliderValue]);
      var obj = {
        sliderValue: _sliderValue,
        level: Number(this.sliderValue)
      };
      console.log("setResultAge:", obj);
      this.$emit("DiffusionDrawPlaying", obj);
    },
    startAnimation() {
      this.stopAnimation();
      if (this.sliderValue > this.sliderMax - 2) {
        this.sliderValue = -1;
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
        if (!animating) {
          return;
        }
        value += self.direction;
        if (value > self.sliderMax - 1) {
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
    }
  }
};
</script>

<style scoped>
.sliderContainer {
  height: 40px;
  flex: 0 0 80px;
  order: 2;
  display: flex;
  flex-flow: row;
  /* padding: 0 6px 0 17px; */
  /* margin: 0 20px; */
  border-radius: 20px;
  background-color: var(--mian-bg);
  color: #575e6d;
  /* -moz-box-shadow: 0 0 1px #080D12; */
  /* -webkit-box-shadow: 0 0 1px #080D12; */
  /* box-shadow: 0 0 1px #080D12; */
}
.sliderFLValue {
  flex: 0 0 50px;
  order: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  font-size: 14px;
}
</style>