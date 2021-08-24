<template>
  <div class="EchatAtt">
    <div id="EchatAttr" style="width: 9.36rem; height: 6.3rem"></div>
  </div>
</template>

<script>
import Bus from "../../utils/Bus";
import * as echarts from 'echarts';
import echartsbj from "../../../static/imag/136.png"
export default {
  name: "EchatAttr",
  data() {
    return {
      data: null,
      ChatX:[],
      ChatY:[],
      ChatT:[],
      AxisY:"",
      Title:""
    };
  },
  methods: {
    drawBar(id) {
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
      this.chart.setOption({
        color: ["#003366", "#006699", "#4cabce"],
        legend: {
          data: ["实际值", "模拟值"],
          right: 0,
          textStyle: {
            color: "#636b7a",
          },
        },
        title: {
          textStyle: {
            //文字颜色
            color: "#6e7b8b",
            //字体风格,'normal','italic','oblique'
            fontStyle: "normal",
            //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
            fontWeight: "bold",
            //字体系列
            fontFamily: "sans-serif",
            //字体大小
            fontSize: 14,
          },
          left: "center",
        },
        tooltip: {
          trigger: "none",
          padding: [5, 10],
          confine: true,
          axisPointer: {
            type: "cross",
          },
        },
        grid: {
          top: 40,
          right: 10,
          bottom: 40,
          left:40,
          show: true,
          borderWidth: 0,
          backgroundColor: {
              image: this.fullImage
          }
        },
        xAxis: [
          {
            show:true,
            name: "时间",
            type: "category",
            data: this.ChatX,
            axisPointer: {
              //type: "shadow"
              label: {
                    formatter: function (params) {
                        return "时间:" + params.value +'\n\r'
                            + self.title2+'值：' + params.seriesData[0].data+' '+self.unit;
                    }
                }
            },
            axisTick: { alignWithLabel: true },
            axisLine: {
              lineStyle: {
                //type: "solid",
                color: "#334756", //左边线的颜色
                //width: "1" //坐标线的宽度
              }
            }
          },
        ],
        yAxis: [
                  {
            name: this.AxisY,
            type: "value",
            axisLabel: {
              formatter: "{value}"
            },
            axisTick: { show: false },
            splitLine: { show: true,
              lineStyle: {
                color: "#334756",
                type: "dashed"
              } }, //去除网格线
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#334756", //左边线的颜色
                width: "1" //坐标线的宽度
              }
            },
            position: "left",
            //max:120,
          }
        ],
        series: [
            {
            type: "line",
            name: "模拟值",
            data: this.ChatY,
            itemStyle: {
              // normal: {
                color: "#5d77e6",
                width: 2
              // }
            },
          },
        ],
      });
    },
  },
  mounted() {
    Bus.$on("EchatAttrData", (res) => {
        this.ChatX = []
        this.ChatY = []
        this.ChatT = []
        this.data = res.data;
        this.AxisY = res.title +'('+res.unit+')'
        this.Title = res.title
        for (let i = 0; i < res.data.length; i++) {
            this.ChatX.push(res.data[i].TimeLabel)
            this.ChatY.push(res.data[i].Value)
            this.ChatT.push(res.data[i].Time)
        }
        // console.log('%c XSJ-[ this.ChatT ]->', 'font-size:13px; background:red; color:#bf2c9f;', this.ChatT)
        // console.log('%c XSJ-[ this.ChatY ]->', 'font-size:13px; background:red; color:#bf2c9f;', this.ChatY)
        // console.log('%c XSJ-[ this.ChatX ]->', 'font-size:13px; background:red; color:#bf2c9f;', this.ChatX)
        this.drawBar("EchatAttr");
    });
  },
};
</script>

<style lang="less" scoped>
@r:1rem /37.5;
.EchatAtt{
    background: #171A2A;
}
.title{
    box-sizing: border-box;
    padding: 6*@r 10*@r;
    color: #fff;
}
</style>
