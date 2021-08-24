<template>
  <div class="Direction">
    <p id="statusBar"></p>
    <van-nav-bar
      :title="msg"
      left-text="返回"
      left-arrow
      @click-left="superior"
      :border="false"
    >
      <template #right>
        <div class="check">
          <p>动态</p>
          <van-switch v-model="isActive" size="18px"  @change="check" />
        </div>
      </template>
    </van-nav-bar>
    <div class="main" ref="main">
      <div id="map" style="width: 100%; height: 100%"></div>
      <canvas ref="canvas1" class="canvasStyle"></canvas>
      <canvas ref="canvas" class="canvasStyle"></canvas>
      <canvas ref="canvas2" class="canvasStyle"></canvas>
    </div>
    <van-popup
      v-model="PopupS"
      :close-on-click-overlay="false"
      get-container=".Direction"
    >
      <van-loading type="spinner" color="#1989fa" />
    </van-popup>
  </div>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import axios from "axios";
import { mat3, vec2, vec3 } from "gl-matrix";
import { loadModules } from "esri-loader";
import tileInfo from "../../components/arcgisforjsTest/tdt_data.js";
import drawClass from "../../components/arcgisforjsTest/DrawClass";
import global from "../../components/js/Global";
import drawClassFlowDirection from "../../components/js/FlowDirection";
import urlClass from "../../components/js/UrlClass";
import { DropdownMenu, DropdownItem, Loading, Popup, NavBar, Switch} from "vant";

Vue.use(Switch)
Vue.use(Popup);
Vue.use(Loading);
Vue.use(NavBar);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
export default {
  name: "Direction",
  inject: ["reload"],
  data() {
    return {
      map: null,
      data: [],
      PopupS: true,
      // isActive:false,
      isActive: true,
      isActiveDirection: true,
      idRequest: "",
      msg: "水流方向",
      canvas: "",
      context: "",
      canvas1: "",
      context1: "",
      canvas2: "",
      context2: "",
      cWidth: 0,
      cHeight: 0,
      idRequest: "",
      isCompare: false,
      view: null,
      extentTemp: null,
      initExtent: null,
      glSupplyAreaO: null,
      gl: null,
      showObjectTime: { label: "", value: 13 },
      CustomLayer: null,
    };
  },
  methods: {
    superior() {
      this.$router.go(-1);
    },
    check(){
      console.log(this.isActive)
      this.glSupplyAreaO.removeAll();
      this.RemoveDirectionLayer(["directionLayer", "directionLayer1"]); //移除动画线
      var field = "Result_Flow_";
      var where = drawClass.GetWhere("pipe", this.view);
      var myDate = new Date();
      var timeTemp = myDate.getHours();
      if (this.isActive) {
      this.PopupS = true;
        this.extentTemp = drawClass.GetDrawMapExtent(this.view.extent);
        where += " and HMIActiveTopologyIsActive = -1";
        // var urlTemp =  "http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sz_BaseMap/MapServer/8"; //查询的服务
        var urlTemp =  urlClass.appMapUrl + global.pipeLayerId; //查询的服务
        console.log(field,where,urlTemp,this.extentTemp,timeTemp)
        this.drawPipe(
          field,
          where,
          urlTemp,
          this.extentTemp,
          timeTemp,
          "Direction"
        );
      }else{
        this.extentTemp = drawClass.GetDrawMapExtent(this.view.extent);
        where += " and Result_Flow_0 is not NULL";
        // var urlTemp =  "http://112.64.170.158:8888/ArcGIS/rest/services/PipeResult_sz/MapServer/0"; //查询的服务
        var urlTemp =  urlClass.PipeResult; //查询的服务
        console.log(field,where,urlTemp,this.extentTemp,timeTemp)
        this.drawPipe(
          field,
          where,
          urlTemp,
          this.extentTemp,
          timeTemp,
          "Direction"
        );
      }
    },
    drawPipe(
      fieldMy,
      whereMy,
      urlTemp,
      extentTemp,
      timeTemp,
      typeTemp,
      isSupplyAreaCompare = false
    ) {
      var self = this;
     console.log(fieldMy,whereMy,urlTemp,extentTemp,timeTemp,typeTemp)
      // debugger
      var query = new this.arcgisAPI.Query();
      //   WindowsEvent.MyDispatchEvent("drawStart", "");
      var field = fieldMy;
      query.geometry = extentTemp;
      query.where = whereMy;
      query.returnGeometry = true;
      query.outSpatialReference = this.view.spatialReference;
      var fieldMain = "Result_Flow_" + timeTemp;
      // WindowsEvent.MyDispatchEvent("drawMapLoadingOpen");
      console.log(this.isActive,urlTemp)
      if (this.isActive) {
        query.outFields = [
        "ElementId",
        "Physical_PipeDiameter",
        "HMIGeometryScaledLength",
      ]
      }else{
        query.outFields = [
          "ElementId",
          "Physical_PipeDiameter",
          "HMIGeometryScaledLength",
          "Result_Flow_" + timeTemp,
        ]
      }
      // query.outFields = [
      //   "ElementId",
      //   "Physical_PipeDiameter",
      //   "HMIGeometryScaledLength",
      // ];
      var queryTask = new this.arcgisAPI.QueryTask(urlTemp);
      queryTask.execute(query).then(
        function (re) {
          self.DrawPipe(re, urlTemp, whereMy, query.outFields, typeTemp);
        },
        function (error) {
          console.log(error);
        }
      );
    },
    DrawPipe(
      re,
      urlTemp = null,
      whereMy = null,
      outFields = null,
      typeTemp = "",
      isSupplyAreaCompare = false
    ) {
      this.gl.removeAll();
      var isDisplayTemp = new Array();
      var features = re.features;
      this.glSupplyAreaO.removeAll();
      var drawDirectionData = re;
      console.log(
        "%c XSJ-[ isActive ]->",
        "font-size:13px; background:red; color:#bf2c9f;",
        this.isActive
      );
      // if (!this.isActive){
      if (this.isActive) {
        //测试
        var idList = [];
        for (var i = 0; i < features.length; i++) {
          var obj = features[i];
          idList.push(obj.attributes.ElementId);
        }
        if (idList.length > 0) {
          this.DrawDirectionMain(idList);
        }
      } else {
        var myDate = new Date();
        var timeTemp = myDate.getHours();
        var fieldMain = "Result_Flow_" + timeTemp;
        var conditional = drawClassFlowDirection.GetConditionalByScale(
          this.view.scale
        );
        drawClassFlowDirection.DrawStaticPipeFlowDirection(
          drawDirectionData,
          this.gl,
          this.view,
          fieldMain,
          conditional
        );
        this.PopupS = false;
      }
    },
    DrawDirectionMain(idsList) {
      if (this.view.scale >= 40000) {
        var obj = { Diameter: global.myDiameter[1], List: idsList };
        this.clearFlowDirection();
        if (this.isActiveDirection) {
          var dataTemp = obj;
          var objs = {
            PassTime: this.showObjectTime.value,
            Diameter: dataTemp.Diameter,
            ListIndex: dataTemp.List,
            Minute: global.timeTheLeastBit,
          };
          this.GetPipeDirectionCoordinate(objs);
        }
      } else if (view.scale >= global.myScale[0]) {
        var obj = { Diameter: global.myDiameter[0], List: idsList };
        this.clearFlowDirection();
        if (this.isActiveDirection) {
          var dataTemp = obj;
          var objs = {
            PassTime: this.showObjectTime.value,
            Diameter: dataTemp.Diameter,
            ListIndex: dataTemp.List,
            Minute: global.timeTheLeastBit,
          };
          this.GetPipeDirectionCoordinate(objs);
        }
      } else {
        var obj = { Diameter: 0, List: idsList };
        this.clearFlowDirection();
        if (this.isActiveDirection) {
          var dataTemp = obj;
          // debugger
          var objs = {
            PassTime: this.showObjectTime.value,
            Diameter: dataTemp.Diameter,
            ListIndex: dataTemp.List,
            Minute: global.timeTheLeastBit,
          };
          this.GetPipeDirectionCoordinate(objs);
        }
      }
    },
    GetPipeDirectionCoordinate(time) {
      axios
        .post(
          urlClass.axiosUrl + "GetPipeDirectionCoordinate",
          JSON.stringify(time),
          { headers: { "Content-Type": "application/json;" } }
        )
        .then(this.GetPipeDirectionCoordinateReturn);
    },
    clearFlowDirection() {
      if (this.idRequest != "") {
        window.cancelAnimationFrame(this.idRequest);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context1.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
        this.context2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
      }
      this.idRequest = "";
    },
    GetPipeDirectionCoordinateReturn(respone) {
      var data = respone.data;
      var result = Object.keys(data);
      if (result) {
        // var arr = drawClassFlowDirection.DrawPipeFlowDirectionNew(data, this.view);
        var arr = drawClassFlowDirection.getPipeFlowDirection(data, this.view);
        console.log(arr)
        this.canvasapiNew(arr);
        // this.canvasapi(arr);
      }
      // WindowsEvent.MyDispatchEvent("DrawDirectionNew",data)
    },
    RemoveDirectionLayer(delAr){
      var map = this.map
        for (let i = 0; i < delAr.length; i++) {
            let tempLayer = map.findLayerById(delAr[i]);
            if (tempLayer) {
                map.remove(tempLayer);
            }
        }
    },
    canvasapiNew(obj) {
      let graphicAr = obj.directions;
      let graphicAr1 = obj.directionsNew;
      this.RemoveDirectionLayer(["directionLayer", "directionLayer1"]); //移除动画线
      let directionLayer = new this.CustomLayer({
        id: "directionLayer",
        halfWidth: 4,
        graphics: graphicAr,
      });
      this.map.add(directionLayer);
      this.PopupS = false
      console.log(directionLayer)
    },
    //获取结果与数据库匹配的模拟时间
    JudgeUpdateGlobalFinishTime(timeTemp) {
      var self = this;
      axios
        .post(
          urlClass.axiosUrl + "JudgeUpdateGlobalFinishTime",
          JSON.stringify(timeTemp),
          { headers: { "Content-Type": "application/json;" } }
        )
        .then(function (respone) {
          global.time = respone.data.Response;
          self.showObjectTime.value = global.time;
        });
    },
    canvasapi(directionsDataAll) {
      // debugger
      var directionsData = directionsDataAll.directions;
      var directionsNew = directionsDataAll.directionsNew;
      this.canvas = this.$refs.canvas;
      this.canvas.width = this.cWidth;
      this.canvas.height = this.cHeight;
      this.context = this.canvas.getContext("2d");

      this.canvas1 = this.$refs.canvas1;
      this.canvas1.width = this.cWidth;
      this.canvas1.height = this.cHeight;
      this.context1 = this.canvas1.getContext("2d");

      this.canvas2 = this.$refs.canvas2;
      this.canvas2.width = this.cWidth;
      this.canvas2.height = this.cHeight;
      this.context2 = this.canvas2.getContext("2d");
      if (this.idRequest != "") {
        window.cancelAnimationFrame(this.idRequest);
      }
      // 偏移大小
      var offset = 0;
      var self = this;

      var drawStaticDirection = function () {
        self.context2.clearRect(0, 0, self.canvas2.width, self.canvas2.height);
        self.context2.lineWidth = 2;
        self.context2.strokeStyle = "#b8baf1";
        self.context2.lineDashOffset = offset;
        self.context2.beginPath();
        for (var i = 0; i < directionsNew.length; i++) {
          var path = directionsNew[i];
          self.context2.moveTo(path[0].nfx, path[0].nfy);
          for (var j = 1; j < path.length; j++) {
            self.context2.lineTo(path[j].nfx, path[j].nfy);
          }
        }
        self.context2.stroke();
      };

      //绘制小流量管道
      var drawNew = function () {
        self.context1.clearRect(0, 0, self.canvas1.width, self.canvas1.height);
        self.context1.lineWidth = 2;
        self.context1.strokeStyle = "#ff0000";
        self.context1.lineDashOffset = offset;
        self.context1.lineJoin = "round";
        for (var i = 0; i < directionsData.length; i++) {
          var path = directionsData[i].onlyPath;
          self.context1.beginPath();
          if (Number(directionsData[i].Level) <= 1) {
            self.context1.strokeStyle = "#ff0000";
            self.context1.lineWidth = 4;
          } else {
            self.context1.strokeStyle = "rgba(159, 231, 255, 0.5)"; // '#877efa';//"#00008B";
            self.context1.lineWidth = 5;
          }
          self.context1.moveTo(path[0].nfx, path[0].nfy);
          for (var j = 1; j < path.length; j++) {
            self.context1.lineTo(path[j].nfx, path[j].nfy);
          }
          self.context1.stroke();
        }
      };

      // 绘制
      var draw = function () {
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.context.setLineDash([4, 2]);
        self.context.lineWidth = 2;
        self.context.strokeStyle = "#0000ff";
        self.context.lineDashOffset = offset;
        self.context.lineJoin = "round";
        self.context.beginPath();
        for (var i = 0; i < directionsData.length; i++) {
          self.context.beginPath();
          var path = directionsData[i].onlyPath;
          if (Number(directionsData[i].Level) <= 1) {
            self.context.setLineDash([8, 4]);
            self.context.strokeStyle = "#00ffff";
            self.context.lineWidth = 4;
          } else {
            self.context.setLineDash([9, 3]);
            self.context.strokeStyle = "#970bb7"; //'#b8baf1';//"#b8baf1";
            self.context.lineWidth = 3;
          }
          self.context.moveTo(path[0].nfx, path[0].nfy);
          for (var j = 1; j < path.length; j++) {
            self.context.lineTo(path[j].nfx, path[j].nfy);
          }
          self.context.stroke();
        }
      };

      var run = function () {
        offset += 0.8;
        if (offset > 12) {
          offset = 0;
        }
        draw();
        // 继续绘制
        self.idRequest = requestAnimationFrame(run);
      };
      drawNew();
      run();
      drawStaticDirection();
      this.PopupS = false;
    },
    ObjectDepthCopy(object) {
      // debugger
      var data = object;
      var str = JSON.stringify(data);
      var result = JSON.parse(str);
      return result;
    },
  },
  mounted() {
    // plus.screen.unlockOrientation();
    // console.log("查询设备是否为刘海屏",plus.navigator.hasNotchInScreen())
    var self = this;
    self.cWidth = this.$refs.main.offsetWidth;
    self.cHeight = this.$refs.main.offsetHeight;
    var hourTemp = new Date().getHours();
    this.JudgeUpdateGlobalFinishTime(hourTemp);

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
        "esri/tasks/support/query",
        "esri/layers/GraphicsLayer",
        "esri/geometry/Point",
        "esri/geometry/geometryEngine",
        "esri/renderers/UniqueValueRenderer",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/views/2d/layers/BaseLayerViewGL2D",
        "esri/core/watchUtils",
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
        Query,
        GraphicsLayer,
        Point,
        geometryEngine,
        UniqueValueRenderer,
        SimpleMarkerSymbol,
        BaseLayerViewGL2D,
        watchUtils,
      ]) => {
        this.arcgisAPI = {
          SpatialReference: SpatialReference,
          Extent: Extent,
          QueryTask: QueryTask,
          Query: Query,
          GraphicsLayer: GraphicsLayer,
          Point: Point,
          geometryEngine: geometryEngine,
          UniqueValueRenderer: UniqueValueRenderer,
          SimpleMarkerSymbol: SimpleMarkerSymbol,
          Graphic: Graphic,
          BaseLayerViewGL2D: BaseLayerViewGL2D,
          watchUtils: watchUtils,
        };
        drawClass.setArcgisforAPI(this.arcgisAPI);
        drawClassFlowDirection.setArcgisforAPI(this.arcgisAPI);
        this.initExtent = drawClass.GetMapInitExtent(global.initExtent);
        this.arcgisView = { MapView: MapView };
        this.arcgisExtent = { Extent: Extent };
        var data = tileInfo.tileInfo;
        var str = JSON.stringify(data);
        var tileInfoTemp = JSON.parse(str);
        for (var i = 0; i < tileInfoTemp.lods.length; i++) {
          tileInfoTemp.lods[i].resolution *= global.mul;
        }
        var map = new ArcGISMap(); // 创建地图实例
        this.map = map;
        var wtl_tileInfo = new TileInfo(tileInfoTemp);
        // let webTileMap = new WebTileLayer("http://112.64.170.158:8098/Service1.svc/Rest/GMService/{col}/{row}/{level}/1", {tileInfo: wtl_tileInfo});
        let webTileMap = new WebTileLayer(urlClass.amap, {
          tileInfo: wtl_tileInfo,
        });
        map.add(webTileMap);
        //http://112.64.170.158:7080/ArcGIS/rest/services/ModelPipe_sz_BaseMap/MapServer/
        var dynamicMapServiceLayer = new MapImageLayer(urlClass.appMapUrl);
        this.glSupplyAreaO = new GraphicsLayer();
        this.gl = new GraphicsLayer();

        map.add(this.glSupplyAreaO);
        map.add(dynamicMapServiceLayer);
        map.add(this.gl);
        var initExtent = new Extent(global.initExtent.minX, global.initExtent.minY, global.initExtent.maxX, global.initExtent.maxY,
            new SpatialReference({ wkid: global.spatialReference }));
        var view = (this.view = new MapView({
          container: "map",
          map: map,
          extent: initExtent,
          spatialReference: new SpatialReference({ wkid: global.spatialReference }),
        }));
        var self = this;
        this.view.ui.components = [];
        console.log(self)
        var CustomLayerView2D = self.arcgisAPI.BaseLayerViewGL2D.createSubclass(
          {
            aPosition: 0,
            aOffset: 1,
            aDistance: 2,
            aSide: 3,
            aColor: 4,
            constructor: function () {
              this.transform = mat3.create();
              this.extrude = mat3.create();
              this.translationToCenter = vec2.create();
              this.screenTranslation = vec2.create();
              this.display = mat3.fromValues(NaN, 0, 0, 0, NaN, 0, -1, 1, 1);
              this.screenScaling = vec3.fromValues(NaN, NaN, 1);
              this.needsUpdate = false;
              var requestUpdate = function () {
                this.needsUpdate = true;
                this.requestRender();
              }.bind(this);
              this.watcher = self.arcgisAPI.watchUtils.on(
                this,
                "layer.graphics",
                "change",
                requestUpdate,
                requestUpdate,
                requestUpdate
              );
            },
            attach: function () {
              var gl = this.context;
              console.log(
                "%c XSJ-[ gl ]->",
                "font-size:13px; background:red; color:#bf2c9f;",
                gl
              );
              var vertexSource =
                "precision highp float;" +
                "uniform mat3 u_transform;" +
                "uniform mat3 u_extrude;" +
                "uniform mat3 u_display;" +
                "attribute vec2 a_position;" +
                "attribute vec2 a_offset;" +
                "attribute float a_distance;" +
                "attribute float a_side;" +
                "attribute vec4 a_color;" +
                "varying float v_distance;" +
                "varying float v_side;" +
                "varying vec4 v_color;" +
                "void main() {" +
                "  gl_Position.xy = (u_display * (u_transform * vec3(a_position, 1.0) + u_extrude * vec3(a_offset, 0.0))).xy;" +
                "  gl_Position.zw = vec2(0.0, 1.0);" +
                "  v_distance = a_distance;" +
                "  v_side = a_side;" +
                "  v_color = a_color;" +
                "}";
              var fragmentSource =
                "precision highp float;" +
                "uniform float u_current_time;" +
                "varying float v_distance;" +
                "varying float v_side;" +
                "varying vec4 v_color;" +
                "const float TRAIL_SPEED = 200.0;" + //50
                "const float TRAIL_LENGTH = 200.0;" + //300
                "const float TRAIL_CYCLE = 200.0;" + //1000
                "void main() {" +
                "  float d = mod(v_distance - u_current_time * TRAIL_SPEED, TRAIL_CYCLE);" +
                "  float a1 = d < TRAIL_LENGTH ? mix(0.0, 1.0, d / TRAIL_LENGTH) : 0.0;" +
                "  float a2 = exp(-abs(v_side) * 3.0);" +
                "  float a = a1 * a2;" +
                "  gl_FragColor = v_color * a;" +
                "}";
              var vertexShader = gl.createShader(gl.VERTEX_SHADER);
              gl.shaderSource(vertexShader, vertexSource);
              gl.compileShader(vertexShader);
              var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
              gl.shaderSource(fragmentShader, fragmentSource);
              gl.compileShader(fragmentShader);
              this.program = gl.createProgram();
              gl.attachShader(this.program, vertexShader);
              gl.attachShader(this.program, fragmentShader);
              gl.bindAttribLocation(this.program, this.aPosition, "a_position");
              gl.bindAttribLocation(this.program, this.aOffset, "a_offset");
              gl.bindAttribLocation(this.program, this.aDistance, "a_distance");
              gl.bindAttribLocation(this.program, this.aSide, "a_side");
              gl.bindAttribLocation(this.program, this.aColor, "a_color");
              gl.linkProgram(this.program);
              gl.deleteShader(vertexShader);
              gl.deleteShader(fragmentShader);
              this.uTransform = gl.getUniformLocation(
                this.program,
                "u_transform"
              );
              this.uExtrude = gl.getUniformLocation(this.program, "u_extrude");
              this.uDisplay = gl.getUniformLocation(this.program, "u_display");
              this.uCurrentTime = gl.getUniformLocation(
                this.program,
                "u_current_time"
              );
              this.vertexBuffer = gl.createBuffer();
              this.indexBuffer = gl.createBuffer();
              this.indexBufferSize = 0;
              this.centerAtLastUpdate = vec2.fromValues(
                this.view.state.center[0],
                this.view.state.center[1]
              );
            },
            detach: function () {
              this.watcher.remove();
              var gl = this.context;
              gl.deleteBuffer(this.vertexBuffer);
              gl.deleteBuffer(this.indexBuffer);
              gl.deleteProgram(this.program);
            },
            render: function (renderParameters) {
              var gl = renderParameters.context;
              var state = renderParameters.state;
              this.updatePositions(renderParameters);
              if (this.indexBufferSize === 0) {
                return;
              }
              mat3.identity(this.transform);
              this.screenTranslation[0] =
                (state.pixelRatio * state.size[0]) / 2;
              this.screenTranslation[1] =
                (state.pixelRatio * state.size[1]) / 2;
              mat3.translate(
                this.transform,
                this.transform,
                this.screenTranslation
              );
              mat3.rotate(
                this.transform,
                this.transform,
                (Math.PI * state.rotation) / 180
              );
              this.screenScaling[0] = state.pixelRatio / state.resolution;
              this.screenScaling[1] = -state.pixelRatio / state.resolution;
              mat3.scale(this.transform, this.transform, this.screenScaling);
              mat3.translate(
                this.transform,
                this.transform,
                this.translationToCenter
              );
              mat3.identity(this.extrude);
              mat3.rotate(
                this.extrude,
                this.extrude,
                (Math.PI * state.rotation) / 180
              );
              const HALF_WIDTH = this.layer.halfWidth || 6; //线宽
              mat3.scale(this.extrude, this.extrude, [
                HALF_WIDTH,
                -HALF_WIDTH,
                1,
              ]);
              this.display[0] = 2 / (state.pixelRatio * state.size[0]);
              this.display[4] = -2 / (state.pixelRatio * state.size[1]);
              gl.useProgram(this.program);
              gl.uniformMatrix3fv(this.uTransform, false, this.transform);
              gl.uniformMatrix3fv(this.uExtrude, false, this.extrude);
              gl.uniformMatrix3fv(this.uDisplay, false, this.display);
              gl.uniform1f(this.uCurrentTime, performance.now() / 1000.0);
              gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
              gl.enableVertexAttribArray(this.aPosition);
              gl.enableVertexAttribArray(this.aOffset);
              gl.enableVertexAttribArray(this.aDistance);
              gl.enableVertexAttribArray(this.aSide);
              gl.enableVertexAttribArray(this.aColor);
              gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, 28, 0);
              gl.vertexAttribPointer(this.aOffset, 2, gl.FLOAT, false, 28, 8);
              gl.vertexAttribPointer(
                this.aDistance,
                1,
                gl.FLOAT,
                false,
                28,
                16
              );
              gl.vertexAttribPointer(this.aSide, 1, gl.FLOAT, false, 28, 20);
              gl.vertexAttribPointer(
                this.aColor,
                4,
                gl.UNSIGNED_BYTE,
                true,
                28,
                24
              );
              gl.enable(gl.BLEND);
              gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
              gl.drawElements(
                gl.TRIANGLES,
                this.indexBufferSize,
                gl.UNSIGNED_SHORT,
                0
              );
              this.requestRender();
            },
            updatePositions: function (renderParameters) {
              var gl = renderParameters.context;
              var stationary = renderParameters.stationary;
              var state = renderParameters.state;
              if (!stationary) {
                vec2.sub(
                  this.translationToCenter,
                  this.centerAtLastUpdate,
                  state.center
                );
                this.requestRender();
                return;
              }
              if (
                !this.needsUpdate &&
                this.translationToCenter[0] === 0 &&
                this.translationToCenter[1] === 0
              ) {
                return;
              }
              this.centerAtLastUpdate.set(state.center);
              this.translationToCenter[0] = 0;
              this.translationToCenter[1] = 0;
              this.needsUpdate = false;
              var graphics = this.layer.graphics;
              var vtxCount = 0;
              var idxCount = 0;
              for (var i = 0; i < graphics.items.length; ++i) {
                var graphic = graphics.items[i];
                var path = graphic.geometry.paths[0];
                vtxCount += path.length * 2;
                idxCount += (path.length - 1) * 6;
              }
              var vertexData = new ArrayBuffer(7 * vtxCount * 4);
              var floatData = new Float32Array(vertexData);
              var colorData = new Uint8Array(vertexData);
              var indexData = new Uint16Array(idxCount);
              var vtxCursor = 0;
              var idxCursor = 0;
              for (var i = 0; i < graphics.items.length; ++i) {
                var graphic = graphics.items[i];
                var path = graphic.geometry.paths[0];
                var color = graphic.attributes["color"];
                var s = {};
                for (var j = 0; j < path.length; ++j) {
                  var p = path[j];
                  if (s.current) {
                    s.delta = [p[0] - s.current[0], p[1] - s.current[1]];
                    var deltaLength = Math.sqrt(
                      s.delta[0] * s.delta[0] + s.delta[1] * s.delta[1]
                    );
                    s.direction = [
                      s.delta[0] / deltaLength,
                      s.delta[1] / deltaLength,
                    ];
                    var normal = [-s.direction[1], s.direction[0]];
                    if (s.normal) {
                      s.offset = [
                        s.normal[0] + normal[0],
                        s.normal[1] + normal[1],
                      ];
                      var offsetLength = Math.sqrt(
                        s.offset[0] * s.offset[0] + s.offset[1] * s.offset[1]
                      );
                      s.offset[0] /= offsetLength;
                      s.offset[1] /= offsetLength;

                      var d = s.normal[0] * s.offset[0] + s.normal[1] * s.offset[1];
                      if(d < 1) d = 1;
                      s.offset[0] /= d;
                      s.offset[1] /= d;
                    } else {
                      s.offset = [normal[0], normal[1]];
                    }
                    floatData[vtxCursor * 7 + 0] =
                      s.current[0] - this.centerAtLastUpdate[0];
                    floatData[vtxCursor * 7 + 1] =
                      s.current[1] - this.centerAtLastUpdate[1];
                    floatData[vtxCursor * 7 + 2] = s.offset[0];
                    floatData[vtxCursor * 7 + 3] = s.offset[1];
                    floatData[vtxCursor * 7 + 4] = s.distance;
                    floatData[vtxCursor * 7 + 5] = +1;
                    colorData[4 * (vtxCursor * 7 + 6) + 0] = color[0];
                    colorData[4 * (vtxCursor * 7 + 6) + 1] = color[1];
                    colorData[4 * (vtxCursor * 7 + 6) + 2] = color[2];
                    colorData[4 * (vtxCursor * 7 + 6) + 3] = 255;

                    floatData[vtxCursor * 7 + 7] =
                      s.current[0] - this.centerAtLastUpdate[0];
                    floatData[vtxCursor * 7 + 8] =
                      s.current[1] - this.centerAtLastUpdate[1];
                    floatData[vtxCursor * 7 + 9] = -s.offset[0];
                    floatData[vtxCursor * 7 + 10] = -s.offset[1];
                    floatData[vtxCursor * 7 + 11] = s.distance;
                    floatData[vtxCursor * 7 + 12] = -1;
                    colorData[4 * (vtxCursor * 7 + 13) + 0] = color[0];
                    colorData[4 * (vtxCursor * 7 + 13) + 1] = color[1];
                    colorData[4 * (vtxCursor * 7 + 13) + 2] = color[2];
                    colorData[4 * (vtxCursor * 7 + 13) + 3] = 255;
                    vtxCursor += 2;
                    if (j >= 2) {
                      indexData[idxCursor + 0] = vtxCursor - 4;
                      indexData[idxCursor + 1] = vtxCursor - 3;
                      indexData[idxCursor + 2] = vtxCursor - 2;
                      indexData[idxCursor + 3] = vtxCursor - 3;
                      indexData[idxCursor + 4] = vtxCursor - 1;
                      indexData[idxCursor + 5] = vtxCursor - 2;
                      idxCursor += 6;
                    }
                    s.normal = normal;
                    s.distance += deltaLength;
                  } else {
                    s.distance = 0;
                  }
                  s.current = p;
                }
                s.offset = [s.normal[0], s.normal[1]];
                floatData[vtxCursor * 7 + 0] =
                  s.current[0] - this.centerAtLastUpdate[0];
                floatData[vtxCursor * 7 + 1] =
                  s.current[1] - this.centerAtLastUpdate[1];
                floatData[vtxCursor * 7 + 2] = s.offset[0];
                floatData[vtxCursor * 7 + 3] = s.offset[1];
                floatData[vtxCursor * 7 + 4] = s.distance;
                floatData[vtxCursor * 7 + 5] = +1;
                colorData[4 * (vtxCursor * 7 + 6) + 0] = color[0];
                colorData[4 * (vtxCursor * 7 + 6) + 1] = color[1];
                colorData[4 * (vtxCursor * 7 + 6) + 2] = color[2];
                colorData[4 * (vtxCursor * 7 + 6) + 3] = 255;
                floatData[vtxCursor * 7 + 7] =
                  s.current[0] - this.centerAtLastUpdate[0];
                floatData[vtxCursor * 7 + 8] =
                  s.current[1] - this.centerAtLastUpdate[1];
                floatData[vtxCursor * 7 + 9] = -s.offset[0];
                floatData[vtxCursor * 7 + 10] = -s.offset[1];
                floatData[vtxCursor * 7 + 11] = s.distance;
                floatData[vtxCursor * 7 + 12] = -1;
                colorData[4 * (vtxCursor * 7 + 13) + 0] = color[0];
                colorData[4 * (vtxCursor * 7 + 13) + 1] = color[1];
                colorData[4 * (vtxCursor * 7 + 13) + 2] = color[2];
                colorData[4 * (vtxCursor * 7 + 13) + 3] = 255;
                vtxCursor += 2;

                indexData[idxCursor + 0] = vtxCursor - 4;
                indexData[idxCursor + 1] = vtxCursor - 3;
                indexData[idxCursor + 2] = vtxCursor - 2;
                indexData[idxCursor + 3] = vtxCursor - 3;
                indexData[idxCursor + 4] = vtxCursor - 1;
                indexData[idxCursor + 5] = vtxCursor - 2;
                idxCursor += 6;

                s.current = null;
              }
              gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
              gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
              gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
              this.indexBufferSize = indexData.length;
            },
          }
        );
        self.CustomLayer = self.arcgisAPI.GraphicsLayer.createSubclass({
          createLayerView: function (view) {
            if (view.type === "2d") {
              return new CustomLayerView2D({
                view: view,
                layer: this,
              });
            }
          },
        });
        view.when(
          function (e) {
            console.log("LoadMap完成");
            self.extentTemp = drawClass.GetDrawMapExtent(self.view.extent);
            var field = "Result_Flow_";
            var where = drawClass.GetWhere("pipe", view);
            // var where = "Physical_PipeDiameter>=600 and Result_Flow_0 is not NULL"
            if (self.isActive) {
              where += " and HMIActiveTopologyIsActive = -1";
              // var urlTemp =  "http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sz_BaseMap/MapServer/8"; //查询的服务
              var urlTemp =  urlClass.appMapUrl + global.pipeLayerId; //查询的服务
            }else{
              where += " and Result_Flow_0 is not NULL";
              var urlTemp =  urlClass.PipeResult; //查询的服务
              // var urlTemp = "http://112.64.170.158:8888/ArcGIS/rest/services/PipeResult_sz/MapServer/0"; //查询的服务
            }
            // var urlTemp = "http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sz_BaseMap/MapServer/8"; //查询的服务
            var myDate = new Date();
            var timeTemp = myDate.getHours();
            console.log(field,where,urlTemp,self.extentTemp,timeTemp)
            self.drawPipe(
              field,
              where,
              urlTemp,
              self.extentTemp,
              timeTemp,
              "Direction"
            );
          },
          function (error) {
            console.log("The view's resources failed to load: ", error);
          }
        );
        var drawAreaGeometry = null;
        view.on("drag", function (e) {
          self.clearFlowDirection();
          if (e.action == "end") {
            mapExtentChange(e); //地图监听范围改变事件
          }
        });
        view.on("mouse-wheel", function (e) {
          var handle = view.watch("updating", function (newValue, oldValue) {
            if (newValue != oldValue && !newValue) {
              handle.remove();
              self.clearFlowDirection();
              mapExtentChange(e); //地图监听范围改变事件
            }
          });
        });
        var isDraw = false;
        var isActive = false;
        var mapExtent = "";
        /**
         * 地图监听范围改变事件
         */
        view.on("resize", mapExtentChange);
        function mapExtentChange(e) {
          self.PopupS = true
          if (
            mapExtent == "" ||
            Number(view.extent.xmin) != Number(mapExtent.xmin) ||
            Number(view.extent.xmax) != Number(mapExtent.xmax) ||
            Number(view.extent.ymin) != Number(mapExtent.ymin) ||
            Number(view.extent.ymax) != Number(mapExtent.ymax)
          ) {
            mapExtent = self.ObjectDepthCopy(self.view.extent);
            console.log("mapExtent",self.view.extent)
            self.clearFlowDirection();
          }
          // if (myEventType == "updateTime" || myEventType == "changeLayerMy" || selectTypeMain == "SupplyAreaCompare" || selectTypeMain == "SupplyAreaCompareNew") {//
          var whereTemp = drawClass.GetWhere("pipe", view);
          if (!self.isCompare) {
            if (isActive) {
              dynamicMapServiceLayer.visible = false;
            } else {
              dynamicMapServiceLayer.visible = true;
            }
            if (
              !drawAreaGeometry ||
              !self.arcgisAPI.geometryEngine.contains(
                view.extent,
                drawAreaGeometry
              )
            ) {
              // SelectChange(selectTypeMain, global.time, view.extent, true);
              console.log(111111111111111)
              // this.PopupS = true
              self.extentTemp = drawClass.GetDrawMapExtent(self.view.extent);
              console.log(self.extentTemp)
              var field = "Result_Flow_";
              var where = drawClass.GetWhere("pipe", view);
              where += " and HMIActiveTopologyIsActive = -1";
              if (self.isActive) {
                where += " and HMIActiveTopologyIsActive = -1";
                // var urlTemp =  "http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sz_BaseMap/MapServer/8"; //查询的服务
                var urlTemp =  urlClass.appMapUrl + global.pipeLayerId; //查询的服务
              }else{
                where += " and Result_Flow_0 is not NULL";
                // var urlTemp = "http://112.64.170.158:8888/ArcGIS/rest/services/PipeResult_sz/MapServer/0"; //查询的服务
                var urlTemp =  urlClass.PipeResult; //查询的服务
              }
              // var urlTemp = "http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sz_BaseMap/MapServer/8"; //查询的服务
              var myDate = new Date();
              var timeTemp = myDate.getHours();
              self.drawPipe(
                field,
                where,
                urlTemp,
                self.view.extent,
                timeTemp,
                "Direction"
              );
              console.log(where,urlTemp,self.extentTemp,timeTemp)
            } else {
              SelectChange(selectTypeMain, global.time, drawAreaGeometry, true);
            }
          }
          // }
        }
      }
    );
  },
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
      // plus.screen.lockOrientation("portrait-primary");
    }
  },
};
</script>
<style scoped lang="less">
@import "./Direction.less";
.canvasStyle {
  position: absolute;
  top: 46px;
  /*  z-index: 99;  */
  pointer-events: none;
}
.Direction /deep/ .van-popup {
  background-color: transparent !important;
}
</style>
