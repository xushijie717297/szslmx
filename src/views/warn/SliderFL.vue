<template>
  <div class="sliderFL">
    <div :class="[item.isOmit?'sliderOmitCell':'sliderCell']" v-for="(item,index) in sliderData" :key="index" v-on:click="changeClick(item)">
      <div :class="[item.isTime?'valueCellColor':'valueCell']" v-show="!item.isOmit">{{item.label}}</div>
      <div :class="[item.isTime?'valueCellColor':'valueCell']" v-show="item.isOmit">.</div>
      <div class="selectDivider" :title="[item.isOmit?item.label:'']" :class="{active: item.select}"></div>
    </div>
    <div class="sliderPlay" :title="isPlay?'暂停':'播放'" v-on:click="playClick">
      <i class="iconfont" :class="[isPlay?'iconiconstop':'iconbofang']"></i>
    </div>
  </div>
</template>

<script>
import Bus from "../../utils/Bus"
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
      sliderData: []
    };
  },
  created(){
    this.initData();
  },
  mounted() {
  },
  methods: {
    initData(){
      this.sliderData = [];
      // console.log(this.sliderLabelArray)
      // console.log(this.sliderValue)
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
        if (this.sliderData[i].select && this.sliderType == "time" || this.sliderType == "timeTheLeastBit") {
          // WindowsEvent.MyDispatchEvent("SliderFLValueTime", this.sliderData[i]);
          Bus.$emit("SliderFLValueTime",this.sliderData[i])
          Bus.$emit("SliderFLMin",true)
          console.log('%c XSJ-[ this.sliderData[i] ]->', 'font-size:13px; background:red; color:#bf2c9f;', this.sliderData[i])
          
        }
      }
    },
    changeClick(item){
      this.$emit("changeClick", item.id);
      if (this.sliderType == "time" || this.sliderType == "timeTheLeastBit") {
        Bus.$emit("SliderFLValueTime",item)
      }
    },
    playClick(){
      this.$emit("playClick", this.isPlay);
    },
  }
};
</script>

<style lang="less" scoped>
@r:1rem/37.5;
.sliderFL{
  width: 100%;
  order: 2;
  display: flex;
  padding-left: 5px;
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
    width: 32px;
    height: 32px;
    line-height: 32px;
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