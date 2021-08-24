<template>
  <div class="ModelSummary">
    <h5>管材参数汇总</h5>
    <div class="border">
      <div id="echartModel" style="width: 9.36rem; height: 4.3rem"></div>
    </div>
  </div>
</template>

<script>
import UrlClass from "../../components/js/UrlClass";
import global from "../../components/js/Global";
import axios from "axios";
import * as echarts from 'echarts';
export default {
  name: "ModelSummary",
  data() {
    return {
      chartData: "",
    };
  },
  methods: {
    //获取管材分类信息
    GetMaterialInfo(id) {
      axios
        .post(UrlClass.homePage + "GetMaterialInfo", "", global.axiosHeaders)
        .then((response) => {
          var result = response.data;
          if (result && String(result.Code) == "0") {
            this.chartData = result.Response;
            var chartLabel = [];
            var chartCount = [];
            this.chartData.splice(1, 1);
            this.chartData.forEach((res) => {
              chartLabel.push(res.Label);
              chartCount.push(res.Count);
            });
            this.chart = echarts.init(document.getElementById(id));
            this.chart.setOption({
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "none",
                },
                formatter: function (params) {
                  return params[0].name + ": " + params[0].value + " m";
                },
              },
              xAxis: {
                data: chartLabel,
                axisTick: {
                  show: false,
                },
                axisLine: {
                  show: false,
                },
                axisLabel: {
                  // textStyle: {
                    color: "#8E92A9",
                    fontSize: 12,
                  // },
                  formatter: function (value) {
                    if (value.length > 3) {
                      value = value.substring(0, 3) + "..";
                    }
                    return value;
                  },
                },
              },
              grid: {
                left: "0",
                right: "0",
                top: "10",
                bottom: "30",
              },
              yAxis: {
                splitLine: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },
                axisLine: {
                  show: false,
                },
                axisLabel: {
                  show: false,
                },
              },
              series: [
                {
                  name: "hill",
                  type: "pictorialBar",
                  symbol:
                    "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
                  itemStyle: {
                    // normal: {
                      opacity: 0.5,
                      color: "#0FB89B",
                    // },
                    itemStyle: {
                      opacity: 1,
                    },
                  },
                  data: chartCount,
                  z: 10,
                },
              ],
            });
          } else {
            console.log("错误信息:", result.Message);
          }
        });
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.GetMaterialInfo("echartModel");
      var that = this;
      var resizeTimer = null;
      window.onresize = function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          that.GetMaterialInfo("echartModel");
        }, 100);
      };
    });
  },
};
</script>

<style lang="less" scoped>
@r:1rem /37.5;
.ModelSummary {
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
  .border{
    border: 1px solid #262a3b;
    border-radius: 5px;
    overflow: hidden;
    background: #222638;
  }
}
</style>
