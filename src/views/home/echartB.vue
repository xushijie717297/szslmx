<template>
  <div class="echartB">
    <h5>当前模型精度</h5>
    <div class="border">
      <div id="echartB" style="width: 9.36rem; height: 6.3rem"></div>
    </div>
  </div>
</template>
<script>
import echartsbj from "../../../static/imag/136.png";
import * as echarts from 'echarts';
import axios from "axios";
import global from "../../components/js/Global";
import urlClass from "../../components/js/UrlClass"

export default {
  name: "echartB",
  data() {
    return {
      fullImage: "",
      chart: null,
      Accuracy:'',
      pressure:'',
      flow:'',
      list:[]
    };
  },
  mounted() {
    this.$nextTick(function () {
      this.drawBar("echartB");
      var that = this;
      var resizeTimer = null;
      window.onresize = function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          that.drawBar("echartB");
        }, 100);
      };
    });
  },
  methods: {
    drawBar(id) {
      //   var img = new Image();
      //   img.src = echartsbj;
      //   img.width = '100%'
      //   img.height = '100%'
      //当前模型精度
      axios
        .post(
          urlClass.homePage + "GetModelAccuracyInfo",
          global.axiosHeaders
        )
        .then((res) => {
          var result = res.data.Response;
          // console.log('%c XSJ-[ result ]->', 'font-size:13px; background:red; color:#bf2c9f;', result)
          this.Accuracy = result.Accuracy + "%";
          var obj1 = new Object()
          obj1 = {name:"综合精度",Value:this.Accuracy}
          this.list.push(obj1)
          this.pressure = result.PressureAccuracy + "%";
          var obj2 = new Object()
          obj2 = {name:"压力精度",Value:this.pressure}
          this.list.push(obj2)
          this.flow = result.FlowAccuracy + "%";
          var obj3 = new Object()
          obj3 = {name:"流量精度",Value:this.flow}
          this.list.push(obj3)
          var AccuracyChar = [];
          var FlowAccuracyChart = [];
          var PressureAccuracyChart = [];
          var aDate = [];
          if (res && String(res.data.Code) == "0") {
            var AccuracyChartData = result.AccuracyChartData;
            var FlowAccuracyChartData = result.FlowAccuracyChartData;
            var PressureAccuracyChartData = result.PressureAccuracyChartData;
            for (let i = 0; i < FlowAccuracyChartData.length; i++) {
              let arr = []
              arr.push(FlowAccuracyChartData[i].Date)
              arr.push(FlowAccuracyChartData[i].Value)
              AccuracyChar.push(arr)
            }
            // console.log(AccuracyChar)
            for (let i = 0; i < AccuracyChartData.length; i++) {
              let arr = []
              arr.push(AccuracyChartData[i].Date)
              arr.push(AccuracyChartData[i].Value)
              FlowAccuracyChart.push(arr)
            }
            // console.log(FlowAccuracyChart)

            for (let i = 0; i < PressureAccuracyChartData.length; i++) {
              let arr = []
              arr.push(PressureAccuracyChartData[i].Date)
              arr.push(PressureAccuracyChartData[i].Value)
              PressureAccuracyChart.push(arr)
            }
            var img = new Image();
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = 351;
            canvas.height = 199;
            var fullImage = new Image();
            img.onload = function () {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              fullImage.src = canvas.toDataURL();
            };
            img.src = echartsbj;
            this.fullImage = fullImage;
            this.chart = echarts.init(document.getElementById(id));
            var self = this;
            this.chart.setOption({
              color: ["#003366", "#006699", "#4cabce"],
              legend: {
                show: true,
                icon: "roundRect",
                itemWidth: 10, // 设置宽度
                itemHeight: 10, // 设置高度
                top: "8",
                textStyle: {
                  color: "#8E92A9",
                  fontSize:10,
                  rich:{
                    pre1: {
                        align: 'left',
                        color: '#8E92A9',
                        padding: [0, 2, 0, 0],
                        fontSize:10,
                    },
                    pre: {
                        align: 'left',
                        color: '#ffffff',
                        padding: [0, 2, 0, 0],
                        fontSize:10,
                    }
                  }
                },
                data: ["综合精度", "压力精度", "流量精度"],
                formatter: function(name){
                  var tarValue = [];
                  for (let i = 0; i < self.list.length; i++) {
                    if(name == self.list[i].name){
                      tarValue.push('{pre1|' + name + '}','{pre|' + self.list[i].Value + '}')
                    }
                  }
                  return tarValue.join('')
                }
              },
              axisPointer:{
                label:{
                  backgroundColor:"rgba(0,0,0,0.7)"
                }
              },
              tooltip: {
                trigger: "axis",
                backgroundColor:"rgba(0,0,0,0.7)",
                axisPointer: {
                  type: "cross",
                  crossStyle: {
                    color: "#999",
                  },
                },
                alwaysShowContent: false,
                triggerOn: "click",
              },
              grid: {
                top: "40px",
                left: "45px",
                right: "10px",
                bottom: "60px",
                show: true,
                borderWidth: 0,
                backgroundColor: {
                  image: this.fullImage,
                },
              },
              xAxis: {
                type: "time",
                splitLine: {
                  //去除网格线
                  show: false,
                },
                axisLabel: {
                  show: true,
                  color: "rgba(142, 146, 169, 1)",
                },
                axisLine:{
                  show:false
                },
                axisTick:{
                  show:false
                }
              },
              yAxis: {
                type: "value",
                scale: true /*按比例显示*/,
                splitLine: {
                  //去除网格线
                  show: false,
                },
                axisLine: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },
                axisLabel: {
                  show: true,
                  color: "rgba(142, 146, 169, 1)",
                },
              },
              dataZoom: [{
                  id:"echartB",
                  type: 'inside',
                  start: 0,
                  end: 20,
                  show:true,
                  selectedDataBackground:{
                     fillerColor:"#353A4D",
                     areaStyle:{
                       color:"#1c1f2f"
                     }
                  },
              }, {
                  start: 0,
                  end: 20,
                  backgroundColor:"rgba(23, 26, 42, 0.2)",
                  borderColor:"rgba(23, 26, 42, 1)",
                  dataBackground:{                        //数据阴影的样式。
                    // lineStyle:"rgba(46,50,67)",              //阴影的线条样式
                    // areaStyle:"rgba(28,31,47,0.1)",              //阴影的填充样式
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 10
                  },
                  handleStyle: {
                    color: "rgba(142, 146, 169, 1)"
                  },
                  moveHandleStyle: {
                    color: "rgba(142, 146, 169, 1)"
                  },
                  textStyle: {
                    color: "rgba(255, 255, 255, 1)"
                  },
                  fillerColor:"rgba(53, 58, 77, 0.2)"
              }],
              series: [
                {
                  name: "综合精度",
                  type: "line",
                  smooth: true,
                  symbol: "none",
                  sampling: "average",
                  // stack: "总量",
                  itemStyle: {
                    color: "rgba(41, 200, 67, 1)",
                  },
                  data: AccuracyChar,
                },
                {
                  name: "压力精度",
                  type: "line",
                  smooth: true,
                  symbol: "none",
                  sampling: "average",
                  // stack: "总量",
                  itemStyle: {
                    color: "rgba(0, 100, 227, 1)",
                  },
                  data: FlowAccuracyChart,
                },
                {
                  name: "流量精度",
                  type: "line",
                  smooth: true,
                  symbol: "none",
                  sampling: "average",
                  // stack: "总量",
                  itemStyle: {
                    color: "rgba(70, 100, 227, 1)",
                  },
                  data: PressureAccuracyChart,
                },
              ],
            });
          } else {
            console.log("错误信息:", res.Message);
          }
        })
        .catch((error) => {});
    },
  },
};
</script>
<style scoped lang="less">
@r:1rem /37.5;
.echartB {
  margin-top: 15 * @r;
  padding: 0 12 * @r;
  box-sizing: border-box;
  h5 {
    color: #fff;
    font-size: 14px;
    padding: 9 * @r 12 * @r 9 * @r 0;
    width: 100%;
    box-sizing: border-box;
  }
  .border {
    border: 1px solid #262a3b;
    border-radius: 5px;
    overflow: hidden;
    background: #222638;
  }
}
.echartTh{
  width: 100%;
  height: 54*@r;
  display: flex;
  .echartC{
    display: flex;
    flex-direction: column;
    flex: 1;
    p{
      color: #8e92a9;
    }
    span{
        display: flex;
        font-size: 24px;
        font-weight: bold;
        color: rgb(107, 139, 221);
    }
    &:nth-child(2){
      span{
        color: rgb(60, 176, 214);
      }
    }
    &:nth-child(3){
      span{
        color: rgb(209, 169, 105);
      }
    }
  }
}
</style>
