<template>
  <div class="region">
    <div class="top">
      <div id="map" style="width: 100%;height: 100%;"></div>
    </div>
    <div class="footer fadeInDown" v-if="flags">
      <div class="tabContent">
        <v-touch v-on:swipedown="go" v-on:swipeup="up">
          <div class="foot" v-if="foot">
            <img src="../../../static/image/button_top_01.png" />
            <div class="inside">
              <span>水质警报列表</span>
              <div>
                <div
                  class="side"
                  :class="{tab : change == index}"
                  @click="clicked(index)"
                  v-for="(item,index) in sideList"
                  :key="index"
                >
                  <p>{{item}}</p>
                </div>
              </div>
            </div>
          </div>
        </v-touch>
        <div v-for="(item,index) in sideContent" v-show="index==change" :key="index">
          <v-touch v-on:swipedown="downn" v-on:swipeup="upp">
            <ul style="border-bottom: 1px solid #1B314E;box-sizing: border-box;">
              <li
                v-for="(item,index) in who"
                :key="index"
                @click="tab(index)"
                :class="{active:index == num}"
              >
                <span>{{item.name}}</span>
                <p>{{item.num}}</p>
              </li>
            </ul>
          </v-touch>
          <div class="swiper">
            <div class="swiper-l">
              <img src="../../../static/image/bg_left_01.png" />
            </div>
            <div class="swiper-r">
              <div class="tabs" v-for="(item,index) in whole" :key="index" v-show="index==num">
                <!-- 纵向轮播图 -->
                <vartical
                  v-if="aginReset"
                  :tabIndex="num"
                  v-on:childByValue="getData"
                  v-on:childByXy="getDataXy"
                ></vartical>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="reductio"
        style="background: url(../../../static/image/button_quanping_01.png);"
        @click="reduction()"
      ></div>
    </div>
    <!-- 曲线组件压缩 -->
    <div v-show="curvesTop">
      <v-touch v-on:swipeup="curvesUp">
        <div class="footCurve" style="border-bottom: 1px solid #1B314E;">
          <img src="../../../static/image/button_top_01.png" />
          <div>
            <p>航鹭桥压力警报曲线</p>
            <span class="goList" @click="goList()">返回列表</span>
          </div>
        </div>
      </v-touch>
    </div>
    <div class="curve" v-show="curves">
      <!-- 曲线头部 -->
      <v-touch v-on:swipedown="toList">
        <div class="footCurve" style="border-bottom: 1px solid #1B314E;">
          <img src="../../../static/image/button_top_01.png" />
          <div>
            <p>航鹭桥压力警报曲线</p>
            <span class="goList" @click="goList()">返回列表</span>
          </div>
        </div>
      </v-touch>
      <!-- echarts图表部分 -->
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="echarts">Slide 1</div>
          </div>
          <div class="swiper-slide">
            <div style="background-color: green;" class="echarts">Slide 2</div>
          </div>
          <div class="swiper-slide">
            <div style="background-color: blue;" class="echarts">Slide 3</div>
          </div>
        </div>
        <div class="swiper-button-prev"></div>
        <!--左箭头。如果放置在swiper-container外面，需要自定义样式。-->
        <div class="swiper-button-next"></div>
        <!--右箭头。如果放置在swiper-container外面，需要自定义样式。-->
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { loadModules } from "esri-loader";
import tileInfo from "../../components/arcgisforjsTest/tdt_data.js";
import vartical from "@/components/vartical";
export default {
  name: "Region",
  data() {
    return {
      aginReset: true, //子组件是否显示
      arcgisAPI: null,
      view: null,
      arcgisView: null,
      arcgisExtent: null,
      fla: true,
      foot: false,
      flag: false,
      flags: true,
      curves: false,
      merges: false,
      curvesTop: false, //曲线压缩控制参数
      whole: [11, 22, 33, 44],
      who: [
        { name: "全部", num: 6, degree: 0 },
        { name: "重度", num: 2, degree: 1 },
        { name: "一般", num: 2, degree: 2 },
        { name: "轻微", num: 2, degree: 3 }
      ],
      num: 0,
      change: 0, //控制tab切换参数
      sideList: ["区域水量", "夜间最小流量"], //tab标题
      sideContent: ["我是内容一", "我是内容二", "我是内容三"],
      str: [
        //顺时针渲染
        [
          [107303.4191779612, 22481.5931350055],
          [117378.77266200152, 18078.91766298789],
          [115706.60265099481, 18205.917916988397],
          [107303.4191779612, 22481.5931350055]
        ],
        [
          [114224.9330209889, 20534.255906997714],
          [122310.61585902124, 20026.254890995682],
          [118881.60900100753, 16512.581196981624],
          [113716.93200498687, 16385.580942981116],
          [114224.9330209889, 20534.255906997714]
        ],
        [
          [113293.59782498518, 21042.256922999746],
          [117738.60671500296, 25233.26530501651],
          [119643.61052501058, 21084.590340999915],
          [113293.59782498518, 21042.256922999746]
        ],
        [
          [119982.27786901193, 21931.258701003302],
          [122183.61560502074, 21973.59211900347],
          [122691.61662102277, 20195.58856299636],
          [120066.94470501227, 20280.2553989967],
          [119982.27786901193, 21931.258701003302]
        ]
      ],
      color: [
        [225, 0, 225, 0.5],
        [0, 225, 0, 1],
        [0, 0, 225, 0.5],
        [255, 0, 0, 1]
      ]
    };
  },
  components: {
    vartical
  },
  methods: {
    getData(num) {
      console.log(num);
      this.curves = true;
      this.flags = false;
    },
    getDataXy(dataXy) {
      var coordinateX = dataXy.pointX;
      var coordinateY = dataXy.pointY;
      console.log(coordinateX, coordinateY);
      var point = {
        type: "point", // autocasts as new Point()
        x: coordinateX,
        y: coordinateY,
        spatialReference: new this.arcgisAPI.SpatialReference({ wkid: 102113 })
      };
      // this.view.center = point;
      // this.view.zoom = 2;
      var pt = new point({
        latitude: coordinateX,
        loneitude: coordinateY
      });
      this.view.goto(pt);
      // this.view.goTo({
      //   center:[coordinateX,coordinateY],
      //   zoom:2
      // })
    },
    reduction() {
      this.view.extent = new this.arcgisAPI.Extent(
        91018.9439,
        7611.9801,
        142976.5999,
        34599.534,
        new this.arcgisAPI.SpatialReference({ wkid: 102113 })
      );
    },
    clicked(index) {
      this.view.extent = new this.arcgisAPI.Extent(
        91018.9439,
        7611.9801,
        142976.5999,
        34599.534,
        new this.arcgisAPI.SpatialReference({ wkid: 102113 })
      );
      var page = 0;
      sessionStorage.setItem("index", page);
      this.change = index;
      this.num = 0;
      this.aginReset = false;
      this.$nextTick(() => {
        this.aginReset = true;
      });
    },
    goList() {
      this.flags = true;
      this.curves = false;
      this.merges = false;
      this.curvesTop = false;
    },
    toList() {
      //返回列表
      this.curves = false;
      this.curvesTop = true;
    },
    curvesUp() {
      this.curves = true;
      this.curvesTop = false;
    },
    tab(index) {
      let page = 0;
      this.view.extent = new this.arcgisAPI.Extent(
        91018.9439,
        7611.9801,
        142976.5999,
        34599.534,
        new this.arcgisAPI.SpatialReference({ wkid: 102113 })
      );
      sessionStorage.setItem("index", page);
      this.num = index;
      console.log(this.num);
      this.aginReset = false;
      this.$nextTick(() => {
        this.aginReset = true;
      });
    },
    up() {
      this.foot = true;
      $(".footer").css("bottom", "0px");
      console.log(11111);
    },
    upp() {
      this.foot = true;
      $(".footer").css("bottom", "0px");
      console.log(3333);
    },
    down() {
      this.flags = false;
      this.fla = true;
    },
    go() {
      this.foot = false;
      $(".footer").css("bottom", "-6.66666667rem");
      console.log(111112222);
    },
    downn() {
      this.foot = false;
      $(".footer").css("bottom", "-6.66666667rem");
    },
    merge() {
      //合并
      this.curves = true;
      this.merges = false;
    },
    open() {
      //展开
      this.curves = false;
      this.merges = true;
    }
  },
  mounted() {
    var path = this.$route.path;
    sessionStorage.setItem("path", path);
    var mySwiper = new Swiper(".swiper-container", {
      observeParents: true,
      observer: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      }
    });
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
        "esri/symbols/SimpleFillSymbol"
      ],
      {
        css: "http://112.64.170.158:8009/ztdata/library/4.12/esri/css/main.css",
        url: "http://112.64.170.158:8009/ztdata/library/4.12/init.js"
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
        SimpleFillSymbol
      ]) => {
        this.arcgisAPI = { SpatialReference: SpatialReference, Extent: Extent };
        this.arcgisView = { MapView: MapView };
        this.arcgisExtent = { Extent: Extent };
        var data = tileInfo.tileInfo;
        var str = JSON.stringify(data);
        var tileInfoTemp = JSON.parse(str);
        for (var i = 0; i < tileInfoTemp.lods.length; i++) {
          tileInfoTemp.lods[i].resolution *= 0.9105;
        }
        var map = new ArcGISMap(); // 创建地图实例
        var wtl_tileInfo = new TileInfo(tileInfoTemp);
        // let webTileMap = new WebTileLayer("http://112.64.170.158:8098/Service1.svc/Rest/GMService/{col}/{row}/{level}/1", {tileInfo: wtl_tileInfo});
        let webTileMap = new WebTileLayer(
          "http://121.40.242.176:8098/Service1.svc/Rest/GMService/{col}/{row}/{level}/2/google",
          { tileInfo: wtl_tileInfo }
        );
        map.add(webTileMap);
        var dynamicMapServiceLayer = new MapImageLayer(
          "http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sz_BaseMap/MapServer"
        );
        map.add(dynamicMapServiceLayer);
        var view = (this.view = new MapView({
          container: "map",
          map: map,
          extent: new Extent(
            91018.9439,
            7611.9801,
            142976.5999,
            34599.534,
            new SpatialReference({ wkid: 102113 })
          ),
          spatialReference: new SpatialReference({ wkid: 102113 })
        }));
        var self = this;
        this.view.on("click", function(event) {
          self.view.popup.open({
            title: event.mapPoint.x + ", " + event.mapPoint.y,
            location: event.mapPoint
          });
        });
        //初始化
        this.view.ui._removeComponents(["zoom", "attribution"]);
        //面
        for (var j = 0; j < this.str.length; j++) {
          var aa = this.str[j];
          var col = this.color[j];
          var polygon = new Polygon({
            rings: aa,
            spatialReference: new SpatialReference({ wkid: 102113 })
          });
          // console.log(aa)
          var sym = {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: col,
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: [255, 0, 0, 0.5],
              width: 2
            }
          };
          var polygonGraphic = new Graphic({
            geometry: polygon,
            symbol: sym
          });
          this.view.graphics.add(polygonGraphic);
        }
      }
    );
  },
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
};
</script>

<style scoped="" lang="less">
@r: 1rem/37.5;
.region /deep/ .esri-ui-corner-container {
  left: 0 !important;
  bottom: 0 !important;
  top: 50px !important;
  right: 5px !important;
}
.region /deep/ .esri-widget--button {
  outline: none;
}
//初始化按钮
.reduction,
.reductio {
  height: 24 * @r;
  width: 24 * @r;
  position: absolute;
  background-size: 100% 100% !important;
  top: -28 * @r;
  right: 5 * @r;
}
.TwoAnimated {
  -moz-animation: fadeInUp 2s;
  -webkit-animation: fadeInUp 2s;
  animation: fadeInUp 2s;
}
@keyframes fadeInUp {
  0% {
    transform: translateY(200px);
  }
  100% {
    transform: translateY(0);
  }
}
@-moz-keyframes fadeInUp {
  0% {
    transform: translateY(200px);
  }
  100% {
    transform: translateY(0);
  }
}
@-webkit-keyframes fadeInUp {
  0% {
    transform: translateY(200px)
  }
  100% {
    transform: translateY(0)
  }
}
.region {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.top {
  height: calc(100% - 45px);
  width: 100%;
  background: #eee;
  // z-index: -1;
}
.footer {
  //curve
  height: 300 * @r;
  width: 100%;
  position: absolute;
  bottom: 0;
  bottom: -250 * @r;
  background-color: #081d39;
  display: flex;
  flex-direction: column;
  z-index: 999;
}
//外部
// .external{
//   height: 40*@r;
//   width: 100%;
//   display: flex;
//   div{
//     width: 50*@r;
//     font-size: 16px;
//     color: #558BE8;
//     font-weight: 600;
//     line-height: 40*@r;
//     // margin-left: 10*@r;
//     text-align: center;
//     background-color: #14263E;
//   }
// }
.foo {
  height: 50 * @r;
  background: #14263e;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  align-items: center;
  position: absolute;
  z-index: 99;
  bottom: 0;
  img {
    height: 6 * @r;
    width: 40 * @r;
    margin-top: 4 * @r;
  }
  ul {
    background-color: #14263e;
    height: 40 * @r;
    width: 325 * @r;
    display: flex;
    justify-content: space-between;
    li {
      height: 100%;
      width: 80 * @r;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      span {
        height: 40 * @r;
        color: #94b0d4;
        font-weight: 600;
        font-size: 14px;
        margin-right: 4 * @r;
        display: flex;
        align-items: center;
      }
      p {
        height: 40 * @r;
        font-size: 24px;
        font-weight: 600;
        line-height: 36 * @r;
      }
    }
  }
}
//内部
.foot {
  height: 50 * @r;
  background: #081d39;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  align-items: center;
  img {
    height: 6 * @r;
    width: 40 * @r;
    margin-top: 4 * @r;
  }
}
.inside {
  height: 40 * @r;
  width: 355 * @r;
  // background-color: red;
  color: #94b0d4;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  span {
    height: 40 * @r;
    width: 100 * @r;
    display: flex;
    align-items: flex-end;
  }
  div {
    width: 150 * @r;
    background-color: #3d69b4;
    height: 26 * @r;
    border-radius: 12 * @r;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #eaf1f8;
    font-size: 12px;
  }
  p {
    width: 100%;
    height: 100%;
    font-size: 12px;
    color: #94b0d4;
    display: flex;
    transform: scale(0.9);
    justify-content: center;
    align-items: center;
  }
}
.tab {
  border-radius: 12 * @r !important;
  background-color: #fdd639 !important;
  font-weight: 600;
  font-size: 12px;
  p {
    color: #0f1c2e !important;
  }
}
.tabContent {
  height: 250 * @r;
}
ul {
  height: 50 * @r;
  width: 100%;
  display: flex;
  background-color: #081d39;
  justify-content: space-between;
  align-items: flex-end;
  li {
    height: 40 * @r;
    width: 90 * @r;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    span {
      height: 40 * @r;
      color: #94b0d4;
      font-weight: 600;
      font-size: 14px;
      margin-right: 4 * @r;
      display: flex;
      align-items: center;
    }
    p {
      height: 40 * @r;
      font-size: 24px;
      font-weight: 600;
      line-height: 36 * @r;
    }
  }
}
li:nth-of-type(1) {
  p {
    color: #ed9e48;
  }
}
li:nth-of-type(2) {
  p {
    color: #d51616;
  }
}
li:nth-of-type(3) {
  p {
    color: #15bb15;
  }
}
li:nth-of-type(4) {
  p {
    color: #3092f3;
  }
}
.active {
  background: url(../../../static/image/bg_state_02.png);
  background-size: 100% 100%;
}
.swiper {
  height: 200 * @r;
  display: flex;
  background-color: #081d39;
  overflow: hidden;
}
.swiper-l {
  height: 120%;
  width: 50 * @r;
  // background: red;
  display: flex;
  justify-content: center;
  img {
    height: 100%;
    width: 40 * @r;
    margin-top: -20 * @r;
  }
}
.swiper-r {
  flex: 1;
  // background-color: red;
}
.tabs {
  height: 100%;
  width: 100%;
  margin-top: 10 * @r;
  // background-color: red;
}
// curve曲线列表
.curve {
  height: 260 * @r;
  // position: relative;
  position: absolute;
  bottom: 0;
  background: orange;
  background-color: #081d39;
  z-index: 9999;
  width: 100%;
  // display: flex;
  // flex-direction: column;
}
.footCurve {
  height: 50 * @r;
  background: #1b314e;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #081d39;
  border-bottom: 1px solid #1b314e;
  img {
    height: 6 * @r;
    width: 40 * @r;
    margin-top: 4 * @r;
  }
  div {
    height: 30 * @r;
    width: 360 * @r;
    // background-color: red;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      font-size: 14px;
      color: #7992aa;
      font-weight: 600;
    }
    span {
      color: #558be8;
    }
  }
}
.swiper-container {
  --swiper-theme-color: #ff6600; /* 设置Swiper风格 */
  --swiper-navigation-color: #7992aa; /* 单独设置按钮颜色 */
  --swiper-navigation-size: 30px; /* 设置按钮大小 */
}
.swiper-button-prev,
.swiper-button-next {
  outline: none;
}
.echarts {
  width: 270 * @r;
  height: 180 * @r;
  background-color: red;
  margin-left: 52 * @r;
  margin-top: 20 * @r;
}
</style>
