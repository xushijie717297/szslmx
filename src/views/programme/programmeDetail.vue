<template>
  <div class="programmeDetail">
    <p id="statusBar"></p>
    <van-nav-bar
      title="方案信息"
      :border="false"
      left-text="返回"
      left-arrow
      @click-right="onClickRight"
      @click-left="onClickLeft"
    >
      <template #right>
        <img src="../../../static/imag/map.png" alt="" />
      </template>
    </van-nav-bar>
    <van-popup
      v-model="showMap"
      closeable
      position="bottom"
      :style="{ height: '93%' }"
      class="mapView"
    >
      <div id="mapView" style="width: 100%; height: 100%">
        <p @click="legend()">
          <span class="iconfont icontuli"></span>
        </p>
        <van-popup
          v-model="legendSF"
          position="right"
          :style="{ width: '66%', height: '100%' }"
          id="legendSF"
          get-container=".programmeDetail"
        >
          <p class="statusBar"></p>
          <h4>基础图例</h4>
          <div class="imgList">
            <div v-for="(item, index) in BasicsLegendImg" :key="index">
              <img :src="item.url" alt="" />
              <p>{{ item.name }}</p>
            </div>
          </div>
        </van-popup>
      </div>
    </van-popup>
    <div class="detail" v-if="detailSF">
      <van-collapse v-model="activeNames">
        <van-collapse-item title="方案信息" name="1" :border="false">
          <div class="programmeNew">
            <div class="title">
              {{ result.PlanName }}
            </div>
            <div class="type">
              <p>方案类型&nbsp;：</p>
              <span>{{ result.PlanType_Name }}</span>
            </div>
            <div class="bj">
              <p>
                方案背景&nbsp;：
                <span>时间&nbsp;：{{ result.CreationTime }}</span>
                <span>水量&nbsp;：{{ result.Demand }}m³/h</span>
              </p>
            </div>
            <div class="describe">
              <p>描述&nbsp;：</p>
              <span>
                {{ result.PlanDescribe | textHidden }}
              </span>
            </div>
          </div>
        </van-collapse-item>
        <van-collapse-item
          class="two"
          title="需调整的设备列表"
          name="2"
          :border="false"
        >
          <div class="equipmentList" v-show="resultData.listData.length > 0">
            <div
              class="equipmentListC"
              v-for="(item, index) in resultData.listData"
              :key="index"
            >
              <p>{{ item.type }}ID{{ item.ElementId }}</p>
              <div class="changeType">
                <p v-for="(itemC, index) in item.ChangeData" :key="index">
                  <span
                    >{{ itemC.label }}&nbsp;{{ itemC.originalData }}&nbsp;{{
                      itemC.isAdd | typeData
                    }}&nbsp;{{ itemC.changeData }}</span
                  >
                </p>
              </div>
            </div>
          </div>
          <zusj v-show="resultData.listData.length == 0"></zusj>
        </van-collapse-item>
        <van-collapse-item
          class="three"
          title="方案模拟结果列表"
          name="3"
          :border="false"
        >
          <div class="resultList">
            <div
              v-for="(item, index) in resultData.planResultData"
              :key="index"
              v-show="resultData.planResultData.length > 0"
            >
              <img :src="item.ImageSrc" alt="" @click="getImg(item.ImageSrc)" />
              <div class="right">
                <p>
                  类型：<span>{{ item.Type }}</span>
                </p>
                <p>
                  描述：<span v-if="item.show">{{
                    item.ResultDescribe | textHidden2
                  }}</span>
                  <span v-show="!item.show">{{ item.ResultDescribe }}</span>
                  <span
                    v-show="item.ResultDescribe.length > '24' && item.show"
                    class="ckgd"
                    @click="lookMore(item, index)"
                    >{{ testSf }}</span
                  >
                  <span
                    v-show="!item.show"
                    class="shouqi"
                    @click="close(item, index)"
                    >收起</span
                  >
                </p>
              </div>
            </div>
          </div>
          <zusj v-show="resultData.planResultData.length == 0"></zusj>
        </van-collapse-item>
        <van-collapse-item
          class="four"
          title="方案模拟结果"
          name="4"
          :border="false"
        >
          <div class="evaluate">
            <zusj></zusj>
          </div>
        </van-collapse-item>
        <van-collapse-item
          class="five"
          title="方案关注监测点列表"
          name="5"
          :border="false"
        >
          <div
            class="monitorList"
            v-show="resultData.monitorResultData.length > 0"
          >
            <div class="Header">
              <p v-for="(item, index) in Header" :key="index">{{ item }}</p>
            </div>
            <div
              class="HeaderList"
              v-for="(item, index) in resultData.monitorResultData"
              :key="index"
            >
              <p>{{ item.Label }}</p>
              <p>{{ item.Type }}</p>
              <p>{{ item.CalValue }}</p>
              <p>{{ item.ActualValue }}</p>
            </div>
          </div>
          <zusj v-show="resultData.monitorResultData.length == 0"></zusj>
        </van-collapse-item>
        <van-collapse-item
          class="six"
          title="方案评估"
          name="6"
          :border="false"
        >
          <div class="assessment">
            <div class="assessmentTop">方案结果评估</div>
            <div class="content">
              <p>{{ result.AssessData | textHidden1 }}</p>
            </div>
            <div class="TF">
              <p>评价&nbsp;：</p>
              <span :class="result.PlanGradeName == '准确' ? 'green' : 'red'">{{
                result.PlanGradeName
              }}</span>
            </div>
            <div class="fill"></div>
          </div>
        </van-collapse-item>
      </van-collapse>
      <div class="legend"></div>
    </div>
    <van-popup
      v-model="PopupS"
      :close-on-click-overlay="false"
      get-container=".programmeDetail"
    >
      <van-loading size="18" type="spinner" color="#1989fa" />
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
      v-model="showMap1"
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
import Vue from "vue";
import redIcon from ".././../../static/imag/redIcon.png";
import orangeIcon from "../../../static/imag/orangeIcon.png";
import greenIcon from "../../../static/imag/greenIcon.png";

import { loadModules } from "esri-loader";
import tileInfo from "../../components/arcgisforjsTest/tdt_data.js";
import global from "../../components/js/Global";
import drawClass from "../../components/arcgisforjsTest/DrawClass";
import drawClassPipeBurst from "../../components/js/DrawClassPipeBurst";
import drawTool from "../../components/js/DrawTool";
import urlClass from "../../components/js/UrlClass";
import EchatAtt from "../warn/EchatAttr";
import Attribute from "../../components/js/Attribute";

import zusj from "./zusj";
import Bus from "../../utils/Bus";
import {
  NavBar,
  Icon,
  Collapse,
  CollapseItem,
  Notify,
  Popup,
  Loading,
  ImagePreview,
} from "vant";
import Zusj from "./zusj.vue";

Vue.use(Loading);
Vue.use(Popup);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Icon);
Vue.use(NavBar);
export default {
  name: "programmeDetail",
  components: {
    zusj,
    EchatAtt,
  },
  filters: {
    textHidden: function (value) {
      let text = value;
      if (value.length == 0) {
        text = "描述暂无";
      }
      return text;
    },
    textHidden1: function (value) {
      let text = value;
      if (value == null) {
        text = "暂无评估...";
      }
      return text;
    },
    textHidden2: function (value) {
      let text = value;
      if (value.length > "24") {
        text = value.substring(0, 24) + "......";
      }
      return text;
    },
    typeData: function (value) {
      //6 阀门
      //7 节点
      //8 管道
      //11 添加的管道
      //14 添加的管道11
      //15 添加的节点12
      //16 添加的阀门13
      //20 添加的节点8
      //22 添加的节点8
      var text = "";
      if (value) {
        text = "为";
      } else {
        text = "变为";
      }
      return text;
    },
  },
  data() {
    return {
      showMap1: false,
      EchartA: false,
      images: [],
      legendSF: false, //图例显隐
      ckgd: false, //查看更多
      testSf: "查看更多",
      PopupS: true,
      detailSF: false,
      showMap: false,
      activeNames: ["1"], //控制折叠
      resultData: null,
      listData: [],
      deletePipeList: [],
      AllElementsList: [],
      addList: [],
      bgListData: [], //割接管道信息
      pwkData: [], //排污口列表信息
      fmData: [], //关闭阀门列表
      ListPipe: [], //管道列表
      OutList: [], //停水范围
      userData: [], //停水用户信息
      addNumber: "",
      waterStopRangeTtemp: {},
      result: null,
      text: "",
      text1: "",
      equipmentList: [],
      resultList: [],
      Header: ["名称", "类型", "模拟变化值", "实际变化值"],
      HeaderData: [],
      planTime: "",
      time: "",
      view: null,
      view1: null,
      arcgisAPI: null,
      hide_junc_T: null,
      hide_junc_fm: null,
      hide_junc: null,
      deletedline: null,
      displayline: null,
      planElementChangeLayer: null,
      pipeBurstPositionLayer: null,
      pwkPositionLayer: null,
      pipeBurstCloseValveLayer: null,
      mapClickgl: null,
      BasicsLegendImg: [
        {
          name: "水泵机组",
          url: require("../../../static/imag/PipeBurst/pump_icon.png"),
        },
        {
          name: "水池水箱",
          url: require("../../../static/imag/PipeBurst/tank_icon.png"),
        },
        {
          name: "消火栓",
          url: require("../../../static/imag/PipeBurst/hydrant_icon.png"),
        },
        {
          name: "止回阀",
          url: require("../../../static/imag/PipeBurst/cv.png"),
        },
        {
          name: "流量阀",
          url: require("../../../static/imag/PipeBurst/fcv.png"),
        },
        {
          name: "减压阀",
          url: require("../../../static/imag/PipeBurst/prv.png"),
        },
        {
          name: "阀门",
          url: require("../../../static/imag/PipeBurst/valve_icon.png"),
        },
        {
          name: "全关阀门",
          url: require("../../../static/imag/PipeBurst/valve_closed.png"),
        },
        {
          name: "半开阀门",
          url: require("../../../static/imag/PipeBurst/valve_partclosed.png"),
        },
        {
          name: "节点",
          url: require("../../../static/imag/PipeBurst/junction_icon.png"),
        },
        {
          name: "因开阀而通水管道",
          url: require("../../../static/imag/PipeBurst/pipe_kfts.png"),
        },
        {
          name: "供水管道",
          url: require("../../../static/imag/PipeBurst/pipe_icon.png"),
        },
        {
          name: "停水管道",
          url: require("../../../static/imag/PipeBurst/pipe_ts.png"),
        },
        {
          name: "需打开阀门",
          url: require("../../../static/imag/PipeBurst/openvalve.png"),
        },
        {
          name: "需关闭阀门",
          url: require("../../../static/imag/PipeBurst/closevalve.png"),
        },
        {
          name: "需关闭但已关闭阀门",
          url: require("../../../static/imag/PipeBurst/closedvalve.png"),
        },
        {
          name: "止回阀",
          url: require("../../../static/imag/PipeBurst/checkvalve.png"),
        },
      ],
      pipeAttrData: [],
      pipeChartData: [],
    };
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
      this.showMap1 = false;
      this.mapClickgl.removeAll();
    },
    showMapClick1() {
      this.EchartA = false;
    },
    getImg(ImageSrc) {
      var img = this.images;
      for (let i = 0; i < img.length; i++) {
        const element = img[i];
        if (element == ImageSrc) {
          ImagePreview({
            images: img,
            showIndex: true,
            loop: false,
            startPosition: i,
            closeOnPopstate: true, //首先加上这个属性：是否在页面回退时自动关闭，设置为true
          });
          break;
        }
      }
    },
    legend() {
      //图例展示
      this.legendSF = !this.legendSF;
      console.log(this.legendSF);
    },
    lookMore(item, index) {
      item.show = !item.show;
      if (item.show) {
        this.testSf = "查看更多";
      }
      this.$forceUpdate();
    },
    close(item, index) {
      item.show = !item.show;
      this.$forceUpdate();
    },
    onClickLeft() {
      //   this.$router.go(-1);
      this.$router.push("/programme");
    },
    onClickRight() {
      this.showMap = true;
      if (this.showMap) {
        this.createMap();
      }
    },
    deepClone(obj) {
      let result = typeof obj.splice === "function" ? [] : {};
      if (obj && typeof obj === "object") {
        for (let key in obj) {
          if (obj[key] && typeof obj[key] === "object") {
            result[key] = this.deepClone(obj[key]); //如果对象的属性值为object的时候，递归调用deepClone,即在吧某个值对象复制一份到新的对象的对应值中。
          } else {
            result[key] = obj[key]; //如果对象的属性值不为object的时候，直接复制参数对象的每一个键值到新的对象对应的键值对中。
          }
        }
        return result;
      }
      return obj;
    },
    OnePlanDataInit(data) {
      console.log(data);
      // debugger
      console.log("OnePlanDataInit");
      var drawType = "";
      var isSelectDemand = false;
      var isSelectPressure = false;
      var pressureMonitorList = [];
      var demandMonitorList = [];
      this.planElementChangeLayer.removeAll();
      var changeElementList = data;
      if (changeElementList.length != 0)
        var allElementChangeData = changeElementList.slice(0);
      console.log("OnePlanDataInit", allElementChangeData);
      var redPin = new Object();
      redPin = {
        url: redIcon,
        width: 20,
        height: 41,
        xoffset: 0,
        yoffset: 17,
        angle: 0,
        color: "",
      };
      var pt;
      for (var i = 0; i < changeElementList.length; i++) {
        var obj = changeElementList[i].point;
        if (obj) {
          if (
            String(changeElementList[i].LayerId) !=
              String(global.layerId.EN_DEL_PIPE) &&
            String(changeElementList[i].LayerId) !=
              String(global.layerId.EN_ADD_PIPE) &&
            String(changeElementList[i].LayerId) !=
              String(global.layerId.EN_ADD_NODE) &&
            String(changeElementList[i].LayerId) !=
              String(global.layerId.EN_ADD_VALVE) &&
            String(changeElementList[i].LayerId) !=
              String(global.layerId.EN_ADD_TANK) &&
            String(changeElementList[i].LayerId) !=
              String(global.layerId.EN_ADD_VALVE_O) &&
            String(changeElementList[i].LayerId) !=
              String(global.layerId.EN_ADD_TANK_O) &&
            String(changeElementList[i].LayerId) !=
              String(global.layerId.EN_ADD_PIPE_O) &&
            String(changeElementList[i].LayerId) !=
              String(global.layerId.EN_ADD_NODE_O)
          ) {
            var point = this.arcgisAPI.Point(
              obj.x,
              obj.y,
              new this.arcgisAPI.SpatialReference({
                wkid: global.spatialReference,
              })
            );
            var gra1 = drawClass.CreatePictureGraphic(redPin, point);
            // gra1.id="SearchPosition";
            this.planElementChangeLayer.add(gra1);
            pt = point;
          } else if (
            String(changeElementList[i].LayerId) ==
              String(global.layerId.EN_ADD_PIPE) ||
            String(changeElementList[i].LayerId) ==
              String(global.layerId.EN_ADD_NODE) ||
            String(changeElementList[i].LayerId) ==
              String(global.layerId.EN_ADD_VALVE) ||
            String(changeElementList[i].LayerId) ==
              String(global.layerId.EN_ADD_TANK)
          ) {
            var point = this.arcgisAPI.Point(
              changeElementList[i].X,
              changeElementList[i].Y,
              new this.arcgisAPI.SpatialReference({
                wkid: global.spatialReference,
              })
            );
            var gra1 = drawClass.CreatePictureGraphic(redPin, point);
            // gra1.id="SearchPosition";
            this.planElementChangeLayer.add(gra1);
            pt = point;
          }
        }
      }
      this.view.center = pt;
    },
    OnePlanDataInitDrawLocation(bgListData, pwkData) {
      // debugger
      console.log(bgListData, pwkData);
      var orangePin = new Object();
      orangePin = {
        url: orangeIcon,
        width: 20,
        height: 41,
        xoffset: 0,
        yoffset: 17,
        angle: 0,
        color: "",
      };
      var greenPin = new Object();
      greenPin = {
        url: greenIcon,
        width: 20,
        height: 41,
        xoffset: 0,
        yoffset: 17,
        angle: 0,
        color: "",
      };
      this.InitDrawLocation(bgListData, this.pipeBurstPositionLayer, orangePin);
      this.InitDrawLocation(pwkData, this.pwkPositionLayer, greenPin);
    },
    InitDrawLocation(tempDrawData, layer, sym = PictureProperty.redPin) {
      console.log("橘色绿色点");
      for (let i = 0; i < tempDrawData.length; i++) {
        const item = tempDrawData[i];
        if (item.X && item.Y) {
          var point = this.arcgisAPI.Point(
            item.X,
            item.Y,
            new this.arcgisAPI.SpatialReference({
              wkid: global.spatialReference,
            })
          );
          var gra = drawClass.CreatePictureGraphic(sym, point);
          gra.attributes = item;
          layer.add(gra);
        }
      }
    },
    PipeBurstCloseValveDrawTool(data) {
      // debugger
      console.log(data);
      this.pipeBurstCloseValveLayer.removeAll();
      var drawData = data;
      console.log("PipeBurstCloseValveDrawTool", drawData);
      console.log(drawData.OutNodeCoordinateList);
      if (drawData.OutNodeCoordinateList) {
        for (var i = 0; i < drawData.OutNodeCoordinateList.length; i++) {
          var objTemp = drawData.OutNodeCoordinateList[i];
          console.log(objTemp);
          // debugger
          drawClassPipeBurst.DrawPolygon(
            objTemp.ListX,
            objTemp.ListY,
            this.pipeBurstCloseValveLayer
          );
        }
      } else {
        drawClassPipeBurst.DrawPolygon(
          drawData.ListX,
          drawData.ListY,
          this.pipeBurstCloseValveLayer
        );
      }
      drawClassPipeBurst.DrawCloseValve(
        drawData,
        this.pipeBurstCloseValveLayer
      );
      var burstPipeValveData = Object.assign({}, drawData);
      console.log("dingwei");
      //地图绘制结果数据自适应范围缩放
      drawClass.MapResultDataRangeZoom(
        [this.pipeBurstCloseValveLayer],
        this.view
      );
      // if (this.view1.zoom > -1) {
      //     drawClass.MapResultDataRangeZoom([this.pipeBurstCloseValveLayer], this.view1);
      // }
    },
    InitAddElementDraw(addNodeList, addPipeList, AddNodelists, AddPipelists) {
      this.listData = [];
      this.deletePipeList = [];
      var fmNumberTemp = -1,
        nodeNumberTemp = -1,
        pipeNumberTemp = -1,
        tankNumberTemp = -1;
      for (var i = 0; i < this.AllElementsList.length; i++) {
        var obj = this.AllElementsList[i];
        console.log(obj);
        if (String(obj.LayerId) != String(global.layerId.EN_DEL_PIPE)) {
          this.listData.push(obj);
        } else {
          this.deletePipeList.push(obj);
        }
        if (
          String(obj.LayerId) == String(global.layerId.EN_ADD_PIPE) ||
          String(obj.LayerId) == String(global.layerId.EN_ADD_PIPE_O)
        ) {
          var str = obj.ElementId.split("Q");
          addPipeList.push(str[1]);
          AddPipelists.push(obj);
          pipeNumberTemp++;
        }
        if (
          String(obj.LayerId) == String(global.layerId.EN_ADD_NODE_O) ||
          String(obj.LayerId) == String(global.layerId.EN_ADD_NODE)
        ) {
          var str = obj.ElementId.split("J");
          addNodeList.push(str[1]);
          AddNodelists.push(obj);
          nodeNumberTemp++;
        }
        if (
          String(obj.LayerId) == String(global.layerId.EN_ADD_VALVE_O) ||
          String(obj.LayerId) == String(global.layerId.EN_ADD_VALVE)
        ) {
          var str = obj.ElementId.split("F");
          addNodeList.push(str[1]);
          AddNodelists.push(obj);
          fmNumberTemp++;
        }
        if (
          String(obj.LayerId) == String(global.layerId.EN_ADD_TANK_O) ||
          String(obj.LayerId) == String(global.layerId.EN_ADD_TANK)
        ) {
          var str = obj.ElementId.split("T");
          addNodeList.push(str[1]);
          AddNodelists.push(obj);
          tankNumberTemp++;
        }
      }
      for (var i = 0; i < this.listData; i++) {
        var obj = Object.assign({}, this.listData[i].point);

        var object = new Object();
        object.x = obj.X;
        object.y = obj.Y;
        this.listData[i].point = new Object();
        this.listData[i].point = object;
      }
      this.addList = {
        nodeList: AddNodelists,
        pipeList: AddPipelists,
      };
      console.log("addList", this.addList);
      var objTemp = {
        fmNumber: fmNumberTemp,
        nodeNumber: nodeNumberTemp,
        pipeNumber: pipeNumberTemp,
      };
      return objTemp;
    },
    DrawToolInitNumber(data) {
      var data = data;
      drawTool.InitNumber(
        Number(data.fmNumber),
        Number(data.nodeNumber),
        Number(data.pipeNumber)
      );
    },
    DrawAddElement(data) {
      var data = data;
      console.log("DrawAddElement", data);
      this.drawToolGraphicsLayer.removeAll();
      var allElementChangeData = [];
      for (var i = 0; i < data.nodeList.length; i++) {
        if (String(data.nodeList[i].ChangeData) != "undefined") {
          if (data.nodeList[i].ChangeData.length != 0) {
            allElementChangeData.push(data.nodeList[i]);
          }
        }
      }
      for (var i = 0; i < data.pipeList.length; i++) {
        if (String(data.pipeList[i].ChangeData) != "undefined") {
          if (data.pipeList[i].ChangeData.length != 0) {
            allElementChangeData.push(data.pipeList[i]);
          }
        }
      }
      drawTool.InitDraw(
        data.nodeList,
        data.pipeList,
        this.drawToolGraphicsLayer,
        this.hide_junc_fm,
        this.hide_junc,
        this.hide_junc_T
      );
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
          "esri/tasks/QueryTask",
          "esri/tasks/support/IdentifyParameters",
          "esri/tasks/IdentifyTask",
          "esri/geometry/Point",
          "esri/layers/GraphicsLayer",
          "esri/geometry/Polyline",
          "esri/symbols/PictureMarkerSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/Color",
          "esri/widgets/Sketch/SketchViewModel",
          "esri/tasks/support/query",
          "esri/symbols/SimpleMarkerSymbol",
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
          QueryTask,
          IdentifyParameters,
          IdentifyTask,
          Point,
          GraphicsLayer,
          Polyline,
          PictureMarkerSymbol,
          SimpleLineSymbol,
          Color,
          SketchViewModel,
          Query,
          SimpleMarkerSymbol,
          geometryEngine,
        ]) => {
          this.arcgisAPI = {
            SpatialReference: SpatialReference,
            Extent: Extent,
            Point: Point,
            GraphicsLayer: GraphicsLayer,
            Graphic: Graphic,
            Polyline: Polyline,
            Polygon: Polygon,
            PictureMarkerSymbol: PictureMarkerSymbol,
            SimpleLineSymbol: SimpleLineSymbol,
            SimpleFillSymbol: SimpleFillSymbol,
            Color: Color,
            SketchViewModel: SketchViewModel,
            Query: Query,
            SimpleMarkerSymbol: SimpleMarkerSymbol,
            geometryEngine: geometryEngine,
            IdentifyTask: IdentifyTask,
            IdentifyParameters: IdentifyParameters,
          };
          this.arcgisView = { MapView: MapView };
          this.arcgisExtent = { Extent: Extent };
          drawClass.setArcgisforAPI(this.arcgisAPI);
          drawClassPipeBurst.setArcgisforAPI(this.arcgisAPI);
          drawTool.setArcgisforAPI(this.arcgisAPI);
          Attribute.setArcgisforAPI(this.arcgisAPI);
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
          this.planElementChangeLayer = new GraphicsLayer();
          this.pwkPositionLayer = new GraphicsLayer();
          this.pipeBurstPositionLayer = new GraphicsLayer();
          this.pipeBurstCloseValveLayer = new GraphicsLayer();
          this.drawToolGraphicsLayer = new GraphicsLayer();
          this.mapClickgl = new GraphicsLayer();

          // this.pipeBurstNodeLayer = new GraphicsLayer();
          // this.strengthLayer = new GraphicsLayer();
          // this.drawSymbol = new GraphicsLayer();

          map.add(this.planElementChangeLayer);
          map.add(this.pipeBurstCloseValveLayer);
          map.add(this.drawToolGraphicsLayer);
          map.add(this.pwkPositionLayer);
          map.add(this.pipeBurstPositionLayer);
          map.add(this.mapClickgl);
          // map.add(this.pipeBurstNodeLayer);
          // map.add(this.strengthLayer);
          // map.add(this.drawSymbol);=
          var self = this;
          var initExtent = new Extent(global.initExtent.minX, global.initExtent.minY, global.initExtent.maxX, global.initExtent.maxY,
            new SpatialReference({ wkid: global.spatialReference }));
          var view = (this.view = new MapView({
            container: "mapView",
            map: map,
            extent: initExtent,
            spatialReference: new SpatialReference({ wkid: global.spatialReference }),
          }));
          //   var view1 = (this.view1 = new MapView({
          //   container: "mapView",
          //   map: map,
          //   extent: new Extent(
          //     91018.9439,
          //     7611.9801,
          //     142976.5999,
          //     34599.534,
          //     new SpatialReference({ wkid: 102113 })
          //   ),
          //   spatialReference: new SpatialReference({ wkid: 102113 }),
          // }));
          //初始化
          this.view.ui._removeComponents(["attribution", "zoom"]);
          this.view.popup.dockEnabled = false;
          this.view.popup.collapseEnabled = false;
          this.view.popup.dockOptions = { buttonEnabled: false, breakpoint: false, position: "bottom-left" };//禁用停靠
          this.view.popup.actions = null;
          view.on("click", function (e) {
            console.log(
              "%c XSJ-[ self.mapClickgl ]->",
              "font-size:13px; background:red; color:#bf2c9f;",
              self.mapClickgl
            );
            var layer = self.mapClickgl;
            Attribute.myIdentify(e, self.view, layer, map);
            Bus.$on("Legend", (res) => {
              console.log(res);
              if (res.results.length > 0) {
                 self.showMap1 = true;
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
          view.when(
            function (e) {
              console.log("LoadMap完成");
              self.hide_junc_fm = new self.arcgisAPI.SimpleMarkerSymbol({
                size: 10,
                color: new self.arcgisAPI.Color("#A80084"),
              });
              self.hide_junc_T = new self.arcgisAPI.SimpleMarkerSymbol({
                size: 10,
                color: new self.arcgisAPI.Color("#ffff00"),
              });
              self.hide_junc = new self.arcgisAPI.SimpleMarkerSymbol({
                size: 10,
                color: new self.arcgisAPI.Color("#ff0000"),
              });
              self.deletedline = new self.arcgisAPI.SimpleLineSymbol({
                width: 5,
                color: new self.arcgisAPI.Color("#fffce5"),
                cap: "round",
              });
              self.displayline = new self.arcgisAPI.SimpleLineSymbol({
                width: 5,
                color: new self.arcgisAPI.Color("#ab0d0d"),
                cap: "round",
              });
              self.OnePlanDataInit(self.listData);
              self.OnePlanDataInitDrawLocation(self.bgListData, self.pwkData);
              console.log("waterStopRangeTtemp", self.waterStopRangeTtemp);
              self.PipeBurstCloseValveDrawTool(self.waterStopRangeTtemp);
              var addNodeList = new Array();
              var addPipeList = new Array();
              var AddNodelists = new Array();
              var AddPipelists = new Array();
              self.addNumber = self.InitAddElementDraw(
                addNodeList,
                addPipeList,
                AddNodelists,
                AddPipelists
              );
              self.DrawToolInitNumber(self.addNumber);
              console.log(self.addNumber);
              if (self.addList != "") {
                if (
                  self.addList.nodeList.length != 0 ||
                  self.addList.pipeList.length != 0
                ) {
                  self.DrawAddElement(self.addList);
                }
              }

              console.log("执行", view);
            },
            function (error) {
              console.log("The view's resources failed to load: ", error);
            }
          );
        }
      );
    },
  },
  created() {},
  mounted() {
    // debugger
    console.log(this.PopupS);
    this.result = this.$route.query.programmeData;
    // console.log(this.result);
    var programmeData = this.$route.query.programmeData;
    console.log(programmeData);
    this.PopupS = true;
    this.api.GetProgramme.GetOnePlanInfo(programmeData).then((res) => {
      this.detailSF = true;
      this.PopupS = false;
      console.log(res);
      var result = res;
      if (result && String(result.Code) == "0") {
        var obj = new Object();
        var planInfo = Object.assign({}, result.Response);
        obj.listData = planInfo.PlanItemList
          ? planInfo.PlanItemList.slice(0)
          : [];
        obj.planResultData = planInfo.ImageLists.slice(0);
        obj.monitorResultData = planInfo.MonitorList.slice(0);
        obj.planId = planInfo.PlanID;
        obj.planName = planInfo.PlanName;
        obj.PlanTypeScreenValue = String(Number(planInfo.PlanTypeID) - 1);
        obj.planDescribe = planInfo.PlanDescribe;
        obj.planEvaluateRadio = planInfo.PlanGrade;
        obj.ArchiveTF = planInfo.ArchiveTF;
        obj.planTime = planInfo.Time;
        obj.planDemand = planInfo.Demand;
        obj.planEvaluate = planInfo.AssessData;
        obj.planResult = planInfo.PlanResult;
        obj.PlanPipeList = planInfo.PlanPipeList; //割接管道信息
        obj.PlanCloseValvelist = planInfo.PlanCloseValvelist; //关闭阀门列表
        obj.PlanOpenValvelist = planInfo.PlanOpenValvelist; //开阀阀门列表
        obj.PlanStopWaterUser = planInfo.PlanStopWaterUser; //停水用户信息
        obj.PlanUnloadingList = planInfo.PlanUnloadingList; //排污口列表信息
        obj.PlanUnloadingInfo = planInfo.PlanUnloadingInfo; //排污信息
        obj.OutList = planInfo.OutList; //停水范围信息
        obj.ListPipe = planInfo.ListPipe;
        obj.StopWaterPipeIds = planInfo.StopWaterPipeIds;
        console.log("obj", obj);
        var result = this.deepClone(obj);
        this.AllElementsList = result.listData.slice(0);
        for (var i = 0; i < result.listData.length; i++) {
          let arr = result.listData[i];
          if (String(arr.LayerId) != String(global.layerId.EN_DEL_PIPE)) {
            this.listData.push(arr);
          }
        }
        if (result.PlanCloseValvelist && result.PlanCloseValvelist[0]) {
          // debugger
          console.log(result.PlanCloseValvelist[0]);
          var PlanCloseValvelists = result.PlanCloseValvelist[0];
          for (let v = 0; v < PlanCloseValvelists.length; v++) {
            const itemTemp = PlanCloseValvelists[v];
            itemTemp.IsFailure = itemTemp.IsFailure == "0" ? false : true;
            itemTemp.IsCal = itemTemp.IsCal == "0" ? false : true;
            this.fmData.push(itemTemp);
          }
        }
        console.log(this.fmData);
        this.userData = [];
        if (result.PlanStopWaterUser) {
          this.userData = result.PlanStopWaterUser;
        }
        console.log("outlist", result.OutList);
        this.OutList = result.OutList == null ? [] : result.OutList[0];
        this.ListPipe = result.ListPipe == null ? [] : result.ListPipe[0];
        this.waterStopRangeTtemp = {
          ListPipe: this.ListPipe,
          ListValve: this.fmData,
          ListUser: this.userData,
          CloseValvesList: [],
          TitleArr: [],
          ClosedCheckValvesData: [],
          OpenValvesList: [],
          ListReleasedPipes: [],
          ListX: [],
          ListY: [],
          OutNodeCoordinateList: this.OutList,
          HydrantList: [],
        };
        if (result.PlanPipeList) {
          this.bgListData = result.PlanPipeList;
        }
        if (result.PlanPipeList) {
          for (let j = 0; j < result.PlanPipeList.length; j++) {
            const item = result.PlanPipeList[j];
            this.pwkData.push(Object.assign({}, item));
          }
        }
        console.log("pwkData", this.pwkData);
        console.log("bgListData", this.bgListData);
        for (let i = 0; i < obj.listData.length; i++) {
          var index = obj.listData[i];
          if (index.ChangeData.length == 0) {
            obj.listData.splice(i, 1);
          }
        }
        console.log(obj.listData);
        this.resultData = obj;
        this.resultData.planResultData.forEach((item) => {
          item.show = true;
        });
        console.log(this.resultData.planResultData);
        for (let k = 0; k < this.resultData.planResultData.length; k++) {
          this.images.push(this.resultData.planResultData[k].ImageSrc);
        }
      } else {
        console.log("错误信息:", result.Message);
      }
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
  beforeDestroy() {
    if (this.view) {
      console.log("jinlai");
      // destroy the map view
      this.view.container = null;
      // this.view = null;
    }
  },
};
</script>
<style scoped lang="less">
@import "./programmeDetail.less";
@r: 1rem/37.5;
.programmeDetail /deep/ .van-popup {
  background-color: transparent !important;
}
.mapView /deep/ .van-popup__close-icon {
  background: #070910;
  opacity: 0.6;
  border-radius: 50%;
  padding: 5px;
  box-sizing: border-box;
}
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
