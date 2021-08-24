<template>
  <div class="intelligence">
    <p id="statusBar"></p>
    <div class="nav">
      <p @click="go">
        <img src="../../../static/imag/return.png" alt />
        <span>返回</span>
      </p>
      <h4>关阀处置</h4>
      <p></p>
    </div>
    <div class="main">
      <p @click="legend()">
        <span class="iconfont icontuli"></span>
      </p>
      <img class="zzImg" src="../../../static/imag/mask.png" alt="" />
      <img class="boxShdow" src="../../../static/imag/boxshdow.png" v-show="tabTwo" alt="">
      <div class="tabTop" v-show="tabTwo">
      <!-- <div class="tabTop" v-show="true"> -->
        <!-- 测试 -->
        <div
          v-for="(item, index) in tabTop"
          :key="index"
          :class="{ topTab: change == index }"
          @click="tabClick(index)"
        >
          {{ item }}
        </div>
      </div>
      <div ref="mainHeight" id="map" style="width: 100%; height: 100%"></div>
    </div>
    <div class="operation" ref="operation" v-show="oper">
      <!-- <img class="btn" src="../../../static/imag/buttom.png" alt=""> -->
      <div class="btn" @click="up">
        <p>关阀搜索</p>
      </div>
      <!-- <v-touch @swipeup="nextUp" @swipedown="nextDown"> -->
      <div
        class="operation-t"
        @touchstart.capture="touchStart"
        @touchend.capture="touchEnd"
      >
        <div class="top-l">
          <div
            v-for="(item, index) in top"
            :key="index"
            @click="changeStyle(index)"
            :class="{ active: checkedGroup.indexOf(index) > -1 }"
          >
            <span :class="{ star: checkedGroup.indexOf(index) > -1 }"></span>
            <p>{{ item.name }}</p>
          </div>
        </div>
        <div class="top-r">
          <van-switch
            size="15px"
            v-model="checked"
            @change="swit"
            active-color="#4664E3"
            inactive-color="#151824"
          />
          <p>快速停水</p>
        </div>
      </div>
      <!-- </v-touch> -->
      <div class="tab">
        <!-- 遮罩层 -->
        <ul>
          <li
            v-for="(item, index) in who"
            :key="index"
            @click="tab(index)"
            :class="{ select: index == num }"
          >
            <span>{{ item.name }}</span>
            <p>
              {{ item.num }}
              <span>个</span>
            </p>
          </li>
        </ul>
        <!-- 未展开部分 -->
        <!-- <div class="swiper">
						<div class="swiper-l1">
							<img src="../../../static/imag/circle.png" />
							<img class="line" src="../../../static/imag/line.png" alt="">
        </div>-->
        <!-- <div class="swiper-r"> -->
        <div class="tabs" v-show="0 == num">
          <div class="zzTop" v-show="num == '0'"></div>
          <div v-show="num == '0' && zzB == true" class="zzBottom"></div>
          <div class="tabss" style="height: 100%; width: 100%" v-show="short">
            <div class="swiper-l1">
              <img src="../../../static/imag/circle.png" />
              <img class="line" src="../../../static/imag/line.png" alt />
            </div>
            <swiper ref="mySwiper" :options="swiperOptions">
              <swiper-slide v-for="(ite, i) in arr" :key="i">
                <div class="slide" @click="getDataDraw1(ite,i)">
                  <div class="slide-t">
                    <p>
                      <img src="../../../static/imag/valve.png" alt />
                      <span>编号：{{ ite.Id }}</span>
                    </p>
                    <p>
                      <span>失灵</span>
                      <van-switch
                        size="15px"
                        active-color="#4664E3"
                        inactive-color="#151824"
                        @change="IsFailureClick(ite)"
                        v-model="ite.IsFailure"
                      />
                    </p>
                  </div>
                  <div class="slide-b">
                    <p>
                      口径：
                      <span>{{ ite.Diameter }}</span
                      >&nbsp;&nbsp;mm
                    </p>
                    <p>
                      开度：
                      <span>0</span>&nbsp;&nbsp;变为&nbsp;&nbsp;
                      <span>0</span>
                    </p>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
          <div class="tabs0" style="height: 100%; width: 100%" v-show="long">
            <div class="swiper-l1">
              <img src="../../../static/imag/circle.png" />
              <img class="line" src="../../../static/imag/line.png" alt />
            </div>
            <swiper ref="mySwiper" :options="swiperOption" id="aaaa">
              <swiper-slide v-for="(ite, i) in arr" :key="i">
                <div class="slide" @click="getDataDraw1(ite,i)">
                  <div class="slide-t">
                    <p>
                      <img src="../../../static/imag/valve.png" alt />
                      <span>编号：{{ ite.Id }}</span>
                    </p>
                    <p>
                      <span>失灵</span>
                      <van-switch
                        size="15px"
                        active-color="#4664E3"
                        inactive-color="#151824"
                        @change="IsFailureClick(ite)"
                        v-model="ite.checke"
                      />
                    </p>
                  </div>
                  <div class="slide-b">
                    <p>
                      口径：
                      <span>{{ ite.Diameter }}</span
                      >&nbsp;&nbsp;mm
                    </p>
                    <p>
                      开度：
                      <span>{{ ite.openIng }}</span
                      >&nbsp;&nbsp;变为&nbsp;&nbsp;
                      <span>{{ ite.become }}</span>
                    </p>
                  </div>
                </div>
                <em></em>
              </swiper-slide>
            </swiper>
          </div>
        </div>
        <div class="user" v-show="1 == num">
          <!-- <div class="user"> -->
          <div class="user-t">
            <div>编号</div>
            <div>用户名称</div>
            <div @click="sortWater">
              月用水量(m³)
              <p>
                <span :class="{ Ascending: Ascending }"></span>
                <span :class="{ Descending: Descending }"></span>
              </p>
            </div>
            <div @click="sortPressure">
              压力(m)
              <p>
                <span :class="{ Ascending: Ascendings }"></span>
                <span :class="{ Descending: Descendings }"></span>
              </p>
            </div>
            <div>地址</div>
          </div>
          <div class="user-b" ref="ListRef">
            <div class="zusj" v-if="arra.length == '0'">暂无数据</div>
            <div class="user-bs">
              <div class="user-bc" v-for="(it, index) in arra" :key="index">
                <p>{{ it.UserNum }}</p>
                <p>{{ it.UserName }}</p>
                <p>{{ it.Demand }}</p>
                <p>{{ it.Pressure }}</p>
                <p @click="getDataDraw1(it,index)">
                  <img src="../../../static/imag/PurpleIcon.png" alt />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="Hydrant" v-show="2 == num">
          <div class="user-t">
            <p>消防栓编号</p>
            <p>消防栓类型</p>
            <p>口径(mm)</p>
            <p>地址</p>
            <p>定位</p>
          </div>
          <div class="user-b">
            <div class="zusj" v-if="arraa.length == '0'">暂无数据</div>
            <div class="user-bs">
              <div class="user-bc" v-for="(it, index) in arraa" :key="index">
                <p>{{ it.ElementId }}</p>
                <p>{{ it.UserName }}</p>
                <p>{{ it.Diameter }}</p>
                <p>{{ it.Addr }}</p>
                <div @click="getDataDraw1(it,index)">
                  <img src="../../../static/imag/PurpleIcon.png" alt />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 模拟计算 -->
    <div class="calculation" v-show="lation" ref="calculation">
      <!-- <div class="calculation" v-show="true" ref="calculation"> -->
      <div class="btn" @click="upp">
        <p>模拟计算</p>
      </div>
      <div class="calc">
        <div
          class="calc-t"
          @touchstart.capture="touchStart"
          @touchend.capture="touchEnd"
        >
          <!-- <div v-for="(item,index) in lationData" :key="index">
            <span>
              <em>{{item.name}}</em>
            </span>
            <p>{{item.data}}</p>
          </div> -->
          <div class="calc-tc">
            <!--   -->
            <!-- <div class="lationDataNull" v-if="lationDataNull">暂无数据</div> -->
            <div>
              <span>
                <em>{{ lationData[0].name }}</em>
              </span>
              <p>{{ lationData[0].data }}</p>
            </div>
            <div>
              <span>
                <em>{{ lationData[1].name }}</em>
              </span>
              <p>{{ lationData[1].data }}</p>
            </div>
            <div>
              <span>
                <em>{{ lationData[2].name }}</em>
              </span>
              <p>{{ lationData[2].data }}</p>
            </div>
            <div>
              <span>
                <em>{{ lationData[3].name }}</em>
              </span>
              <p>{{ lationData[3].data }}</p>
            </div>
            <div @click="getDataXy()">
              <span>
                <em>{{ lationData[4].name }}</em>
              </span>
              <p>
                {{ lationData[4].data }}
                <span></span>
              </p>
            </div>
          </div>
        </div>
        <div class="yingxiang">影响用户列表</div>
        <div class="yingXiangList">
          <div class="user-t">
            <p>编号</p>
            <p>用户名称</p>
            <p>月用水量（m³）</p>
            <p>压力变化</p>
            <p>定位</p>
          </div>
          <div class="user-b" ref="ListRef1">
            <div class="bbbb sadf">
              <div
                class="MnjsList"
                v-for="(it, index) in effectUserInfo"
                :key="index"
              >
                <p>{{ it.UserNum }}</p>
                <p>{{ it.UserName }}</p>
                <p>{{ it.Demand }}</p>
                <p>{{ it.Pressure }}</p>
                <div @click="getDataXy(it)">
                  <img src="../../../static/imag/PurpleIcon.png" alt />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-popup
      v-model="PopupS"
      :close-on-click-overlay="false"
      get-container=".intelligence"
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
        <p class="statusBar"></p>
        <!-- <div class="Basics" v-show="false"> -->
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
            v-for="(item, index) in option"
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
        <div class="tckz">
          <!-- 压力 -->
          <van-checkbox-group
            v-show="legendValue == 1 || legendValue == 2 || legendValue == 3"
            v-model="resultNode"
            direction="horizontal"
            @change="nodePlus"
          >
            <van-checkbox shape="square" icon-size="16px" name="a">
              <p class="nodePlus">压力增加的节点</p>
            </van-checkbox>
            <van-checkbox shape="square" icon-size="16px" name="b">
              <p class="nodeReduce">压力减小的节点</p>
            </van-checkbox>
          </van-checkbox-group>
          <!-- 流量 -->
          <van-checkbox-group
            v-show="legendValue == 1"
            v-model="resultLine"
            direction="horizontal"
            @change="linePlus"
          >
            <van-checkbox shape="square" icon-size="16px" name="a">
              <p class="linePlus">流量增加的管线</p>
            </van-checkbox>
            <van-checkbox shape="square" icon-size="16px" name="b">
              <p class="lineReduce">流量减小的管线</p>
            </van-checkbox>
          </van-checkbox-group>
          <!-- 流速 -->
          <van-checkbox-group
            v-show="legendValue == 2"
            v-model="velocity"
            direction="horizontal"
            @change="velocityPlus"
          >
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
import legendjson from "./legendJson.json";
import maker from "./orangeIcon.png";
import makers from "./redIcon.png";
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import axios from "axios";
import "swiper/css/swiper.css";
import Vue from "vue";
import {
  Switch,
  Tab,
  Tabs,
  Popup,
  Dialog,
  Loading,
  Overlay,
  DropdownMenu,
  DropdownItem,
  Divider,
  Checkbox,
  CheckboxGroup,
} from "vant";

Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Divider);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Popup);
Vue.use(Loading);
Vue.use(Overlay);
Vue.use(Switch);
import $ from "jquery";
import { loadModules } from "esri-loader";
import tileInfo from "../../components/arcgisforjsTest/tdt_data.js";
import drawClassFlowDirection from "../../components/js/FlowDirection";
import urlClass from "../../components/js/UrlClass";
import global from "../../components/js/Global";
import drawClass from "../../components/arcgisforjsTest/DrawClass";
import drawClassPipeBurst from "../../components/js/DrawClassPipeBurst";
import PictureProperty from "../../components/js/PictureProperty";
import Bus from "../../utils/Bus";
import Attribute from "../../components/js/Attribute";
import legendData from "../../components/js/legend";
import legen from "./legend.vue";
import EchatAtt from "../warn/EchatAttr"

export default {
  name: "Intelligence",
  components: {
    Swiper,
    SwiperSlide,
    [Dialog.Component.name]: Dialog.Component,
    legen,
    EchatAtt
  },
  directives: {
    swiper: directive,
  },
  inject: ["reload"],
  data() {
    return {
      lationDataNull:false,//暂无数据
      AttributePupup:true,
      showMap: false,
      EchartA: false,
      Ascending: false, //升序水量
      Descending: false, //降序水量
      Ascendings: false, //升序压力
      Descendings: false, //降序压力
      ListClick:null,//定位点击的索引
      getPosition: false,
      planTempCalVelocityLimit: null,
      planTempCalFlowLimit: null,
      pressureChangLimit: null,
      resultNode: ["a", "b"],
      resultLine: ["a", "b"],
      velocity: ["a", "b"],
      drawDataAll: null,
      legendValue: 0,
      active: 0,
      option: [
        { text: "压力变化", value: 0 },
        { text: "流量变化", value: 1 },
        { text: "流速变化", value: 2 },
        { text: "流向变化", value: 3 },
      ],
      legendjson: {},
      LegendS: false, //图例层
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
      operationHeight: 0,
      screenHeight: 0, //屏幕高度
      PopupS: false, //遮罩层
      zzB: false, //swiper遮罩
      data: [],
      top: [
        { name: "停水点", url: require("../../../static/imag/position1.png") },
        { name: "停水范围", url: "/static/imag/fanwei1.png" },
      ],
      oper: true,
      // oper:false,//写完删
      lation: false,
      // lation:true,//写完删
      checked: false,
      checke: true,
      checkedGroup: [],
      flag: false,
      flagg: false,
      startY: 0,
      endY: 0,
      short: true,
      long: false,
      who: [
        {
          name: "关闭阀门数",
          num: 15,
          data: [],
        },
        {
          name: "影响用户数",
          num: 95,
          data: [],
        },
        {
          name: "停水消火栓",
          num: 265,
          data: [],
        },
      ],
      arr: [],
      arra: [],
      arraa: [],
      // ying:[],
      tabTwo: false,
      tabTop: ["关阀处置", "模拟计算"],
      lationData: [
        { name: "影响用户数", data: 98 },
        { name: "影响最大水厂", data: "绍兴XXX水厂" },
        { name: "水厂增加流量", data: 165 },
        { name: "最大压降", data: 5 },
        { name: "最大压降点", data: 111 },
      ],
      change: 0,
      num: 0, //tab切换默认项
      swiperOptions: {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        direction: "vertical",
        // loop:true,
        loopAdditionalSlides: 3,
        slidesPerView: 1,
        centeredSlides: true,
        centeredSlidesBounds: true,
        slideToClickedSlide: true,
        centeredSlides: true,
        effect: "coverflow",
        coverflowEffect: {
          rotate: 20, //滑动做3d旋转时Y轴的旋转角度
          stretch: 0, //每个滑动之间的拉伸值，越大slide靠得越紧。5.3.6 后可使用%百分比
          depth: 50, //滑动的位置深度。值越大z轴距离越远，看起来越小。
          modifier: 2.3, //depth和rotate和stretch的倍率，相当于depth*modifier、rotate*modifier、stretch*modifier，值越大这三个参数的效果越明显
          slideShadows: false, //是否开启slide阴影
        },
      },
      swiperOption: {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        direction: "vertical",
        loop: true,
        initialSlide: 2,
        loopAdditionalSlides: 3,
        slidesPerView: 3,
        centeredSlides: true,
        slideToClickedSlide: true,
        centeredSlides: true,
        // centeredSlidesBounds: true,
        // effect: "coverflow",
        // coverflowEffect: {
        //   rotate: 0, //滑动做3d旋转时Y轴的旋转角度
        //   stretch: 0, //每个滑动之间的拉伸值，越大slide靠得越紧。5.3.6 后可使用%百分比
        //   depth: 80, //滑动的位置深度。值越大z轴距离越远，看起来越小。
        //   modifier: 1, //depth和rotate和stretch的倍率，相当于depth*modifier、rotate*modifier、stretch*modifier，值越大这三个参数的效果越明显
        //   slideShadows: false, //是否开启slide阴影
        // },
      },
      userOption: {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        direction: "vertical",
        loop: true,
        slidesPerView: 7,
        initialSlide: 2,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      userOption1: {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        direction: "vertical",
        loop: true,
        slidesPerView: 7,
        initialSlide: 2,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      userOption2: {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        direction: "vertical",
        // loop: true,
        slidesPerView: 7,
        initialSlide: 2,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      swiperes: null,
      arcgisAPI: null,
      view: null,
      arcgisView: null,
      arcgisExtent: null,
      isMapClickPipeBurst: false, //控制点击
      CloseValveAnalysisResult: [],
      pipeBurstNewParameter: {
        ElementId: 0,
        CanNotBeclosedValves: [],
        CalData: [],
        Type: 0,
        AllBadValve: false,
        IdList: [],
        TypeList: [],
        Time: 0,
      },
      value: 0,
      schemeData: [],
      conditionData: [],
      fmData: [],
      userData: [],
      MaxPressurePoint: {},
      HydrantData: [],
      canNotBeclosedValves: [],
      closeValveList: [],
      closeValvesList: [],
      openValvesList: [],
      effectUserInfo: [],
      planTempCalculateResultLimit: null,
      pipeBurstPositionLayer: null,
      pipeBurstCloseValveLayer: null,
      pipeBurstNodeLayer: null, //压力
      strengthLayer: null, //流速
      planCalResultDirectionChangeLayer: null, //流向
      flowLayer: null, //流量
      mapClickgl:null,
      sketchVM: null,
      drawLayer: null,
      drawSymbol: null,
      mapClick: false,
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
      infoData: {},
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
    nodePlus(names) {
      this.pipeBurstNodeLayer.removeAll();
      var drawSmall;
      var drawBig;
      var selectTypeMain = "";
      if (names.includes("a") && names.length == "1") {
        drawBig = true;
        drawSmall = false;
      }
      if (names.includes("b") && names.length == "1") {
        drawSmall = true;
        drawBig = false;
      }
      if (names.length == "2") {
        drawSmall = true;
        drawBig = true;
      }
      if (names.length == "0") {
        drawSmall = false;
        drawBig = false;
      }
      console.log(drawSmall, drawBig);
      drawClass.DrawPressureChange(
        this.drawDataAll.minP,
        this.drawDataAll.maxP,
        this.drawDataAll.NodePressure,
        global.diffusionLevel,
        global.pressureChangColorNew,
        global.isDisplay.slice(0),
        this.pipeBurstNodeLayer,
        true,
        selectTypeMain,
        "PlanTempCalculate",
        drawBig,
        drawSmall,
        this.pressureChangLimit
      );
    },
    linePlus(names) {
      this.flowLayer.removeAll();
      var drawSmall;
      var drawBig;
      var selectTypeMain = "";
      if (names.includes("a") && names.length == "1") {
        drawBig = true;
        drawSmall = false;
      }
      if (names.includes("b") && names.length == "1") {
        drawSmall = true;
        drawBig = false;
      }
      if (names.length == "2") {
        drawSmall = true;
        drawBig = true;
      }
      if (names.length == "0") {
        drawSmall = false;
        drawBig = false;
      }
      console.log(drawSmall, drawBig);
      drawClass.DrawPipeFlowChange(
        this.drawDataAll.min,
        this.drawDataAll.max,
        this.drawDataAll.allData,
        global.diffusionLevel,
        global.pipeChangColorNew,
        global.isDisplay.slice(0),
        this.flowLayer,
        true,
        selectTypeMain,
        "PlanTempCalculate",
        drawBig,
        drawSmall,
        this.planTempCalFlowLimit
      );
    },
    velocityPlus(names) {
      this.strengthLayer.removeAll();
      var drawSmall;
      var drawBig;
      var selectTypeMain = "";
      if (names.includes("a") && names.length == "1") {
        drawBig = true;
        drawSmall = false;
      }
      if (names.includes("b") && names.length == "1") {
        drawSmall = true;
        drawBig = false;
      }
      if (names.length == "2") {
        drawSmall = true;
        drawBig = true;
      }
      if (names.length == "0") {
        drawSmall = false;
        drawBig = false;
      }
      console.log(drawSmall, drawBig);
      drawClass.DrawPipeFlowChange(
        this.drawDataAll.minV,
        this.drawDataAll.maxV,
        this.drawDataAll.strengthData,
        global.diffusionLevel,
        global.pipeChangColorNew,
        global.isDisplay.slice(0),
        this.strengthLayer,
        true,
        selectTypeMain,
        "PlanTempCalculate",
        drawBig,
        drawSmall,
        this.planTempCalVelocityLimit
      );
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
    //顶部tab
    tabClick(index) {
      console.log(index);
      this.change = index;
      if (index == 0) {
        if (this.flowLayer) {
          this.flowLayer.visible = false;
          // this.pipeBurstNodeLayer.visible = false;
        }
        if (this.strengthLayer) {
          this.strengthLayer.visible = false;
        }
        // if(this.planCalResultDirectionChangeLayer){
        //   this.planCalResultDirectionChangeLayer.visible = false;
        // }
        // if(this.pipeBurstCloseValveLayer){
        //   this.pipeBurstCloseValveLayer.visible = true;
        // }
        this.oper = true;
        this.lation = false;
      } else {
        this.$refs.mainHeight.style.width = "100%";
        this.$refs.mainHeight.style.height = "100%";
        this.zzB = false;
        this.oper = false;
        this.lation = true;
        if (this.flowLayer) {
          this.flowLayer.visible = true;
        }
        if (this.pipeBurstNodeLayer) {
          this.pipeBurstNodeLayer.visible = true;
        }
        if (this.strengthLayer) {
          this.strengthLayer.visible = true;
        }
        if (this.planCalResultDirectionChangeLayer) {
          this.planCalResultDirectionChangeLayer.visible = true;
        }
        // if(this.pipeBurstCloseValveLayer){
        //   this.pipeBurstCloseValveLayer.visible = false;
        // }
      }
    },
    //定位
    getDataXy(item) {
      this.getPosition = !this.getPosition;
      console.log(item);
      if (this.getPosition) {
        var markr;
        if (item == undefined) {
          item = this.MaxPressurePoint;
          markr = makers;
        } else {
          markr = maker;
        }
        var coordinateX = item.X;
        var coordinateY = item.Y;
        console.log(coordinateX, coordinateY);
        var point = {
          type: "point", // autocasts as new Point()
          x: coordinateX,
          y: coordinateY,
          spatialReference: new this.arcgisAPI.SpatialReference({
            wkid: global.spatialReference,
          }),
        };
        this.view.center = point;
        this.drawSymbol.removeAll();
        var symbol = {
          type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          url: maker,
          width: 16,
          height: 32,
          yoffset: 16,
        };
        var gra1 = new this.arcgisAPI.Graphic();
        gra1.geometry = point;
        gra1.symbol = symbol;
        this.drawSymbol.add(gra1);
      } else {
        this.drawSymbol.removeAll();
      }
    },
    getDataDraw1(item,index) {
      if (this.ListClick != index) {
        this.drawSymbol.removeAll();
        console.log("我点击到了新的")
        this.ListClick = index
        var coordinateX = item.X;
        var coordinateY = item.Y;
        var point = {
          type: "point", // autocasts as new Point()
          x: coordinateX,
          y: coordinateY,
          spatialReference: new this.arcgisAPI.SpatialReference({ wkid: global.spatialReference }),
        };
        this.view.center = point;
        var symbol = {
          type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          url: maker,
          width: 16,
          height: 32,
          yoffset: 16,
        };
        var gra1 = new this.arcgisAPI.Graphic();
        gra1.geometry = point;
        gra1.symbol = symbol;
        this.drawSymbol.add(gra1);
      }else{
        console.log("我点重复了")
        this.ListClick = null;
        this.drawSymbol.removeAll();
      }
    },
    getDataDraw(item) {
      var coordinateX = item.X;
      var coordinateY = item.Y;
      var point = {
        type: "point", // autocasts as new Point()
        x: coordinateX,
        y: coordinateY,
        spatialReference: new this.arcgisAPI.SpatialReference({ wkid: global.spatialReference }),
      };
      this.view.center = point;
      var symbol = {
        type: "picture-marker", // autocasts as new PictureMarkerSymbol()
        url: maker,
        width: 16,
        height: 32,
        yoffset: 16,
      };
      var gra1 = new this.arcgisAPI.Graphic();
      gra1.geometry = point;
      gra1.symbol = symbol;
      this.drawSymbol.add(gra1);
    },
    go() {
      this.$router.push("/shopcart");
    },
    touchStart(e) {
      //关阀
      this.startY = e.touches[0].clientY;
      console.log(this.startY);
    },
    touchEnd(e) {
      //关阀
      this.endY = e.changedTouches[0].clientY;
      //   console.log(this.endY)
      var moveY = this.endY - this.startY;
      console.log(moveY);
      //   var positionB1 = -434;
      //   var positionB2 = -156;
      var positionB1 = -11.57;
      var positionB2 = -4.14;
      var positionB3 = 0;
      // var influence1 = -12.9;
      // var influence2 = -4.34;
      var influence1 = -11.57;
      var influence2 = -4.14;
      var influence3 = 0;

      if (this.oper) {
        this.$refs.operation.style.transition = "bottom 0.6s";
        this.searchMove(
          moveY,
          positionB1,
          positionB2,
          positionB3,
          this.$refs.operation
        );
      } else {
        this.$refs.calculation.style.transition = "bottom 0.6s";
        this.searchMove1(
          moveY,
          influence1,
          influence2,
          influence3,
          this.$refs.calculation
        );
      }
    },
    /**
     *todo关阀搜索兼容版上滑下滑事件？
     */
    searchMove(moveY, positionB1, positionB2, positionB3, aa) {
      //关阀
      var gao = aa.style.bottom;
      console.log(gao);
      if (gao == "") {
        this.zzB = false;
      } else if (Math.abs(moveY) > 20) {
        this.zzB = true;
      }
      if (moveY > 0 && Math.abs(moveY) > 20 && gao == positionB2 + "rem") {
        this.$refs.operation.style.bottom = positionB1 + "rem";
        // this.$refs.calculation.style.bottom = positionB1 + "rem";
        this.$refs.mainHeight.style.width = "100%";
        this.$refs.mainHeight.style.height = "100%";
        this.zzB = false;
        console.log(0);
      } else if (
        moveY < 0 &&
        Math.abs(moveY) > 20 &&
        gao == positionB2 + "rem"
      ) {
        aa.style.bottom = 0;
        this.long = true;
        this.short = false;
        console.log(1);
        this.$refs.ListRef.style.height = 10 + "rem";
      } else if (
        moveY > 0 &&
        Math.abs(moveY) > 20 &&
        gao == positionB3 + "px" &&
        moveY < 287
      ) {
        this.long = false;
        this.short = true;
        console.log(2);
        aa.style.bottom = positionB2 + "rem";
        this.$refs.ListRef.style.height = 4.5 + "rem";
        this.$refs.mainHeight.style.height =
          this.screenHeight - this.operationHeight - positionB2 + "rem";
      } else if (moveY > 0 && gao == positionB3 + "px" && moveY > 287) {
        console.log(3);
        this.zzB = false;
        aa.style.bottom = positionB1 + "rem";
        this.$refs.mainHeight.style.width = "100%";
        this.$refs.mainHeight.style.height = "100%";
      } else if (
        moveY < 0 &&
        Math.abs(moveY) > 20 &&
        gao == positionB1 + "rem" &&
        moveY > -156
      ) {
        console.log(4);
        this.long = false;
        this.short = true;
        aa.style.bottom = positionB2 + "rem";
        this.$refs.ListRef.style.height = 4.5 + "rem";
        this.$refs.mainHeight.style.height =
          this.screenHeight - this.operationHeight - positionB2 + "rem";
      } else if (moveY < 0 && gao == positionB1 + "rem" && moveY < -156) {
        console.log(5);
        aa.style.bottom = 0;
        this.$refs.ListRef.style.height = 10 + "rem";
        this.long = true;
        this.short = false;
      }
    },
    searchMove1(moveY, positionB1, positionB2, positionB3, aa) {
      //模拟分析
      var gao = aa.style.bottom;
      console.log(gao);
      if (moveY > 0 && Math.abs(moveY) > 20 && gao == positionB2 + "rem") {
        this.$refs.mainHeight.style.width = "100%";
        this.$refs.mainHeight.style.height = "100%";
        this.$refs.calculation.style.bottom = positionB1 + "rem";
      } else if (
        moveY < 0 &&
        Math.abs(moveY) > 20 &&
        gao == positionB2 + "rem"
      ) {
        aa.style.bottom = 0;
        this.$refs.ListRef1.style.height = 10 + "rem";
        this.long = true;
        this.short = false;
      } else if (
        moveY > 0 &&
        Math.abs(moveY) > 20 &&
        gao == positionB3 + "px" &&
        moveY < 287
      ) {
        this.long = false;
        this.short = true;
        aa.style.bottom = positionB2 + "rem";
        this.$refs.ListRef1.style.height = 5.3 + "rem";
        this.$refs.mainHeight.style.height =
          this.screenHeight - this.operationHeight - positionB2 + "rem";
      } else if (moveY > 0 && gao == positionB3 + "px" && moveY > 287) {
        aa.style.bottom = positionB1 + "rem";
        this.$refs.mainHeight.style.width = "100%";
        this.$refs.mainHeight.style.height = "100%";
      } else if (
        moveY < 0 &&
        Math.abs(moveY) > 20 &&
        gao == positionB1 + "rem" &&
        moveY > -156
      ) {
        this.long = false;
        this.short = true;
        aa.style.bottom = positionB2 + "rem";
        this.$refs.ListRef1.style.height = 5.3 + "rem";
        this.$refs.mainHeight.style.height =
          this.screenHeight - this.operationHeight - positionB2 + "rem";
      } else if (moveY < 0 && gao == positionB1 + "rem" && moveY < -156) {
        aa.style.bottom = 0;
        this.$refs.ListRef1.style.height = 10 + "rem";
        this.long = true;
        this.short = false;
      }
    },
    //关阀搜索
    up() {
      // if (this.flag) {
      //搜索
      this.$refs.mainHeight.style.width = "100%";
      this.$refs.mainHeight.style.height = "100%";
      this.CloseValveAnalysisResult = [];
      // console.log(this.pipeBurstNewParameter.ElementId);
      if (this.pipeBurstNewParameter.ElementId == "") {
        Dialog.confirm({
          title: "提示",
          message: "请先选择类型",
        })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
          });
      } else {
        // this.LoadingOpen("正在分析关阀");
        this.PopupS = true;
        this.pipeBurstNewParameter.Type = Number(this.checked);
        this.pipeBurstNewParameter.AllBadValve = false;
        // debugger
        for (let i = 0; i < this.arr.length; i++) {
          // console.log(this.arr[i]);
          // debugger
          // for (let j = 0; j < this.arr[i].length; j++) {
          if (this.arr[i].IsFailure) {
            this.pipeBurstNewParameter.CanNotBeclosedValves.push(
              this.arr[i].ElementId
            );
          }
          // }
        }
        this.api.getIntelligence
          .GetIsolateNodeMorePoint(this.pipeBurstNewParameter)
          .then((res) => {
            this.CloseValveAnalysisReturn(res);
          });
      }
      if (this.flag == false) {
        this.$refs.operation.style.transition = "bottom 0.6s";
        this.$refs.operation.style.bottom = "-11.57rem";
        console.log("隐藏");
        this.flag = true;
      }
    },
    CloseValveAnalysisReturn(response) {
      // debugger
      console.log(response);
      var resultTemp = response;
      if (resultTemp && String(resultTemp.Code) == "0") {
        var result = resultTemp.Response;
        this.PopupS = false;
        console.log("CloseValveAnalysisReturn", result);
        for (let j = 0; j < result.length; j++) {
          const item = result[j];
          var object = new Object();
          object.ListPipe = item.ListPipe;
          object.ListValve = item.ListValve;
          object.ListUser = item.ListUser;
          object.TitleArr = item.TitleArr;
          object.CloseValvesList = item.listCloseValve;
          object.TitleArr = item.TitleArr;
          object.ClosedCheckValvesData = item.ClosedCheckValvesData;
          object.OpenValvesList = item.OpenValvesList;
          object.ListReleasedPipes = item.ListReleasedPipes;
          object.ListX = item.ListX;
          object.ListY = item.ListY;
          object.OutNodeCoordinateList = item.OutNodeCoordinateList;
          object.HydrantList = item.HydrantList;
          var stopWaterInfo = item.TitleArr;
          var effectUserInfo = item.ListUser;
          var closeValveInfo = [];
          for (var i = 0; i < item.ListValve.length; i++) {
            var obj = item.ListValve[i];
            obj.IsFailure = false;
            closeValveInfo.push(obj);
          }
          this.CloseValveAnalysisResult.push({
            drawData: object,
            pipeBurstNewParameter: this.pipeBurstNewParameter,
            CloseValveList: item.FoundValves,
            CloseValvesList: item.FoundCloseValves,
            OpenValvesList: item.OpenValvesList,
            effectUserInfo: effectUserInfo,
            stopWaterInfo: stopWaterInfo,
            closeValveInfo: closeValveInfo,
          });
          console.log(this.CloseValveAnalysisResult);
          this.arr = this.CloseValveAnalysisResult[0].closeValveInfo;
          console.log('%c XSJ-[ this.arr ]->', 'font-size:13px; background:red; color:#bf2c9f;', this.arr)
          this.arra = this.CloseValveAnalysisResult[0].effectUserInfo;
          this.arraa = this.CloseValveAnalysisResult[0].drawData.HydrantList;
          console.log(this.arraa);
          this.who[0].num = this.arr.length;
          this.who[1].num = this.arra.length;
          this.who[2].num = this.arraa.length;
          this.initData(this.CloseValveAnalysisResult[0]);
        }
        console.log(this.drawIdList);
        if (this.drawIdList.length == 0) {
          this.line();
        } else {
          this.line();
        }
        if (this.CloseValveAnalysisResult.length != 0) {
          this.flag = true;
          console.log(this.flag);
          this.$refs.operation.style.transition = "bottom 0.6s";
          this.$refs.operation.style.bottom = "-4.14rem";
          this.flag = false;
          this.tabTwo = true;
          console.log("弹起");
          this.zzB = true;
          this.$refs.mainHeight.style.height =
            this.screenHeight - this.operationHeight + 4.14 + "rem";
          this.$refs.ListRef.style.height = 4.5 + "rem";
        }
      }
    },
    //数据排序
    sortWater() {
      //按用水量
      this.Ascendings = false;
      this.Descendings = false;
      this.Ascending = !this.Ascending;
      this.Descending = !this.Ascending;
      this.arra = JSON.parse(JSON.stringify(this.arra));
      if (this.sort) {
        this.arra.sort(this.Ascendingorder("Demand"));
        this.sort = false;
      } else {
        this.arra.sort(this.Descendingorder("Demand"));
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
      this.arra = JSON.parse(JSON.stringify(this.arra));
      if (this.sort) {
        this.arra.sort(this.Ascendingorder("Pressure"));
        this.sort = false;
      } else {
        this.arra.sort(this.Descendingorder("Pressure"));
        this.sort = true;
      }
    },
    //失灵
    IsFailureClick(rowData) {
      console.log(rowData.IsFailure);
      this.malfunction(rowData);
    },
    malfunction(objTemp) {
      this.pipeBurstCloseValveLayer.removeAll();
      var drawData = this.CloseValveAnalysisResult[0].drawData;
      //  debugger
      console.log(drawData);
      for (var i = 0; i < drawData.ListValve.length; i++) {
        var obj = drawData.ListValve[i];
        if (String(obj.ElementId) == String(objTemp.ElementId)) {
          obj.IsFailure = objTemp.IsFailure;
          drawData.ListValve[i] = obj;
        }
      }
      if (drawData.OutNodeCoordinateList) {
        for (var i = 0; i < drawData.OutNodeCoordinateList.length; i++) {
          var objTemp = drawData.OutNodeCoordinateList[i];
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
      // drawClassPipeBurst.DrawPolygon(drawData.ListX,drawData.ListY,this.pipeBurstCloseValveLayer);
      drawClassPipeBurst.DrawCloseValveTable(
        drawData,
        this.pipeBurstCloseValveLayer
      );
    },
    line() {
      this.pipeBurstCloseValveLayer.removeAll();
      var drawData = this.CloseValveAnalysisResult[0].drawData;
      console.log("PipeBurstCloseValveDrawTool", drawData);
      if (drawData.OutNodeCoordinateList) {
        for (var i = 0; i < drawData.OutNodeCoordinateList.length; i++) {
          var objTemp = drawData.OutNodeCoordinateList[i];
          drawClassPipeBurst.DrawPolygon(
            objTemp.ListX,
            objTemp.ListY,
            this.pipeBurstCloseValveLayer
          );
        }
      }
      drawClassPipeBurst.DrawCloseValve(
        drawData,
        this.pipeBurstCloseValveLayer
      );
      drawClass.MapResultDataRangeZoom(
        [this.pipeBurstCloseValveLayer],
        this.view
      );
    },
    linee() {
      // debugger
      console.log(this.CloseValveAnalysisResult);
      this.pipeBurstCloseValveLayer.removeAll();
      var drawData = this.CloseValveAnalysisResult[0].drawData;
      drawClassPipeBurst.DrawPolygon(
        drawData.ListX,
        drawData.ListY,
        this.pipeBurstCloseValveLayer
      );
      drawClassPipeBurst.DrawCloseValve(
        drawData,
        this.pipeBurstCloseValveLayer
      );
      drawClass.MapResultDataRangeZoom(
        [this.pipeBurstCloseValveLayer],
        this.view
      );
      var pointPicture = PictureProperty.eventRed;
      console.log("DrawStopWaterHydrant", drawData.HydrantList);
      for (var i = 0; i < drawData.HydrantList.length; i++) {
        var obj = drawData.HydrantList[i];
        var point = this.arcgisAPI.Point(
          obj.X,
          obj.Y,
          new this.arcgisAPI.SpatialReference({ wkid: global.spatialReference })
        );
        pointPicture.width = 19;
        pointPicture.height = 19;
        var markerSymbol = new this.arcgisAPI.PictureMarkerSymbol({
          url: pointPicture.url,
          width: pointPicture.width + "px",
          height: pointPicture.height + "px",
          xoffset: pointPicture.xoffset + "px",
          yoffset: pointPicture.yoffset + "px",
          angle: pointPicture.angle,
        });
        if (pointPicture.color != "") markerSymbol.color = pointPicture.color;
        var graphic = new this.arcgisAPI.Graphic(
          point,
          markerSymbol,
          attributes
        );
        this.pipeBurstCloseValveLayer.add(graphic);
      }
    },
    tab(index) {
      this.getPosition = false;
      this.num = index;
      this.ListClick = null;
    },
    swit() {
      console.log(this.checked);
    },
    changeStyle(index) {
      this.zzB = false;
      this.$refs.operation.style.bottom = -11.57 + "rem";
      this.$refs.mainHeight.style.width = "100%";
      this.$refs.mainHeight.style.height = "100%";
      this.SimulationCalculation = false;
      this.BasicsLegend = true; //基础图例与模拟计算图例切换
      this.drawIdList = [];
      this.pipeBurstPositionLayer.removeAll();
      this.pipeBurstCloseValveLayer.removeAll();
      this.flowLayer.removeAll();
      this.pipeBurstNodeLayer.removeAll();
      this.strengthLayer.removeAll();
      this.planCalResultDirectionChangeLayer.removeAll();
      this.drawLayer.removeAll();
      this.drawSymbol.removeAll();
      if (this.pipeBurstPositionLayer) {
        this.pipeBurstPositionLayer.removeAll();
        this.pipeBurstNewParameter.ElementId = 0;
      }
      if (this.checkedGroup.indexOf(index) == -1) {
        this.checkedGroup = [index];
        this.isMapClickPipeBurst = true;
        console.log(this.isMapClickPipeBurst);
        this.AttributePupup = false
      } else {
        var spliceIndex = this.checkedGroup.indexOf(index);
        this.checkedGroup.splice(spliceIndex, 1);
        this.isMapClickPipeBurst = false;
        console.log(this.isMapClickPipeBurst);
        this.AttributePupup = false
      }
      if (index == 0) {
        console.log("点击了第一个");
      } else {
        console.log("点击了第二个");
        this.mapClick = !this.mapClick;
        console.log(this.mapClick)
        if (this.mapClick) {
          this.sketchVM.create("polygon", { mode: "click" });
          this.mapClick = false
        } else {
          if (this.sketchVM) {
            this.sketchVM.cancel();
          }
        }
      }
    },
    aaa(data) {
      (this.pipeBurstNewParameter.IdList = []), console.log(data);
      this.isMapClickPipeBurst = false;
      this.checkedGroup = [];
      (this.pipeBurstNewParameter.ElementId = data.ElementID),
        this.pipeBurstNewParameter.IdList.push(data.ElementID);
      this.pipeBurstNewParameter.TypeList = data.ElementTypeList;
      console.log(data);
      console.log(this.pipeBurstNewParameter);
    },
    PipeBurstMapClickReturnDraw(data) {
      this.checkedGroup = [];
      this.pipeBurstNewParameter.ElementId = data.ElementID;
      this.drawIdList = data.IdList;
      this.pipeBurstNewParameter.IdList = data.IdList;
      this.pipeBurstNewParameter.TypeList = data.ElementTypeList;
      console.log(data);
    },
    QueryToolBarTcvReturn(data) {
      console.log(data);
      this.checkedGroup = [];
      for (var i = 0; i < data.length; i++) {
        this.pipeBurstNewParameter.CanNotBeclosedValves.push(data[i]);
      }
    },
    /**
     *?模拟计算
     */
    //模拟计算
    upp() {
      this.SimulationCalculation = true;
      this.BasicsLegend = false; //基础图例与模拟计算图例切换
      console.log(this.planTempCalculateResultLimit);
      // if(this.planTempCalculateResultLimit == "null"){
      this.PopupS = true;
      this.value = new Date().getHours();
      this.JudgeUpdateGlobalFinishTime(this.value);
      this.valveAnalysisData = [];
      let queryCondition = this.getQueryCondition();
      console.log(
        this.value,
        this.valveAnalysisData,
        queryCondition,
        this.CloseValveAnalysisResult[0]
      );
      this.MyCal(queryCondition, this.CloseValveAnalysisResult[0], false);
      // this.$refs.calculation.style.transition = "bottom 0.6s";
      // this.$refs.calculation.style.bottom = "-4.34rem";
      // }
    },
    initData(data) {
      console.log(data);
      if (data) {
        this.infoData = data;
        this.pipeBurstNewParameter.ElementId =
          data.pipeBurstNewParameter.ElementId;
        this.canNotBeclosedValves =
          data.pipeBurstNewParameter.CanNotBeclosedValves;
        this.pipeBurstNewParameter.Type = data.pipeBurstNewParameter.Type;
        this.closeValveList = data.CloseValveList;
        this.closeValvesList = data.CloseValvesList;
        this.openValvesList = data.OpenValvesList;
        this.conditionData = data.pipeBurstNewParameter.CalData;
        this.fmData = data.closeValveInfo;
        this.userData = data.effectUserInfo;
        this.HydrantData = data.drawData.HydrantList;
      }
    },
    initMapDraw() {
      if (this.infoData.drawData) {
        if (this.canNotBeclosedValves.length == 0) {
          // WindowsEvent.MyDispatchEvent("PipeBurstCloseValveDraw", this.infoData.drawData);
          pipeBurstCloseValveLayer.removeAll();
          //pipeBurstPositionLayer.removeAll();
          EventTypeMain = "PipeBurst";
          var drawData = event.detail.data;
          isDisplays = global.isDisplay.slice(0);
          //drawClassPipeBurst.DrawCloseValveBufferArea(drawData,view, pipeBurstCloseValveLayer, geometryService);
          drawClassPipeBurst.DrawPolygon(
            drawData.ListX,
            drawData.ListY,
            pipeBurstCloseValveLayer
          );
          drawClassPipeBurst.DrawCloseValve(drawData, pipeBurstCloseValveLayer);
          burstPipeValveData = Object.assign({}, drawData);
          var pointPicture = PictureProperty.eventRed;
          console.log("DrawStopWaterHydrant", drawData.HydrantList);
          for (var i = 0; i < drawData.HydrantList.length; i++) {
            var obj = drawData.HydrantList[i];
            var point = this.arcgisAPI.Point(
              obj.X,
              obj.Y,
              new this.arcgisAPI.SpatialReference({
                wkid: global.spatialReference,
              })
            );
            pointPicture.width = 19;
            pointPicture.height = 19;
            var graphic = drawClass.CreatePictureGraphic(pointPicture, point);
            pipeBurstCloseValveLayer.add(graphic);
          }
        } else {
          // WindowsEvent.MyDispatchEvent("PipeBurstCloseValveDrawTool", this.infoData.drawData);
          pipeBurstCloseValveLayer.removeAll();
          EventTypeMain = "PipeBurst";
          var drawData = event.detail.data;
          isDisplays = global.isDisplay.slice(0);
          console.log("PipeBurstCloseValveDrawTool", drawData);
          if (drawData.OutNodeCoordinateList) {
            for (var i = 0; i < drawData.OutNodeCoordinateList.length; i++) {
              var objTemp = drawData.OutNodeCoordinateList[i];
              drawClassPipeBurst.DrawPolygon(
                objTemp.ListX,
                objTemp.ListY,
                pipeBurstCloseValveLayer
              );
            }
          }
          drawClassPipeBurst.DrawCloseValve(drawData, pipeBurstCloseValveLayer);
          burstPipeValveData = Object.assign({}, drawData);
        }
        for (let i = 0; i < this.fmData.length; i++) {
          this.fmData[i].IsFailure = false;
        }
      }
    },
    //获取结果与数据库匹配的模拟时间
    MyCal(queryCondition, itemData, isBool) {
      this.tableName = this.getRanNum();
      // this.LoadingOpen("正在计算");
      let self = this;
      var parameter = {
        Demand: 1000,
        ElementId: itemData.ElementId,
        Type: itemData.Type,
        CanNotBeclosedValves: queryCondition.canNotBeclosedValves,
        Time: global.time,
        TableName: this.tableName,
        UserId: "",
        IsSave: true,
        CloseValveList: queryCondition.closeValveList,
        CalData: queryCondition.elementChangeList,
      };
      console.log("关阀处置模拟计算", JSON.stringify(parameter));
      this.api.getIntelligence.GetCloseModel(parameter).then((res) => {
        // this.CloseValveAnalysisReturn(res)
        self.CloseValveCalReturn(queryCondition, res, false);
      });
      // axios.post("http://112.64.170.158:8013/Service1.svc/Rest/CloseModel", JSON.stringify(parameter),
      //     global.axiosHeaders)
      // .then(function(response){
      //     self.CloseValveCalReturn(queryCondition, response, false);
      // })
      // .catch(this.LoadingClose);
    },
    /**
     * 关阀计算绘图
     */
    CloseValveCalReturn: function (queryCondition, response, isBool) {
      let self = this;
      var resultTemp = response;
      console.log("CloseValveCalReturn:", resultTemp);
      this.MaxPressurePoint = resultTemp.Response.MaxPressurePoint;
      if (resultTemp && String(resultTemp.Code) == "0") {
        var result = resultTemp.Response;
        var object = new Object();
        object.min = result.MinFlow;
        object.max = result.MaxFlow;
        object.DownHeadMax = result.DownHeadMax;
        object.minP = result.MinPressure;
        object.maxP = result.MaxPressure;
        object.minV = result.MinStrength;
        object.maxV = result.MaxStrength;
        object.TableName = this.tableName;
        console.log(object.TableName)
        object.UserLength = 0;
        // object.data = result.data;
        object.MaxPressureId = result.MaxPressureId;
        object.TankUpDemandMaxLabel = result.TankUpDemandMaxLabel;
        object.TankUpDemandMax = Number(result.TankUpDemandMax).toFixed(1);
        if (
          Number(result.MaxPressure) < 0.01 &&
          Number(result.MaxFlow) < 0.01 &&
          Number(result.MaxStrength) < 0.01
        ) {
          console.log(
            "CloseValveCalReturn:error",
            "管网结果变化值过小，请重新修改计算条件"
          );
        } else {
          let planTempCalculateResultLimit = {
            IsGetUser:true,
            MaxPressure: Number(result.MaxPressure).toFixed(2),
            MinPressure: Number(Number(result.MaxPressure) * 0.3).toFixed(2),
            MaxFlow: Number(result.MaxFlow).toFixed(2),
            MinFlow: Number(Number(result.MaxFlow) * 0.3).toFixed(2),
            MaxStrength: Number(result.MaxStrength).toFixed(2),
            MinStrength: Number(Number(result.MaxStrength) * 0.3).toFixed(2),
            levelMy: 5,
            result: result,
            TableName:object.TableName
          };
          console.log(
            "planTempCalculateResultLimit",
            planTempCalculateResultLimit
          );
          this.$refs.calculation.style.transition = "bottom 0.6s";
          this.$refs.calculation.style.bottom = "-4.14rem";
          this.$refs.mainHeight.style.height =
            this.screenHeight - this.operationHeight + 4.14 + "rem";
          this.$refs.ListRef1.style.height = 5.3 + "rem";
          // this.lationData[0].data = this.effectUserInfo.length
          this.lationData[1].data = result.TankUpDemandMaxLabel;
          this.lationData[2].data = this.fomatFloat(result.TankUpDemandMax, 1);

          this.lationData[3].data = result.DownHeadMax;
          this.lationData[4].data = result.MaxPressureId;
          console.log(this.lationData);
          this.api.getIntelligence
            .GetPlanTempGetResultData(planTempCalculateResultLimit)
            .then((res) => {
              // this.CloseValveAnalysisReturn(res)
              self.PlanTempCalculateGetResult(
                queryCondition,
                res,
                object,
                planTempCalculateResultLimit,
                isBool
              );
            });
          // axios
          //   .post(urlClass.axiosUrl + "PlanTempGetResultData",
          //     JSON.stringify(planTempCalculateResultLimit),
          //     global.axiosHeaders
          //   )
          //   .then(function (response) {
          //     self.PlanTempCalculateGetResult(
          //       queryCondition,
          //       response,
          //       object,
          //       planTempCalculateResultLimit,
          //       isBool
          //     );
          //   })
          //   .catch();
        }
      } else {
        // this.$message({showClose: true, message: "服务器剩余资源无法满足计算，请稍后计算"});
        console.log("服务器剩余资源无法满足计算，请稍后计算");
      }
    },
    PlanTempCalculateGetResult: function (
      queryCondition,
      response,
      summaryObj,
      planTempCalculateResultLimit,
      isBool
    ) {
      // debugger
      var result = response;
      console.log("response", response);
      console.log(result.Code);
      if (result && String(result.Code) == "0") {
        var dataTemp = result.Response;
        this.effectUserInfo = dataTemp.EffectUser;
        if (this.userDatas == null) {
          this.lationDataNull = true
        }else{
          this.lationDataNull = false
          this.lationData[0].data = this.effectUserInfo.length;
        }
        console.log(dataTemp);
        var planResultLimit = {
          NodePressure: dataTemp.NodePressure,
          direction: dataTemp.PipeDirection,
          strengthData: dataTemp.PipeStrength,
          allData: dataTemp.PipeFlow,
          maxP: planTempCalculateResultLimit.MaxPressure,
          minP: planTempCalculateResultLimit.MinPressure,
          max: planTempCalculateResultLimit.MaxFlow,
          min: planTempCalculateResultLimit.MinFlow,
          maxV: planTempCalculateResultLimit.MaxStrength,
          minV: planTempCalculateResultLimit.MinStrength,
          levelMy: planTempCalculateResultLimit.levelMy,
          TableName: this.tableName,
        };
        this.drawDataAll = planResultLimit;
        var planSaveData = Object.assign(
          {},
          planTempCalculateResultLimit.result
        );
        planSaveData.tableNameMain = this.tableName;
        planSaveData.Time = global.time;
        // var userArray = dataTemp.EffectUser.slice(0);
        console.log(planResultLimit);
        this.flowL(planResultLimit);
        // this.valveAnalysisData.push({
        //   summaryObj: summaryObj,
        //   drawData: planResultLimit,
        //   effectUserInfo: userArray,
        //   listData: queryCondition.elementChangeList,
        //   planSaveData: planSaveData,
        // });
      } else {
        console.log(1281 + "计算出错");
      }
    },
    flowL(drawData) {
      this.flowLayer.removeAll();
      this.pipeBurstNodeLayer.removeAll();
      this.strengthLayer.removeAll();
      this.planCalResultDirectionChangeLayer.removeAll();
      this.pipeBurstCloseValveLayer.visible = true;
      var isDisplays = global.isDisplay.slice(0);
      var pressureDisplays = global.isDisplay.slice(0);
      var flowDisplays = global.isDisplay.slice(0);
      var strenghtDisplay = global.isDisplay.slice(0);

      var pressureLimitTemp = this.GetLimit(
        drawData.minP,
        drawData.maxP,
        drawData.levelMy
      );
      var pressureChangLimit = pressureLimitTemp.slice(0);
      global.pressureChangLimit = pressureChangLimit.slice(0);
      this.pressureChangLimit = pressureChangLimit;
      var planTempCalFlowTemp = this.GetLimit(
        drawData.min,
        drawData.max,
        drawData.levelMy
      );
      var planTempCalFlowLimit = planTempCalFlowTemp.slice(0);
      this.planTempCalFlowLimit = planTempCalFlowLimit;
      var planTempCalVelocityTemp = this.GetLimit(
        drawData.minV,
        drawData.maxV,
        drawData.levelMy
      );
      var planTempCalVelocityLimit = planTempCalVelocityTemp.slice(0);
      this.planTempCalVelocityLimit = planTempCalVelocityLimit;
      var tableNameMain = drawData.TableName;
      var legendDatas = new Object();

      legendDatas = {
        planTempCalFlowLimit: planTempCalFlowLimit,
        planTempCalVelocityLimit: planTempCalVelocityLimit,
        tableNameMain: tableNameMain,
        type: true,
        typeName: "PipeBurst",
      };
      this.legendData = legendDatas;
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
      // console.log(legend.LegendMainPlanTempCalPipe(planTempCalFlowLimit,planTempCalVelocityLimit,tableNameMain,true,"PipeBurst"))
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
      // drawClass.MapResultDataRangeZoom([this.flowLayer], this.view);
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
      drawClass.DrawPlanTempCalDirectionChange(
        drawData.direction,
        this.planCalResultDirectionChangeLayer,
        global.planCalTempDirectionChangeColor,
        global.planCalTempDirectionChangeSize,
        global.triangleColor,
        global.triangleSize
      );
      this.PopupS = false;
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
    JudgeUpdateGlobalFinishTime(timeTemp) {
      var self = this;
      //   var nowHour = new Date().getHours() - 1;
      //   var minute = new Date().getMinutes()>=30?30:0;
      //   if(!global.isTimeTheLeastBit){
      //     minute = 0;
      //   }
      //   var obj = new Object();
      //   obj = {Time:nowHour,Minute:minute};
      //       this.api.getIntelligence.GetJudgeUpdateGlobalFinishTime(timeTemp).then( res => {
      //   debugger
      // })
      axios
        .post(
          urlClass.axiosUrl + "JudgeUpdateGlobalFinishTime",
          JSON.stringify(timeTemp),
          global.axiosHeaders
        )
        .then(function (respone) {
          global.time = respone.data.Response;
          console.log("可以模拟计算的时间", global.time);
          self.parameter.Time = global.time;
          self.pipeBurstNewParameter.Time = global.time - 1;
        });
      console.log(global.time);
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
    getQueryCondition() {
      var conditionObj = {
        canNotBeclosedValves: this.canNotBeclosedValves,
        closeValveList: this.closeValveList,
        elementChangeList: this.GetElementChangeList(),
      };
      console.log("closeValvesList:", conditionObj);
      return conditionObj;
    },
    GetElementChangeList() {
      var elementChangeList = [];
      if (this.closeValvesList.length != 0) {
        for (var i = 0; i < this.closeValvesList.length; i++) {
          var objTemp = this.closeValvesList[i];
          var item = new Object();
          item.originalData = objTemp.Setting;
          item.changeData = "0";
          item.isAdd = false;
          item.label = "开度";
          var selectElement = new Object();
          selectElement.ChangeData = new Array();
          selectElement.fieldName = new Array();
          selectElement.InitialSettingsRelativeClosure = "0";
          selectElement["InitialSettingsRelativeClosureO"] = objTemp.Setting;
          selectElement.fieldName.push("InitialSettingsRelativeClosure");
          selectElement.ChangeData.push(item);
          selectElement.ElementId = objTemp.ElementId;
          selectElement.ValveNumber = objTemp.Id;
          selectElement.LayerId = global.layerId.EN_VALVE;
          selectElement.type = "阀门";
          var point = new Object();
          point.x = objTemp.X;
          point.y = objTemp.Y;
          selectElement.point = point;
          elementChangeList.push(selectElement);
        }
      }
      if (this.openValvesList.length != 0) {
        for (var i = 0; i < this.openValvesList.length; i++) {
          var objTemp = this.openValvesList[i];
          var item = new Object();
          item.originalData = objTemp.Setting;
          item.changeData = "100";
          item.isAdd = false;
          item.label = "开度";
          var selectElement = new Object();
          selectElement.ChangeData = new Array();
          selectElement.fieldName = new Array();
          selectElement.InitialSettingsRelativeClosure = "100";
          selectElement["InitialSettingsRelativeClosureO"] = objTemp.Setting;
          selectElement.fieldName.push("InitialSettingsRelativeClosure");
          selectElement.ChangeData.push(item);
          selectElement.ElementId = objTemp.ElementId;
          selectElement.ValveNumber = objTemp.Id;
          selectElement.LayerId = global.layerId.EN_VALVE;
          selectElement.type = "阀门";
          var point = new Object();
          point.x = objTemp.X;
          point.y = objTemp.Y;
          selectElement.point = point;
          elementChangeList.push(selectElement);
        }
      }
      return elementChangeList;
    },
    fomatFloat(num, n) {
      //四舍五入保留N位参数
      var f = parseFloat(num);
      if (isNaN(f)) {
        return false;
      }
      f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
      var s = f.toString();
      var rs = s.indexOf(".");
      //判定如果是整数，增加小数点再补0
      if (rs < 0) {
        rs = s.length;
        s += ".";
      }
      while (s.length <= rs + n) {
        s += "0";
      }
      return s;
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
    // console.log(this.legendValue);
    // this.legendjson = legendjson; //测试
    this.screenHeight = window.screen.height / 37.5;
    this.operationHeight = this.$refs.operation.offsetHeight / 37.5;
    // console.log(this.operationHeight);
    // this.arr = this.who[0];
    // this.arra = this.who[1];
    // this.ying = this.who[1]
    // console.log(this.ying)
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
        geometryEngine,
        SimpleMarkerSymbol,
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
          geometryEngine: geometryEngine,
          SimpleMarkerSymbol: SimpleMarkerSymbol,
          IdentifyParameters:IdentifyParameters,
          IdentifyTask:IdentifyTask
        };
        this.arcgisView = { MapView: MapView };
        this.arcgisExtent = { Extent: Extent };
        drawClassFlowDirection.setArcgisforAPI(this.arcgisAPI);
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
        console.log("dynamicMapServiceLayer", dynamicMapServiceLayer);
        map.add(dynamicMapServiceLayer);
        console.log("map", map);
        this.pipeBurstPositionLayer = new GraphicsLayer();
        this.pipeBurstCloseValveLayer = new GraphicsLayer();
        this.drawLayer = new GraphicsLayer();
        this.drawSymbol = new GraphicsLayer();
        this.flowLayer = new GraphicsLayer();
        this.pipeBurstNodeLayer = new GraphicsLayer();
        this.strengthLayer = new GraphicsLayer();
        this.planCalResultDirectionChangeLayer = new GraphicsLayer();
        this.mapClickgl = new GraphicsLayer();

        map.add(this.pipeBurstCloseValveLayer);
        map.add(this.pipeBurstPositionLayer);
        map.add(this.drawLayer);
        map.add(this.drawSymbol);
        map.add(this.flowLayer);
        map.add(this.pipeBurstNodeLayer);
        map.add(this.strengthLayer);
        map.add(this.planCalResultDirectionChangeLayer);
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
          console.log(111)
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
          console.log("点击获取点管网id");
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
          var elementTypeList = [];
          var feature;
          if (evt.results.length > 0) {
            var identifyResult = evt.results[0];
            feature = identifyResult.feature;
            var attributeTemp = feature.attributes;
            if (feature.geometry.type == "point") {
              console.log(feature.geometry);
              point = feature.geometry;
              elemetidTemp = attributeTemp.ElementId;
              elementType = 0;
              elementTypeList.push("node");
            } else if (feature.geometry.type == "polyline") {
              console.log(feature.geometry);
              elemetidTemp = attributeTemp.ElementId;
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
              elementType = 1;
              elementTypeList.push("pipe");
            } else {
              return;
            }
            PositionSupplyPathNode(point, self.pipeBurstPositionLayer);
            self.aaa({
              ElementID: elemetidTemp,
              ElementTypeId: elementType,
              ElementTypeList: elementTypeList,
            });
          }
        }
        var src = "/static/imag/cat1.png";
        //添加点
        function PositionSupplyPathNode(point, layerTemp) {
          layerTemp.removeAll();
          var symbol = {
            type: "picture-marker", // autocasts as new PictureMarkerSymbol()
            url: makers,
            width: 16,
            height: 32,
            yoffset: 16,
          };
          var gra1 = new Graphic(point, symbol);
          layerTemp.add(gra1);
        }
        //创建画图工具
        createToolbar();
        function createToolbar() {
          self.sketchVM = new SketchViewModel({
            view: view,
            layer: self.drawLayer,
            updateOnGraphicClick: false,
            pointSymbol: {
              type: "simple-marker",
              style: "circle",
              color: "#ff0000",
              size: 10,
            },
            polylineSymbol: {
              type: "simple-line",
              color: "#ff0000",
              width: 5,
              style: "solid",
            },
            polygonSymbol: {
              type: "simple-fill",
              outline: {
                color: "#ff0000",
                width: 2,
              },
            },
          });
          self.sketchVM.on("create", function (evt) {
            if (evt.state === "complete") {
              addToMap(evt);
            }
          });
        }

        function addToMap(evt) {
          var symbol = new SimpleFillSymbol();
          var graphic = new Graphic(evt.graphic.geometry, symbol);
          QueryToolBar(graphic.geometry);
          QueryToolBarLine(graphic.geometry)
        }

        function QueryToolBar(geometry) {//点
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
            urlClass.baseMapUrl + "/" + global.layerId.EN_VALVE
          );
          queryTask.execute(query).then(function (re) {
            QueryToolBarPipeReturn(re, query);
          }, errorReturn);
        }
        function QueryToolBarLine(geometry) {//线
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
            urlClass.baseMapUrl + "/" + global.layerId.EN_PIPE
          );
          queryTask.execute(query).then(function (re) {
            QueryToolBarPipeReturnLine(re, query);
          }, errorReturn);
        }
        function QueryToolBarPipeReturnLine(re, query){
          for (let i = 0; i < re.features.length; i++) {
            // debugger
            var geometry = re.features[i].geometry
            var markerSymbol = new SimpleLineSymbol({style: "solid", width: '4', color: new Color("#0000ff"), cap: "round"});
            var gra1 = new Graphic(geometry, markerSymbol);
            self.drawSymbol.add(gra1)
          }
        }
        function errorReturn(error) {
          console.log("errorReturn", error);
        }
        function QueryToolBarPipeReturn(re, query) {
          if (re.features.length != 0) {
            var idListTemp = [];
            var elemetidTemp = re.features[0].attributes.ElementId;
            var elementType = 0;
            var elementTypeList = [];
            for (var i = 0; i < re.features.length; i++) {
              var symbolXy = new Object();
              symbolXy = {
                X: re.features[i].geometry.x,
                Y: re.features[i].geometry.y,
              };
              // self.getDataDraw(symbolXy);
              var objTemp = re.features[i];
              idListTemp.push(objTemp.attributes.ElementId);
              elementTypeList.push("pipe");
            }
            self.PipeBurstMapClickReturnDraw({
              ElementID: elemetidTemp,
              ElementTypeId: elementType,
              IdList: idListTemp,
              ElementTypeList: elementTypeList,
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
            self.pipeBurstNewParameter.CanNotBeclosedValves.push(obj.ElementId);
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
@import "./intelligence.less";
.intelligence /deep/ .van-popup {
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
<style lang="less">
</style>
