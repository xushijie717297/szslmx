<template>
  <div class="WaterQuality">
    <p id="statusBar"></p>
    <van-nav-bar
      :left-text="msg"
      left-arrow
      @click-left="superior"
      :border="false"
    >
      <template #right>
        <div class="timeXz">
          <div class="Diachronic">
            <p>最大历时：</p>
            <p class="time">{{ digit }}小时</p>
            <span
              class="iconfont iconxiasanjiaoxing"
              style="size: 12px"
              @click="choiceWho2"
            ></span>
            <van-popup
              v-model="showPicker3"
              position="bottom"
              get-container=".WaterQuality"
            >
              <van-picker
                show-toolbar
                :columns="resultData2"
                @confirm="onConfirm3"
                @cancel="showPicker3 = false"
                :default-index="4"
              />
            </van-popup>
          </div>
          <div class="pipeNetwork">
            <p class="time">时间：</p>
            <p>{{ time }}</p>
            <span
              class="iconfont iconxiasanjiaoxing"
              style="size: 12px"
              @click="choiceWho1"
            ></span>
            <van-popup
              v-model="showPicker4"
              position="bottom"
              get-container="body"
            >
              <van-picker
                show-toolbar
                :columns="resultData1"
                @confirm="onConfirm4"
                @cancel="showPicker4 = false"
                :default-index="dateNum"
              />
            </van-popup>
          </div>
        </div>
      </template>
    </van-nav-bar>
    <div class="main">
      <p class="tuli" @click="legend()">
        <span class="iconfont icontuli"></span>
      </p>
      <div class="tabsList">
        <van-tabs v-model="cur">
          <van-tab title="溯源分析"></van-tab>
          <van-tab title="扩散分析"></van-tab>
        </van-tabs>
      </div>
      <div id="map" ref="mainHeight" style="width: 100%; height: 100%"></div>
    </div>
    <!-- 定位浮层 -->
    <div class="foot" ref="Stretch">
      <div class="play" v-show="showPlay">
        <p>{{limitTempData}}</p>
        <sliderMapFL
          :sliderMapResizeTime="sliderMapResizeTime"
          :silderMapStep="silderMapStep"
          key="silderMapStepfl"
          @DiffusionDrawPlaying="DiffusionDrawPlaying"
        />
      </div>
      <div class="imgBtn" @click="fenxi" v-show="cur == 0">
        <img src="../../../static/imag/buttom.png" alt="" />
        <p><span>溯源分析</span></p>
      </div>
      <div class="imgBtn" @click="fenxis" v-show="cur == 1">
        <img src="../../../static/imag/buttom.png" alt="" />
        <p><span>扩散分析</span></p>
      </div>
      <div
        class="foot-top"
        @touchstart.capture="touchStart"
        @touchend.capture="touchEnd"
      >
        <div v-show="pipeNetwork">
          <span
            class="iconfont iconadd-fill-copy"
            style="font-size: 24px"
            @click="choiceWho"
            
          ></span>
          <van-popup
            v-model="showPicker"
            position="bottom"
            get-container=".foot"
          >
            <div class="ldlx">
              <div class="TF">
                <p @click="quXiao">取消</p>
                <p @click="queDing">确定</p>
              </div>
              <swiper ref="mySwiper" :options="userOption2">
                <swiper-slide v-for="(item, index) in resultData" :key="index">
                  <P @click="ldlx(index)" :class="{ activeList: item.forhide }">
                    {{ item.Label }}
                  </P>
                </swiper-slide>
              </swiper>
            </div>
          </van-popup>
        </div>
        <!-- 中间可删除条件的框 -->
        <div class="wrdiputoutbox">
          <p>
            <span v-for="(item, index) in list0" :key="index">{{
              item.Label
            }}</span>
          </p>
          <span
            class="iconfont iconxiasanjiaoxing"
            style="size: 12px"
            @click="choiceWh"
          ></span>
          <van-popup
            v-model="showPicker2"
            position="bottom"
            get-container=".foot"
          >
            <div class="ldlx">
              <swiper ref="mySwiper" :options="userOption2">
                <swiper-slide v-for="(item, index) in list0" :key="index">
                  <P>
                    {{ item.Label }}
                    <span
                      @click="deleteList(index)"
                      class="iconfont iconguanbi"
                    ></span>
                  </P>
                </swiper-slide>
              </swiper>
            </div>
          </van-popup>
        </div>
        <div
          class="Selection"
          @click="changeStyle"
          :class="{ active: isMapClickPipeBurst }"
        >
          <span class="iconfont icondingwei2"></span>
          <p>图上选择</p>
        </div>
      </div>
      <!-- 数据展示 -->
      <div class="sjzs">
        <div class="dataNull" v-if="dataNull">暂无数据</div>
        <div class="sjzsTop">
          <h5>{{ nav }}</h5>
        </div>
        <div class="foot-content">
          <div class="foot-contentL">
            <div class="header">
              <h4>编号</h4>
              <h4>用户名称</h4>
            </div>
            <div
              class="lister"
              ref="externalForm"
              @scroll="exterHandleScroll()"
              @mouseover="changeFlag(true)"
            >
              <div
                v-for="(item, index) in userDatas"
                :key="index"
                @click="markPosition(item)"
              >
                <p>{{ item.UserNum }}</p>
                <p>{{ item.District }}</p>
              </div>
              <infinite-loading spinner="bubbles" @infinite="infiniteHandler">
                <span
                  slot="no-more"
                  style="height: 30px; line-height: 30px; display: block"
                >
                  没有更多数据了
                </span>
                <span
                  slot="no-results"
                  style="height: 30px; line-height: 30px; display: block"
                >
                  暂无数据
                </span>
              </infinite-loading>
            </div>
          </div>
          <div class="foot-contentR">
            <div class="header">
              <h4 @click="sortWater">
                月用水量
                <p>
                  <span :class="{ Ascending: Ascending }"></span>
                  <span :class="{ Descending: Descending }"></span>
                </p>
              </h4>
              <h4 @click="sortPressure">
                压力
                <p>
                  <span :class="{ Ascending: Ascendings }"></span>
                  <span :class="{ Descending: Descendings }"></span>
                </p>
              </h4>
              <h4>地址</h4>
            </div>
            <div
              class="liste"
              ref="systemForm"
              @scroll="sysHandleScroll()"
              @mouseover="changeFlag(false)"
            >
              <div
                v-for="(item, index) in userDatas"
                :key="index"
                @click="markPosition(item)"
              >
                <p>{{ item.Demand }}</p>
                <p>{{ item.Pressure }}</p>
                <p>{{ item.Addr }}</p>
              </div>
              <infinite-loading spinner="bubbles" @infinite="infiniteHandler">
                <span
                  slot="no-more"
                  style="height: 30px; line-height: 30px; display: block"
                >
                  没有更多数据了
                </span>
                <span
                  slot="no-results"
                  style="height: 30px; line-height: 30px; display: block"
                >
                  暂无数据
                </span>
              </infinite-loading>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-popup
      class="popupLoadimg"
      v-model="PopupS"
      :close-on-click-overlay="false"
      get-container="body"
    >
      <van-loading type="spinner" color="#1989fa" />
    </van-popup>
    <van-popup
      class="LegendS"
      :style="{ height: '100%' }"
      position="right"
      v-model="LegendS"
      get-container="body"
    >
      <div class="Basics" v-show="BasicsLegend">
        <p class="statusBar"></p>
        <h3>基础管网</h3>
        <div class="imgList">
          <div v-for="(item, index) in BasicsLegendImg" :key="index">
            <img :src="item.url" alt="" />
            <p>{{ item.name }}</p>
          </div>
        </div>
      </div>
      <div class="jisuanList" v-show="SimulationCalculation">
        <!-- <div class="jisuanList" v-show="true"> -->
        <h3>模拟计算</h3>
        <div class="pressureTr">
          <p>压力变化(m)</p>
          <p>管道长度(m)</p>
          <p>比例(%)</p>
        </div>
        <div class="pressureData">
          <div v-for="(item, index) in legendjson" :key="index">
            <p>
              <span :style="{ background: item.color }"></span>{{ item.Label }}
            </p>
            <p>{{ item.PipeLength }}</p>
            <p>{{ item.Ratio }}</p>
          </div>
        </div>
        <h4>
          总和：
          <p>{{ TheSum }}</p>
        </h4>
      </div>
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
import Vue from "vue";
import axios from "axios";
import urlClass from "../../components/js/UrlClass";
import global from "../../components/js/Global";
import drawClass from "../../components/arcgisforjsTest/DrawClass";
// import supplyPath from "../../components/arcgisforjsTest/SupplyPath"
import popupLable from "../../components/js/popupLable";
import blackinfowin from "../../../static/imag/blackinfowin.png";
import mark from "../../../static/imag/redIcon.png";
import greenpin from "../../../static/imag/orangeIcon.png";
import sliderMapFL from "./SliderMapFL";
import InfiniteLoading from "vue-infinite-loading";
import usersData from "./user.json";
import Bus from "../../utils/Bus";
import legendData from "../../components/js/legend";

import {
  DropdownMenu,
  DropdownItem,
  NavBar,
  Icon,
  Button,
  Picker,
  Popup,
  Tab,
  Tabs,
  Overlay,
  Loading,
  Field,
  Dialog,
} from "vant";

Vue.use(Field);
Vue.use(Loading);
Vue.use(Overlay);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Popup);
Vue.use(Picker);
Vue.use(Button);
Vue.use(Icon);
Vue.use(NavBar);
import $ from "jquery";
import { loadModules } from "esri-loader";
import tileInfo from "../../components/arcgisforjsTest/tdt_data.js";
import Attribute from "../../components/js/Attribute";
import EchatAtt from "../warn/EchatAttr";
export default {
  name: "WaterQuality",
  components: {
    sliderMapFL,
    InfiniteLoading,
    [Dialog.Component.name]: Dialog.Component,
    EchatAtt,
  },
  data() {
    return {
      pipeNetwork:false,
      AttributePupup:true,
      limitTempData:"0:00",
      showMap: false,
      dataNull:false,
      EchartA: false,
      dateNum: 4,
      Ascending: false, //升序水量
      Descending: false, //降序水量
      Ascendings: false, //升序压力
      Descendings: false, //降序压力
      flag: false,
      screenHeight: 0,
      currentPage: 0,
      sort: true, //数据排序
      showPlay: false, //画图播放
      PopupS: false, //遮罩
      LegendS: false, //图例层
      BasicsLegend: true, //基础图例
      TheSum: 0,
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
          name: "供水管道",
          url: require("../../../static/imag/PipeBurst/pipe_icon.png"),
        },
      ],
      SimulationCalculation: false, //模拟计算图例
      legendjson: {},
      tabList: ["溯源分析", "扩散分析"],
      cur: 0,
      analysisType: "溯源分析",
      nav: "污染溯源分析范围内用户列表",
      Header: ["编号", "用户名称", "月用水量", "压力", "地址"],
      msg: "水质事件分析",
      showPicker: false,
      showPicker2: false,
      showPicker4: false,
      showPicker3: false,
      // flag:false,
      isMapClickPipeBurst: false,
      resultData: [],
      resultData1: [
        "0点",
        "1点",
        "2点",
        "3点",
        "4点",
        "5点",
        "6点",
        "7点",
        "8点",
        "9点",
        "10点",
        "11点",
        "12点",
        "13点",
        "14点",
        "15点",
        "16点",
        "17点",
        "18点",
        "19点",
        "20点",
        "21点",
        "22点",
        "23点",
      ],
      resultData2: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      view: null,
      list0: [],
      clickArr: [], //点击的数组
      Zlist: [], //下拉与点选总数居
      userOption2: {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        direction: "vertical",
        slidesPerView: 4,
      },
      diffusionLayer: null,
      diffusionPositionLayer: null,
      markLayer: null,
      drawSymbol: null,
      mapClickgl: null,
      eventType: "",
      digit: "5",
      time: "",
      timeTheLeastBit: 0,
      isTimeTheLeastBit: global.isTimeTheLeastBit,
      selections: [],
      nowIndex: 0,
      userData: [], //查询结果
      userDatas: [], //查询结果分页
      supplyPathReturn: {}, //放置坐标点管网参数
      sliderMapResizeTime: 0,
      silderMapStep: 5,
      tableShow: false,
      showDate: false,
      diffusionData: {},
      locationQueryUrlType: "",
      parameter: {
        Demand: 0,
        ElementId: 0,
        Type: 0,
        CanNotBeclosedValves: [],
        Time: 0,
        TableName: "",
        UserId: "",
        IsSave: false,
        CloseValveList: [],
        loading: "",
        sourceId: "",
        diffusionDrawData: [],
      },
      startY: 0,
      endY: 0,
      list: [
        { name: "阿斯顿5", num: "5" },
        { name: "阿斯顿1", num: "1" },
        { name: "阿斯顿3", num: "3" },
        { name: "阿斯顿4", num: "4" },
        { name: "阿斯顿6", num: "6" },
        { name: "阿斯顿52", num: "5" },
        { name: "阿斯顿52", num: "5" },
        { name: "阿斯顿52", num: "5" },
        { name: "阿斯顿52", num: "5" },
        { name: "阿斯顿52", num: "5" },
        { name: "阿斯顿52", num: "5" },
        { name: "阿斯顿52", num: "5" },
        { name: "阿斯顿52", num: "5" },
      ],
      cont: 0, //每页十个
      pageSize: 0, //页码
      list1: [],
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
      this.showMap = false;
      this.mapClickgl.removeAll();
    },
    showMapClick1() {
      this.EchartA = false;
    },
    //图例
    legend() {
      console.log(this.LegendS);
      this.LegendS = true;
    },
    changeFlag(flag) {
      this.flag = flag;
    },
    // 左右滚动条滚动同步
    sysHandleScroll() {
      // console.log(this.$refs.externalForm.scrollTop)

      if (!this.flag) {
        // console.log(this.$refs.externalForm.scrollTop)
        this.$refs.externalForm.scrollTop = this.$refs.systemForm.scrollTop;
      }
    },
    exterHandleScroll() {
      if (!this.flag) {
        // console.log(this.$refs.systemForm.scrollTop)
        this.$refs.systemForm.scrollTop = this.$refs.externalForm.scrollTop;
      }
    },
    infiniteHandler($state) {
      this.cont += 10;
      this.pageSize++;
      if (this.pageSize <= this.currentPage) {
        this.userDatas.push(...this.userData.slice(this.cont, this.cont + 10));
        $state.loaded();
      } else {
        $state.complete();
      }
      console.log(this.cont);
      console.log(this.currentPage);
    },
    //dingwei
    markPosition(item) {
      console.log(item);
      var mark = greenpin;
      var coordinateX = item.X;
      var coordinateY = item.Y;
      var point = {
        type: "point", // autocasts as new Point()
        x: coordinateX,
        y: coordinateY,
        spatialReference: new this.arcgisAPI.SpatialReference({ wkid: global.spatialReference }),
      };
      this.view.center = point;
      this.drawSymbol.removeAll();
      var symbol = {
        type: "picture-marker", // autocasts as new PictureMarkerSymbol()
        url: mark,
        width: 16,
        height: 32,
        yoffset: 16,
      };
      var gra1 = new this.arcgisAPI.Graphic();
      gra1.geometry = point;
      gra1.symbol = symbol;
      this.drawSymbol.add(gra1);
    },
    curry(index) {
      this.cur = index;
    },
    quXiao() {
      this.showPicker = false;
      this.list0 = this.list0;
    },
    queDing() {
      this.showPicker = false;
    },
    ldlx(index) {
      if (this.SimulationCalculation) {
        this.$refs.Stretch.style.bottom = -9.7 + "rem";
        this.$refs.mainHeight.style.width = "100%";
        this.$refs.mainHeight.style.height = "100%";
        this.diffusionLayer.removeAll();
        this.Zlist = [];
      }
      this.SimulationCalculation = false;
      this.BasicsLegend = true;
      var a = index;
      var that = this;
      this.$set(that.resultData[a], "forhide", !that.resultData[a].forhide);
      console.log(that.resultData[a]);
      var list0 = this.list0;
      console.log(list0);
      if (list0.indexOf(this.resultData[index]) == -1) {
        list0.push(this.resultData[index]);
      } else {
        list0.splice(list0.indexOf(this.resultData[index]), 1);
      }
      this.list0 = list0;
      this.DeleteSourceIds(this.list0);
      console.log(list0.length);
    },
    DeleteSourceIds(data) {
      this.diffusionLayer.removeAll();
      this.diffusionPositionLayer.removeAll();
      this.markLayer.removeAll();
      this.eventType = "Diffusion";
      var positionData = data;
      for (var i = 0; i < positionData.length; i++) {
        var obj = positionData[i];
        var pointMy = new this.arcgisAPI.Point(
          obj.X,
          obj.Y,
          this.view.spatialReference
        );
        this.PositionSupplyPathNode(pointMy, this.diffusionPositionLayer);
      }
      //   diffusionIds = positionData;
    },
    PositionSupplyPathNode(geometry, layerTemp) {
      if (this.eventType != "Diffusion") layerTemp.removeAll();
      var point = this.arcgisAPI.Point(
        geometry.x,
        geometry.y,
        new this.arcgisAPI.SpatialReference({
          wkid: global.spatialReference,
        })
      );
      var gra1 = drawClass.CreatePictureGraphic(
        {
          url: mark,
          width: 20,
          height: 41,
          xoffset: 0,
          yoffset: 17,
          angle: 0,
          color: "",
        },
        geometry
      );
      layerTemp.add(gra1);
    },
    fenxi() {
      if (this.digit == "") {
        Dialog.confirm({
          title: "提示",
          message: "请检查输入参数",
        })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
          });
      } else if (this.list0.length == 0) {
        Dialog.confirm({
          title: "提示",
          message: "请选择分析坐标点",
        })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
          });
      } else {
        this.PopupS = true; //查询开始遮罩出现
        this.silderMapStep = Number(this.digit);
        var elementIds = [];
        for (var i = 0; i < this.list0.length; i++) {
          var obj = this.list0[i];
          elementIds.push(obj.ElementId);
        }
        // elementIds.push(...this.clickArr);
        this.Zlist = elementIds;
        console.log(elementIds);
        var arr1 = this.resultData1.findIndex(
          (value, index, array) => value == this.time
        );
        console.log(arr1);
        var parameterTemp = {
          ElementIds: elementIds,
          SourceId: "",
          Time: arr1,
          PassTime: this.digit,
          TableNamePipe: "pipe",
          Minute: this.timeTheLeastBit,
        };
        console.log(parameterTemp);
        var self = this;
        axios
          .post(
            urlClass.axiosUrl + "NodeTraceReverseNew",
            JSON.stringify(parameterTemp),
            global.axiosHeaders
          )
          .then(function (response) {
            // debugger
            var resultTemp = response.data;
            if (resultTemp && String(resultTemp.Code) == "0") {
              var result = resultTemp.Response;
              console.log(result);
              self.PopupS = false; //查询结束遮罩隐藏
              //返回查询结果处理
              self.userData = result.ListUser;
              if(self.userData.length == 0){
                self.dataNull = true
              }
              var detailedOpen = {
                nowIndex: self.nowIndex,
                passTime: self.digit,
                result: result,
              };
              console.log(self.userData);
              self.userDatas = result.ListUser.slice(0, 10);
              self.currentPage = Math.ceil(self.userData.length / 10);
              console.log(self.currentPage);
              self.detailedOpen(detailedOpen);
              self.showPlay = true;
              var position1 = -9.7;
              self.$refs.Stretch.style.bottom = 0 + "rem";
              self.$refs.Stretch.style.transition = "bottom 0.6s";
              self.$refs.mainHeight.style.height =
                self.screenHeight + position1 + "rem";
              self.SimulationCalculation = true;
              self.BasicsLegend = false;
            } else {
              console.log("错误信息:", resultTemp.Message);
            }
          })
          .catch((err) => {
            console.log(err);
            self.PopupS = false;
          });
      }
    },
    fenxis() {
      if (this.digit == "") {
        Dialog.confirm({
          title: "提示",
          message: "请检查输入参数",
        })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
          });
      } else if (this.list0.length == 0) {
        Dialog.confirm({
          title: "提示",
          message: "请选择分析坐标点",
        })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
          });
      } else {
        this.PopupS = true; //查询开始遮罩出现
        this.silderMapStep = Number(this.digit);
        var elementIds = [];
        for (var i = 0; i < this.list0.length; i++) {
          var obj = this.list0[i];
          elementIds.push(obj.ElementId);
        }
        // console.log(this.clickArr)
        // elementIds.push(...this.clickArr);
        this.Zlist = elementIds;
        console.log(elementIds);
        var arr1 = this.resultData1.findIndex(
          (value, index, array) => value == this.time
        );
        var parameterTemp = {
          ElementIds: elementIds,
          // ElementIds: ["967776"],
          SourceId: "",
          Time: arr1,
          PassTime: this.digit,
          TableNamePipe: "pipe",
          Minute: this.timeTheLeastBit,
        };
        console.log(parameterTemp);
        var self = this;
        axios
          .post(
            urlClass.axiosUrl + "NodeTraceNew",
            JSON.stringify(parameterTemp),
            global.axiosHeaders
          )
          .then(function (response) {
            var resultTemp = response.data;
            if (resultTemp && String(resultTemp.Code) == "0") {
              var result = resultTemp.Response;
              console.log(result);
              self.PopupS = false; //查询结束遮罩隐藏
              //返回查询结果处理
              self.userData = result.ListUser;
              var detailedOpen = {
                nowIndex: self.nowIndex,
                passTime: self.digit,
                result: result,
              };
              console.log(self.userData);
              self.userDatas = result.ListUser.slice(0, 10);
              console.log(JSON.stringify(self.userDatas));
              self.currentPage = Math.ceil(self.userData.length / 10);
              console.log(self.currentPage);
              self.detailedOpen(detailedOpen);
              self.showPlay = true;
              var position1 = -9.7;
              self.$refs.Stretch.style.bottom = 0 + "rem";
              self.$refs.Stretch.style.transition = "bottom 0.6s";
              self.$refs.mainHeight.style.height =
                self.screenHeight + position1 + "rem";
              self.SimulationCalculation = true;
              self.BasicsLegend = false;
              console.log(self.$refs.mainHeight.style.height);
            } else {
              console.log("错误信息:", resultTemp.Message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    //数据排序
    sortWater() {
      //按用水量
      this.Ascendings = false;
      this.Descendings = false;
      this.Ascending = !this.Ascending;
      this.Descending = !this.Ascending;
      this.userDatas = JSON.parse(JSON.stringify(this.userDatas));
      if (this.sort) {
        this.userDatas.sort(this.Ascendingorder("Demand"));
        this.sort = false;
      } else {
        this.userDatas.sort(this.Descendingorder("Demand"));
        this.sort = true;
      }
    },
    Ascendingorder(Demand) {
      return function (a, b) {
        var value1 = a["Demand"];
        var value2 = b["Demand"];
        return value1 - value2;
      };
    },
    Descendingorder(Demand) {
      //降序
      return function (a, b) {
        var value1 = a["Demand"];
        var value2 = b["Demand"];
        return value2 - value1;
      };
    },
    sortPressure() {
      //按压力
      this.Ascending = false;
      this.Descending = false;
      this.Ascendings = !this.Ascendings;
      this.Descendings = !this.Ascendings;
      this.userDatas = JSON.parse(JSON.stringify(this.userDatas));
      if (this.sort) {
        this.userDatas.sort(this.Ascendingorder("Pressure"));
        this.sort = false;
      } else {
        this.userDatas.sort(this.Descendingorder("Pressure"));
        this.sort = true;
      }
    },
    detailedOpen(data) {
      console.log(data);
      this.tableShow = false;
      //播放条初始化
      this.showDate = true;
      this.silderMapStep = Number(data.passTime);
      this.sliderMapResizeTime = new Date().getTime();
      //返回数据处理
      var object = new Object();
      object.min = 0;
      object.max = data.passTime;
      object.allData = data.result.ListPipe;
      object.data = data.result;
      this.diffusionData = Object.assign({}, data.result);
      var CanNotBeclosedValves = this.diffusionData.ListValve;
      var arrayTemp = new Array();
      for (var i = 0; i < CanNotBeclosedValves.length; i++) {
        arrayTemp.push(CanNotBeclosedValves[i].ElementId);
      }
      this.parameter.CanNotBeclosedValves = arrayTemp;
      var title = "污染溯源分析范围内用户列表";
      if (data.nowIndex == 0) {
        title = "污染溯源分析范围内用户列表";
      } else {
        title = "污染扩散分析范围内用户列表";
      }
      this.DiffusionDraw(object);
      this.DiffusionSourcePosition(this.sourceId);
      this.isDetailed = true;
      this.detailedData = { title: title, userData: data.result.ListUser };
      this.getIsSliderMapFLStyle();
    },
    getIsSliderMapFLStyle() {
      this.sliderMapFLClass = "inputplayoutrightbox";
      if (this.showDate && this.tableShow) {
        this.sliderMapFLClass = "inputplayoutrightbox2";
      } else if (this.showDate && this.isDetailed) {
        this.sliderMapFLClass = "inputplayoutrightbox1";
      }
    },
    DiffusionSourcePosition(data) {
      var elementIdTemp = data;
      var whereTemp = "ElementId = " + elementIdTemp;
      /**
       * 节点
       */
      var EN_JUNCTION = "7";
      var layerId = EN_JUNCTION;
      this.locationQueryUrlType = "junction";
      this.eventType == "Diffusion";
    },
    DiffusionDraw(data) {
      var self = this;
      this.diffusionLayer.removeAll();
      var EventTypeMain = "Diffusion";
      var drawData = data;
      console.log(data);
      var waterQualityPoint = drawData.data.WaterQualityPoint;
      this.diffusionDrawData = Object.assign({}, drawData);
      var isDisplays = global.diffusionIsDisplay.slice(0);
      global.diffusionLimit = this.GetLimit(
        drawData.min,
        drawData.max,
        global.diffusionLevel
      );
      var limitsTemp = drawClass.DrawDiffusion(
        drawData.min,
        drawData.max,
        drawData.allData,
        global.diffusionLevel,
        global.diffusionColor,
        isDisplays,
        this.diffusionLayer,
        false,
        "",
        EventTypeMain,
        true,
        true,
        global.diffusionLimit
      );
      // diffusionResultClass = Object.assign({}, drawData.data)
      console.log(global.diffusionLimit);
      drawClass.MapResultDataRangeZoom([this.diffusionLayer], this.view);
      var ListLegendArr = this.GetLegends(global.diffusionLimit);
      var parameterTemps = new Object();
      parameterTemps = {
        Big: "true",
        Field: "",
        ListLegend: ListLegendArr,
        PipeList: [],
        PlanId: "",
        Small: "true",
        TableName: "",
        Time1: "0",
        Time2: "",
        Type: "Diffusion",
      };
      var diffusionColor = global.diffusionColor;
      axios
        .post(
          urlClass.axiosUrl + "LegendGetPipeLength",
          JSON.stringify(parameterTemps),
          global.axiosHeaders
        )
        .then(function (response) {
          // debugger
          var resultTemp = response.data;
          if (resultTemp && String(resultTemp.Code) == "0") {
            var result = resultTemp.Response;
            var TheSum = 0;
            for (let i = 0; i < result.length; i++) {
              result[i].color = diffusionColor[i];
              TheSum += Number(result[i].PipeLength);
            }
            console.log(TheSum);
            self.TheSum = TheSum;
            self.legendjson = result;
          } else {
            console.log("错误信息:", resultTemp.Message);
          }
        });
    },
    DiffusionDrawPlaying(obj) {
      if (this.diffusionLayer) {
        this.diffusionLayer.removeAll();
        var EventTypeMain = "Diffusion";
        var objTemp = obj;
        var levelTemp = objTemp.level;
        var maxTemp = objTemp.sliderValue;
        var isDisplays = global.diffusionIsDisplay.slice(0);
        var limitTemp = this.GetLimit(
          this.diffusionDrawData.min,
          maxTemp,
          levelTemp
        );
        console.log(limitTemp);
        for (let i = 0; i < limitTemp.length; i++) {
          // debugger
          if (limitTemp[i] == "NaN") {
            limitTemp[i] = "0:00"
          }
          this.limitTempData = limitTemp[i]
        }
        drawClass.DrawDiffusion(
          this.diffusionDrawData.min,
          maxTemp,
          this.diffusionDrawData.allData,
          levelTemp,
          global.diffusionColor,
          isDisplays,
          this.diffusionLayer,
          false,
          "",
          EventTypeMain,
          true,
          true,
          limitTemp
        );
      }
    },
    GetLegends(array) {
      var arr = [];
      var obj = new Object();
      for (let i = 0; i < array.length; i++) {
        if (i < 5) {
          var Legends = array[i].toString() + "-" + array[i + 1].toString();
          obj = {
            Label: Legends,
            LabelId: Legends,
          };
          arr.push(obj);
        }
      }
      return arr;
    },
    GetLimit(min, max, levelTemp) {
      var limitsTemp = [];
      var temp = Number((max - min) / Number(levelTemp));
      var minTemp;
      var maxTemp;
      min = Number(min);
      max = Number(max);
      for (var i = 1; i <= levelTemp; i++) {
        maxTemp = Number(i * temp + min);
        minTemp = Number((i - 1) * temp + min);
        limitsTemp.push(Number(minTemp).toFixed(2));
      }
      limitsTemp.push(Number(maxTemp).toFixed(2));
      return limitsTemp;
    },
    ldlxQ() {
      this.showPicker = false;
    },
    superior() {
      this.$router.go(-1);
    },
    touchStart(e) {
      this.startY = e.touches[0].clientY;
    },
    touchEnd(e) {
      this.endY = e.changedTouches[0].clientY;
      var moveY = this.endY - this.startY;
      console.log(moveY); //Stretch
      var position1 = -9.7;
      var position2 = 0;
      if (this.Zlist.length != "0") {
        this.searchMove(moveY, position1, position2, this.$refs.Stretch);
      }
    },
    changeStyle() {
      this.SimulationCalculation = false;
      this.BasicsLegend = true;
      // for (let i = 0; i < this.list0.length; i++) {
      //   this.list0[i].forhide = false
      // }
      // this.list0 = []
      if (this.userDatas.length > 0) {
        this.diffusionLayer.removeAll();
        this.diffusionPositionLayer.removeAll();
        this.markLayer.removeAll();
        this.drawSymbol.removeAll();
        this.$refs.mainHeight.style.width = "100%";
        this.$refs.mainHeight.style.height = "100%";
        this.Zlist = [];
        self.showPlay = false;
      }
      this.$refs.Stretch.style.bottom = -9.7 + "rem";
      this.isMapClickPipeBurst = !this.isMapClickPipeBurst;
      if (this.isMapClickPipeBurst) {
				this.AttributePupup = false
			}else{
				this.AttributePupup = true
			}
      this.diffusionLayer.removeAll();
      // this.diffusionPositionLayer.removeAll();
    },
    searchMove(moveY, position1, position2, node) {
      var high = node.style.bottom;
      console.log(high);
      if (moveY > 0 && Math.abs(moveY) > 20 && high == position2 + "rem") {
        console.log(1);
        this.$refs.Stretch.style.bottom = position1 + "rem";
        this.$refs.mainHeight.style.width = "100%";
        this.$refs.mainHeight.style.height = "100%";
      } else if (
        moveY < 0 &&
        Math.abs(moveY) > 20 &&
        high == position1 + "rem"
      ) {
        console.log(2);
        this.$refs.Stretch.style.bottom = position2 + "rem";
        this.$refs.mainHeight.style.height =
          this.screenHeight + position1 + "rem";
      }
    },
    onConfirm1() {},
    onConfirm4(value) {
      this.showPicker4 = false;
      this.time = value;
      if (this.userDatas.length > 0) {
        this.diffusionLayer.removeAll();
        this.diffusionPositionLayer.removeAll();
        this.markLayer.removeAll();
        this.drawSymbol.removeAll();
        this.$refs.mainHeight.style.width = "100%";
        this.$refs.mainHeight.style.height = "100%";
        this.$refs.Stretch.style.bottom = -9.7 + "rem";
        this.Zlist = [];
        self.showPlay = false;
      }
    },
    onConfirm3(value) {
      this.showPicker3 = false;
      this.digit = value;
      if (this.userDatas.length > 0) {
        this.diffusionLayer.removeAll();
        this.diffusionPositionLayer.removeAll();
        this.markLayer.removeAll();
        this.drawSymbol.removeAll();
        this.$refs.mainHeight.style.width = "100%";
        this.$refs.mainHeight.style.height = "100%";
        this.$refs.Stretch.style.bottom = -9.7 + "rem";
        this.Zlist = [];
        self.showPlay = false;
      }
    },
    deleteList(index) {
      console.log(this.list0.length);
      console.log(index);
      if (this.SimulationCalculation && this.list0.length == "1") {
        this.$refs.Stretch.style.bottom = -9.7 + "rem";
        this.$refs.mainHeight.style.width = "100%";
        this.$refs.mainHeight.style.height = "100%";
        this.diffusionLayer.removeAll();
        this.Zlist = [];
        self.showPlay = false;
      }
      var aa = this.resultData.find(
        (item) => item.Label == this.list0[index].Label
      );
      if (aa != undefined) {
        aa.forhide = false;
      }
      this.list0.splice(index, 1);
      if (this.list0.length == 0) {
        this.showPicker2 = false;
      }
      console.log(this.list0.length);
      if (this.list0.length == "0") {
				this.AttributePupup = true
      }else{
				this.AttributePupup = false
      }
      this.DeleteSourceIds(this.list0);
    },
    choiceWh() {
      if (this.list0.length == 0) {
        Dialog.confirm({
          title: "提示",
          message: "还没有选择水质点",
        })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
          });
      } else {
        this.showPicker2 = !this.showPicker2;
      }
    },
    choiceWho() {
      this.showPicker = !this.showPicker;
    },
    choiceWho1() {
      this.showPicker4 = !this.showPicker4;
    },
    choiceWho2() {
      this.showPicker3 = !this.showPicker3;
    },
    GetWaterQualityInfo() {
      axios
        .post(
          urlClass.axiosUrl + "GetWaterQualityInfo",
          "",
          global.axiosHeaders
        )
        .then(this.GetWaterQualityInfoReturn);
    },
    GetWaterQualityInfoReturn(response) {
      // debugger
      var result = response.data;
      if (result && String(result.Code) == "0") {
        this.resultData = result.Response;
      } else {
        console.log("错误信息:", result.Message);
      }
    },
    getRanNum() {
      //随机大写字母
      var result = [];
      for (var i = 0; i < 4; i++) {
        var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
        //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
        result.push(String.fromCharCode(65 + ranNum));
      }
      return result.join("");
    },
  },
  mounted() {
    // Bus.$on("EchatAttr", (res) => {
    //   this.EchartA = true;
    //   this.$nextTick(()=>{
    //   Bus.$emit("EchatAttrData", res);
    //   console.log('%c XSJ-[ res ]->', 'font-size:13px; background:red; color:#bf2c9f;', res)
    //   })
    // });
    this.pipeNetwork = global.component
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
    this.userDatas = usersData;
    this.screenHeight = window.screen.height / 37.5;
    console.log(this.screenHeight);
    this.GetWaterQualityInfo();
    this.sliderMapResizeTime = new Date().getTime();
    var nowHour = new Date().getHours();
    console.log(nowHour);
    this.dateNum = nowHour;
    console.log(this.dateNum);
    var nowMinute = new Date().getMinutes();
    var isnowMinute = nowMinute >= 30 ? true : false;
    for (var i = 0; i < 24; i++) {
      var temp = { index: i, value: i, label: i + "点", timeTheLeastBit: 0 };
      this.time = nowHour + "点";
      if (this.isTimeTheLeastBit) {
        var temp1 = {
          index: i + 1000,
          value: i,
          label: i + "点30分",
          timeTheLeastBit: 30,
        };
        if (nowHour == i && isnowMinute) {
          this.timeTheLeastBit = temp1.timeTheLeastBit;
          this.time = temp1.index;
        } else if (nowHour == i) {
          this.timeTheLeastBit = temp.timeTheLeastBit;
          this.time = temp.index;
        }
        this.selections.push(temp);
        this.selections.push(temp1);
      } else {
        if (nowHour == i) {
          this.timeTheLeastBit = temp.timeTheLeastBit;
          this.time = temp.index;
        }
        this.selections.push(temp);
      }
    }
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
        "esri/layers/GraphicsLayer",
        "esri/layers/FeatureLayer",
        "esri/tasks/QueryTask",
        "esri/geometry/Point",
        "esri/tasks/support/query",
        "esri/symbols/PictureMarkerSymbol",
        "esri/tasks/support/IdentifyParameters",
        "esri/tasks/IdentifyTask",
        "esri/geometry/Polyline",
        "esri/Color",
        "esri/symbols/SimpleLineSymbol",
        "esri/geometry/geometryEngine",
        "esri/symbols/SimpleMarkerSymbol",
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
        GraphicsLayer,
        FeatureLayer,
        QueryTask,
        Point,
        Query,
        PictureMarkerSymbol,
        IdentifyParameters,
        IdentifyTask,
        Polyline,
        Color,
        SimpleLineSymbol,
        geometryEngine,
        SimpleMarkerSymbol,
      ]) => {
        this.arcgisAPI = {
          SpatialReference: SpatialReference,
          Extent: Extent,
          GraphicsLayer: GraphicsLayer,
          Graphic: Graphic,
          Polygon: Polygon,
          FeatureLayer: FeatureLayer,
          QueryTask: QueryTask,
          Point: Point,
          Query: Query,
          PictureMarkerSymbol: PictureMarkerSymbol,
          Polyline: Polyline,
          Color: Color,
          SimpleLineSymbol: SimpleLineSymbol,
          geometryEngine: geometryEngine,
          SimpleMarkerSymbol: SimpleMarkerSymbol,
          IdentifyParameters:IdentifyParameters,
          IdentifyTask:IdentifyTask
        };
        drawClass.setArcgisforAPI(this.arcgisAPI);
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
        // diffusionPositionLayer
        this.markLayer = new GraphicsLayer();
        this.diffusionLayer = new GraphicsLayer();
        this.diffusionPositionLayer = new GraphicsLayer();
        this.drawSymbol = new GraphicsLayer();
        this.mapClickgl = new GraphicsLayer();

        map.add(this.diffusionLayer);
        map.add(this.diffusionPositionLayer);
        map.add(this.markLayer);
        map.add(this.drawSymbol);
        map.add(this.mapClickgl);
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
        view.ui.components = [];
        this.view.popup.dockEnabled = false;
        this.view.popup.collapseEnabled = false;
        this.view.popup.dockOptions = {
          buttonEnabled: false,
          breakpoint: false,
          position: "bottom-left",
        }; //禁用停靠
        this.view.popup.actions = null;

        this.view.on("click", function (event) {
          if (self.isMapClickPipeBurst) {
            self.isMapClickPipeBurst = false;
            console.log("我点击了管网");
            // self.list0 = [];//点击管网将下拉选择清空
            IdentifyMain(event.mapPoint);
            console.log(event.mapPoint);
            var markXy = new Object();
            markXy.X = event.mapPoint.x.toFixed(1);
            markXy.Y = event.mapPoint.y.toFixed(1);
            function IdentifyMain(pointTemp) {
              var idenrifyParams = new IdentifyParameters();
              idenrifyParams.returnGeometry = true;
              idenrifyParams.width = view.width;
              idenrifyParams.height = view.height;
              idenrifyParams.geometry = pointTemp;
              idenrifyParams.tolerance = 5;
              idenrifyParams.mapExtent = view.extent;
              idenrifyParams.spatialReference = view.spatialReference;
              var identifyTask = new IdentifyTask(urlClass.baseMapUrl);
              identifyTask
                .execute(idenrifyParams)
                .then(SupplyPathResultFunction, function (error) {
                  console.log(error);
                });
            }
            function SupplyPathResultFunction(evt) {
              var point = {};
              var elemetidTemp = 0;
              var elementType = 0;
              var feature;
              if (evt.results.length > 0) {
                var identifyResult = evt.results[0];
                feature = identifyResult.feature;
                var attributeTemp = feature.attributes;
                console.log(identifyResult);
                // var
                if (!self.list0.includes(attributeTemp.ElementId)) {
                  // self.list0.push(attributeTemp.ElementId)
                  console.log(self.list0);
                  if (feature.geometry.type == "point") {
                    markXy.Label = attributeTemp.ElementId;
                    markXy.ElementId = attributeTemp.ElementId;
                    self.list0.push(markXy);
                    console.log("point");
                    point = feature.geometry;
                    elemetidTemp = attributeTemp.ElementId;
                    elementType = attributeTemp.ElementTypeId;
                    self.supplyPathReturn.elementId = elemetidTemp;
                    self.supplyPathReturn.elementTypeId = elementType;
                    self.spotCoordinate = elemetidTemp;
                  } else if (feature.geometry.type == "polyline") {
                    console.log("polyline");
                    elemetidTemp = attributeTemp.StartNodeID;
                    markXy.Label = attributeTemp.ElementId;
                    markXy.ElementId = attributeTemp.StartNodeID;
                    self.list0.push(markXy);
                    console.log(elemetidTemp);
                    elementType = attributeTemp.StartNodeType;
                    self.supplyPathReturn.elementId = elemetidTemp;
                    self.supplyPathReturn.elementTypeId = elementType;
                    self.spotCoordinate = elemetidTemp;
                    var paths = feature.geometry.paths[0];
                    var point1 = paths[0];
                    var point2 = paths[1];
                    var x = (Number(point1[0]) + Number(point2[0])) / 2;
                    var y = (Number(point1[1]) + Number(point2[1])) / 2;
                    point = Point(
                      x,
                      y,
                      new SpatialReference({ wkid: global.spatialReference })
                    );
                  } else {
                    return;
                  }
                  console.log(point);
                  PositionSupplyPathNode(point, self.markLayer);
                } else {
                  Dialog.confirm({
                    title: "提示",
                    message: "该点以被选择，请重新选取",
                  })
                    .then(() => {
                      // on confirm
                    })
                    .catch(() => {
                      // on cancel
                    });
                }
              }
            }
            function PositionSupplyPathNode(point, layerTemp) {
              self.isMapClickPipeBurst = false;
              var symbol = {
                type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                url: mark,
                width: 16,
                height: 32,
                yoffset: 16,
              };
              var gra1 = new Graphic(point, symbol);
              layerTemp.add(gra1);
            }
          }
          // if (self.AttributePupup && self.list0.length == "0") {

          if (self.AttributePupup && self.list0.length == "0") {
            var layer = self.mapClickgl;
            Attribute.myIdentify(event,self.view,layer,map);
            Bus.$on("Legend", (res) => {
            console.log(res);
            if (res.results.length > 0) {
              self.showMap = true;
            }
            });
          }
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
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  },
};
</script>
<style lang="less" scoped>
@import "./WaterQuality.less";
body /deep/ .van-popup {
  background-color: transparent !important;
}
.WaterQuality /deep/ .van-popup {
  background-color: #fff;
}
.popupLoadimg {
  background-color: transparent !important; 
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
