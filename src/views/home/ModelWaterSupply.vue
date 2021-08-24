<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>
<script>
import Bus from "@/bus.js";
import { debounce } from "@/utils";
import format from "@/components/js/formatDate";

export default {
  name: "echarsbar",
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
    },
    autoResize: {
      type: Boolean,
      default: true
    }
    /*  chartData: {
      type: Object,
      required: true
    } */
  },
  data() {
    return {
      chart: null,
      sidebarElm: null,
      chartData: {},
      xActual: [],
      xForecast: [],
      xTime: []
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    let Time = format.formatDate2(new Date(), "yyyy-MM-dd hh:mm:ss");
    console.log(Time);
    //接收实际数据
    Bus.$on("DemandActual", DemandActual => {
      let ActualTime = [];
      let Actual = [];
      DemandActual.forEach((res, idx) => {
          ActualTime.push(res.Time);
          Actual.push(res.WaterDemand);
      });
      this.xActual = Actual;
      console.log("接收实际数据", Actual);
    });

    //接收预测数据
    Bus.$on("DemandForecast", DemandForecast => {
      let ForecastTime = [];
      let Forecast = [];
      DemandForecast.forEach(res => {
        ForecastTime.push(res.Time);
        if (Time <= res.Time) {
          Forecast.push(res.WaterDemand)
        }
      });
      console.log("this.xActual[this.xActual.length-1]",this.xActual[this.xActual.length-1]);
      let xActualEnd = this.xActual[this.xActual.length-1];
      this.xForecast = Forecast
      this.xForecast.unshift(xActualEnd);
      this.xTime = ForecastTime;
      console.log("接收预测数据", Forecast);
      this.$nextTick(this.initChart());
    });

    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHandler);
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName("sidebar-container")[0];
    this.sidebarElm &&
      this.sidebarElm.addEventListener(
        "transitionend",
        this.sidebarResizeHandler
      );
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHandler);
    }

    this.sidebarElm &&
      this.sidebarElm.removeEventListener(
        "transitionend",
        this.sidebarResizeHandler
      );

    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === "width") {
        this.__resizeHandler();
      }
    },
    setOptions(chartData) {
      for (var i = 0; i < this.xActual.length - 1; i++) {
        this.xForecast.unshift("");
      }
      // console.log(this.xForecast);
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none"
          },
          formatter: function(params) {
            return params[0].name + ": " + params[0].value + " m³";
          }
        },
        grid: {
          top: "3%",
          left: "3%",
          right: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          // boundaryGap: false,
          data: this.xTime,
          axisLine: {
            lineStyle: {
              // 设置y轴颜色
              color: "#99A2AD"
            }
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#EDEDED"
            }
          },
          axisLine: {
            lineStyle: {
              // 设置y轴颜色
              color: "#99A2AD"
            }
          }
        },
        series: [
          {
            data: this.xActual,
            type: "line",
            color: "#b2bac6",
            areaStyle: {
              // normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#b2bac6"
                  },
                  {
                    offset: 1,
                    color: "#fff"
                  }
                ])
              // }
            }
          },
          {
            data: this.xForecast,
            type: "line",
            color: "#3290e0",
            areaStyle: {
              // normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#3290e0"
                  },
                  {
                    offset: 1,
                    color: "#fff"
                  }
                ])
              // }
            }
          }
        ]
      });
    },
    initChart() {
      this.chart = this.$echarts.init(this.$el, "macarons");
      this.chart.clear();
      this.setOptions(this.chartData);
    }
  }
};
</script>


