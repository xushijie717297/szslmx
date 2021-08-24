<template>
  <div class="home">
    <p id="statusBar"></p>
    <h3>首页</h3>
    <div class="top">
      <div class="content">
        <ul class="theme_ul" style="display: none">
          <li @click="themeDefault">默认(蓝色)</li>
          <li @click="themeGreen">青绿色</li>
          <li @click="themLink">暖色</li>
        </ul>
        <h5>供水总量变化曲线</h5>
        <div class="topBorder">
          <div class="topBorderTop">
            <div class="BorderTopL">
              <p>{{currentWater}}</p>
              <span>当前总水量(m³)</span>
            </div>
            <div class="BorderTopR">
              <p>{{nextWater}}</p>
              <span>下一时段预测水量(m³)</span>
            </div>
            <div class="shuidi">
              <div class="shuidi1">
                <p class="iconfont iconfenzu"></p>
              </div>
            </div>
          </div>
          <div id="echarts" style="width: 9.36rem; height: 5.3rem"></div>
        </div>
      </div>
      <h5>管网运行参数汇总</h5>
      <!-- 模型总供水量变化曲线 -->
      <div class="tabs">
        <!-- <div class="tabF"> -->
        <van-tabs @change="getEcharts" type="card" v-model="active">
          <van-tab
            v-for="(item, index) in data"
            :title="item.Label"
            :key="index"
          >
          </van-tab>
        </van-tabs>
        <!-- </div> -->
        <div class="tabContent">
          <div class="Content-Left">
            <div class="DividingLine"></div>
            <div class="DividingSpot">
              <p class="iconfont iconshuichang2"></p>
            </div>

            <div class="C-left">
              <div class="circular-left" :style="getStylel">
                <p></p>
              </div>
              <span>
                <div>
                  <!-- {{ pressure}} -->
                  {{ pressure | milliona }}
                  <i>m</i>
                </div>
              </span>
            </div>
            <div class="C-right">
              <div class="circular-right" :style="getStyler">
                <p></p>
              </div>
              <span>
                <div>
                  {{ flow | million }}
                  <!-- {{ flowwww | million }} -->
                  <i>m³/h</i>
                </div>
              </span>
            </div>
            <div class="text-left">出厂压力</div>
            <div class="text-right">出厂流量</div>
            <div id="echartc" style="width: 100%; height: 110px"></div>
          </div>
        </div>
        <!-- 第二三排饼图 -->
        <div class="sonEcharts">
          <echartsc class=""></echartsc>
        </div>
      </div>
      <echartB></echartB>
      <!-- <PipeNetworkSummary></PipeNetworkSummary> -->
      <ModelSummary></ModelSummary>
      <ModelSummaryPipe></ModelSummaryPipe>
      <h5>模型参数汇总</h5>
      <div class="parameter-summary">
        <div> 
          <span>管道总长（km）</span>
          <p>{{ summary.PipeLengths }}</p>
        </div>
        <div>
          <span>水厂总数（个）</span>
          <p>{{ summary.WaterFactoryCount }}</p>
        </div>
        <div>
          <span>水泵总数（台）</span>
          <p>{{ summary.PumpCount }}</p>
        </div>
        <div>
          <span>管道总数（根）</span>
          <p>{{ summary.PipeCount }}</p>
        </div>
        <div>
          <span>节点总数（个）</span>
          <p>{{ summary.JunctionCount }}</p>
        </div>
        <div>
          <span>阀门总数（个）</span>
          <p>{{ summary.TcvCount }}</p>
        </div>
        <div>
          <span>减压阀总数（个）</span>
          <p>{{ summary.PrvCount }}</p>
        </div>
        <div>
          <span>止回阀总数（个)</span>
          <p>{{ summary.CheckValveCount }}</p>
        </div>
        <div>
          <span>水表总数（个）</span>
          <p>{{ summary.MeterCount }}</p>
        </div>
        <div>
          <span>压力监测点总数（个）</span>
          <p>{{ summary.PressurePointCount }}</p>
        </div>
        <div>
          <span>流量计总数（个）</span>
          <p>{{ summary.FlowPointCount }}</p>
        </div>
        <h1></h1>
      </div>
    </div>
    <!-- <p class="iconfont iconweibajiantouxia" style="height:20px;width:20px;color:green"></p> -->
    <!-- <p class="iconfont iconweibajiantoushang" style="height:20px;width:20px;color:red"></p> -->
    <van-popup
      v-model="showMap"
      position="bottom"
      :style="{ height: '93%' }"
      get-container=".home"
    >
      <div id="map" style="width: 100%; height: 100%"></div>
    </van-popup>
  </div>
</template>
<script>
import $ from "jquery";
import axios from "axios";
import * as echarts from 'echarts';
import echartsc from "./echartsc";
import echartB from "./echartB";
import Bus from "../../utils/Bus";
import greenpin from "../../../static/imag/orangeIcon.png";
import { loadModules } from "esri-loader";
import tileInfo from "../../components/arcgisforjsTest/tdt_data.js";
import urlClass from "../../components/js/UrlClass";
import drawClass from "../../components/arcgisforjsTest/DrawClass";
import global from "../../components/js/Global"

// import echartsbj from '../../../static/imag/echartsbj.png'
import echartsbj from "../../../static/imag/1111.png";
import Vue from "vue";
import { Swipe, SwipeItem, Tab, Tabs, Popup } from "vant";
import Echartsc from "./echartsc.vue";
import PipeNetworkSummary from "./PipeNetworkSummary.vue";
import ModelSummary from "./ModelSummary.vue";
import ModelSummaryPipe from "./ModelSummaryPipe.vue";

Vue.use(Popup);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Swipe);
Vue.use(SwipeItem);
export default {
  name: "Home",
  components: {
    echartsc,
    echartB,
    PipeNetworkSummary,
    ModelSummary,
    ModelSummaryPipe,
  },
  data() {
    return {
      view: null,
      arcgisAPI: null,
      mapData:{},
      drawSymbol: null,
      showMap: false,
      flowwww: 1200, //测试
      fullImage: "",
      getStylel: {},
      getStyler: {},
      numm: 50,
      active: 0,
      showEcharts: true,
      day: null,
      currentRate: 0,
      current: 0,
      currentWater:0,
      nextWater:0,
      pressure: "-", //出场压力
      flow: "-", //出厂流量
      rate: "30",
      num: "90",
      accuracy: [],
      data: [],
      RunningStateInfo: null,
      list: [
        {
          name: "测试水厂一",
        },
        {
          name: "测试水厂一",
        },
        {
          name: "测试水厂一",
        },
        {
          name: "测试水厂一",
        },
        {
          name: "测试水厂一",
        },
        {
          name: "测试水厂一",
        },
        {
          name: "测试水厂一",
        },
      ],
      summary: [],
    };
  },
  computed: {
    text() {
      return this.currentRate.toFixed(0) + "%";
      return this.current.toFixed(0) + "%";
    },
  },
  filters: {
    million: function (value) {
      console.log(value)

      //过万处理
      let num;
      if (value > 9999) {
        num = Math.floor(value / 1000);
      } else if (value < 999 && value > 0) {
        num = (value / 1000).toFixed(1) + "k";
      } else if (value < 9999 && value > 999) {
        num = (Math.floor(value) / 1000).toFixed(1) + "k";
      }else if( value == "0"){
        num = value + "k"
      }else if(value == NaN || value == "-"){
        num = '--'
      }
      
      return num;
    },
    milliona: function (value) {
      console.log(value)
      let num;
      // value = Number(value);
      if (value > 10) {
        num = value.toFixed(1);
      }else if(value == "-"){
        num = "--"
      }else {
        num = value.toFixed(2);
      }
      return num;
    },
  },
  methods: {
    themeDefault() {
      document.body.className = "theme_default";
      localStorage.setItem("themeColor", "theme_default");
    },
    // 青绿色
    themeGreen() {
      document.body.className = "theme_darkgreen";
      localStorage.setItem("themeColor", "theme_darkgreen");
    },
    // 暖色
    themLink() {
      document.body.className = "thenm_warm";
      localStorage.setItem("themeColor", "thenm_warm");
    },
    drawBar(id) {
      this.chart = echarts.init(document.getElementById(id)); //DemandForecast
      //模型参数汇总
      axios
        .post(
          urlClass.homePage + "GetTotalDemandInfo",
          // "http://112.64.170.158:8013/HomePageService.svc/Rest/GetTotalDemandInfo",
          global.axiosHeaders
        )
        .then((res) => {
          // debugger
          var result = res.data.Response;
          var DemandActualData = [];
          var aDate = [];
          var Forecast = [];
          if (res && String(res.data.Code) == "0") {
            console.log(result);
            var DemandActual = result.DemandActual;
            let index = DemandActual.length - 1
            this.currentWater = DemandActual[index].WaterDemand
            var DemandForecast = result.DemandForecast;
            var length = DemandActual.length;
            this.nextWater = DemandForecast[length].WaterDemand
            for (let i = 0; i < DemandActual.length; i++) {
              DemandActualData.push(DemandActual[i].WaterDemand);
            }
            for (let i = 0; i < DemandForecast.length; i++) {
              aDate.push(DemandForecast[i].Time.slice(-8,-6));
              Forecast.push(DemandForecast[i].WaterDemand);
            }
            console.log(aDate);
            let xActualEnd = DemandActual[DemandActual.length - 1];
            var ForecastData = Forecast.splice(length);
            console.log(ForecastData);
            ForecastData.unshift(xActualEnd.WaterDemand);
            for (let j = 0; j < length - 1; j++) {
              ForecastData.unshift("");
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
            this.chart.setOption({
              grid: {
                top: "16px",
                left: "60px",
                right: "10px",
                bottom: "30px",
                show: true,
                borderWidth: 0,
                backgroundColor: {
                  image: this.fullImage,
                },
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
              xAxis: {
                type: "category",
                boundaryGap: false,
                data: aDate,
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
                // boundaryGap: [0, "100%"],
                // boundaryGap: true,
                max:100000,
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
              series: [
                {
                  name: "实际数据",
                  type: "line",
                  smooth: true,
                  symbol: "none",
                  sampling: "average",
                  itemStyle: {
                    color: "rgba(142, 146, 169, 1)",
                  },
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "rgba(142, 146, 169, 0.6)",
                      },
                      {
                        offset: 1,
                        color: "rgba(142, 146, 169, 0)",
                      },
                    ]),
                  },
                  data: DemandActualData,
                  markLine: {
                    silent: true,
                    symbol: "none",
                    label:{
                      position:"insideEndTop",
                    },
                    data: [
                      {
                       0: {
                          type: "max",
                        },
                        type: "average",
                        lineStyle: {
                          type: "solid",
                          color: "#BB0239",
                        },
                        label: {
                            color: "rgba(142, 146, 169, 1)",
                          }
                      },
                    ],
                  },
                },
                {
                  name: "模拟数据",
                  type: "line",
                  smooth: true,
                  symbol: "none",
                  sampling: "average",
                  itemStyle: {
                    color: "rgba(30, 238, 203, 1)",
                  },
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "rgba(15, 184, 155, 0.6)",
                      },
                      {
                        offset: 1,
                        color: "rgba(15, 184, 155, 0)",
                      },
                    ]),
                  },
                  data: ForecastData,
                  markLine: {
                    silent: true,
                    symbol: 'none',
                    label:{
                      position:"insideEndTop",
                    },
                    data: [
                      {
                        0: {
                          type: "max"
                        },
                        type: "average",
                        lineStyle: {
                          type: "solid",
                          color: "#d0a802",
                        },
                        label: {
                          color: "rgba(142, 146, 169, 1)"
                        }
                      },
                    ],
                  },
                },
              ],
            });
          } else {
            console.log("错误信息:", res.Message);
          }
        })
        .catch((error) => {});
    },
    echarts() {
      var current = 70;
      var total = 270;
      // var rotate = current/total*270*1.33 + 'deg'
      var rotate = (current / total) * 270 * 1.33 + "deg";
      this.getStylel = {
        transform: "rotate(" + rotate + ")",
      };
      var aa = 90;
      var bb = 210;
      var rotat = (aa / bb) * 270 * 1.33 + "deg";
      this.getStyler = {
        transform: "rotate(" + rotat + ")",
      };
      var that = this;
      //模型参数汇总
      axios
        .post(
          urlClass.homePage + "GetModelStatistic",
          global.axiosHeaders
        )
        .then((res) => {
          // debugger
          var result = res.data.Response;
          if (res && String(res.data.Code) == "0") {
            that.summary = result;
          } else {
            console.log("错误信息:", res.Message);
          }
        })
        .catch((error) => {});
      //管网运行参数汇总
      axios
        .post(
          urlClass.homePage + "GetWaterFactoryInfo",
          global.axiosHeaders
        )
        .then((res) => {
          // debugger
          var result = res.data.Response;
          if (res && String(res.data.Code) == "0") {
            that.data = result;
            console.log(result)
            that.pressure = that.data[0].EntryPressure;
            that.flow = that.data[0].EntryFlow;
          } else {
            console.log("错误信息:", res.Message);
          }
        });
    },
    getEcharts(name, title) {
      if (name == 2) {
        this.numm = 50;
        this.echartC("echartc");
      } else if (name == 3) {
        this.numm = 10;
        this.echartC("echartc");
      }
      switch (name) {
        case 0:
          this.pressure = this.data[name].EntryPressure;
          this.flow = this.data[name].EntryFlow;
          break;
        case 1:
          this.flow = this.data[name].EntryFlow;
          this.pressure = this.data[name].EntryPressure;
          break;
        case 2:
          this.flow = this.data[name].EntryFlow;
          this.pressure = this.data[name].EntryPressure;
          break;
        case 3:
          this.flow = this.data[name].EntryFlow;
          this.pressure = this.data[name].EntryPressure;
          break;
        case 4:
          this.flow = this.data[name].EntryFlow;
          this.pressure = this.data[name].EntryPressure;
          break;
        case 5:
          this.flow = this.data[name].EntryFlow;
          this.pressure = this.data[name].EntryPressure;
          break;
        case 6:
          this.flow = this.data[name].EntryFlow;
          this.pressure = this.data[name].EntryPressure;
          break;
        case 7:
          this.flow = this.data[name].EntryFlow;
          this.pressure = this.data[name].EntryPressure;
          break;
      }
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
            top: "65%",
            textAlign: "center",
            textStyle: {
              fontWeight: "normal",
              fontSize: "16",
              color: "#4664e3",
              textAlign: "center",
            },
          },
          {
            text: "",
            left: "70%",
            top: "60%",
            textAlign: "center",
            textStyle: {
              color: "#4664e3",
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
                    color: "#4664e3",
                  // },
                },
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
                    color: "#0fb89b",
                  // },
                },
                // label: dataStyle,
              },
              {
                value: 110,
                itemStyle: placeHolderStyle,
              },
            ],
          },
        ],
      });
    },
    createMap() {
      loadModules(
        [
          "esri/Map",
          "esri/views/MapView",
          "esri/layers/WebTileLayer",
          "esri/layers/support/TileInfo",
          "esri/layers/MapImageLayer",
          "esri/geometry/SpatialReference",
          "esri/geometry/Extent",
          "esri/Graphic",
          "esri/widgets/Home",
          "esri/config",
          "esri/geometry/Polygon",
          "esri/symbols/SimpleFillSymbol",
          "esri/tasks/support/query",
          "esri/tasks/QueryTask",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/layers/GraphicsLayer",
          "esri/geometry/geometryEngine",

        ],
        {
          css: urlClass.ArcgisCss,
          url: urlClass.ArcgisUrl,
        }
      ).then(
        ([
          ArcGISMap,
          MapView,
          WebTileLayer,
          TileInfo,
          MapImageLayer,
          SpatialReference,
          Extent,
          Graphic,
          Home,
          esriConfig,
          Polygon,
          SimpleFillSymbol,
          Query,
          QueryTask,
          SimpleMarkerSymbol,
          SimpleLineSymbol,
          GraphicsLayer,
          geometryEngine
        ]) => {
          this.arcgisAPI = {
            SpatialReference: SpatialReference,
            Extent: Extent,
            Query: Query,
            QueryTask: QueryTask,
            SimpleMarkerSymbol: SimpleMarkerSymbol,
            SimpleLineSymbol: SimpleLineSymbol,
            GraphicsLayer:GraphicsLayer,
            Graphic:Graphic,
            geometryEngine:geometryEngine
          };
          this.arcgisView = { MapView: MapView };
          this.arcgisExtent = { Extent: Extent };
          var data = tileInfo.tileInfo;
          var str = JSON.stringify(data);
          var tileInfoTemp = JSON.parse(str);
          drawClass.setArcgisforAPI(this.arcgisAPI);  
          for (var i = 0; i < tileInfoTemp.lods.length; i++) {
            tileInfoTemp.lods[i].resolution *= global.mul;
          }
          var map = new ArcGISMap(); // 创建地图实例
          var wtl_tileInfo = new TileInfo(tileInfoTemp);
          let webTileMap = new WebTileLayer(urlClass.amap, {
            tileInfo: wtl_tileInfo,
          });
          map.add(webTileMap);
          var dynamicMapServiceLayer = new MapImageLayer(
            // "http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sz_BaseMap/MapServer"
            urlClass.appMapUrl
          );
          map.add(dynamicMapServiceLayer);
          this.drawSymbol = new GraphicsLayer();
          map.add(this.drawSymbol);
          var initExtent = new Extent(global.initExtent.minX, global.initExtent.minY, global.initExtent.maxX, global.initExtent.maxY,
            new SpatialReference({ wkid: global.spatialReference }));
          var view = (this.view = new MapView({
            container: "map",
            map: map,
            extent: initExtent,
            spatialReference: new SpatialReference({ wkid: global.spatialReference }),
          }));
          var self = this;
          //初始化
          this.view.ui._removeComponents(["attribution", "zoom"]);
          view.when(function (e) {
            console.log("LoadMap完成");
            self.getDataXy()
          });
        }
      );
    },
    getDataXy(){
      // debugger
      var coordinateX = this.mapData.X;
      var coordinateY = this.mapData.Y;
      var point = {
        type: "point", // autocasts as new Point()
        x: coordinateX,
        y: coordinateY,
        spatialReference: new this.arcgisAPI.SpatialReference({ wkid: global.spatialReference }),
      };
      this.drawSymbol.removeAll();
      var symbol = {
        type: "picture-marker", // autocasts as new PictureMarkerSymbol()
        url: greenpin,
        width: 16,
        height: 32,
        yoffset: 16,
      };
      var gra1 = new this.arcgisAPI.Graphic();
      gra1.geometry = point;
      gra1.symbol = symbol;
      console.log(gra1)
      this.view.center = point;
      this.view.zoom = "4"
      this.drawSymbol.add(gra1);
      // drawClass.MapResultDataRangeZoom([this.drawSymbol], this.view);
    }
  },
  mounted() {
    this.echarts();
    this.$nextTick(function () {
      this.drawBar("echarts");
      this.echartC("echartc");
      var that = this;
      var resizeTimer = null;
      window.onresize = function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          that.drawBar("echarts");
          that.echartC("echartc");
        }, 100);
      };
    });
    var mySwiper = new Swiper(".swiper-container", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
      },
      observer: true, //修改swiper自己或子元素时，自动初始化swiper
      observeParents: true, //修改swiper的父元素时，自动初始化swiper
      loop: true, //开启轮循
    });
    Bus.$on("MaxSlop", (res) => {
      this.mapData = res
      this.showMap = true;
      this.createMap();
      console.log(
        "%c XSJ-[ res ]->",
        "font-size:13px; background:red; color:#bf2c9f;",
        res
      );
    });
    Bus.$on("MaxVelocity", (res) => {
      this.mapData = res
      this.showMap = true;
      console.log(
        "%c XSJ-[ res ]->",
        "font-size:13px; background:red; color:#bf2c9f;",
        res
      );
    });
    Bus.$on("MaxPressure", (res) => {
      this.mapData = res
      this.showMap = true;
      console.log(
        "%c XSJ-[ res ]->",
        "font-size:13px; background:red; color:#bf2c9f;",
        res
      );
    });
    Bus.$on("MinPressure", (res) => {
      this.mapData = res
      this.showMap = true;
      console.log(
        "%c XSJ-[ res ]->",
        "font-size:13px; background:red; color:#bf2c9f;",
        res
      );
    });
  },
};
</script>
<style lang="less">
.van-hairline--top-bottom::after,
.van-hairline-unset--top-bottom::after {
  border-width: 0px 0px !important;
}
</style>
<style scoped lang="less">
@import "../../assets/color.less";
@import "./home.less";
@r: 1rem/37.5;
.iconfont {
  height: 16 * @r;
  width: 16 * @r;
  display: block;
}
.iconweibajiantoushang {
  color: red !important;
}
.iconweibajiantouxia {
  color: green !important;
}
.home {
  height: 100%;
  // width: 100%;
  background: #262f49;
  // background: @bright;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &::after {
    display: block;
    content: "";
    width: 100%;
    height: 50px;
    background-color: black;
  }
  & /deep/ .van-tabs__wrap--scrollable {
    height: 40px;
  }
  & /deep/ .van-tabs--card>.van-tabs__wrap {
    min-height: 40px !important;
}
  & /deep/ .van-tabs__nav--card {
    border-bottom: none;
    border-color: #262a3b;
    margin: 0;
    background: #222638;
    box-shadow: 0px 1px 0px 0px #121421;
    border-radius: 10px 10px 0px 0px;
    height: 40px;
    .van-tab {
      border: none;
      color: #fff;
      padding: 0 6px;
      span {
        background: #171a2a;
        color: #8e92a9;
        display: block;
        padding: 2px 6px;
        border-radius: 12px;
        border: 1px solid #262a3b;
      }
    }
  }
  & /deep/ .van-tabs__nav--complete {
    padding-left: 1px !important;
    padding-right: 0 !important;
  }
  & /deep/ .van-tab--active {
    background-color: transparent !important;
    span {
      background: #4664e3 !important;
      color: #fff !important;
    }
  }
  // & /deep/ .van-tabs__wrap--scrollable .van-tab {
  //   background: #171a2a;
  //   height: 24px;
  //   border-radius: 12px;
  //   margin-left: 4px;
  //   margin-top: 10px;
  //   border: 1px solid #262a3b;
  //   box-sizing: border-box;
  //   margin-left: 5px;
  //   margin-left: 10px;
  //   position: relative;
  // }
  // & /deep/ .van-tab__text {
  //   // position: absolute;
  //   z-index: 2;
  //   color: #8e92a9;
  //   display: block;
  //   height: 100%;
  //   width: 100%;
  //   line-height: 24px;
  //   font-size: 12px;
  // }
  // & /deep/ .van-tabs__wrap--scrollable .van-tabs__nav {
  //   background: #1c1f2f;
  //   border-radius: 10px 10px 0px 0px;
  //   border-top: 1px solid #262a3b;
  // }
  // & /deep/ .van-tab--active {
  //   span {
  //     color: #fff;
  //   }
  // }
  // & /deep/ .van-tabs__line {
  //   height: 24px;
  //   width: 22% !important;
  //   border-radius: 22px;
  //   bottom: 10px;
  //   background: #4664e3;
  // }
  // & /deep/ .van-tabs__nav--line {
  //   padding-bottom: 0;
  // }
}
#statusBar {
  height: 24px;
  background: #242838;
}
h3 {
  height: 45px;
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.top {
  /* @cap: 50px;
    height: calc(~"100% - @{cap}");less中的写法 */
  // height: calc(100% - 95px);
  // width: 100%;
  flex: 1;
  overflow: auto;
  background: #171a2a;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #171a2a;
}
#echartc{
  background: #222638;
}
</style>