// import urlClass from './UrlClass'
import axios from 'axios'
import global from '../js/Global'
// import PictureProperty from '@/components/js/PipeBurst/PictureProperty'
// import WindowsEvent from '@/components/js/WindowsEvent'

var esriApi = {};
class Methods {

    setArcgisforAPI(_obj){
        esriApi = _obj;
    }

    DrawWaringEvent(eventData, layer){
        var wFlowPoints = eventData.FlowPoints;
        if (!wFlowPoints) {
            return;
        }
        var wPressurePoints = eventData.PressurePoints;
        var coordinates = eventData.Coordinates;
        for (var i = 0; i < wFlowPoints.length; i++) {
            var pointTemp = esriApi.Point(wFlowPoints[i].X,wFlowPoints[i].Y,new esriApi.SpatialReference({ wkid: global.spatialReference }));
            var gra1 = this.CreatePictureGraphic(PictureProperty.eventBlue, pointTemp); 
            layer.add(gra1)
        }
        var maxValue = 1;
        for (var i = 0; i < coordinates.length; i++) {
            var heat = Number(coordinates[i].Heat);
            if(maxValue<heat)
            {
                maxValue = heat;
            }
        }
        console.log('maxValue',maxValue);
         //定位点
         for (var i = 0; i < coordinates.length; i++) {
            var pointTemp = esriApi.Point(coordinates[i].X,coordinates[i].Y,new esriApi.SpatialReference({ wkid: global.spatialReference }));
            var heat = Number(coordinates[i].Heat);
            var gra1;
            if(heat==maxValue){
                gra1 = this.CreatePictureGraphic(PictureProperty.eventRed, pointTemp); 
            }else if(heat==maxValue-1){
                gra1 = this.CreatePictureGraphic(PictureProperty.eventOrange, pointTemp); 
            }else if(heat==maxValue-2){
                gra1 = this.CreatePictureGraphic(PictureProperty.eventYellow, pointTemp); 
            }
            layer.add(gra1)
        }
    }

    DrawValveStatus(layerTemp){
        var self = this;
        axios.get(urlClass.axiosUrl+"GetAllValveStates")
        .then(function(response){
            self.DrawValveAttributes(response.data,layerTemp);
        });
    }

    DrawOneValveAttriute1(layerTemp,pointTemp,statusTemp){
        var imageSource = "";
        var gra1 = '';
        if(statusTemp=="0")
            gra1 = this.CreatePictureGraphic(PictureProperty.closeValvePin, pointTemp); 
        else
            gra1 = this.CreatePictureGraphic(PictureProperty.closeOpenValvePin, pointTemp); 
        layerTemp.add(gra1); 
    }



    DrawValveAttributes(allValveAtttibute,layerTemp){
        layerTemp.removeAll();
        for(var i=0;i<allValveAtttibute.length;i++)
        {
            var obj = new Object();
            obj = allValveAtttibute[i];
            var statusTemp = obj.State;
            var pointTemp = esriApi.Point(obj.X,obj.Y,new esriApi.SpatialReference({ wkid: global.spatialReference }));
            this.DrawOneValveAttriute1(layerTemp,pointTemp,statusTemp);
        }
    }

    DropPlanTable(tableNameTemp) {
        if (tableNameTemp != "") {
            axios.get(urlClass.axiosUrl + "DropPlanTable" + "/" + tableNameTemp)
                .then(function (response) {
                })
        }
    }
    /**
     * 在外部js中调用该方法(测试)
     * @param {*} layer GraphicLayer
     */
    AddGraphic(layer) {
        var point = new esriApi.Point(498766.6875, 321263.46875, new esriApi.SpatialReference({ wkid: global.spatialReference }));
        var pictureMarkerSymbol = new esriApi.PictureMarkerSymbol({ url: localStorage.getItem("imgPath")+'assets/dingwei_03.png', width: 98, height: 98});
        var gra1 = new esriApi.Graphic(point, pictureMarkerSymbol);
        layer.add(gra1)
    }
    /**
     * 地图绘制结果数据自适应范围缩放
     * @param {*} _layers 绘制结果图层(集合)
     * @param {*} _view 地图窗口
     * @param {*} _isZoom 是否缩放
     */
    MapResultDataRangeZoom(_layers, _view, _isZoom=true){
        // debugger
        let geoms = [];
        for (let i = 0; i < _layers.length; i++) {
            let layerTemp = _layers[i];
            if (layerTemp) {
                let geomsTemp = layerTemp.graphics.map(function(item){
                    return item.geometry;
                });
                if (geomsTemp.toArray().length > 0) {
                    let geom = esriApi.geometryEngine.convexHull(geomsTemp.toArray(),true)[0];
                    geoms.push(geom);
                }
            }
        }
        if (geoms.length > 0) {
            let geomUnion = geoms[0];
            if (geoms.length > 1) {
                geomUnion = esriApi.geometryEngine.convexHull(geoms,true)[0];
            }
            _view.extent = geomUnion.extent;
            // var symbol = new esriApi.SimpleFillSymbol({ style: "solid", color: [204, 102, 255, 0.5], outline: new esriApi.SimpleLineSymbol({ color: [255, 0, 0, 1], width: 2, style: "solid" }) });
            // const gra = new esriApi.Graphic({geometry: geomUnion, symbol: symbol});
            // _layers[0].add(gra);
            if(_isZoom) {
                _view.zoom --;
            }
        }
    }

    /**
     * 获取画图所在的等级
     * @param {*} min 最小值
     * @param {*} max 最大值
     * @param {*} value 属性值
     * @param {*} selectTypeMain 专题图类型
     * @param {*} isCompare 是否是在进行时间对比
     * @param {*} EventTypeMain 事件类型
     */
    GetLevelNode(value,limitsTempMy,isDisplay,obj,layer,drawSmall,drawBig,colorTemp) {
        var returnObject = new Object();
        var result;
        var maxTemp;
        var minTemp;
        value = Number(value);
        var Plusminus = obj.Plusminus;
        var point = esriApi.Point(obj.X,obj.Y,new esriApi.SpatialReference({ wkid: global.spatialReference }));
        for(var i=0;i<limitsTempMy.length-1;i++){
            value = Number(Math.abs(value));
            maxTemp = Number(limitsTempMy[i+1]);
            minTemp = Number(limitsTempMy[i]);
            var widthTemp = 0;
            var isDrawTemp = false;
            if (value >= minTemp && value <= maxTemp&&isDisplay[i]) {
                result = i;
                if (Plusminus == "0" && drawSmall) {
                    widthTemp = global.nodeDown;
                    isDrawTemp = true;
                }
                else if (Plusminus == "1" && drawBig) {
                    widthTemp = global.nodeUp;
                    isDrawTemp = true;
                }
                if (isDrawTemp) {
                    var gra1 = this.DrawPointGraphic(widthTemp, colorTemp[i], point);
                    layer.add(gra1);
                }
                break;
            }
        }
        returnObject.result = result;
        returnObject.limitsTemp = limitsTempMy;

        return returnObject;
    }
    GetLevelPipe(value,limitsTempMy,isDisplay,obj,layer,drawSmall,drawBig,colorTemp) {
        var returnObject = new Object();
        var result;
        var maxTemp;
        var minTemp;
        value = Number(value);
        var path = [];
        var Plusminus = obj.Plusminus;
        for (var j = 0; j < obj.Coordinate.length; j++) {
            var objTemp = obj.Coordinate[j];
            var pathTemp = new Array();
            pathTemp.push(objTemp.X)
            pathTemp.push(objTemp.Y)
            path.push(pathTemp);
        }
        var pathMain = new Array();
        pathMain.push(path);
        var line = new esriApi.Polyline({
            "paths": [],
            "spatialReference": { "wkid": global.spatialReference }
        });
        line.paths = pathMain;
        for(var i=0;i<limitsTempMy.length-1;i++){
            value = Number(Math.abs(value));
            maxTemp = Number(limitsTempMy[i+1]);
            minTemp = Number(limitsTempMy[i]);
            var widthTemp = 0;
            var isDrawTemp = false;
            if (value >= minTemp && value <= maxTemp&&isDisplay[i]) {
                result = i;
                var path = new Array();
           
                if (Plusminus == "0" && drawSmall) {
                    widthTemp = global.pipeDown;
                    isDrawTemp = true;
                }
                else if (Plusminus == "1" && drawBig) {
                    widthTemp = global.pipeUp;
                    isDrawTemp = true;
                }
                if (isDrawTemp) {
                    var gra1 = this.DrawLineGraphic(widthTemp, colorTemp[i], line);
                    layer.add(gra1)
                }
                break;
            }
        }
        returnObject.result = result;
        returnObject.limitsTemp = limitsTempMy;

        return returnObject;
    }

    GetLevelMain(value, limitsTempMy) {
        var returnObject = new Object();
        var result;
        var maxTemp;
        var minTemp;
        value = Number(value);
        var isDraw = false;
        for(var i=0;i<limitsTempMy.length-1;i++){
            value = Number(Math.abs(value));
            maxTemp = Number(limitsTempMy[i+1]);
            minTemp = Number(limitsTempMy[i]);
            if (value >= minTemp && value <= maxTemp) {
                result = i;
                break;
            }
        }
        returnObject.result = result;
        returnObject.limitsTemp = limitsTempMy;

        return returnObject;
    }


    /**
     * 画点
     * @param {*} width 尺寸
     * @param {*} color 颜色
     * @param {*} point 位置
     */
    DrawPointGraphic(width, color, point,attribute=null) {
        var markerSymbol = new esriApi.SimpleMarkerSymbol({size: width+"px", color: new esriApi.Color(color), outline: null});
        var gra1 = new esriApi.Graphic(point, markerSymbol,attribute);
        return gra1;
     /*    var symbolPressureBackground = new esriApi.SimpleMarkerSymbol().setStyle(
            esriApi.SimpleMarkerSymbol.STYLE_CIRCLE).setColor(
                new esriApi.Color(color)).setOutline(
                    new esriApi.SimpleLineSymbol(esriApi.SimpleLineSymbol.STYLE_SOLID,
                         new esriApi.Color([233, 86, 6, 0]), 1)).setSize(width);
        var gra1 = new esriApi.Graphic(point, symbolPressureBackground,attribute);
        return gra1; */
    }


    DrawHeatMap(featureLayer,dataPoint,map){
        var layerDefinition = {
            "geometryType": "esriGeometryPoint",
            "fields": [{
              "name": "ID",
              "type": "esriFieldTypeInteger",
              "alias": "ID"
            }]
          }
          var featureCollection = {
            layerDefinition: layerDefinition,
            featureSet: null
          };
          featureLayer = new esriApi.FeatureLayer(featureCollection, {
            mode: esriApi.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            opacity: 1
          });
      
          var heatmapRenderer = new esriApi.HeatmapRenderer({
            colors: ["rgba(255, 0, 0, 0)", "rgb(0, 255, 0)", "rgb(255, 255, 0)", "rgb(255, 0, 0)"],
            blurRadius: 8,
            maxPixelIntensity: 230,
            minPixelIntensity: 10
          });
          featureLayer.setRenderer(heatmapRenderer);
          for(var i=0;i<dataPoint.length;i++)
          {
             var point = new esriApi.Point(Number(dataPoint[i].X), Number(dataPoint[i].Y), 
                 new esriApi.SpatialReference({wkid: global.spatialReference}));
              featureLayer.add(new esriApi.Graphic(point));
          }
          map.addLayer(featureLayer);
          return featureLayer;
    }

    /**
     * 画线
     * @param {*} width 宽度
     * @param {*} color 颜色
     * @param {*} geometry 坐标信息SimpleLineSymbol  .SimpleLineSymbol.STYLE_SOLID
     */
    DrawLineGraphic(width, color, geometry) {
        var markerSymbol = new esriApi.SimpleLineSymbol({style: "solid", width: width, color: new esriApi.Color(color), cap: "round"});
        var gra1 = new esriApi.Graphic(geometry, markerSymbol);
        return gra1;
    }

    DrawAccuracyWaterQualityMonitor(data,layer,map,mapObj,dialog){
        dialog.startup();
        for(var i=0;i<data.length;i++){
            var obj = Object.assign({},data[i])//data[i]
            var point = esriApi.Point(obj.X,obj.Y,new esriApi.SpatialReference({ wkid: global.spatialReference }));
            var gra1;
            gra1 = this.DrawPointGraphic(12,"#ff0000",point,obj)
            layer.add(gra1)
                
        }
        map.on("pointer-move", function (e) {
            map.hitTest(e).then(function(response){
                if(response.results[0]){
                    var graphic = response.results[0].graphic;
                    if (graphic.layer.id == layer.id) {
                        var obj = graphic.attributes;
                        if (obj) {
                            var t = "<b>"+obj.Label+"</b><hr><b>PH值: </b>"+obj.PH+"<br>"
                            + "<b>余氯: </b>"+obj.YL+"<br>"
                            + "<b>浊度: </b>"+obj.ZD+"<br>"; 
                            dialog.setContent(t);
                            mapObj.domStyle.set(dialog.domNode, "opacity", 0.85);
                            var pt = map.toScreen(graphic.geometry);
                            mapObj.popup.open({
                                popup: dialog,
                                // x: pt.x + 60,
                                // y: pt.y + 22
                                x: e.x + 60,
                                y: e.y + 22
                            });
                        }
                        e.stopPropagation();
                    }
                }else{
                    closeDialog();
                }
            })
        });
        function closeDialog() {
            mapObj.popup.close(dialog);
          }
    }

    AddGraphicByType(type, obj, layer){
        var point = esriApi.Point(obj.X, obj.Y, new esriApi.SpatialReference({ wkid: global.spatialReference }));
        var tempLegendData = global.pressureLegendData;
        if (type == "pressure") {
            tempLegendData = global.pressureLegendData;
        }else if(type == "flow"){
            tempLegendData = global.flowLegendData;
        }
        for (let j = 0; j < tempLegendData.length; j++) {
            const item = tempLegendData[j];
            if(obj[item.matchField] == item.matchValue)
            {
                var fontSizes = item.fontSize.split(',');
                var colors = item.color.split(',');
                for (let i = 0; i < fontSizes.length; i++) {
                    const fontSize = fontSizes[i];
                    const color = colors[i];
                    var gra = this.DrawPointGraphic(Number(fontSize), color, point, obj);
                    layer.add(gra);
                }
                break;
            }
        }
    }
    DrawAccuracyMonitor(data,layer,map,mapObj,dialog){
        dialog.startup();
        var monitorData = data.data;
        var type = data.type;
        for(var i=0;i<monitorData.length;i++){
            var obj = Object.assign({},monitorData[i])//monitorData[i]
            this.AddGraphicByType(type, obj, layer);
            // var gra1;
            // var point = esriApi.Point(obj.X,obj.Y,new esriApi.SpatialReference({ wkid: global.spatialReference }));
            // var level = obj.Level;
            // if(level=="-1")
            // {
            //     gra1 = this.DrawPointGraphic(12,"#ff0000",point,obj)
            //     layer.add(gra1)
            //     gra1 = this.DrawPointGraphic(9,"#ffff00",point,obj)
            // }
            // else if(level=="1")
            // {
            //     gra1 = this.DrawPointGraphic(12,"#0000ff",point,obj)
            // }
            // else if(level=="2")
            // {
            //     gra1 = this.DrawPointGraphic(12,"#00ff00",point,obj)
            // }
            // else if(level=="3")
            // {
            //     if(String(obj.IsLjj)=="1"){
            //         gra1 = this.DrawPointGraphic(12,"#FFA500",point,obj)
            //     }else
            //         gra1 = this.DrawPointGraphic(12,"#FF0000",point,obj)
            // }
            // if(String(obj.IsLjj)=="1"){
            //     if(obj.IsWarning){
            //         gra1 = this.DrawPointGraphic(12,"#FF0000",point,obj)
            //     }
            // }
            // layer.add(gra1)
        }
        map.on("pointer-move", function (e) {
            map.hitTest(e).then(function(response){
                if(response.results[0]){
                    var graphic = response.results[0].graphic;
                    if (graphic.layer.id == layer.id) {
                        var obj = graphic.attributes;
                        if (obj) {
                            var t = "<b>"+obj.Name+"</b><hr><b>实测值: </b>"+(String(obj.MonitorValue)=='99999'?'未上传':obj.MonitorValue)+"<br>"
                            + "<b>模拟值: </b>"+obj.CalValue+"<br>"
                            + "<b>差值: </b>"+(String(obj.DelValue)=='99999'?'未上传':obj.DelValue)+"<br>"; 
                            dialog.setContent(t);
                            mapObj.domStyle.set(dialog.domNode, "opacity", 0.85);
                            var pt = map.toScreen(graphic.geometry);
                            mapObj.popup.open({
                                popup: dialog,
                                // x: pt.x + 60,
                                // y: pt.y + 22
                                x: e.x + 60,
                                y: e.y + 22
                            });
                        }
                        e.stopPropagation();
                    }
                }else{
                    closeDialog();
                }
            })
        });
        function closeDialog() {
            mapObj.popup.close(dialog);
        }
    }

    AccuracyMonitorPosition(data,layer,map){
        var obj = data;
        var pointTemp = esriApi.Point(Number(obj.X),Number(obj.Y),new esriApi.SpatialReference({ wkid: global.spatialReference }));
        var extent = new esriApi.Extent(Number(obj.X)-200, Number(obj.Y)-200, Number(obj.X)+200, Number(obj.Y)+200,
            new esriApi.SpatialReference({ wkid: global.spatialReference }));
        map.extent = extent;
        map.center = pointTemp;
        var gra1 = this.CreatePictureGraphic(PictureProperty.redPin, pointTemp, obj);
        layer.add(gra1)
    }

    DrawCalPosition(layer,list){
        layer.removeAll();
        for(var i=0;i<list.length;i++){
            var pin = '';
            var obj = list[i];
            switch(String(obj.LayerId)){
                case global.layerId.EN_PIPE:
                pin = PictureProperty.redPin;
                break;
                case global.layerId.EN_JUNCTION:
                pin = PictureProperty.bluePin;
                break;
                case global.layerId.EN_VALVE:
                pin = PictureProperty.greenPin;
                break;
                case global.layerId.EN_PRVALVE:
                pin = PictureProperty.greenPin;
                break;
                default:
                pin = PictureProperty.greenPin;
                break;
            }
            var gra1 = this.CreatePictureGraphic(pin, obj.point);
            layer.add(gra1)
        }
    }

    DrawPressureControlNode(data,layer,map,mapObj,dialog){
        dialog.startup();
        var listDataTemp = data.pressPointList;
        var listDataTempCtr = data.pressCtrlList;
        for(var i=0;i<listDataTemp.length;i++)
        {
            var obj = listDataTemp[i];
            var pointTemp = esriApi.Point(obj.X,obj.Y,new esriApi.SpatialReference({ wkid: global.spatialReference }));
            var picture = '';
            if(listDataTempCtr.indexOf(obj)>=0)
            {
                picture = Object.assign({},PictureProperty.redNodePin) ;//在控制点列表中为红色标记
            }
            else
                picture = Object.assign({},PictureProperty.blueNodePin);//不在控制点列表中为蓝色标记
            var gra1 = this.CreatePictureGraphic(picture,pointTemp,obj)
            layer.add(gra1);
        }
        map.on("pointer-move", function (e) {
            map.hitTest(e).then(function(response){
                if(response.results[0]){
                    var graphic = response.results[0].graphic;
                    if (graphic.layer.id == layer.id) {
                        var obj = graphic.attributes;
                        if (obj) {
                            var t = "<b>名称:"+obj.PressureName+"</b><hr><b>压力(MPa): </b>"+obj.CtPressure+"<br>"
                            + "<b>控制压力(MPa): </b>"+obj.CroPressure+"<br>";
                            dialog.setContent(t);
                            mapObj.domStyle.set(dialog.domNode, "opacity", 0.85);
                            var pt = map.toScreen(graphic.geometry);
                            mapObj.popup.open({
                                popup: dialog,
                                // x: pt.x + 60,
                                // y: pt.y + 38
                                x: e.x + 60,
                                y: e.y + 38
                            });
                        }
                        e.stopPropagation();
                    }
                }else{
                    closeDialog();
                }
            })
        });
        function closeDialog() {
            mapObj.popup.close(dialog);
          }
    }

    /**
     * 绘制三角形
     * @param {*} pProperty 
     * @param {*} angle 
     * @param {*} geometry 
     * @param {*} attributes 
     */
    CreateSVGGraphic(pProperty,angle, geometry, attributes = null) {
        var markerSymbol = new esriApi.SimpleMarkerSymbol({path: pProperty.iconPath, angle: angle,size: pProperty.size, color: pProperty.color, outline: null});
        var gra1 = new esriApi.Graphic(geometry, markerSymbol, attributes);
        return gra1;
    }

    /**
    * 节点画图的主函数
    * @param {*} re 查询返回的对象
    * @param {*} limits 分级
    * @param {*} colors 颜色分级
    * @param {*} widths 线的宽度
    * @param {*} icons 节点图标
    * @param {*} typeTemp 类型
    * @param {*} isDisplaysTemp 是否显示的数组
    * @param {*} layer 需要画图的图层(GraphicLayer)
    * @param {*} field 字段
    * @param {*} **********采用 FeatureLayer 加载专题**************
    * @param {*} rendererType 渲染类型
    * @param {*} symbolType symbol类型
    * @param {*} selectTypeMain 专题图类型
    * @param {*} urlTemp 服务地址
    * @param {*} whereMy 服务过滤条件
    * @param {*} outFields 服务输出参数
    * @param {*} view 地图窗口
    */
    DrawJunctionMain(re, limits, colors, widths, icons, typeTemp, isDisplaysTemp, layer, field, rendererType = null, symbolType = null, selectTypeMain = null, urlTemp = null, whereMy = null, outFields = null, view = null) {
        if (re) {
            var result = new Array();
            for (var i = 0; i < re.features.length; i++) {
                var feature = re.features[i];
                var attribute = feature.attributes[field];
                if(String(attribute)=='null'){
                    continue;
                }
                if (true) {
                    for (var j = 0; j < limits.length; j++) {
                        if (j == 0) {
                            if (attribute < limits[j] && isDisplaysTemp[j]) {
                                var gra1 = this.DrawPointGraphic(widths[j], colors[j], feature.geometry);
                                layer.add(gra1)
                            }
                        }
                        else if (j == limits.length - 1) {
                            if (attribute > limits[j] && isDisplaysTemp[isDisplaysTemp.length - 1]) {
                                var gra1 = this.DrawPointGraphic(widths[widths.length - 1], colors[colors.length - 1], feature.geometry);
                                layer.add(gra1)
                            }
                            else if (attribute > limits[j - 1] && attribute < limits[j] && isDisplaysTemp[isDisplaysTemp.length - 2]) {
                                var gra1 = this.DrawPointGraphic(widths[widths.length - 2], colors[colors.length - 2], feature.geometry);
                                layer.add(gra1)
                            }
                        }
                        else {
                            if (attribute > limits[j - 1] && attribute < limits[j] && isDisplaysTemp[j]) {
                                var gra1 = this.DrawPointGraphic(widths[j], colors[j], feature.geometry);
                                layer.add(gra1)
                            }
                        }
                    }
                }
            }
        }else{
            this.addFeatureLayer(rendererType, symbolType, selectTypeMain, view, isDisplaysTemp, field, limits, colors, widths, icons, urlTemp, outFields, whereMy);
        }
    }

    /**
    * 24小时压力波动画图的主函数
    * @param {*} re 查询返回的对象
    * @param {*} limits 分级
    * @param {*} colors 颜色分级
    * @param {*} widths 线的宽度
    * @param {*} icons 节点图标
    * @param {*} typeTemp 类型
    * @param {*} isDisplaysTemp 是否显示的数组
    * @param {*} layer 需要画图的图层(GraphicLayer)
    * @param {*} field 字段
    * @param {*} **********采用 FeatureLayer 加载专题**************
    * @param {*} rendererType 渲染类型
    * @param {*} symbolType symbol类型
    * @param {*} selectTypeMain 专题图类型
    * @param {*} urlTemp 服务地址
    * @param {*} whereMy 服务过滤条件
    * @param {*} outFields 服务输出参数
    * @param {*} view 地图窗口
    */
    DrawJunctionMainPressureChange(re, limits, colors, widths, icons, typeTemp, isDisplaysTemp, layer, field, rendererType = null, symbolType = null, selectTypeMain = null, urlTemp = null, whereMy = null, outFields = null, view = null) {
        if (re) {
            var result = new Array();
            for (var i = 0; i < re.features.length; i++) {
                var feature = re.features[i];
                var attribute = feature.attributes[field];
                if (true) {
                    for (var j = 0; j < limits.length-1; j++) {
                        if (Number(attribute) > Number(limits[j]) && Number(attribute) < Number(limits[j+1]) && isDisplaysTemp[j]) {
                            var gra1 = this.DrawPointGraphic(widths[j], colors[j], feature.geometry);
                            layer.add(gra1)
                        }
                    }
                }
            }
        }else{
            this.addFeatureLayer(rendererType, symbolType, selectTypeMain, view, isDisplaysTemp, field, limits, colors, widths, icons, urlTemp, outFields, whereMy);
        }
    }
    /**
    * 管道画图的主函数
    * @param {*} re 查询返回的对象
    * @param {*} limits 分级
    * @param {*} colors 颜色分级
    * @param {*} widths 线的宽度
    * @param {*} icons 节点图标
    * @param {*} typeTemp 类型
    * @param {*} isDisplaysTemp 是否显示的数组
    * @param {*} layer 需要画图的图层(GraphicLayer)
    * @param {*} field 字段
    * @param {*} **********采用 FeatureLayer 加载专题**************
    * @param {*} rendererType 渲染类型
    * @param {*} symbolType symbol类型
    * @param {*} selectTypeMain 专题图类型
    * @param {*} urlTemp 服务地址
    * @param {*} whereMy 服务过滤条件
    * @param {*} outFields 服务输出参数
    * @param {*} map 地图窗口
    */
    DrawPipeMain(re, limits, colors, widths, icons, typeTemp, isDisplaysTemp, layer, field, rendererType = null, symbolType = null, selectTypeMain = null, urlTemp = null, whereMy = null, outFields = null, view = null) {
        if (re) {
            for (var i = 0; i < re.features.length; i++) {
                var feature = re.features[i];
                var attribute = feature.attributes[field];
                attribute = Math.abs(attribute);
                if(String(attribute)=='null'){
                    continue;
                }
                if (true) {
                    for (var j = 0; j < limits.length; j++) {
                        if (j == 0) {
                            if (attribute < limits[j] && isDisplaysTemp[j]) {
                                var gra1 = this.DrawLineGraphic(widths[j], colors[j], feature.geometry);
                                layer.add(gra1);
                            }
                        }
                        else if (j == limits.length - 1) {
                            if (attribute > limits[j] && isDisplaysTemp[isDisplaysTemp.length - 1]) {
                                var gra1 = this.DrawLineGraphic(widths[widths.length - 1], colors[colors.length - 1], feature.geometry);
                                layer.add(gra1);
                            }
                            else if (attribute > limits[j - 1] && attribute <= limits[j] && isDisplaysTemp[j]) {
                                var gra1 = this.DrawLineGraphic(widths[widths.length - 2], colors[colors.length - 2], feature.geometry);
                                layer.add(gra1);
                            }
                            else if (attribute = '' && isDisplaysTemp[isDisplaysTemp.length - 1]) {
                                var gra1 = this.DrawLineGraphic(widths[widths.length - 1], colors[colors.length - 1], feature.geometry);
                                layer.add(gra1);
                            }
                        }
                        else {
                            if (attribute > limits[j - 1] && attribute <= limits[j] && isDisplaysTemp[j]) {
                                var gra1 = this.DrawLineGraphic(widths[j], colors[j], feature.geometry);
                                layer.add(gra1);
                            }
                        }
                    }
                }
            }
        } else {
            this.addFeatureLayer(rendererType, symbolType, selectTypeMain, view, isDisplaysTemp, field, limits, colors, widths, icons, urlTemp, outFields, whereMy);
        }
    }

    /**
    * 添加FeatureLayer图层
    * @param {*} **********采用 FeatureLayer 加载专题**************
    * @param {*} rendererType 渲染类型
    * @param {*} symbolType symbol类型
    * @param {*} selectTypeMain 专题图类型
    * @param {*} view 地图窗口
    * @param {*} isDisplaysTemp 是否显示的数组
    * @param {*} field 字段
    * @param {*} limits 分级
    * @param {*} colors 颜色分级
    * @param {*} widths 线的宽度
    * @param {*} icons 节点图标
    * @param {*} urlTemp 服务地址
    * @param {*} outFields 服务输出参数
    * @param {*} whereMy 服务过滤条件
    */
    addFeatureLayer(rendererType, symbolType, selectTypeMain, view, isDisplaysTemp, field, limits, colors, widths, icons, urlTemp, outFields, whereMy){
        var flId = selectTypeMain + "_Layer";
        const _renderer = this.getRenderer(selectTypeMain, rendererType, symbolType, isDisplaysTemp, field, limits, colors, widths, icons);
        var fLayer = this.isLoadFeatureLayerById(view.map, flId);
        if (fLayer) {
            if (fLayer.definitionExpression != whereMy) {
                fLayer.definitionExpression = whereMy;
            }
            fLayer.renderer = _renderer;
        }else{
            var seattleLayer = new esriApi.FeatureLayer({
                id: flId,
                title: "ztLayer",
                url: urlTemp,
                outFields: outFields,
                renderer: _renderer,
                definitionExpression: whereMy,
                minScale: 0,
                maxScale: 0,
                opacity: 1
            });
            var _level = this.getFeatureLayerLevel(view.map);
            view.map.addMany([seattleLayer], _level);
        }
    }

    /**
     * 获取图例名称
     * @param {*} selectTypeMain 专题图类型
     * @param {*} index 下标
     * @param {*} isPlay 是否是播放专题
     * @return {*} 图例名称
     */
    getLegendLabel(selectTypeMain, index, isPlay){
        var label = "";
        if (isPlay) {
            switch (selectTypeMain) {
                case "SupplyArea":
                    label = global.pipeSupplyAreaLabels[index];
                    break;
                default:
                    break;
            }
        }
        return label;
    }
    /**
     * 判断是否是播放专题
     * @param {*} selectTypeMain 专题图类型
     * @return {*} true或false
     */
    getIsPlay(selectTypeMain){
        var isBool = false;
        for (let i = 0; i < global.LayerName.length; i++) {
            const item = global.LayerName[i];
            if (item.value == selectTypeMain && item.isDynamicDisplay == 'true') {
                isBool = true;
                break;
            }
        }
        return isBool;
    }

    /**
     * 获取渲染参数
     * @param {*} selectTypeMain 专题图类型
     * @param {*} rendererType 渲染类型  class-breaks  unique-value
     * @param {*} symbolType symbol类型  simple-line  simple-marker
     * @param {*} isDisplaysTemp 是否显示的数组
     * @param {*} field 字段
     * @param {*} limits 分级
     * @param {*} colors 颜色分级
     * @param {*} widths 线的宽度
     * @param {*} icons 节点图标
     */
    getRenderer(selectTypeMain, rendererType, symbolType, isDisplaysTemp, field, limits, colors, widths, icons){
        const isPlay = this.getIsPlay(selectTypeMain);
        var infosState = true;
        var legendData = [];
        const renderer = {
            type: rendererType,
            field: field,
            visualVariables: []
        };
        if (rendererType != "class-breaks") {
            infosState = false;
            renderer.uniqueValueInfos = [];
            for (let j = 0; j < colors.length; j++) {
                const _display = isDisplaysTemp[j];
                const _colorItem = colors[j];
                const _widthItem = widths[j];
                const _limitItem = limits[j];
                if (_display) {
                    var obj_u = {
                        value: _limitItem,
                        symbol: {type: symbolType, color: _colorItem, style: "solid", width: _widthItem}
                    }
                    legendData.push({label: this.getLegendLabel(selectTypeMain, j, isPlay), color: _colorItem});
                    renderer.uniqueValueInfos.push(obj_u);
                }
            }
        } else {
            renderer.classBreakInfos = [];
            let _minValue = 0;
            let limitsCount = 0;
            for (let i = 0; i < colors.length; i++) {
                const _display = isDisplaysTemp[i];
                const _colorItem = colors[i];
                const _iconItem = localStorage.getItem("imgPath") + icons[i];
                const _widthItem = widths[i];
                let _limitItem = limits[limits.length-1] * 100;
                if (i < limits.length) {
                    _limitItem = limits[i];
                }
                let _maxValue = _limitItem - 0.000000001;
                let _lenMaxValue = _limitItem;
                if (field == "DirectionChange") {//特殊化处理（24小时流动变化次数专题）
                    if(i == 0){
                        limitsCount ++;
                        _maxValue = null;
                        if (_display) {
                            renderer.defaultSymbol = {type: symbolType, color: _colorItem, style: "solid", width: _widthItem};
                        }
                    }else if(i == colors.length-1){
                        _minValue = limits[limits.length-1] + 0.000000001;
                        _maxValue = limits[limits.length-1] * 100;
                        _lenMaxValue = limits[limits.length-1];
                    }else{
                        if (limitsCount < limits.length) {
                            _minValue  = limits[limitsCount];
                            limitsCount ++;
                            _maxValue  = limits[limitsCount];
                            _lenMaxValue = limits[limitsCount];
                            limitsCount ++;
                        }
                    }
                }
                if (field == "PressureChange") {//特殊化处理（24小时压力波动专题）
                    _minValue = limits[i];
                    if (i + 1 < limits.length) {
                        _maxValue = limits[i+1];
                        _lenMaxValue = limits[i+1];
                    }else{
                        _maxValue = limits[limits.length-1];
                        _lenMaxValue = limits[limits.length-1];
                    }
                }
                if(field == "pipeAge"){
                    if(i == colors.length - 2){
                        _maxValue = limits[limits.length-2] * 100;
                        _lenMaxValue = limits[limits.length-2];
                    }
                    if (i == colors.length - 1) {
                        _maxValue = null;
                        _lenMaxValue = "";
                        if (_display) {
                            renderer.defaultSymbol = {type: symbolType, color: _colorItem, style: "solid", width: _widthItem};
                        }
                    }
                }
                if (_display && _maxValue) {
                    var _symbol = {type: symbolType, color: _colorItem, style: "solid", width: _widthItem};
                    if (symbolType == "simple-marker") {
                        // _symbol = {type: symbolType, color: _colorItem, outline: {color: "#000000", width: 1}, size: _widthItem};
                        // _symbol = {type: symbolType, color: _colorItem, outline: null, size: _widthItem};
                        _symbol = {type: "picture-marker", url: _iconItem, width: _widthItem, height: _widthItem}
                    }
                    var obj_c = {
                        minValue: _minValue,
                        maxValue: _maxValue,
                        symbol: _symbol
                    }
                    var lengendLabel = _minValue + " - " + _lenMaxValue;
                    if (i == 0) {
                        lengendLabel = " < " + _lenMaxValue;
                    }else if (i == colors.length - 1) {
                        lengendLabel = " > " + _minValue;
                    }
                    legendData.push({label: lengendLabel, color: _colorItem});
                    renderer.classBreakInfos.push(obj_c);
                }
                _minValue = _limitItem;
            }
        }
        if (isPlay) {
            WindowsEvent.MyDispatchEvent('setDynamicDisplay', legendData);//动态展示图例赋值
        }
        return renderer;
    }

    /**
     * 判断FeatureLayer是否加载（flId传入null：隐藏所有专题图，否则显示对应flId专题图）
     * @param {*} map 地图
     * @param {*} flId 图层ID
     * @param {*} isVisible 对应图层ID匹配值显示或隐藏
     * @return {*} fLayer 返回匹配flId图层，否则为null
     */
    isLoadFeatureLayerById(map, flId = null, isVisible = true){
        var fLayer = null;
        const ztLayers = map.allLayers.filter(function (layer) {
            return layer.title === "ztLayer";
        });
        const layers = ztLayers.toArray();
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            if (flId && flId == layer.id) {
                layer.visible = isVisible;
                fLayer = layer;
            } else {
                layer.visible = false;
            }
        }
        return fLayer;
    }

    /**
     * 获取FeatureLayer 添加层级（判断获取GraphicsLayer图层下）
     * @param {*} map 地图
     * @return {*} level 返回添加层级
     */
    getFeatureLayerLevel(map){
        var level = 1;
        const layers = map.allLayers.toArray();
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            if (i != 0 && layer.type == "graphics") {
                level = i - 1;
                break;
            }
        }
        return level;
    }

    /**
     * 绘制管龄主函数
     * @param {*} re 查询返回的对象
     * @param {*} limits 分级
     * @param {*} colors 颜色分级
     * @param {*} widths 线的宽度
     * @param {*} icons 节点图标
     * @param {*} typeTemp 类型
     * @param {*} isDisplaysTemp 是否显示的数组
     * @param {*} layer 需要画图的图层(GraphicLayer)
     * @param {*} field 字段
     * @param {*} **********采用 FeatureLayer 加载专题**************
     * @param {*} rendererType 渲染类型
     * @param {*} symbolType symbol类型
     * @param {*} selectTypeMain 专题图类型
     * @param {*} urlTemp 服务地址
     * @param {*} whereMy 服务过滤条件
     * @param {*} outFields 服务输出参数
     * @param {*} view 地图窗口
     */
    DrawPipeMainPipeAge(re, limits, colors, widths, icons, typeTemp, isDisplaysTemp, layer, field, rendererType = null, symbolType = null, selectTypeMain = null, urlTemp = null, whereMy = null, outFields = null, view = null) {
        if (re) {
            for (var i = 0; i < re.features.length; i++) {
                var feature = re.features[i];
                var attribute = feature.attributes[field];
                if(i<10){
                }
                if (true) {
                    for (var j = 0; j < limits.length; j++) {
                        if (j == 0) {
                            if (attribute&&attribute <= limits[j] && isDisplaysTemp[j]) {
                                var gra1 = this.DrawLineGraphic(widths[j], colors[j], feature.geometry);
                                layer.add(gra1);
                            }
                        }
                        else if (j == limits.length - 1) {
                            if (!attribute && isDisplaysTemp[isDisplaysTemp.length - 1]) {
                                var gra1 = this.DrawLineGraphic(widths[widths.length - 1], colors[colors.length - 1], feature.geometry);
                                layer.add(gra1);
                            }
                        }
                        else if (j == limits.length - 2) {
                            if (attribute > limits[j] && isDisplaysTemp[isDisplaysTemp.length - 2]) {
                                var gra1 = this.DrawLineGraphic(widths[widths.length - 2], colors[colors.length - 2], feature.geometry);
                                layer.add(gra1);
                            }
                            else if (attribute > limits[j - 1] && attribute <= limits[j] && isDisplaysTemp[j]) {
                                var gra1 = this.DrawLineGraphic(widths[widths.length - 3], colors[colors.length - 3], feature.geometry);
                                layer.add(gra1);
                            }
                        }
                        else {
                            if (attribute > limits[j - 1] && attribute <= limits[j] && isDisplaysTemp[j]) {
                                var gra1 = this.DrawLineGraphic(widths[j], colors[j], feature.geometry);
                                layer.add(gra1);
                            }
                        }
                    }
                }
            }
        } else {
            this.addFeatureLayer(rendererType, symbolType, selectTypeMain, view, isDisplaysTemp, field, limits, colors, widths, icons, urlTemp, outFields, whereMy);
        }
    }

    DrawSupplyAreaResult(data,limits,color,widths,layer){
        console.log('DrawSupplyAreaResult',limits);
        for(var i=0;i<data.length;i++){
            var objTemp = data[i];
            var path = new Array();
            for (var k = 0; k < objTemp.Coordinate.length; k++) {
                var point = objTemp.Coordinate[k];
                var pathTemp = new Array();
                pathTemp.push(point.X)
                pathTemp.push(point.Y)
                path.push(pathTemp);
            }
            var pathMain = new Array();
            pathMain.push(path);
            var line = new esriApi.Polyline({
                "paths": [],
                "spatialReference": { "wkid": global.spatialReference }
            });
            line.paths = pathMain;
            for(var j=0;j<limits.length;j++){
                if(String(objTemp.SupplyAreaId)==String(limits[j])){
                    var gra1 = this.DrawLineGraphic(widths[j],color[j],line);
                    layer.add(gra1);
                    break;
                }
            }
        }
    }

    /**
     * 绘制管道物理量
     * @param {*} geometry 坐标信息
     * @param {*} attribute 物理量的属性值
     * @param {*} limits 分级信息
     * @param {*} colors 颜色信息
     * @param {*} widths 宽度信息
     * @param {*} isDisplaysTemp 是否显示的数组
     * @param {*} layer 需要画图的图层(GraphicLayer)
     */
    DrawMainPipePhysicalMain(geometry, attribute, limits, colors, widths, isDisplaysTemp, layer) {
        for (var j = 0; j < limits.length; j++) {
            if (attribute == limits[j] && isDisplaysTemp[j]) {
                var gra1 = this.DrawLineGraphic(widths[j], colors[j], geometry);
                layer.add(gra1);
            }
        }
    }

    /**
     * 创建一个图片的graphic
     * @param {*} pProperty 
     * @param {*} geometry 
     */
    CreatePictureGraphic(pProperty, geometry, attributes = null){
        // var markerSymbol = new esriApi.PictureMarkerSymbol(pProperty.url, pProperty.width, pProperty.height);
        var markerSymbol = new esriApi.PictureMarkerSymbol({ url: pProperty.url, width: pProperty.width + "px", height: pProperty.height + "px",
             xoffset: pProperty.xoffset + "px", yoffset: pProperty.yoffset + "px", angle: pProperty.angle});
        if (pProperty.color != '') markerSymbol.color = pProperty.color;
        var gra1 = new esriApi.Graphic(geometry, markerSymbol, attributes);
        return gra1;
    }

    /**
     * 绘制供水分界线对比图中供水分界线变化的管道
     * @param {*} changeData 供水分界线变化的管道信息
     * @param {*} limits 分级信息
     * @param {*} colors 颜色信息
     * @param {*} widths 宽度信息
     * @param {*} isDisplaysTemp 是否绘制数组
     * @param {*} layer 需要画图的图层(GraphicLayer)
     */
    DrawSupplyAreaCompare(changeData, limits, colors, widths, isDisplaysTemp, layer) {
        for (var i = 0; i < changeData.length; i++) {
            var feature = changeData[i];
            var attribute = feature.SupplyAreaIdO;
            var path = new Array();
            for (var j = 0; j < feature.Coordinate.length; j++) {
                var objTemp = feature.Coordinate[j];
                var pathTemp = new Array();
                pathTemp.push(objTemp.X)
                pathTemp.push(objTemp.Y)
                path.push(pathTemp);
            }
            var pathMain = new Array();
            pathMain.push(path);
            var line = new esriApi.Polyline({
                "paths": [],
                "spatialReference": { "wkid": global.spatialReference }
            });
            line.paths = pathMain;
            this.DrawMainPipePhysicalMain(line, attribute, limits, colors, widths, isDisplaysTemp, layer);
        }
        WindowsEvent.MyDispatchEvent('TimeCompareSupplyAreaOReturn','');
    }

    /**
         * 管道基础属性画图的主函数
         * @param {*} re 查询返回的对象
         * @param {*} limits 分级
         * @param {*} colors 颜色分级
         * @param {*} widths 线的宽度
         * @param {*} icons 节点图标
         * @param {*} typeTemp 类型
         * @param {*} isDisplaysTemp 是否绘制 数组
         * @param {*} layer 需要画图的图层(GraphicLayer)
         * @param {*} field 字段名
         * @param {*} **********采用 FeatureLayer 加载专题**************
         * @param {*} rendererType 渲染类型
         * @param {*} symbolType symbol类型
         * @param {*} selectTypeMain 专题图类型
         * @param {*} urlTemp 服务地址
         * @param {*} whereMy 服务过滤条件
         * @param {*} outFields 服务输出参数
         * @param {*} view 地图窗口
         */
    DrawPipePhysicalMain(re, limits, colors, widths, icons, typeTemp, isDisplaysTemp, layer, field, rendererType = null, symbolType = null, selectTypeMain = null, urlTemp = null, whereMy = null, outFields = null, view = null) {
        if (re) {
            for (var i = 0; i < re.features.length; i++) {
                var feature = re.features[i];
                var attribute = feature.attributes[field];
                this.DrawMainPipePhysicalMain(feature.geometry, attribute, limits, colors, widths, isDisplaysTemp, layer);
            }
        } else {
            this.addFeatureLayer(rendererType, symbolType, selectTypeMain, view, isDisplaysTemp, field, limits, colors, widths, icons, urlTemp, outFields, whereMy);
        }
    }

    /**
     * 绘制供水分界线混合区的管线
     * @param {*} re 
     * @param {*} colors 
     * @param {*} widths 
     * @param {*} layer 
     * @param {*} field 
     */
    DrawSupplyAreaMixArea(re,colors,widths,layer, field,field1,time2){
       /*  var str = field.split('_');
        var time2 = Number(str[2])==0?'23':String(Number(str[2])-1);
        var field1 = 'Result_'+str[1]+'_'+time2; */
        for (var i = 0; i < re.features.length; i++) {
            var feature = re.features[i];
            var attribute = feature.attributes[field];
            var attribute1 = feature.attributes[field1];
            if((String(attribute)!=String(attribute1))&&String(attribute)!='null'&&String(attribute1)!='null'&&String(attribute)!='0'&&String(attribute1)!='0'){
                var gra1 = this.DrawLineGraphic(widths, colors, feature.geometry);
                layer.add(gra1);
            }
        }
    }

    /**
     * 压力波动绘图主函数
     * @param {*} min 压力波动最小值
     * @param {*} max 压力波动最大值
     * @param {*} allData 后台返回压力波动的数据
     * @param {*} levelTemp 所分等级数
     * @param {*} colorTemp 颜色信息
     * @param {*} isDisplaysTemp 是否绘制 数组
     * @param {*} layer 需要画图的图层(GraphicLayer)
     * @param {*} isCompare 是否是对比
     * @param {*} selectTypeMain 图层类型
     * @param {*} EventTypeMain 事件类型
     * @param {*} drawBig 是否绘制结果增大的值
     * @param {*} drawSmall 是否绘制结果减小的值
     * @param {return} limitsTemp 分级信息(返回值)
     */
    DrawPressureChange(min, max, allData, levelTemp, colorTemp, isDisplaysTemp, layer, isCompare, selectTypeMain, EventTypeMain, drawBig, drawSmall,limitsTempMy) {
    //    debugger
        var limitsTemp = new Array();
        for (var i = 0; i < allData.length; i++) {
            var obj = allData[i];
            var Plusminus = 0;
            if (isCompare)
                Plusminus = obj.Plusminus;
            var returnObject = new Object();
            returnObject = this.GetLevelNode( Number(obj.Change),limitsTempMy,isDisplaysTemp,obj,layer,drawSmall,drawBig, colorTemp);
        }
        limitsTemp = limitsTempMy;
        return limitsTemp;
    }

    DrawPressureChangeMain(min, max, allData, levelTemp, colorTemp, isDisplaysTemp, layer, isCompare, selectTypeMain, EventTypeMain, drawBig, drawSmall,limitsTempMy) {
        var limitsTemp = new Array();
        for (var i = 0; i < allData.length; i++) {
            var obj = allData[i];
            var Plusminus = 0;
            var returnObject = new Object();
            returnObject = this.GetLevelMain(Number(obj.Change),limitsTempMy);
            var level = returnObject.result;
            if (isDisplaysTemp[level]) {
                var point = esriApi.Point(obj.X,obj.Y,new esriApi.SpatialReference({ wkid: global.spatialReference }));
                var widthTemp = 0;
                var isDrawTemp = false;
                widthTemp = 6;
                var gra1 = this.DrawPointGraphic(widthTemp, colorTemp[level], point);
                layer.add(gra1);
            }
        }
        limitsTemp = limitsTempMy;
        return limitsTemp;
    }


    /**
   * 绘制管道结果变化之
   * @param {*} min 管道结果变化最小值
   * @param {*} max 管道结果变化最大值
   * @param {*} allData 后台返回管道结果变化的数据
   * @param {*} levelTemp 所分等级数
   * @param {*} colorTemp 颜色信息
   * @param {*} isDisplaysTemp 是否绘制 数组
   * @param {*} layer 需要画图的图层(GraphicLayer)
   * @param {*} isCompare 是否是对比
   * @param {*} selectTypeMain 图层类型
   * @param {*} EventTypeMain 事件类型
   * @param {*} drawBig 是否绘制结果增大的值
   * @param {*} drawSmall 是否绘制结果减小的值
   * @return {*} limitsTemp 分级信息(返回值)
   */
    DrawPipeFlowChange(min, max, allData, levelTemp, colorTemp, isDisplaysTemp, layer, isCompare, selectTypeMain, EventTypeMain, drawBig, drawSmall,limitsTempMy) {
        var limitsTemp = new Array();
        for (var i = 0; i < allData.length; i++) {
            var obj = allData[i];
            var returnObject = new Object();
            var changeData = 0;
            changeData = Number(obj.Change);
            returnObject = this.GetLevelPipe(changeData,limitsTempMy,isDisplaysTemp,obj,layer,drawSmall,drawBig, colorTemp);
        }
        console.log("returnObject",returnObject)
        return limitsTempMy;
    }

    DrawDiffusion(min, max, allData, levelTemp, colorTemp, isDisplaysTemp, layer, isCompare, selectTypeMain, EventTypeMain, drawBig, drawSmall,limitsTempMy) {
        var limitsTemp = new Array();
        for (var i = 0; i < allData.length; i++) {
            var obj = allData[i];
            var returnObject = new Object();
            var changeData = 0;
            changeData = Number(obj.PassTime);
            returnObject = this.GetLevelMain(Number(changeData), limitsTempMy);
            var level = returnObject.result;
            if (isDisplaysTemp[level]) {
                var widthTemp = 0;
                var path = [];
                for (var j = 0; j < obj.Coordinate.length; j++) {
                    var objTemp = obj.Coordinate[j];
                    var pathTemp = new Array();
                    pathTemp.push(objTemp.X)
                    pathTemp.push(objTemp.Y)
                    path.push(pathTemp);
                }
                var pathMain = new Array();
                pathMain.push(path);
                var line = new esriApi.Polyline({
                    "paths": [],
                    "spatialReference": { "wkid": global.spatialReference }
                });
                line.paths = pathMain;

                widthTemp = 6;
                var gra1 = this.DrawLineGraphic(widthTemp, colorTemp[level], line);
                layer.add(gra1)
            }
        }
        return limitsTempMy;
    }

    /**
     * 在地图上标记指针
     * @param {*} pointTemp 扎针的位置
     * @param {*} imgSource 图片的路径
     * @param {*} layer 添加的图层
     * @param {*} width 图片宽度
     * @param {*} height 图片高度
     */
    PositionPointer(pointTemp, imgSource, layer, width, height) {
        layer.removeAll();
        var pictureMarkerSymbol = new esriApi.PictureMarkerSymbol({ url: imgSource, width: width, height: height});
        var gra1 = new esriApi.Graphic(pointTemp, pictureMarkerSymbol);
        layer.add(gra1);
        layer.visible = false;
    }

    DrawPlanFocusNewMain(data,layer,type){
        if(type=="pressure")
        type = "压力点:"
        else
        type = "流量点:"
        for(var i=0;i<data.length;i++){
            var obj = data[i];
            var point = esriApi.Point(obj.X, obj.Y, new esriApi.SpatialReference({ wkid: global.spatialReference }));
            var pictureGrapgic = '';
            var label = type+obj.Label;
            var width = 65+label.length*12.5;
            if (width > 200) {
                width = 200;
            }
            PictureProperty.pressureMonitor.width = width;
            PictureProperty.pressureMonitorAdd.width = width;
            if(!obj.select)
            pictureGrapgic =  this.CreatePictureGraphic(PictureProperty.pressureMonitor,point,obj);
            else
            pictureGrapgic =  this.CreatePictureGraphic(PictureProperty.pressureMonitorAdd,point,obj);
            layer.add(pictureGrapgic)
            var textGraphic = '';
            textGraphic =  this.CreateTextGraphic(PictureProperty.pressureName,point,type+obj.Label);

            layer.add(textGraphic)
        }
    }
    /**
     * 创建一个文字的graphic
     * @param {*} pProperty 
     * @param {*} geometry 
     */
    CreateTextGraphic(pProperty, geometry, label){
        var markerSymbol = new esriApi.TextSymbol({
            text: label, 
            xoffset: pProperty.xoffset+"px", 
            yoffset: pProperty.yoffset+"px", 
            angle: pProperty.angle,
            font: {
                size: 9
            }
        });
        // console.log(label);
        if (pProperty.color != '') markerSymbol.color= pProperty.color;
        var gra1 = new esriApi.Graphic(geometry, markerSymbol);
        return gra1;
    }
    /**
     * 向图层上添加单个阀门状态的图标
     * @param {*} pointTemp 地图上位置
     * @param {*} statusTemp 阀门状态
     * @param {*} layer 图层
     */
    DrawOneValveAttriute(pointTemp, statusTemp, layer) {
        var imageSource = "";
        if (statusTemp == "0")
            imageSource = urlClass.valveCloseSource;
        else
            imageSource = urlClass.valvePartCloseSource;
        var pictureMarkerSymbol = new esriApi.PictureMarkerSymbol({ url: imageSource, width: 13, height: 13});
        var gra1 = new esriApi.Graphic(pointTemp, pictureMarkerSymbol);
        layer.add(gra1);
    }

    /**
     * 添加所有阀门状态的图标到阀门上
     * @param {*} allValveAtttibute 所有的阀门状态信息
     * @param {*} layer 图层
     */
    DrawValveAttribute(allValveAtttibute, layer) {
        layer.removeAll();
        for (var i = 0; i < allValveAtttibute.length; i++) {
            var obj = new Object();
            obj = allValveAtttibute[i];
            var statusTemp = obj.State;
            var pointTemp = esriApi.Point(obj.X, obj.Y, new esriApi.SpatialReference({ wkid: global.spatialReference }));
            this.DrawOneValveAttriute(pointTemp, statusTemp, layer);
        }
    }

    /**
     * 调后台接口获取所有阀门的状态
     */
    ValveAttributeFunction() {
        axios.get(urlClass.axiosUrl + "GetAllValveStates")
            .then(function (response) {
                DrawValveAttribute(response.data);
            });
    }

    /**
     * 获取地图的初始坐标范围
     * @param {*} extentObject 
     */
    GetMapInitExtent(extentObject) {
        var initExtent = new esriApi.Extent(extentObject.minX, extentObject.minY, extentObject.maxX, extentObject.maxY,
            new esriApi.SpatialReference({ wkid: global.spatialReference }));
        return initExtent;
    }

    /**
     * 返回当前需要画图时的地图的范围
     * @param {*} map 地图
     * @return {*} mapExtentTemp 地图范围
     */
    GetDrawMapExtent(map) {
        // debugger
        var mapExtentTemp;
        if (map.scale <= global.myScale[1]) {
            mapExtentTemp = map.extent;
        }
        else {
            mapExtentTemp = this.GetMapInitExtent(global.initExtent);
        }
        return mapExtentTemp;
    }

    /**
    * 24小时管道流向变化的绘图主函数
    * @param {*} re 查询返回的对象
    * @param {*} limits 分级
    * @param {*} colors 颜色分级
    * @param {*} widths 线的宽度
    * @param {*} icons 节点图标
    * @param {*} fieldTemp 流向变化字段
    * @param {*} fieldTemp1 流量字段
    * @param {*} isDisplaysTemp 是否显示数组
    * @param {*} layer 添加的图层
    * @param {*} field 字段
    * @param {*} **********采用 FeatureLayer 加载专题**************
    * @param {*} rendererType 渲染类型
    * @param {*} symbolType symbol类型
    * @param {*} selectTypeMain 专题图类型
    * @param {*} urlTemp 服务地址
    * @param {*} whereMy 服务过滤条件
    * @param {*} outFields 服务输出参数
    * @param {*} view 地图窗口
    */
    DrawPipeDirectionChangeMain(re, limits, colors, widths, icons, fieldTemp, fieldTemp1, isDisplaysTemp, layer, field, rendererType = null, symbolType = null, selectTypeMain = null, urlTemp = null, whereMy = null, outFields = null, view = null) {
        if (re) {
            for (var i = 0; i < re.features.length; i++) {
                var feature = re.features[i];
                var count = 0;
                var sum = 0;
               /*  for (var j = 0; j < 24; j++) {
                    count += (feature.attributes[fieldTemp + j]);
                    sum += Math.abs((feature.attributes[fieldTemp1 + j]));
                }
                if (sum < 0.0024) {
                    continue;
                } */
                var attribute = feature.attributes[field];
                if(String(attribute)=='null'){
                    continue;
                }
                if (true) {
                    for (var j = 0; j < limits.length+1; j++) {
                        if (j == 0) {
                            if (attribute == limits[j] && isDisplaysTemp[j]) {
                                var gra1 = this.DrawLineGraphic(widths[j], colors[j], feature.geometry)//new esriApi.Graphic(feature.geometry, markerSymbol);  
                                layer.add(gra1);
                            }
                        }
                        else if (j == limits.length) {
                            if (attribute > limits[j-1] && isDisplaysTemp[isDisplaysTemp.length - 1]) {
                                var gra1 = this.DrawLineGraphic(widths[widths.length - 1], colors[colors.length - 1], feature.geometry);
                                layer.add(gra1);
                            }
                        }
                        else if(j+1<limits.length&&j%2!=0){ 
                            if (attribute >= limits[j] && attribute <= limits[j+1] && isDisplaysTemp[(j+1)/2]) {
                                var gra1 = this.DrawLineGraphic(widths[(j+1)/2], colors[(j+1)/2], feature.geometry);
                                layer.add(gra1);
                            }
                        }
                    }
                }
            }
        } else {
            this.addFeatureLayer(rendererType, symbolType, selectTypeMain, view, isDisplaysTemp, field, limits, colors, widths, icons, urlTemp, outFields, whereMy);
        }
    }

    /**
     * 获取查询条件中的查询字段
     * @param {*} typeTemp 元素类型(管道或者节点)
     */
        GetWhereType(typeTemp){
        if(typeTemp=='junction')
        return "MaxDiameter";
        else if(typeTemp=='pipe')
        return 'Physical_PipeDiameter';//return "Physical_PipeDiameter";
    }

    /**
     * 获取一般查询的条件
     * @param {*} typeTemp 元素类型(管道或者节点)
     */
    GetWhere(typeTemp,map){
        var whereTemp = "";
        for(var i=0;i<global.myScale.length;i++)
        {
            if(i==0)
            {
                if(map.scale<=global.myScale[i])
                {
                    whereTemp = '1=1';
                }
            }
            else if(i==global.myScale.length-1)
            {
                if(map.scale>global.myScale[i])
                {
                    whereTemp = this.GetWhereType(typeTemp);
                    whereTemp+=('>='+global.myDiameter[i]);
                }
                else if(map.scale>global.myScale[i-1]&&map.scale<=global.myScale[i])
                {
                    whereTemp = this.GetWhereType(typeTemp);
                    whereTemp+=('>='+global.myDiameter[i-1]);
                }
            }
            else
            {
                if(map.scale>global.myScale[i-1]&&map.scale<=global.myScale[i])
                {
                    whereTemp = this.GetWhereType(typeTemp);
                    whereTemp+=('>='+global.myDiameter[i-1]);
                }
            }
        }
        return whereTemp;
    }


    /**
    * 绘制管道
    * @param {*} re 查询返回的对象  
    * @param {*} branchPipes 专题图类型
    * @param {*} isDisplays 是否显示数组
    * @param {*} **********采用 FeatureLayer 加载专题**************
    * @param {*} urlTemp 服务地址
    * @param {*} whereMy 服务过滤条件
    * @param {*} outFields 服务输出参数
    * @param {*} view 地图窗口
    */
    DrawPipeAge(re, branchPipes, isDisplays, field, layer, urlTemp = null, whereMy = null, outFields = null, view = null){
        var returnIsDisplays = [];
        if (isDisplays.length == 0)
            isDisplays = global.ageIsDisplay.slice(0)//ageIsDisplay.slice(0);
        this.DrawPipeAgeMain(re, global.ageLimit, global.ageColor, global.ageWidth, branchPipes, isDisplays, layer, field, "class-breaks", "simple-line", selectTypeMain, urlTemp, whereMy, outFields, view);
        returnIsDisplays = isDisplays.slice(0);
        return returnIsDisplays;
    }
 /**
    * 管道画图的主函数
    * @param {*} re 查询返回的对象
    * @param {*} limits 分级
    * @param {*} colors 颜色分级
    * @param {*} widths 线的宽度
    * @param {*} typeTemp 类型
    * @param {*} isDisplaysTemp 是否显示的数组
    * @param {*} layer 需要画图的图层(GraphicLayer)
    * @param {*} field 字段
    * @param {*} **********采用 FeatureLayer 加载专题**************
    * @param {*} rendererType 渲染类型
    * @param {*} symbolType symbol类型
    * @param {*} selectTypeMain 专题图类型
    * @param {*} urlTemp 服务地址
    * @param {*} whereMy 服务过滤条件
    * @param {*} outFields 服务输出参数
    * @param {*} view 地图窗口
    */
    DrawPipeAgeMain(re, limits, colors, widths, branchPipes, isDisplaysTemp, layer, field, rendererType = null, symbolType = null, selectTypeMain = null, urlTemp = null, whereMy = null, outFields = null, view = null) {
        if (re) {
            for (var i = 0; i < re.features.length; i++) {
                var feature = re.features[i];
                var attribute = feature.attributes[field];
                var id = feature.attributes["ElementId"];
                if(branchPipes.indexOf(String(id))==-1)
                continue;
                attribute = Math.abs(attribute);
                if(String(attribute)=='null'){
                    continue;
                }
                if (true) {
                    for (var j = 0; j < limits.length; j++) {
                        if (j == 0) {
                            if (attribute < limits[j] && isDisplaysTemp[j]) {
                                var gra1 = this.DrawLineGraphic(widths[j], colors[j], feature.geometry);
                                layer.add(gra1);
                            }
                        }
                        else if (j == limits.length - 1) {
                            if (attribute > limits[j] && isDisplaysTemp[isDisplaysTemp.length - 1]) {
                                var gra1 = this.DrawLineGraphic(widths[widths.length - 1], colors[colors.length - 1], feature.geometry);
                                layer.add(gra1);
                            }
                            else if (attribute > limits[j - 1] && attribute <= limits[j] && isDisplaysTemp[j]) {
                                var gra1 = this.DrawLineGraphic(widths[widths.length - 2], colors[colors.length - 2], feature.geometry);
                                layer.add(gra1);
                            }
                            else if (attribute = '' && isDisplaysTemp[isDisplaysTemp.length - 1]) {
                                var gra1 = this.DrawLineGraphic(widths[widths.length - 1], colors[colors.length - 1], feature.geometry);
                                layer.add(gra1);
                            }
                        }
                        else {
                            if (attribute > limits[j - 1] && attribute <= limits[j] && isDisplaysTemp[j]) {
                                var gra1 = this.DrawLineGraphic(widths[j], colors[j], feature.geometry);
                                layer.add(gra1);
                            }
                        }
                    }
                }
            }
        } else {
            this.addFeatureLayer(rendererType, symbolType, selectTypeMain, view, isDisplaysTemp, field, limits, colors, widths, urlTemp, outFields, whereMy);
        }
    }
    /**
    * 绘制管道
    * @param {*} re 查询返回的对象  
    * @param {*} selectTypeMain 专题图类型
    * @param {*} isDisplays 是否显示数组
    * @param {*} **********采用 FeatureLayer 加载专题**************
    * @param {*} urlTemp 服务地址
    * @param {*} whereMy 服务过滤条件
    * @param {*} outFields 服务输出参数
    * @param {*} view 地图窗口
    */
    pipeFlow(re, selectTypeMain, isDisplays, field, layer, urlTemp = null, whereMy = null, outFields = null, view = null) {
        var returnIsDisplays = new Array();
        if (selectTypeMain == 'Flow') {
            if (isDisplays.length == 0)
                isDisplays = global.pipeFlowIsDisplay.slice(0)
            this.DrawPipeMain(re, global.pipeFlowLimit, global.pipeFlowColor, global.pipeFlowWidth, '', 'pipe', isDisplays, layer, field, "class-breaks", "simple-line", selectTypeMain, urlTemp, whereMy, outFields, view);
        }
        else if (selectTypeMain == 'Velocity') {
            if (isDisplays.length == 0)
                isDisplays = global.pipeVelocityIsDisplay.slice(0)//pipeVelocityIsDisplay.slice(0);
            this.DrawPipeMain(re, global.pipeVelocityLimit, global.pipeVelocityColor, global.pipeVelocityWidth, '', 'pipe', isDisplays, layer, field, "class-breaks", "simple-line", selectTypeMain, urlTemp, whereMy, outFields, view);
        }
        else if (selectTypeMain == 'Slop') {
            if (isDisplays.length == 0)
                isDisplays = global.pipeSlopIsDisplay.slice(0)//pipeSlopIsDisplay.slice(0);
            this.DrawPipeMain(re, global.pipeSlopLimit, global.pipeSlopColor, global.pipeSlopWidth, '', 'pipe', isDisplays, layer, field, "class-breaks", "simple-line", selectTypeMain, urlTemp, whereMy, outFields, view);
        }
        else if (selectTypeMain == 'PipeAge') {
            if (isDisplays.length == 0)
                isDisplays = global.pipeAgeIsDisplay.slice(0)//pipeAgeIsDisplay.slice(0);
            this.DrawPipeMainPipeAge(re, global.pipeAgeLimit, global.pipeAgeColor, global.pipeAgeWidth, '', 'pipe', isDisplays, layer, 'pipeAge', "class-breaks", "simple-line", selectTypeMain, urlTemp, whereMy, outFields, view);
        }
        else if (selectTypeMain == 'Diameter') {
            if (isDisplays.length == 0)
                isDisplays = global.pipeDiameterIsDisplay.slice(0)//pipeDiameterIsDisplay.slice(0);
            this.DrawPipeMain(re, global.pipeDiameterLimit, global.pipeDiameterColor, global.pipeDiameterWidth, '', 'pipe', isDisplays, layer, field, "class-breaks", "simple-line", selectTypeMain, urlTemp, whereMy, outFields, view);
        }
        else if (selectTypeMain == 'SupplyArea') {
            if (isDisplays.length == 0)
                isDisplays = global.pipeSupplyAreaIsDisplay.slice(0)//pipeSupplyAreaIsDisplay.slice(0);
            this.DrawPipePhysicalMain(re, global.pipeSupplyAreaLimit, global.pipeSupplyAreaColor, global.pipeSupplyAreaWidth, '', 'pipe', isDisplays, layer, field, "unique-value", "simple-line", selectTypeMain, urlTemp, whereMy, outFields, view);
            var str = field.split('_');
            var time2 = Number(str[2])==0?'23':String(Number(str[2])-1);
            var field1 = 'Result_'+str[1]+'_'+time2;
            //绘制供水分界线混合区的管道
            //this.DrawSupplyAreaMixArea(re,global.supplyAreaMixColor,global.supplyAreaMixWidth,layer, field,field1,time2);
        }
        else if (selectTypeMain == 'SupplyAreaNew') {
            if (isDisplays.length == 0)
                isDisplays = global.pipeSupplyAreaNewIsDisplay.slice(0)//pipeSupplyAreaIsDisplay.slice(0);
            this.DrawPipePhysicalMain(re, global.pipeSupplyAreaNewLimit, global.pipeSupplyAreaNewColor, global.pipeSupplyAreaNewWidth, '', 'pipe', isDisplays, layer, field, "class-breaks", "simple-line", selectTypeMain, urlTemp, whereMy, outFields, view);
            var str = field.split('_');
            var time = str[2].split('w');
            var time2 = Number(time[1])==0?'23':String(Number(time[1])-1);
            var field1 = 'Result_'+str[1]+'_New'+time2;
             //绘制供水分界线混合区的管道
             //this.DrawSupplyAreaMixArea(re,global.supplyAreaMixColor,global.supplyAreaMixWidth,layer, field,field1,time2);
        }
        else if (selectTypeMain == 'Material') {
            if (isDisplays.length == 0)
                isDisplays = global.pipeMaterialIsDisplay.slice(0)//pipeMaterialIsDisplay.slice(0);
            this.DrawPipePhysicalMain(re, global.pipeMaterialLimit, global.pipeMaterialColor, global.pipeMaterialWidth, '', 'pipe', isDisplays, layer, field, "unique-value", "simple-line", selectTypeMain, urlTemp, whereMy, outFields, view);
        }
        else if (selectTypeMain == 'Age') {
            if (isDisplays.length == 0)
                isDisplays = global.ageIsDisplay.slice(0)//ageIsDisplay.slice(0);
            this.DrawPipeMain(re, global.ageLimit, global.ageColor, global.ageWidth, '', 'pipe', isDisplays, layer, field, "class-breaks", "simple-line", selectTypeMain, urlTemp, whereMy, outFields, view);
        }
        else if (selectTypeMain == "FlowChangeCount") {
            if (isDisplays.length == 0)
                isDisplays = global.directionChangeIsDisplay.slice(0)//directionChangeCountIsDisplay.slice(0);
            this.DrawPipeDirectionChangeMain(re, global.directionChangeLimit, global.directionChangeColor, global.directionChangeWidth, '', 'Direction_Change_', 'Result_Flow_', isDisplays, layer, "DirectionChange", "class-breaks", "simple-line", selectTypeMain, urlTemp, whereMy, outFields, view);
        }
        else if (selectTypeMain == "PipeStatus") {
            if (isDisplays.length == 0)
                isDisplays = global.pipeStopWaterIsDisplay.slice(0)//pipeStopWaterIsDisplay.slice(0);
            this.DrawPipePhysicalMain(re, global.pipeStopWaterLimit, global.pipeStopWaterColor, global.pipeStopWaterWidth, '', 'pipe', isDisplays, layer, field, "class-breaks", "simple-line", selectTypeMain, urlTemp, whereMy, outFields, view);
        }
        else if (selectTypeMain == "SupplyAreaCompare") {
            if (isDisplays.length == 0)
                isDisplays = global.pipeSupplyAreaIsDisplay.slice(0)//pipeSupplyAreaIsDisplay.slice(0);
            this.DrawPipePhysicalMain(re, global.pipeSupplyAreaLimit, global.pipeSupplyAreaColor, global.pipeSupplyCompareAreaWidth, '', 'pipe', isDisplays, layer, field, "class-breaks", "simple-line", selectTypeMain, urlTemp, whereMy, outFields, view);
        } else if (selectTypeMain == "SupplyAreaCompareNew") {
            if (isDisplays.length == 0)
                isDisplays = global.pipeSupplyAreaIsDisplay.slice(0)//pipeSupplyAreaIsDisplay.slice(0);
            this.DrawPipePhysicalMain(re, global.pipeSupplyAreaNewLimit, global.pipeSupplyAreaNewColor, global.pipeSupplyCompareAreaNewWidth, '', 'pipe', isDisplays, layer, field, "class-breaks", "simple-line", selectTypeMain, urlTemp, whereMy, outFields, view);
        }
        returnIsDisplays = isDisplays.slice(0);
        return returnIsDisplays;

    }


    /**
   * 节点绘制
   * @param {*} re 查询返回对象 
   * @param {*} **********采用 FeatureLayer 加载专题**************
   * @param {*} urlTemp 服务地址
   * @param {*} whereMy 服务过滤条件
   * @param {*} outFields 服务输出参数
   * @param {*} view 地图窗口
   */
    JunctionPressure(re, selectTypeMain, isDisplays, layer, field, urlTemp = null, whereMy = null, outFields = null, view = null) {
        if (selectTypeMain == 'Pressure') {
            if (isDisplays.length == 0)
                isDisplays = global.pressureIsDisplay.slice(0)
            this.DrawJunctionMain(re, global.pressureLimit, global.pressureColor, global.pressureWidth, global.pressureIcon, 'junction', isDisplays, layer, field, "class-breaks", "simple-marker", selectTypeMain, urlTemp, whereMy, outFields, view);
        }
        else if (selectTypeMain == 'HydraulicGrade') {
            if (isDisplays.length == 0)
                isDisplays = global.headIsDisplay.slice(0)
            this.DrawJunctionMain(re, global.headLimit, global.headColor, global.headWidth, global.headIcon, 'junction', isDisplays, layer, field, "class-breaks", "simple-marker", selectTypeMain, urlTemp, whereMy, outFields, view);
        }
        else if (selectTypeMain == 'Demand') {
            if (isDisplays.length == 0)
                isDisplays = global.demandIsDisplay.slice(0)
            this.DrawJunctionMain(re, global.demandLimit, global.demandColor, global.demandWidth, global.demandIcon, 'junction', isDisplays, layer, field, "class-breaks", "simple-marker", selectTypeMain, urlTemp, whereMy, outFields, view);
        }
        else if (selectTypeMain == 'PressureChange') {
            if (isDisplays.length == 0)
                isDisplays = global.pressureChangeIsDisplay.slice(0)
            this.DrawJunctionMainPressureChange(re, global.pressureChangLimit, global.pressureChangColor, global.pressureChangWidth, global.pressureChangeIcon, 'junction', isDisplays, layer, field, "class-breaks", "simple-marker", selectTypeMain, urlTemp, whereMy, outFields, view);
        }
    }

    /**
     * 绘制水流方向对比之后的结果
     * @param {*} allData 对比后的管道结果
     * @param {*} layer 绘制的图层
     * @param {*} isDisplays 是否绘制的数组
     * @param {*} limits 限制数组
     * @param {*} lineColors 管线的颜色数组
     * @param {*} lineSize 管线的宽度数组
     * @param {*} triangleColor 三角形的颜色
     * @param {*} triangleSize 三角形的宽度
     */
    DrawDirectionChange(allData,layer,isDisplays,limits,lineColors,lineSize,triangleColor,triangleSize){
        for(var i=0;i<allData.length;i++){//allData.length
            var obj = allData[i];
            var path = new Array();
            for (var j = 0; j < obj.Coordinate.length; j++) {
                var objTemp = obj.Coordinate[j];
                var pathTemp = new Array();
                pathTemp.push(objTemp.X)
                pathTemp.push(objTemp.Y)
                path.push(pathTemp);
            }
            var pathMain = new Array();
            pathMain.push(path);
            var line = new esriApi.Polyline({
                "paths": [],
                "spatialReference": { "wkid": global.spatialReference }
            });
            line.paths = pathMain;
            for(var j=0;j<limits.length-1;j++)
            {
                if(obj.Velocity>limits[j]&&obj.Velocity<=limits[j+1])
                {
                    if(isDisplays[j])
                    {
                        var gl = this.DrawLineGraphic(lineSize[j],lineColors[j],line);
                        layer.add(gl);
                        //this.DrawOneTriangle(layer,line,obj.Flow,triangleSize,triangleColor);
                    }
                }
            }
        }
    }

    DrawPlanTempCalDirectionChange(allData,layer,lineColor,lineSize,triangleColor,triangleSize){
        for(var i=0;i<allData.length;i++){//allData.length
            var obj = allData[i];
            var path = new Array();
            for (var j = 0; j < obj.Coordinate.length; j++) {
                var objTemp = obj.Coordinate[j];
                var pathTemp = new Array();
                pathTemp.push(objTemp.X)
                pathTemp.push(objTemp.Y)
                path.push(pathTemp);
            }
            var pathMain = new Array();
            pathMain.push(path);
            var line = new esriApi.Polyline({
                "paths": [],
                "spatialReference": { "wkid": global.spatialReference }
            });
            line.paths = pathMain;
            var gl = this.DrawLineGraphic(lineSize,lineColor,line);
            layer.add(gl);
            //this.DrawOneTriangle(layer,line,obj.Flow,triangleSize,triangleColor);
        }
    }
    /**
     * 绘制单个三角形
     * @param {*} layer 要绘制的图层
     * @param {*} path 单个管道的坐标数组
     * @param {*} flow 管道流量
     * @param {*} size 尺寸
     * @param {*} color 颜色
     */
    DrawOneTriangle(layer,pathsTemp,flow,size,color){
        var path = pathsTemp.paths[0];
        var fromP = path[0];
        var toP = path[1];
        if(fromP[0]==toP[0]&&fromP[1]==toP[1])
        {
            toP = path[2];
        }
        var fx, fy, tx, ty, angle;

        if (flow > 0) {
            fx = fromP[0];
            fy = fromP[1];
            tx = toP[0];
            ty = toP[1]
        }
        else if (flow < 0) {
            fx = toP[0];
            fy = toP[1];
            tx = fromP[0];
            ty = fromP[1]
        }
        else {
            return;
        }
        var midX = (Number(fx) + Number(tx)) / 2;
        var midY = (Number(fy) + Number(ty)) / 2;
        if (fx >= tx && fy > ty)//第二象限
        {
            angle = (Math.atan((fx - tx) / (fy - ty)) * 180 / Math.PI) + 180 - 180;
        }
        else if (fx < tx && fy >= ty)//第一象限
        {
            angle = 180 - (Math.atan((tx - fx) / (fy - ty)) * 180 / Math.PI) - 180;
        }
        else if (fx <= tx && fy < ty)//第三象限
        {
            angle = Math.atan((tx - fx) / (ty - fy)) * 180 / Math.PI - 180;
        }
        else {
            angle = 360 - (Math.atan((fx - tx) / (ty - fy)) * 180 / Math.PI) - 180;
        }
        PictureProperty.SVGArrow.color = color;
        PictureProperty.SVGArrow.size = size;
        var gra1 = this.CreateSVGGraphic(PictureProperty.SVGArrow, angle, new esriApi.Point(Number(midX), Number(midY), new esriApi.SpatialReference({ wkid: global.spatialReference })));
        layer.add(gra1);
    }

    DrawPlanNode(resultData,layer,map){
        console.log("服务返回数据条数：",resultData.length);
        if(resultData.length <= 0) return;
        var minX = resultData[0].X;
        var maxX = resultData[0].X;
        var minY = resultData[0].Y;
        var maxY = resultData[0].Y;
        for(var i=0;i<resultData.length;i++)
        {
            var obj = resultData[i];
            var point = esriApi.Point(obj.X,obj.Y,new esriApi.SpatialReference({ wkid: global.spatialReference }));
            var gra1;
            gra1 = this.DrawPointGraphic(10,"#EE1289",point,obj);
            layer.add(gra1)
            if(minX>obj.X)
            minX = obj.X;
            if(minY>obj.Y)
            minY = obj.Y;
            if(maxX<obj.X)
            maxX = obj.X;
            if(maxY<obj.Y)
            maxY = obj.Y;
        }
        var extent = new esriApi.Extent(minX-200, minY-200, maxX+200, maxY+200,new esriApi.SpatialReference({ wkid: global.spatialReference }));
        map.extent = extent;
    }

    DrawPlanNodeLevel(resultData,layer,map,levelValue){
        console.log("服务返回数据条数：",resultData.length);
        if(resultData.length <= 0) return;
        var minX = resultData[0].X;
        var maxX = resultData[0].X;
        var minY = resultData[0].Y;
        var maxY = resultData[0].Y;
        for(var i=0;i<resultData.length;i++)
        {
            var obj = resultData[i];
            var point = esriApi.Point(obj.X,obj.Y,new esriApi.SpatialReference({ wkid: global.spatialReference }));
            var gra1;
            var value = Number(obj.Change);
            for(var j=0;j<levelValue.length-1;j++){
                var min = Number(levelValue[j]);
                var max = Number(levelValue[j+1]);
                if(min<=value&&value<=max){
                    gra1 = this.DrawPointGraphic(10,global.pressureChangColor[j],point,obj);
                    break;
                }
            }
            layer.add(gra1)
            if(minX>obj.X)
            minX = obj.X;
            if(minY>obj.Y)
            minY = obj.Y;
            if(maxX<obj.X)
            maxX = obj.X;
            if(maxY<obj.Y)
            maxY = obj.Y;
        }
        var extent = new esriApi.Extent(minX-200, minY-200, maxX+200, maxY+200, new esriApi.SpatialReference({ wkid: global.spatialReference }));
        map.extent = extent;
    }
    DrawPlanPipeLevel(resultData,layer,map,levelValue){
        console.log("服务返回数据条数：",resultData.length);
        if(resultData.length <= 0) return;
        var minX = Number(resultData[0].Coordinate[0].X);
        var maxX = Number(resultData[0].Coordinate[0].X);
        var minY = Number(resultData[0].Coordinate[0].Y);
        var maxY = Number(resultData[0].Coordinate[0].Y);
        for(var i=0;i<resultData.length;i++)
        {
            var obj = resultData[i];
            var path = new Array();
            for (var j = 0; j < obj.Coordinate.length; j++) {
                var objTemp = obj.Coordinate[j];
                var pathTemp = new Array();
                pathTemp.push(objTemp.X)
                pathTemp.push(objTemp.Y)
                path.push(pathTemp);

                var xTemp = Number(objTemp.X);
                var yTemp = Number(objTemp.Y);

                if(minX>xTemp)
                minX = xTemp;
                if(minY>yTemp)
                minY = yTemp;
                if(maxX<xTemp)
                maxX = xTemp;
                if(maxY<yTemp)
                maxY = yTemp;
            }
            var pathMain = new Array();
            pathMain.push(path);
            var line = new esriApi.Polyline({
                "paths": [],
                "spatialReference": { "wkid": global.spatialReference }
            });
            line.paths = pathMain;
            var widthTemp = 4;
            var value = Number(obj.Flow);
            var gra1;
            for(var j=0;j<levelValue.length-1;j++){
                var min = Number(levelValue[j]);
                var max = Number(levelValue[j+1]);
                if(min<=value&&value<=max){
                    if(j==levelValue.length-1)
                    gra1 = this.DrawLineGraphic(widthTemp, global.pressureChangColor[j], line);
                    break;
                }
            }
            layer.add(gra1)
        }
        var extent = new esriApi.Extent(minX-200, minY-200, maxX+200, maxY+200, new esriApi.SpatialReference({ wkid: global.spatialReference }));
        map.extent = extent;
    }

    DrawPlanPipe(resultData,layer,map){
        console.log("服务返回数据条数：",resultData.length);
        if(resultData.length <= 0) return;
        var minX = Number(resultData[0].Coordinate[0].X);
        var maxX = Number(resultData[0].Coordinate[0].X);
        var minY = Number(resultData[0].Coordinate[0].Y);
        var maxY = Number(resultData[0].Coordinate[0].Y);
        for(var i=0;i<resultData.length;i++)
        {
            var obj = resultData[i];
            var path = new Array();
            for (var j = 0; j < obj.Coordinate.length; j++) {
                var objTemp = obj.Coordinate[j];
                var pathTemp = new Array();
                pathTemp.push(objTemp.X)
                pathTemp.push(objTemp.Y)
                path.push(pathTemp);

                var xTemp = Number(objTemp.X);
                var yTemp = Number(objTemp.Y);

                if(minX>xTemp)
                minX = xTemp;
                if(minY>yTemp)
                minY = yTemp;
                if(maxX<xTemp)
                maxX = xTemp;
                if(maxY<yTemp)
                maxY = yTemp;
            }
            var pathMain = new Array();
            pathMain.push(path);
            var line = new esriApi.Polyline({
                "paths": [],
                "spatialReference": { "wkid": global.spatialReference }
            });
            line.paths = pathMain;
            var widthTemp = 4;
            var gra1 = this.DrawLineGraphic(widthTemp, '#EE1289', line);
            layer.add(gra1)
        }
        var extent = new esriApi.Extent(minX-200, minY-200, maxX+200, maxY+200, new esriApi.SpatialReference({ wkid: global.spatialReference }));
        map.extent = extent;
    }

    DrawPlanPipeDirection(resultData,layer,map){
        console.log("服务返回数据条数：",resultData.length);
        if(resultData.length <= 0) return;
        var minX = Number(resultData[0].Coordinate[0].X);
        var maxX = Number(resultData[0].Coordinate[0].X);
        var minY = Number(resultData[0].Coordinate[0].Y);
        var maxY = Number(resultData[0].Coordinate[0].Y);
        for(var i=0;i<resultData.length;i++)
        {
            var obj = resultData[i];
            var path = new Array();
            for (var j = 0; j < obj.Coordinate.length; j++) {
                var objTemp = obj.Coordinate[j];
                var pathTemp = new Array();
                pathTemp.push(objTemp.X)
                pathTemp.push(objTemp.Y)
                path.push(pathTemp);

                var xTemp = Number(objTemp.X);
                var yTemp = Number(objTemp.Y);

                if(minX>xTemp)
                minX = xTemp;
                if(minY>yTemp)
                minY = yTemp;
                if(maxX<xTemp)
                maxX = xTemp;
                if(maxY<yTemp)
                maxY = yTemp;
            }
            var pathMain = new Array();
            pathMain.push(path);
            var line = new esriApi.Polyline({
                "paths": [],
                "spatialReference": { "wkid": global.spatialReference }
            });
            line.paths = pathMain;
            var widthTemp = 4;
            var gra1 = this.DrawLineGraphic(widthTemp, '#EE1289', line);
            layer.add(gra1)
            this.DrawOneTriangle(layer,line,obj.Flow,10,"#0000ff");
        }
        var extent = new esriApi.Extent(minX-200, minY-200, maxX+200, maxY+200, new esriApi.SpatialReference({ wkid: global.spatialReference }));
        map.extent = extent;
    }

    DrawPlanFocusPressure(data,layer,mapObj,dialog){
        for(var i=0;i<data.length;i++){
            var obj = data[i];
            var point = esriApi.Point(obj.X, obj.Y, new esriApi.SpatialReference({ wkid: global.spatialReference }));
            var gra1 = this.CreatePictureGraphic(PictureProperty.redNodePin, point,obj);
            layer.add(gra1)
        }
        dialog.startup();
        map.on("click", function (e) {
            if(e.button != 0){ return}
            map.hitTest(e).then(function(response){
                if(response.results[0]){
                    var graphic = response.results[0].graphic;
                    if (graphic.layer.id == layer.id) {
                        WindowsEvent.MyDispatchEvent("MonitorOnlySelect",graphic.attributes);
                        e.stopPropagation();
                    }
                }
            })
        });
        map.on("pointer-move", function (e) {
            map.hitTest(e).then(function(response){
                if(response.results[0]){
                    var graphic = response.results[0].graphic;
                    if (graphic.layer.id == layer.id) {
                        var obj = graphic.attributes;
                        if (obj) {
                            var t = "<b>压力表:"+obj.Label+"</b>";
                            dialog.setContent(t);
                            mapObj.domStyle.set(dialog.domNode, "opacity", 0.85);
                            var pt = map.toScreen(graphic.geometry);
                            mapObj.popup.open({
                                popup: dialog,
                                // x: pt.x + 60,
                                // y: pt.y + 87
                                x: e.x + 60,
                                y: e.y + 87
                            });
                        }
                        e.stopPropagation();
                    }
                }else{
                    closeDialog();
                }
            })
        });
        function closeDialog() {
            mapObj.popup.close(dialog);
        }
    }

    DrawPlanFocusDemand(data,layer,mapObj,dialog){
        for(var i=0;i<data.length;i++){
            var obj = data[i];
            var point = esriApi.Point(obj.X, obj.Y, new esriApi.SpatialReference({ wkid: global.spatialReference }));
            var gra1 = this.CreatePictureGraphic(PictureProperty.blueNodePin, point,obj);
            layer.add(gra1)
        }

        dialog.startup();
        map.on("click", function (e) {
            if(e.button != 0){ return}
            map.hitTest(e).then(function(response){
                if(response.results[0]){
                    var graphic = response.results[0].graphic;
                    if (graphic.layer.id == layer.id) {
                        WindowsEvent.MyDispatchEvent("MonitorOnlySelect",graphic.attributes);
                        e.stopPropagation();
                    }
                }
            })
        });
        map.on("pointer-move", function (e) {
            map.hitTest(e).then(function(response){
                if(response.results[0]){
                    var graphic = response.results[0].graphic;
                    if (graphic.layer.id == layer.id) {
                        var obj = graphic.attributes;
                        if (obj) {
                            var t = "<b>流量表:"+obj.Label+"</b>";
                            dialog.setContent(t);
                            mapObj.domStyle.set(dialog.domNode, "opacity", 0.85);
                            var pt = map.toScreen(graphic.geometry);
                            mapObj.popup.open({
                                popup: dialog,
                                // x: pt.x + 60,
                                // y: pt.y + 87
                                x: e.x + 60,
                                y: e.y + 87
                            });
                        }
                        e.stopPropagation();
                    }
                }else{
                    closeDialog();
                }
            })
        });
        function closeDialog() {
            mapObj.popup.close(dialog);
        }
    }

    SearchPosition(obj,layer,map){
        var point = esriApi.Point(Number(obj.X), Number(obj.Y), new esriApi.SpatialReference({ wkid: global.spatialReference }));
        var gra1 = this.CreatePictureGraphic(PictureProperty.redNodePin, point,obj);
        gra1.id = "SearchPosition";
        layer.add(gra1);
        var extent = new esriApi.Extent(Number(obj.X)-200, Number(obj.Y)-200, Number(obj.X)+200, Number(obj.Y)+200,
            new esriApi.SpatialReference({ wkid: global.spatialReference }));
        map.center = point;
        map.extent = extent;
    }

     /***
     * 用户聚合
     */
    DrawCustomer(map,dataTemp){
        var data = new Array();
        for (var i = 0; i < dataTemp.features.length; i++) {//遍历查询的图层结果集合,构造聚合效果的数据源
            var info = {};
            var latlng = dataTemp.features[i].geometry;
            var webMercator =  esriApi.geographicToWebMercator(latlng);//地理坐标系必须要转换摩卡托的投影坐标系,不然聚合没效果
            info.x = webMercator.x;
            info.y = webMercator.y;
            info.attributes = dataTemp.features[i].attributes;//气泡窗口模型的属性
            data.push(info);
        }
         // cluster layer that uses OpenLayers style clustering
         var clusterLayer = new extras.ClusterLayer({
            "data": data,
            "distance": 100,
            "id": "clusters",
            "labelColor": "#fff",
            "labelOffset": 10,
            "resolution": map.extent.getWidth() / map.width,
            "singleColor": "#888",
            /* "singleTemplate": popupTemplate */
          });
          var defaultSym = new SimpleMarkerSymbol({size: 4});
          var renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");

          var picBaseUrl = "https://static.arcgis.com/images/Symbols/Shapes/";
          var blue = new PictureMarkerSymbol({ url: picBaseUrl + "BluePin1LargeB.png", width: 32, height: 32, xoffset: 0, yoffset:15});
          var green = new PictureMarkerSymbol({ url: picBaseUrl + "GreenPin1LargeB.png", width: 64, height: 64, xoffset: 0, yoffset:15});
          var red = new PictureMarkerSymbol({ url: picBaseUrl + "RedPin1LargeB.png", width: 72, height: 72, xoffset: 0, yoffset:15});
          renderer.addBreak(0, 2, blue);
          renderer.addBreak(2, 200, green);
          renderer.addBreak(200, 1001, red);
          clusterLayer.setRenderer(renderer);
          map.addLayer(clusterLayer);
    }
}
export default new Methods()