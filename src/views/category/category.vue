<template>
  <div class="category">
    <p id="statusBar"></p>
    <h3>任务</h3>
<!-- <van-switch v-model="checked" @change="changeTF" /> -->
    <div class="main">
      <!-- <div id="map" style="width: 100%; height: 100%"></div> -->
      <p class="iconfont iconzanwushuju"></p>
      <span>暂未开放</span>
    </div>
  </div>
</template>
<script>
import Vue from "vue"
import $ from "jquery"
import { Switch } from 'vant';

Vue.use(Switch);
import { loadModules } from "esri-loader";
import tileInfo from "../../components/arcgisforjsTest/tdt_data.js";
import urlClass from "../../components/js/UrlClass";
import DataManager from '../../components/js/DataManager'
export default {
  name: "Category",
  inject: ["reload"],
  data() {
    return {
      data: [],
      view: null,
      checked:false
    };
  },
  methods: {
    // changeTF(){
    //   console.log(this.checked)
    //   if(this.checked){
    //     plus.screen.lockOrientation("landscape-primary");
    //   }else{
    //     plus.screen.lockOrientation("portrait-primary");
    //   }
    // }
  },
  mounted() {
    // plus.screen.unlockOrientation();
    // plus.screen.lockOrientation("landscape-primary");
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    // loadModules(
    //   [
    //     "esri/Map",
    //     "esri/views/MapView",
    //     "esri/layers/WebTileLayer",
    //     "esri/layers/support/TileInfo",
    //     "esri/layers/MapImageLayer",
    //     "esri/geometry/SpatialReference",
    //     "esri/geometry/Extent",
    //     "esri/Graphic",
    //     "esri/widgets/Home",
    //     "esri/config",
    //     "esri/geometry/Polygon",
    //     "esri/symbols/SimpleFillSymbol",
    //     "esri/tasks/support/query",
		// "esri/tasks/QueryTask",
		// 'esri/symbols/SimpleMarkerSymbol',
		// 'esri/symbols/SimpleLineSymbol',
    //   ],
    //   {
    //     css: "http://112.64.170.158:8009/ztdata/library/4.12/esri/css/main.css",
    //     url: "http://112.64.170.158:8009/ztdata/library/4.12/init.js",
    //   }
    // ).then(
    //   ([
    //     ArcGISMap,
    //     MapView,
    //     WebTileLayer,
    //     TileInfo,
    //     MapImageLayer,
    //     SpatialReference,
    //     Extent,
    //     Graphic,
    //     Home,
    //     esriConfig,
    //     Polygon,
    //     SimpleFillSymbol,
    //     Query,
    //     QueryTask,
    //     SimpleMarkerSymbol,
    //     SimpleLineSymbol
    //   ]) => {
    //     this.arcgisAPI = {
    //       SpatialReference: SpatialReference,
    //       Extent: Extent,
    //       Query: Query,
    //       QueryTask: QueryTask,
    //       SimpleMarkerSymbol:SimpleMarkerSymbol,
    //       SimpleLineSymbol:SimpleLineSymbol
    //     };
    //     this.arcgisView = { MapView: MapView };
    //     this.arcgisExtent = { Extent: Extent };
    //     var data = tileInfo.tileInfo;
    //     var str = JSON.stringify(data);
    //     var tileInfoTemp = JSON.parse(str);
    //     for (var i = 0; i < tileInfoTemp.lods.length; i++) {
    //       tileInfoTemp.lods[i].resolution *= 0.9105;
    //     }
    //     var map = new ArcGISMap(); // 创建地图实例
    //     var wtl_tileInfo = new TileInfo(tileInfoTemp);
    //     // let webTileMap = new WebTileLayer("http://112.64.170.158:8098/Service1.svc/Rest/GMService/{col}/{row}/{level}/1", {tileInfo: wtl_tileInfo});
    //     let webTileMap = new WebTileLayer(urlClass.amap, {
    //       tileInfo: wtl_tileInfo,
    //     });
    //     map.add(webTileMap);
    //     var dynamicMapServiceLayer = new MapImageLayer(
    //       "http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sz_BaseMap/MapServer"
    //     );
    //     map.add(dynamicMapServiceLayer);
    //     var view = (this.view = new MapView({
    //       container: "map",
    //       map: map,
    //       extent: new Extent(
    //         91018.9439,
    //         7611.9801,
    //         142976.5999,
    //         34599.534,
    //         new SpatialReference({ wkid: 102113 })
    //       ),
    //       spatialReference: new SpatialReference({ wkid: 102113 }),
    //     }));
    //     var self = this;
    //     // this.view.on("click", function(event) {
    //     // self.view.popup.open({
    //     // 	title: event.mapPoint.x + ", " + event.mapPoint.y,
    //     // 	location: event.mapPoint
    //     // });
    //     // });
    //     //初始化
		// this.view.ui._removeComponents(["attribution"]);
		// view.when(function (e) {
		// 	console.log("LoadMap完成");
		// 	var query = new Query();
		// 	query.returnGeometry = true;
		// 	query.geometry = view.extent;
		// 	// console.log(query.geometry)
		// 	query.where = "1=1";
		// 	query.outFields = [
		// 	"ElementId",
		// 	"户名",
		// 	"用户号",
		// 	"地址",
		// 	"用水性质",
		// 	"月用水量",
		// 	"分公司",
		// 	];
		// 	var queryTask = new QueryTask(
		// 	"http://112.64.170.158:8888/ArcGIS/rest/services/CustomerMeter_sz/MapServer/0"
		// 	);
		// 	queryTask.execute(query).then(QueryCoustomerReturn, function (error) {
		// 	console.log(error);
		// 	});
		// })
    //     function QueryCoustomerReturn(re) {
    //       var CustomerData = [];
    //       for (var i = 0; i < re.features.length; i++) {
    //         var obj = re.features[i];
    //         var object = new Object();
    //         object.x = obj.geometry.x;
    //         object.y = obj.geometry.y;
    //         object.name = obj.attributes.户名;
    //         object.number = obj.attributes.用户号;
    //         object.addr = obj.attributes.地址;
    //         object.nature = obj.attributes.用水性质;
    //         object.demand = obj.attributes.月用水量;
    //         object.company = obj.attributes.分公司;
    //         CustomerData.push(object);
		//   }
    //       if (CustomerData.length > 0) {
    //         initLayer(CustomerData);
    //       }
		// }
    //     var clusterLayer = null;
    //     var preClustered = false;
    //     var displaySingleFlaresAtCount = 10;
    //     function initLayer(data) {
		// 	console.log(data)
        //   if (!clusterLayer) map.remove(clusterLayer);
        //   DataManager.setData(data);

        //   var defaultSym = new SimpleMarkerSymbol({
        //     size: 3,
        //     color: "#FF0000",
        //     outline: null,
        //   });

        //   var renderer = new ClassBreaksRenderer({
        //     defaultSymbol: defaultSym,
        //   });
        //   renderer.field = "clusterCount";

        //   var smSymbol = new SimpleMarkerSymbol({
        //     size: 22,
        //     outline: new esriApi.SimpleLineSymbol({
        //       color: [221, 159, 34, 0.8],
        //     }),
        //     color: [255, 204, 102, 0.8],
        //   });
        //   var mdSymbol = new SimpleMarkerSymbol({
        //     size: 24,
        //     outline: new esriApi.SimpleLineSymbol({
        //       color: [82, 163, 204, 0.8],
        //     }),
        //     color: [102, 204, 255, 0.8],
        //   });
        //   var lgSymbol = new SimpleMarkerSymbol({
        //     size: 28,
        //     outline: new esriApi.SimpleLineSymbol({
        //       color: [41, 163, 41, 0.8],
        //     }),
        //     color: [51, 204, 51, 0.8],
        //   });
        //   var xlSymbol = new SimpleMarkerSymbol({
        //     size: 32,
        //     outline: new SimpleLineSymbol({
        //       color: [200, 52, 59, 0.8],
        //     }),
        //     color: [250, 65, 74, 0.8],
        //   });

        //   renderer.addClassBreakInfo(0, 19, smSymbol);
        //   renderer.addClassBreakInfo(20, 150, mdSymbol);
        //   renderer.addClassBreakInfo(151, 1000, lgSymbol);
        //   renderer.addClassBreakInfo(1001, Infinity, xlSymbol);

        //   var areaRenderer;
        //   var defaultAreaSym = new SimpleFillSymbol({
        //     style: "solid",
        //     color: [0, 0, 0, 0.2],
        //     outline: new SimpleLineSymbol({ color: [0, 0, 0, 0.3] }),
        //   });

        //   areaRenderer = new ClassBreaksRenderer({
        //     defaultSymbol: defaultAreaSym,
        //   });
        //   areaRenderer.field = "clusterCount";

        //   var smAreaSymbol = new esriApi.SimpleFillSymbol({
        //     color: [255, 204, 102, 0.4],
        //     outline: new SimpleLineSymbol({
        //       color: [221, 159, 34, 0.8],
        //       style: "dash",
        //     }),
        //   });
        //   var mdAreaSymbol = new SimpleFillSymbol({
        //     color: [102, 204, 255, 0.4],
        //     outline: new SimpleLineSymbol({
        //       color: [82, 163, 204, 0.8],
        //       style: "dash",
        //     }),
        //   });
        //   var lgAreaSymbol = new esriApi.SimpleFillSymbol({
        //     color: [51, 204, 51, 0.4],
        //     outline: new SimpleLineSymbol({
        //       color: [41, 163, 41, 0.8],
        //       style: "dash",
        //     }),
        //   });
        //   var xlAreaSymbol = new esriApi.SimpleFillSymbol({
        //     color: [250, 65, 74, 0.4],
        //     outline: new SimpleLineSymbol({
        //       color: [200, 52, 59, 0.8],
        //       style: "dash",
        //     }),
        //   });

        //   areaRenderer.addClassBreakInfo(0, 19, smAreaSymbol);
        //   areaRenderer.addClassBreakInfo(20, 150, mdAreaSymbol);
        //   areaRenderer.addClassBreakInfo(151, 1000, lgAreaSymbol);
        //   areaRenderer.addClassBreakInfo(1001, Infinity, xlAreaSymbol);

        //   var flareRenderer = new esriApi.ClassBreaksRenderer({
        //     defaultSymbol: renderer.defaultSymbol,
        //   });
        //   flareRenderer.field = "clusterCount";

        //   var smFlareSymbol = new esriApi.SimpleMarkerSymbol({
        //     size: 14,
        //     color: [255, 204, 102, 0.8],
        //     outline: new SimpleLineSymbol({
        //       color: [221, 159, 34, 0.8],
        //     }),
        //   });
        //   var mdFlareSymbol = new esriApi.SimpleMarkerSymbol({
        //     size: 14,
        //     color: [102, 204, 255, 0.8],
        //     outline: new SimpleLineSymbol({
        //       color: [82, 163, 204, 0.8],
        //     }),
        //   });
        //   var lgFlareSymbol = new esriApi.SimpleMarkerSymbol({
        //     size: 14,
        //     color: [51, 204, 51, 0.8],
        //     outline: new SimpleLineSymbol({
        //       color: [41, 163, 41, 0.8],
        //     }),
        //   });
        //   var xlFlareSymbol = new esriApi.SimpleMarkerSymbol({
        //     size: 14,
        //     color: [250, 65, 74, 0.8],
        //     outline: new SimpleLineSymbol({
        //       color: [200, 52, 59, 0.8],
        //     }),
        //   });

        //   flareRenderer.addClassBreakInfo(0, 19, smFlareSymbol);
        //   flareRenderer.addClassBreakInfo(20, 150, mdFlareSymbol);
        //   flareRenderer.addClassBreakInfo(151, 1000, lgFlareSymbol);
        //   flareRenderer.addClassBreakInfo(1001, Infinity, xlFlareSymbol);

        //   var popupTemplate = new PopupTemplate({
        //     title: "用户属性",
        //     content: [
        //       {
        //         type: "fields",
        //         fieldInfos: [
        //           { fieldName: "name", label: "用户名", visible: true },
        //           { fieldName: "number", label: "用户号", visible: true },
        //           { fieldName: "addr", label: "地址", visible: true },
        //           { fieldName: "nature", label: "用水性质", visible: true },
        //           { fieldName: "demand", label: "月水量", visible: true },
        //           { fieldName: "company", label: "分公司", visible: true },
        //         ],
        //       },
        //     ],
        //   });
        //   var options = {
        //     id: "flare-cluster-layer",
        //     clusterRenderer: renderer,
        //     areaRenderer: areaRenderer,
        //     flareRenderer: flareRenderer,
        //     singlePopupTemplate: popupTemplate,
        //     spatialReference: new SpatialReference({
        //       wkid: global.spatialReference,
        //     }),
        //     subTypeFlareProperty: "nature",
        //     singleFlareTooltipProperty: "name",
        //     displaySubTypeFlares: true,
        //     maxSingleFlareCount: 8,
        //     clusterRatio: 200,
        //     clusterToScale: 10000,
        //     clusterAreaDisplay: "activated",
        //     isRect: false,
        //     data: data,
        //   };
        //   clusterLayer = new fcl.FlareClusterLayer(options);
        //   map.add(clusterLayer);

        //   clusterLayer.on("draw-complete", function () {
        //     console.log("clustering complete");
        //   });
    //     }
    //   }
    // );
  },
  beforeDestroy() {
            // plus.screen.lockOrientation("portrait-primary");

    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  },
};
</script>
<style scoped lang="less">
@import "./category.less";
</style>
