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
        <!-- <div class="mainClass" v-show="true"> -->
        <div class="mainClassT">
          <p>{{ msg }}</p>
          <span>{{ currentDate }} &nbsp;<span style="color:#9D5224">{{ currentDateY }}</span></span>
        </div>
        <div class="mainClassB">
          <p>24HRS</p>
          <span>{{ currentTime }}</span>
        </div>
      </div>
      <!-- <div class="legendControl"> -->
      <div class="legendControl" v-show="false">
        <van-checkbox v-model="waterworks" @change="waterwork"
          >水厂</van-checkbox
        >
        <van-checkbox v-model="cPressure" @change="cPressur">压力</van-checkbox>
        <van-checkbox v-model="cFlow" @change="cFlo">水量</van-checkbox>
      </div>
      <img class="mask" src="../../../static/imag/mask.png" alt="" />
      <div id="map" style="width: 100%; height: 100%"></div>
      <sliderMap
        ref="sliderContainer"
        v-if="isSlider"
        class="sliderMap"
      ></sliderMap>
    </div>
    <!-- <div id="legendIcon" v-if="legendIcon" @click="legendClick" ref="legendC">
      <span class="iconfont icontuli"></span>
    </div> -->
    <div class="legend" v-if="legendShows" ref="legends">
      <div
        v-for="(item, index) in rgba"
        :key="index"
      >
      <p :style="{ background: item.color }"></p>
        <span>
          {{ item.num }}
        </span>
      </div>
    </div>
    <div class="legends" v-if="legend">
      <!-- <div class="center"> -->
        <div
          v-for="(item, index) in rgba"
          :key="index">
        <p :style="{ background: item.color }"></p>
          <span>
            {{ item.num }}
          </span>
        </div>
      <!-- </div> -->
    </div>
    <div class="legClick" v-if="leclick" @click="legClick">图例</div>
    <!-- <div class="legClick" v-if="leclick" @click="legClick">图例</div> -->
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
          <p>管道属性</p>
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
                v-if="index == '0'"
                @click="FlowChart"
              ></span>
              <span
                class="iconfont iconquxiantu"
                v-if="index == '1'"
                @click="VelocityChart"
              ></span>
              <span
                class="iconfont iconquxiantu"
                v-if="index == '2'"
                @click="HeadlossChart"
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
import EchatAtt from "./EchatAttr"
export default {
  name: "warn",
  components: {
    sliderMap,
    echartsLine,
    EchatAtt
  },
  data() {
    return {
      showMap:false,
      legendIcon: false, //收起图例
      switchShow: false,
      orientation: 0,
      innerWidthTmp: 0,
      msg: "警报详情",
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
      isSlider: false,
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
      legendShow:false,
      leclick:true,
      timing: null,
      waterworksAttributeLayer: null,
      trafficLayer: null,
      pressureLayer: null,
      mapClickgl:null,
      cPressure: false,
      waterworks: false,
      cFlow: false,
      minTF: false,
      checked: false,
      EchartShow: false,
      EchartA: false,
      currentTime: "00:00:00",
      currentDate:new Date().getDate() + "/" + (new Date().getMonth() + 1),
      currentDateY:new Date().getFullYear(),
      pipeAttrData: [],
      pipeChartData: [],
    };
  },
  mounted() {
    var self = this;
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function(){
	if (window.orientation == 0 || window.orientation == 180) {
    self.legendShows = self.$route.query.legend;
    self.legend = !self.$route.query.legend;
		return '纵向';
	} else if (window.orientation == 90 || window.orientation == -90) {
    if (self.legendShows) {
      self.legendShows = false
    }
    if (self.legend) {
      self.legend = false
    }
		return '横向';
	}
}, false);
    // plus.screen.unlockOrientation();
    this.legendShows = this.$route.query.legend;
    this.legend = !this.$route.query.legend;
    console.log(this.legendShows,this.legend)
    this.msg = this.$route.query.user;
    var timestamp = Date.parse(new Date());
    var timer = this.getTime(timestamp);
    for (var i = 0; i < parameter.length; i++) {
      var route = this.$route.query.index;
      if (parameter[i].id == route) {
        this.wholeParameter = parameter[i];
        switch (route) {
          case "PressureChange":
          case "Pressure":
          case "Demand":
            this.wholeParameter.renderer.classBreakInfos[0].symbol.url = cat1;
            this.wholeParameter.renderer.classBreakInfos[1].symbol.url = cat2;
            this.wholeParameter.renderer.classBreakInfos[2].symbol.url = cat3;
            this.wholeParameter.renderer.classBreakInfos[3].symbol.url = cat4;
            this.wholeParameter.renderer.classBreakInfos[4].symbol.url = cat5;
            break;
          case "HydraulicGrade":
            this.wholeParameter.renderer.classBreakInfos[0].symbol.url = cat1;
            this.wholeParameter.renderer.classBreakInfos[1].symbol.url = cat1;
            this.wholeParameter.renderer.classBreakInfos[2].symbol.url = cat2;
            this.wholeParameter.renderer.classBreakInfos[3].symbol.url = cat3;
            this.wholeParameter.renderer.classBreakInfos[4].symbol.url = cat4;
            this.wholeParameter.renderer.classBreakInfos[5].symbol.url = cat5;
            break;
        }
      }
      if (
        route == "PipeAge" ||
        route == "Age" ||
        route == "Diameter" ||
        route == "Material" ||
        route == "PressureChange" ||
        route == "FlowChangeCount"
      ) {
        // this.wholeParameter = parameter[i]
        this.isSlider = false;
      } else {
        this.isSlider = true;
      }
    }
    this.couponList[0].playField = this.wholeParameter.code;
    this.arcgis();
    var self = this;
    Bus.$on("SliderFLValueTime", (res) => {
      console.log(res);
      this.currentTime = res.label + ":00";
    });
    Bus.$on("SliderFLMin", (res) => {
      console.log(res);
      this.minTF = res;
    });
    Bus.$on("OneMonitorData", (res) => {
      console.log("00000000000000000000", res);
      this.EchartShow = true;
      self.GetOneMonitorData(res);
    });
    // Bus.$on("EchatAttr", (res) => {
    //   this.EchartA = true;
    //   this.$nextTick(()=>{
    //   Bus.$emit("EchatAttrData", res);
    //   console.log('%c XSJ-[ res ]->', 'font-size:13px; background:red; color:#bf2c9f;', res)
    //   })
    // });
    Bus.$on("pipeAttr", (res) => {
      this.pipeAttrData = res;
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
  },
  methods: {
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
    showMapClick() {
      this.showMap = false;
      this.mapClickgl.removeAll();
    },
    showMapClick1() {
      this.EchartA = false;
    },
    legClick(){
      console.log("我点击了图例")
      this.legendShows = this.$route.query.legend;
      this.legend = !this.$route.query.legend;
      this.leclick = false
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
        console.log('%c XSJ-[ pressure ]->', 'font-size:13px; background:red; color:#bf2c9f;', this.cPressure)
        
      }
      if (this.waterworks) {
        this.GetRealTimeData("flow"); //实时流量
        console.log('%c XSJ-[ flow ]->', 'font-size:13px; background:red; color:#bf2c9f;', this.waterworks)
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
    legendClick() {
      if (this.legendIcon) {
        // this.legendShows = !this.legendShows

        console.log(this.$refs.legends.style);
        this.$refs.legends.style.left = "100%";
        this.$refs.legendC.style.right = "10px";
      } else {
        this.legendShows = true;
        console.log(this.$refs.legends.style);

        this.$refs.legends.style.right = "0px";
        // this.$refs.legendC.style.right = "66px"
      }
    },
    hengshuping() {},
    superior() {
      if(this.cPressure || this.cFlow){
            clearTimeout(this.timing);
            this.timing = null;
      }
      //  this.$router.go(-1)
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
          IdentifyTask
        ]) => {
          this.arcgisAPI = {
            SpatialReference: SpatialReference,
            Extent: Extent,
            Slider: Slider,
            Graphic: Graphic,
            GraphicsLayer: GraphicsLayer,
            Point: Point,
            PictureMarkerSymbol: PictureMarkerSymbol,
            SimpleLineSymbol:SimpleLineSymbol,
            Color:Color,
            SimpleMarkerSymbol:SimpleMarkerSymbol,
            IdentifyParameters:IdentifyParameters,
            IdentifyTask:IdentifyTask
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
          // var dynamicMapServiceLayer = new MapImageLayer(
          // "http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sz_BaseMap/MapServer"
          // );
          // map.add(dynamicMapServiceLayer);
          var timestamp = Date.parse(new Date());
          var timer = this.getTime(timestamp);
          // console.log(timer)
          var title = this.wholeParameter.title;
          var url = this.wholeParameter.url;
          var outFields = this.wholeParameter.outFields;
          // console.log(outFields)
          var renderer = this.wholeParameter.renderer;

          /**
           *todo图例
           */
          // console.log(seattleLayer.renderer.classBreakInfos)

          // for(var i = 0;i<color.length;i++){
          //   this.rgb.push(color[i].symbol.color)
          // }
          //   console.log(this.rgb)
          var initExtent = new Extent(global.initExtent.minX, global.initExtent.minY, global.initExtent.maxX, global.initExtent.maxY,
            new SpatialReference({ wkid: global.spatialReference }));
          var view = (this.view = new MapView({
            container: "map",
            map: map,
            extent: initExtent,
            spatialReference: new SpatialReference({ wkid: global.spatialReference }),
          }));
          this.view.ui.components = [];
          this.view.popup.dockEnabled = false;
          this.view.popup.collapseEnabled = false;
          this.view.popup.dockOptions = { buttonEnabled: false, breakpoint: false, position: "bottom-left" };//禁用停靠
          this.view.popup.actions = null;
          var self = this;
          //初始化
          view.when(
            function (e) {
              console.log("LoadMap完成");
              popupLableBg.initPopupEvent(view, "scPopup");
              popupEcharts.initPopupEvent(view, "yxztPopup");
              var seattleLayer = new FeatureLayer({
                title: title,
                url: url,
                outFields: outFields,
                renderer: renderer,
                // definitionExpression: whereMy,
                minScale: 0,
                maxScale: 0,
                opacity: 1,
              });
              console.log(outFields)
              console.log(renderer)
              self.seattleLayer = seattleLayer;
              // console.log(seattleLayer)
              map.add(seattleLayer);
              self.obj = seattleLayer;
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
              var color = [];
              var arr = [];
              var route = self.$route.query.index;
              if (route == "Material") {
                color = seattleLayer.renderer.uniqueValueInfos;
                for (var i = 0; i < color.length; i++) {
                  var rgb = color[i].symbol.color;
                  var num = color[i].value;
                  arr.push(Object.assign({ color: rgb }, { num: num }));
                }
              } else if (route == "SupplyArea") {
                color = seattleLayer.renderer.uniqueValueInfos;
                for (var i = 0; i < color.length; i++) {
                  var rgb = color[i].symbol.color;
                  var num = color[i].lable;
                  arr.push(Object.assign({ color: rgb }, { num: num }));
                }
              } else {
                color = seattleLayer.renderer.classBreakInfos;
                for (var i = 0; i < color.length; i++) {
                  var rgb = color[i].symbol.color;
                  var num = "";
                  num = color[i].lable;
                  arr.push(Object.assign({ color: rgb }, { num: num }));
                }
              }

              self.rgba = arr;
              console.log(self.rgba);
              var routea = self.$route.query.index;
              // console.log(routea)//PipeAge
              if (
                routea == "PipeAge" ||
                routea == "Age" ||
                routea == "Diameter" ||
                routea == "Material" ||
                routea == "PressureChange" ||
                routea == "FlowChangeCount"
              ) {
              } else {
                self.initSlider();
              }
            },
            function (error) {
              console.log("The view's resources failed to load: ", error);
            }
          );
          view.on("click", function (e) {
            console.log('%c XSJ-[ self.mapClickgl ]->', 'font-size:13px; background:red; color:#bf2c9f;', self.mapClickgl)
            var layer = self.mapClickgl;
            Attribute.myIdentify(e,self.view,layer,map);
            Bus.$on("Legend", (res) => {
              console.log(res);
              if (res.results.length > 0) {
                 self.showMap = true;
              }else{
                self.leclick = true
                self.legend = false
                self.legendShows = false
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
    initSlider() {
      //初始化加载'
      var obj = {
        esriAPI: this.arcgisAPI,
        view: this.view,
        seattleLayer: this.seattleLayer,
        couponList: this.couponList,
        couponSelected: this.couponList[0].code,
        selItem: this.couponList[0],
      };
      this.$refs.sliderContainer.initSlider(obj);
    },
  },

  beforeDestroy() {
    console.log(11111)
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
    display: flex;
    align-items: center;
    span {
      display: block;
      height: 100%;
      text-align: center;
      line-height: 44 * @r;
      width: 50 * @r;
      color: #2e9bde;
      margin-right: -10 * @r;
    }
    &:nth-child(2) {
      justify-content: flex-end;
      font-size: 15px;
      font-weight: bold;
    }
  }
  &:nth-child(even) {
    background: #1c1f2f;
  }
}
</style>
