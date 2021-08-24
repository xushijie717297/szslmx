<template>
  <div class="tubeBurst">
    <p id="statusBar"></p>
    <div class="nav">
      <p @click="go">
        <img src="../../../static/imag/return.png" alt />
        <span>返回</span>
      </p>
      <h4>爆管工况</h4>
      <p></p>
    </div>
    <div class="main">
      <p @click="legend()">
        <span class="iconfont icontuli"></span>
      </p>
      <div ref="mainHeight" id="map" style="width: 100%; height: 100%"></div>
      <img class="zzImg" src="../../../static/imag/mask.png" alt="" />
    </div>
    <div class="operation" ref="operation">
      <div class="btn" @click="up">
        <p>模拟分析</p>
      </div>
      <div
        class="operation-t"
        @touchstart.capture="touchStart"
        @touchend.capture="touchEnd"
      >
        <div class="oper-t" @click="changeStyle" :class="{ active: opert }">
          <span :class="{ star: opert }"></span>
          <p>爆管点</p>
        </div>
        <div class="oper-c">
          <p>水量</p>
          <input type="text" v-model="Drainage" />
          <span>m³/h</span>
        </div>
        <div class="oper-f">
          <!-- <van-dropdown-menu direction="up" >
                <van-dropdown-item @change="dropdown" v-model="value" :options="option" />
              </van-dropdown-menu> -->
              <p>比例</p>
          <van-popover
            v-model="showPopover"
            trigger="click"
            :actions="option"
            @select="onSelect"
            placement="left-end"
          >
            <template #reference>
              <!-- <van-button type="primary"> -->
              {{ Lskmjzb | toPercent }}
              <!-- </van-button> -->
            </template>
          </van-popover>
        </div>
      </div>
      <!-- 分割线 -->
      <van-divider
        :style="{ color: '#1989fa', borderColor: '#171a2a', margin: '0' }"
      />
      <div
        class="calc-t"
        @touchstart.capture="touchStart"
        @touchend.capture="touchEnd"
      >
        <div class="calc-tc">
          <!--   -->
          <div>
            <span>
              <em>{{ listItems[0].name }}</em>
            </span>
            <p>{{ listItems[0].value }}</p>
          </div>
          <div>
            <span>
              <em>{{ listItems[1].name }}</em>
            </span>
            <p>{{ listItems[1].value }}</p>
          </div>
          <div>
            <span>
              <em>{{ listItems[2].name }}</em>
            </span>
            <p>{{ listItems[2].value }}</p>
          </div>
          <div>
            <span>
              <em>{{ listItems[3].name }}</em>
            </span>
            <p>{{ listItems[3].value }}</p>
          </div>
          <div @click="getDataXy()">
            <span>
              <em>{{ listItems[4].name }}</em>
            </span>
            <p>
              {{ listItems[4].value }}
              <span></span>
            </p>
          </div>
        </div>
      </div>
      <div class="yingxiang">影响用户列表</div>
      <div class="yingXiangList" ref="ListRef">
        <div
          class="user-t"
          @touchstart.capture="touchStart"
          @touchend.capture="touchEnd"
        >
          <p>编号</p>
          <p>用户名称</p>
          <p>月用水量(m³)</p>
          <p>压力变化</p>
          <p>定位</p>
        </div>
        <!-- <div class="user-b"> -->
        <div class="bbbb">
          <!-- <swiper ref="mySwiper" :options="userOption2">
                  <swiper-slide v-for="(it,index) in data" :key="index">
                    <p>{{it.num}}</p>
                    <p>{{it.user | removeS}}</p>
                    <p>{{it.waters}}</p>
                    <p>{{it.pressure}}</p>
                    <div @click="getDataXy(it)">
                      <img src="../../../static/imag/PurpleIcon.png" alt />
                    </div>
                  </swiper-slide>
                </swiper> -->
                <div class="userDatasNull" v-if="userDatasNull">暂无数据</div>
          <div class="BggkList" v-else v-for="(it, index) in userDatas" :key="index">
            <p>{{ it.UserNum }}</p>
            <p>{{ it.UserName | removeS }}</p>
            <p>{{ it.Demand }}</p>
            <p>{{ it.Pressure }}</p>
            <div @click="getDataXy(it)">
              <img src="../../../static/imag/PurpleIcon.png" alt />
            </div>
          </div>
          <!-- <infinite-loading spinner="bubbles" @infinite="infiniteHandler">
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
          </infinite-loading> -->
        </div>
        <!-- </div> -->
      </div>
    </div>
    <van-popup
      v-model="PopupS"
      :close-on-click-overlay="false"
      get-container=".tubeBurst"
    >
      <van-loading type="spinner" color="#1989fa" />
    </van-popup>
    <van-popup
      class="LegendS"
      :style="{ height: '100%' }"
      position="right"
      v-model="LegendS"
      get-container="#app"
    >
      <div class="Basics" v-show="BasicsLegend">
        <!-- <div class="Basics" v-show="false"> -->
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
        <van-tabs v-model="active" @click="onClick">
          <van-tab
            v-for="(item, index) in options"
            :key="index"
            :title="item.text"
          ></van-tab>
        </van-tabs>
        <div v-show="legendValue == 0">
        <div class="pressureTr">
          <p>压力变化(m)</p>
          <p>管道长度(m)</p>
          <p>比例(%)</p>
        </div>
        <div class="pressureData">
          <div v-for="(item, index) in legendjson.listData" :key="index">
            <p>
              <span :style="{ background: item.color }"></span
              >{{ item.labelDisplayContent }}
            </p>
            <p>{{ item.pipeLengthContent }}</p>
            <p>{{ item.ratioContent }}</p>
          </div>
        </div>
        <h4>
          总和：
          <p>{{ legendjson.allPipeLength }}</p>
        </h4>
        </div>
        <!-- <van-dropdown-menu>
          <van-dropdown-item
            v-model="legendValue"
            :options="options"
            @change="legendChange"
          />
        </van-dropdown-menu> -->

        <div class="flowChange" v-show="legendValue == 1">
          <div class="pressureTr">
            <p>流量变化(m³/h)</p>
            <p>管道长度(m)</p>
            <p>比例(%)</p>
          </div>
          <div class="pressureData">
            <div v-for="(item, index) in legendjson.listDataPipe" :key="index">
              <p>
                <span :style="{ background: item.color }"></span
                >{{ item.labelDisplayContent }}
              </p>
              <p>{{ item.pipeLengthContent }}</p>
              <p>{{ item.ratioContent }}</p>
            </div>
          </div>
          <h4>
            总和：
            <p>{{ legendjson.allPipeLengthPipe }}</p>
          </h4>
        </div>
        <div class="currentSpeed" v-show="legendValue == 2">
          <div class="pressureTr">
            <p>流速变化(m³/h)</p>
            <p>管道长度(m)</p>
            <p>比例(%)</p>
          </div>
          <div class="pressureData">
            <div
              v-for="(item, index) in legendjson.listDataPipeVelocity"
              :key="index"
            >
              <p>
                <span :style="{ background: item.color }"></span
                >{{ item.labelDisplayContent }}
              </p>
              <p>{{ item.pipeLengthContent }}</p>
              <p>{{ item.ratioContent }}</p>
            </div>
            <h4>
              总和：
              <p>{{ legendjson.allPipeVelocityLengthPipe }}</p>
            </h4>
          </div>
        </div>
        <div class="flowTo" v-show="legendValue == 3">
          <div v-for="value in 2" :key="value">
            <span></span>
            <p></p>
          </div>
        </div>
        <!-- 图层控制 -->
        <h1>图层控制</h1>
          <div class="tckz" >
            <!-- 压力 -->
            <van-checkbox-group v-show="legendValue == 1 || legendValue == 2 || legendValue == 3" v-model="resultNode" direction="horizontal" @change="nodePlus">
              <van-checkbox shape="square"  icon-size="16px" name="a" >
                <p class="nodePlus">压力增加的节点</p>
              </van-checkbox>
              <van-checkbox shape="square" icon-size="16px" name="b">
                <p class="nodeReduce">压力减小的节点</p>
              </van-checkbox>
            </van-checkbox-group>
            <!-- 流量 -->
            <van-checkbox-group v-show="legendValue == 1 " v-model="resultLine" direction="horizontal" @change="linePlus">
              <van-checkbox shape="square" icon-size="16px" name="a">
                <p class="linePlus">流量增加的管线</p>
              </van-checkbox>
              <van-checkbox shape="square" icon-size="16px" name="b">
                <p class="lineReduce">流量减小的管线</p>
                </van-checkbox>
            </van-checkbox-group>
            <!-- 流速 -->
            <van-checkbox-group v-show="legendValue == 2 " v-model="velocity" direction="horizontal" @change="velocityPlus">
              <van-checkbox shape="square" icon-size="16px" name="a">
                <p class="linePlus">流速增加的管线</p>
              </van-checkbox>
              <van-checkbox shape="square" icon-size="16px" name="b">
                <p class="lineReduce">流速减小的管线</p>
                </van-checkbox>
            </van-checkbox-group>
          </div>
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
// import aaaaa from "../../../static/imag/PipeBurst/cv.png"
import maker from "../intelligence/redIcon.png";
import greenpin from "../../../static/imag/orangeIcon.png";
import bluePin from "../../../static/imag/blueIcon.png";
import axios from "axios";
import "swiper/css/swiper.css";
import $ from "jquery";
import Vue from "vue";
import {
  Divider,
  Dialog,
  Loading,
  Popup,
  Popover,
  DropdownMenu,
  DropdownItem,
  Tab,
  Tabs,
  Checkbox,
  CheckboxGroup
} from "vant";
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Popover);
Vue.use(Popup);
Vue.use(Loading);
Vue.use(Divider);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
import { loadModules } from "esri-loader";
import tileInfo from "../../components/arcgisforjsTest/tdt_data.js";
import urlClass from "../../components/js/UrlClass";
import global from "../../components/js/Global";
import drawClass from "../../components/arcgisforjsTest/DrawClass";
import drawClassPipeBurst from "../../components/js/DrawClassPipeBurst";
import PictureProperty from "../../components/js/PictureProperty";
import InfiniteLoading from "vue-infinite-loading";
import Bus from "../../utils/Bus";
import Attribute from "../../components/js/Attribute";
import EchatAtt from "../warn/EchatAttr"
import legendData from "../../components/js/legend";

export default {
  name: "tubeBurst",
  components: {
    [Dialog.Component.name]: Dialog.Component,
    InfiniteLoading,
    EchatAtt
  },
  filters: {
    removeS(msg) {
      // return "￥" + msg
      if (msg == undefined) {
      } else {
        return msg.replace(/\s+/g, "");
      }
    },
    toPercent(point) {
      if (point == 0) {
        return 0;
      }
      var str = Number(point * 100).toFixed();
      str += "%";
      return str;
    },
  },
  data() {
    return {
      userDatasNull:false,//暂无数据
      AttributePupup:true,
      showMap: false,
      EchartA: false,
      planTempCalVelocityLimit:null,
      planTempCalFlowLimit:null,
      pressureChangLimit:null,
      resultNode:['a','b'],
      resultLine:['a','b'],
      velocity:['a','b'],
      drawDataAll:null,
      active:0,
      Lskmjzb: 0.1,
      pipeR: 0,
      showPopover: false,
      legendValue: 0,
      options: [
        { text: "压力变化", value: 0 },
        { text: "流量变化", value: 1 },
        { text: "流速变化", value: 2 },
        { text: "流向变化", value: 3 },
      ],
      legendjson: {},
      BasicsLegend: true, //基础图例
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
      SimulationCalculation: false, //模拟计算图例
      legendData: null,
      LegendS: false, //图例层
      PopupS: false, //遮罩层
      flag: false,
      opert: false,
      Drainage: "1000",
      value: 1212,
      option: [
        { text: "10%", value: 0.1 },
        { text: "30%", value: 0.3 },
        { text: "60%", value: 0.6 },
        { text: "80%", value: 0.8 },
        { text: "100%", value: 1 },
      ],
      userOption2: {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        direction: "vertical",
        loop: true,
        slidesPerView: 7,
        initialSlide: 2,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      lationData: {},
      listItems: [
        // {name: "爆管泄水量",unit:'(m3/h)',value: '0',factory: '-'},
        { name: "影响用户数", unit: "(户)", value: "0", factory: null },
        { name: "影响最大水厂", unit: "", value: "", factory: null },
        { name: "水厂增加水量", unit: "(m3/h)", value: "0", factory: "-" },
        { name: "最大压降", unit: "(m)", value: "0", factory: "-" },
        { name: "最大压降点", unit: "(m)", value: "0", factory: "-" },
      ],
      arcgisAPI: null,
      view: null,
      arcgisView: null,
      arcgisExtent: null,
      isMapClickPipeBurst: false, //控制点击
      CloseValveAnalysisResult: [],
      parameter: {
        Demand: 1000,
        ElementId: 0,
        Type: 1,
        CanNotBeclosedValves: [],
        Time: 0,
        TableName: "",
        UserId: "",
        IsSave: false,
        CloseValveList: [],
      },
      pipeBurstPositionLayer: null,
      pipeBurstCloseValveLayer: null,
      planCalResultDirectionChangeLayer: null,
      flowLayer: null,
      pipeBurstNodeLayer: null,
      strengthLayer: null,
      sketchVM: null,
      drawLayer: null,
      drawSymbol: null,
      mapClick: false,
      mapClickgl:null,
      data: [
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0551",
          waters: "499416.00",
          pressure: "327526.72",
        },
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0552",
          waters: "499416.00",
          pressure: "327526.72",
        },
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0543",
          waters: "499416.00",
          pressure: "327526.72",
        },
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0554",
          waters: "499416.00",
          pressure: "327526.72",
        },
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0555",
          waters: "499416.00",
          pressure: "327526.72",
        },
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0556",
          waters: "499416.00",
          pressure: "327526.72",
        },
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0557",
          waters: "499416.00",
          pressure: "327526.72",
        },
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0558",
          waters: "499416.00",
          pressure: "327526.72",
        },
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0559",
          waters: "499416.00",
          pressure: "327526.72",
        },
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0510",
          waters: "499416.00",
          pressure: "327526.72",
        },
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0511",
          waters: "499416.00",
          pressure: "327526.72",
        },
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0512",
          waters: "499416.00",
          pressure: "327526.72",
        },
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0513",
          waters: "499416.00",
          pressure: "327526.72",
        },
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0514",
          waters: "499416.00",
          pressure: "327526.72",
        },
        {
          url: "../../../static/imag/position2.png",
          user: "李欣然",
          num: "SZJZK0515",
          waters: "499416.00",
          pressure: "327526.72",
        },
      ],
      userDatas: [], //查询结果分页
      currentPage: 0,
      cont: 0,
      pageSize: 0,
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
    nodePlus(names){
      this.pipeBurstNodeLayer.removeAll();
      var drawSmall;
      var drawBig;
      var selectTypeMain = "";
      if(names.includes('a') && names.length == "1"){
        drawBig = true
        drawSmall = false
      }
      if(names.includes('b') && names.length == "1"){
        drawSmall = true
        drawBig = false
      }
      if(names.length == "2"){
        drawSmall = true
        drawBig = true
      }
      if(names.length == "0"){
        drawSmall = false
        drawBig = false
      }
      console.log(drawSmall,drawBig)
      drawClass.DrawPressureChange(this.drawDataAll.minP, this.drawDataAll.maxP, this.drawDataAll.NodePressure, 
      global.diffusionLevel, global.pressureChangColorNew, global.isDisplay.slice(0), this.pipeBurstNodeLayer,
      true, selectTypeMain, "PlanTempCalculate", drawBig, drawSmall,this.pressureChangLimit);
    },
    linePlus(names){
      this.flowLayer.removeAll();
      var drawSmall;
      var drawBig;
      var selectTypeMain = "";
      if(names.includes('a') && names.length == "1"){
        drawBig = true
        drawSmall = false
      }
      if(names.includes('b') && names.length == "1"){
        drawSmall = true
        drawBig = false
      }
      if(names.length == "2"){
        drawSmall = true
        drawBig = true
      }
      if(names.length == "0"){
        drawSmall = false
        drawBig = false
      }
      console.log(drawSmall,drawBig)
      drawClass.DrawPipeFlowChange(this.drawDataAll.min, this.drawDataAll.max, this.drawDataAll.allData, 
      global.diffusionLevel, global.pipeChangColorNew, global.isDisplay.slice(0), this.flowLayer,
      true, selectTypeMain, "PlanTempCalculate", drawBig, drawSmall,this.planTempCalFlowLimit);
    },
    velocityPlus(names){
      this.strengthLayer.removeAll();
      var drawSmall;
      var drawBig;
      var selectTypeMain = "";
      if(names.includes('a') && names.length == "1"){
        drawBig = true
        drawSmall = false
      }
      if(names.includes('b') && names.length == "1"){
        drawSmall = true
        drawBig = false
      }
      if(names.length == "2"){
        drawSmall = true
        drawBig = true
      }
      if(names.length == "0"){
        drawSmall = false
        drawBig = false
      }
      console.log(drawSmall,drawBig)
      drawClass.DrawPipeFlowChange(this.drawDataAll.minV, this.drawDataAll.maxV, this.drawDataAll.strengthData, 
      global.diffusionLevel, global.pipeChangColorNew, global.isDisplay.slice(0), this.strengthLayer,
      true, selectTypeMain, "PlanTempCalculate", drawBig, drawSmall,this.planTempCalVelocityLimit);
    },
    onClick(name, title) {
      console.log(name, title);
      this.legendValue = name;
      if (name == 1) {
        this.strengthLayer.visible = false;
        this.planCalResultDirectionChangeLayer.visible = false;
        this.flowLayer.visible = true;
      } else if (name == 2) {
        this.strengthLayer.visible = true;
        this.planCalResultDirectionChangeLayer.visible = false;
        this.flowLayer.visible = false;
      } else if (name == 3) {
        this.strengthLayer.visible = false;
        this.planCalResultDirectionChangeLayer.visible = true;
        this.flowLayer.visible = false;
      }
    },
    //图例
    legend() {
      this.LegendS = true;
    },
    legendChange(value) {
      console.log(value);
    },
    onSelect(option) {
      console.log(option.value);
      this.Lskmjzb = option.value;
      var r = this.pipeR;
      console.log(r);
      this.parameter.Demand = (
        Math.pow(2 * 9.8 * 18, 0.5) *
        3600 *
        0.6 *
        this.Lskmjzb *
        (Math.PI * r * r)
      ).toFixed(2);
      this.Drainage = this.parameter.Demand;
    },
    go() {
      this.$router.push("/shopcart");
    },
    // infiniteHandler($state) {
    //   this.cont += 10;
    //   this.pageSize++;
    //   if (this.pageSize <= this.currentPage) {
    //     this.userDatas.push(...this.data.slice(this.cont, this.cont + 10));
    //     $state.loaded();
    //   } else {
    //     $state.complete();
    //   }
    //   console.log(this.cont);
    //   console.log(this.currentPage);
    // },
    //定位
    getDataXy(item) {
      console.log(item);
      var markr = greenpin;
      if (item == undefined) {
        item = this.lationData;
        markr = bluePin;
      }
      var coordinateX = item.X;
      var coordinateY = item.Y;
      console.log(coordinateX, coordinateY);
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
        url: markr,
        width: 16,
        height: 32,
        yoffset: 16,
      };
      var gra1 = new this.arcgisAPI.Graphic();
      gra1.geometry = point;
      gra1.symbol = symbol;
      this.drawSymbol.add(gra1);
    },
    changeStyle() {
      this.BasicsLegend = true;
      this.SimulationCalculation = false;
      this.userDatas = [];
      this.$refs.operation.style.bottom = -11.57 + "rem";
      this.$refs.mainHeight.style.width = "100%";
      this.$refs.mainHeight.style.height = "100%";
      this.SimulationCalculation = false;
      this.planCalResultDirectionChangeLayer.removeAll();
      this.flowLayer.removeAll();
      this.pipeBurstNodeLayer.removeAll();
      this.strengthLayer.removeAll();
      console.log(this.getRanNum());
      var aa = this.getRanNum();
      this.TableName = aa;
      this.opert = !this.opert;
      console.log(this.flag);
      this.isMapClickPipeBurst = !this.isMapClickPipeBurst;
      console.log(this.isMapClickPipeBurst);
      if (this.isMapClickPipeBurst) {
        this.AttributePupup = false
      }else{
        this.AttributePupup = true
      }
      this.pipeBurstPositionLayer.removeAll();
      console.log(this.parameter.ElementId);
      this.parameter.ElementId = 0;
      this.parameter.TableName = this.TableName;
    },
    // dropdown() {
    //   console.log(this.value)
    //   this.Drainage = this.value
    // },
    up() {
      // debugger
      // CloseValveAnalysis
      var self = this;
      if (this.parameter.ElementId == "") {
        Dialog.confirm({
          title: "提示",
          message: "请先选择爆管点",
        })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
          });
      } else {
        this.PopupS = true;
        console.log(this.parameter);
        console.log("CloseValveAnalysis", JSON.stringify(this.parameter));
        if (this.parameter.Type == "0") {
          this.api.GetTubeBurst.GetWorkingConditionSimulationNode(
            this.parameter
          ).then((res) => {
            // debugger
            this.GetLegendCustomerDataReturn(res);
          });
          // axios.post("http://112.64.170.158:8013/Service1.svc/Rest/WorkingConditionSimulationNode", JSON.stringify(this.parameter),
          //     global.axiosHeaders
          //     ).then(this.GetLegendCustomerDataReturn)
          //     .catch(function(error) {
          //         console.log(error);
          //         self.PopupS = false
          //     });
        } else {
          this.api.GetTubeBurst.GetWorkingConditionSimulationPipe(
            this.parameter
          ).then((res) => {
            // debugger
            this.GetLegendCustomerDataReturn(res);
          });
          // axios.post("http://112.64.170.158:8013/Service1.svc/Rest/WorkingConditionSimulationPipe",JSON.stringify(this.parameter),
          //     global.axiosHeaders
          //     ).then(this.GetLegendCustomerDataReturn)
          //     .catch(function(error) {
          //         console.log(error);
          //         self.PopupS = false
          //     });
        }
        if (this.flag == false) {
        }
      }
      console.log(this.flag);
    },
    GetLegendCustomerDataReturn: function (response) {
      this.SimulationCalculation = true;
      this.BasicsLegend = false; //基础图例与模拟计算图例切换
      var resultTemp = response;
      var errcode = response.Code;
      console.log("错误代码", response);
      if (String(errcode) == "0") {
        var result = resultTemp.Response;
        console.log("工况模拟", result);
        // this.MaxPressurePoint = result.MaxPressurePoint;
        this.lationData = result.MaxPressurePoint;
        var object = new Object();
        object.min = result.MinFlow;
        object.max = result.MaxFlow;
        object.DownHeadMax = result.DownHeadMax;
        object.minP = result.MinPressure;
        object.maxP = result.MaxPressure;
        object.TableName = this.parameter.TableName;
        object.minV = result.MinStrength;
        object.maxV = result.MaxStrength;
        this.drawData = object;
        object.data = result;
        result.TableName = this.parameter.TableName;
        var DownHeadMax = object.DownHeadMax;
        // this.listItems[0].value = this.parameter.Demand;
        this.listItems[0].value = result.EffectUser.length;
        this.listItems[1].value = object.data.TankUpDemandMaxLabel;
        this.listItems[2].value = Number(object.data.TankUpDemandMax).toFixed(
          2
        );
        this.listItems[3].value = Number(object.data.DownHeadMax).toFixed(2);
        this.listItems[4].value = object.data.MaxPressureId;
        console.log(this.listItems);
        // this.PopUpResultWindow(result);
        this.planTempCalculateResultLimit = {
          MaxPressure: result.MaxPressure,
          MinPressure: Number(result.MinPressure) * 0.3,
          MaxFlow: result.MaxFlow,
          MinFlow: Number(result.MinFlow) * 0.3,
          MaxStrength: result.MaxStrength,
          MinStrength: Number(result.MinStrength) * 0.3,
          levelMy: 5,
          TableName:this.TableName
        };
        console.log('[ planTempCalculateResultLimit ]', this.planTempCalculateResultLimit)
        axios
          .post(urlClass.axiosUrl + "PlanTempGetResultData",
            JSON.stringify(this.planTempCalculateResultLimit),
            global.axiosHeaders
          )
          .then(this.PlanTempCalculateGetResult);
      } else if (String(errcode) == "-1") {
        Dialog.confirm({
          title: "提示",
          message: "服务器剩余资源无法满足计算，请稍后计算",
        })
          .then(() => {
            this.PopupS = false
          })
          .catch(() => {
            // on cancel
          });
      }
    },
    PlanTempCalculateGetResult: function (response) {
      this.flowLayer.removeAll();
      this.pipeBurstNodeLayer.removeAll();
      this.strengthLayer.removeAll();
      this.planCalResultDirectionChangeLayer.removeAll();
      // debugger
      var dataTemp = response.data.Response;
      console.log(dataTemp);
      this.data = dataTemp.EffectUser;
      // this.userDatas = dataTemp.EffectUser.slice(0, 10);
      this.userDatas = dataTemp.EffectUser;
      if (this.userDatas == null) {
        this.userDatasNull = true
      }else{
        this.userDatasNull = false
        this.currentPage = Math.ceil(this.data.length / 10);
      }
      // this.currentPage = Math.ceil(this.data.length / 10);
      this.$refs.operation.style.transition = "bottom 0.6s";
      //   this.$refs.operation.style.bottom = -434 + "px";
      this.$refs.operation.style.bottom = "-4.34rem";
      this.$refs.ListRef.style.height = 5 + "rem";
      this.$refs.mainHeight.style.height =
        this.screenHeight - this.operationHeight + 4.14 + "rem";
      console.log("隐藏");
      this.flag = true;
      this.PopupS = false;
      var drawData = {
        NodePressure: dataTemp.NodePressure,
        direction: dataTemp.PipeDirection,
        strengthData: dataTemp.PipeStrength,
        allData: dataTemp.PipeFlow,
        maxP: this.planTempCalculateResultLimit.MaxPressure,
        minP: this.planTempCalculateResultLimit.MinPressure,
        max: this.planTempCalculateResultLimit.MaxFlow,
        min: this.planTempCalculateResultLimit.MinFlow,
        maxV: this.planTempCalculateResultLimit.MaxStrength,
        minV: this.planTempCalculateResultLimit.MinStrength,
        levelMy: this.planTempCalculateResultLimit.levelMy,
        TableName: this.parameter.TableName,
      };
      this.drawDataAll = drawData
      console.log(drawData);
      var pressureDisplays = global.isDisplay.slice(0);
      var flowDisplays = global.isDisplay.slice(0);
      var strenghtDisplay = global.isDisplay.slice(0);
      var pressureLimitTemp = this.GetLimit(//
        drawData.minP,
        drawData.maxP,
        drawData.levelMy
      );
      var pressureChangLimit = pressureLimitTemp.slice(0);
       this.pressureChangLimit = pressureChangLimit;
      global.pressureChangLimit = pressureChangLimit.slice(0);

      var planTempCalFlowTemp = this.GetLimit(//
        drawData.min,
        drawData.max,
        drawData.levelMy
      );
      var planTempCalFlowLimit = planTempCalFlowTemp.slice(0);
      this.planTempCalFlowLimit= planTempCalFlowLimit;
      var planTempCalVelocityTemp = this.GetLimit(//
        drawData.minV,
        drawData.maxV,
        drawData.levelMy
      );
      var planTempCalVelocityLimit = planTempCalVelocityTemp.slice(0);

      var tableNameMain = drawData.TableName;
      var legendDatas = new Object();
      this.planTempCalVelocityLimit = planTempCalVelocityLimit
      legendDatas = {
        planTempCalFlowLimit: planTempCalFlowLimit,
        planTempCalVelocityLimit: planTempCalVelocityLimit,
        tableNameMain: tableNameMain,
        type: true,
        typeName: "PipeBurst",
      };
      this.legendData = legendDatas;
      console.log(this.legendData);
      Bus.$emit("legendData", this.legendData);
      // legendData.LegendMainPlanTempCalPipe(planTempCalFlowLimit,planTempCalVelocityLimit,tableNameMain,true,"PipeBurst");
      legendData.LegendMainPlanTempCalPipe(
        planTempCalFlowLimit,
        planTempCalVelocityLimit,
        tableNameMain,
        true,
        "PipeBurst",
        global.pipeChangColorNew,
        global.pressureChangColorNew
      );
      Bus.$on("LegendDisplay", (res) => {
        this.legendjson = res;
      });
      Bus.$on("LegendDisplay1", (res) => {
        // this.legendjson = res
      });
      var limitFlow = drawClass.DrawPipeFlowChange(
        drawData.min,
        drawData.max,
        drawData.allData,
        drawData.levelMy,
        global.pipeChangColorNew,
        pressureDisplays,
        this.flowLayer,
        true,
        "",
        "PlanTempCalculate",
        true,
        true,
        planTempCalFlowLimit
      );
      drawClass.MapResultDataRangeZoom([this.flowLayer], this.view);
      var limitPressure = drawClass.DrawPressureChange(
        drawData.minP,
        drawData.maxP,
        drawData.NodePressure,
        drawData.levelMy,
        global.pressureChangColorNew,
        flowDisplays,
        this.pipeBurstNodeLayer,
        true,
        "",
        "PlanTempCalculate",
        true,
        true,
        pressureChangLimit
      );
      drawClass.MapResultDataRangeZoom([this.flowDisplays], this.view);
      this.strengthLayer.visible = false;
      var planTempCalVelocityLimitTemp = drawClass.DrawPipeFlowChange(
        drawData.minV,
        drawData.maxV,
        drawData.strengthData,
        drawData.levelMy,
        global.pipeChangColorNew,
        strenghtDisplay,
        this.strengthLayer,
        true,
        "",
        "PlanTempCalculate",
        true,
        true,
        planTempCalVelocityLimit
      );
      this.planCalResultDirectionChangeLayer.visible = false;
      drawClass.MapResultDataRangeZoom([this.strenghtDisplay], this.view);
      drawClass.DrawPlanTempCalDirectionChange(
        drawData.direction,
        this.planCalResultDirectionChangeLayer,
        global.planCalTempDirectionChangeColor,
        global.planCalTempDirectionChangeSize,
        global.triangleColor,
        global.triangleSize
      );
      drawClass.MapResultDataRangeZoom(
        [this.planCalResultDirectionChangeLayer],
        this.view
      );
    },
    /**
     * 获取不同分级
     * @param {*} min
     * @param {*} max
     * @param {*} levelTemp
     */
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
    aaa(data) {
      // debugger
      var self = this;
      this.opert = false;
      this.isMapClickPipeBurst = false;
      console.log(this.parameter.ElementId);
      this.parameter.ElementId = data.ElementID;
      this.parameter.Type = data.ElementTypeId;
      this.parameter.ElementidNodeTemp = data.ElementidNodeTemp;
      this.parameter.Point = data.Point;
      // this.parameter.Demand = this.value;
      this.parameter.IsSave = true;
    },
    touchStart(e) {
      //关阀
      this.startY = e.touches[0].clientY;
      // console.log(this.startY)
    },
    touchEnd(e) {
      //关阀
      this.endY = e.changedTouches[0].clientY;
      //   console.log(this.endY)
      var moveY = this.endY - this.startY;
      // console.log(moveY);
      //   var positionB1 = -434;
      //   var positionB2 = -156;
      var positionB1 = -11.57;
      var positionB2 = -4.34;
      var positionB3 = 0;
      if (this.userDatas == null || this.userDatas.length > 0) {
        this.$refs.operation.style.transition = "bottom 0.6s";
        this.searchMove(
          moveY,
          positionB1,
          positionB2,
          positionB3,
          this.$refs.operation
        );
      }
    },
    /**
     *todo关阀搜索兼容版上滑下滑事件？
     */
    searchMove(moveY, positionB1, positionB2, positionB3, aa) {
      //关阀
      var gao = aa.style.bottom;
      // console.log(gao);
      if (moveY > 0 && Math.abs(moveY) > 20 && gao == positionB2 + "rem") {
        this.$refs.operation.style.bottom = positionB1 + "rem";
        this.$refs.mainHeight.style.width = "100%";
        this.$refs.mainHeight.style.height = "100%";
        console.log(1);
      } else if (
        moveY < 0 &&
        Math.abs(moveY) > 20 &&
        gao == positionB2 + "rem"
      ) {
        aa.style.bottom = 0;
        this.$refs.ListRef.style.height = 10 + "rem";
        console.log(2);
      } else if (
        moveY > 0 &&
        Math.abs(moveY) > 20 &&
        gao == positionB3 + "px" &&
        moveY < 287
      ) {
        this.$refs.mainHeight.style.height =
          this.screenHeight - this.operationHeight - positionB2 + "rem";
        aa.style.bottom = positionB2 + "rem";
        this.$refs.ListRef.style.height = 5 + "rem";
        console.log(3);
      } else if (moveY > 0 && gao == positionB3 + "px" && moveY > 287) {
        console.log(4);
        this.$refs.mainHeight.style.width = "100%";
        this.$refs.mainHeight.style.height = "100%";
        aa.style.bottom = positionB1 + "rem";
      } else if (
        moveY < 0 &&
        Math.abs(moveY) > 20 &&
        gao == positionB1 + "rem" &&
        moveY > -156
      ) {
        console.log(5);
        this.$refs.ListRef.style.height = 5 + "rem";
        aa.style.bottom = positionB2 + "rem";
        this.$refs.mainHeight.style.height =
          this.screenHeight - this.operationHeight - positionB2 + "rem";
      } else if (moveY < 0 && gao == positionB1 + "rem" && moveY < -156) {
        console.log(6);
        aa.style.bottom = 0;
        this.$refs.ListRef.style.height = 10 + "rem";
      }
    },
    //获取结果与数据库匹配的模拟时间
    JudgeUpdateGlobalFinishTime(timeTemp) {
      var self = this;
      console.log("JudgeUpdateGlobalFinishTime", JSON.stringify(timeTemp));
      axios
        .post(
          urlClass.axiosUrl + "JudgeUpdateGlobalFinishTime",
          JSON.stringify(timeTemp),
          global.axiosHeaders
        )
        .then(function (respone) {
          console.log(respone);
          global.time = respone.data.Response;
          console.log("可以模拟计算的时间", global.time);
          self.parameter.Time = global.time;
        });
    },
    getRanNum() {
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
    this.screenHeight = window.screen.height / 37.5;
    this.operationHeight = this.$refs.operation.offsetHeight / 37.5;
    console.log(this.flag);
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
          IdentifyParameters:IdentifyParameters,
          IdentifyTask:IdentifyTask
        };
        this.arcgisView = { MapView: MapView };
        this.arcgisExtent = { Extent: Extent };
        drawClassPipeBurst.setArcgisforAPI(this.arcgisAPI);
        drawClass.setArcgisforAPI(this.arcgisAPI);
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
        this.pipeBurstPositionLayer = new GraphicsLayer();
        this.pipeBurstCloseValveLayer = new GraphicsLayer();
        this.drawLayer = new GraphicsLayer();
        this.planCalResultDirectionChangeLayer = new GraphicsLayer();
        this.flowLayer = new GraphicsLayer();
        this.pipeBurstNodeLayer = new GraphicsLayer();
        this.strengthLayer = new GraphicsLayer();
        this.drawSymbol = new GraphicsLayer();
        this.mapClickgl = new GraphicsLayer();

        map.add(this.pipeBurstCloseValveLayer);
        map.add(this.drawLayer);
        map.add(this.planCalResultDirectionChangeLayer);
        map.add(this.flowLayer);
        map.add(this.pipeBurstPositionLayer);
        map.add(this.pipeBurstNodeLayer);
        map.add(this.strengthLayer);
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
        this.view.on("click", function (event) {
          console.log(self.isMapClickPipeBurst);
          if (self.isMapClickPipeBurst) {
            IdentifyMain(event.mapPoint);
          }
          if (self.AttributePupup) {
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
        //初始化
        this.view.ui._removeComponents(["attribution", "zoom"]);
        this.view.popup.dockEnabled = false;
        this.view.popup.collapseEnabled = false;
        this.view.popup.dockOptions = { buttonEnabled: false, breakpoint: false, position: "bottom-left" };//禁用停靠
        this.view.popup.actions = null;
        //点击获取点管网id
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
          console.log(evt);
          var point = {};
          var elemetidTemp = 0;
          var elementType = 0;
          var elementidNodeTemp = 0;
          var feature;
          if (evt.results.length > 0) {
            // debugger
            var identifyResult = evt.results[0];
            feature = identifyResult.feature;
            var attributeTemp = feature.attributes;
            // (Math.pow((2*9.8*18),0.5)*3600*0.6*k*(Math.PI*r*r)).toFixed(2);
            if (feature.geometry.type == "point") {
              console.log("点到了点");
              point = feature.geometry;
              elemetidTemp = attributeTemp.ElementId;
              console.log(elemetidTemp);
              axios
                .post( urlClass.axiosUrl + "GetPipeDiameterByJunctionId",
                  JSON.stringify(elemetidTemp),
                  global.axiosHeaders
                )
                .then(function (response) {
                  // debugger
                  var result = response.data;
                  if (result && String(result.Code) == "0") {
                    // self.Drainage  = result.Response;
                    // self.parameter.Demand = self.Drainage;
                    let r = result.Response / 2000;
                    self.pipeR = r;
                    self.Drainage = (
                      Math.pow(2 * 9.8 * 18, 0.5) *
                      3600 *
                      0.6 *
                      self.Lskmjzb *
                      (Math.PI * r * r)
                    ).toFixed(2);
                    self.parameter.Demand = self.Drainage;
                  } else {
                    console.log("错误信息:", result.Message);
                  }
                });
              elementidNodeTemp = attributeTemp.ElementId;
              console.log(elemetidTemp, point);
              elementType = 0;
            } else if (feature.geometry.type == "polyline") {
              console.log("点到了线");
              var r = attributeTemp.Physical_PipeDiameter / 2000;
              self.pipeR = r;
              var Bgxsl = (
                Math.pow(2 * 9.8 * 18, 0.5) *
                3600 *
                0.6 *
                self.Lskmjzb *
                (Math.PI * r * r)
              ).toFixed(2);
              self.Drainage = Bgxsl;
              self.parameter.Demand = Bgxsl;
              elemetidTemp = attributeTemp.ElementId;
              var paths = feature.geometry.paths[0];
              var point1 = paths[0];
              var point2 = paths[1];
              elementidNodeTemp = attributeTemp.StartNodeID;
              var x = (Number(point1[0]) + Number(point2[0])) / 2;
              var y = (Number(point1[1]) + Number(point2[1])) / 2;
              point = Point(
                x,
                y,
                new SpatialReference({ wkid: global.spatialReference })
              );
              elementType = 1;
            } else {
              return;
            }
            PositionSupplyPathNode(point, self.pipeBurstPositionLayer);
            self.aaa({
              ElementID: elemetidTemp,
              ElementTypeId: elementType,
              Point: point,
              ElementidNodeTemp: elementidNodeTemp,
            });
            console.log(elemetidTemp, point);
          }
        }
        //添加点
        function PositionSupplyPathNode(point, layerTemp) {
          layerTemp.removeAll();
          var symbol = {
            type: "picture-marker", // autocasts as new PictureMarkerSymbol()
            url: maker,
            width: 16,
            height: 32,
            yoffset: 16,
          };
          var gra1 = new Graphic(point, symbol);
          layerTemp.add(gra1);
        }

        function addToMap(evt) {
          var symbol = new SimpleFillSymbol();
          var graphic = new Graphic(evt.graphic.geometry, symbol);
          QueryToolBar(graphic.geometry);
        }
        function QueryToolBar(geometry) {
          var hour = 0; //结果时间
          var field = "Result_Flow_" + hour; //查询的字段
          var where = "Physical_PipeDiameter >= 300"; //查询条件
          var query = new Query();
          query.where = where;
          query.returnGeometry = true;
          query.outFields = ["ElementId", field];
          query.outSpatialReference = view.SpatialReference;
          query.returnGeometry = true;
          query.outSpatialReference = new SpatialReference({
            wkid: global.spatialReference,
          });
          query.geometry = geometry;
          query.where = "1=1";
          query.outFields = ["ElementId", "ElementTypeId"];
          var queryTask = new QueryTask(
            urlClass.baseMapUrl + "/" + global.layerId.EN_JUNCTION
          );
          queryTask.execute(query).then(function (re) {
            QueryToolBarPipeReturn(re, query);
          }, errorReturn);
        }
        function errorReturn(error) {
          console.log("errorReturn", error);
        }
        function QueryToolBarPipeReturn(re, query) {
          // console.log('re',re)
          if (re.features.length != 0) {
            var idListTemp = [];
            var elemetidTemp = re.features[0].attributes.ElementId;
            var elementType = 0;
            for (var i = 0; i < re.features.length; i++) {
              var objTemp = re.features[i];
              idListTemp.push(objTemp.attributes.ElementId);
            }
            self.PipeBurstMapClickReturnDraw({
              ElementID: elemetidTemp,
              ElementTypeId: elementType,
              IdList: idListTemp,
            });

            var queryTask = new QueryTask(
              urlClass.baseMapUrl + "/" + global.layerId.EN_VALVE
            );
            queryTask.execute(query).then(QueryToolBarTcvReturn, errorReturn);
          }
        }
        function QueryToolBarTcvReturn(re) {
          var idList = [];
          for (var i = 0; i < re.features.length; i++) {
            var obj = re.features[i].attributes;
            idList.push(obj.ElementId);
          }
          self.QueryToolBarTcvReturn({ IdList: idListTemp });
        }
      }
    );

    var hourTemp = new Date().getHours();
    this.JudgeUpdateGlobalFinishTime(hourTemp);
  },
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  },
};
</script>
<style scoped lang="less">
@import "./tubeBurst.less";
@r:1rem /37.5;
.tubeBurst /deep/ .van-popup {
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
