/**
 * Created 2019-10-30
 */

import esriLoader from 'esri-loader';
import tileInfo from './tdt_data';
import axios from "axios";
// import BaseSelect from '@/components/BaseSelect/BaseSelect'
// import myWindowIndex from '@/components/js/myWindowIndex'
// /* import store from '@/store/store'
// import Vue from 'vue' */
// import myAlert from '@/components/js/myAlert'
// import { plugins } from 'handsontable';
// import drawClass from '@/components/js/DrawClass'
// import urlClass from './UrlClass'
// import global from './Global'
// import getAndPost from '@/components/js/GetAndPost'
// import WindowsEvent from './WindowsEvent';
// import supplyPath from '@/components/js/SupplyPath';
// import PictureProperty from '@/components/js/PipeBurst/PictureProperty'
// import drawClassFlowDirection from '@/components/js/FlowDirection/FlowDirection'
// import legend from '@/components/js/Legend'
// import drawTool from '@/components/js/DrawTool/DrawToolRunningState'
// import mainClass from '@/components/js/MainClass'
// import DataManager from '@/components/js/CustomerLayer/DataManager'
// import LoadLegendData from '@/components/js/GetLegendInfo/LoadLegendData'
// import FlowDirection from '@/components/js/FlowDirection/FlowDirection';
// import drawClassPipeBurst from '@/components/js/PipeBurst/DrawClassPipeBurst';
// import popupEcharts from '@/components/js/popup/popupEcharts';
// import popupTable from '@/components/js/popup/popupTable';
// import popupLableBg from '@/components/js/popup/popupLableBg';
// import attributeData from '@/components/js/MapQuery/Attribute';
// import { setArcgisforAPI, loadMapMapLayers } from "@/components/js/LoadMapServers";
// import {Message} from 'element-ui'

var esriApi,_routePage;
class Methods {
    loadArcgis() {// 该方法用于加载 arcgis 依赖的js,css 等
        // 加载css
        esriLoader.loadCss('http://'+urlClass.arcgisUrlIp+'/ztdata/library/4.12/esri/css/main.css');
        esriLoader.loadCss('http://'+urlClass.arcgisUrlIp+'/ztdata/library/4.12/dijit/themes/tundra/tundra.css');
        // 加载模块
        esriLoader.loadModules([
            'esri/Map',
            'esri/Basemap',
            'esri/views/MapView',
            'esri/layers/WebTileLayer',
            'esri/geometry/SpatialReference',
            'esri/geometry/Extent',
            'esri/layers/support/TileInfo',
            'esri/geometry/Point',
            'esri/geometry/Circle',
            'esri/layers/MapImageLayer',
            'esri/layers/TileLayer',
            'esri/symbols/PictureMarkerSymbol',
            'esri/symbols/SimpleMarkerSymbol',
            'esri/symbols/SimpleLineSymbol',
            'esri/Graphic',
            'esri/layers/GraphicsLayer',
            'esri/Color',
            "esri/layers/FeatureLayer",
            "esri/renderers/HeatmapRenderer",
            "esri/tasks/support/query",
            "esri/tasks/QueryTask",
            "esri/tasks/support/IdentifyParameters",
            "esri/tasks/IdentifyTask",
            "esri/geometry/geometryEngine",
            "esri/geometry/geometryEngineAsync",
            'esri/geometry/Geometry',
            'esri/symbols/TextSymbol',
            'esri/symbols/Font',
            "dijit/TooltipDialog",
            "dojo/dom-style",
            "dijit/popup",
            "esri/views/2d/draw/Draw",//esri/toolbars/draw    esri/views/draw/Draw
            // "esri/geometry/ScreenPoint",
            "esri/geometry/support/webMercatorUtils",
            "esri/core/promiseUtils",
            "esri/renderers/ClassBreaksRenderer",
            "CustomerLayer/FlareClusterLayer_v4",
            "esri/PopupTemplate",
            "esri/geometry/Polygon",
            "esri/geometry/Polyline",
            'esri/symbols/SimpleFillSymbol',
            "esri/widgets/Sketch/SketchViewModel",//esri/toolbars/edit
            "esri/widgets/Slider",
            "esri/core/watchUtils"
        ], {
            url: 'http://'+urlClass.arcgisUrlIp+'/ztdata/library/4.12/init.js'
        })
        .then(this.loading)
        .then(obj => {
            this.initMap(obj);
        })
        .catch((err) => {
            console.trace(err.message);
        });
    }

    loading([// 注意 这里的参数是数组,该方法用于自定义TiledMapServiceLayer加载天地图;
        Map,
        Basemap,
        MapView,
        WebTileLayer,
        SpatialReference,
        Extent,
        TileInfo,
        Point,
        Circle,
        MapImageLayer,
        TileLayer,
        PictureMarkerSymbol,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        Graphic,
        GraphicsLayer,
        Color,
        FeatureLayer,
        HeatmapRenderer,
        Query,
        QueryTask,
        IdentifyParameters,
        IdentifyTask,
        geometryEngine,
        geometryEngineAsync,
        Geometry,
        TextSymbol,
        Font,
        TooltipDialog,
        domStyle,
        popup,
        Draw,
        // ScreenPoint,
        webMercatorUtils,
        promiseUtils,
        ClassBreaksRenderer,
        fcl,
        PopupTemplate,
        Polygon,
        Polyline,
        SimpleFillSymbol,
        SketchViewModel,
        Slider,
        watchUtils
    ]) {
        return { // return 之后才能使用链式调用
            Map,
            Basemap,
            MapView,
            WebTileLayer,
            SpatialReference,
            Extent,
            TileInfo,
            Point,
            Circle,
            MapImageLayer,
            TileLayer,
            PictureMarkerSymbol,
            SimpleMarkerSymbol,
            SimpleLineSymbol,
            Graphic,
            GraphicsLayer,
            Color,
            FeatureLayer,
            HeatmapRenderer,
            Query,
            QueryTask,
            IdentifyParameters,
            IdentifyTask,
            geometryEngine,
            geometryEngineAsync,
            Geometry,
            TextSymbol,
            Font,
            TooltipDialog,
            domStyle,
            popup,
            Draw,
            // ScreenPoint,
            webMercatorUtils,
            promiseUtils,
            ClassBreaksRenderer,
            fcl,
            PopupTemplate,
            Polygon,
            Polyline,
            SimpleFillSymbol,
            SketchViewModel,
            Slider,
            watchUtils
        };
    }

    initMap(obj) { // 初始化地图,并设置中心点等
        this.mapObj = obj;// 将对象保存到vue data 的 maoObj中,方便调用;
        _routePage = this.$route.name;
        esriApi = obj;
        drawClass.setArcgisforAPI(esriApi);
        drawTool.setArcgisforAPI(esriApi);
        FlowDirection.setArcgisforAPI(esriApi);
        drawClassFlowDirection.setArcgisforAPI(esriApi);
        setArcgisforAPI(esriApi);

        //基础图层加载
        var customBasemap = new esriApi.Basemap();//{baseLayers: [layer]}
        loadMapMapLayers(_routePage, urlClass.baseLayers, customBasemap.baseLayers);
        // if(global.isGoogleMap){
        //     // 影像
        //     var tileInfoTemp = mainClass.ObjectDepthCopy(tileInfo.tileInfo);
        //     if(global.isRatio){
        //         for (var i = 0; i < tileInfoTemp.lods.length; i++) {
        //             tileInfoTemp.lods[i].resolution *= global.googleRatio;
        //         }
        //     }
        //     var wtl_tileInfo = new esriApi.TileInfo(tileInfoTemp);
        //     let img = new esriApi.WebTileLayer(urlClass.googleMapUrl+'{col}/{row}/{level}/1', {tileInfo: wtl_tileInfo});
        //     // map.add(img) // 将图层添加到map对象
        //     customBasemap.baseLayers.add(img);
        // }else{
        //     if(global.isDynamic){
        //         var reliefMap = new esriApi.MapImageLayer(urlClass.reliefMap);
        //         // map.add(reliefMap);
        //         customBasemap.baseLayers.add(reliefMap);
        //     }else{
        //         var reliefMap = new esriApi.TileLayer(urlClass.reliefMap);
        //         // map.add(reliefMap);
        //         customBasemap.baseLayers.add(reliefMap);
        //     }
        // }
        let map = new esriApi.Map({basemap: customBasemap});// 创建地图实例
        var initExtent = drawClass.GetMapInitExtent(global.initExtent)//new Extent(380083.27864125, 252673.3739848, 605825.77522175, 400526.3930992,
        // map.setExtent(initExtent);
        var view = new esriApi.MapView({
            map: map,
            container: "map",
            extent: initExtent,
            spatialReference: new esriApi.SpatialReference({ wkid: global.spatialReference })
        });
        //var reliefMap = new esriApi.MapImageLayer(urlClass.reliefMap);
        //map.add(reliefMap);

        //业务图层加载
        loadMapMapLayers(_routePage, urlClass.businessLayers, map);
        // var dynamicMapServiceTintLayer = new esriApi.MapImageLayer(urlClass.baseMapUrlTint);
        // map.add(dynamicMapServiceTintLayer);
        // dynamicMapServiceTintLayer.visible = false;
        // var dynamicMapServiceLayer = new esriApi.MapImageLayer(urlClass.baseMapUrl);
        // map.add(dynamicMapServiceLayer);
        var dynamicMapServiceTintLayer = map.findLayerById((_routePage + "baseMapUrlTint"));
        var dynamicMapServiceLayer = map.findLayerById((_routePage + "baseMapUrl"));

        // map.hideZoomSlider();
        // view.ui.remove('zoom')//清除放大缩小按钮
        // view.ui.remove('attribution')//清楚底部powered by ESRI
        view.ui.components = [];//清空所有ESRI自带的组件
        view.popup.dockEnabled = false;
        view.popup.collapseEnabled  = false;
        view.popup.dockOptions = {buttonEnabled: false, breakpoint: false, position:"bottom-left"};//禁用停靠
        view.popup.actions = null;

        var gl = new esriApi.GraphicsLayer();
        var glSupplyAreaO = new esriApi.GraphicsLayer();
        var valveAttributeLayer = new esriApi.GraphicsLayer();
        var waterworksAttributeLayer = new esriApi.GraphicsLayer();
        var compareResultLayer = new esriApi.GraphicsLayer();
        var elementChangeLayer = new esriApi.GraphicsLayer();
        var planCalResultFlowLayer = new esriApi.GraphicsLayer();
        var planCalResultVelocityLayer = new esriApi.GraphicsLayer();
        var planCalResultFlowLayer = new esriApi.GraphicsLayer();
        var planCalResultDirectionChangeLayer = new esriApi.GraphicsLayer();
        var MaxLayer = new esriApi.GraphicsLayer();
        var MinLayer = new esriApi.GraphicsLayer();
        var LocationGraphicsLayer = new esriApi.GraphicsLayer();
        var mapClickgl = new esriApi.GraphicsLayer();
        var supplyPathLayer = new esriApi.GraphicsLayer();
        var diffusionLayer = new esriApi.GraphicsLayer();
        var accuracyMonitorLayer = new esriApi.GraphicsLayer();
        var supplyPathPositionLayer = new esriApi.GraphicsLayer();
        var searchLayer = new esriApi.GraphicsLayer();
        var isStopWaterCalPipe = new esriApi.GraphicsLayer();
        var isStopWaterHydrant = new esriApi.GraphicsLayer();
        var valveChangeLayer = new esriApi.GraphicsLayer();
        var pressureLayer = new esriApi.GraphicsLayer();//实时压力
        var trafficLayer = new esriApi.GraphicsLayer();//实时流量
        var dummyLayer = new esriApi.GraphicsLayer();//实时虚拟点
        //api4.x 注释   不知道加载的什么（好像被注释掉了），有问题[featureLayer.setRenderer is not a function]，后续解决···
        // var layerDefinition = {
        //     "geometryType": "esriGeometryPoint",
        //     "fields": [{
        //         "name": "ID",
        //         "type": "esriFieldTypeInteger",
        //         "alias": "ID"
        //     }]
        // }
        // var featureCollection = {
        //     layerDefinition: layerDefinition,
        //     featureSet: null
        // };
        // var featureLayer = new esriApi.FeatureLayer(featureCollection, {
        //     mode: esriApi.FeatureLayer.MODE_SNAPSHOT,
        //     outFields: ["*"],
        //     opacity: 1
        // });

        // var heatmapRenderer = new esriApi.HeatmapRenderer({
        //     colors: ["rgba(255, 0, 0, 0)", "rgb(0, 255, 0)", "rgb(255, 255, 0)", "rgb(255, 0, 0)"],
        //     blurRadius: 8,
        //     maxPixelIntensity: 300,
        //     minPixelIntensity: 10
        // });
        //featureLayer.setRenderer(heatmapRenderer);
        map.add(glSupplyAreaO);
        map.add(gl);
        
        map.add(valveAttributeLayer);
        map.add(waterworksAttributeLayer);
        map.add(MaxLayer);
        map.add(MinLayer);
        map.add(compareResultLayer);
        map.add(LocationGraphicsLayer);
        map.add(planCalResultFlowLayer);
        map.add(planCalResultVelocityLayer);
        map.add(supplyPathLayer);
        map.add(diffusionLayer);
        map.add(accuracyMonitorLayer);
        // map.add(featureLayer);
        map.add(supplyPathPositionLayer);
        var hightLightLayer = new esriApi.GraphicsLayer({spatialReference: view.spatialReference});
        var drawToolGraphicsLayer = new esriApi.GraphicsLayer({spatialReference: view.spatialReference});
        map.add(drawToolGraphicsLayer);
        map.add(hightLightLayer);
        map.add(searchLayer);
        map.add(planCalResultDirectionChangeLayer);
        map.add(elementChangeLayer);
        map.add(isStopWaterCalPipe);
        map.add(isStopWaterHydrant);
        map.add(pressureLayer);
        map.add(trafficLayer);
        map.add(dummyLayer);
        map.add(valveChangeLayer);
        //drawClass.AddGraphic(gl);//调用外部js中的方法
        //console.log(urlClass.axiosUrl)
        var point = new esriApi.Point({x: 498766.6875, y:321263.46875, spatialReference: new esriApi.SpatialReference({ wkid: global.spatialReference })});
        var pictureMarkerSymbol = new esriApi.PictureMarkerSymbol({ url: localStorage.getItem("imgPath")+'assets/dingwei_03.png', width: 98, height: 98});
        var simpleMarkerSymbol = new esriApi.SimpleMarkerSymbol({style: "circle", color: [ 0, 255, 0, 0.5 ]});

        var valveStatusImageSource = localStorage.getItem("imgPath")+'assets/valve_change.png';
        var valveCloseSource = localStorage.getItem("imgPath")+'assets/valve_closed.png';
        var valvePartCloseSource = localStorage.getItem("imgPath")+'assets/valve_partclosed.png';
        var waterworksImageSource = localStorage.getItem("imgPath")+'assets/waterFactory/sc.png';
        var maxSource = localStorage.getItem("imgPath")+'assets/colored-pins-blue.png';
        var minSource = localStorage.getItem("imgPath")+'assets/colored-pins-red.png';
        var customerUrl = urlClass.customerUrl;
        var pressureSource = localStorage.getItem("imgPath")+'assets/pressure.png';//压力图片
        var trafficSource = localStorage.getItem("imgPath")+'assets/traffic.png';//流量图片
        var dummySource = localStorage.getItem("imgPath")+'assets/dummy.png';//虚拟点图片

        var pipeLayerId = 8;
        var hour = 0;//结果时间
        var field = 'Result_Flow_' + hour;//查询的字段

        var gra;
        var identifyTask;
        var isMapClick = true;
        var isMapClickSupplyPath = false;
        var isMapClickDiffusion = false;
        var mapClickPoint = '';
        view.on("click", function (e) {
            if(e.button != 0){ return}
            view.hitTest(e).then(function(response){
                if(response.results[0]){
                    var graphic = response.results[0].graphic;
                    if (graphic.layer.id == valveChangeLayer.id) {
                        console.log('阀门动态图层',response.results[0]);
                        axios.get(urlClass.axiosUrl + 'GetValveChangeData/' + String(graphic.attributes.Id) )
                        .then(function (response) {
                            var listData = response.data;
                            console.log('listData',listData);
                            WindowsEvent.MyDispatchEvent("GetValveChangeData", listData);
                        })
                        e.stopPropagation();
                    }
                }
                if(isMapClick || isMapClickSupplyPath || isMapClickDiffusion){
                    myIdentify(e);
                }
            })
        });
        view.popup.watch("visible",function(event){
            if(!event){
                MyHideInfoWindow(event);
            }
        });

        var hide_junc_fm = new esriApi.SimpleMarkerSymbol({size: 10, color: new esriApi.Color("#A80084")});
        var hide_junc = new esriApi.SimpleMarkerSymbol({size: 10, color: new esriApi.Color("#ff0000")});
        var deletedline = new esriApi.SimpleLineSymbol({width: 5, color: new esriApi.Color("#fffce5"), cap: "round"});
        var displayline = new esriApi.SimpleLineSymbol({width: 5, color: new esriApi.Color("#ab0d0d"), cap: "round"});

        view.on("pointer-move", esriApi.promiseUtils.debounce(function (event) {
            if (isClickDraw) {
                hightLightLayer.removeAll();
                isHaveNode = false;
                // drawTool.MovePipe(event, view, errorMy, hightLightLayer);
                // drawTool.MoveNode(event, view, errorMy, hightLightLayer);
                let pro1 = drawTool.MovePipe(event, view, errorMy, hightLightLayer);
                let pro2 = drawTool.MoveNode(event, view, errorMy, hightLightLayer);
                Promise.all([pro1, pro2]).then(function() {});
            }
        }));
        // view.on("pointer-move", function (event) {
        //     if (isClickDraw) {
        //         console.log("promiseUtils2");
        //     }
        // });
        // function myAlert(content, title) {
        //     alert(content, title, {
        //         confirmButtonText: '确定',
        //     });
        // }

        // map.infoWindow.on('hide', MyHideInfoWindow);//infowindow关闭事件
        var clickMapPoint;
        /**
         * Identify查询初始化
         * @param {*} e 地图点击事件对象
         */
        function myIdentify(e) {
            clickMapPoint = new esriApi.Point(e.mapPoint.x, e.mapPoint.y, view.spatialReference);
            var typeTemp = '';

            if (isMapClickSupplyPath) {
                typeTemp = 'SupplyPath';
            }
            else if (isMapClick){
                typeTemp = 'mapClick';
            }
            IdentifyMain(e.mapPoint, typeTemp);
        }

        function IdentifyMain(pointTemp, typeTemp) {
            var idenrifyParams = new esriApi.IdentifyParameters();
            idenrifyParams.returnGeometry = true;
            idenrifyParams.width = view.width;
            idenrifyParams.height = view.height;
            idenrifyParams.geometry = pointTemp;
            idenrifyParams.tolerance = 5;
            idenrifyParams.mapExtent = view.extent;
            idenrifyParams.spatialReference = view.spatialReference;
            identifyTask = new esriApi.IdentifyTask(urlClass.baseMapUrl);
            if (typeTemp == "mapClick" || typeTemp == '') {
                identifyTask.execute(idenrifyParams).then(myResultFunction, function(error){
                    console.log(error);
                });
            }
            else if (typeTemp == "SupplyPath") {
                identifyTask.execute(idenrifyParams).then(SupplyPathResultFunction, function(error){
                    console.log(error);
                });
            }
        }

        var supplyPathReturn = new Object;

        function SupplyPathResultFunction(evt) {
            var elemetidTemp = 0;
            var feature;
            if (evt.results.length > 0) {
                var identifyResult = evt.results[0];
                feature = identifyResult.feature;
                var attributeTemp = feature.attributes;
                if (feature.geometry.type == 'point') {
                    if (isMapClickSupplyPath) {
                        supplyPathReturn.elementId = attributeTemp.ElementId;
                        supplyPathReturn.elementTypeId = attributeTemp.ElementTypeId;
                    }
                    else
                        elemetidTemp = attributeTemp.ElementId;
                }
                else if (feature.geometry.type == 'polyline') {
                    if (isMapClickSupplyPath) {
                        supplyPathReturn.elementId = attributeTemp.StartNodeID;
                        supplyPathReturn.elementTypeId = attributeTemp.StartNodeType;
                    }
                    else
                        elemetidTemp = attributeTemp.StartNodeID;
                }
                else {
                    return;
                }
            }
            if (isMapClickSupplyPath) {
                supplyPathLayer.removeAll();
                supplyPathPositionLayer.removeAll();
                isMapClickSupplyPath = false;
                WindowsEvent.MyDispatchEvent('SupplyPathMapClickReturn', supplyPathReturn);
            }
            if (isMapClickDiffusion) {
                isMapClickDiffusion = false;
                WindowsEvent.MyDispatchEvent('DiffusionMapClickReturn', elemetidTemp);
            }

        }

        /**
         * 减压阀
         */
        var EN_PRVALVE = "0";
        /**
        * 流量阀
        */
        var EN_FCVALVE = "1";
        /**
        * 止回阀
        */
        var EN_CVALVE = "2";
        /**
        * 水泵
        */
        var EN_PUMP = "3";
        /**
        * 水池
        */
        var EN_TANK = "4";
        /**
        * 消火栓
        */
        var EN_HYDRANT = "5";
        /**
        * 阀门
        */
        var EN_VALVE = "6";
        /**
        * 节点
        */
        var EN_JUNCTION = "7";
        /**
        * 管道
        */
        var EN_PIPE = "8";
        var EN_PIPE_1 = "9";
        var EN_PIPE_2 = "10";

        /**
		 * 管道ElementTypeId  69
		 **/
        var EN_PipeElement = 69;
		/**
		 * 止回阀ElementTypeId  309
		 **/
        var EN_CValveElement = 309;
		/**
		 * 阀门ElementTypeId  61
		 **/
        var EN_TCVElement = 61;
		/**
		 * 节点ElementTypeId  55
		 **/
        var EN_JunctionElement = 55;
		/**
		 * 消火栓ElementTypeId  54
		 **/
        var EN_HYDRANTElement = 54;

        /**
         * 管道开关状态
         */
        var pipeState = [
            { label: "开", value: 0 },
            { label: "关", value: 1 }
        ];
        
        /**
         * 水池类型
         */
        var reserviorType = [
            { label: "压力", value: 0 },
            { label: "流量", value: 1 }
        ];
        var reservoirIndex = 0;
        
        /**
         * 创建组件属性的标签
         * @param {*} displayName 组件属性标签名称
         */
        function CreateLabelTitle(displayName) {
            var star = document.createElement("div");
            star.style = "display:inline;width:250px";
            var o1 = document.createElement('span');
            o1.textContent = displayName;
            o1.style = "float:left;text-align:right;display:block;width:110px; float:left;font-family:'SimSun';font-size: 12px;";
            star.appendChild(o1);
            var o = document.createElement('span');
            o.style = 'padding-left:10px;';
            star.appendChild(o);
            return star;
        }

        function CheckChangeData(changeDataTemp, ChangeDatas) {
            var i = 0;
            for (i = 0; i < ChangeDatas.length; i++) {
                if (ChangeDatas[i].changeData == changeDataTemp)
                    return i;
            }
            return -1;
        }

        function CheckChangeFieldName(fieldName, fieldNames) { 
            for (var i = 0; i < fieldNames.length; i++) {
                if (fieldName == fieldNames[i])
                    return true;
            }
            return false;
        }
        function CheckChangeFieldNameIndex(fieldName, fieldNames) {
            for (var i = 0; i < fieldNames.length; i++) {
                if (fieldName == fieldNames[i])
                    return i;
            }
            return -1;
        }

        /**
         * 创建组件属性中可修改属性的输入框
         * @param {*} attributesTemp 组件的某个属性对象
         * @param {*} i 该属性在组件所有属性数组中的索引
         * @param {*} attribute 属性显示的值
         * @param {*} type 组件类型(用于后面获取修改哪类组件的值)
         */
        function CreateInput(attributesTemp, i, attribute, type, elementIdTemp) {
            if(type=="reservoir"){
                i = reservoirIndex==0?i:i+1;
            }
            if(String(attribute)=='undefined')
                attribute = '';
            var o1 = document.createElement('input');
            o1.setAttribute('class', 'el-input__inner');
            o1.style = 'width:70px;height:28px';
            if(!IsRevise)
            o1.disabled = true;
            var index = CheckElement(allElementChangeData, elementIdTemp);
            if (index == -1) {
                attributesTemp[i].changeData = attribute;
                o1.value = attribute;
            }
            else {
                var isChangeTemp = CheckChangeFieldName(attributesTemp[i].fieldName, allElementChangeData[index].fieldName);
                if (isChangeTemp) {
                    var indexChange = CheckChangeFieldNameIndex(attributesTemp[i].fieldName, allElementChangeData[index].fieldName);
                    if (indexChange != -1) {
                        attributesTemp[i].changeData = allElementChangeData[index].ChangeData[indexChange].changeData;
                        o1.value = attributesTemp[i].changeData;
                        o1.style = "background:#4DC86F;width:70px;height:28px";
                    }
                    else {
                        attributesTemp[i].changeData = attribute;
                        o1.value = attribute;
                    }
                }
                else {
                    attributesTemp[i].changeData = attribute;
                    o1.value = attribute;
                }
            }
            attributesTemp[i].originalData = attribute;
            o1.addEventListener('input', myInputChange);
            o1.id = (type + ':' + i);
            return o1;
        }
        /**
         * 创建组件属性中可修改属性的下拉框
         * @param {*} arrayTemp 下拉框的数据源
         * @param {*} attribute 下拉框默认显示的值
         */
        function CreateReserviorSelect(arrayTemp, attribute, attributesTemp, i, typeTemp, elementIdTemp) {
            var o = document.createElement('select');
            o.style = 'width:50px;'
            o.setAttribute('class', 'el-select el-select--mini');
            for (var j = 0; j < arrayTemp.length; j++) {
                var item = document.createElement('option');
                item.value = arrayTemp[j].value;
                item.textContent = arrayTemp[j].label;
                o.appendChild(item);
            }
            o.id = (typeTemp + ':' + i);
            o.addEventListener('change', myReserviorSelectChange);
            o.value = reservoirIndex;
            return o;
        }
        function myReserviorSelectChange(event){
            reservoirIndex = Number(event.target.value);
            console.log('myReserviorSelectChange',reservoirIndex);
            TimeChangeUpdateInfoWindows(infoWindowData);
        }
        /**
         * 创建组件属性中可修改属性的下拉框
         * @param {*} arrayTemp 下拉框的数据源
         * @param {*} attribute 下拉框默认显示的值
         */
        function CreateSelect(arrayTemp, attribute, attributesTemp, i, typeTemp, elementIdTemp) {
            var o = document.createElement('select');
            o.style = 'width:50px;'
            o.setAttribute('class', 'el-select el-select--mini');
            if(!IsRevise)
            o.disabled = true;
            for (var j = 0; j < arrayTemp.length; j++) {
                var item = document.createElement('option');
                item.value = arrayTemp[j].value;
                item.textContent = arrayTemp[j].label;
                o.appendChild(item);
            }
            if(typeTemp=="prv")
                attribute = (attribute=='开'?'0':'1');
            else if(typeTemp=="pump")
                attribute = (attribute=='开'?'0':'1');
            var statusTemp = (attribute == '0' ? "开" : "关");
            var index = CheckElement(allElementChangeData, elementIdTemp);
            if (index == -1) {
                attributesTemp[i].changeData = statusTemp;
                o.value = attribute;
            }
            else {
                var isChangeTemp = CheckChangeFieldName(attributesTemp[i].fieldName, allElementChangeData[index].fieldName);
                if (isChangeTemp) {
                    var indexChange = CheckChangeFieldNameIndex(attributesTemp[i].fieldName, allElementChangeData[index].fieldName);
                    if (indexChange != -1) {
                        attributesTemp[i].changeData = allElementChangeData[index].ChangeData[indexChange].changeData;
                        o.value = (attributesTemp[i].changeData == "开" ? "0" : "1");
                        o.style = "background:#4DC86F;width:50px;";
                    }
                    else {
                        attributesTemp[i].changeData = attribute;
                        o1.value = attribute;
                    }
                }
            }
            attributesTemp[i].originalData = statusTemp;
            o.id = (typeTemp + ':' + i);
            o.addEventListener('change', mySelectChange);
            return o;
        }
        /**
         * 创建组件属性的单位
         * @param {*} textTemp 需要显示的单位
         */
        function CreateLabelUnit(textTemp) {
            var o = document.createElement('span');
            o.textContent = textTemp;
            return o;
        }
        /**
         * 创建组件属性框中的按钮
         * @param {*} labelTemp 按钮显示值
         */
        function CreateBtn(labelTemp, idTemp) {
            var btn = document.createElement('input');
            //var btn = document.createElement('button');
            btn.type = 'button';
            btn.style['height'] = '28px';
            btn.value = labelTemp;
            btn.id = idTemp;
            if (labelTemp == "确定")
                btn.setAttribute('class', 'el-button el-button--success el-button--mini')
            else if (labelTemp == "取消")
                btn.setAttribute('class', 'el-button el-button--primary el-button--mini')
            btn.addEventListener('click', BtnClick);
            return btn;
        }
        /**
         * 创建组件属性框中的按钮
         * @param {*} labelTemp 按钮显示值
         */
        function CreateTcvChangeBtn(featureTemp) {
            var btn = document.createElement('input');
            //var btn = document.createElement('button');
            btn.type = 'button';
            btn.style['height'] = '28px';
            btn.value = '状态切换';
            btn.id = 'typeChange';
            btn.setAttribute('class', 'el-button el-button--success el-button--mini')
            btn.addEventListener('click', function(respone){
                TcvChangeBtnClick(featureTemp);
            });
            return btn;
        }
        function TcvChangeBtnClick(featureTemp) {
            console.log('featureTemp',featureTemp)
            var attributes = featureTemp.attributes;
            var geometry = featureTemp.geometry;
            var obj = new Object();
            obj.label = "状态切换 开度:";
            obj.type = "阀门";
            obj.ValveNumber = attributes.阀门编号;
            obj.LayerId = global.layerId.EN_TCVTYPECHANGE;
            obj.Show = true;
            obj.ElementId = attributes.ElementId;
            obj.point = geometry;
            obj.InitialSettingsRelativeClosure = String(attributes.ValveSetting)=="2"?100:'0';
            obj.InitialSettingsRelativeClosure1 = String(attributes.ValveSetting)=="2"?"0":(1-Number(attributes.InitialSettingsRelativeClosure))*100;
            if(String(obj.ElementId).indexOf('F') > -1){
                obj.InitialSettingsRelativeClosure1 = 100;
            }
            for(var i=0;i<allElementChangeData.length;i++){
                if(String(allElementChangeData[i].ElementId)==String(obj.ElementId)){
                    allElementChangeData.splice(i,1);
                    break;
                }
            }
            console.log('TcvChangeBtnClick',allElementChangeData)
            WindowsEvent.MyDispatchEvent("sure",obj);
            allElementChangeData.push(obj);
        }
        /**
         * 获取infowindow显示内容
         * @param {*} attributesTemp 需要显示的所有属性
         * @param {*} featureTemp 服务中查询出来的基础属性
         * @param {*} resultTemp 结果属性(从后台服务中获取)
         * @param {*} type 组件类型  attributesTemp,featureTemp,resultTemp,type
         */
        var buttonboxdiv = '';
        function GetAttribute(attributes, featureTemp, resultTemp, type) {
            //创建outboxdiv节点
            var outboxdiv = document.createElement("div");
            outboxdiv.id = "outboxdiv";
            /* outboxdiv.style.cssText = "width:100%;height:450px;" */
            outboxdiv.style.cssText = "width:100%;"
            //创建outboxdiv的子节点newdiv
            var newdiv = document.createElement("div");
            newdiv.className = "switch-animate switch-on"
            newdiv.id = "switch_div"
            /* newdiv.style.cssText =
                "height: 420px;" */

            outboxdiv.appendChild(newdiv);
            var boxList = new Array();
            var tboxList = new Array();
            var leftList = new Array();
            var rightList = new Array();
            var allList = new Array();
            //创建newdiv的子节点
            var son1 = document.createElement("div");
            son1.id = "son1_div"
            son1.style.cssText =
                "width:100%;height:238px;overflow:auto"
            newdiv.appendChild(son1)
            //for循环，创建son1的子节点
            for (var i = 0; i < attributes.length; i++) {
                if(type=="reservoir"){
                    if(i==3||i==5){
                        if(reservoirIndex!=0){
                            continue;
                        }
                    }else if(i==4||i==6){
                        if(reservoirIndex!=1){
                            continue;
                        }
                    }
                }
                var sonson1 = document.createElement('div');
                sonson1.id = "sonson_1" + i

                if (i % 2 == 0) {
                    sonson1.className = "box"
                }
                else {
                    sonson1.className = "tbox"
                }
                sonson1.style.cssText =
                    "display: -webkit-box;display: -webkit-flex; display: -ms-flexbox;display:flex;flex-direction:row;flex-wrap:nowrap;justif-content: center;align-items: center;width:100%;height:40px"
                son1.appendChild(sonson1)
                if (i % 2 == 0)
                    boxList.push(sonson1)
                else
                    tboxList.push(sonson1)
                allList.push(sonson1)

            }
            if (allList) {
                for (var i = 0; i < allList.length; i++) {
                    var mya = allList[i];
                    if (i % 2 == 0)
                        mya.style.backgroundColor = "var(--mianhome-bg)";
                    var sonson1left = document.createElement("div")
                    var sonson1right = document.createElement("div")
                    sonson1left.id = "sonson1left_1"
                    sonson1right.id = "sonson1right_1" + i
                    sonson1left.className = "leftbox"
                    sonson1right.className = "rightbox"
                    sonson1left.style.cssText =
                        "width:100px;border-right:var(--border-solid);line-height:40px;text-align:start;padding-right:10px;margin-left:10px;font-size:12px;"
                    sonson1right.style.cssText =
                        "display: flex;flex-flow: row nowrap;justify-content:space-between; align-items:center;text-align:start;padding-left:10px;font-size:12px;width:182px;"
                    mya.appendChild(sonson1left)
                    mya.appendChild(sonson1right)
                    leftList.push(sonson1left)
                    rightList.push(sonson1right)
                }
            }
            //在sonson1right下创建子节点div
            var rightListson = new Array();
            for (var i = 0; i < rightList.length;i++){
                var myarson = rightList[i]
                var sonson1right_son = document.createElement("div")
                sonson1right_son.className = "sonson1right_son"
                sonson1right_son.style.cssText = "display: flex;flex-flow: row nowrap;justify-content:flex-start; align-items:center;width:122px;/* background-color:red; */"
                myarson.appendChild(sonson1right_son)
                rightListson.push(sonson1right_son)
            }
            //在每行的左右两边添加节点或插入文本
            var leftboxtotal = leftList
            for (var ltbox = 0; ltbox < leftboxtotal.length; ltbox++) {
                var obj = "";
                if(type=="reservoir"){
                    if(ltbox==leftboxtotal.length-2){
                        obj = reservoirIndex==0?attributes[ltbox]:attributes[ltbox+1];
                    }else if(ltbox==leftboxtotal.length-1){
                        obj = reservoirIndex==0?attributes[ltbox+1]:attributes[ltbox+2];
                    }
                    else{
                        obj = attributes[ltbox];
                    }
                }else{
                    obj = attributes[ltbox];
                }
               
                leftboxtotal[ltbox].innerHTML = obj.displayName;
            }
            //向右侧每一行添加span标签
            var rightboxtotal = rightListson/* rightList */
            var newrightfather = rightList
            var count = 0;
            if(type=="reservoir"){
                count = reservoirIndex==0?0:1;
            }
            var elementIdTemp = featureTemp.attributes.ElementId;
            console.log('reservoirIndex',reservoirIndex)
            for (var i = 0; i < rightboxtotal.length; i++) {
                // console.log('count',count)
                var obj = "";
                if(type=="reservoir"){
                    if(i==rightboxtotal.length-2){
                        obj = reservoirIndex==0?attributes[i]:attributes[i+1];
                        
                    }else if(i==rightboxtotal.length-1){
                        obj = reservoirIndex==0?attributes[i+1]:attributes[i+2];
                    }
                    else
                    {
                        obj = attributes[i];
                    }
                }else{
                    obj = attributes[i];
                }
                // console.log('obj',obj)
                var attribute = featureTemp.attributes[obj.fieldName];
                
                if (obj.type == "attribute") {
                    if (obj.fieldName == "PipeStatus")
                        ;
                    else if (obj.fieldName == "ValveSetting") {
                        attribute = (attribute == 2 ? "关" : "开");
                    }
                    else if (obj.fieldName == "PumpStatus") {
                        attribute = (attribute == 2 ? "关" : "开");
                    }
                    else if (obj.fieldName == "InitialSettingsRelativeClosure") {
                         if(String(featureTemp.attributes["ValveSetting"])=="2"){
                            attribute = 0;
                        }else if(String(featureTemp.attributes.ElementId).indexOf('F') == -1){
                            attribute = ((1 - Number(attribute)) * 100);
                            if(Number(attribute)==100)
                            attribute = 100;
                            else if(Number(attribute)==0)
                            attribute = 0;
                            else
                            attribute = attribute.toFixed(2)
                        }
                    }
                    else if (obj.fieldName == "PipeAge") {
                        if (attribute == null)
                            attribute = "无";
                    }

                    if (obj.rounding)
                        attribute = parseFloat(attribute).toFixed(2);
                    if (obj.displayName=="横坐标"||obj.displayName=="纵坐标")
                        attribute = parseFloat(attribute).toFixed(3);
                    if (obj.displayName=="起始节点"||obj.displayName=="终止节点")
                    {
                        if(String(attribute).indexOf('-A') > -1 || String(attribute).indexOf('-B') > -1){
                            attribute = attribute.split('-')[0];
                        }
                    }
                    if (obj.displayType == "label") {
                        obj.originalData = attribute;
                        if(String(attribute)=='undefined')
                        attribute = '';
                        var temp = CreateLabel(attribute, attributes, i)
                        rightboxtotal[i].appendChild(temp)
                    } else if (obj.displayType == "input") {
                        var temp = CreateInput(attributes, i, attribute, type, elementIdTemp);
                        rightboxtotal[i].appendChild(temp)
                    }
                    else if (obj.displayType == "combox"&&obj.fieldName != "") {
                        var temp = CreateSelect(pipeState, attribute, attributes, i, type, elementIdTemp);
                        rightboxtotal[i].appendChild(temp)
                    }
                    else if (obj.displayType == "combox"&&obj.fieldName == "") {
                        var temp = CreateReserviorSelect(reserviorType, attribute, attributes, i, type, elementIdTemp);
                        rightboxtotal[i].appendChild(temp)
                    }
                }
                else {
                    var roundingTempData = "";
                    if (obj.fieldName == "Direction_Change_") {
                        resultTemp[count] = parseInt(resultTemp[count]).toFixed(0);
                    }
                    if (obj.rounding) {
                        roundingTempData = resultTemp[count];
                        if(String(obj.fieldName)=="Result_Demand_")
                            resultTemp[count] = parseFloat(resultTemp[count]).toFixed(3);
                        else
                            resultTemp[count] = parseFloat(resultTemp[count]).toFixed(2);
                    }
                    if (obj.displayType == "label") {
                        var temp = CreateLabelResult(resultTemp[count], roundingTempData)
                        rightboxtotal[i].appendChild(temp)
                        if (tableNameMain != "" && resultTemp.length > (count + 4)) {
                            var temp = "";
                            if(type=="reservoir"){
                                roundingTempData = resultTemp[resultTemp.length-1];
                                resultTemp[resultTemp.length-1] = Number(resultTemp[resultTemp.length-1]).toFixed(2);
                                temp = CreateLabelResult("(" + resultTemp[resultTemp.length-1] + ")", roundingTempData)
                            }else{
                                roundingTempData = resultTemp[count + 4];
                                resultTemp[count + 4] = Number(resultTemp[count + 4]).toFixed(2);
                                temp = CreateLabelResult("(" + resultTemp[count + 4] + ")", roundingTempData)
                            }
                            rightboxtotal[i].appendChild(temp)
                        }
                        if(tableNameMain != "" && type=="reservoir"){
                            roundingTempData = resultTemp[resultTemp.length-1];
                            resultTemp[resultTemp.length-1] = Number(resultTemp[resultTemp.length-1]).toFixed(2);
                            var temp = CreateLabelResult("(" + resultTemp[resultTemp.length-1] + ")", roundingTempData)
                            rightboxtotal[i].appendChild(temp)
                        }
                        if(type=="tcv"){
                            if (tableNameMain != "" && resultTemp.length > (count + 2)) {
                                roundingTempData = resultTemp[count + 2];
                                resultTemp[count + 2] = Number(resultTemp[count + 2]).toFixed(2);
                                var temp = CreateLabelResult("(" + resultTemp[count + 2] + ")", roundingTempData)
                                rightboxtotal[i].appendChild(temp)
                            }
                        }
                        
                    } else if (obj.displayType == "input") {
                        var temp = CreateInput(attributes, i, resultTemp[count], type, elementIdTemp);
                        rightboxtotal[i].appendChild(temp)
                    }
                    count++;
                }
                if (obj.unit != "") {
                    var temp = CreateLabel(obj.unit, attributes, i);
                    rightboxtotal[i].appendChild(temp)
                    if(obj.type!="attribute"&&obj.fieldName!="Direction_Change_"){
                        var objTemp = obj.fieldName;
                        var strArr = objTemp.split('_');
                        if(!IsRevise){
                            var temp = CreateBtnResult(elementIdTemp,strArr[1],obj.displayName,type,obj.unit);
                            newrightfather[i].appendChild(temp);
                        }
                    }
                    if(obj.fieldName == "InitialSettingsRelativeClosure"){
                        var temp = CreateTcvChangeBtn(featureTemp);
                        rightboxtotal[i].appendChild(temp)
                    }
                }
            }
            buttonboxdiv = document.createElement("div")
            buttonboxdiv.id = "buttonboxdiv"
            var indexMy = CheckElement(allElementChangeData,elementIdTemp);
            if(indexMy!=-1&&allElementChangeData.length!=0){
                buttonboxdiv.style.cssText = "height:30px;width:100%;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:flex-end;align-items:flex-end;margin-top:8px;padding-right:20px;"
            }
            else
            buttonboxdiv.style.cssText = "height:30px;width:100%;display:none"
            newdiv.insertBefore(buttonboxdiv, null);
           /*  son1.insertBefore(buttonboxdiv, null); */
            var btn1 = CreateBtn('确定', 'sure');
            var btn2 = CreateBtn('取消', 'cancel');
            buttonboxdiv.appendChild(btn1);
            buttonboxdiv.appendChild(btn2);
            return outboxdiv;
        }

      /*   function CreateLabel(textTemp, attributesTemp, i) {
            var spantext2 = document.createElement("span")
            spantext2.className = "spanboxt2"
            spantext2.innerHTML = textTemp;
            console.log("%cString(attributesTemp[i].fieldName)", "color:red;font-size:20px", String(attributesTemp[i].fieldName))
            if (String(attributesTemp[i].displayName) == "GIS编号" || String(attributesTemp[i].displayName) == "地址"){
                spantext2.style.cssText =
                    "display:inline-block!important;height:28px!important;line-height:10px!important;margin-right:3px;margin-left:5px;"
            }else{
                spantext2.style.cssText =
                    "display:inline-block;height:20px;line-height:20px;margin-right:3px;margin-left:5px;"
            }
            return spantext2;
        } */
        function CreateLabel(textTemp, attributesTemp, i) {
            var spantext2 = document.createElement("div")
            spantext2.className = "spanboxt2"
            spantext2.innerHTML = textTemp;
            // console.log("%cString(attributesTemp[i].fieldName)", "color:red;font-size:20px", String(attributesTemp[i].fieldName))
            spantext2.style.cssText = "display:flex;flex-flow:row nowrap;justify-content: center;align-items: center;height:20px;margin-right:3px;"
            if (textTemp.length > 19) {
                spantext2.style.cssText = "justify-content: center;align-items: center;height:20px;margin-right:3px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;";
                spantext2.title = textTemp;
            }
            return spantext2;
        }

        function CreateLabelResult(textTemp, roundingTempData) {
            var spantext2 = document.createElement("span")
            spantext2.className = "spanboxt2"
            //spantext2.title = roundingTempData;
            spantext2.innerHTML = textTemp;//width:55px;
            spantext2.style.cssText =
                "margin-right:3px;display:inline-block;height:20px;line-height:20px;color:var(--link-color);font-family:'Arial';font-size: 12px;"
            return spantext2;
        }
        /**
         * 创建曲线按钮
         * @param {*} id 
         * @param {*} field 
         */
        function CreateBtnResult(id,field,label,type,unit) {
            var spantext2 = document.createElement("div");
            spantext2.id = field;
            spantext2.className = field;
            spantext2.title = '24小时曲线';
            spantext2.style.cssText =
                "width: 20px;margin-right:10px;height: 20px;background: url('"+localStorage.getItem("imgPath")+"assets/曲线01.png') no-repeat;background-position: right center;cursor: pointer;/* background-color:green */";
            spantext2.addEventListener('click', function(event){
                ChartClick(event,id,field,label,type,unit);
            });
            return spantext2;
        }

        function ChartClick(event,id,field,label,type,unit){
            if(String(event.target.id)==field){
                var parameter = {
                    ElementId:id,
                    Attribute:field
                
                }
                var urlTemp = "";
                switch(type){
                    case "junction":
                    urlTemp = urlClass.axiosUrl + "GetNodeResult";
                    break;
                    case "pipe":
                    urlTemp = urlClass.axiosUrl + "GetPipeResult";
                    break;
                    case "tcv":
                    urlTemp = urlClass.axiosUrl + "GetTcvResult";
                    break;
                    case "prv":
                    urlTemp = urlClass.axiosUrl + "GetPrvResult";
                    break;
                    case "fcv":
                    urlTemp = urlClass.axiosUrl + "GetFcvResult";
                    break;
                    case "pump":
                    urlTemp = urlClass.axiosUrl + "GetPumpResult";
                    break;
                    case "reservoir":
                    urlTemp = urlClass.axiosUrl + "GetReservoirResult";
                    break;
                }
                console.log('urlTemp',JSON.stringify(parameter))
                console.log('开始:',new Date());
                axios
                .post(
                    urlTemp,
                  JSON.stringify(parameter),
                  { headers: { "Content-Type": "application/json;" } }
                )
                .then(function(respone){
                    console.log('结束:',new Date());
                    GetPipeResultReturn(respone,label,unit)
                });
            }
        }

        function GetPipeResultReturn(respone,label,unit){
            var obj = {data:respone.data,title:label,unit}
            WindowsEvent.MyDispatchEvent('GetPipeResultReturn',obj);
        }

        /**
         * 输入框内容变化事件
         * @param {*} event 事件的对象
         */
        function myInputChange(event) {
            //alert(event)
            var idTemp = String(event.target.id);
            var typeTemp = idTemp.split(':')[0];
            var indexTemp = idTemp.split(':')[1];
            var tempChangeData = "";
            var tempOriginalData = "";
            if (typeTemp == "pipe") {
                attributeData.pipeAttribute[indexTemp].changeData = event.target.value;
                tempChangeData = attributeData.pipeAttribute[indexTemp].changeData;
                tempOriginalData = attributeData.pipeAttribute[indexTemp].originalData;
            }
            else if (typeTemp == "junction") {
                attributeData.junctionAttribute[indexTemp].changeData = event.target.value;
                tempChangeData = attributeData.junctionAttribute[indexTemp].changeData;
                tempOriginalData = attributeData.junctionAttribute[indexTemp].originalData;
            }
            else if (typeTemp == "tcv") {
                attributeData.tcvAttribute[indexTemp].changeData = event.target.value;
                tempChangeData = attributeData.tcvAttribute[indexTemp].changeData;
                tempOriginalData = attributeData.tcvAttribute[indexTemp].originalData;
            }
            else if (typeTemp == "prv") {
                attributeData.prvAttribute[indexTemp].changeData = event.target.value;
                tempChangeData = attributeData.prvAttribute[indexTemp].changeData;
                tempOriginalData = attributeData.prvAttribute[indexTemp].originalData;
            }
            else if (typeTemp == "fcv") {
                attributeData.fcvAttribute[indexTemp].changeData = event.target.value;
                tempChangeData = attributeData.fcvAttribute[indexTemp].changeData;
                tempOriginalData = attributeData.fcvAttribute[indexTemp].originalData;
            }
            else if (typeTemp == "pump") {
                attributeData.pumpAttribute[indexTemp].changeData = event.target.value;
                tempChangeData = attributeData.pumpAttribute[indexTemp].changeData;
                tempOriginalData = attributeData.pumpAttribute[indexTemp].originalData;
            }else if (typeTemp == "reservoir") {
                attributeData.reservoirAttribute[indexTemp].changeData = event.target.value;
                tempChangeData = attributeData.reservoirAttribute[indexTemp].changeData;
                tempOriginalData = attributeData.reservoirAttribute[indexTemp].originalData;
            }
            var tempInput = event.target;
            if (Number(tempChangeData) != Number(tempOriginalData)) {
                tempInput.style = "background:#4DC86F;width:70px;height:28px";
                buttonboxdiv.style.cssText = "height:30px;width:100%;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:flex-end;align-items:flex-end;margin-top:8px;padding-right:20px;"
            }
            else {
                tempInput.style = "width:70px;height:28px";
                buttonboxdiv.style.cssText = "height:30px;width:100%;display:none"
            }
        }

        /**
         * 下拉框内容变化事件
         * @param {*} event 事件对象
         */
        function mySelectChange(event) {
            var idTemp = String(event.target.id);
            var typeTemp = idTemp.split(':')[0];
            var indexTemp = idTemp.split(':')[1];
            var tempChangeData;
            var tempOriginalData;
            if (typeTemp == "pipe") {
                attributeData.pipeAttribute[indexTemp].changeData = (String(event.target.value) == '0' ? "开" : "关");
                tempChangeData = attributeData.pipeAttribute[indexTemp].changeData;
                tempOriginalData = attributeData.pipeAttribute[indexTemp].originalData;
            }
            else if (typeTemp == "prv") {
                attributeData.prvAttribute[indexTemp].changeData = (String(event.target.value) == '0' ? "开" : "关");
                tempChangeData = attributeData.prvAttribute[indexTemp].changeData;
                tempOriginalData = attributeData.prvAttribute[indexTemp].originalData;
            }
            else if (typeTemp == "fcv") {
                attributeData.fcvAttribute[indexTemp].changeData = (String(event.target.value) == '0' ? "开" : "关");
                tempChangeData = attributeData.fcvAttribute[indexTemp].changeData;
                tempOriginalData = attributeData.fcvAttribute[indexTemp].originalData;
            }
            else if (typeTemp == "pump") {
                attributeData.pumpAttribute[indexTemp].changeData = (String(event.target.value) == '0' ? "开" : "关");
                tempChangeData = attributeData.pumpAttribute[indexTemp].changeData;
                tempOriginalData = attributeData.pumpAttribute[indexTemp].originalData;
            }
            var tempSelect = event.target;
            if (String(tempChangeData) != String(tempOriginalData)) {
                tempSelect.style = "background:#4DC86F;width:50px;";
                buttonboxdiv.style.cssText = "height:30px;width:100%;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:flex-end;align-items:flex-end;margin-top:8px;padding-right:20px;"
            }
            else {
                tempSelect.style = "width:50px;";
                buttonboxdiv.style.cssText = "height:30px;width:100%;display:none"
            }
        }
        /**
         * 获取组件的修改属性
         * @param {*} attributesTemp 组件属性集合
         */
        function GetChangeAttribute(attributesTemp) {
            var selectElement = new Object;
            selectElement.ChangeData = new Array;
            selectElement.fieldName = new Array;
            for (var i = 0; i < attributesTemp.length; i++) {
                var itemTemp = attributesTemp[i];
                if (itemTemp.displayType == "input") {
                    if (Number(itemTemp.originalData) != Number(itemTemp.changeData)) {
                        var item = new Object;
                        item.originalData = itemTemp.originalData;
                        item.changeData = itemTemp.changeData;
                        item.isAdd = false;
                        item.label = itemTemp.displayName;
                        selectElement[itemTemp.fieldName] = itemTemp.changeData;
                        selectElement[itemTemp.fieldName + "O"] = itemTemp.originalData;
                        selectElement.fieldName.push(itemTemp.fieldName);
                        selectElement.ChangeData.push(item);
                    }
                }
                else if (itemTemp.displayType == "combox") {
                    if (String(itemTemp.originalData) != String(itemTemp.changeData)) {
                        var item = new Object;
                        item.originalData = itemTemp.originalData;
                        item.changeData = itemTemp.changeData;
                        item.label = itemTemp.displayName;
                        item.isAdd = false;
                        selectElement[itemTemp.fieldName] = itemTemp.changeData;
                        selectElement[itemTemp.fieldName + "O"] = itemTemp.originalData;
                        selectElement.fieldName.push(itemTemp.fieldName);
                        selectElement.ChangeData.push(item);
                    }
                }
                else if (itemTemp.fieldName == "ElementId") {
                    selectElement[itemTemp.fieldName] = itemTemp.originalData;
                }
                else if(itemTemp.fieldName == "阀门编号"){
                    selectElement.ValveNumber = itemTemp.originalData;
                }
            }

            return selectElement;
        }

        /**
         * 判断元素属性是否发生改变
         * @param {*} attributesTemp 元素属性列表
         */
        function JudgeAttributeChangeReservoir() {
            for (var i = 0; i < attributeData.reservoirAttribute.length; i++) {
                var itemTemp = attributeData.reservoirAttribute[i];
                if (itemTemp.displayType == "input") {
                    if(reservoirIndex==0)
                    {
                        attributeData.reservoirAttribute[i+1].changeData = attributeData.reservoirAttribute[i+1].originalData;   
                        break;       
                    }
                    else{
                        attributeData.reservoirAttribute[i].changeData = attributeData.reservoirAttribute[i].originalData;   
                        break;
                    }
                }
            }
        }

        /**
         * 判断元素属性是否发生改变
         * @param {*} attributesTemp 元素属性列表
         */
        function JudgeAttributeChange(attributesTemp) {
            var returnResult = false;
            for (var i = 0; i < attributesTemp.length; i++) {
                var itemTemp = attributesTemp[i];
                if (itemTemp.displayType == "input") {
                    if (Number(itemTemp.changeData) != Number(itemTemp.originalData)) {
                        returnResult = true;
                        break;
                    }
                }
                else if (itemTemp.displayType == "combox") {
                    if (String(itemTemp.changeData) != String(itemTemp.originalData)) {
                        returnResult = true;
                        break;
                    }
                }
            }
            return returnResult;
        }

        /**
         * 图上查询窗口中按钮的点击事件
         * @param {*} event 事件的对象
         */
        function BtnClick(event) {
            var myEvent = new CustomEvent('event_name', {
                detail: { type: 'This is title!' },
            });
            myEvent.detail.type = event.target.id;
            if (event.target.id == "cancel") {
                // map.infoWindow.hide();
                view.popup.close();
                return;
            }
            var selectElement = new Object;
            var isChange = false;
            var typeTemp = "";
            if (mySelectLayerId == global.layerId.EN_PIPE || mySelectLayerId == global.layerId.EN_PIPE_1 || mySelectLayerId == global.layerId.EN_PIPE_2 || mySelectLayerId == global.layerId.EN_ADD_PIPE_O) {
                isChange = JudgeAttributeChange(attributeData.pipeAttribute);
                if (isChange) {
                    selectElement = GetChangeAttribute(attributeData.pipeAttribute);
                    console.log('selectElement',selectElement)
                    if (mySelectLayerId == global.layerId.EN_ADD_PIPE_O) {
                        selectElement.LayerId = global.layerId.EN_ADD_PIPE;
                        for (var i = 0; i < AddElementData.length; i++) {
                            var obj = AddElementData[i];
                            if (String(selectElement.ElementId) == String(obj.ElementId)) {
                                selectElement.CoordinateX = obj.CoordinateX;
                                selectElement.CoordinateY = obj.CoordinateY;
                                selectElement.startId = obj.startId;
                                selectElement.endId = obj.endId;
                                selectElement.diameter = obj.diameter;
                                selectElement.length = obj.length;
                                selectElement.rcoeff = obj.rcoeff;
                                selectElement.lcoeff = obj.lcoeff;
                                selectElement.status = obj.status;
                                selectElement.X = obj.X;
                                selectElement.Y = obj.Y;
                                selectElement.XMin = obj.XMin;
                                selectElement.YMin = obj.YMin;
                                selectElement.XMax = obj.XMax;
                                selectElement.YMax = obj.YMax;
                                //selectElement.管径 = obj.管径;
                                selectElement.Physical_HazenWilliamsC = obj.Physical_HazenWilliamsC;
                                selectElement.HMIGeometryScaledLength = obj.HMIGeometryScaledLength;
                                selectElement.startId = obj.startId;
                                selectElement.endId = obj.endId;
                                selectElement.StartNodeID = obj.StartNodeID;
                                selectElement.EndNodeID = obj.EndNodeID;
                                selectElement.位置 = obj.位置;
                                selectElement.分公司 = obj.分公司;
                                selectElement.埋设时间 = obj.埋设时间;
                                selectElement.Physical_PipeMaterial = obj.Physical_PipeMaterial;
                                selectElement.PipeStatusO = 0;
                                selectElement.PipeStatus = selectElement.PipeStatus=='开'?0:1;
                                break;
                            }
                        }
                    }
                    else
                        selectElement.LayerId = global.layerId.EN_PIPE;
                    typeTemp = "管道";
                }
            }
            else if (mySelectLayerId == global.layerId.EN_JUNCTION || mySelectLayerId == global.layerId.EN_ADD_NODE_O) {
                isChange = JudgeAttributeChange(attributeData.junctionAttribute);
                if (isChange) {
                    selectElement = GetChangeAttribute(attributeData.junctionAttribute);
                    if (mySelectLayerId == global.layerId.EN_ADD_NODE_O) {
                        selectElement.LayerId = global.layerId.EN_ADD_NODE;
                        for (var i = 0; i < AddElementData.length; i++) {
                            var obj = AddElementData[i];
                            if (String(selectElement.ElementId) == String(obj.ElementId)) {
                                selectElement.X = obj.X;
                                selectElement.Y = obj.Y;
                                selectElement.initConc = obj.initConc;
                                selectElement.emitterCoeff = obj.emitterCoeff;
                                selectElement.zoneId = obj.zoneId;
                                selectElement.Elev = obj.Elev;
                                clickMapPoint = null;
                                break;
                            }
                        }
                    }
                    else
                        selectElement.LayerId = global.layerId.EN_JUNCTION;
                    typeTemp = "节点";
                }
            }
            else if (mySelectLayerId == global.layerId.EN_VALVE || mySelectLayerId == global.layerId.EN_ADD_VALVE_O) {
                isChange = JudgeAttributeChange(attributeData.tcvAttribute);
                if (isChange) {
                    selectElement = GetChangeAttribute(attributeData.tcvAttribute);
                    selectElement.LayerId = EN_VALVE;
                    for (var i = 0; i < AddElementData.length; i++) {
                        var obj = AddElementData[i];
                        if (String(selectElement.ElementId) == String(obj.ElementId)) {
                            selectElement.X = obj.X;
                            selectElement.Y = obj.Y;
                            selectElement.initConc = obj.initConc;
                            selectElement.emitterCoeff = obj.emitterCoeff;
                            selectElement.zoneId = obj.zoneId;
                            selectElement.Elev = obj.Elev;
                            clickMapPoint = null;
                            break;
                        }
                    }
                    typeTemp = "阀门";
                }
            }else if (mySelectLayerId == global.layerId.EN_PRVALVE) {
                isChange = JudgeAttributeChange(attributeData.prvAttribute);
                if (isChange) {
                    selectElement = GetChangeAttribute(attributeData.prvAttribute);
                    selectElement.LayerId = global.layerId.EN_PRVALVE;
                    typeTemp = "减压阀";
                }
            }else if (mySelectLayerId == global.layerId.EN_FCVALVE) {
                isChange = JudgeAttributeChange(attributeData.fcvAttribute);
                if (isChange) {
                    selectElement = GetChangeAttribute(attributeData.fcvAttribute);
                    selectElement.LayerId = global.layerId.EN_FCVALVE;
                    typeTemp = "流量阀";
                }
            }else if (mySelectLayerId == global.layerId.EN_PUMP) {
                isChange = JudgeAttributeChange(attributeData.pumpAttribute);
                if (isChange) {
                    selectElement = GetChangeAttribute(attributeData.pumpAttribute);
                    selectElement.LayerId = global.layerId.EN_PUMP;
                    typeTemp = "水泵";
                }
            }else if (mySelectLayerId == global.layerId.EN_TANK) {
                JudgeAttributeChangeReservoir();
                isChange = JudgeAttributeChange(attributeData.reservoirAttribute);
                if (isChange) {
                    selectElement = GetChangeAttribute(attributeData.reservoirAttribute);
                    selectElement.LayerId = global.layerId.EN_TANK;
                    typeTemp = "水池";
                }
            }
            if (isChange) {
                selectElement.type = typeTemp;
                if (clickMapPoint) {
                    selectElement.point = new esriApi.Point(clickMapPoint.x, clickMapPoint.y, view.spatialReference);
                } else {
                    selectElement.point = new esriApi.Point(selectElement.X, selectElement.Y, view.spatialReference);
                }
                myEvent.detail.data = selectElement;
                if (window.dispatchEvent) {
                    window.dispatchEvent(myEvent);
                } else {
                    window.fireEvent(myEvent);
                }
                // map.infoWindow.hide();
                view.popup.close();
                var indexTemp = CheckElement(allElementChangeData, selectElement.ElementId);
                if (indexTemp != -1) {
                    allElementChangeData.splice(indexTemp, 1);
                }
                allElementChangeData.push(selectElement)
            }
            else {
                Message({showClose: true, message: '请先修改属性'});
            }

        }

        var allElementChangeData = new Array();
        function CheckElement(allData, elementIdTemp) {
            var returnIndex = -1;
            for (var i = 0; i < allData.length; i++) {
                var itemTemp = allData[i];
                if (String(itemTemp.LayerId) != global.layerId.EN_TCVTYPECHANGE && itemTemp.ElementId == elementIdTemp) {
                    returnIndex = i;
                    break;
                }
            }
            return returnIndex;
        }
        function popup() {
            //$(".esriPopup .titlePane").css({ 'background-color': '#f5f5f5', 'color': '#000000', 'height': '20px' })
            //$(".esriPopup .contentPane").css({ 'background-color': '#ffffff', 'color': '#000000' })
            //$(".esriPopup .actionsPane").css({ 'background-color':'rgba(64,64,64,0.8)' })

            $(".esriPopup .titlePane").css({
              'text-indent': '7px',
              'background-color': '#3A414E',
              'height': '29px',
              'line-height': '29px'
            })
           $(".esriPopup .titleButton.maximize").css({ 'display':'none' })
           $(".esriPopup .titleButton").css({
             'top': '7px'
           })
           $(".esriPopup .titleButton.close").css({
             'right': '10px'
           })
           $(".esriPopup .sizer").css({
             'width':'100%','height':'100%'
           })
            /*  $(".esriPopup .contentPane").css({
               'max-height': '450px', 'width': '100%',

             }) */
            $(".esriPopup .contentPane").css({
            'height': '100%',
            'width': '100%',

            })
        }
        function popupCustomer(){
            $(".esriPopup .titleButton.maximize").css({ 'display':'none' })
            $(".esriPopup .sizer").css({ 'width':'300px' })
        }
        /**
         * 将管道结果接口返回数据拆分
         * @param {*} objTemp 结果
         */
        function GetPipeResult(objTemp) {
            objTemp = objTemp[0];
            var array = new Array();
            if (objTemp.Flow == null)
                objTemp.Flow = 0;
            if (objTemp.Velocity == null)
                objTemp.Velocity = 0;
            if (objTemp.Headloss == null)
                objTemp.Headloss = 0;
            if (objTemp.DirectionChange == null)
                objTemp.DirectionChange = 0;
            var array = new Array();
            array.push(objTemp.Flow);
            array.push(objTemp.Velocity);
            array.push(objTemp.Headloss);
          /*   array.push(objTemp.Age);
            array.push(objTemp.SupplyAreaLabel); */
            array.push(objTemp.DirectionChange);

            if (objTemp.FlowCalculate != null)
                array.push(Number(objTemp.FlowCalculate));
            if (objTemp.VelocityCalculate != null)
                array.push(Number(objTemp.VelocityCalculate));
            if (objTemp.HeadlossCalculate != null)
                array.push(Number(objTemp.HeadlossCalculate));
            return array;
        }
        /**
         * 将节点结果接口返回数据拆分
         * @param {*} objTemp 结果
         */
        function GetJunctionResult(objTemp) {
            objTemp = objTemp[0];
            var array = new Array();
            if (objTemp.Head == null)
                objTemp.Head = 0;
            if (objTemp.Pressure == null)
                objTemp.Pressure = 0;
            if (objTemp.Demand == null)
                objTemp.Demand = 0;
            var array = new Array();
            array.push(objTemp.Head);
            array.push(objTemp.Pressure);
            array.push(objTemp.Demand);
            array.push(objTemp.PressureChange);

            if (objTemp.HeadCalculate != null)
                array.push(Number(objTemp.HeadCalculate));
            if (objTemp.PressureCalculate != null)
                array.push(Number(objTemp.PressureCalculate));
            if (objTemp.DemandCalculate != null)
                array.push(Number(objTemp.DemandCalculate));
            return array;
        }
        /**
         *  将阀门结果接口返回数据拆分
         * @param {*} objTemp 结果
         */
        function GetTcvResult(objTemp) {
            objTemp = objTemp[0];
            var array = new Array();
            if (objTemp.Head == null)
                objTemp.Head = 0;
            if (objTemp.Pressure == null)
                objTemp.Pressure = 0;
            array.push(objTemp.Head);
            array.push(objTemp.Pressure);
          /*   array.push(objTemp.HeadT);
            array.push(objTemp.PressureT); */
            if (objTemp.HeadCalculate != null)
            array.push(Number(objTemp.HeadCalculate));
            if (objTemp.PressureCalculate != null)
            array.push(Number(objTemp.PressureCalculate));
            return array;
        }

         /**
         *  将阀门结果接口返回数据拆分
         * @param {*} objTemp 结果
         */
        function GetPrvResult(objTemp) {
            objTemp = objTemp[0];
            var array = new Array();
            array.push(objTemp.Head);
            array.push(objTemp.Pressure);
           /*  if (objTemp.HeadCalculate != null)
            array.push(Number(objTemp.HeadCalculate));
            if (objTemp.PressureCalculate != null)
            array.push(Number(objTemp.PressureCalculate)); */
            return array;
        }

        function GetFcvResult(objTemp) {
            objTemp = objTemp[0];
            var array = new Array();
            array.push(objTemp.Head);
            array.push(objTemp.Pressure);
           /*  if (objTemp.HeadCalculate != null)
            array.push(Number(objTemp.HeadCalculate));
            if (objTemp.PressureCalculate != null)
            array.push(Number(objTemp.PressureCalculate)); */
            return array;
        }

         /**
         *  将阀门结果接口返回数据拆分
         * @param {*} objTemp 结果
         */
        function GetPumpResult(objTemp) {
            objTemp = objTemp[0];
            var array = new Array();
            array.push(objTemp.Head);
            array.push(objTemp.Pressure);
            array.push(objTemp.HeadT);
            array.push(objTemp.PressureT);
            array.push(objTemp.Flow);
            array.push(objTemp.Energy);
            array.push(objTemp.Efficiency);
           /*  if (objTemp.HeadCalculate != null)
            array.push(Number(objTemp.HeadCalculate));
            if (objTemp.PressureCalculate != null)
            array.push(Number(objTemp.PressureCalculate)); */
            return array;
        }
        
        /**
        *  将阀门结果接口返回数据拆分
        * @param {*} objTemp 结果
        */
       function GetReservoirResult(objTemp) {
           objTemp = objTemp[0];
           var array = new Array();
           array.push(objTemp.Head);
           array.push(objTemp.Demand);
           if(reservoirIndex==0){
               array.push(objTemp.Demand);
               if(tableNameMain!=""){
                   array.push(objTemp.DemandCalculate);
               }
           }else{
               array.push(objTemp.Head);
               if(tableNameMain!=""){
                   array.push(objTemp.HeadCalculate);
               }
           }
           
           return array;
       }

        /**
         * infoWindow窗口隐藏响应事件
         * @param {*} event 事件的对象
         */
        function MyHideInfoWindow(event) {
            mapClickgl.removeAll();
            mapInfoWindowPoup = false;
        }
        var mySelectLayerId = '';

        function TimeChangeUpdateInfoWindows(feature){
            if(mapInfoWindowPoup)
            MyJudgeLayerId(feature);
        }

        function InfoWindowsShowJunction(featureTemp) {
            var point = new esriApi.Point(featureTemp.geometry.x, featureTemp.geometry.y, view.spatialReference);
            var title = "节点属性";
            var resultTemp;
            var getUrl = "";
            if (tableNameMain == "")
                getUrl = urlClass.axiosUrl + 'NodeSelect/' + featureTemp.attributes.ElementId + '/' + global.time + '/' + "Result_Junction" + '/' + "NAN" + '/' + "NAN" + '/' + "NAN";
            else
                getUrl = urlClass.axiosUrl + 'NodeSelect/' + featureTemp.attributes.ElementId + '/' + global.time + '/' + (tableNameMain + "junction") + '/' + "NAN" + '/' + "NAN" + '/' + "NAN";
            axios.get(getUrl)
                .then(function (response) {
                    var objTemp = response.data;
                    resultTemp = GetJunctionResult(objTemp);
                    var Content = GetAttribute(attributeData.junctionAttribute, featureTemp, resultTemp, "junction");
                    map.add(mapClickgl);
                    view.popup.open({
                        title: title,
                        content: Content,
                        location: point
                    });
                    // map.infoWindow.setTitle(title);
                    // map.infoWindow.setContent(Content);
                    // map.infoWindow.show(point)
                })
        }

        function SetInfoWindowPosition(point){
            var extentTemp = view.extent;
            if(Number(point.x)>=Number(extentTemp.xmin)&&
            Number(point.x)<=Number(extentTemp.xmax)&&
            Number(point.y)>=Number(extentTemp.ymin)&&
            Number(point.y)<=Number(extentTemp.ymax)){
                
            }else{
                var pointTemp = point;
                if(Number(point.y)>Number(extentTemp.ymax))
                pointTemp = new esriApi.Point(point.x,point.y+100,new esriApi.SpatialReference({ wkid: global.spatialReference }));
                else if(Number(point.y)<Number(extentTemp.ymin))
                pointTemp = new esriApi.Point(point.x,point.y-100,new esriApi.SpatialReference({ wkid: global.spatialReference }));
                // map.centerAt(point);
                view.center = point;
            }
        }

        /*
         *修改组件列表 
         */
        var elementChangeList = [];
        function InfoWindowsShowPipe(featureTemp) {
            console.log('InfoWindowsShowPipe',global.time)
            var path = (featureTemp.geometry).paths[0];
            var x = (path[0][0] + path[1][0]) / 2;
            var y = (path[0][1] + path[1][1]) / 2;
            var point = new esriApi.Point(x, y, view.spatialReference);
            var title = "管道属性";
            var resultTemp;
            var getUrl = "";
            if (global.DelPipes.indexOf(Number(featureTemp.attributes.ElementId)) == -1) {
                if (tableNameMain == "")
                    getUrl = urlClass.axiosUrl + 'Pipeline/' + featureTemp.attributes.ElementId + '/' + global.time + '/' + "Result_Pipe" + '/' + "NAN" + '/' + "NAN" + '/' + "NAN";
                else
                    getUrl = urlClass.axiosUrl + 'Pipeline/' + featureTemp.attributes.ElementId + '/' + global.time + '/' + (tableNameMain + "pipe") + '/' + "NAN" + '/' + "NAN" + '/' + "NAN";
                axios.get(getUrl)
                    .then(function (response) {
                        var objTemp = response.data;
                        resultTemp = GetPipeResult(objTemp);
                        var Content = GetAttribute(attributeData.pipeAttribute, featureTemp, resultTemp, "pipe");
                        map.add(mapClickgl);
                        view.popup.open({
                            title: title,
                            content: Content,
                            location: point
                        });
                        // map.infoWindow.setTitle(title);
                        // map.infoWindow.setContent(Content);
                        // map.infoWindow.show(point);
                        SetInfoWindowPosition(point);
                        var flowTemp = 0;
                        if (tableNameMain == "")
                        {
                            flowTemp = resultTemp[0];
                        }
                        else{
                            flowTemp = resultTemp[4];
                        }
                        FlowDirection.DrawOnlyPipeFlowDirection(featureTemp,mapClickgl,view,flowTemp);
                    })
            }
        }

        function InfoWindowsShowTcv(featureTemp) {
            var point = new esriApi.Point(featureTemp.geometry.x, featureTemp.geometry.y, view.spatialReference);
            var title = "阀门属性";
            var resultTemp;
            var getUrl = '';
            if (tableNameMain == ""){
                getUrl = urlClass.axiosUrl + 'TcvSelect/' + featureTemp.attributes.ElementId + '/' + global.time+'/NAN';
            }
            else{
                getUrl = urlClass.axiosUrl + 'TcvSelect/' + featureTemp.attributes.ElementId + '/' + global.time+'/'+(tableNameMain+ "junction");
            }
            axios.get(getUrl)
                .then(function (response) {
                    var objTemp = response.data;
                    resultTemp = GetTcvResult(objTemp);
                    var Content = GetAttribute(attributeData.tcvAttribute, featureTemp, resultTemp, "tcv");
                    map.add(mapClickgl);
                    // map.infoWindow.setTitle(title);
                    // map.infoWindow.setContent(Content);
                    // map.infoWindow.show(point)
                    view.popup.open({
                        title: title,
                        content: Content,
                        location: point
                    });
                })
        }

        function InfoWindowsShowPrv(featureTemp) {
            var point = new esriApi.Point(featureTemp.geometry.x, featureTemp.geometry.y, view.spatialReference);
            var title = "减压阀属性";
            var resultTemp;
            var getUrl = '';
            if (tableNameMain == ""){
                getUrl = urlClass.axiosUrl + 'PrvSelect/' + featureTemp.attributes.ElementId + '/' + global.time+'/NAN';
            }
            else{
                getUrl = urlClass.axiosUrl + 'PrvSelect/' + featureTemp.attributes.ElementId + '/' + global.time+'/'+(tableNameMain+ "junction");
            }
            axios.get(getUrl)
                .then(function (response) {
                    var objTemp = response.data;
                    resultTemp = GetPrvResult(objTemp);
                    var Content = GetAttribute(attributeData.prvAttribute, featureTemp, resultTemp, "prv");
                    map.add(mapClickgl);
                    // map.infoWindow.setTitle(title);
                    // map.infoWindow.setContent(Content);
                    // map.infoWindow.show(point)
                    view.popup.open({
                        title: title,
                        content: Content,
                        location: point
                    });
                })
        }

        function InfoWindowsShowFcv(featureTemp) {
            var point = new esriApi.Point(featureTemp.geometry.x, featureTemp.geometry.y, view.spatialReference);
            var title = "流量阀属性";
            var resultTemp;
            var getUrl = '';
            if (tableNameMain == ""){
                getUrl = urlClass.axiosUrl + 'FcvSelect/' + featureTemp.attributes.ElementId + '/' + global.time+'/NAN';
            }
            else{
                getUrl = urlClass.axiosUrl + 'FcvSelect/' + featureTemp.attributes.ElementId + '/' + global.time+'/'+(tableNameMain+ "junction");
            }
            axios.get(getUrl)
                .then(function (response) {
                    var objTemp = response.data;
                    resultTemp = GetFcvResult(objTemp);
                    var Content = GetAttribute(attributeData.fcvAttribute, featureTemp, resultTemp, "fcv");
                    map.add(mapClickgl);
                    view.popup.open({
                        title: title,
                        content: Content,
                        location: point
                    });
                })
        }

        function InfoWindowsShowPump(featureTemp) {
            var point = new esriApi.Point(featureTemp.geometry.x, featureTemp.geometry.y, view.spatialReference);
            var title = "水泵属性";
            var resultTemp;
            var getUrl = '';
            //if (tableNameMain == ""){
                getUrl = urlClass.axiosUrl + 'PumpSelect/' + featureTemp.attributes.ElementId + '/' + global.time+'/NAN';
            /* }
            else{
                getUrl = urlClass.axiosUrl + 'PumpSelect/' + featureTemp.attributes.ElementId + '/' + global.time+'/'+(tableNameMain+ "junction");
            } */
            axios.get(getUrl)
                .then(function (response) {
                    var objTemp = response.data;
                    resultTemp = GetPumpResult(objTemp);
                    var Content = GetAttribute(attributeData.pumpAttribute, featureTemp, resultTemp, "pump");
                    map.add(mapClickgl);
                    // map.infoWindow.setTitle(title);
                    // map.infoWindow.setContent(Content);
                    // map.infoWindow.show(point)
                    view.popup.open({
                        title: title,
                        content: Content,
                        location: point
                    });
                })
        }

        function InfoWindowsShowReservoir(featureTemp) {
            var point = new esriApi.Point(featureTemp.geometry.x, featureTemp.geometry.y, view.spatialReference);
            var title = "水池属性";
            var resultTemp;
            var getUrl = '';
            if (tableNameMain == "")
                getUrl = urlClass.axiosUrl + 'ReservoirSelect/' + featureTemp.attributes.ElementId + '/' + global.time + '/' + "RESULT_RESERVOIR" + '/' + "NAN" + '/' + "NAN" + '/' + "NAN";
            else
                getUrl = urlClass.axiosUrl + 'ReservoirSelect/' + featureTemp.attributes.ElementId + '/' + global.time + '/' + (tableNameMain + "junction") + '/' + "NAN" + '/' + "NAN" + '/' + "NAN";
            axios.get(getUrl)
                .then(function (response) {
                    var objTemp = response.data;
                    resultTemp = GetReservoirResult(objTemp);
                    var Content = GetAttribute(attributeData.reservoirAttribute, featureTemp, resultTemp, "reservoir");
                    map.add(mapClickgl);
                    // map.infoWindow.setTitle(title);
                    // map.infoWindow.setContent(Content);
                    // map.infoWindow.show(point)
                    view.popup.open({
                        title: title,
                        content: Content,
                        location: point
                    });
                })
        }

        function InfoWindowsShowHydrant(featureTemp) {
            var point = new esriApi.Point(featureTemp.geometry.x, featureTemp.geometry.y, view.spatialReference);
            var title = "消火栓属性";
            var resultTemp;
            var Content = GetAttribute(attributeData.hydrantAttribute, featureTemp, resultTemp, "junction");
            // map.infoWindow.setTitle(title);
            // map.infoWindow.setContent(Content);
            // map.infoWindow.show(point);
            view.popup.open({
                title: title,
                content: Content,
                location: point
            });
        }

        function InfoWindowsShowMain(featureTemp,title,type,AttributeList) {
            var point = new esriApi.Point(featureTemp.geometry.x, featureTemp.geometry.y, view.spatialReference);
            var resultTemp;
            var Content = GetAttribute(AttributeList, featureTemp, resultTemp, type);
            // map.infoWindow.setTitle(title);
            // map.infoWindow.setContent(Content);
            // map.infoWindow.show(point);
            view.popup.open({
                title: title,
                content: Content,
                location: point
            });
        }
        var mapInfoWindowPoup = false;
        var infoWindowData = '';
        /**
         * 根据查询结果中的layerId调用不同的后台接口
         * @param {*} feature 查询返回对象
         */
        function MyJudgeLayerId(feature) {
            infoWindowData = feature;
            mapClickgl.removeAll();
            var layerId = String(feature.layerId);
            var featureTemp = feature.feature;
            if (global.DelPipes.indexOf(Number(featureTemp.attributes.ElementId)) == -1) {
                mySelectLayerId = layerId;
                var title = "";
                var point = new esriApi.Point();
                var Content = "";

                if (layerId == global.layerId.EN_PIPE_1 || layerId == global.layerId.EN_PIPE_2 || layerId == global.layerId.EN_PIPE) {
                    if (global.DelPipes.indexOf(Number(featureTemp.attributes.ElementId)) == -1) {
                        var path = (featureTemp.geometry).paths[0];
                        var x = (path[0][0] + path[1][0]) / 2;
                        var y = (path[0][1] + path[1][1]) / 2;
                        point = new esriApi.Point(x, y, view.spatialReference);

                        var markerSymbol = new esriApi.SimpleLineSymbol({style: "solid", color: new esriApi.Color("#ff0000"), width: 4});
                        var gra1 = new esriApi.Graphic(featureTemp.geometry, markerSymbol);
                        mapClickgl.add(gra1);
                    }
                }
                else {
                    point = new esriApi.Point(featureTemp.geometry.x, featureTemp.geometry.y, view.spatialReference);
                    var markerSymbol = new esriApi.SimpleMarkerSymbol({size: 10, color: new esriApi.Color("#ff0000"), outline: null});
                    var gra1 = new esriApi.Graphic(featureTemp.geometry, markerSymbol);
                    mapClickgl.add(gra1);
                }


                switch (layerId) {
                    //管道
                    case global.layerId.EN_PIPE_1:
                    case global.layerId.EN_PIPE_2:
                    case global.layerId.EN_PIPE:
                        mapInfoWindowPoup = true;
                        InfoWindowsShowPipe(featureTemp);
                        break;
                    //节点
                    case global.layerId.EN_JUNCTION:
                        mapInfoWindowPoup = true;
                        InfoWindowsShowJunction(featureTemp);
                        break;
                    //阀门
                    case global.layerId.EN_VALVE:
                        mapInfoWindowPoup = true;
                        InfoWindowsShowTcv(featureTemp);
                        break;
                    //减压阀
                    case global.layerId.EN_PRVALVE:
                        title = "减压阀属性";
                        mapInfoWindowPoup = true;
                        InfoWindowsShowPrv(featureTemp);
                        break;
                    //水泵
                    case global.layerId.EN_PUMP:
                        title = "水泵属性";
                        mapInfoWindowPoup = true;
                        InfoWindowsShowPump(featureTemp);
                        break;
                    //流量阀
                    case global.layerId.EN_FCVALVE:
                        title = "流量阀属性";
                        mapInfoWindowPoup = true;
                        InfoWindowsShowFcv(featureTemp);
                        break;
                    //消火栓
                    case global.layerId.EN_HYDRANT:
                        title = "消火栓属性";
                        mapInfoWindowPoup = true;
                        InfoWindowsShowMain(featureTemp,title,'junction',attributeData.hydrantAttribute);
                        break;
                    //止回阀
                    case global.layerId.EN_CVALVE:
                        title = "止回阀属性";
                        mapInfoWindowPoup = true;
                        InfoWindowsShowMain(featureTemp,title,'junction',attributeData.checkValveAttribute);
                        break;
                    //水池
                    case global.layerId.EN_TANK:
                        title = "水池属性";
                        mapInfoWindowPoup = true;
                        InfoWindowsShowReservoir(featureTemp);
                        break;
                }
                
                if (global.DelPipes.indexOf(Number(featureTemp.attributes.ElementId)) == -1) {
                    popup();
                }
            }
        }

        /**
         * identify查询成功返回函数
         * @param {*} event 返回结果的对象
         */
        function myResultFunction(event) {
            var feature;
            //map.infoWindow.hide();
            if (event.results.length > 0) {
                {
                    feature = event.results[0];
                    MyJudgeLayerId(feature);
                }
            }

        }
        /**
         * identify查询失败返回函数
         * @param {*} error 错误信息
         * @param {*} clickGraphic
         */
        function myFaultFunction(error, clickGraphic = null) {
            alert(error)
        }
        view.on('drag',function(e){
            if(selectTypeMain=="Direction")
            {
                WindowsEvent.MyDispatchEvent('ClearDirection','');
            }
            if (e.action == "end") {
                mapExtentChange(e);//地图监听范围改变事件
            }
        })
        view.on('mouse-wheel',function(e){
            if(selectTypeMain=="Direction")
            {
                WindowsEvent.MyDispatchEvent('ClearDirection','');
            }
            mapExtentChange(e);//地图监听范围改变事件
        }) 
        var isDraw = false;
        var isActive = true;
        var mapExtent = '';
        /**
         * 地图监听范围改变事件
         */
        view.on("resize", mapExtentChange);
        view.on("double-click", mapExtentChange);
        function mapExtentChange(e) {
            if(mapExtent==''||(Number(view.extent.xmin)!=Number(mapExtent.xmin)||Number(view.extent.xmax)!=Number(mapExtent.xmax)||Number(view.extent.ymin)!=Number(mapExtent.ymin)||Number(view.extent.ymax)!=Number(mapExtent.ymax))){
                mapExtent = mainClass.ObjectDepthCopy(view.extent);
                if(selectTypeMain=="Direction")
                {
                    WindowsEvent.MyDispatchEvent('ClearDirection','');
                }
            }
            if (myEventType == "updateTime" || myEventType == "changeLayerMy" || selectTypeMain == "SupplyAreaCompare"|| selectTypeMain == "SupplyAreaCompareNew" ) {// 
                var whereTemp = drawClass.GetWhere(layerType, view);
                //if(whereTemp!=drawLayerWhere||(whereTemp.indexOf(String(myDiameter[0]))!=-1)||whereTemp=="1=1")
                //if(view.extent!=initExtent)
                {
                    if (selectTypeMain == "Direction"&&(!isCompare)) {
                        if(isActive){
                            dynamicMapServiceTintLayer.visible = false;
                        }
                        else{
                            dynamicMapServiceTintLayer.visible = true;
                        }
                        SelectChange(selectTypeMain, global.time, view.extent, true);
                    }else{
                        if (isCompare && selectTypeMain != "SupplyAreaCompare"&& selectTypeMain != "SupplyAreaCompareNew") {
                            return;
                        }
                        if (selectTypeMain != "SupplyAreaCompare"&&selectTypeMain != "PressureChange"&& selectTypeMain != "SupplyAreaCompareNew") {
                            if (view.scale <= myScale[1]) {
                                //gl.removeAll();
                                //compareResultLayer.removeAll();
                                // SelectChange(selectTypeMain, global.time, view.extent, true);
                                isDraw = true;
                            }
                            else {
                                if (isDraw) {
                                    //gl.removeAll();
                                    //compareResultLayer.removeAll();
                                    // SelectChange(selectTypeMain, global.time, initExtent, true);
                                    isDraw = false;
                                }
                            }
                        }
                        else if(selectTypeMain != "PressureChange"){
                            if (view.scale <= myScale[1]) {
                                //gl.removeAll();
                                // SelectChange(selectTypeMain, global.time, view.extent, true);
                                isDraw = true;
                            }
                            else {
                                if (isDraw) {
                                    //gl.removeAll();
                                    // SelectChange(selectTypeMain, global.time, initExtent, true);
                                    isDraw = false;
                                }
                            }
                            //DrawSupplyAreaCompare(supplyAreaCompareData,pipeSupplyAreaLimit,pipeSupplyAreaColor,pipeSupplyAreaWidth,isDisplays);
                            // drawClass.DrawSupplyAreaCompare(supplyAreaCompareData, pipeSupplyAreaLimit, pipeSupplyAreaColor, pipeSupplyAreaWidth, isDisplays, gl);
                        }
                        else{
                            // where = drawClass.GetWhere('junction', view);
                            // drawJunctionPressureChange("PressureChange",where,urlClass.junctionResultUrl,view.extent);
                        }
                    }
                }
                //LegendDisplayMain(selectTypeMain,global.time);
            }
            if(myEventType=="DrawTool"){
                drawTool.DrawInit(query, view, drawToolGraphicsLayer);
            }
        }

        var axiosUrl = urlClass.axiosUrl;
        LoadLegendData.GetLegendData();//加载配置文件
        ///////////////////压力/////////////////////////////////////////
        var pressureLimit = global.pressureLimit;
        var pressureColor = global.pressureColor;
        var pressureWidth = global.pressureWidth;
        var pressureIsDisplay = global.pressureIsDisplay;
        ///////////////////管道流量/////////////////////////////////////////
        var pipeFlowLimit = global.pipeFlowLimit;
        var pipeFlowColor = global.pipeFlowColor;
        var pipeFlowWidth = global.pipeFlowWidth;
        var pipeFlowIsDisplay = global.pipeFlowIsDisplay;
        ///////////////////管道流速/////////////////////////////////////////
        var pipeVelocityLimit = global.pipeVelocityLimit;
        var pipeVelocityColor = global.pipeVelocityColor;
        var pipeVelocityWidth = global.pipeVelocityWidth;
        var pipeVelocityIsDisplay = global.pipeVelocityIsDisplay;
        ///////////////////水压标高/////////////////////////////////////////
        var headLimit = global.headLimit;
        var headColor = global.headColor;
        var headWidth = global.headWidth;
        var headIsDisplay = global.headIsDisplay;
        ///////////////////水力坡度/////////////////////////////////////////
        var pipeSlopLimit = global.pipeSlopLimit;
        var pipeSlopColor = global.pipeSlopColor;
        var pipeSlopWidth = global.pipeSlopWidth;
        var pipeSlopIsDisplay = global.pipeSlopIsDisplay;
        ///////////////////节点流量/////////////////////////////////////////
        var demandLimit = global.demandLimit;
        var demandColor = global.demandColor;
        var demandWidth = global.demandWidth;
        var demandIsDisplay = global.demandIsDisplay;
        ///////////////////供水分界线/////////////////////////////////////////
        var pipeSupplyAreaLimit = global.pipeSupplyAreaLimit;
        var pipeSupplyAreaColor = global.pipeSupplyAreaColor;
        var pipeSupplyAreaWidth = global.pipeSupplyAreaWidth;
        var pipeSupplyCompareAreaWidth = global.pipeSupplyCompareAreaWidth;
        var pipeSupplyAreaIsDisplay = global.pipeSupplyAreaIsDisplay;
        var pipeSupplyAreaLabels = global.pipeSupplyAreaLabels;
        ///////////////////管龄/////////////////////////////////////////
        var pipeAgeLimit = global.pipeAgeLimit;
        var pipeAgeColor = global.pipeAgeColor;
        var pipeAgeWidth = global.pipeAgeWidth;
        var pipeAgeIsDisplay = global.pipeAgeIsDisplay;
        ///////////////////管径分类/////////////////////////////////////////
        var pipeDiameterLimit = global.pipeDiameterLimit;
        var pipeDiameterColor = global.pipeDiameterColor;
        var pipeDiameterWidth = global.pipeDiameterWidth;
        var pipeDiameterIsDisplay = global.pipeDiameterIsDisplay;
        ///////////////////管材分类/////////////////////////////////////////
        var pipeMaterialLimit = global.pipeMaterialLimit;
        var pipeMaterialColor = global.pipeMaterialColor;
        var pipeMaterialWidth = global.pipeMaterialWidth;
        var pipeMaterialIsDisplay = global.pipeMaterialIsDisplay;
        ///////////////////水龄/////////////////////////////////////////
        var ageLimit = global.ageLimit;
        var ageColor = global.ageColor;
        var ageWidth = global.ageWidth;
        var ageIsDisplay = global.ageIsDisplay;
        ////////////////////压力波动////////////////////////////////////////////
        var pressureChangColor = global.pressureChangColor
        var pressureChangLimit = global.pressureChangLimit
        var pressureChangeIsDisplay = global.pressureChangeIsDisplay;
        ///////////////////流向变化次数/////////////////////////////////////////
        var directionChangeLimit = global.directionChangeLimit;
        var directionChangeColor = global.directionChangeColor;
        var directionChangeWidth = global.directionChangeWidth;
        var directionChangeIsDisplay = global.directionChangeIsDisplay;
        ///////////////////停水管道/////////////////////////////////////////
        var pipeStopWaterLimit = [1];
        var pipeStopWaterColor = ["#FF0000"];
        var pipeStopWaterWidth = [3];
        var pipeStopWaterIsDisplay = [true];
        ////////////////////模拟计算////////////////////////////////////////
        var planCalPipeFlowIsDisplay = [true, true, true, true, true];
        var planCalPipeVelocityIsDisplay = [true, true, true, true, true];
        /**
         * 地图比例尺分类
         */
        var myScale = global.myScale;
        /**
         * 管道管径的分类
         */
        var myDiameter = global.myDiameter;
        var where = 'Physical_PipeDiameter >= 300';//查询条件
        var query = new esriApi.Query();
        query.where = where;
        query.returnGeometry = true;
        query.outFields = ["ElementId", field];
        // query.outSpatialReference = map.SpatialReference;
        query.outSpatialReference = view.spatialReference;
        var typeMyMain = '';
        //var global.time = '';
        var timeMyMain1 = '0';
        var timeMyMain2 = '0';
        var selectTypeMain = '';
        var myEventType = "";
        var layerType = '';
        var isCompare = false;
        var EventTypeMain = "";
        var tableNameMain = "";
        var planResultLimitMain = new Object();

        function DropPlanTable(tableNameTemp) {
            if (tableNameTemp != "") {
                axios.get(urlClass.axiosUrl + "DropPlanTable" + "/" + tableNameTemp)
                    .then(function (response) {
                    })
            }
        }

        /**
         * 返回当前需要画图时的地图的范围
         */
        function GetDrawMapExtent() {
            var mapExtentTemp;
            if (view.scale <= myScale[1]) {
                mapExtentTemp = view.extent;
            }
            else {
                mapExtentTemp = initExtent;
            }
            return mapExtentTemp;
        }
        var planTempResultData = '';
        var planCalResultMain = new Object();
        var IsRevise = false;
        var timeDisplay = "";
        var branchPipes = [];
        var branchPipesShow = true;
        window.addEventListener('event_name', myEventListener);
        function myEventListener(event) {
            //LocationGraphicsLayer.removeAll();
            if (String(timeDisplay) == '')
            {
                timeDisplay = new Date().getHours()-1==-1?23:new Date().getHours()-1;
            } 
            var typeMy = event.detail.type;
            var typeSelectMain = event.detail.eventType;
            isAllDisplay = false;
            eventType = '';
            //maxMain = "";
            //minMain = "";
            if (typeSelectMain == "updateTime" || typeSelectMain == "changeLayerMy") {
                valveChangeLayer.removeAll();
                console.log("updateTime")
                drawBigFlow = true;
                drawSmallFlow = true;
                drawBig = true;
                drawSmall = true;
                drawBigVelocity = true;
                drawSmallVelocity = true;
                
                LocationGraphicsLayer.removeAll();
                WindowsEvent.MyDispatchEvent('MyClose', '');
                itemType = "";
                planResultLimitMain = new Object();
                tableNameMain = "";
                EventTypeMain = "";
                isCompare = false;
                isDisplays = new Array();
                myEventType = typeSelectMain;
                selectTypeMain = typeMyMain = typeMy;
                startDate = event.detail.startDate;
                endDate = event.detail.endDate;
                //隐藏管线图
                if (selectTypeMain == "baseMap") {
                    dynamicMapServiceLayer.visible = true;
                }
                else {
                    dynamicMapServiceLayer.visible = false;
                }

                if (selectTypeMain != "Direction") {
                    WindowsEvent.MyDispatchEvent("BaseMap", '')
                }

                if (selectTypeMain == "HydraulicGrade" || selectTypeMain == "Pressure" || selectTypeMain == "Demand"
                    || selectTypeMain == "PressureChange" || selectTypeMain == "ValveUpdate" || selectTypeMain == "PipeStatus"
                ) {
                    dynamicMapServiceTintLayer.visible = true;//|| selectTypeMain == "Direction"
                }
                else {
                    dynamicMapServiceTintLayer.visible = false;
                }
                var timeMy = event.detail.timeValue;
                //global.time = timeMy;
                timeDisplay = timeMy;
                gl.removeAll();
                glSupplyAreaO.removeAll();
                compareResultLayer.removeAll();
                maxMain = "";
                minMain = "";
                if (typeSelectMain == "updateTime") {
                    TimeChangeUpdateInfoWindows(infoWindowData);//20190315
                    var selectType = event.detail.typeSelect;
                    selectTypeMain = selectType;
                    if (selectTypeMain != "PressureChange" && selectTypeMain != "FlowChangeCount" && selectTypeMain != "Diameter" && selectTypeMain != "Material" && selectTypeMain != "PipeAge") {
                        /* var mapExtentTemp;
                        if(view.scale<=myScale[1])
                            mapExtentTemp = view.extent;
                        else
                            mapExtentTemp = initExtent; */
                        var extentTemp = drawClass.GetDrawMapExtent(view);
                        maxMain = "";
                        minMain = "";
                        SelectChange(selectType, timeMy, extentTemp);
                        if (selectTypeMain != "Direction")
                            LegendDisplayMain(selectType, timeMy);
                        else
                            LegendDisplayMain("baseMap", timeMy);
                    }
                }
                else {
                    isActive = true;
                    SelectChange(typeMy, timeMy, initExtent);
                    if (selectTypeMain == "Direction")
                        LegendDisplayMain("baseMap", timeMy)
                    else if(selectTypeMain != "PressureChange")
                        LegendDisplayMain(typeMy, timeMy)
                }
            }else if(typeMy=="LegendUpdate"){
                global.pipeFlowLimit = event.detail.data;
                pipeFlowLimit = global.pipeFlowLimit;
                console.log('pipeFlowLimit',pipeFlowLimit);
                var extentTemp = drawClass.GetDrawMapExtent(view);
                SelectChange(selectTypeMain, global.time, extentTemp);
                LegendDisplayMain(selectTypeMain, global.time)
            }
            else if(typeMy=="SelectElementListChange"){
                var listTemp = event.detail.data;
                drawClass.DrawCalPosition(elementChangeLayer,listTemp);
            }
            else if(typeMy=="DrawStopWaterPipe"){
                var obj = event.detail.data;
                isStopWaterCalPipe.removeAll();
                if(obj.isDraw){
                    drawClassPipeBurst.DrawClosePipe(obj.data,isStopWaterCalPipe);
                    drawClassPipeBurst.DrawPolygon(obj.data.ListX,obj.data.ListY,isStopWaterCalPipe);
                }
            }else if(typeMy=="BranchClick"){
                var obj = event.detail.data;
                branchPipesShow = obj;
                SelectChange(selectTypeMain, timeDisplay, view.extent);
                // if(obj)
                // {
                //     SelectChange(selectTypeMain, global.time, view.extent);
                // }
                // else{
                //     if(branchPipes.length==0){
                //         GetBranchPipes();
                //     }else{
                //         SelectChange(selectTypeMain, global.time, view.extent);
                //     }
                    
                // }
            }else if(typeMy=="PipeDiameterWhereQuery"){
                SelectChange(selectTypeMain, timeDisplay, initExtent, false, event.detail.data);
            }
            else if(typeMy=="InitTime")
            {
                 if(String(event.detail.data)=="0"){
                    timeDisplay = new Date().getHours();
                }else if(String(event.detail.data)=="1"){
                    timeDisplay = new Date().getHours()-1==-1?23:new Date().getHours()-1;
                } 
            }
            else if(typeMy == "ClearElementChangeList"){
                drawTool.CloseDrawToolMain(view);
                drawToolGraphicsLayer.removeAll();
                elementChangeLayer.removeAll();
                AddElementData = [];
                allElementChangeData = new Array();
            }
            else if(typeMy=="OpenPlanTempWindow"){
                WindowsEvent.MyDispatchEvent('closeSlider', null);
                IsRevise = event.detail.data;
                TimeChangeUpdateInfoWindows(infoWindowData);
            }  else if(typeMy=="DrawStopWaterPipe"){
                var obj = event.detail.data;
                isStopWaterCalPipe.removeAll();
                if(obj.isDraw){
                    drawClassPipeBurst.DrawClosePipe(obj.data,isStopWaterCalPipe);
                    drawClassPipeBurst.DrawPolygon(obj.data.ListX,obj.data.ListY,isStopWaterCalPipe);
                }
            }else if(typeMy=="DrawStopWaterHydrant"){
                isStopWaterHydrant.removeAll()
                var dataTemp = event.detail.data;
                var pointPicture = PictureProperty.eventRed;
                console.log('DrawStopWaterHydrant',dataTemp)
                for(var i=0;i<dataTemp.length;i++){
                    var obj = dataTemp[i];
                    var point = esriApi.Point(obj.X,obj.Y,new esriApi.SpatialReference({ wkid: global.spatialReference }));
                    pointPicture.width = 19;
                    pointPicture.height = 19;
                    var graphic = drawClass.CreatePictureGraphic(pointPicture,point);
                    isStopWaterHydrant.add(graphic);
                }
            }
            else if(typeMy=="MyTableHydrantClose"||typeMy=="StopWaterCustomer"){
                isStopWaterHydrant.removeAll();
            }
            else if(typeMy=="StopWaterHydrant"){
                if(!event.detail.data)
                isStopWaterHydrant.removeAll();
            }
            else if (typeMy == "PlanTempCalculate") {
                drawBigFlow = true;
                drawSmallFlow = true;
                drawBig = true;
                drawSmall = true;
                drawBigVelocity = true;
                drawSmallVelocity = true;

                myEventType = typeMy;
                isDisplays = new Array();
                EventTypeMain = typeMy;
                compareResultLayer.removeAll();
                planCalResultDirectionChangeLayer.removeAll();
                planCalResultFlowLayer.removeAll();
                planCalResultVelocityLayer.removeAll();
                var planResultLimit = event.detail.data;
                planCalResultMain = Object.assign({}, planResultLimit);
                tableNameMain = planResultLimit.TableName;
                planResultLimitMain = Object.assign({}, planResultLimit);//对象的深度拷贝

                var pressureLimitTemp = GetLimit(planResultLimit.MinPressure, planResultLimit.MaxPressure, planResultLimit.levelMy);
                pressureChangLimit = pressureLimitTemp.slice(0);
                var planTempCalFlowTemp = GetLimit(planResultLimit.MinFlow, planResultLimit.MaxFlow, planResultLimit.levelMy);
                planTempCalFlowLimit = planTempCalFlowTemp.slice(0);
                var planTempCalVelocityTemp = GetLimit(planResultLimit.MinStrength, planResultLimit.MaxStrength, planResultLimit.levelMy);
                planTempCalVelocityLimit = planTempCalVelocityTemp.slice(0);
                LegendMainPlanTempCalPipe();

                var planTempCalPressure = DrawPlanTempCalNode(planResultLimit.MinPressure, planResultLimit.MaxPressure, planResultLimit.NodePressure, planResultLimit.levelMy, pressureChangColor,pressureChangLimit);
                //pressureChangLimit = planTempCalPressure.slice(0)

                planCalPipeFlowIsDisplays = planCalPipeFlowIsDisplay.slice(0);
                var planTempCalFlowLimitTemp = DrawPlanTempCalPipeFlow(planResultLimit.MinFlow, planResultLimit.MaxFlow, planResultLimit.PipeFlow, planResultLimit.levelMy, pressureChangColor, "flow",planTempCalFlowLimit);
                //planTempCalFlowLimit = planTempCalFlowLimitTemp.slice(0)

                planCalPipeVelocityIsDisplays = planCalPipeVelocityIsDisplay.slice(0);
                var planTempCalVelocityLimitTemp = DrawPlanTempCalPipeFlow(planResultLimit.MinStrength, planResultLimit.MaxStrength, planResultLimit.PipeStrength, planResultLimit.levelMy, pressureChangColor, "velocity",planTempCalVelocityLimit);
                //planTempCalVelocityLimit = planTempCalVelocityLimitTemp.slice(0)
                planCalResultVelocityLayer.visible = false;

                drawClass.DrawPlanTempCalDirectionChange(planResultLimit.PipeDirection, planCalResultDirectionChangeLayer, global.planCalTempDirectionChangeColor, global.planCalTempDirectionChangeSize, global.triangleColor, global.triangleSize);
                planCalResultDirectionChangeLayer.visible = false;
                
            }
            else if(typeMy=="PlanTempResult"){
                //planCalResultMain
                var obj = event.detail.data;
                var typeTemp = obj.type;
                var dataTemp = obj.data;
                var upDown = obj.upDown;
                if(typeTemp=="node"){
                    compareResultLayer.removeAll();
                    if(upDown=="up"){
                        drawBig = dataTemp;
                    }else{
                        drawSmall = dataTemp;
                    }
                    DrawPlanTempCalNode(planCalResultMain.MinPressure, planCalResultMain.MaxPressure, planCalResultMain.NodePressure, planCalResultMain.levelMy, pressureChangColor,pressureChangLimit);
                }
                else if(typeTemp=="pipeFlow"){
                    planCalResultFlowLayer.removeAll();
                    if(upDown=="up"){
                        drawBigFlow = dataTemp;
                    }else{
                        drawSmallFlow = dataTemp;
                    }
                    DrawPlanTempCalPipeFlow(planCalResultMain.MinFlow, planCalResultMain.MaxFlow, planCalResultMain.PipeFlow, planCalResultMain.levelMy, pressureChangColor, "flow",planTempCalFlowLimit);
                }
                else if(typeTemp=="pipeVelocity"){
                    planCalResultVelocityLayer.removeAll();
                    if(upDown=="up"){
                        drawBigVelocity = dataTemp;
                    }else{
                        drawSmallVelocity = dataTemp;
                    }
                    DrawPlanTempCalPipeFlow(planCalResultMain.MinStrength, planCalResultMain.MaxStrength, planCalResultMain.PipeStrength, planCalResultMain.levelMy, pressureChangColor, "velocity",planTempCalVelocityLimit);
                }
            }
            else if (typeMy == "PlanCalTemp") {
                tableNameMain = event.detail.data;
            }
            else if (typeMy == "ElementItemClick") {
                // map.infoWindow.hide();
                view.popup.close();
                mapInfoWindowPoup = false;
                var temp = event.detail.data.point;
                var pointTemp =''; //DrawToolInfoWindowsShow(layerId, featureTemp,isMapClick);
                var featureTemp = Object.assign({},event.detail.data);
                var layerId = featureTemp.LayerId;
                if(layerId==global.layerId.EN_ADD_PIPE||layerId==global.layerId.EN_ADD_PIPE_O
                    ||layerId==global.layerId.EN_ADD_NODE||layerId==global.layerId.EN_ADD_NODE_O
                    ||layerId==global.layerId.EN_ADD_VALVE_O)
                {
                    if(layerId==global.layerId.EN_ADD_PIPE||layerId==global.layerId.EN_ADD_PIPE_O)
                        pointTemp = new esriApi.Point((featureTemp.CoordinateX[0]+featureTemp.CoordinateX[1])/2,
                        (featureTemp.CoordinateY[0]+featureTemp.CoordinateY[1])/2, view.spatialReference);
                    else
                        pointTemp = new esriApi.Point(featureTemp.x, featureTemp.y, view.spatialReference);
                    featureTemp.attributes = Object.assign({},featureTemp);
                    DrawToolInfoWindowsShow(String(layerId), featureTemp,true);
                }
                else
                {
                    pointTemp = new esriApi.Point(temp.x, temp.y, view.spatialReference);
                    IdentifyMain(pointTemp, '');
                    // map.centerAt(pointTemp)
                    view.center = pointTemp;
                }

            }
            else if(typeMy=="PlanTempButtonCancel"){
                isStopWaterCalPipe.removeAll();
                IsRevise = false;
                TimeChangeUpdateInfoWindows(infoWindowData);
                drawBigFlow = true;
                drawSmallFlow = true;
                drawBig = true;
                drawSmall = true;
                drawBigVelocity = true;
                drawSmallVelocity = true;
            }
            else if (typeMy == "PlanTempWindowCloseBtn")//关闭方案模拟窗口
            {
                myEventType="";
                isStopWaterCalPipe.removeAll();
                IsRevise = false;
                TimeChangeUpdateInfoWindows(infoWindowData);
                drawBigFlow = true;
                drawSmallFlow = true;
                drawBig = true;
                drawSmall = true;
                drawBigVelocity = true;
                drawSmallVelocity = true;

                drawToolGraphicsLayer.removeAll();
                allElementChangeData = new Array();
                tableNameMain = "";
                itemType = "";
                maxMain = "";
                minMain = "";
                compareResultLayer.removeAll();
                elementChangeLayer.removeAll();
                gl.removeAll();
                glSupplyAreaO.removeAll();
                planCalResultVelocityLayer.removeAll();
                planCalResultFlowLayer.removeAll();
                planCalResultDirectionChangeLayer.removeAll();
                getAndPost.DropPlanTable(tableNameMain);
                BaseMapLegend();
                drawTool.CloseDrawToolMain(view);
                AddElementData = [];
            }
            else if (typeMy == "CompareWindowClose") {
                console.log('CompareWindowClose',new Date())
                if (isCompare) {
                    if (selectTypeMain == "baseMap" || selectTypeMain == "Direction")
                        dynamicMapServiceLayer.visible = true;
                    else
                        dynamicMapServiceLayer.visible = false;
                    if (selectTypeMain == "HydraulicGrade" || selectTypeMain == "Pressure" || selectTypeMain == "Demand"
                        || selectTypeMain == "PressureChange" || selectTypeMain == "ValveUpdate" || selectTypeMain == "PipeStatus"
                    ) {
                        dynamicMapServiceTintLayer.visible = true;
                    }
                    else {
                        dynamicMapServiceTintLayer.visible = false;
                    }
                    isCompare = false;
                    isDisplays = new Array();
                    maxMain = "";
                    minMain = "";
                    compareResultLayer.removeAll();
                    gl.removeAll();
                    glSupplyAreaO.removeAll();
                    var extentTemp = drawClass.GetDrawMapExtent(view)//GetDrawMapExtent();
                    if (selectTypeMain == "SupplyAreaCompare")
                        selectTypeMain = "SupplyArea";
                    else if (selectTypeMain == "SupplyAreaCompareNew")
                        selectTypeMain = "SupplyAreaNew";
                    if (selectTypeMain != "Direction")
                        LegendDisplayMain(selectTypeMain, global.time)
                    else {
                        dynamicMapServiceLayer.visible = false;
                        dynamicMapServiceTintLayer.visible = false;
                        var extentTemp = drawClass.GetDrawMapExtent(view);
                        //SelectChange(selectTypeMain, global.time, extentTemp);
                        BaseMapLegend();
                    }
                    SelectChange(selectTypeMain,global.time, extentTemp);
                }
            }
            else if(typeMy == "TimeCompareDrawDirection"){
                isCompare = true;
                dynamicMapServiceLayer.visible = false;
                dynamicMapServiceTintLayer.visible = true;
            }
            else if (typeMy == "TimeCompareDraw") {
                dynamicMapServiceLayer.visible = false;
                dynamicMapServiceTintLayer.visible = true;
                isUpAndDown = false;
                compareData = new Object();
                isCompare = true;
                maxMain = "";
                minMain = "";
                compareResultLayer.removeAll();
                var max = event.detail.max;
                var min = event.detail.min;
                var time1 = event.detail.time1;
                var time2 = event.detail.time2;
                timeMyMain1 = time1;
                timeMyMain2 = time2;
                var level = event.detail.level;
                var field = "Result_" + selectTypeMain + "_";
                compareData.time1 = time1;
                compareData.time2 = time2;
                compareData.min = min;
                compareData.max = max;
                compareData.field = field;
                compareData.level = level;
                GetTimeCompareData(time1, time2, min, max, field, level);
            }
            else if (typeMy == "TimeCompareSupplyArea") {
                isCompare = true;
                var timeTemp = event.detail.data;
                //global.time = timeTemp.time2;
                timeMyMain1 = timeTemp.time1;
                timeMyMain2 = timeTemp.time2;
                selectTypeMain = "SupplyAreaCompare"
                var extentTemp = drawClass.GetDrawMapExtent(view)//GetDrawMapExtent();
                //SelectChange(selectTypeMain, global.time, extentTemp);
                //LegendDisplayMain(selectTypeMain, global.time)
            }
            else if (typeMy == "TimeCompareSupplyAreaNew") {
                isCompare = true;
                var timeTemp = event.detail.data;
                //global.time = timeTemp.time2;
                timeMyMain1 = timeTemp.time1;
                timeMyMain2 = timeTemp.time2;
                selectTypeMain = "SupplyAreaCompareNew"
                var extentTemp = drawClass.GetDrawMapExtent(view)//GetDrawMapExtent();
                //SelectChange(selectTypeMain, global.time, extentTemp);
                //LegendDisplayMain(selectTypeMain, global.time)
            }
            else if(typeMy == "TimeCompareSupplyAreaOReturn"){
                console.log('timeMyMain2',timeMyMain2)
                SelectChange(selectTypeMain, timeMyMain2, extentTemp);
                LegendDisplayMain(selectTypeMain, timeMyMain2)
            }
            else if(typeMy=="DrawDirectionNew"){
                var data = event.detail.data;
                drawClassFlowDirection.DrawPipeFlowDirectionNew(data,view);
            }
            else if (typeMy == "TimeCompareSupplyAreaO") {
                glSupplyAreaO.removeAll();
                var dataTemp = event.detail.data;
                supplyAreaCompareData = dataTemp;
                if (isDisplays.length == 0)
                    isDisplays = pipeSupplyAreaIsDisplay.slice(0);
                //DrawSupplyAreaCompare(dataTemp,pipeSupplyAreaLimit,pipeSupplyAreaColor,pipeSupplyAreaWidth,isDisplays);
                drawClass.DrawSupplyAreaCompare(dataTemp, pipeSupplyAreaLimit, pipeSupplyAreaColor, pipeSupplyAreaWidth, isDisplays, glSupplyAreaO);
            }
            else if (typeMy == "TimeCompareSupplyAreaNewO") {
                glSupplyAreaO.removeAll();
                var dataTemp = event.detail.data;
                supplyAreaCompareData = dataTemp;
                if (isDisplays.length == 0)
                    isDisplays = pipeSupplyAreaIsDisplay.slice(0);
                drawClass.DrawSupplyAreaCompare(dataTemp, global.pipeSupplyAreaNewLimit, global.pipeSupplyAreaNewColor, global.pipeSupplyAreaNewWidth, isDisplays, glSupplyAreaO);
            }
            else if (typeMy == "legendItemDisplay") {
                var obj = event.detail.data;
                if (selectTypeMain == "Direction") {
                    isDisplays[Number(obj.index)] = Boolean(obj.isDisplay);
                    compareResultLayer.removeAll();
                    drawClass.DrawDirectionChange(directionChangeData, compareResultLayer, isDisplays, global.pressureChangLimit,
                        global.pressureChangColor, global.diffusionWidth, global.triangleColor, global.triangleSize);
                    return;
                }
                if (obj.itemType == "calNode" || obj.itemType == "") {
                    isDisplays[Number(obj.index)] = Boolean(obj.isDisplay);
                    compareResultLayer.removeAll();
                }
                //gl.removeAll();
                if ((!isCompare || selectTypeMain == "SupplyAreaCompare"|| selectTypeMain == "SupplyAreaCompareNew") && tableNameMain == "" && EventTypeMain != "Diffusion") {
                    var extentTemp = drawClass.GetDrawMapExtent(view)//GetDrawMapExtent();
                    SelectChange(selectTypeMain, global.time, extentTemp);
                }
                else if (isCompare){
                    isDisplays[Number(obj.index)] = Boolean(obj.isDisplay);
                    GetTimeCompareData(compareData.time1, compareData.time2, compareData.min, compareData.max, compareData.field, compareData.level);
                }
                else if (tableNameMain != "" && EventTypeMain != "Diffusion") {
                    if (obj.itemType == "calNode") {
                        var limitsTemp = new Array();
                        compareResultLayer.removeAll();
                        limitsTemp = DrawPlanTempCalNode(planResultLimitMain.MinPressure, planResultLimitMain.MaxPressure, planResultLimitMain.NodePressure, planResultLimitMain.levelMy, pressureChangColor,pressureChangLimit);
                        //pressureChangLimit = limitsTemp.slice(0)
                    }
                    else if (obj.itemType == "flow") {
                        planCalResultFlowLayer.removeAll();
                        planCalPipeFlowIsDisplays[Number(obj.index)] = Boolean(obj.isDisplay);
                        DrawPlanTempCalPipeFlow(planCalResultMain.MinFlow, planCalResultMain.MaxFlow, planCalResultMain.PipeFlow, planCalResultMain.levelMy, pressureChangColor, "flow",planTempCalFlowLimit);
                    }
                    else if (obj.itemType == "velocity") {
                        planCalResultVelocityLayer.removeAll();
                        planCalPipeVelocityIsDisplays[Number(obj.index)] = Boolean(obj.isDisplay);
                        DrawPlanTempCalPipeFlow(planCalResultMain.MinStrength, planCalResultMain.MaxStrength, planCalResultMain.PipeStrength, planCalResultMain.levelMy, pressureChangColor, "velocity",planTempCalVelocityLimit);
                    }
                }
               /*  else if (EventTypeMain == "Diffusion") {
                    diffusionLayer.removeAll();
                    isDisplays[Number(obj.index)] = Boolean(obj.isDisplay);
                    drawClass.DrawPipeFlowChange(diffusionDrawData.min, diffusionDrawData.max, diffusionDrawData.allData, global.diffusionLevel, global.diffusionColor, isDisplays, diffusionLayer,
                        isCompare, selectTypeMain, EventTypeMain, true, true)
                } */

            }
            else if (typeMy == "legendAllDisplay") {
                var obj = event.detail.data;
                allLegendDisplay = obj.isDisplay;
                //新添加FeatureLayer显示与隐藏判断
                if (selectTypeMain != "Direction" || selectTypeMain !="Age") {
                    var flId = selectTypeMain + "_Layer";
                    drawClass.isLoadFeatureLayerById(map, flId, allLegendDisplay);
                }
                if(allLegendDisplay){
                    if (selectTypeMain == "Direction") {
                        gl.removeAll();
                        for(var i=0;i<isDisplays.length;i++){
                            isDisplays[i] = Boolean(obj.isDisplay);
                        }
                        compareResultLayer.removeAll();
                        drawClass.DrawDirectionChange(directionChangeData, compareResultLayer, isDisplays, global.pressureChangLimit,
                            global.pressureChangColor, global.diffusionWidth, global.triangleColor, global.triangleSize);
                        return;
                    }
                    if (obj.itemType == "calNode" || obj.itemType == "") {
                        compareResultLayer.removeAll();
                    }
                    if ((!isCompare || selectTypeMain == "SupplyAreaCompare"|| selectTypeMain == "SupplyAreaCompareNew") && tableNameMain == "" && EventTypeMain != "Diffusion") {
                        var extentTemp = drawClass.GetDrawMapExtent(view);
                        for(var i=0;i<isDisplays.length;i++){
                            isDisplays[i] = Boolean(obj.isDisplay);
                        }
                        //gl.removeAll();
                        compareResultLayer.removeAll();
                        glSupplyAreaO.removeAll();
                        SelectChange(selectTypeMain, global.time, extentTemp);
                    }
                    else if (isCompare){
                        for(var i=0;i<isDisplays.length;i++){
                            isDisplays[i] = Boolean(obj.isDisplay);
                        }
                        compareResultLayer.removeAll();
                        GetTimeCompareData(compareData.time1, compareData.time2, compareData.min, compareData.max, compareData.field, compareData.level);
                    }
                    else if (tableNameMain != "" && EventTypeMain != "Diffusion") {
                        if (obj.itemType == "calNode") {
                            for(var i=0;i<isDisplays.length;i++){
                                isDisplays[i] = Boolean(obj.isDisplay);
                            }
                            gl.removeAll();
                            compareResultLayer.removeAll();
                            var limitsTemp = new Array()
                            limitsTemp = DrawPlanTempCalNode(planResultLimitMain.MinPressure, planResultLimitMain.MaxPressure, planResultLimitMain.NodePressure, planResultLimitMain.levelMy, pressureChangColor,pressureChangLimit);
                        }
                        else if (obj.itemType == "flow") {
                            planCalResultFlowLayer.removeAll();
                            for(var i=0;i<planCalPipeFlowIsDisplays.length;i++){
                                planCalPipeFlowIsDisplays[i] = Boolean(obj.isDisplay);
                            }
                            DrawPlanTempCalPipeFlow(planCalResultMain.MinFlow, planCalResultMain.MaxFlow, planCalResultMain.PipeFlow, planCalResultMain.levelMy, pressureChangColor, "flow",planTempCalFlowLimit);
                        }
                        else if (obj.itemType == "velocity") {
                            planCalResultVelocityLayer.removeAll();
                            for(var i=0;i<planCalPipeVelocityIsDisplays.length;i++){
                                planCalPipeVelocityIsDisplays[i] = Boolean(obj.isDisplay);
                            }
                            DrawPlanTempCalPipeFlow(planCalResultMain.MinStrength, planCalResultMain.MaxStrength, planCalResultMain.PipeStrength, planCalResultMain.levelMy, pressureChangColor, "velocity",planTempCalVelocityLimit);
                        }
                    }
                }else{
                    if (selectTypeMain == "Direction") {
                        for(var i=0;i<isDisplays.length;i++){
                            isDisplays[i] = Boolean(obj.isDisplay);
                        }
                        compareResultLayer.removeAll();
                    }
                    if (obj.itemType == "calNode" || obj.itemType == "") {
                        compareResultLayer.removeAll();
                    }
                    if ((!isCompare || selectTypeMain == "SupplyAreaCompare"|| selectTypeMain == "SupplyAreaCompareNew") && tableNameMain == "" && EventTypeMain != "Diffusion") {
                        var extentTemp = drawClass.GetDrawMapExtent(view);
                        for(var i=0;i<isDisplays.length;i++){
                            isDisplays[i] = Boolean(obj.isDisplay);
                        }
                        gl.removeAll();
                        compareResultLayer.removeAll();
                        glSupplyAreaO.removeAll();
                    }
                    else if (isCompare){
                        for(var i=0;i<isDisplays.length;i++){
                            isDisplays[i] = Boolean(obj.isDisplay);
                        }
                        compareResultLayer.removeAll();
                    }
                    else if (tableNameMain != "" && EventTypeMain != "Diffusion") {
                        if (obj.itemType == "calNode") {
                            for(var i=0;i<isDisplays.length;i++){
                                isDisplays[i] = Boolean(obj.isDisplay);
                            }
                            gl.removeAll();
                            compareResultLayer.removeAll();
                        }
                        else if (obj.itemType == "flow") {
                            planCalResultFlowLayer.removeAll();
                            for(var i=0;i<planCalPipeFlowIsDisplays.length;i++){
                                planCalPipeFlowIsDisplays[i] = Boolean(obj.isDisplay);
                            }
                        }
                        else if (obj.itemType == "velocity") {
                            planCalResultVelocityLayer.removeAll();
                            for(var i=0;i<planCalPipeVelocityIsDisplays.length;i++){
                                planCalPipeVelocityIsDisplays[i] = Boolean(obj.isDisplay);
                            }
                        }
                    }
                }
               
            }
            else if (typeMy == "legendLocation") {
                var itemDataTemp = event.detail.data;
                var supplyAreaLabel = '';
                if (selectTypeMain == "SupplyArea" || selectTypeMain == "PipeAge" || selectTypeMain == "SupplyAreaCompare"|| selectTypeMain == "SupplyAreaNew"|| selectTypeMain == "SupplyAreaCompareNew")
                    supplyAreaLabel = itemDataTemp.labelId;
                else
                    supplyAreaLabel = 'NAN';
                legendItemRenderData = itemDataTemp;
                legdneSupplyAreaLabel = supplyAreaLabel;
                if (itemDataTemp.itemType == "" || itemDataTemp.itemType == "calNode") {
                    if (itemDataTemp.itemType == "calNode")
                        layerType = "junction";
                    GetLegendLocationData(itemDataTemp, "100", tableNameMain, supplyAreaLabel)
                }
                else {
                    layerType = "pipe";
                    GetLegendCalPipeLocationData(itemDataTemp, "100", tableNameMain, itemDataTemp.itemType)
                }
            }
            else if (typeMy == "legendUser") {
                var itemDataTemp = event.detail.data;
                if (selectTypeMain == "SupplyArea" || selectTypeMain == "PipeAge" || selectTypeMain == "SupplyAreaCompare"|| selectTypeMain == "SupplyAreaNew"|| selectTypeMain == "SupplyAreaCompareNew")
                    supplyAreaLabel = itemDataTemp.labelId;
                else
                    supplyAreaLabel = 'NAN';
                legdneSupplyAreaLabel = supplyAreaLabel;
                legendItemRenderData = itemDataTemp;
                if (itemDataTemp.itemType == "" || itemDataTemp.itemType == "calNode") {
                    if (itemDataTemp.itemType == "calNode")
                        layerType = "junction";
                    GetLegendCustomerData(itemDataTemp, '100', tableNameMain, legdneSupplyAreaLabel)

                }
                else {
                    layerType = "pipe";
                    GetLegendCalPipeCustomerData(itemDataTemp, '100', tableNameMain, itemDataTemp.itemType)
                }
            }
            else if (typeMy == "Location") {
                var countTemp = event.detail.data;
                if (legendItemRenderData.itemType == "")
                    GetLegendLocationData(legendItemRenderData, countTemp, tableNameMain, legdneSupplyAreaLabel)
                else {
                    GetLegendCalPipeLocationData(legendItemRenderData, countTemp, tableNameMain, legendItemRenderData.itemType)
                }
            }
            else if (typeMy == "Customer") {
                var countTemp = event.detail.data;
                //GetLegendCustomerData(legendItemRenderData,countTemp,tableNameMain)
                if (itemDataTemp.itemType == "")
                    GetLegendCustomerData(legendItemRenderData, countTemp, tableNameMain)
                else
                    GetLegendCalPipeCustomerData(legendItemRenderData, countTemp, tableNameMain, legendItemRenderData.itemType)
            }
            else if (typeMy == "tableItemClickLocation") {
                var urlTemp = '';
                var itemData = event.detail.data;
                var elementIdTemp = itemData.ElementId;
                locationType = itemData.mainType;
                if (locationType == "Customer")
                    locationQueryUrlType = locationType
                else {
                    locationQueryUrlType = itemData.tableType;
                }
                if (locationQueryUrlType == "Customer")
                    urlTemp = customerUrl;
                else if (locationQueryUrlType == "junction")
                    urlTemp = urlClass.junctionResultUrl//urlClass.baseMapUrl+EN_PIPE_2;
                else if (locationQueryUrlType == "pipe")
                    urlTemp = urlClass.pipeResultUrl//urlClass.baseMapUrl+EN_JUNCTION;
                var whereTemp = "ElementId = " + elementIdTemp;
                TableItemClickLocation(whereTemp, urlTemp)
            }
            else if (typeMy == "ValveAttribute") {
                var valveAttributeIsDisplay = Boolean(event.detail.data);
                if (!valveAttributeIsDisplay) {
                    valveAttributeLayer.removeAll();
                }
                else {
                    ValveAttributeFunction();
                }
            }else if (typeMy == "WaterworksAttribute"){
                var waterworksTemp = event.detail.data;
                var waterworksAttributeIsDisplay = waterworksTemp.isWaterworks;
                var routeName = waterworksTemp.routePage;
                if (routeName == _routePage) {
                    if (!waterworksAttributeIsDisplay) {
                        waterworksAttributeLayer.removeAll();
                        popupLableBg.destroy();
                    }
                    else {
                        WaterworksAttributeFunction();
                    }
                }
            }
            else if (typeMy == "RealTimePressure") {
                //实时压力
                var _type = "pressure";
                pressureChecked = Boolean(event.detail.data);
                if (pressureChecked) {
                    GetRealTimeData(_type);
                    timingRefresh();
                }
                else {
                    DelRealTimeDataByType(_type);
                }
            }
            else if (typeMy == "RealTimeTraffic") {
                //实时流量
                var _type = "flow";
                trafficChecked = Boolean(event.detail.data);
                if (trafficChecked) {
                    GetRealTimeData(_type);
                    timingRefresh();
                }
                else {
                    DelRealTimeDataByType(_type);
                }
            }else if (typeMy == "RealTimeDummy") {
                //实时虚拟值
                dummyChecked = Boolean(event.detail.data);
                if (dummyChecked) {
                    GetRealTimeDummy();
                    timingRefresh();
                }
                else {
                    DelRealTimeDataByType("xnd");
                }
            }else if(typeMy == "OneMonitorData"){
                const obj = event.detail.data;
                GetOneMonitorData(obj);
            }else if(typeMy == "GetPointChartData"){
                const obj = event.detail.data;
                GetPointChartData(obj);
            }
            else if (typeMy == "MaxShow") {
                var maxIsShow = Boolean(event.detail.data);
                MaxLayer.visible = maxIsShow;
            }
            else if (typeMy == "MinShow") {
                var maxIsShow = Boolean(event.detail.data);
                MinLayer.visible = maxIsShow;
            }
            else if (typeMy == "MapClick") {
                //isMapClick = Boolean(event.detail.data);
            }
            else if (typeMy == "UpCheckClick") {
                isUpAndDown = true;
                drawBig = Boolean(event.detail.data);
                GetTimeCompareData(compareData.time1, compareData.time2, compareData.min, compareData.max, compareData.field, compareData.level);
            }
            else if (typeMy == "DownCheckClick") {
                isUpAndDown = true;
                drawSmall = Boolean(event.detail.data);
                GetTimeCompareData(compareData.time1, compareData.time2, compareData.min, compareData.max, compareData.field, compareData.level);
            }
            else if (typeMy == "PlanCalPipelegendSelect") {
                var legendSelectIndex = event.detail.data;
                if (legendSelectIndex == 0) {
                    planCalResultFlowLayer.visible = true;
                    planCalResultVelocityLayer.visible = false;
                    planCalResultDirectionChangeLayer.visible = false;
                }
                else if (legendSelectIndex == 1) {
                    planCalResultFlowLayer.visible = false;
                    planCalResultVelocityLayer.visible = true;
                    planCalResultDirectionChangeLayer.visible = false;
                }
                else if(legendSelectIndex == 2){
                    planCalResultFlowLayer.visible = false;
                    planCalResultVelocityLayer.visible = false;
                    planCalResultDirectionChangeLayer.visible = true;
                }
            }
            else if (typeMy == "DrawForecastWaringNode") {
                var pointData = event.detail.data;
                map.remove(featureLayer)
                featureLayer = drawClass.DrawHeatMap(featureLayer, pointData, map);
            }
            else if (typeMy == "GetDirectionChangeDataReturn") {
                isCompare = true;
                gl.removeAll();
                glSupplyAreaO.removeAll();
                compareResultLayer.removeAll();
                global.pressureChangLimit = new Array();
                var objTemp = event.detail.data;
                var allDataTemp = objTemp.data;
                var maxTemp = allDataTemp.Max;
                var minTemp = allDataTemp.Min;
                var drawData = allDataTemp.PipeData;
                directionChangeData = drawData;
                var val = (maxTemp - minTemp) / global.directionLevel;
                for (var i = 1; i <= global.directionLevel; i++) {
                    val = Math.abs(val);
                    var max1 = i * val + minTemp;
                    var min1 = (i - 1) * val + minTemp;
                    global.pressureChangLimit.push(min1.toFixed(2));
                }
                isDisplays = global.pressureChangeIsDisplay.slice(0);
                global.pressureChangLimit.push(maxTemp.toFixed(2));
                timeMyMain1 = objTemp.Time1;
                timeMyMain2 = objTemp.Time2;
                drawClass.DrawDirectionChange(drawData, compareResultLayer, global.pressureChangeIsDisplay, global.pressureChangLimit,
                    global.pressureChangColor, global.diffusionWidth, global.triangleColor, global.triangleSize);
                legend.LegendMain("Direction", "", global.pressureChangColor, isDisplays, '', 'Direction', '', '', true, [], 0, [], 0, {}, 'Direction', 0, objTemp.Time1, objTemp.Time2, '', false)
            }
            else if (typeMy == "CalPosition") {
               /*  elementChangeLayer.removeAll();
                for (var i = 0; i < allElementChangeData.length; i++) {
                    var obj = allElementChangeData[i];
                    var point = obj.point;
                    var gra1 = drawClass.CreatePictureGraphic(PictureProperty.redPin, point);
                    elementChangeLayer.add(gra1);
                } */
            }
            else if(typeMy=="ElementChangeListDeleteNew"){
               /*  var objTemp = event.detail.data;
                for (var i = 0; i < allElementChangeData.length; i++) {
                    var obj = allElementChangeData[i];
                    if(String(obj.ElementId)==String(objTemp.ElementId)){
                        allElementChangeData.splice(i, 1);
                        break;
                    }
                }
                elementChangeLayer.removeAll();
                for (var i = 0; i < allElementChangeData.length; i++) {
                    var obj = allElementChangeData[i];
                    var point = obj.point;
                    var gra1 = drawClass.CreatePictureGraphic(PictureProperty.redPin, point);
                    elementChangeLayer.add(gra1);
                } */

                var listTemp = event.detail.data;
                drawClass.DrawCalPosition(elementChangeLayer,listTemp);
            }
            else if (typeMy == "DrawToolRunningState") {
                myEventType="DrawTool";
                isMapClick = false;
                var data = event.detail.data;
                isClickDraw = drawTool.DrawToolInit(AddType, data, isClickDraw);
                drawTool.ResetTracking();
                drawTool.DrawInit(query, view, drawToolGraphicsLayer);
                drawTool.activateTool(data);
            }
            else if (typeMy == "DrawFinishInitRunningState") {
                isMapClick = true;
                isClickDraw = false;
                drawTool.CloseDrawTool(view);
                AddElementData = drawTool.OnSave();
            }
            else if (typeMy == "DrawFinishRunningState") {
                isMapClick = true;
                isClickDraw = false;
                drawTool.CloseDrawTool(view);
                AddElementData = drawTool.OnSave();
                WindowsEvent.MyDispatchEvent("AddElementData", AddElementData);
            }
            else if (typeMy == "AddClickRunningState") {
                var data = event.detail.data;
                var layerId = data.layerId;
                var featureTemp = data.featureTemp;
                DrawToolInfoWindowsShow(layerId, featureTemp,isMapClick);
            }
            else if (typeMy == "OpenDrawToolRunningState") {
                drawTool.createToolbar(AddType, hightLightLayer, view, errorMy, hide_junc_fm, hide_junc, drawToolGraphicsLayer, deletedline, displayline);//创建画图工具
            }
            else if(typeMy=="DrawCustomer"){
                if (_routePage == "RunningState") {
                    if(event.detail.data){
                        showCustomerLayer = true;
                        QueryCoustomer();
                    }
                    else{
                        showCustomerLayer = false;
                        if(clusterLayer){
                            map.remove(clusterLayer);
                            clusterLayer.destroy();
                            clusterLayer = null;
                        }
                    }
                }
            }
            else if (typeMy == "SearchPositionRunningState") {
              searchLayer.removeAll();
              var obj = event.detail.data;
              drawClass.SearchPosition(obj, searchLayer, view);
            } else if (typeMy == "ClearMapRunningState") {
              searchLayer.removeAll();
            }
            else if (typeMy == "MyTableClose") {
              LocationGraphicsLayer.removeAll();
            }else if(typeMy == "DrawStaticDirection"){
                dynamicMapServiceTintLayer.visible = true;
                isActive = false;
                gl.removeAll();
                glSupplyAreaO.removeAll();
                var conditional = drawClassFlowDirection.GetConditionalByScale(view.scale);
                drawClassFlowDirection.DrawStaticPipeFlowDirection(drawDirectionData, gl, view, 'Result_Flow_' + global.time, conditional);
            }
            else if(typeMy == "DrawActiveDirection"){
                dynamicMapServiceTintLayer.visible = false;
                isActive = true;
                gl.removeAll();
                glSupplyAreaO.removeAll();
                SelectChange(selectTypeMain, global.time, view.extent);
                /* var conditional = drawClassFlowDirection.GetConditionalByScale(view.scale);
                drawClassFlowDirection.DrawPipeFlowDirection(drawDirectionData, gl, view, 'Result_Flow_' + global.time, conditional); */
            }else if(typeMy=="ElementChangeListDelete"){
                var dataTemp = event.detail.data;
                DeleteChangeData(dataTemp);
                drawTool.DeleteElement(dataTemp);
                DelectDrawAdd(dataTemp);
            }else if(typeMy=="DynamicDisplay"){
                var isDynamicDisplay = event.detail.data;
                doDynamicDisplaPlay(isDynamicDisplay);
            }else if(typeMy == "FeedBackMapScreenshotHand_RunningStateChild"){
                // console.log("运行状态-map输出img");
                view.takeScreenshot({format: "png"}).then(function(screenshot) {
                    WindowsEvent.MyDispatchEvent(("FeedBackMapScreenshotOperating_" + _routePage), screenshot.dataUrl);
                });
            }else if(typeMy=="mytdt-mapManager"){
                console.log("mytdt-mapManager==>removeEvent");
                clearTimingRefresh(true);
                popupLableBg.destroy();
                window.removeEventListener('event_name', myEventListener);
            }
        }

        /**
         * 执行动态展示播放
         * @param {*} isDynamicDisplay 是否播放
         */
        function doDynamicDisplaPlay(isDynamicDisplay){
            if (isDynamicDisplay) {
                const flId = selectTypeMain + "_Layer";
                const seattleLayer = drawClass.isLoadFeatureLayerById(view.map, flId);
                if (!seattleLayer || !drawClass.getIsPlay(selectTypeMain)) return;
                switch (selectTypeMain) {
                    case "Flow"://管道流量
                        var couponList = [
                            {name:"管道流量24小时变化", code:"variety", playField: "Result_AbsoluteFlow_"}
                        ];
                        WindowsEvent.MyDispatchEvent('initSlider',{esriAPI: esriApi, view: view, seattleLayer: seattleLayer, couponList: couponList});
                        break;
                    case "Velocity"://管道流速
                        var couponList = [
                            {name:"管道流速24小时变化", code:"variety", playField: "Result_Velocity_"}
                        ];
                        WindowsEvent.MyDispatchEvent('initSlider',{esriAPI: esriApi, view: view, seattleLayer: seattleLayer, couponList: couponList});
                        break;
                    case "Slop"://管道水力坡度
                        var couponList = [
                            {name:"管道水力坡度24小时变化", code:"variety", playField: "Result_Slop_"}
                        ];
                        WindowsEvent.MyDispatchEvent('initSlider',{esriAPI: esriApi, view: view, seattleLayer: seattleLayer, couponList: couponList});
                        break;
                    case "HydraulicGrade"://水压标高
                        var couponList = [
                            {name:"水压标高24小时变化", code:"variety", playField: "Result_HydraulicGrade_"}
                        ];
                        WindowsEvent.MyDispatchEvent('initSlider',{esriAPI: esriApi, view: view, seattleLayer: seattleLayer, couponList: couponList});
                        break;
                    case "Pressure"://压力
                        var couponList = [
                            {name:"压力24小时变化", code:"variety", playField: "Result_Pressure_"}
                        ];
                        WindowsEvent.MyDispatchEvent('initSlider',{esriAPI: esriApi, view: view, seattleLayer: seattleLayer, couponList: couponList});
                        break;
                    case "Demand"://节点流量
                        var couponList = [
                            {name:"节点流量24小时变化", code:"variety", playField: "Result_Demand_"}
                        ];
                        WindowsEvent.MyDispatchEvent('initSlider',{esriAPI: esriApi, view: view, seattleLayer: seattleLayer, couponList: couponList});
                        break;
                    case "SupplyArea"://供水分界线
                        var couponList = [
                            {name:"供水分界线扩散", code:"Diffusion", playField: ("Result_Age_" + timeDisplay)}, 
                            {name:"供水分界线24小时变化", code:"variety", playField: "Result_SupplyArea_"}
                        ];
                        WindowsEvent.MyDispatchEvent('initSlider',{esriAPI: esriApi, view: view, seattleLayer: seattleLayer, couponList: couponList});
                        break;
                    default:
                        WindowsEvent.MyDispatchEvent('closeSlider', null);
                        break;
                }
            } else {
                WindowsEvent.MyDispatchEvent('closeSlider', null);
            }
        }

        function DelectDrawAdd(dataTemp){
            const graphics = drawToolGraphicsLayer.graphics.toArray();
            for(var i = 0; i < graphics.length; i++){
                var obj = graphics[i].attributes;
                if(String(obj.ElementId) == String(dataTemp.ElementId)){
                    allElementChangeData.splice(i, 1);
                    drawToolGraphicsLayer.remove(graphics[i]);
                    break;
                }
            }
        }

        var showCustomerLayer = false;
        function DeleteChangeData(changeData){
            for (var i = 0; i < allElementChangeData.length; i++) {
                var obj = allElementChangeData[i];
                if(String(obj.ElementId)==String(changeData.ElementId)){
                    allElementChangeData.splice(i, 1);
                    break;
                }
            }
        }

        var AddElementData = [];

        function DrawToolInfoWindowsShow(layerId, featureTemp,isMapClickTemp) {
            if (isMapClickTemp) {
                mySelectLayerId = layerId;
                switch (layerId) {
                    case String(global.layerId.EN_ADD_VALVE_O):
                        InfoWindowsShowTcv(featureTemp);
                        popup();
                        break;
                    case String(global.layerId.EN_ADD_NODE_O):
                        InfoWindowsShowJunction(featureTemp);
                        popup();
                        break;
                    case String(global.layerId.EN_ADD_PIPE_O):
                        InfoWindowsShowPipe(featureTemp);
                        popup();
                        break;
                }
            }
        }
        var isClickDraw = false;
        var AddType = "";
        var tolerance = 0.01;
        var isHaveNode = false;
        // Update the measurement details
        // var errorMy = map.toMap(new esriApi.ScreenPoint(tolerance, 0)).x - map.toMap(new esriApi.ScreenPoint(0, 0)).x;
        var errorMy = 0;
        // //告诉污染物扩散界面地图加载完了
        // WindowsEvent.MyDispatchEvent("RunningStateMapLoad", '');
        var directionChangeData = new Object();
       /*  var dialog = new dijit.TooltipDialog({
            id: "tooltipDialogRunningState",
            style: "position: absolute; width: 150px; font: normal normal normal 10pt Helvetica;z-index:100"
        }); */
        // //发送地图上时间监听完成的消息
        // WindowsEvent.MyDispatchEvent("LoadMap",'');
        view.when(function(e){
            console.log("LoadMap完成");
            errorMy = view.toMap({x:tolerance, y:0}).x - view.toMap({x:0, y:0}).x;
            //告诉污染物扩散界面地图加载完了
            WindowsEvent.MyDispatchEvent("RunningStateMapLoad", '');
            //发送地图上时间监听完成的消息
            WindowsEvent.MyDispatchEvent("LoadMap",'');
            //初始化刷新气泡窗口位置监听事件
            popupEcharts.initPopupEvent(view, "yxztPopup");
            popupTable.initPopupEvent(view, "xndPopup");
            popupLableBg.initPopupEvent(view, "scPopup");
        }, function(error){
            console.log("The view's resources failed to load: ", error);
        });

        var timing = null;
        var isTiming = false;
        var pressureChecked = false;//实时压力
        var trafficChecked = false;//实时流量
        var dummyChecked = false;//实时虚拟值
        /**
         * 计时刷新
         */
        function timingRefresh() {
            clearTimingRefresh();//初始化还原计时器
            timing = setTimeout(GetTimingRealTimeData, 1000 * 60);
        }
        /**
         * 清空计时刷新,传入true销毁popup的数据
         */
        function clearTimingRefresh(isClearData = false){
            if (timing) {
                clearTimeout(timing);
                timing = null;
            }
            if (isClearData) {
                //销毁popup的数据
                popupEcharts.destroy();
                trafficLayer.removeAll();
                pressureLayer.removeAll();
                popupTable.destroy();
                dummyLayer.removeAll();
            }
        }
        /**
         * 计时获取流量压力实时数据
         */
        function GetTimingRealTimeData(){
            //销毁popup的数据
            popupEcharts.destroy();
            if (pressureChecked) {
                GetRealTimeData("pressure");//实时压力
            }
            if (trafficChecked) {
                GetRealTimeData("flow");//实时流量
            }
            if (dummyChecked) {
                popupTable.destroy();
                GetRealTimeDummy();//实时虚拟点
            }
            if (pressureChecked || trafficChecked || dummyChecked) {
                isTiming = true;
                timingRefresh();
            }
        }

        /**
         * 删除地图实时显示数据
         * @param {*} type
         */
        function DelRealTimeDataByType(type) {
            //销毁popup的数据
            if (type == "flow") {
                popupEcharts.typeDestroy(type);
                trafficLayer.removeAll();
            } else if (type == "pressure"){
                popupEcharts.typeDestroy(type);
                pressureLayer.removeAll();
            }else if (type == "xnd"){
                popupTable.destroy();
                dummyLayer.removeAll();
            }
        }

        /**
         * 获取虚拟点实时数据
         * @param {*} type
         */
        function GetRealTimeDummy(){
            dummyLayer.removeAll();
            popupTable.destroy();
            var userId = localStorage.getItem("UserId");
            axios.post(urlClass.axiosUrl + "GetAllVirtualPointsData", JSON.stringify(userId),{headers: {"Content-Type": "application/json;"}})
            .then(function(res) {
                var listData  = [];
                var unit = "";
                if (res.data.Response) {
                    for(var i = 0;i < res.data.Response.length;i++){
                        const _data = res.data.Response[i];
                        var obj = _data;
                        var tableData = [];
                        if (_data.Pressure != "0") {
                            tableData.push({label:"压力", value:_data.PressureValue.toFixed(3)});
                        }
                        if (_data.Age != "0") {
                            tableData.push({label:"水龄", value:_data.AgeValue.toFixed(3)});
                        }
                        if (_data.Flow != "0") {
                            tableData.push({label:"流量", value:_data.FlowValue.toFixed(3)});
                        }
                        if (_data.Velocity != "0") {
                            tableData.push({label:"流速", value:_data.VelocityValue.toFixed(3)});
                        }
                        obj.id = _data.ElementId;
                        obj.x = _data.X;
                        obj.y = _data.Y;
                        obj.type = "xnd";
                        obj.title = _data.Label;
                        obj.echartDisplay = false;
                        obj.option = [];
                        obj.tableData = tableData;
                        listData.push(obj);
                        //绘制地图图标
                        DrawRealTimeData(obj);
                    }
                    if (listData.length > 0) {
                        //加载popup的数据
                        popupTable.loadPopup(listData);
                    }
                }
            });
        }

        /**
         * 获取虚拟点历史数据
         */
        function GetPointChartData(obj) {
            var userId = localStorage.getItem("UserId");
            var parameterTemp = {
                ElementId: obj.ElementId,
                Pressure: obj.Pressure,
                Flow: obj.Flow,
                Velocity: obj.Velocity,
                Age: obj.Age,
                UserId: userId
            };
            axios.post(urlClass.axiosUrl + "GetPointChartData", JSON.stringify(parameterTemp), {headers: {"Content-Type": "application/json;"}})
            .then(function(res) {
                if (res.data.Response) {
                    var _charData = [];
                    for (let j = 0; j < res.data.Response.length; j++) {
                        const item = res.data.Response[j];
                        var real = [];
                        var listX  = [];
                        var listXNew = [];
                        var min =  0, max = 0;
                        var typeTemp = "";
                        var type = item.Type;
                        var name = "";
                        switch (type) {
                            case "Flow":
                                name = "流量";
                                typeTemp = "流量(m³/h)";
                                break;
                            case "Velocity":
                                name = "流速";
                                typeTemp = "流速";
                                break;
                            case "Pressure":
                                name = "压力";
                                typeTemp = "压力(m)";
                                break;
                            case "Age":
                                name = "水龄";
                                typeTemp = "水龄";
                                break;
                        }
                        const tempData = item.ChartData;
                        for(var i = 0;i < tempData.length;i++){
                            var monitor = tempData[i];
                            if(Number(monitor.Value)!=0){
                                real.push(monitor.Value.toFixed(3));
                                if(Number(monitor.Value)<min){
                                    min = Number(monitor.Value.toFixed(3));
                                }else if(Number(monitor.Value)>max){
                                    max = Number(monitor.Value.toFixed(3));
                                }
                            }
                            else{
                                real.push('');
                            }
                            if (i == 0 || i == 5 || i == 10 || i == 15 || i == 23) {
                                listXNew.push( i + "点");
                            }
                            listX.push(monitor.Time)
                        }
                        min-=1;
                        max+=1;
                        _charData.push({type: type, name: name, real, listX, listXNew, typeTemp, min, max});
                    }
                    //加载popup图表数据
                    popupTable.loadChart(obj, _charData);
                }
            });
        }

        /**
         * 获取压力、流量实时数据
         * @param {*} type
         */
        function GetRealTimeData(type) {
            var unit = "m";
            if (type == "flow") {
                unit = "m³/h";
                trafficLayer.removeAll();
            } else {
                unit = "m";
                pressureLayer.removeAll();
            }
            popupEcharts.typeDestroy(type);
            axios.post(urlClass.axiosUrl + "GetRealTimeData", JSON.stringify(type),{headers: {"Content-Type": "application/json;"}})
            .then(function(respone) {
                var listData  = [];
                for(var i = 0;i < respone.data.length;i++){
                    const _data = respone.data[i];
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
                    DrawRealTimeData(obj);
                }
                if (listData.length > 0) {
                    //加载popup的数据
                    popupEcharts.loadPopup(listData);
                }
            });
        }

        /**
         * 获取压力、流量历史数据
         */
        function GetOneMonitorData(obj) {
            var parameterTemp = {
                id: obj.id,
                Type: obj.type
            };
            var typeTemp = obj.type == 'flow' ? '流量(m³/h)' : '压力(m)';
            axios.post(urlClass.axiosUrl + "GetOneMonitorData", JSON.stringify(parameterTemp), {headers: {"Content-Type": "application/json;"}})
            .then(function(respone) {
                var real = [];
                var cal = [];
                var listX  = [];
                var listXNew = [];
                var min =  respone.data[0].CalValue,max = 0;
                for(var i=0;i<respone.data.length;i++){
                    var monitor = respone.data[i];
                    if(Number(monitor.MonitorValue)!=0){
                        real.push(monitor.MonitorValue);
                        if(Number(monitor.MonitorValue)<min){
                            min = Number(monitor.MonitorValue);
                        }else if(Number(monitor.MonitorValue)>max){
                            max = Number(monitor.MonitorValue);
                        }
                    }
                    else{
                        real.push('');
                    }
                    if(String(monitor.Minute)=='0'&&String(monitor.Second)=='0')
                    {
                        listXNew.push(monitor.Time);
                        cal.push(monitor.CalValue);
                        if(Number(monitor.CalValue)<min){
                            min = Number(monitor.CalValue);
                        }else if(Number(monitor.CalValue)>max){
                            max = Number(monitor.CalValue);
                        }
                    }else{
                        cal.push('');
                    }
                    listX.push(monitor.Time)
                }
                min-=1;
                max+=1;
                
                var _charData = {real, cal, listX, typeTemp, listXNew, min, max};
                //加载popup图表数据
                popupEcharts.loadChart(obj, _charData);
            });
        }

        /**
         * 绘制地图图标
         */
        function DrawRealTimeData(obj) {
            var pictureMarkerSymbol = null;
            var gra = null;
            var pointTemp = esriApi.Point(obj.x, obj.y, new esriApi.SpatialReference({ wkid: global.spatialReference }));;
            if (obj.type == "flow") {
                pictureMarkerSymbol = new esriApi.PictureMarkerSymbol({ url: trafficSource, width: 24, height: 24});
                gra = new esriApi.Graphic(pointTemp, pictureMarkerSymbol);
                trafficLayer.add(gra);
            } else if(obj.type == "pressure") {
                pictureMarkerSymbol = new esriApi.PictureMarkerSymbol({ url: pressureSource, width: 24, height: 24});
                gra = new esriApi.Graphic(pointTemp, pictureMarkerSymbol);
                pressureLayer.add(gra);
            } else if(obj.type == "xnd"){
                pictureMarkerSymbol = new esriApi.PictureMarkerSymbol({ url: dummySource, width: 24, height: 24});
                gra = new esriApi.Graphic(pointTemp, pictureMarkerSymbol);
                dummyLayer.add(gra);
            }
        }

        /**
         * 获取不同分级
         * @param {*} min 
         * @param {*} max 
         * @param {*} levelTemp 
         */
        function GetLimit(min,max,levelTemp){
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
        }

        function GetDiffusionLocationData(itemDataTemp) {

        }
        var diffusionDrawData = new Object();
        var diffusionResultClass = new Object();
        var eventType = '';
        var itemType = "";
        var isUpAndDown = false;
        var drawBig = true;
        var drawSmall = true;
        var drawBigFlow = true;
        var drawSmallFlow = true;
        var drawBigVelocity = true;
        var drawSmallVelocity = true;
        var compareData = new Object();
        var supplyAreaCompareData = new Array();
        function ValveAttributeFunction() {
            axios.get(urlClass.axiosUrl + "GetAllValveStates")
                .then(function (response) {
                    DrawValveAttribute(response.data);
                });
        }

        function DrawValveAttribute(allValveAtttibute) {
            valveAttributeLayer.removeAll();
            for (var i = 0; i < allValveAtttibute.length; i++) {
                var obj = new Object();
                obj = allValveAtttibute[i];
                var statusTemp = obj.State;
                var pointTemp = esriApi.Point(obj.X, obj.Y, new esriApi.SpatialReference({ wkid: global.spatialReference }));
                DrawOneValveAttriute(pointTemp, statusTemp);
            }
        }
        function WaterworksAttributeFunction() {
            var parameterTemp = global.pipeSupplyAreaLimit;
            axios.post(urlClass.axiosUrl + "SourceCoordinate", JSON.stringify(parameterTemp),
                { headers: { 'Content-Type': 'application/json;' } }
            ).then(DrawWaterworksAttribute)
        }
        function DrawWaterworksAttribute(response) {
            var tempData = [];
            popupLableBg.destroy();
            waterworksAttributeLayer.removeAll();
            var allWaterworksAtttibute = response.data;
            for (var i = 0; i < allWaterworksAtttibute.length; i++) {
                var obj = {
                    id: global.pipeSupplyAreaLimit[i],
                    title: global.pipeSupplyAreaLabels[i],
                    x: allWaterworksAtttibute[i].X,
                    y: allWaterworksAtttibute[i].Y
                };
                tempData.push(obj);
                DrawOneWaterworksAttriute(obj);
            }
            if (tempData.length > 0) {
                //加载popup的数据
                popupLableBg.loadPopup(tempData);
            }
        }
        var maxMain = "";
        var minMain = "";
        function GetBaseMax(typeTemp, timeTemp, fieldTemp, tableNameTemp, typeMainTemp, fieldMainTemp) {
            axios.get(urlClass.axiosUrl + "GetBaseMax/" + timeTemp + "/" + typeTemp + "/" + fieldTemp + "/" + tableNameTemp)
                .then(function (response) {
                    var objArray = response.data;
                    if (objArray.length >= 1) {
                        var obj = objArray[0];
                        var pointTemp = esriApi.Point(obj.X, obj.Y, new esriApi.SpatialReference({ wkid: global.spatialReference }));
                        PositionMax(pointTemp, obj.Max);
                        maxMain = obj.Max;
                        maxMain = Number(maxMain).toFixed(2);
                        if (objArray.length > 1) {
                            var obj = objArray[1];
                            var pointTemp = esriApi.Point(obj.X, obj.Y, new esriApi.SpatialReference({ wkid: global.spatialReference }));
                            PositionMin(pointTemp, obj.Max);
                            minMain = obj.Max;
                            minMain = Number(minMain).toFixed(2);
                        }
                        LegendMain(typeMainTemp, fieldMainTemp);
                    }

                });
        }

        function PositionMax(pointTemp, maxTemp) {
            MaxLayer.removeAll();
            var gra1 = drawClass.CreatePictureGraphic(PictureProperty.bluePin, pointTemp)//new esriApi.Graphic(pointTemp, pictureMarkerSymbol);
            MaxLayer.add(gra1);
            MaxLayer.visible = false;
        }
        function PositionMin(pointTemp, maxTemp) {
            MinLayer.removeAll();
            var gra1 = drawClass.CreatePictureGraphic(PictureProperty.redPin, pointTemp)//new esriApi.Graphic(pointTemp, pictureMarkerSymbol);
            MinLayer.add(gra1);
            MinLayer.visible = false;
        }

        function DrawOneValveAttriute(pointTemp, statusTemp) {
            var imageSource = "";
            if (statusTemp == "0")
                imageSource = valveCloseSource;
            else
                imageSource = valvePartCloseSource;
            var pictureMarkerSymbol = new esriApi.PictureMarkerSymbol({ url: imageSource, width: 13, height: 13});
            var gra1 = new esriApi.Graphic(pointTemp, pictureMarkerSymbol);
            valveAttributeLayer.add(gra1);
        }

        function DrawOneWaterworksAttriute(obj) {
            var pointTemp = esriApi.Point(obj.x, obj.y, new esriApi.SpatialReference({ wkid: global.spatialReference }));
            var pictureMarkerSymbol = new esriApi.PictureMarkerSymbol({ url: waterworksImageSource, width: 51, height: 41});
            var gra1 = new esriApi.Graphic(pointTemp, pictureMarkerSymbol);
            waterworksAttributeLayer.add(gra1);
        }

        var locationQueryUrlType = '';
        var locationType = '';
        var legendItemRenderData = new Object();
        var legdneSupplyAreaLabel = '';

        function GetLegendCustomerData(itemDataTemp, top, tableName, supplyAreaLabelTemp) {
            var parameterTemp = new Object();
            if (supplyAreaLabelTemp != 'NAN') {
                parameterTemp.Where = supplyAreaLabelTemp;
            }
            else {
                parameterTemp.Where = itemDataTemp.labelDisplayContent;
                supplyAreaLabelTemp = "";
            }
            //if(selectTypeMain!="PipeAge")
            //parameterTemp.Where = itemDataTemp.labelDisplayContent;
            //else
            //parameterTemp.Where = itemDataTemp.labelId;
            parameterTemp.Time = global.time;
            parameterTemp.Field = (selectTypeMain == "SupplyAreaCompare" ? "SupplyArea" :((selectTypeMain == "SupplyAreaCompareNew" ? "SupplyAreaNew" :selectTypeMain))) ;
            parameterTemp.Top = top;
            parameterTemp.TableName = tableName;
            parameterTemp.Time1 = timeMyMain1;
            parameterTemp.Time2 = timeMyMain2;
            parameterTemp.isCompare = isCompare;
            var tempUrl = "";
            if (isCompare)
                tempUrl = urlClass.axiosUrl + 'GetCompareLegendUserData';
            else if (tableNameMain == "" && EventTypeMain != "Diffusion")
                tempUrl = urlClass.axiosUrl + 'GetLegendUserData';
            else if (EventTypeMain != "Diffusion")
                tempUrl = urlClass.axiosUrl + 'GetLegendCalUserData';
            else if (EventTypeMain == "Diffusion")
                tempUrl = urlClass.axiosUrl + 'GetUserDataDiffssion';
            axios.post(
                tempUrl,
                JSON.stringify(parameterTemp),
                { headers: { 'Content-Type': 'application/json;' } }
            )
                .then(GetLegendCustomerDataReturn)
        }
        function GetBranchPipes(){
            var tempUrl = "";
            tempUrl = urlClass.axiosUrl + 'GetBranchPipes';
            axios.post(
                tempUrl,
                
                { headers: { 'Content-Type': 'application/json;' } }
            )
                .then(GetBranchPipesReturn)
        }
        function GetBranchPipesReturn(respone){
            branchPipes = respone.data;
            SelectChange(selectTypeMain, global.time, view.extent);
        }
        function GetLegendCalPipeCustomerData(itemDataTemp, top, tableName, fieldTemp) {
            var parameterTemp = new Object();
            parameterTemp.Where = itemDataTemp.labelDisplayContent;
            parameterTemp.Field = fieldTemp;
            parameterTemp.Top = top;
            parameterTemp.TableName = tableName;
            var tempUrl = urlClass.axiosUrl + 'GetLegendCalPipeUserData';
            axios.post(
                tempUrl,
                JSON.stringify(parameterTemp),
                { headers: { 'Content-Type': 'application/json;' } }
            )
                .then(GetLegendCustomerDataReturn)
        }
        function GetLegendCustomerDataReturn(response) {
            var obj = response.data;
            var tableData = obj.ListData;
            var mytableData = new Object();
            mytableData.listData = tableData;
            mytableData.numberCount = obj.Count;
            mytableData.tableName = 'customerTable';
            mytableData.labelType = '用户数量';
            mytableData.mainType = "Customer";
            if(EventTypeMain == "PlanTempCalculate")
            mytableData.isCompare = 'compare';
            else
            mytableData.isCompare = isCompare ? 'compare' : '';
            MyDispatchEvent('LegendCustomerGet', mytableData);
        }
        var legendSelect = "";
        function GetLegendCalPipeLocationData(itemDataTemp, top, tableName, fieldTemp) {
            legendSelect = 'pipe';
            var parameterTemp = new Object();
            parameterTemp.Where = itemDataTemp.labelDisplayContent;
            parameterTemp.Field = fieldTemp;
            parameterTemp.Top = top;
            parameterTemp.TableName = tableName;
            var postUrl = "";
            postUrl = urlClass.axiosUrl + 'GetLegendCalPipeLocationData';
            axios.post(
                postUrl,
                JSON.stringify(parameterTemp),
                { headers: { 'Content-Type': 'application/json;' } }
            )
                .then(GetLegendLocationDataReturn)
        }
        function GetLegendLocationData(itemDataTemp, top, tableName, supplyAreaLabelTemp) {
            var parameterTemp = new Object();
            if (supplyAreaLabelTemp != 'NAN') {
                parameterTemp.Where = supplyAreaLabelTemp;
            }
            else {
                parameterTemp.Where = itemDataTemp.labelDisplayContent;
                supplyAreaLabelTemp = "";
            }
            parameterTemp.Time = global.time;
            parameterTemp.Field = (selectTypeMain == "SupplyAreaCompare" ? "SupplyArea" :(selectTypeMain == "SupplyAreaCompareNew" ? "SupplyAreaNew":selectTypeMain));
            parameterTemp.Top = top;
            parameterTemp.TableName = tableName;
            parameterTemp.SupplyAreaLabel = supplyAreaLabelTemp;
            parameterTemp.Time1 = timeMyMain1;
            parameterTemp.Time2 = timeMyMain2;
            parameterTemp.isCompare = isCompare;
            
            var postUrl = "";
            if (isCompare)
                postUrl = urlClass.axiosUrl + 'GetCompareLegendLocationData';
            else if (EventTypeMain != "PlanTempCalculate" && EventTypeMain != "Diffusion")
                postUrl = urlClass.axiosUrl + 'GetLegendLocationData';
            else if (EventTypeMain == "PlanTempCalculate" && EventTypeMain != "Diffusion")
                postUrl = urlClass.axiosUrl + 'GetLegendCalLocationData';
            else if (EventTypeMain == "Diffusion")
                postUrl = urlClass.axiosUrl + 'GetExtentDataDiffssion';
            axios.post(
                postUrl,
                JSON.stringify(parameterTemp),
                { headers: { 'Content-Type': 'application/json;' } }
            )
                .then(GetLegendLocationDataReturn)
        }

        function GetLegendLocationDataReturn(response) {
            var obj = response.data;
            var tableData = obj.LegendInfo;

            var mytableData = new Object();
            mytableData.tableType = layerType;
            mytableData.listData = tableData;
            mytableData.numberCount = obj.Count;
            mytableData.tableName = 'attributeTable';
            mytableData.labelType = layerType == 'pipe' ? '管道数量' : '节点数量';
            mytableData.mainType = "Location";
            if(EventTypeMain == "PlanTempCalculate")
            mytableData.isCompare = 'compare';
            else
            mytableData.isCompare = isCompare ? 'compare' : '';
            MyDispatchEvent('LegendLocationGet', mytableData);
        }

        function MyDispatchEvent(typeTemp, dataTemp) {
            var myEventTemp = new CustomEvent('event_name', {
                detail: { type: 'This is title!' },
            });
            myEventTemp.detail.type = typeTemp;
            myEventTemp.detail.data = dataTemp;
            if (window.dispatchEvent) {
                window.dispatchEvent(myEventTemp);
            } else {
                window.fireEvent(myEventTemp);
            }
        }

        var allLegendDisplay = true;
        var isAllDisplay = false;
        function GetTimeCompareData(time1, time2, min, max, field, level) {
            var parameter = {
                Time1: time1,
                Time2: time2,
                Min: min,
                Max: max,
                Field: field
            }
            var urlTempPost = "";
            var isPipe = false;
            if (selectTypeMain == "Flow" || selectTypeMain == "Velocity" || selectTypeMain == "Slop" || selectTypeMain == "Age") {
                urlTempPost = urlClass.axiosUrl + "TimeCompareDataPipe";
                isPipe = true;
            }
            else if (selectTypeMain == "Pressure" || selectTypeMain == "HydraulicGrade" || selectTypeMain == "Demand") {
                urlTempPost = urlClass.axiosUrl + "TimeCompareDataNode";
                isPipe = false;
            }
            console.log('TimeCompareData',JSON.stringify(parameter))
            axios.post(
                urlTempPost,
                JSON.stringify(parameter),
                { headers: { 'Content-Type': 'application/json;' } }
            )
                .then(function (response) {
                    gl.removeAll();
                    glSupplyAreaO.removeAll();
                    compareResultLayer.removeAll();
                    drawClass.isLoadFeatureLayerById(map);
                    var limitsTemp;
                    limitsTemp = GetLimit(min, max,level);
                    pressureChangLimit = limitsTemp.slice(0)
                    if (isPipe)
                        DrawPlanTempCalPipeFlow(min, max, response.data, level, pressureChangColor, "",pressureChangLimit);
                    else
                        DrawPlanTempCalNode(min, max, response.data, level, pressureChangColor,pressureChangLimit);
                    if (!isUpAndDown)
                        LegendDisplayMain(selectTypeMain, global.time);

                })
        }

        /**
         * 临时方案模拟计算绘制节点压力变化函数
         * @param {*} min
         * @param {*} max
         * @param {*} allData
         * @param {*} levelTemp
         * @param {*} colorTemp
         */
        function DrawPlanTempCalNode(min, max, allData, levelTemp, colorTemp,limitTempMy) {
            if (isDisplays.length == 0)
                isDisplays = pressureChangeIsDisplay.slice(0)
            var limitsTemp = drawClass.DrawPressureChange(min, max, allData, levelTemp,
                pressureChangColor, isDisplays, compareResultLayer, true, selectTypeMain, EventTypeMain, drawBig, drawSmall,limitTempMy)
            return limitsTemp;
        }

        /**
         * 临时方案模拟计算绘制管道流量变化函数
         * @param {*} min
         * @param {*} max
         * @param {*} allData
         * @param {*} levelTemp
         * @param {*} colorTemp
         */
        function DrawPlanTempCalPipeFlow(min, max, allData, levelTemp, colorTemp, typeTemp,limitsTempMy) {
            if (isDisplays.length == 0)
                isDisplays = pressureChangeIsDisplay.slice(0)
            var limitsTemp = new Array();
            if (typeTemp == "")
                limitsTemp = drawClass.DrawPipeFlowChange(min, max, allData, levelTemp, colorTemp, isDisplays, compareResultLayer,
                    isCompare, selectTypeMain, EventTypeMain, drawBig, drawSmall,limitsTempMy)
            else if (typeTemp == "flow")
                limitsTemp = drawClass.DrawPipeFlowChange(min, max, allData, levelTemp, colorTemp, planCalPipeFlowIsDisplays, planCalResultFlowLayer,
                    true, selectTypeMain, EventTypeMain, drawBigFlow, drawSmallFlow,limitsTempMy)
            else if (typeTemp == "velocity")
                limitsTemp = drawClass.DrawPipeFlowChange(min, max, allData, levelTemp, colorTemp, planCalPipeVelocityIsDisplays, planCalResultVelocityLayer,
                    true, selectTypeMain, EventTypeMain, drawBigVelocity, drawSmallVelocity,limitsTempMy)
            return limitsTemp;
        }


        /**
         * 临时方案模拟计算绘制管道流速变化函数
         * @param {*} min
         * @param {*} max
         * @param {*} allData
         * @param {*} levelTemp
         * @param {*} colorTemp
         */
        function DrawPlanTempCalPipeStrength(min, max, allData, levelTemp, colorTemp) {
            DrawPipeFlowChange(min, max, allData, levelTemp, colorTemp)
        }

        /**
         * 临时方案模拟计算绘制管道流向变化函数
         */
        function DrwaPlanTempCalPipeDirection() {

        }

        /**
         * 起始时间
         */
        var startDate;
        /**
         * 终止时间
         */
        var endDate;
        var typeMain = "";
        var fieldMain = "";
        var compreType = "";

        function LegendDisplayMain(typeTemp, timeTemp) {
            console.log('LegendDisplayMain:',new Date())
            maxMain = "";
            minMain = "";
            MaxLayer.visible = false;
            MinLayer.visible = false;
            pipeFlowLimit = global.pipeFlowLimit;
            if (typeTemp == "Flow" || typeTemp == "Velocity" || typeTemp == "Slop" || typeTemp == "Age" || typeTemp == "SupplyArea" || typeTemp == "SupplyAreaCompare"|| selectTypeMain == "SupplyAreaNew"|| typeTemp == "SupplyAreaCompareNew") {
                typeMain = typeTemp;
                if (typeTemp == "SupplyAreaCompare") {
                    field = 'Result_SupplyArea_' + timeTemp;
                    fieldMain = 'Result_SupplyArea_';
                }
                else if(typeTemp == "SupplyAreaNew"){
                    field = 'Result_SupplyArea_New' + timeTemp;
                    fieldMain = 'Result_SupplyArea_New';
                }
                else if(typeTemp == "SupplyAreaCompareNew"){
                    field = 'Result_SupplyArea_New' + timeTemp;
                    fieldMain = 'Result_SupplyArea_New';
                }
                else{
                    fieldMain = 'Result_' + typeTemp + '_';
                    field = 'Result_' + typeTemp + '_' + timeTemp;
                }
                    
                where = drawClass.GetWhere('pipe', view);
                
                if (typeTemp != "SupplyAreaCompare"&&typeTemp != "SupplyAreaCompareNew")
                    fieldMain = 'Result_' + typeTemp + '_';
                else if(typeTemp == "SupplyAreaCompare")
                    fieldMain = 'Result_SupplyArea_';
                else if(typeTemp == "SupplyAreaCompareNew")
                    fieldMain = 'Result_SupplyArea_New'; 
                if (typeTemp != "SupplyAreaCompareNew"&&typeTemp != "SupplyAreaCompare" && typeTemp != "SupplyArea" && !isCompare&& typeTemp != "SupplyAreaNew") {
                    GetBaseMax(layerType, global.time, selectTypeMain, "NAN", typeMain, fieldMain);
                }
                else {
                    LegendMain(typeMain, fieldMain);
                }

            }
            else if (typeTemp == "Pressure" || typeTemp == 'HydraulicGrade' || typeTemp == "Demand") {
                field = 'Result_' + typeTemp + '_' + timeTemp;
                console.log('drawClass.GetWhere',new Date())
                where = drawClass.GetWhere('junction', view);
                console.log('drawClass.GetWhere',new Date())
                //LegendMain(typeTemp,'Result_'+typeTemp+'_');
                typeMain = typeTemp;
                fieldMain = 'Result_' + typeTemp + '_';
                if (isCompare){
                    console.log('isCompare',new Date())
                    LegendMain(typeMain, fieldMain);
                }
                else
                    GetBaseMax(layerType, global.time, selectTypeMain, "NAN", typeMain, fieldMain);

            }
            else if (typeTemp == "Diameter" || typeTemp == "Material") {
                field = 'Physical_Pipe' + typeTemp;
                where = drawClass.GetWhere('pipe', view);
                LegendMain(typeTemp, field);
            }
            else if (typeTemp == "PipeAge") {
                where = drawClass.GetWhere('pipe', view);
                LegendMain(typeTemp, typeTemp);
            }
            else if (typeTemp == "PressureChange") {
                where = GetPressureChangeWhere();
                LegendMain(typeTemp, typeTemp);
            }
            else if (typeTemp == "FlowChangeCount") {
                where = drawClass.GetWhere('pipe', view);
                LegendMain(typeTemp, typeTemp);
            }
            else if (typeTemp == "baseMap" || typeTemp == "ValveUpdate" || typeTemp == "PipeStatus") {
                BaseMapLegend();
            }
        }

        function BaseMapLegend() {
            var myEventTemp = new CustomEvent('event_name', {
                detail: { type: 'This is title!' },
            });
            myEventTemp.detail.type = "LegendDisplay";
            var legendList = new Array();
            var legendAllData = new Object();
            legendAllData.title = '基础管网';
            legendAllData.legendName = '';
            legendAllData.listData = [];
            legendAllData.type = 'baseMap';
            legendAllData.opType = true;
            myEventTemp.detail.data = legendAllData;
            if (window.dispatchEvent) {
                window.dispatchEvent(myEventTemp);
            } else {
                window.fireEvent(myEventTemp);
            }
        }

        function DrawDirectionMain(idsList){
            if (view.scale >= 40000) {
                var obj = {Diameter:300,List:idsList}
                WindowsEvent.MyDispatchEvent("DirectionDrawExtentChange",obj);
            }
            else if(view.scale >= myScale[0]){
                var obj = {Diameter:100,List:idsList}
                WindowsEvent.MyDispatchEvent("DirectionDrawExtentChange",obj);
            }
            else{
                var obj = {Diameter:0,List:idsList}
                WindowsEvent.MyDispatchEvent("DirectionDrawExtentChange",obj);
            } 
        }

        var drawLayerWhere = '';
        /**
         * 专题图或者时间切换函数
         * @param {*} typeTemp 专题图类型
         * @param {*} timeTemp 时间
         */
        function SelectChange(typeTemp, timeTemp, extentTemp, isMapZoom = false, pipeDiameterWhere = "1=1") {
            drawClass.isLoadFeatureLayerById(map);
            if (!isMapZoom) {
                WindowsEvent.MyDispatchEvent('closeSlider', null);
            }
            if (typeTemp != "baseMap") {
                clearTimingRefresh(true);
            }
            //if(view.scale<=myScale[1])
            {
                if (typeTemp == "baseMap") {
                    // console.log('SelectChange');
                    gl.removeAll();
                    glSupplyAreaO.removeAll();
                    compareResultLayer.removeAll();
                    layerType = '';
                }
                else if(typeTemp == "Direction"){
                    WindowsEvent.MyDispatchEvent("ClearDirection",'');
                    where = drawClass.GetWhere('pipe', view);
                    drawPipe(field, where, urlClass.pipeResultUrl, extentTemp,timeTemp);
                }else if (typeTemp == "Age"){
                    layerType = 'pipe';
                    field = 'Result_' + typeTemp + '_' + timeTemp;
                    // where = drawClass.GetWhere('pipe', view);
                    // where+= " And Result_Flow_0 is not NULL "
                    // if(view.scale <= myScale[1])
                    // extentTemp=view.extent;
                    where = pipeDiameterWhere;
                    if(!branchPipesShow){
                        where += " and IsBranchPipes = 0 and Result_Flow_0 is not NULL"
                    }else{
                        where += " and Result_Flow_0 is not NULL";
                    }
                    drawPipe(field, where, urlClass.pipeResultUrl, extentTemp,timeTemp);
                }
                else if (typeTemp == "Flow" || typeTemp == "Velocity" || typeTemp == "Slop" || typeTemp == "SupplyArea" || typeTemp == "SupplyAreaCompare"|| typeTemp == "SupplyAreaNew"|| typeTemp == "SupplyAreaCompareNew") {
                    layerType = 'pipe';
                    if (typeTemp == "SupplyAreaCompare")
                        field = 'Result_SupplyArea' + '_' + timeTemp;
                    else if(typeTemp == "SupplyAreaNew"||typeTemp == "SupplyAreaCompareNew")
                        field = 'Result_SupplyArea' + '_New' + timeTemp;
                    else if(typeTemp == "Flow")
                        field = 'Result_AbsoluteFlow_'+ timeTemp;
                    else
                        field = 'Result_' + typeTemp + '_' + timeTemp;
                    // where = drawClass.GetWhere('pipe', view);
                    // where+= " And Result_Flow_0 is not NULL "
                    // if(view.scale <= myScale[1])
                    // extentTemp=view.extent;
                    where = pipeDiameterWhere;
                    where += " and Result_Flow_0 is not NULL";
                    drawPipe(field, where, urlClass.pipeResultUrl, extentTemp,timeTemp);
                    //LegendMain(typeTemp,'Result_'+typeTemp+'_');
                }
                else if (typeTemp == "Pressure" || typeTemp == 'HydraulicGrade' || typeTemp == "Demand") {
                    layerType = 'junction';
                    field = 'Result_' + typeTemp + '_' + timeTemp;
                    // where = drawClass.GetWhere('junction', view);
                    // if(view.scale <= myScale[1])
                    // extentTemp=view.extent;
                    where = pipeDiameterWhere;
                    drawJunctionPressure(field, where, urlClass.junctionResultUrl, extentTemp);
                    //LegendMain(typeTemp,'Result_'+typeTemp+'_');
                }
                else if (typeTemp == "Diameter" || typeTemp == "Material") {
                    layerType = 'pipe';
                    field = 'Physical_Pipe' + typeTemp;
                    // where = drawClass.GetWhere('pipe', view);
                    // if(view.scale <= myScale[1])
                    // extentTemp=view.extent;
                    where = pipeDiameterWhere;
                    drawPipe(field, where, urlClass.baseMapUrl + pipeLayerId, extentTemp,timeTemp);
                    //LegendMain(typeTemp,field);
                }
                else if (typeTemp == "PipeAge") {
                    layerType = 'pipe';
                    field = 'PipeAge';
                    // where = drawClass.GetWhere('pipe', view);
                    // if(view.scale <= myScale[1])
                    // extentTemp=view.extent;
                    where = pipeDiameterWhere;
                    drawPipe(field, where, urlClass.baseMapUrl + pipeLayerId, extentTemp,timeTemp);
                    //LegendMain(typeTemp,typeTemp);
                }
                else if (typeTemp == "PressureChange") {
                    layerType = 'junction';
                    //where = GetPressureChangeWhere();
                    // where = drawClass.GetWhere('junction', view);
                    // where+= " And Result_Pressure_0 is not NULL "
                    // if(view.scale <= myScale[1])
                    // extentTemp=view.extent;
                    where = pipeDiameterWhere;
                    where += " and Result_Pressure_0 is not NULL";
                    GetPressureChangeMaxMin(where,extentTemp);
                }
                else if (typeTemp == "FlowChangeCount") {
                    layerType = 'pipe';
                    // where = drawClass.GetWhere('pipe', view);
                    // where+= " And Result_Flow_0 is not NULL "
                    // if(view.scale <= myScale[1])
                    // extentTemp=view.extent;
                    where = pipeDiameterWhere;
                    where += " and Result_Flow_0 is not NULL";
                    drawPipeDirectionChange(field, where, urlClass.pipeResultUrl, extentTemp);
                }
                else if (typeTemp == "PipeStatus") {
                    field = 'Result_Status_' + timeTemp;
                    // where = drawClass.GetWhere('pipe', view);
                    where = pipeDiameterWhere;
                    where += (" and " + field + "=" + global.pipeStopWaterLimit);
                    drawPipe(field, where, urlClass.pipeResultUrl, extentTemp,timeTemp);
                }
                else if (typeTemp == "ValveUpdate") {
                    GetValveUpdate((startDate).year, (startDate).month+1, (startDate).date, (endDate).year, (endDate).month+1, (endDate).date);
                }
                drawLayerWhere = where;
            }
        }
        /**
         * 从后台服务中获取阀门动态的信息
         * @param {*} startYear 起始年份
         * @param {*} startMonth 起始月份
         * @param {*} startDay 起始天数
         * @param {*} endYear 终止年份
         * @param {*} endMonth 终止月份
         * @param {*} endDay 终止天数
         */
        function GetValveUpdate(startYear, startMonth, startDay, endYear, endMonth, endDay) {
            WindowsEvent.MyDispatchEvent("drawStart", '');
            axios.get(urlClass.axiosUrl + 'GetStatusChangeValve/' + startYear + '/' + startMonth + '/' + startDay + '/' + endYear + '/' + endMonth + '/' + endDay)
                .then(function (response) {
                    var objTemp = response.data;
                    DrawValveUpdate(objTemp);
                    WindowsEvent.MyDispatchEvent("drawEnd", '');
                })
        }
        /**
         * 绘制阀门动态的图标
         * @param {*} allData 查询返回的阀门动态的所有数据
         */
        function DrawValveUpdate(allData) {
            valveChangeLayer.removeAll();
            glSupplyAreaO.removeAll();
            for (var i = 0; i < allData.length; i++) {
                var obj = allData[i];
                var point = esriApi.Point(obj.X, obj.Y, new esriApi.SpatialReference({ wkid: global.spatialReference }));
                var pictureMarkerSymbol = new esriApi.PictureMarkerSymbol({ url: localStorage.getItem("imgPath")+'assets/valve_change.png', width: 13, height: 13});
                var gra1 = new esriApi.Graphic(point, pictureMarkerSymbol,obj);
                valveChangeLayer.add(gra1);
            }
        }

        /**
         * 获取查询压力波动的条件
         */
        function GetPressureChangeWhere() {
            var whereTemp = "NAN";
            for (var i = 0; i < myScale.length; i++) {
                if (i == 0) {
                    if (view.scale <= myScale[i]) {
                        whereTemp = 'NAN';
                    }
                }
                else if (i == myScale.length - 1) {
                    if (view.scale > myScale[i]) {
                        whereTemp = myDiameter[i];
                    }
                    else if (view.scale > myScale[i - 1] && view.scale <= myScale[i]) {
                        whereTemp = myDiameter[i - 1];
                    }
                }
                else {
                    if (view.scale > myScale[i - 1] && view.scale <= myScale[i]) {
                        whereTemp = myDiameter[i - 1];
                    }
                }
            }
            return whereTemp;
        }

        /**
         *查询节点函数
         * @param {*} fieldMy 属性字段
         * @param {*} whereMy 查询条件
         * @param {*} urlTemp 查询服务地址
         */
        function drawJunctionPressure(fieldMy, whereMy, urlTemp, extentTemp) {
            WindowsEvent.MyDispatchEvent("drawStart", '');
            query.geometry = extentTemp;
            query.where = whereMy;
            query.outFields = ["ElementId", fieldMy];
            field = fieldMy;
            // var queryTask = new esriApi.QueryTask(urlTemp);
            // queryTask.execute(query).then(DrawJunction, function(error){
            //     console.log(error);
            // });
            //采用 FeatureLayer 加载
            DrawJunction(null, urlTemp, whereMy, query.outFields);
        }
        function drawJunctionPressureChange(fieldMy, whereMy, urlTemp, extentTemp) {
            WindowsEvent.MyDispatchEvent("drawStart", '');
            query.geometry = extentTemp;
            query.where = whereMy;
            query.outFields = ["ElementId", "PressureChange"];
            field = fieldMy;
            // var queryTask = new esriApi.QueryTask(urlTemp);
            // queryTask.execute(query).then(DrawJunction, function(error){
            //     console.log(error);
            // });
            //采用 FeatureLayer 加载
            DrawJunction(null, urlTemp, whereMy, query.outFields);
        }

        function DrawJunction(re, urlTemp = null, whereMy = null, outFields = null) {
            gl.removeAll();
            glSupplyAreaO.removeAll();
            drawClass.JunctionPressure(re, selectTypeMain, isDisplays, gl, field, urlTemp, whereMy, outFields, view);
            WindowsEvent.MyDispatchEvent("drawEnd", '');
        }

        var LocationMarkerSymbol = new esriApi.PictureMarkerSymbol({ url: localStorage.getItem("imgPath")+'assets/colored-pins-red.png', width: 20, height: 41});
        var sourceMarkerSymbol = new esriApi.PictureMarkerSymbol({ url: localStorage.getItem("imgPath")+'assets/blackinfowin.png', width: 163, height: 49});
        var supplyPathSymbol = new esriApi.PictureMarkerSymbol({ url: localStorage.getItem("imgPath")+'assets/swf/Red_glow.swf', width: 50, height: 50});
        var greenMarkerSymbol = new esriApi.PictureMarkerSymbol({ url: localStorage.getItem("imgPath")+'assets/greenpin.png', width: 31, height: 37});
        /**
         *查询窗口下方表格中单行元素的定位信息
          * @param {*} whereMy 查询条件
          * @param {*} urlTemp 查询服务地址
         */
        function TableItemClickLocation(whereMy, urlTemp) {
            query.geometry = initExtent;
            query.where = whereMy;
            query.outFields = ["ElementId"];
            var queryTask = new esriApi.QueryTask(urlTemp);
            queryTask.execute(query).then(SelectLocationInfo, function(error){
                console.log(error);
            });
        }

        /**
         * 查询窗口下方表格中单行元素的定位信息(返回结果)
         * @param {*} re 查询返回参数
         */
        function SelectLocationInfo(re) {
            for (var i = 0; i < re.features.length; i++) {
                var feature = re.features[i];
                var geometeyTemp = feature.geometry;
                if (locationQueryUrlType == "junction" || locationQueryUrlType == "Customer") {
                    if (eventType == "SupplyPath") {
                        PositionSupplyPathNode(geometeyTemp, supplyPathLayer);
                    }
                    else if (eventType == "Diffusion") {
                        PositionSupplyPathNode(geometeyTemp, diffusionLayer);
                    }
                    else
                        PositionMy(geometeyTemp);
                }
                else if (locationQueryUrlType == "pipe") {
                    var path = geometeyTemp.paths;
                    var points = path[0];
                    var point1 = points[0];
                    var point2 = points[1];
                    var x = (Number(point1[0]) + Number(point2[0])) / 2;
                    var y = (Number(point1[1]) + Number(point2[1])) / 2;
                    var point = esriApi.Point(x, y, new esriApi.SpatialReference({ wkid: global.spatialReference }));
                    PositionMy(point);
                }
            }
        }

        /**
         * 往对应的坐标处扎针
         * @param {*} geometry 坐标
         */
        function PositionMy(geometry) {
            LocationGraphicsLayer.removeAll();
            var gra1 = drawClass.CreatePictureGraphic(PictureProperty.redPin, geometry)//new esriApi.Graphic(geometry, LocationMarkerSymbol);
            LocationGraphicsLayer.add(gra1);
            var point = geometry;
            // map.centerAt(point);
            view.center = point;
        }

        function PositionSupplyPathNode(geometry, layerTemp) {
            if (eventType != "Diffusion")
                layerTemp.removeAll();
            var point = esriApi.Point(geometry.x, geometry.y + 20, new esriApi.SpatialReference({ wkid: global.spatialReference }));
            var gra1 = drawClass.CreatePictureGraphic(PictureProperty.redPin, geometry)//new esriApi.Graphic(geometry, LocationMarkerSymbol);
            layerTemp.add(gra1);
        }

        /**
         * 查询管道函数
         * @param {*} fieldMy 属性字段
         * @param {*} whereMy 查询条件
         * @param {*} urlTemp 查询服务地址
         */
        function drawPipe(fieldMy, whereMy, urlTemp, extentTemp,timeTemp) {
            WindowsEvent.MyDispatchEvent("drawStart", '');
            field = fieldMy;
            query.geometry = extentTemp;
            query.where = whereMy;
            console.log('drawPipe',selectTypeMain)
            console.log('drawPipe',query.outFields)
            if (selectTypeMain != "Direction"){
                if(selectTypeMain!='SupplyArea'&&selectTypeMain!='SupplyAreaNew'){
                    query.outFields = ["ElementId", fieldMy];
                }
                else if(selectTypeMain=='SupplyArea'){
                    query.outFields = ["ElementId", fieldMy,'Result_SupplyArea_' + timeTemp];
                }
                else if(selectTypeMain=='SupplyAreaNew'){
                    query.outFields = ["ElementId", fieldMy,'Result_SupplyArea_New' + timeTemp];
                }
                //采用 FeatureLayer 加载
                DrawPipe(null, urlTemp, whereMy, query.outFields);
            }
            else{
                query.outFields = ["ElementId", "Physical_PipeDiameter", "HMIGeometryScaledLength", 'Result_Flow_' + timeTemp];
                query.geometry = view.extent;
                var queryTask = new esriApi.QueryTask(urlTemp);
                queryTask.execute(query).then(DrawPipe, function(error){
                    console.log(error);
                });
            }
            // var queryTask = new esriApi.QueryTask(urlTemp);
            // queryTask.execute(query).then(DrawPipe, function(error){
            //     console.log(error);
            // });
        }

        function QueryCoustomer(){
            if(CustomerData.length > 0){
                initLayer(CustomerData);
                return;
            }
            query.geometry = view.extent;
            query.where = "1=1";
            query.outFields = ["ElementId","户名","用户号","地址","用水性质","月用水量","分公司"];
            var queryTask = new esriApi.QueryTask(urlClass.customerUrl);
            // queryTask.execute(query, QueryCoustomerReturn);
            queryTask.execute(query).then(QueryCoustomerReturn, function(error){
                console.log(error);
            });
        }

        function QueryCoustomerReturn(re){
            CustomerData = [];
            for(var i=0;i<re.features.length;i++){
                var obj = re.features[i];
                var object = new Object();
                object.x = obj.geometry.x;
                object.y = obj.geometry.y;
                object.name = obj.attributes.户名;
                object.number = obj.attributes.用户号;
                object.addr = obj.attributes.地址;
                object.nature = obj.attributes.用水性质;
                object.demand = obj.attributes.月用水量;
                object.company = obj.attributes.分公司;
                CustomerData.push(object);
            }
            if(CustomerData.length > 0){
                initLayer(CustomerData);
            }
        }

        var CustomerData = [];
        var clusterLayer = null;
        var preClustered = false;
        var displaySingleFlaresAtCount = 10;
        function initLayer(data) {
            if(!clusterLayer)
                map.remove(clusterLayer);
            DataManager.setData(data);

            var defaultSym = new esriApi.SimpleMarkerSymbol({size: 6, color: "#FF0000", outline: null});

            var renderer = new esriApi.ClassBreaksRenderer({defaultSymbol: defaultSym});
            renderer.field = "clusterCount";

            var smSymbol = new esriApi.SimpleMarkerSymbol({ size: 22, outline: new esriApi.SimpleLineSymbol({ color: [221, 159, 34, 0.8] }), color: [255, 204, 102, 0.8] });
            var mdSymbol = new esriApi.SimpleMarkerSymbol({ size: 24, outline: new esriApi.SimpleLineSymbol({ color: [82, 163, 204, 0.8] }), color: [102, 204, 255, 0.8] });
            var lgSymbol = new esriApi.SimpleMarkerSymbol({ size: 28, outline: new esriApi.SimpleLineSymbol({ color: [41, 163, 41, 0.8] }), color: [51, 204, 51, 0.8] });
            var xlSymbol = new esriApi.SimpleMarkerSymbol({ size: 32, outline: new esriApi.SimpleLineSymbol({ color: [200, 52, 59, 0.8] }), color: [250, 65, 74, 0.8] });

            renderer.addClassBreakInfo(0, 19, smSymbol);
            renderer.addClassBreakInfo(20, 150, mdSymbol);
            renderer.addClassBreakInfo(151, 1000, lgSymbol);
            renderer.addClassBreakInfo(1001, Infinity, xlSymbol);

            var areaRenderer;
            var defaultAreaSym = new esriApi.SimpleFillSymbol({style: "solid",color: [0, 0, 0, 0.2],outline: new esriApi.SimpleLineSymbol({ color: [0, 0, 0, 0.3] })});

            areaRenderer = new esriApi.ClassBreaksRenderer({defaultSymbol: defaultAreaSym});
            areaRenderer.field = "clusterCount";

            var smAreaSymbol = new esriApi.SimpleFillSymbol({ color: [255, 204, 102, 0.4], outline: new esriApi.SimpleLineSymbol({ color: [221, 159, 34, 0.8], style: "dash" }) });
            var mdAreaSymbol = new esriApi.SimpleFillSymbol({ color: [102, 204, 255, 0.4], outline: new esriApi.SimpleLineSymbol({ color: [82, 163, 204, 0.8], style: "dash" }) });
            var lgAreaSymbol = new esriApi.SimpleFillSymbol({ color: [51, 204, 51, 0.4], outline: new esriApi.SimpleLineSymbol({ color: [41, 163, 41, 0.8], style: "dash" }) });
            var xlAreaSymbol = new esriApi.SimpleFillSymbol({ color: [250, 65, 74, 0.4], outline: new esriApi.SimpleLineSymbol({ color: [200, 52, 59, 0.8], style: "dash" }) });

            areaRenderer.addClassBreakInfo(0, 19, smAreaSymbol);
            areaRenderer.addClassBreakInfo(20, 150, mdAreaSymbol);
            areaRenderer.addClassBreakInfo(151, 1000, lgAreaSymbol);
            areaRenderer.addClassBreakInfo(1001, Infinity, xlAreaSymbol);

            var flareRenderer = new esriApi.ClassBreaksRenderer({ defaultSymbol: renderer.defaultSymbol});
            flareRenderer.field = "clusterCount";

            var smFlareSymbol = new esriApi.SimpleMarkerSymbol({ size: 14, color: [255, 204, 102, 0.8], outline: new esriApi.SimpleLineSymbol({ color: [221, 159, 34, 0.8] }) });
            var mdFlareSymbol = new esriApi.SimpleMarkerSymbol({ size: 14, color: [102, 204, 255, 0.8], outline: new esriApi.SimpleLineSymbol({ color: [82, 163, 204, 0.8] }) });
            var lgFlareSymbol = new esriApi.SimpleMarkerSymbol({ size: 14, color: [51, 204, 51, 0.8], outline: new esriApi.SimpleLineSymbol({ color: [41, 163, 41, 0.8] }) });
            var xlFlareSymbol = new esriApi.SimpleMarkerSymbol({ size: 14, color: [250, 65, 74, 0.8], outline: new esriApi.SimpleLineSymbol({ color: [200, 52, 59, 0.8] }) });

            flareRenderer.addClassBreakInfo(0, 19, smFlareSymbol);
            flareRenderer.addClassBreakInfo(20, 150, mdFlareSymbol);
            flareRenderer.addClassBreakInfo(151, 1000, lgFlareSymbol);
            flareRenderer.addClassBreakInfo(1001, Infinity, xlFlareSymbol);

            var popupTemplate = new esriApi.PopupTemplate({
                title: "用户属性",
                content: [{
                    type: "fields",
                    fieldInfos: [
                        { fieldName: "name", label: "用户名", visible: true },
                        { fieldName: "number", label: "用户号", visible: true },
                        { fieldName: "addr", label: "地址", visible: true },
                        { fieldName: "nature", label: "用水性质", visible: true },
                        { fieldName: "demand", label: "月水量", visible: true },
                        { fieldName: "company", label: "分公司", visible: true },
                    ]
                }]
            });
            var options = {
                id: "flare-cluster-layer",
                clusterRenderer: renderer,
                areaRenderer: areaRenderer,
                flareRenderer: flareRenderer,
                singlePopupTemplate: popupTemplate,
                spatialReference: new esriApi.SpatialReference({ "wkid": global.spatialReference }),
                subTypeFlareProperty: "nature",
                singleFlareTooltipProperty: "name",
                displaySubTypeFlares: true,
                maxSingleFlareCount: 8,
                clusterRatio: 200,
                clusterToScale: 10000,
                clusterAreaDisplay: "activated",
                isRect: false,
                data: data
            }
            clusterLayer = new esriApi.fcl.FlareClusterLayer(options);
            map.add(clusterLayer);

            clusterLayer.on("draw-complete", function () {
                console.log("clustering complete");
            });

            // map.infoWindow.titleInBody = false;
            // map.add(clusterLayer);
            // //get the first set of data
            // if (preClustered) {
            //     getPreClusteredGraphics();
            // }
            // else {
            //     //not preclustered - just add the raw data to be clusted within the layer.
            //     var data = DataManager.getData();
            //     // clusterLayer.addData(data);
            //     clusterLayer.setData(data);
            // }
            // popupCustomer();
        }

        function DrawCustomer(dataTemp){
            var layerDefinition1 = {
                "geometryType": "esriGeometryPoint",
                "fields": [{
                    "name": "ID",
                    "type": "esriFieldTypeInteger",
                    "alias": "ID"
                }]
            }
            var featureCollection1 = {
                layerDefinition: layerDefinition1,
                featureSet: null
            };
            var featureLayer1 = new esriApi.FeatureLayer(featureCollection1, {
                mode: esriApi.FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"],
                opacity: 1
            });
            var data = new Array();
            featureLayer.setFeatureReduction({
                type: "cluster",
                clusterRadius: 200
            });
            var red = new esriApi.SimpleMarkerSymbol({size: 16, color: new esriApi.Color("#ff0000"), outline: null});
            var blue = new esriApi.SimpleMarkerSymbol({size: 14, color: new esriApi.Color("#0000ff"), outline: null});
            var green = new esriApi.SimpleMarkerSymbol({size: 16, color: new esriApi.Color("#00ff00"), outline: null});
            for (var i = 0; i < dataTemp.features.length; i++) {//遍历查询的图层结果集合,构造聚合效果的数据源
                if(i==0)
                var info = {};
                var latlng = dataTemp.features[i].geometry;
                var webMercator =  esriApi.geographicToWebMercator(latlng);//地理坐标系必须要转换摩卡托的投影坐标系,不然聚合没效果
                info.x = webMercator.x;
                info.y = webMercator.y;
                info.attributes = dataTemp.features[i].attributes;//气泡窗口模型的属性
                data.push(info);
                var point = new esriApi.Point(Number(latlng.x), Number(latlng.y),
                new esriApi.SpatialReference({wkid: global.spatialReference}));

                featureLayer.add(new esriApi.Graphic(point,blue,info.attributes));
            }
             // cluster layer that uses OpenLayers style clustering
             /* var clusterLayer = new ClusterLayer({
                "data": data,
                "distance": 100,
                "id": "clusters",
                "labelColor": "#fff",
                "labelOffset": 10,
                "resolution": view.extent.getWidth() / map.width,
                "singleColor": "#888",
              }); */

              var renderer = new esriApi.ClassBreaksRenderer(blue, "ElementId");

              renderer.addBreak(0, 5, red);
              renderer.addBreak(5, 10, green);
              renderer.addBreak(10, 14, blue);
              featureLayer.setRenderer(renderer);
              //map.add(featureLayer1);
        }


        var drawDirectionData = "";

        function DrawPipe(re, urlTemp = null, whereMy = null, outFields = null) {
            console.log('DrawPipe',re)
            gl.removeAll();
            var isDisplayTemp = new Array();
            if (selectTypeMain != "Direction") {
                // isDisplayTemp = drawClass.pipeFlow(re, selectTypeMain, isDisplays, field, gl, urlTemp, whereMy, outFields, view);
                //api4.x 注释 需要调整
                // if(selectTypeMain=="Age" && (!branchPipesShow)&&(branchPipes.length!=0)){
                //     isDisplayTemp = drawClass.DrawPipeAge(re, branchPipes, isDisplays, field, gl, urlTemp, whereMy, outFields, view);
                // }else{
                    isDisplayTemp = drawClass.pipeFlow(re, selectTypeMain, isDisplays, field, gl, urlTemp, whereMy, outFields, view);
                // }

                if (isDisplays.length == 0)
                    isDisplays = isDisplayTemp.slice(0);
            }
            else {
                var features = re.features;
                var idList = [];
                for(var i=0;i<features.length;i++){
                    var obj = features[i];
                    idList.push(obj.attributes.ElementId);
                }
                glSupplyAreaO.removeAll();
                gl.removeAll();
                drawDirectionData = re;
                if(isActive)
                DrawDirectionMain(idList);
                else{
                    var conditional = drawClassFlowDirection.GetConditionalByScale(view.scale);
                    drawClassFlowDirection.DrawStaticPipeFlowDirection(re, gl, view, 'Result_Flow_' + global.time, conditional);
                }
                
                /* gl.removeAll();
                drawDirectionData = re;
                var conditional = drawClassFlowDirection.GetConditionalByScale(view.scale);
                console.log(conditional)
                if(isActive)
                drawClassFlowDirection.DrawPipeFlowDirection(re, gl, view, 'Result_Flow_' + global.time, conditional);
                else
                drawClassFlowDirection.DrawStaticPipeFlowDirection(re, gl, view, 'Result_Flow_' + global.time, conditional); */
            }

            WindowsEvent.MyDispatchEvent("drawEnd", '');
        }

        /**
         * 查询管道24小时流向变化函数
         * @param {*} fieldMy 属性字段
         * @param {*} whereMy 查询条件
         * @param {*} urlTemp 查询服务地址
         */
        function drawPipeDirectionChange(fieldMy, whereMy, urlTemp, extentTemp) {
            WindowsEvent.MyDispatchEvent("drawStart", '');
            query.geometry = extentTemp;
            query.where = whereMy;
            var fieldTemp = new Array();
           /*  for (var i = 0; i < 24; i++) {
                var fieldTempOnly = "Direction_Change_" + i.toString();
                fieldTemp.push(fieldTempOnly);
                fieldTempOnly = "Result_Flow_" + i.toString();
                fieldTemp.push(fieldTempOnly);
            }
            query.outFields = fieldTemp; */
            query.outFields = ["ElementId", "DirectionChange"]
            field = fieldMy;
            // var queryTask = new esriApi.QueryTask(urlTemp);
            // queryTask.execute(query).then(DrawPipe, function(error){
            //     console.log(error);
            // });
            //采用 FeatureLayer 加载
            DrawPipe(null, urlTemp, whereMy, query.outFields);
        }


        /**
         * 管道基础属性画图的主函数
         * @param {*} re 查询返回的对象
         * @param {*} limits 分级
         * @param {*} colors 颜色分级
         * @param {*} widths 线的宽度
         * @param {*} typeTemp 类型
         */
        /*       function DrawPipePhysicalMain(re,limits,colors,widths,typeTemp,isDisplaysTemp){
                 for(var i=0;i<re.features.length;i++){
                     var feature = re.features[i];
                     var attribute = feature.attributes[field];
                     DrawMainPipePhysicalMain(feature.geometry,attribute,limits,colors,widths,i,isDisplaysTemp);
                 }
             } */

        function DrawSupplyAreaCompare(changeData, limits, colors, widths, isDisplaysTemp) {
            for (var i = 0; i < changeData.length; i++) {
                var feature = changeData[i];
                var attribute = feature.SupplyAreaIdO;
                var path = new Array();
                var pointTemp;
                for (var j = 0; j < feature.Coordinate.length; j++) {
                    var objTemp = feature.Coordinate[j];
                    var pathTemp = new Array();
                    pathTemp.push(objTemp.X)
                    pathTemp.push(objTemp.Y)
                    path.push(pathTemp);
                    pointTemp = point;
                }
                var pathMain = new Array();
                pathMain.push(path);
                var line = new esriApi.Polyline({
                    "paths": [],
                    "spatialReference": { "wkid": global.spatialReference }
                });
                line.paths = pathMain;
                drawClass.DrawMainPipePhysicalMain(line, attribute, limits, colors, widths, isDisplaysTemp, gl);
            }
        }

        function GetLegendPIpeLengthData(legendData) {
            console.log('GetLegendPIpeLengthData',JSON.stringify(legendData))
            console.log('接口开始时间:',new Date());
            var urlTemp = urlClass.axiosUrl + "LegendGetPipeLength";
            axios.post(
                urlTemp,
                JSON.stringify(legendData),
                { headers: { 'Content-Type': 'application/json;' } }
            )
                .then(GetLegendPipeLengthDataReturn)
        }

        var legendPipeLengthData;

        var allPipeLength = 0;
        var allPipeLengthPipe = 0;
        function GetLegendDisplayData(legendPipeLengthData, type) {
            var obj = new Object();
            var legendList = new Array();
            var allPipeLengthTemp = 0;
            for (var i = 0; i < legendPipeLengthData.length; i++) {
                var temp = legendPipeLengthData[i];
                var legendItem = new Object();
                legendItem.color = colorLegend[i];
                legendItem.labelDisplayContent = temp.Label;
                legendItem.pipeLengthContent = (Number(temp.PipeLength)).toFixed(2);
                legendItem.ratioContent = temp.Ratio;
                legendItem.isDisplay = isDisplays[i];
                legendItem.itemType = itemType;
                legendItem.index = i;
                legendItem.labelId = labelsAll[i].LabelId;
                if (i == legendPipeLengthData.length - 1)
                    legendItem.lineDisplay = false;
                else
                    legendItem.lineDisplay = true;
                legendList.push(legendItem);
                allPipeLengthTemp += Number(temp.PipeLength);
            }
            obj.legendList = legendList;
            obj.AllPipelength = allPipeLengthTemp;
            return obj;
        }
        var limitsMain = [];
        var legendAllDataTemp = new Object();
        function GetLegendPipeLengthDataReturn(response) {
            console.log('接口结束时间:',new Date());
            legendPipeLengthData = response.data;
            var myEventTemp = new CustomEvent('event_name', {
                detail: { type: 'This is title!' },
            });
            myEventTemp.detail.type = "LegendDisplay";
            var legendList = new Array();
            var legendAllData = new Object();
            var tempObj = new Object();
            tempObj = GetLegendDisplayData(legendPipeLengthData, selectTypeMain)
            legendList = tempObj.legendList;
            if(selectTypeMain=="SupplyAreaCompare")
                tempObj.AllPipelength = 0;
            allPipeLength = tempObj.AllPipelength;
            legendAllData.title = titleName;
            legendAllData.legendName = legendName;
            legendAllData.allIsDisplay = allLegendDisplay;//图例控制是否全部显示
            legendAllData.listData = legendList;
            legendAllData.allPipeLength = Number(allPipeLength).toFixed(2);
            legendAllData.maxValue = maxMain;
            legendAllData.minValue = minMain;
            legendAllData.maxCheckedIsDisplay = maxMain != "" ? true : false;
            legendAllData.minCheckedIsDisplay = minMain != "" ? true : false;
            legendAllData.maxChecked = false;
            legendAllData.minChecked = false;
            legendAllData.isCompareType = isCompare ? compreType : "";
            legendAllData.compareUpCheck = true;
            legendAllData.compareDownCheck = true;
            legendAllData.compareUpPipeFlowCheck = true;
            legendAllData.compareDownPipeFlowCheck = true;
            legendAllData.compareUpPipeVelocityCheck = true;
            legendAllData.compareDownPipeVelocityCheck = true;
            legendAllData.limits = limitsMain;//图例修改
            //模拟计算管道图例的数据
            legendAllData.listDataPipe = planCalTempFlowLegendList;
            legendAllData.allPipeLengthPipe = Number(allPipeLengthPipe).toFixed(2);
            legendAllData.legendNamePipe = "流量变化(m³/h)";

            legendAllData.listDataPipeVelocity = planCalTempVelocityLegendList;
            legendAllData.allPipeVelocityLengthPipe = Number(allPipeLengthPipeVelocity).toFixed(2);
            legendAllData.legendNameVelocity = "流速变化(m/s)";
            legendAllData.opType = true;
            if (EventTypeMain == "PlanTempCalculate")
                legendAllData.type = "planCal";
            else
                legendAllData.type = "";
            legendAllDataTemp = legendAllData;
            myEventTemp.detail.data = legendAllData;
            if (window.dispatchEvent) {
                window.dispatchEvent(myEventTemp);
            } else {
                window.fireEvent(myEventTemp);
            }
        }

        function UpdateLegendData(initData, allIsDisplayTemp) {
            var listDataTemp = initData.listData;
            var returnListTemp = new Array();
            for (var i = 0; i < listDataTemp.length; i++) {
                var temp = listDataTemp[i];
                temp.isDisplay = allIsDisplayTemp;
                returnListTemp.push(temp);
                isDisplays[i] = allIsDisplayTemp;
            }
            initData.listData = returnListTemp;
            var myEventTemp = new CustomEvent('event_name', {
                detail: { type: 'This is title!' },
            });
            myEventTemp.detail.type = "LegendDisplay";
            myEventTemp.detail.data = initData;
            if (window.dispatchEvent) {
                window.dispatchEvent(myEventTemp);
            } else {
                window.fireEvent(myEventTemp);
            }
        }

        function GetLegendLabelsMain(type, limitsMyTemp, labelsParameter) {
            var labels = new Array();
            if (isCompare && selectTypeMain != "SupplyAreaCompare" && selectTypeMain != "SupplyAreaCompareNew") {
                labels = GetLegendPressureChangeLabels(limitsMyTemp)
            }
            else if (type == "Flow" || type == "Velocity" || type == "Slop" || type == "Age" || type == "Pressure" || type == "HydraulicGrade" || type == "Demand" || type == "Diameter" )
                labels = GetLegendLabels(limitsMyTemp)
            else if (type == "SupplyArea" || type == "Material" || type == "SupplyAreaCompare"||type == "SupplyAreaNew"|| type == "SupplyAreaCompareNew")
                labels = GetLegendLabelsPhysical(limitsMyTemp, labelsParameter)
            else if (type == "PressureChange" || type == "PlanCalTemp")
                labels = GetLegendPressureChangeLabels(limitsMyTemp)
            else if (type == "PipeAge")
                labels = GetLegendLabelsPipeAge(limitsMyTemp)
            else if(type == "FlowChangeCount")
                labels = GetLegendFlowChangeLabels(limitsMyTemp);
            return labels;
        }

        var titleName = "";
        var legendName = "";
        var colorLegend = new Array();
        var isDisplays = new Array();
        var planCalPipeFlowIsDisplays = new Array();
        var planCalPipeVelocityIsDisplays = new Array();
        var labelsAll = new Array();
        function GetLegendLabels(limits) {
            var labels = new Array();
            for (var i = 0; i < limits.length; i++) {
                var labelTemp = "";
                if (i == 0)
                    labelTemp = ("<" + String(limits[i]));
                else
                    labelTemp = (String(limits[i - 1]) + "-" + String(limits[i]));
                var obj = new Object();
                obj.Label = labelTemp;
                obj.LabelId = labelTemp;
                labels.push(obj);
            }
            var labelTemp = (">" + String(limits[limits.length - 1]));
            var obj = new Object();
            obj.Label = labelTemp;
            obj.LabelId = labelTemp;
            labels.push(obj);
            return labels;
        }
        function GetLegendFlowChangeLabels(limits) {
            var labels = new Array();
            for (var i = 0; i < limits.length+1; i++) {
                var isAdd = false;
                var labelTemp = "";
                if (i == 0){
                    isAdd = true;
                    labelTemp = (String(limits[i]));
                }
                else if(i+1<limits.length&&i%2!=0){
                    isAdd = true;
                    labelTemp = (String(limits[i]) + "-" + String(limits[i+1]));
                }
                else if(i==limits.length){
                    isAdd = true;
                    labelTemp = ('>'+String(limits[limits.length-1]));
                }
                if(isAdd){
                    var obj = new Object();
                    obj.Label = labelTemp;
                    obj.LabelId = labelTemp;
                    labels.push(obj);
                }
                
            }
            return labels;
        }

        function GetLegendLabelsPipeAge(limits) {
            var labels = new Array();
            for (var i = 0; i < limits.length - 1; i++) {
                var labelTemp = "";
                if (i == 0)
                    labelTemp = ("<" + String(limits[i]));
                else
                    labelTemp = (String(limits[i - 1]) + "-" + String(limits[i]));
                var obj = new Object();
                obj.Label = labelTemp;
                obj.LabelId = labelTemp;
                labels.push(obj);
            }
            var labelTemp = (">" + String(limits[limits.length - 2]));
            var obj = new Object();
            obj.Label = labelTemp;
            obj.LabelId = labelTemp;
            labels.push(obj);
            var labelTemp1 = (String(limits[limits.length - 1]));
            var obj1 = new Object();
            obj1.Label = labelTemp1;
            obj1.LabelId = "";
            labels.push(obj1);
            return labels;
        }

        function GetLegendPressureChangeLabels(limits) {

            var labels = new Array();
            for (var i = 0; i < limits.length - 1; i++) {
                var labelTemp = "";
                labelTemp = (String(limits[i]) + "-" + String(limits[i + 1]));
                var obj = new Object();
                obj.Label = labelTemp;
                obj.LabelId = labelTemp;
                labels.push(obj);
            }
            return labels;
        }

        function GetLegendLabelsPhysical(limits, labelsParameter) {
            var labels = new Array();
            for (var i = 0; i < limits.length; i++) {
                var labelTemp = "";
                labelTemp = String(limits[i]);
                var obj = new Object();
                obj.Label = labelsParameter[i];
                obj.LabelId = labelTemp;
                labels.push(obj);
            }
            return labels;
        }

        

        function ClassifyFunction(type) {
            var tempLimit = new Array();
            var labelTemp = new Array();
            if (type == "Flow") {
                labelTemp = pipeFlowLimit;
                tempLimit = pipeFlowLimit;
                colorLegend = pipeFlowColor;
                if (isDisplays.length == 0)
                    isDisplays = pipeFlowIsDisplay.slice(0)
                titleName = "管道流量";
                legendName = "流量分级(m³/h)";
                if (isCompare) {
                    labelTemp = pressureChangLimit;
                    tempLimit = pressureChangLimit;
                    colorLegend = pressureChangColor;
                    if (isDisplays.length == 0)
                        isDisplays = pressureChangeIsDisplay.slice(0)
                    titleName = "流量对比";
                    legendName = "流量变化(m³/h)";
                    compreType = "ComparePipe";
                }

            }
            else if (type == "Velocity")//typeTemp=="Velocity"||typeTemp=="Slop"||typeTemp=="Age"||typeTemp=="SupplyArea"
            {
                labelTemp = pipeVelocityLimit;
                tempLimit = pipeVelocityLimit;
                colorLegend = pipeVelocityColor;
                if (isDisplays.length == 0)
                    isDisplays = pipeVelocityIsDisplay.slice(0);
                titleName = "管道流速";
                legendName = "流速分级(m/s)";
                if (isCompare) {
                    labelTemp = pressureChangLimit;
                    tempLimit = pressureChangLimit;
                    colorLegend = pressureChangColor;
                    if (isDisplays.length == 0)
                        isDisplays = pressureChangeIsDisplay.slice(0)
                    titleName = "流速对比";
                    legendName = "流速变化(m/h)";
                    compreType = "ComparePipe";
                }
            }
            else if (type == "Slop") {
                labelTemp = pipeSlopLimit;
                tempLimit = pipeSlopLimit;
                colorLegend = pipeSlopColor;
                if (isDisplays.length == 0)
                    isDisplays = pipeSlopIsDisplay.slice(0);
                titleName = "管道水力坡度";
                legendName = "水力坡度分级(1/1000)";
                if (isCompare) {
                    labelTemp = pressureChangLimit;
                    tempLimit = pressureChangLimit;
                    colorLegend = pressureChangColor;
                    if (isDisplays.length == 0)
                        isDisplays = pressureChangeIsDisplay.slice(0)
                    titleName = "水力坡度对比";
                    legendName = "水力坡度变化(1/1000)";
                    compreType = "ComparePipe";
                }
            }
            else if (type == "Age") {
                labelTemp = ageLimit;
                tempLimit = ageLimit;
                colorLegend = ageColor;
                if (isDisplays.length == 0)
                    isDisplays = ageIsDisplay.slice(0);
                titleName = "管道水龄";
                legendName = "水龄分级(h)";
                if (isCompare) {
                    labelTemp = pressureChangLimit;
                    tempLimit = pressureChangLimit;
                    colorLegend = pressureChangColor;
                    if (isDisplays.length == 0)
                        isDisplays = pressureChangeIsDisplay.slice(0)
                    titleName = "水龄对比";
                    legendName = "水龄变化(1/1000)";
                    compreType = "ComparePipe";
                }
            }
            else if (type == "SupplyArea" || type == "SupplyAreaCompare") {
                labelTemp = pipeSupplyAreaLabels;
                tempLimit = pipeSupplyAreaLimit;
                colorLegend = pipeSupplyAreaColor;
                if (isDisplays.length == 0)
                    isDisplays = pipeSupplyAreaIsDisplay.slice(0);
                titleName = "供水分界线";
                legendName = "供水区域";
                if (isCompare) {
                    labelTemp = pipeSupplyAreaLabels;
                    tempLimit = pipeSupplyAreaLimit;
                    colorLegend = pipeSupplyAreaColor;
                    titleName = "供水区域对比";
                    legendName = "供水区域";
                    compreType = "CompareSupplyArea";
                    if (isDisplays.length == 0)
                        isDisplays = pipeSupplyAreaIsDisplay.slice(0);
                }
            }
            else if (type == "SupplyAreaNew"|| type == "SupplyAreaCompareNew") {
                labelTemp = global.pipeSupplyAreaNewLabels;
                tempLimit = global.pipeSupplyAreaNewLimit;
                colorLegend = global.pipeSupplyAreaNewColor;
                if (isDisplays.length == 0)
                    isDisplays = global.pipeSupplyAreaNewIsDisplay.slice(0);
                titleName = "供水分界线";
                legendName = "供水区域";
                if (isCompare) {
                    labelTemp = global.pipeSupplyAreaNewLabels;
                    tempLimit = global.pipeSupplyAreaNewLimit;
                    colorLegend = global.pipeSupplyAreaNewColor;
                    titleName = "供水区域对比";
                    legendName = "供水区域";
                    compreType = "CompareSupplyAreaNew";
                    if (isDisplays.length == 0)
                        isDisplays = global.pipeSupplyAreaNewIsDisplay.slice(0);
                }
            }
            else if (type == "Pressure") {
                labelTemp = pressureLimit;
                tempLimit = pressureLimit;
                colorLegend = pressureColor;
                if (isDisplays.length == 0)
                    isDisplays = pressureIsDisplay.slice(0)
                titleName = "节点压力";
                legendName = "压力分级(m)";
                if (isCompare) {
                    labelTemp = pressureChangLimit;
                    tempLimit = pressureChangLimit;
                    colorLegend = pressureChangColor;
                    if (isDisplays.length == 0)
                        isDisplays = pressureChangeIsDisplay.slice(0)
                    titleName = "压力对比";
                    legendName = "压力变化(m)";
                    compreType = "CompareNode";
                }
            }
            else if (type == "HydraulicGrade") {
                labelTemp = headLimit;
                tempLimit = headLimit;
                colorLegend = headColor;
                if (isDisplays.length == 0)
                    isDisplays = headIsDisplay.slice(0)
                titleName = "水压标高";
                legendName = "水压标高分级(m)";
                if (isCompare) {
                    labelTemp = pressureChangLimit;
                    tempLimit = pressureChangLimit;
                    colorLegend = pressureChangColor;
                    if (isDisplays.length == 0)
                        isDisplays = pressureChangeIsDisplay.slice(0)
                    titleName = "水压标高对比";
                    legendName = "水力坡度变化(m)";
                    compreType = "CompareNode";
                }
            }
            else if (type == "Demand") {
                labelTemp = demandLimit;
                tempLimit = demandLimit;
                colorLegend = demandColor;
                if (isDisplays.length == 0)
                    isDisplays = demandIsDisplay.slice(0)
                titleName = "节点流量";
                legendName = "节点流量(m³/h)";
                if (isCompare) {
                    labelTemp = pressureChangLimit;
                    tempLimit = pressureChangLimit;
                    colorLegend = pressureChangColor;
                    if (isDisplays.length == 0)
                        isDisplays = pressureChangeIsDisplay.slice(0)
                    titleName = "节点流量对比";
                    legendName = "流量变化(m³/h)";
                    compreType = "CompareNode";
                }
            }
            else if (type == "Diameter") {
                labelTemp = pipeDiameterLimit;
                tempLimit = pipeDiameterLimit;
                colorLegend = pipeDiameterColor;
                if (isDisplays.length == 0)
                    isDisplays = pipeDiameterIsDisplay.slice(0)
                titleName = "管径";
                legendName = "管径分级(mm)";
            }
            else if (type == "Material") {
                labelTemp = pipeMaterialLimit;
                tempLimit = pipeMaterialLimit;
                colorLegend = pipeMaterialColor;
                if (isDisplays.length == 0)
                    isDisplays = pipeMaterialIsDisplay.slice(0);
                titleName = "管材";
                legendName = "管材分级";
            }
           /*  else if (type == "Diffusion") {
                labelTemp = global.diffusionLimit;
                tempLimit = global.diffusionLimit;
                colorLegend = global.diffusionColor;
                if (isDisplays.length == 0)
                    isDisplays = global.diffusionIsDisplay.slice(0);
                titleName = "扩散分析";
                legendName = "时间分级(小时)";
            } */
            else if (type == "PipeAge") {
                labelTemp = pipeAgeLimit;
                tempLimit = pipeAgeLimit;
                colorLegend = pipeAgeColor;
                if (isDisplays.length == 0)
                    isDisplays = pipeAgeIsDisplay.slice(0);
                titleName = "管龄";
                legendName = "管龄分级(年)";
            }
            else if (type == "PressureChange") {
                labelTemp = pressureChangLimit;
                tempLimit = pressureChangLimit;
                colorLegend = pressureChangColor;
                if (isDisplays.length == 0)
                    isDisplays = pressureChangeIsDisplay.slice(0)
                titleName = "24小时压力波动";
                legendName = "压力变化(m)";
            }
            else if (type == "FlowChangeCount") {
                labelTemp = directionChangeLimit;
                tempLimit = directionChangeLimit;
                colorLegend = directionChangeColor;
                if (isDisplays.length == 0)
                    isDisplays = directionChangeIsDisplay.slice(0)
                titleName = "24小时流向变化次数";
                legendName = "流向变化次数(次)";
            }
            else if (type == "PlanCalTemp") {
                labelTemp = pressureChangLimit;
                tempLimit = pressureChangLimit;
                colorLegend = pressureChangColor;
                if (isDisplays.length == 0)
                    isDisplays = pressureChangeIsDisplay.slice(0)
                titleName = "模拟计算";
                legendName = "压力变化(m)";
            }
            /*  if(!allLegendDisplay)
             {
                 isDisplays = new Array();
                 for(var i=0;i<colorLegend.length;i++)
                 {
                     isDisplays.push(false);
                 }
             } */
            else if (isAllDisplay && allLegendDisplay) {
                isDisplays = new Array();
                for (var i = 0; i < colorLegend.length; i++) {
                    isDisplays.push(true);
                }
            }
            var object = new Object();
            object.labelId = tempLimit;
            object.labels = labelTemp;
            return object;
        }
        function ClassifyLabelsFunction(type) {
            var labels = new Array();
            if (type == "SupplyArea") {
                labels = pipeSupplyAreaLabels;
            }
            else if (type == "Flow") {
                labels = pipeFlowLimit;
            }
            else if (type == "Velocity") {
                labels = pipeVelocityLimit;
            }
            else if (type == "Slop") {
                labels = pipeSlopLimit;
            }
            else if (type == "Age") {
                labels = ageLimit;
            }
            return labels;
        }

        function LegendMain(type, fieldTemp) {
            console.log("LegendMain开始时间:",new Date())
            if (EventTypeMain == "Diffusion") 
            return;
            var legendData = {
            }
            var labels = new Array();
            var tempLimit = new Array();
            var labelsParameter = new Array();
            var object = new Object();
            object = ClassifyFunction(type);
            tempLimit = object.labelId;
            labelsParameter = object.labels;//ClassifyLabelsFunction(type);
            labels = GetLegendLabelsMain(type, tempLimit, labelsParameter)
            labelsAll = labels;
            limitsMain = tempLimit;
            legendData.ListLegend = labels;
            legendData.Type = isCompare ? compreType : type;
            legendData.Big = "true";
            legendData.Small = "true";
            legendData.Field = EventTypeMain == "PlanTempCalculate" ? "PlanCalTemp" : fieldTemp;
            legendData.Time1 = isCompare ? timeMyMain1 : global.time;
            legendData.Time2 = isCompare ? timeMyMain2 : "";
            legendData.PlanId = "";
            legendData.TableName = tableNameMain;
            if (EventTypeMain == "Diffusion") {
                var listTemp = diffusionResultClass.ListPipe.slice(0);
                legendData.PipeList = new Array();
            }
            GetLegendPIpeLengthData(legendData);
        }

        /**
         * 模拟计算管道的图例
         */
        function LegendMainPlanTempCalPipe() {
            colorLegend = pressureChangColor;
            if (isDisplays.length == 0)
                isDisplays = pressureChangeIsDisplay.slice(0)
            //legendNamePipe = "流量变化(m³/h)";
            var legendData = new Object();
            var flowLimit = GetLegendPressureChangeLabels(planTempCalFlowLimit);
            var velocityLimit = GetLegendPressureChangeLabels(planTempCalVelocityLimit);
            labelsAll = flowLimit.slice(0);
            legendData.ListLegendFlow = flowLimit;
            legendData.ListLegendVelocity = velocityLimit;
            legendData.Field = 'cal';
            legendData.FlowBig = true;
            legendData.FlowSmall = true;
            legendData.VelocityBig = true;
            legendData.VelocitySmall = true;
            legendData.TableName = tableNameMain;
            GetLegendCalPipeLengthData(legendData)

        }

        function GetLegendCalPipeLengthData(legendData) {
            var urlTemp = urlClass.axiosUrl + "LegendGetCalPipeLength";
            axios.post(
                urlTemp,
                JSON.stringify(legendData),
                { headers: { 'Content-Type': 'application/json;' } }
            )
                .then(GetLegendCalPipeLengthDataReturn)
        }

        var planCalTempFlowLegendList = new Array();
        var planCalTempVelocityLegendList = new Array();
        var allPipeLengthPipeVelocity = 0;
        function GetLegendCalPipeLengthDataReturn(respone) {
            var data = respone.data;
            var flowLegendList = data.ListLegendFlow;
            var velocityLegendList = data.ListLegendVelocity;
            var objTemp = new Object();
            itemType = 'flow';
            objTemp = GetLegendDisplayData(flowLegendList, selectTypeMain)
            var objTempVelocity = new Object();
            itemType = 'velocity';
            objTempVelocity = GetLegendDisplayData(velocityLegendList, selectTypeMain)
            planCalTempFlowLegendList = objTemp.legendList;
            allPipeLengthPipe = objTemp.AllPipelength;
            allPipeLengthPipeVelocity = objTempVelocity.AllPipelength;
            planCalTempVelocityLegendList = objTempVelocity.legendList;
            itemType = 'calNode';
            LegendMain("PlanCalTemp", "");
        }

        /**
         * 压力波动绘图
         * @param {*} whereTemp 调用后台接口的函数名称
         */
        function GetPressureChangeData(whereTemp,extentTemp) {
            WindowsEvent.MyDispatchEvent("drawStart", '');
            isUpAndDown = false;
            //var extentTemp = view.extent;
            var parameter = new Object();
            parameter.MaxDiameter = whereTemp;
            parameter.MinX = extentTemp.xmin;
            parameter.MinY = extentTemp.ymin;
            parameter.MaxX = extentTemp.xmax;
            parameter.MaxY = extentTemp.ymax;
            axios.post(
                urlClass.axiosUrl + 'GetPressureChangeData',
                JSON.stringify(parameter),
                { headers: { 'Content-Type': 'application/json;' } }
            )
                .then(function (response) {
                    var objTemp = response.data;
                    var obj = objTemp[0];
                    if (isDisplays.length == 0)
                        isDisplays = pressureChangeIsDisplay.slice(0);
                        compareResultLayer.removeAll();
                    var limitTemp = GetLimit(obj.ChangeMin, obj.ChangeMax,pressureChangeLevel);
                    pressureChangLimit = limitTemp.slice(0)
                     drawClass.DrawPressureChangeMain(obj.ChangeMin, obj.ChangeMax, obj.List, pressureChangeLevel,
                        pressureChangColor, isDisplays, compareResultLayer, isCompare, selectTypeMain, EventTypeMain, drawBig, drawSmall,pressureChangLimit)
                    
                    LegendDisplayMain(selectTypeMain, global.time);
                    WindowsEvent.MyDispatchEvent("drawEnd", '');
                })
        }

        function GetPressureChangeMaxMin(where,extentTemp){
            axios.post(
                urlClass.axiosUrl + 'GetPressureChangeMaxMin',
                { headers: { 'Content-Type': 'application/json;' } }
            )
            .then(function (response) {
                pressureChangLimit = [];
                global.pressureChangLimit = [];
                var objTemp = response.data;
                var minTempMy = Number(objTemp.Min);
                var maxTempMy = Number(objTemp.Max);
                var levelTemp = Number(global.diffusionLevel);
                var temp = Number((maxTempMy - minTempMy) / levelTemp);
                var maxTemp1 = 0;
                for (var i = 1; i <= levelTemp; i++) {
                    maxTemp1 = Number(i * temp + minTempMy);
                    var minTemp1 = Number((i - 1) * temp + minTempMy);
                    pressureChangLimit.push(Number(minTemp1).toFixed(2));
                    global.pressureChangLimit.push(Number(minTemp1).toFixed(2));
                }
                pressureChangLimit.push(Number(maxTemp1).toFixed(2));
                global.pressureChangLimit.push(Number(maxTemp1).toFixed(2));
                drawJunctionPressureChange("PressureChange",where,urlClass.junctionResultUrl,extentTemp);
                LegendDisplayMain(selectTypeMain, global.time);
            })
        }

        var pressureChangeLevel = 5;
        /**
         * 压力波动绘图主函数
         * @param {*} min 压力波动最小值
         * @param {*} max 压力波动最大值
         * @param {*} allData 后台返回压力波动的数据
         */
        function DrawPressureChange(min, max, allData, levelTemp, colorTemp, isDisplaysTemp) {
            //pressureChangLimit = new Array();
            var limitsTemp = new Array();
            for (var i = 0; i < allData.length; i++) {
                var obj = allData[i];
                var Plusminus = 0;
                if (isCompare)
                    Plusminus = obj.Plusminus;
                var returnObject = new Object();
                //returnObject = GetLevel(Number(min),Number(max),Number(obj.Change),Number(levelTemp),i);
                returnObject = drawClass.GetLevel(Number(min), Number(max), Number(obj.Change), Number(levelTemp), i, selectTypeMain, isCompare, EventTypeMain);
                if (i == 0)
                    limitsTemp = returnObject.limitsTemp;
                var level = returnObject.result;

                if (isDisplaysTemp[level - 1]) {
                    var point = esriApi.Point(obj.X, obj.Y, new esriApi.SpatialReference({ wkid: global.spatialReference }));
                    var markerSymbol = new esriApi.SimpleMarkerSymbol({outline: null});
                    var widthTemp = 0;
                    var isDrawTemp = false;
                    if (isCompare) {
                        if (Plusminus == "0" && drawSmall) {
                            widthTemp = 4;
                            isDrawTemp = true;
                        }
                        else if (Plusminus == "1" && drawBig) {
                            widthTemp = 6;
                            isDrawTemp = true;
                        }
                    }
                    else {
                        widthTemp = 6;
                        isDrawTemp = true;
                    }
                    if (isDrawTemp) {
                        markerSymbol.size = widthTemp;//大小
                        markerSymbol.color = new esriApi.Color(colorTemp[level - 1]);//颜色
                        var gra1 = new esriApi.Graphic(point, markerSymbol);
                        compareResultLayer.add(gra1);

                    }
                }
            }
            return limitsTemp;
        }
        /**
         * 模拟计算管道流量变化的区间值
         */
        var planTempCalFlowLimit = new Array();
        /**
         * 模拟计算管道流速变化的区间值
         */
        var planTempCalVelocityLimit = new Array();
        /**
         * 选择绘制模拟计算的管道的类型(流量或者流速)
         */
        var planTempCalDrawPipeType = "";
        function DrawPipeFlowChange(min, max, allData, levelTemp, colorTemp, typeTemp, isDisplaysTemp) {
            //pressureChangLimit = new Array();
            var limitsTemp = new Array();
            for (var i = 0; i < allData.length; i++) {
                var obj = allData[i];
                //var level = GetLevel(Number(min),Number(max),Number(obj.Flow),Number(levelTemp),i,limitsTemp);
                var returnObject = new Object();
                //returnObject = GetLevel(Number(min),Number(max),Number(obj.Change),Number(levelTemp),i);
                returnObject = drawClass.GetLevel(Number(min), Number(max), Number(obj.Change), Number(levelTemp), i, selectTypeMain, isCompare, EventTypeMain);
                var level = returnObject.result;
                if (i == 0)
                    limitsTemp = returnObject.limitsTemp;
                var path = new Array();
                var pointTemp;
                var Plusminus = obj.Plusminus;
                for (var j = 0; j < obj.Coordinate.length; j++) {
                    var objTemp = obj.Coordinate[j];
                    var pathTemp = new Array();
                    pathTemp.push(objTemp.X)
                    pathTemp.push(objTemp.Y)
                    path.push(pathTemp);
                    pointTemp = point;
                }
                var pathMain = new Array();
                pathMain.push(path);
                var line = new esriApi.Polyline({
                    "paths": [],
                    "spatialReference": { "wkid": global.spatialReference }
                });
                line.paths = pathMain;
                var markerSymbol = new esriApi.SimpleLineSymbol({style: "solid"});
                var widthTemp = 0;
                var isDrawTemp = false;
                if (isCompare) {
                    if (Plusminus == "0" && drawSmall) {
                        widthTemp = 4;
                        isDrawTemp = true;
                    }
                    else if (Plusminus == "1" && drawBig) {
                        widthTemp = 6;
                        isDrawTemp = true;
                    }
                }
                else {
                    widthTemp = 6;
                    isDrawTemp = true;
                }
                if (isDrawTemp) {
                    markerSymbol.width = widthTemp;//大小
                    markerSymbol.color = new esriApi.Color(colorTemp[level - 1]);//颜色
                    var gra1 = new esriApi.Graphic(line, markerSymbol);
                    if (typeTemp == "" && isDisplaysTemp[level - 1]) {
                        compareResultLayer.add(gra1);
                    }
                    else if (typeTemp == "flow" && planCalPipeFlowIsDisplays[level - 1])
                        planCalResultFlowLayer.add(gra1);
                    else if (typeTemp == "velocity" && planCalPipeVelocityIsDisplays[level - 1])
                        planCalResultVelocityLayer.add(gra1);
                }

            }
            return limitsTemp;
        }
        var myCount = 0;
        /**
         * 获取画图所在的等级
         * @param {*} min 最小值
         * @param {*} max 最大值
         * @param {*} value 属性值
         */
        function GetLevel(min, max, value, levelTemp, indexTemp) {
            var returnObject = new Object();
            var limitsTemp = new Array();
            var temp = (max - min) / Number(levelTemp);
            var result;
            var maxTemp;
            var minTemp;
            for (var i = 1; i <= levelTemp; i++) {
                value = Math.abs(value);
                maxTemp = i * temp + min;
                minTemp = (i - 1) * temp + min;
                if (value >= minTemp && value <= maxTemp) {
                    result = i;
                }
                if ((selectTypeMain == "PressureChange" || isCompare || EventTypeMain == "PlanTempCalculate") && indexTemp == 0) {

                    limitsTemp.push(minTemp.toFixed(2));
                }
            }
            if ((selectTypeMain == "PressureChange" || isCompare || EventTypeMain == "PlanTempCalculate") && indexTemp == 0)
                limitsTemp.push(maxTemp.toFixed(2));
            returnObject.result = result;
            returnObject.limitsTemp = limitsTemp;
            return returnObject;
        }

        /* var xmlDom=createXMLDom();
        xmlDom.load("MyConfig.xml");
        //获得根节点
        var root=xmlDom.documentElement;
        var data="";
        var legend=root.getElementsByTagName("legend");
        var flow=legend.getElementsByTagName("flow");
        var len=flow.length;
        for(var i=0;i<len;i++) {

        }
        alert(len);

        function createXMLDom(){
            if (window.ActiveXObject)
             var xmldoc=new ActiveXObject("Microsoft.XMLDOM");
            else
             if (document.implementation&&document.implementation.createDocument)
              var xmldoc=document.implementation.createDocument("","doc",null);
            xmldoc.async = false;
            //为了和FireFox一至，这里不能改为False;
            xmldoc.preserveWhiteSpace=true;
            return xmldoc;
          }
 */

    }

}

export default new Methods()
