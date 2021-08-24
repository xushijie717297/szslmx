<template>
  <div class="echartsLine">
    <div id="echar" style="width: 9.36rem; height: 6.3rem"></div>
  </div>
</template>

<script>
import Bus from "../../utils/Bus";
import * as echarts from 'echarts';
import echartsbj from "../../../static/imag/136.png"
export default {
  name: "echartsLine",
  data() {
    return {
      data: null,
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
          trigger: "axis",
          padding: [5, 10],
          confine: true,
          formatter: function (params) {
            console.log("params", params);
            var res = "<div><p>" + params[0].name + " </p>  </div>";
            for (var i = 0; i < params.length; i++) {
              if (params[i].seriesName == "实际值") {
                params[i].data == ""
                  ? ""
                  : (res +=
                      "<p>" +
                      params[i].marker +
                      "实际值" +
                      ":" +
                      params[i].data +
                      "</p>");
              } else if (params[i].seriesName == "模拟值") {
                params[i].data == ""
                  ? ""
                  : (res +=
                      "<p>" +
                      params[i].marker +
                      "模拟值" +
                      ":" +
                      `${params[i].data}` +
                      "</p>");
              }
            }
            return res;
          },
          textStyle: {
            align: "left",
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
            data: this.data.listX,
            axisLabel: {
              inside: false,
              // textStyle: {
                color: "rgba(0,0,0,0)",
              // },
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#334756",
                type: "dashed",
              },
            },
            z: 10,
            position: "top",
            offset: 0,
          },
          {
            data: this.data.listXNew,
            axisPointer: {
              type: "none",
            },
            axisLabel: {
              inside: false,
              // textStyle: {
                color: "#636b7a",
              // },
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            z: 10,
          },
        ],
        yAxis: [
          {
            min: this.data.min,
            max: this.data.max,
            axisLabel: {
              formatter: "{value}",
            },
            axisTick: { show: false },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#334756",
                type: "dashed",
              },
            }, //去除网格线
            axisLine: {
              show: false,
              lineStyle: {
                color: "#334756", //左边线的颜色
              },
            },
            position: "left",
            name: this.data.typeTemp
          },
        ],
        series: [
          {
            name: "实际值",
            symbolSize: 3,
            data: this.data.real,
            type: "scatter",
            z: 21,
            itemStyle: {
              // normal: {
                borderColor: "#02BFED",
                color: "#02BFED",
              // },
            },
            lineStyle: {
              // normal: {
                width: 2,
                color: "#02BFED",
              // },
            },
          },
          {
            name: "模拟值",
            type: "line",
            symbol: "none",
            data: this.data.cal,
            showAllSymbol: false,
            symbolSize: 8,
            connectNulls: true,
            z: 1,
            itemStyle: {
              // normal: {
                borderColor: "#8CF2AA",
                color: "#8CF2AA",
              // },
            },
            lineStyle: {
              // normal: {
                width: 2,
                color: "#8CF2AA",
              // },
            },
          },
        ],
      });
    },
  },
  mounted() {
    Bus.$on("OneMonitorDatas", (res) => {
      this.data = res.monitorChartData;
      this.drawBar("echar");
      console.log(
        "%c XSJ-[ res ]->",
        "font-size:13px; background:red; color:#bf2c9f;",
        res
      );
    });
  },
};
</script>

<style lang="less" scoped>
@r:1rem /37.5;
.echartsLine{
    background: #0D161D;
}
</style>
