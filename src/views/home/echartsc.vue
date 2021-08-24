<template>
  <div class="echartsc">
    <h5>水厂运行参数汇总</h5>
    <!-- 第二排 -->
    <div class="echartTop">
      <div class="DividingLine"></div>
      <div class="DividingSpot">
        <p class="iconfont iconluxian"></p>
      </div>
      <div class="C-left">
        <div class="circular-left" :style="getStylel">
          <p></p>
        </div>
        <span>
          <div @click="MaxSlopMap()">
            {{ MaxSlop.Value | millions }}
            <i>m</i>
          </div>
        </span>
      </div>
      <div class="C-right">
        <div class="circular-right" :style="getStyler">
          <p></p>
        </div>
        <span>
          <div @click="MaxVelocityMap">
            {{ MaxVelocity.Value }}
            <i>m</i>
          </div>
        </span>
      </div>
      <div class="text-left">最大流速</div>
      <div class="text-right">最大水力坡度</div>
      <div id="echa" style="width: 100%; height: 110px"></div>
    </div>
    <!-- 第三排 -->
    <div class="echartBottom">
      <div class="DividingLine"></div>
      <div class="DividingSpot">
        <p class="iconfont iconyali2"></p>
      </div>
      <div class="C-left">
        <div class="circular-left" :style="getStylelB">
          <p></p>
        </div>
        <span>
          <div @click="MaxPressureMap">
            {{ MaxPressure.Value | millions}}
            <i>m</i>
          </div>
        </span>
      </div>
      <div class="C-right">
        <div class="circular-right" :style="getStylerB">
          <p></p>
        </div>
        <span>
          <div @click="MinPressureMap">
            {{ MinPressure.Value }}
            <i>m</i>
          </div>
        </span>
      </div>
      <div class="text-left">最高压力</div>
      <div class="text-right">最低压力</div>
      <div id="echar" style="width: 100%; height: 110px"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from "axios";
import Bus from "../../utils/Bus";
import urlClass from "../../components/js/UrlClass"

export default {
  name: "echartsc",
  data() {
    return {
      MinPressure: "",
      MaxPressure: "",
      MaxSlop: "",
      MaxVelocity: "",
      QualifiedRate: "",
      getStyler: {},
      getStylel: {},
      getStylerB: {},
      getStylelB: {},
    };
  },
  filters: {
    millions: function (value) {
      //过万处理
      let num;
      if (value > 999) {
        //大于9999显示x.xx万
        num = Math.floor(value / 1000) + "k";
      } else if (value < 999 && value > -999) {
        num = value;
      } else if (value < -999) {
        //小于-9999显示-x.xx万
        num = -Math.floor(Math.abs(value) / 1000) + "k";
      }
      return num;
    },
    millionf: function (value) {
      let num;
      num = value.toFixed(1);
      return num;
    },
  },
  mounted() {
    //获取运行状态信息
    var that = this;
    axios
      .post(
        urlClass.homePage + "GetRunningStateInfoNew",
        global.axiosHeaders
      )
      .then((res) => {
        var result = res.data.Response;
        console.log(res);
        if (res && String(res.data.Code) == "0") {
          that.MinPressure = result.MinPressure;
          that.MaxPressure = result.MaxPressure;
          that.MaxSlop = result.MaxSlop;
          that.MaxVelocity = result.MaxVelocity;
          console.log(
            that.MinPressure,
            that.MaxPressure,
            that.MaxSlop,
            that.MaxVelocity
          );
        } else {
          console.log("错误信息:", res.Message);
        }
      })
      .catch((error) => {});
    var current = 70;
    var total = 270;
    var rotate = (current / total) * 270 * 1.33 + "deg";
    this.getStylel = {
      transform: "rotate(" + rotate + ")",
    };
    var aa = 90;
    var bb = 240;
    var rotat = (aa / bb) * 270 * 1.33 + "deg";
    this.getStyler = {
      transform: "rotate(" + rotat + ")",
    };
    var cc = 100;
    var dd = 300;
    var rotateB = (cc / dd) * 270 * 1.33 + "deg";
    this.getStylelB = {
      transform: "rotate(" + rotateB + ")",
    };
    var ee = 80;
    var ff = 280;
    var rotatB = (ee / ff) * 270 * 1.33 + "deg";
    this.getStylerB = {
      transform: "rotate(" + rotatB + ")",
    };
    // console.log(this.RunningStateInfo)
    this.$nextTick(function () {
      this.echartC("echa");
      this.echartB("echar");
      var that = this;
      var resizeTimer = null;
      window.onresize = function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          that.echartC("echa");
          that.echartB("echar");
        }, 100);
      };
    });
  },
  methods: {
    MaxSlopMap() {
      Bus.$emit("MaxSlop", this.MaxSlop);
    },
    MaxVelocityMap() {
      Bus.$emit("MaxVelocity", this.MaxVelocity);
    },
    MaxPressureMap() {
      Bus.$emit("MaxPressure", this.MaxPressure);
    },
    MinPressureMap() {
      Bus.$emit("MinPressure", this.MinPressure);
    },
    echartC(id) {
      var placeHolderStyle = {
        // normal: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          color: "rgba(0,0,0,0)",
          borderWidth: 0,
        // },
        itemStyle: {
          color: "rgba(0,0,0,0)",
          borderWidth: 0,
        },
      };
      var dataStyle = {
        // normal: {
          formatter: "{c}%",
          position: "center",
          show: true,
          textStyle: {
            fontSize: "40",
            fontWeight: "normal",
            color: "#34374E",
          },
        // },
      };
      let myChart = echarts.init(document.getElementById(id));
      var pass_rate = 70,
        average = 60,
        total = 100;
      myChart.setOption({
        backgroundColor: "#222638",
        title: [
          {
            text: "",
            left: "29.8%",
            top: "60%",
            textAlign: "center",
            textStyle: {
              fontWeight: "normal",
              fontSize: "16",
              color: "#AAAFC8",
              textAlign: "center",
            },
          },
          {
            text: "",
            left: "70%",
            top: "60%",
            textAlign: "center",
            textStyle: {
              color: "#AAAFC8",
              fontWeight: "normal",
              fontSize: "16",
              textAlign: "center",
            },
          },
        ],

        //第一个图表
        series: [
          {
            type: "pie",
            // hoverAnimation: false, //鼠标经过的特效
            radius: ["90%", "80%"],
            center: ["25%", "60%"],
            startAngle: 225,
            labelLine: {
              // normal: {
                show: false,
              // },
            },
            label: {
              // normal: {
                position: "center",
              // },
            },
            data: [
              {
                value: 270,
                itemStyle: {
                  // normal: {
                    color: "#171a2a",
                  // },
                },
              },
              {
                value: 90,
                itemStyle: placeHolderStyle,
              },
            ],
          },
          //上层环形配置
          {
            type: "pie",
            // hoverAnimation: false, //鼠标经过的特效
            radius: ["90%", "80%"],
            center: ["25%", "60%"],
            startAngle: 225,
            labelLine: {
              // normal: {
                show: false,
              // },
            },
            label: {
              // normal: {
                position: "center",
              // },
            },
            data: [
              {
                value: 70,
                itemStyle: {
                  // normal: {
                    color: "#31ae72",
                  // },
                },
                // label: dataStyle,
              },
              {
                value: 200,
                itemStyle: placeHolderStyle,
              },
            ],
          },

          //第二个图表
          {
            type: "pie",
            // hoverAnimation: false,
            radius: ["90%", "80%"],
            center: ["75%", "60%"],
            startAngle: 225,
            labelLine: {
              // normal: {
                show: false,
              // },
            },
            label: {
              // normal: {
                position: "center",
              // },
            },
            data: [
              {
                value: 270,
                itemStyle: {
                  // normal: {
                    color: "#171a2a",
                  // },
                },
              },
              {
                value: 90,
                itemStyle: placeHolderStyle,
              },
            ],
          },

          //上层环形配置
          {
            type: "pie",
            // hoverAnimation: false,
            radius: ["90%", "80%"],
            center: ["75%", "60%"],
            startAngle: 225,
            labelLine: {
              // normal: {
                show: false,
              // },
            },
            label: {
              // normal: {
                position: "center",
              // },
            },
            data: [
              {
                value: 90,
                itemStyle: {
                  // normal: {
                    color: "#9ca239",
                  // },
                },
                // label: dataStyle,
              },
              {
                value: 150,
                itemStyle: placeHolderStyle,
              },
            ],
          },
        ],
      });
    },
    echartB(id) {
      var placeHolderStyle = {
        // normal: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          color: "rgba(0,0,0,0)",
          borderWidth: 0,
        // },
        itemStyle: {
          color: "rgba(0,0,0,0)",
          borderWidth: 0,
        },
      };
      var dataStyle = {
        // normal: {
          formatter: "{c}%",
          position: "center",
          show: true,
          textStyle: {
            fontSize: "40",
            fontWeight: "normal",
            color: "#34374E",
          },
        // },
      };
      let myChart = echarts.init(document.getElementById(id));
      var pass_rate = 70,
        average = 60,
        total = 100;
      myChart.setOption({
        backgroundColor: "#222638",
        title: [
          {
            text: "",
            left: "29.8%",
            top: "60%",
            textAlign: "center",
            textStyle: {
              fontWeight: "normal",
              fontSize: "16",
              color: "#AAAFC8",
              textAlign: "center",
            },
          },
          {
            text: "",
            left: "70%",
            top: "60%",
            textAlign: "center",
            textStyle: {
              color: "#AAAFC8",
              fontWeight: "normal",
              fontSize: "16",
              textAlign: "center",
            },
          },
        ],

        //第一个图表
        series: [
          {
            type: "pie",
            // hoverAnimation: false, //鼠标经过的特效
            radius: ["90%", "80%"],
            center: ["25%", "60%"],
            startAngle: 225,
            labelLine: {
              // normal: {
                show: false,
              // },
            },
            label: {
              // normal: {
                position: "center",
              // },
            },
            data: [
              {
                value: 270,
                itemStyle: {
                  // normal: {
                    color: "#171a2a",
                  // },
                },
              },
              {
                value: 90,
                itemStyle: placeHolderStyle,
              },
            ],
          },
          //上层环形配置
          {
            type: "pie",
            // hoverAnimation: false, //鼠标经过的特效
            radius: ["90%", "80%"],
            center: ["25%", "60%"],
            startAngle: 225,
            labelLine: {
              // normal: {
                show: false,
              // },
            },
            label: {
              // normal: {
                position: "center",
              // },
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  // normal: {
                    color: "#bf8437",
                  // },
                },
                // label: dataStyle,
              },
              {
                value: 200,
                itemStyle: placeHolderStyle,
              },
            ],
          },

          //第二个图表
          {
            type: "pie",
            // hoverAnimation: false,
            radius: ["90%", "80%"],
            center: ["75%", "60%"],
            startAngle: 225,
            labelLine: {
              // normal: {
                show: false,
              // },
            },
            label: {
              // normal: {
                position: "center",
              // },
            },
            data: [
              {
                value: 270,
                itemStyle: {
                  // normal: {
                    color: "#171a2a",
                  // },
                },
              },
              {
                value: 90,
                itemStyle: placeHolderStyle,
              },
            ],
          },

          //上层环形配置
          {
            type: "pie",
            radius: ["90%", "80%"],
            center: ["75%", "60%"],
            startAngle: 225,
            labelLine: {
              // normal: {
                show: false,
              // },
            },
            label: {
              // normal: {
                position: "center",
              // },
            },
            data: [
              {
                value: 80,
                itemStyle: {
                  // normal: {
                    color: "#bb5839",
                  // },
                },
                // label: dataStyle,
              },
              {
                value: 200,
                itemStyle: placeHolderStyle,
              },
            ],
          },
        ],
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@r:1rem /37.5;
h5 {
  color: #fff;
  font-size: 14px;
  padding: 9 * @r 12 * @r 9 * @r 0;
  width: 100%;
  box-sizing: border-box;
}
.echartTop {
  height: 140 * @r;
  width: 100%;
  background-color: #222638;
  display: flex;
  position: relative;
  border-radius: 10px;
  border: 1px solid #262a3b;
  box-sizing: border-box;
  overflow: hidden;
}
.DividingLine {
  position: absolute;
  width: 1px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #121421;
  z-index: 100;
}
.DividingSpot {
  width: 22 * @r;
  height: 22 * @r;
  background-color: #282c40;
  position: absolute;
  z-index: 101;
  color: #fff;
  left: 164 * @r;
  top: 52 * @r;
  transform: rotate(45deg); 
  border: 1px solid #121421;
  p {
    transform: rotate(-45deg);
    // margin-top: 2*@r;
    margin-left: 2 * @r;
  }
}
.C-left {
  position: absolute;
  z-index: 101;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 25%;
}
.circular-left {
  height: 55 * @r;
  width: 55 * @r;
  background-color: #31ae72;
  border-radius: 50%;
  // transform: rotate(10deg);
  p {
    width: 0;
    height: 0;
    border-left: 8 * @r solid transparent;
    border-right: 8 * @r solid transparent;
    border-top: 14 * @r solid #31ae72;
    position: absolute;
    bottom: -3 * @r;
    left: -2 * @r;
    transform: rotate(46deg);
  }
}
span {
  position: absolute;
  width: 100%;
  height: 100%;
  font-size: 16px;
  color: #fff;
  top: 0;
  div {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  i {
    font-style: normal;
    font-size: 12px;
  }
}
.C-right {
  position: absolute;
  z-index: 101;
  top: 50%;
  right: 25%;
  transform: translate(50%, -50%);
}
.circular-right {
  height: 55 * @r;
  width: 55 * @r;
  background-color: #9ca239;
  border-radius: 50%;
  p {
    width: 0;
    height: 0;
    border-left: 8 * @r solid transparent;
    border-right: 8 * @r solid transparent;
    border-bottom: 14 * @r solid #9ca239;
    position: absolute;
    bottom: 3 * @r;
    left: -3 * @r;
    transform: rotate(-12deg);
  }
  span {
    position: absolute;
    width: 100%;
    height: 100%;
    font-size: 16px;
    color: #fff;
    top: 0;
    div {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    i {
      font-style: normal;
      font-size: 12px;
    }
  }
}
.text-left {
  position: absolute;
  z-index: 101;
  bottom: 0px;
  left: 25%;
  transform: translate(-50%, -75%);
  font-size: 12px;
  color: #8e92a9;
}
.text-right {
  position: absolute;
  z-index: 101;
  bottom: 0px;
  right: 25%;
  transform: translate(50%, -75%);
  font-size: 12px;
  color: #8e92a9;
}
.echartBottom {
  height: 140 * @r;
  width: 100%;
  background-color: #222638;
  display: flex;
  position: relative;
  border-radius: 10px;
  border: 1px solid #262a3b;
  box-sizing: border-box;
  overflow: hidden;
  margin-top: 10 * @r;
  .circular-right {
    height: 55 * @r;
    width: 55 * @r;
    background-color: #bb5839;
    border-radius: 50%;
    p {
      width: 0;
      height: 0;
      border-left: 8 * @r solid transparent;
      border-right: 8 * @r solid transparent;
      border-bottom: 14 * @r solid #bb5839;
      position: absolute;
      bottom: 3 * @r;
      left: -3 * @r;
      transform: rotate(-12deg);
    }
    span {
      position: absolute;
      width: 100%;
      height: 100%;
      font-size: 16px;
      color: #fff;
      top: 0;
      div {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      i {
        font-style: normal;
        font-size: 12px;
      }
    }
  }
  .circular-left {
    height: 55 * @r;
    width: 55 * @r;
    background-color: #bf8437;
    border-radius: 50%;
    // transform: rotate(10deg);
    p {
      width: 0;
      height: 0;
      border-left: 8 * @r solid transparent;
      border-right: 8 * @r solid transparent;
      border-top: 14 * @r solid #bf8437;
      position: absolute;
      bottom: -3 * @r;
      left: -2 * @r;
      transform: rotate(46deg);
    }
  }
}
</style>
