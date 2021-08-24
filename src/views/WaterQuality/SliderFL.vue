<template>
  <div class="sliderFL">
    <!-- <div :class="[item.isOmit?'sliderOmitCell':'sliderCell']" v-for="(item,index) in sliderData" :key="index" v-on:click="changeClick(item)">
      <div :class="[item.isTime?'valueCellColor':'valueCell']" v-show="!item.isOmit">{{item.label}}</div>
      <div :class="[item.isTime?'valueCellColor':'valueCell']" v-show="item.isOmit">.</div>
      <div class="selectDivider" :title="[item.isOmit?item.label:'']" :class="{active: item.select}"></div>
    </div> -->
    <!-- <div class="sliderPlay" :title="isPlay?'暂停':'播放'" v-on:click="playClick">
      <i class="iconfont" :class="[isPlay?'iconiconstop':'iconbofang']" ></i>
    </div> -->
            <van-count-down
            ref="countDown"
            millisecond
            :time="5000"
            :auto-start="false"
            format="ss"
            @finish="finish"
            @change="timeData"
        />
      <div class="bofang">
        <p class="icons" v-if="iconShow"  @click="start()">
          <span class="iconfont iconbofang2" ></span>
        </p>
        <p class="icons" v-else @click="pause()">
          <span class="iconfont iconbofang1" ></span>
        </p>
        <!-- <van-icon v-if="iconShow" class="icon" name="play-circle" size="36" color="#252b4" @click="start()" /> -->
        <!-- <van-icon v-else class="icon" name="pause-circle" size="36" color="#252b4" @click="pause()" /> -->
        <!-- <i class="van-icon" :class="[isPlay?'van-icon-pause-circle':'van-icon-play-circle']"></i> -->
        <van-circle v-model="currentRate" :stroke-width="60" :rate="rate" size='36' color="#00e7ff" layer-color="#424b74" :speed="100" />
      </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { CountDown } from 'vant';
import { Icon } from 'vant';
import { Circle } from 'vant';

Vue.use(Circle);
Vue.use(Icon);
Vue.use(CountDown);
export default {
  name: "sliderFL",
  props: [
    'sliderLabelArray',
    'sliderResizeTime',//0
    'sliderValue',//0
    'isPlay',//false
    'sliderOmitLocation',//left,center,right
    'sliderType',//time,value
    'sliderMax',//24,121
    'sliderMin'//0
  ],
  watch: {
    sliderResizeTime() {
      this.initData();
    },
    sliderValue() {
      this.playData();
    }
  },
  data() {
    return {
      sliderData: [],
      currentRate:0,
      rate:0,
      iconShow:true
    };
  },
  created(){
    this.initData();
  },
  mounted() {
  },
  methods: {
    timeData(TimeData){
      this.rate = 100  - Math.floor((TimeData.seconds * 1000 + TimeData.milliseconds)/50)
    },
    start() {
      this.$refs.countDown.start();
      this.iconShow = false
      this.playClick()
    },
    pause() {
      this.$refs.countDown.pause();
      this.iconShow = true
      this.playClick()
    },
    reset() {
      this.$refs.countDown.reset();
    },
    finish() {
      this.$refs.countDown.reset();
      this.iconShow = true
      this.currentRate = 0
    },
    initData(){
      this.sliderData = [];
      if (this.sliderLabelArray.length > 0) {
        for (let j = 0; j < this.sliderLabelArray.length; j++) {
          let sel = (j == this.sliderValue) ? true : false;
          this.sliderData.push({id: j, label: this.sliderLabelArray[j], isOmit: false, select: sel, isTime: false});
        }
        return;
      }
      let parameter = this.parameterCalculation();
      var nowHour = new Date().getHours();
      for (let i = 0; i < this.sliderMax; i++) {
        let isOmit = false;
        if (parameter.isCellOmit) {
          if (this.sliderOmitLocation == "left") {
            if (i < parameter.omitLocation[0]) {
              isOmit = true;
            }
          } else if(this.sliderOmitLocation == "center") {
            if (i > parameter.omitLocation[0] && i < parameter.omitLocation[1]) {
              isOmit = true;
            }
          } else if(this.sliderOmitLocation == "right") {
            if (i > parameter.omitLocation[0]) {
              isOmit = true;
            }
          }
        }
        if (this.sliderType == "time") {
          var isTime = false;
          if ((nowHour - i) <= 0) {
            isTime = true;
          }
          let sel = (i == this.sliderValue) ? true : false;
          let label = i + ":00";
          if (i < 9) {
            label = "0" + i + ":00";
          }
          this.sliderData.push({id: i, label: label, isOmit: isOmit, select: sel, isTime: isTime});
        }else if (this.sliderType == "value"){
          let sel = (i == this.sliderValue) ? true : false;
          this.sliderData.push({id: i, label: i, isOmit: isOmit, select: sel, isTime: false});
        }
      }
    },
    parameterCalculation(){
      let cellWidth = 35;
      let cellOmitWidth = 3;
      let sliderWidth = document.documentElement.clientWidth - 315;
      let tempCellWidth = Math.floor(cellWidth / cellOmitWidth);
      let maxCell = Math.floor(sliderWidth / cellWidth);
      let tempCellCount = this.sliderMax - maxCell;
      let tempCellOmitWidth = tempCellCount * cellOmitWidth;
      let tempCellOmitSum = Math.ceil(tempCellOmitWidth / cellWidth);
      let isCellOmit = maxCell < this.sliderMax;
      let omitLocation = [0];
      if (isCellOmit) {
        if (this.sliderOmitLocation == "left") {
          omitLocation = [tempCellOmitSum + tempCellCount + 1];
        } else if(this.sliderOmitLocation == "center") {
          let numStart = Math.floor(maxCell / 2);
          let numEnd = Math.floor(maxCell / 2) + tempCellOmitSum + tempCellCount + 1;
          if (tempCellOmitSum > 1) {
            numStart = numStart - Math.floor(tempCellOmitSum / 2);
            numEnd = Math.floor(maxCell / 2) + Math.ceil(tempCellOmitSum / 2) + tempCellCount + 1;
          }
          omitLocation = [numStart, numEnd];
        } else if(this.sliderOmitLocation == "right") {
          omitLocation = [maxCell - tempCellOmitSum - 1];
        }
      }
      return {isCellOmit: isCellOmit, omitLocation: omitLocation};
    },
    playData(){
      for (let i = 0; i < this.sliderData.length; i++) {
        this.sliderData[i].select = (i == this.sliderValue) ? true : false;
        if (this.sliderData[i].select && this.sliderType == "time") {
          // WindowsEvent.MyDispatchEvent("SliderFLValueTime", this.sliderData[i]);
        }
      }
    },
    changeClick(item){
      this.$emit("changeClick", item.id);
    },
    playClick(){
      this.$emit("playClick", this.isPlay);
    },
  }
};
</script>
<style>
.van-count-down{
  display: none;
}
</style>
<style lang="less" scoped>
@r:1rem/37.5;
    .bofang{
        height: 36px;
        width: 36px;
        position: relative;
        .icon{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            z-index: 100;
            font-size: 36px;
        }
        .icons{
            color: #fff;
            height: 32px;
            width: 32px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            z-index: 100;
            background:#2d3552;
            border-radius: 50%;
            span{
              font-size: 12px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
      }
    }
    }
.sliderFL{
  // width: 100%;
  order: 2;
  display: flex;
  // padding-left: 5px;
  .sliderCell{
    cursor: pointer;
    position: relative;
    flex: 1;
    font-size: 12px;
    font-family:Microsoft YaHei;
    font-weight:400;
    color:#657984;
    text-align: center;
    line-height: 41px;
    border-left: solid 1px #2c3640;
    height: 32px;
    min-width: 35px;
    &:first-of-type {
      border-left: 0px;
    }
    .valueCell{
      position: absolute;
      width: 100%;
      color:#fff;
    }
    .valueCellColor{
      position: absolute;
      width: 100%;
      color:#506470;
    }
    .selectDivider {
      position: absolute;
      width: 50%;
      height: 40px;
      border-right: 1px solid transparent;
      &.active {
        border-right: solid 1px #fff;
      }
    }
    .selectDivider:hover {
      border-right: 1px solid #1CA3F8;
    }
  }
  .sliderOmitCell{
    cursor: pointer;
    position: relative;
    flex: 1;
    font-size: 12px;
    font-family:Microsoft YaHei;
    font-weight:400;
    color:#657984;
    text-align: center;
    line-height: 41px;
    border-left: solid 1px #2c3640;
    height: 32px;
    width: 3px;
    .valueCell{
      position: absolute;
      width: 100%;
      color:#506470;
    }
    .valueCellColor{
      position: absolute;
      width: 100%;
      color:#506470;
    }
    .selectDivider {
      position: absolute;
      width: 50%;
      height: 40px;
      border-right: 1px solid transparent;
      &.active {
        border-right: solid 1px #fff;
      }
    }
    .selectDivider:hover {
      border-right: 1px solid #1CA3F8;
    }
  }
  .sliderPlay{
    border: solid 1px #283743;
    border-radius: 50%;
    width: 32*@r;
    height: 32*@r;
    line-height: 32*@r;
    margin-top: 4px;
    margin-left: 5px;
    .iconbofang{
      cursor: pointer;
      color: #fff;
      font-size: 20px;
      margin-left: 7px;
      -webkit-transition-duration: 0.4s;
      transition-duration: 0.4s;
    }
    .iconiconstop{
      cursor: pointer;
      color: #EA5C84;
      font-size: 20px;
      margin-left: 5px;
      -webkit-transition-duration: 0.4s;
      transition-duration: 0.4s;
    }
  }
}
</style>