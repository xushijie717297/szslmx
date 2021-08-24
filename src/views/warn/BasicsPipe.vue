<template>
  <div class="warning">
    <p id="statusBar"></p>
    <van-nav-bar
      :title="msg"
      left-text="返回"
      left-arrow
      @click-left="superior"
      :border="false"
    />
    <div class="main">
      <div class="mainClass" v-show="minTF">
        <div class="mainClassT">
          <p>{{ msg }}</p>
          <span>{{ currentDate }}</span>
        </div>
        <div class="mainClassB">
          <p>24HRS</p>
          <span>{{ currentTime }}</span>
        </div>
      </div>
      <div class="legendControl">
        <van-checkbox v-model="waterworks" @change="waterwork"
          >水量</van-checkbox
        >
        <van-checkbox v-model="cPressure" @change="cPressur">压力</van-checkbox>
        <van-checkbox v-model="cFlow" @change="cFlo">水厂</van-checkbox>
      </div>
      <img class="mask" src="../../../static/imag/mask.png" alt="" />
      <div id="map" style="width: 100%; height: 100%"></div>
    </div>
    <van-popup v-model="EchartShow">
      <echartsLine></echartsLine>
    </van-popup>
    <van-popup
      v-model="EchartA" 
      position="bottom"
      :style="{ height: '42%' }">
        <div class="popupTop">
          <p>24小时{{pipeChartData.label}}曲线</p>
          <p @click="showMapClick1" class="iconfont iconguanbi4"></p>
        </div>
      <EchatAtt></EchatAtt>
    </van-popup>
    <van-popup
      v-model="showMap"
      position="bottom"
      :style="{ height: '42%' }"
      :overlay="false"
      get-container=".warning"
    >
      <div class="popupBox">
        <div class="popupTop">
          <p>{{pipeType}}</p>
          <p @click="showMapClick" class="iconfont iconguanbi4"></p>
        </div>
        <div class="popupContent">
          <div
            v-for="(item, index) in pipeAttrData"
            :key="index"
            class="popupB"
          >
            <p>{{ item.name }}{{ item.unit }}</p>
            <p>
                {{ item.value }}
              <span
                class="iconfont iconquxiantu"
                v-if="index == '0' && pipeType == '管道属性'"
                @click="FlowChart"
              ></span>
              <span
                class="iconfont iconquxiantu"
                v-if="index == '1' && pipeType == '管道属性'"
                @click="VelocityChart"
              ></span>
              <span
                class="iconfont iconquxiantu"
                v-if="index == '2' && pipeType == '管道属性'"
                @click="HeadlossChart"
              ></span>
              <span
                class="iconfont iconquxiantu"
                v-if="index == '0' && pipeType == '节点属性'"
                @click="HydraulicGrade"
              ></span>
              <span
                class="iconfont iconquxiantu"
                v-if="index == '1' && pipeType == '节点属性'"
                @click="Pressure"
              ></span>
              <span
                class="iconfont iconquxiantu"
                v-if="index == '0' && pipeType == '阀门属性'"
                @click="FromHead"
              ></span>
              <span
                class="iconfont iconquxiantu"
                v-if="index == '1' && pipeType == '阀门属性'"
                @click="FromPressure"
              ></span>
              <span
                class="iconfont iconquxiantu"
                v-if="index == '5' && pipeType == '水池属性'"
                @click="HydraulicGrade"
              ></span>
            </p>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import Bus from "../../utils/Bus";
import sliderMap from "./SliderMapFL";
import axios from "axios";
import Vue from "vue";
import urlClass from "../../components/js/UrlClass";
import global from "../../components/js/Global";
import popupLableBg from "../../components/js/popupLableBg";
import popupEcharts from "../../components/js/popupEcharts";
import { DropdownMenu, DropdownItem } from "vant";
import parameter from "../../../static/page.json";
import cat1 from "../../../static/ygPoint/cat1.png";
import cat2 from "../../../static/ygPoint/cat2.png";
import cat3 from "../../../static/ygPoint/cat3.png";
import cat4 from "../../../static/ygPoint/cat4.png";
import cat5 from "../../../static/ygPoint/cat5.png";
import star1 from "../../../static/point/cat1.png";
import star2 from "../../../static/point/cat2.png";
import star3 from "../../../static/point/cat3.png";
import star4 from "../../../static/point/cat4.png";
import star5 from "../../../static/point/cat5.png";
import waterworksImageSource from "../../../static/imag/waterFactory/sc.png";
import pressureSource from "../../../static/imag/waterFactory/pressure.png";
import trafficSource from "../../../static/imag/waterFactory/traffic.png";
import dummySource from "../../../static/imag/waterFactory/dummy.png";
import { NavBar, Switch, Checkbox, CheckboxGroup, Popup } from "vant";

Vue.use(Popup);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(NavBar);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
import $ from "jquery";
import { loadModules } from "esri-loader";
import tileInfo from "../../components/arcgisforjsTest/tdt_data.js";
import drawClassFlowDirection from "../../components/js/FlowDirection";
import Attribute from "../../components/js/Attribute";
import echartsLine from "./echartsLine.vue";
import EchatAtt from "./EchatAttr";
export default {
  name: "warn",
  components: {
    sliderMap,
    echartsLine,
    EchatAtt,
  },
  data() {
    return {
      showMap: false,
      legendIcon: false, //收起图例
      switchShow: false,
      orientation: 0,
      innerWidthTmp: 0,
      msg: "基础管网",
      show: true,
      shows: false,
      arcgisAPI: null,
      view: null,
      seattleLayer: null,
      selItem: null,
      couponList: [
        {
          name: "管道流量24小时变化",
          code: "variety",
          playField: "Result_AbsoluteFlow_",
        },
      ],
      animation: null,
      couponSelected: "",
      playButton: null,
      slider: null,
      sliderLabelArray: [],
      sliderResizeTime: 0,
      sliderValue: 0,
      isPlay: false,
      sliderOmitLocation: "center", //left,center,right
      sliderType: "value", //time,value
      sliderMax: 120,
      direction: 0.2,
      delay: 1000 / 30,
      obj: null,
      rgba: [],
      wholeParameter: [],
      legend: false, //控制特殊图例显示
      legendShows: true, //控制图例显示
      timing: null,
      waterworksAttributeLayer: null,
      trafficLayer: null,
      pressureLayer: null,
      mapClickgl: null,
      cPressure: false,
      waterworks: false,
      cFlow: false,
      minTF: false,
      checked: false,
      EchartShow: false,
      EchartA: false,
      pipeType:"",
      currentTime: "00:00:00",
      currentDate:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate(),
      pipeAttrData: [],
      pipeChartData: [],
    };
  },
  mounted() {
    // plus.screen.unlockOrientation();
    this.arcgis();
    var self = this;
    Bus.$on("OneMonitorData", (res) => {
      console.log("00000000000000000000", res);
      this.EchartShow = true;
      self.GetOneMonitorData(res);
    });
    // Bus.$on("EchatAttr", (res) => {
    //   this.EchartA = true;
    //   this.$nextTick(() => {
    //     Bus.$emit("EchatAttrData", res);
    //     console.log(
    //       "%c XSJ-[ res ]->",
    //       "font-size:13px; background:red; color:#bf2c9f;",
    //       res
    //     );
    //   });
    // });
    Bus.$on("pipeAttr", (res) => {
      this.pipeAttrData = []
      console.log(res)
      this.pipeAttrData = res;
      this.pipeType = "管道属性"
    });
    Bus.$on("junction", (res) => {
      this.pipeAttrData = []
      console.log(res)
      this.pipeAttrData = res;
      this.pipeType = "节点属性"

    });
    Bus.$on("valve", (res) => {
      this.pipeAttrData = []
      console.log(res)
      this.pipeAttrData = res;
      this.pipeType = "阀门属性"

    });
    Bus.$on("hydrant", (res) => {
      this.pipeAttrData = []
      console.log(res)
      this.pipeAttrData = res;
      this.pipeType = "消火栓属性"

    });
    Bus.$on("pool", (res) => {
      this.pipeAttrData = []
      console.log(res)
      this.pipeAttrData = res;
      this.pipeType = "水池属性"

    });
    Bus.$on("EchatAttrs", (res) => {
      console.log(res);
      this.pipeChartData = res;
    });
    Bus.$on("EchatAttrE", (res) => {
      this.EchartA = true;
      this.$nextTick(() => {
       Bus.$emit("EchatAttrData", res);
      })
    });
    this.SearchByID('481323')
  },
  methods: {
    SearchByID(ID) {
      axios
        .post(urlClass.axiosUrl + "SearchID", JSON.stringify(ID), global.axiosHeaders)
        .then(this.SearchReturn);
    },
    FlowChart() {
      //流量echarts
      console.log("流量echarts", this.pipeChartData);
      this.pipeChartData.field = "Flow"
      this.pipeChartData.label = "流量"
      this.pipeChartData.unit = "m³/h"
      var id = this.pipeChartData.id
      var type = this.pipeChartData.type
      var field = this.pipeChartData.field
      var label = this.pipeChartData.label
      var unit = this.pipeChartData.unit
      Attribute.ChartClick(id, field, type, label, unit)
    },
    VelocityChart() {
      //流速echarts
      console.log("流速echarts");
      this.pipeChartData.field = "Velocity"
      this.pipeChartData.label = "流速"
      this.pipeChartData.unit = "m/s"
      var id = this.pipeChartData.id
      var type = this.pipeChartData.type
      var field = this.pipeChartData.field
      var label = this.pipeChartData.label
      var unit = this.pipeChartData.unit
      Attribute.ChartClick(id, field, type, label, unit)
    },
    HeadlossChart() {
      //水头损失echarts
      console.log("水头损失echarts");
      this.pipeChartData.field = "Headloss"
      this.pipeChartData.label = "水头损失"
      this.pipeChartData.unit = "m"
      var id = this.pipeChartData.id
      var type = this.pipeChartData.type
      var field = this.pipeChartData.field
      var label = this.pipeChartData.label
      var unit = this.pipeChartData.unit
      Attribute.ChartClick(id, field, type, label, unit)
    },
    HydraulicGrade() {
      //水压标高echarts
      console.log("水压标高echarts");
      this.pipeChartData.field = "HydraulicGrade"
      this.pipeChartData.label = "水压标高"
      this.pipeChartData.unit = "m"
      var id = this.pipeChartData.id
      var type = this.pipeChartData.type
      var field = this.pipeChartData.field
      var label = this.pipeChartData.label
      var unit = this.pipeChartData.unit
      Attribute.ChartClick(id, field, type, label, unit)
    },
    Pressure() {
      //水压标高echarts
      console.log("压力echarts");
      this.pipeChartData.field = "Pressure"
      this.pipeChartData.label = "压力"
      this.pipeChartData.unit = "m"
      var id = this.pipeChartData.id
      var type = this.pipeChartData.type
      var field = this.pipeChartData.field
      var label = this.pipeChartData.label
      var unit = this.pipeChartData.unit
      Attribute.ChartClick(id, field, type, label, unit)
    },
    Demand() {
      //流量echarts
      console.log("流量echarts");
      this.pipeChartData.field = "Demand"
      this.pipeChartData.label = "流量"
      this.pipeChartData.unit = "m³/h"
      var id = this.pipeChartData.id
      var type = this.pipeChartData.type
      var field = this.pipeChartData.field
      var label = this.pipeChartData.label
      var unit = this.pipeChartData.unit
      Attribute.ChartClick(id, field, type, label, unit)
    },
    FromHead() {
      //阀门水压标高echarts
      console.log("流量echarts");
      this.pipeChartData.field = "FromHead"
      this.pipeChartData.label = "水压标高"
      this.pipeChartData.unit = "m"
      var id = this.pipeChartData.id
      var type = this.pipeChartData.type
      var field = this.pipeChartData.field
      var label = this.pipeChartData.label
      var unit = this.pipeChartData.unit
      Attribute.ChartClick(id, field, type, label, unit)
    },
    FromPressure() {
      //阀门水压标高echarts
      console.log("流量echarts");
      this.pipeChartData.field = "FromHead"
      this.pipeChartData.label = "压力"
      this.pipeChartData.unit = "m"
      var id = this.pipeChartData.id
      var type = this.pipeChartData.type
      var field = this.pipeChartData.field
      var label = this.pipeChartData.label
      var unit = this.pipeChartData.unit
      Attribute.ChartClick(id, field, type, label, unit)
    },
    HydraulicGrade() {
      //水位echarts
      console.log("水位echarts");
      this.pipeChartData.field = "HydraulicGrade"
      this.pipeChartData.label = "水位"
      this.pipeChartData.unit = "m"
      var id = this.pipeChartData.id
      var type = this.pipeChartData.type
      var field = this.pipeChartData.field
      var label = this.pipeChartData.label
      var unit = this.pipeChartData.unit
      Attribute.ChartClick(id, field, type, label, unit)
    },
    showMapClick() {
      this.showMap = false;
      this.mapClickgl.removeAll();
    },
    showMapClick1() {
      this.EchartA = false;
    },
    cFlo() {
      console.log(this.cFlow);
      if (!this.cFlow) {
        this.waterworksAttributeLayer.removeAll();
        popupLableBg.destroy();
      } else {
        this.WaterworksAttributeFunction();
      }
    },
    cPressur() {
      console.log(this.cPressure);
      var _type = "pressure";
      if (this.cPressure) {
        this.GetRealTimeData(_type);
        this.timingRefresh();
      } else {
        this.DelRealTimeDataByType(_type);
      }
    },
    waterwork() {
      console.log(this.waterworks);
      var _type = "flow";
      if (this.waterworks) {
        this.GetRealTimeData(_type);
        this.timingRefresh();
      } else {
        this.DelRealTimeDataByType(_type);
      }
    },
    WaterworksAttributeFunction() {
      var parameterTemp = global.pipeSupplyAreaLimit;
      axios
        .post(
          urlClass.axiosUrl + "SourceCoordinate",
          JSON.stringify(parameterTemp),
          global.axiosHeaders
        )
        .then(this.DrawWaterworksAttribute);
    },
    DrawWaterworksAttribute(response) {
      var result = response.data;
      if (result && String(result.Code) == "0") {
        var tempData = [];
        popupLableBg.destroy();
        this.waterworksAttributeLayer.removeAll();
        var allWaterworksAtttibute = result.Response;
        for (var i = 0; i < allWaterworksAtttibute.length; i++) {
          var obj = {
            id: global.pipeSupplyAreaLimit[i],
            title: global.pipeSupplyAreaLabels[i],
            x: allWaterworksAtttibute[i].X,
            y: allWaterworksAtttibute[i].Y,
          };
          tempData.push(obj);
          this.DrawOneWaterworksAttriute(obj);
        }
        if (tempData.length > 0) {
          //加载popup的数据
          popupLableBg.loadPopup(tempData);
        }
      } else {
        console.log("错误信息:", result.Message);
      }
    },
    DrawOneWaterworksAttriute(obj) {
      var pointTemp = this.arcgisAPI.Point(
        obj.x,
        obj.y,
        new this.arcgisAPI.SpatialReference({ wkid: global.spatialReference })
      );
      var pictureMarkerSymbol = new this.arcgisAPI.PictureMarkerSymbol({
        url: waterworksImageSource,
        width: "28px",
        height: "34px",
      });
      var gra1 = new this.arcgisAPI.Graphic(pointTemp, pictureMarkerSymbol);
      this.waterworksAttributeLayer.add(gra1);
    },
    /**
     * 获取压力、流量实时数据
     * @param {*} type
     */
    GetRealTimeData(type) {
      var self = this;
      var unit = "m";
      if (type == "flow") {
        unit = "m³/h";
        this.trafficLayer.removeAll();
      } else {
        unit = "m";
        this.pressureLayer.removeAll();
      }
      popupEcharts.typeDestroy(type);
      axios
        .post(
          urlClass.axiosUrl + "GetRealTimeData",
          JSON.stringify(type),
          global.axiosHeaders
        )
        .then(function (response) {
          var result = response.data;
          if (result && String(result.Code) == "0") {
            var listData = [];
            for (var i = 0; i < result.Response.length; i++) {
              const _data = result.Response[i];
              var obj = {};
              obj.id = _data.id;
              obj.x = _data.X;
              obj.y = _data.Y;
              obj.type = _data.Type;
              obj.time = _data.Time;
              obj.value = _data.MonitorValue;
              obj.title = _data.Name;
              obj.content = _data.MonitorValue + " " + unit;
              obj.IsWarning = _data.IsWarning;
              obj.echartDisplay = false;
              obj.option = [];
              listData.push(obj);
              //绘制地图图标
              self.DrawRealTimeData(obj);
            }
            if (listData.length > 0) {
              //加载popup的数据
              popupEcharts.loadPopup(listData);
            }
          } else {
            console.log("错误信息:", result.Message);
          }
        });
    },
    /**
     * 绘制地图图标
     */
    DrawRealTimeData(obj) {
      var pictureMarkerSymbol = null;
      var gra = null;
      var pointTemp = this.arcgisAPI.Point(
        obj.x,
        obj.y,
        new this.arcgisAPI.SpatialReference({ wkid: global.spatialReference })
      );
      if (obj.type == "flow") {
        pictureMarkerSymbol = new this.arcgisAPI.PictureMarkerSymbol({
          url: trafficSource,
          width: "20px",
          height: "20px",
        });
        gra = new this.arcgisAPI.Graphic(pointTemp, pictureMarkerSymbol);
        this.trafficLayer.add(gra);
      } else if (obj.type == "pressure") {
        pictureMarkerSymbol = new this.arcgisAPI.PictureMarkerSymbol({
          url: pressureSource,
          width: "20px",
          height: "20px",
        });
        gra = new this.arcgisAPI.Graphic(pointTemp, pictureMarkerSymbol);
        this.pressureLayer.add(gra);
      } else if (obj.type == "xnd") {
        pictureMarkerSymbol = new this.arcgisAPI.PictureMarkerSymbol({
          url: dummySource,
          width: "20px",
          height: "20px",
        });
        gra = new this.arcgisAPI.Graphic(pointTemp, pictureMarkerSymbol);
        this.dummyLayer.add(gra);
      }
    },
    /**
     * 计时刷新
     */
    timingRefresh() {
      this.clearTimingRefresh(); //初始化还原计时器
      this.timing = setTimeout(this.GetTimingRealTimeData, 1000 * 60);
    },
    /**
     * 清空计时刷新,传入true销毁popup的数据
     */
    clearTimingRefresh(isClearData = false) {
      if (this.timing) {
        clearTimeout(this.timing);
        this.timing = null;
      }
      if (isClearData) {
        //销毁popup的数据
        popupEcharts.destroy();
        this.trafficLayer.removeAll();
        this.pressureLayer.removeAll();
        // popupTable.destroy();
        this.dummyLayer.removeAll();
      }
    },
    /**
     * 计时获取流量压力实时数据
     */
    GetTimingRealTimeData() {
      //销毁popup的数据
      popupEcharts.destroy();
      if (this.cPressure) {
        this.GetRealTimeData("pressure"); //实时压力
        console.log(
          "%c XSJ-[ pressure ]->",
          "font-size:13px; background:red; color:#bf2c9f;",
          this.cPressure
        );
      }
      if (this.waterworks) {
        this.GetRealTimeData("flow"); //实时流量
        console.log(
          "%c XSJ-[ flow ]->",
          "font-size:13px; background:red; color:#bf2c9f;",
          this.waterworks
        );
      }
      // if (dummyChecked) {
      //     popupTable.destroy();
      //     GetRealTimeDummy();//实时虚拟点
      // }
      if (this.cFlow || this.cPressure || this.waterworks) {
        // isTiming = true;
        this.timingRefresh();
      }
    },
    /**
     * 删除地图实时显示数据
     * @param {*} type
     */
    DelRealTimeDataByType(type) {
      //销毁popup的数据
      if (type == "flow") {
        popupEcharts.typeDestroy(type);
        this.trafficLayer.removeAll();
      } else if (type == "pressure") {
        popupEcharts.typeDestroy(type);
        this.pressureLayer.removeAll();
      } else if (type == "xnd") {
        popupTable.destroy();
        this.dummyLayer.removeAll();
      }
    },
    /**
     * 获取压力、流量历史数据
     */
    GetOneMonitorData(obj) {
      console.log("111111111111111111111111111111", obj);
      var parameterTemp = {
        id: obj.id,
        Type: obj.type,
      };
      console.log(parameterTemp);
      var typeTemp = obj.type == "flow" ? "流量(m³/h)" : "压力(m)";
      axios
        .post(
          urlClass.axiosUrl + "GetOneMonitorData",
          JSON.stringify(parameterTemp),
          global.axiosHeaders
        )
        .then(function (response) {
          var result = response.data;
          if (result && String(result.Code) == "0") {
            var real = [];
            var cal = [];
            var listX = [];
            var listXNew = [];
            var min = result.Response[0].CalValue,
              max = 0;
            for (var i = 0; i < result.Response.length; i++) {
              var monitor = result.Response[i];
              if (Number(monitor.MonitorValue) != 0) {
                real.push(monitor.MonitorValue);
                if (Number(monitor.MonitorValue) < min) {
                  min = Number(monitor.MonitorValue);
                } else if (Number(monitor.MonitorValue) > max) {
                  max = Number(monitor.MonitorValue);
                }
              } else {
                real.push("");
              }
              if (
                String(monitor.Minute) == "0" &&
                String(monitor.Second) == "0"
              ) {
                listXNew.push(monitor.Time);
                cal.push(monitor.CalValue);
                if (Number(monitor.CalValue) < min) {
                  min = Number(monitor.CalValue);
                } else if (Number(monitor.CalValue) > max) {
                  max = Number(monitor.CalValue);
                }
              } else {
                cal.push("");
              }
              listX.push(monitor.Time);
            }
            min -= 1;
            max += 1;

            var _charData = { real, cal, listX, typeTemp, listXNew, min, max };
            // console.log('%c XSJ-[ _charData ]->', 'font-size:13px; background:red; color:#bf2c9f;', _charData)
            //加载popup图表数据
            // WindowsEvent.MyDispatchEvent('RunningStateMonitorChartShow', {label:obj.title,monitorChartData:_charData});
            var objs = new Object();
            objs = {
              label: obj.title,
              monitorChartData: _charData,
            };
            Bus.$emit("OneMonitorDatas", objs);
          } else {
            console.log("错误信息:", result.Message);
          }
        });
    },
    get() {
      plus.cache.calculate(function (size) {
        console.log(size);
      });
    },
    superior() {
      if (this.cPressure || this.cFlow) {
        clearTimeout(this.timing);
        this.timing = null;
      }
      this.$router.push("/shopcart");
    },
    suspend() {
      this.show = false;
      this.shows = true;
    },
    start() {
      this.show = true;
      this.shows = false;
    },
    arcgis() {
      // lazy load the required ArcGIS API for JavaScript modules and CSS
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
          "esri/layers/FeatureLayer",
          "esri/widgets/Slider",
          "esri/layers/GraphicsLayer",
          "esri/geometry/Point",
          "esri/symbols/PictureMarkerSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/Color",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/tasks/support/IdentifyParameters",
          "esri/tasks/IdentifyTask",
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
          FeatureLayer,
          Slider,
          GraphicsLayer,
          Point,
          PictureMarkerSymbol,
          SimpleLineSymbol,
          Color,
          SimpleMarkerSymbol,
          IdentifyParameters,
          IdentifyTask,
        ]) => {
          this.arcgisAPI = {
            SpatialReference: SpatialReference,
            Extent: Extent,
            Slider: Slider,
            Graphic: Graphic,
            GraphicsLayer: GraphicsLayer,
            Point: Point,
            PictureMarkerSymbol: PictureMarkerSymbol,
            SimpleLineSymbol: SimpleLineSymbol,
            Color: Color,
            SimpleMarkerSymbol: SimpleMarkerSymbol,
            IdentifyParameters: IdentifyParameters,
            IdentifyTask: IdentifyTask,
          };
          drawClassFlowDirection.setArcgisforAPI(this.arcgisAPI);
          Attribute.setArcgisforAPI(this.arcgisAPI);
          this.arcgisView = { MapView: MapView };
          this.arcgisExtent = { Extent: Extent };
          var data = tileInfo.tileInfo;
          var str = JSON.stringify(data);
          var tileInfoTemp = JSON.parse(str);
          for (var i = 0; i < tileInfoTemp.lods.length; i++) {
            tileInfoTemp.lods[i].resolution *= global.mul;
          }
          var map = new ArcGISMap(); // 创建地图实例
          var wtl_tileInfo = new TileInfo(tileInfoTemp);
          // let webTileMap = new WebTileLayer("http://112.64.170.158:8098/Service1.svc/Rest/GMService/{col}/{row}/{level}/1", {tileInfo: wtl_tileInfo});
          let webTileMap = new WebTileLayer(urlClass.amap, {
            tileInfo: wtl_tileInfo,
          });

          map.add(webTileMap);
          var dynamicMapServiceLayer = new MapImageLayer(urlClass.appMapUrl);
          map.add(dynamicMapServiceLayer);
          var timestamp = Date.parse(new Date());
          var timer = this.getTime(timestamp);

          /**
           *todo图例
           */
          var initExtent = new Extent(global.initExtent.minX, global.initExtent.minY, global.initExtent.maxX, global.initExtent.maxY,
            new SpatialReference({ wkid: global.spatialReference }));
          var view = (this.view = new MapView({
            container: "map",
            map: map,
            extent: initExtent,
            spatialReference: new SpatialReference({ wkid: 102113 }),
          }));
          this.view.ui.components = [];
          this.view.popup.dockEnabled = false;
          this.view.popup.collapseEnabled = false;
          this.view.popup.dockOptions = {
            buttonEnabled: false,
            breakpoint: false,
            position: "bottom-left",
          }; //禁用停靠
          this.view.popup.actions = null;
          var self = this;
          //初始化
          view.when(
            function (e) {
              console.log("LoadMap完成");
              popupLableBg.initPopupEvent(view, "scPopup");
              popupEcharts.initPopupEvent(view, "yxztPopup");

              self.waterworksAttributeLayer = new GraphicsLayer();
              self.pressureLayer = new GraphicsLayer();
              self.trafficLayer = new GraphicsLayer();
              self.dummyLayer = new GraphicsLayer();
              self.mapClickgl = new GraphicsLayer();

              map.add(self.waterworksAttributeLayer);
              map.add(self.pressureLayer);
              map.add(self.trafficLayer);
              map.add(self.dummyLayer);
              map.add(self.mapClickgl);
            },
            function (error) {
              console.log("The view's resources failed to load: ", error);
            }
          );
          view.on("click", function (e) {
            console.log(
              "%c XSJ-[ self.mapClickgl ]->",
              "font-size:13px; background:red; color:#bf2c9f;",
              self.mapClickgl
            );
            var layer = self.mapClickgl;
            Attribute.myIdentify(e, self.view, layer, map);
            Bus.$on("Legend", (res) => {
              if (res.results.length > 0) {
                self.showMap = true;
              }
            });
          });
          view.popup.watch("visible", function (event) {
            if (!event) {
              MyHideInfoWindow(event);
            }
          });
          function MyHideInfoWindow(event) {
            self.mapClickgl.removeAll();
          }
        }
      );
    },
  },

  beforeDestroy() {
    clearTimeout(this.timing);
    this.timing = null;
    this.view = null;
    // plus.screen.lockOrientation("portrait-primary");
  },
};
</script>
<style scoped lang="less">
@import "./warn.less";
@r:1rem /37.5;
.popupBox {
  position: relative;
  background: #242838;
}
.popupTop {
  height: 44 * @r;
  width: 100%;
  box-sizing: border-box;
  padding-left: 10 * @r;
  background: #242838;
  color: #fff;
  position: sticky;
  top: 0px;
  p {
    font-size: 14px;
    float: left;
    line-height: 44 * @r;
    &:nth-child(2) {
      float: right;
      width: 50 * @r;
      height: 100%;
      text-align: center;
      line-height: 44 * @r;
      font-size: 14px;
      color: #8e92a9;
    }
  }
}
.popupContent {
  box-sizing: border-box;
  width: 100%;
  padding: 0 10 * @r;
  background: #171a2a;
  color: #8e92a9;
}
.popupB {
  display: flex;
  border: 1px solid #262a3b;
  border-bottom: none;
  background: #222638;
  p {
    flex: 1;
    height: 40 * @r;
    box-sizing: border-box;
    padding: 0 10 * @r;
    line-height: 40*@r;
    span {
      display: inline-block;
      height: calc(100% - 10px);
      text-align: center;
      line-height: 44 * @r;
      width: 50 * @r;
      color: #2e9bde;
      margin-right: -10 * @r;
    }
    &:nth-child(2) {
      overflow-x: scroll;
     text-align: right;
      font-size: 14px;
      font-weight: bold;
      overflow-x: scroll;
    }
  }
  &:nth-child(even) {
    background: #1c1f2f;
  }
}
.legendControl{
  background: transparent !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  min-height: 100*@r;
  & /deep/ .van-checkbox{
    color: #868A8D;
    background: #000000;
    border: 1px solid #1D3D51;
    box-shadow: 0px 8px 16px 0px #03101B;
    width: 110*@r;
    height: 30*@r;
    display: flex;
    flex-direction: row-reverse;
    margin-top: 12*@r;
    &:nth-child(1){
      &::after{
        display: block;
        content: "";
        height: 22*@r;
        width: 22*@r;
        background: url("../../../static/imag/909@2x.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    &:nth-child(2){
      &::after{
        display: block;
        content: "";
        height: 22*@r;
        width: 22*@r;
        background: url("../../../static/imag/908@2x.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    &:nth-child(3){
      &::after{
        display: block;
        content: "";
        height: 20*@r;
        width: 20*@r;
        background: url("../../../static/imag/9@2x@2x.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  & /deep/ .van-checkbox__label{
    color: #868A8D;
    font-weight: bold;
  }
  & /deep/ .van-checkbox__icon {
    height: 20*@r !important;
    width: 20*@r;
    margin: 0 15*@r;
    .van-icon{
      width: 100%;
      height: 100%;
      border-radius: 0;
      border-color: #242838;
      line-height: 20*@r !important;
      font-size: 16px !important;
    }
  }
  & /deep/ .van-checkbox__icon--checked{
    .van-icon{
      background-color: transparent;
      border-color: #242838;
    }
    .van-icon-success{
      color: #2F63E5;
    }
  }
  // & /deep/ .van-checkbox{
  //   margin-top: 10*@r;
  // }
}
</style>
