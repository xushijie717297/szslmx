<template>
  <div id="echarts">
    <div id="myChartDiv" style="height: 229px; width: 9.2rem"></div>
  </div>
</template>
<script>
export default {
  name: "echarts",
  props: {
    chartData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      myChart: null,
      showChartData: {
        listXNew: [],
        listX: [],
        listY1: [],
        listY2: [],
        listY3: [],
      },
    };
  },
  watch: {
    chartData: function () {
      console.log("this.chartData", this.chartData);
      this.showChartData = this.chartData;
      this.drawLine();
    },
  },
  mounted() {
    console.log("this.chartData", this.chartData);
    //   this.$nextTick(()=>{
    //         if (this.chartData != {}) {
    this.drawLine();
    this.$nextTick(() => {
      this.drawLine();
    });
    //         }
    //   })
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      if (this.myChart) {
        this.myChart.resize();
      } else {
        this.myChart = this.$echarts.init(
          document.getElementById("myChartDiv")
        );
        console.log("asd");
      }
      // 绘制图表
      var option = {
        tooltip: {
          trigger: "axis",
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
          top: "13%",
          left: "1%",
          right: "0%",
          bottom: "12%",
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
        legend: {
          data: ["高程", "水头"],
          textStyle: {
            color: "#636b7a",
          },
        },
        textStyle: {
          color: "#6e7b8b",
        },
        xAxis: [
          {
            show: false,
            name: "距离(m)",
            type: "category",
            data: this.showChartData.listX,
            axisPointer: {
              type: "shadow",
            },
            axisLabel: {
              interval: 0,
            },
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#334756", //左边线的颜色
                width: "1", //坐标线的宽度
              },
            },
          },
          {
            position: "bottom",
            name: "距离(m)",
            type: "category",
            data: this.showChartData.listXNew,
            nameRotate: -90,
            nameTextStyle: {
              padding: [0, 12, -15, -30],
            },
            axisPointer: {
              type: "shadow",
            },
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#334756", //左边线的颜色
                width: "1", //坐标线的宽度
              },
            },
          },
        ],
        yAxis: [
          {
            name: "高程(m)",
            type: "value",
            nameLocation: "middle",
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
              lineStyle: {
                type: "solid",
                color: "#334756", //左边线的颜色
                width: "1", //坐标线的宽度
              },
            },
            position: "left",
          },
        ],
        series: [
          {
            type: "line",
            name: "水头",
            data: this.showChartData.listY2,
            itemStyle: {
              // normal: {
                color: "#46759f",
                width: 2,
              // },
            },
            areaStyle: {
              // normal: {
                color: "#46759f",
              // },
            },
          },
          {
            type: "line",
            name: "高程",
            data: this.showChartData.listY1,
            itemStyle: {
              // normal: {
                color: "#8d6d30",
                width: 2,
              // },
            },
            areaStyle: {
              // normal: {
                color: "#8d6d30",
              // },
            },
          },
          {
            symbol: "none",
            type: "line",
            name: "压力",
            data: this.showChartData.listY4,
            itemStyle: {
              // normal: {
                color: "#2bbd78",
                lineStyle: {
                  color: "rgba(0,0,0,0)",
                  width: 2,
                },
              // },
            },
            areaStyle: {
              // normal: {
                color: "rgba(0,0,0,0)",
              // },
            },
          },
        ],
      };
      var self = this;
      this.myChart.setOption(option);
      this.myChart.on("click", function (params) {
        // 控制台打印数据的名称
        var obj = self.showChartData.listY3[params.dataIndex];
        self.$emit("func", obj);
        // WindowsEvent.MyDispatchEvent("SupplyPathCharPosition", obj);
      });
    },
  },
};
</script>
<style lang="less">
@r:1rem /37.5;
#myChartDiv {
  margin-left: 15 * @r;
}
</style>
