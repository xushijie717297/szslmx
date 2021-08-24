import urlClass from './UrlClass'
import global from './Global'
import drawClass from '../arcgisforjsTest/DrawClass'
// import WindowsEvent from '@/components/js/WindowsEvent'
// import TopologyUtility from '@/components/js/DrawTool/TopologyUtility'
// import {Message, MessageBox} from 'element-ui'
var oldSelect = false;
var isClickDraw = false;
var sketchVM;
var isEdit = false;
var isHaveNode = false;
var tolerance = 0.01;
var allPipesGraphics = [];
var allNodesGraphics = [];
var allValvesGraphics = [];
var mapPoint = "";
var trackingMode = false;
var trackingType = -1;
var hooked = false;
var hookedType = 0;
var hookedElementID = 0;
var hookedPoint = 0;
var hookedGraphic = 0;
var selectedGraphic = null;
var selectedElementType = 0;
var selectedElementId = 0;
var selectedLinksToNode = [];
var mouseHold = false;
var tempPipeRecord = [];
var fmNumber = 0;
var tankNumber = 0;
var nodeNumber = 0;
var pipeNumber = 0;
var hookedSplitNewID = "";
var hookedStartNodeID = "";
var hookedEndNodeID = "";
var hookedPipeDiameter = 0;
var hookedPipeC = 0;
var Default_Diameter = 100;
var Default_C = 120;
var juncAddedGraphicArr = [];
var pipeAddedGraphicArr = [];
var deletedModelPipeIDArr = [];
var deletedModelPipeGraphicArr = [];
var drawToolGraphicsLayerArray = [];
var tempFormingDataList = [];
var _editResult = new Object();
var isFirst = false;
var nodePoint = new Object();
var esriApi = {};

class Methods {

    setArcgisforAPI(_obj){
        esriApi = _obj;
        // TopologyUtility.setArcgisforAPI(esriApi);
    }

    MouseDown(geometry, errorMy, map) {
        var line = geometry;
        mapPoint = geometry;
        var mapPointTempMy = geometry;
        hooked = false;
        if (!hooked) {
            if (trackingType == 2 || trackingType == 3||trackingType == 4) {
                //checking if hook a junction
                for (var graphicTemp of allNodesGraphics) {
                    if (graphicTemp != null) {
                        if (TopologyUtility.Offset(mapPoint, graphicTemp.geometry) < errorMy) {
                            var elementID = graphicTemp.attributes.ElementId;
                            hooked = true;
                            hookedType = graphicTemp.attributes.Type == "节点" ? 2 :(graphicTemp.attributes.Type == "阀门" ?3:4);
                            hookedElementID = elementID;
                            hookedPoint = graphicTemp.geometry;
                            hookedGraphic = graphicTemp;
                            if (!trackingMode) {
                                if (selectedGraphic != null)
                                    selectedGraphic.filters = [];
                                selectedGraphic = hookedGraphic;
                                selectedElementType = graphicTemp.attributes.Type == "节点" ? 2 :(graphicTemp.attributes.Type == "阀门" ?3:4);
                                selectedElementId = elementID;
                                var linkedPipes = new Object();
                                this.GetLinkedPipes(elementID, linkedPipes);
                                mouseHold = true;
                                map.isMapNavigation = false;
                            }
                            else {
                                //if input a pipe
                                if (trackingType == 1) {
                                    if (tempPipeRecord.length < 1 || hookedPoint.x != tempPipeRecord[tempPipeRecord.length - 1].Point.x || hookedPoint.y != tempPipeRecord[tempPipeRecord.length - 1].Point.y) {
                                        var data = new Object();
                                        data.Hooked = true;
                                        data.HookedType = hookedType;
                                        data.Point = hookedPoint;
                                        data.ElementId = elementID;
                                        data.HookedGraphic = hookedGraphic;
                                        tempPipeRecord.push(data);
                                    }
                                }
                            }
                            return;
                        }
                    }
                }
            }
        }
        if (!hooked) {
            //checking if hook a pipe
            if(this.GetHookedPipeRecord(mapPointTempMy, line, errorMy)){
                return;
            }
        }
        if (!trackingMode) {
            selectedGraphic = null;
            selectedElementType = -1;
            selectedElementId = "";
        }
    }
    IsRepeatPipeRecord(pointTemp, foot, errorMy){
        for (var i = (tempPipeRecord.length - 1); i > -1; i--) {
            var data = tempPipeRecord[i];
            if (data.Hooked) {
                if (data.hasOwnProperty("HookedPipeElementID") && data.HookedPipeElementID != "") {
                    if (data.HookedType == 1){
                        var splitResult = new Object();
                        if (TopologyUtility.Split(data.Point, data.HookedGraphic.geometry, splitResult)) {
                            if(TopologyUtility.PtOnPolyline(splitResult.polyline1, pointTemp, foot, errorMy)){
                                return splitResult.polyline1;
                            }else if(TopologyUtility.PtOnPolyline(splitResult.polyline2, pointTemp, foot, errorMy)){
                                return splitResult.polyline2;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
    GetHookedPipeRecord(mapPointTempMy, line, errorMy){
        let isBool = false;
        var linePath = [];
        if(trackingType == 1){
            linePath = line.paths[0];
        }else{
            linePath.push([mapPointTempMy.x,mapPointTempMy.y]);
        }
        for (var i = 0; i < linePath.length; i++) {
            var pointTemp = new esriApi.Point({x: linePath[i][0], y: linePath[i][1], spatialReference: new esriApi.SpatialReference({ wkid: global.spatialReference })});
            for (var j = 0; j < allPipesGraphics.length; j++) {
                var graphic = allPipesGraphics[j];
                if (graphic != null) {
                    var foot = new Object();
                    if(TopologyUtility.PtOnPolyline(graphic.geometry, pointTemp, foot, errorMy)){
                        isBool = true;
                        var elementID = graphic.attributes.ElementId;
                        hookedType = 1;
                        hooked = true;
                        hookedElementID = elementID;
                        hookedStartNodeID = graphic.attributes.StartNodeID;
                        hookedEndNodeID = graphic.attributes.EndNodeID;
                        hookedPoint = foot.value;
                        hookedGraphic = graphic.clone();
                        hookedPipeDiameter = graphic.attributes.Physical_PipeDiameter;
                        hookedPipeC = graphic.attributes.Physical_HazenWilliamsC;
                        var repeatGraphic = this.IsRepeatPipeRecord(pointTemp, foot, errorMy);
                        if (repeatGraphic) {
                            hookedPoint = foot.value;
                            hookedGraphic.geometry = repeatGraphic;
                        }
                        if(trackingType == 2){
                            hookedSplitNewID = "J" + (nodeNumber++).toString();
                        }
                        if(trackingType == 3){
                            hookedSplitNewID = "F" + (fmNumber++).toString();
                        }
                        if(trackingType == 4){
                            hookedSplitNewID = "T" + (tankNumber++).toString();
                        }
                        if (!trackingMode) {
                            selectedGraphic = hookedGraphic;
                            selectedElementType = 1;
                            selectedElementId = elementID;
                        }else {
                            if (trackingType == 1) {
                                this.GetHookedNodesRecord(pointTemp, errorMy, true);
                            }
                        }
                        break;
                    }else if(j == (allPipesGraphics.length - 1)){
                        if (trackingType == 1) {
                            this.GetHookedNodesRecord(pointTemp, errorMy, false);
                        }
                    }
                }
            }
            if (allPipesGraphics.length == 0) {
                if (trackingType == 1) {
                    this.GetHookedNodesRecord(pointTemp, errorMy, false);
                }
            }
        }
        return isBool;
    }
    GetHookedNodesRecord(pointTemp, errorMy, isHooked){
        for (var index = 0; index < allNodesGraphics.length; index++) {
            var graphicTemp = allNodesGraphics[index];
            if (graphicTemp != null) {
                if (TopologyUtility.Offset(pointTemp, graphicTemp.geometry) < errorMy) {
                    var data = new Object();
                    data.Hooked = false;
                    data.HookedType = hookedType;
                    data.Point = hookedPoint;
                    data.Point = pointTemp;
                    data.ElementId = graphicTemp.attributes.ElementId;
                    data.HookedPipeElementID = hookedElementID;
                    data.HookedStartNodeId = hookedStartNodeID;
                    data.HookedEndNodeId = hookedEndNodeID;
                    data.HookedGraphic = hookedGraphic;
                    data.HookedPipeDiameter = hookedPipeDiameter;
                    data.HookedPipeC = hookedPipeC;
                    tempPipeRecord.push(data);
                    break;
                }
                if (index == allNodesGraphics.length - 1) {
                    var data = new Object();
                    data.Hooked = isHooked;
                    data.HookedType = hookedType;
                    data.Point = hookedPoint;
                    data.Point = pointTemp;
                    hookedSplitNewID = "J" + (nodeNumber++).toString();
                    data.ElementId = hookedSplitNewID;
                    data.HookedPipeElementID = hookedElementID;
                    data.HookedStartNodeId = hookedStartNodeID;
                    data.HookedEndNodeId = hookedEndNodeID;
                    data.HookedGraphic = hookedGraphic;
                    data.HookedPipeDiameter = hookedPipeDiameter;
                    data.HookedPipeC = hookedPipeC;
                    tempPipeRecord.push(data);
                }
            }
        }
    }
    GetLinkedPipes(elementID, result) {
        var elements = [];
        if (elementID != "") {
            for (var i = 0; i < allPipesGraphics.length; i++) {
                var attr = allPipesGraphics[i].attributes;
                var rec = new Object();
                if (String(attr["StartNodeID"]) == elementID) {
                    rec.PipeElementID = String(attr["ElementId"]);
                    rec.Graphic = allPipesGraphics[i];
                    elements.push(rec);
                }
                if (String(attr["EndNodeID"]) == elementID) {
                    rec.PipeElementID = String(attr["ElementId"]);
                    rec.Graphic = allPipesGraphics[i];
                    elements.push(rec);
                }
            }
        }
        result.data = elements;
    }
    MoveNode(event, _view, errorMy, hightLightLayer) {
        try {
            var pt = _view.toMap({x: event.x, y: event.y});
            for (var graphicTemp of allNodesGraphics) {
                if (graphicTemp != null) {
                    if (TopologyUtility.Offset(pt, graphicTemp.geometry) < errorMy) {
                        var highlightGraphic = (graphicTemp.clone());
                        var symbol = new esriApi.SimpleMarkerSymbol({size: 10, color: new esriApi.Color("#00ff00")});
                        highlightGraphic.symbol = symbol;
                        hightLightLayer.add(highlightGraphic);
                        isHaveNode = true;
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    MovePipe(event, _view, errorMy, hightLightLayer) {
        try {
            var pt = _view.toMap({x: event.x, y: event.y});
            for (var graphicTemp of allPipesGraphics) {
                if (graphicTemp != null) {
                    var foot = new Object();
                    if (TopologyUtility.PtOnPolyline(graphicTemp.geometry, pt, foot, errorMy)) {
                        var paths = graphicTemp.geometry.paths[0];
                        var point1 = new esriApi.Point(paths[0][0], paths[0][1], new esriApi.SpatialReference({ wkid: global.spatialReference }));
                        var point2 = new esriApi.Point(paths[paths.length-1][0], paths[paths.length-1][1], new esriApi.SpatialReference({ wkid: global.spatialReference }));
                        if (TopologyUtility.Offset(pt, point1) > errorMy&&TopologyUtility.Offset(pt, point2) > errorMy){
                            var highlightGraphic = (graphicTemp.clone());
                            var markerSymbol = new esriApi.SimpleLineSymbol({width: 5, color: new esriApi.Color("#00ff00"), cap: "round"});
                            highlightGraphic.symbol = markerSymbol;
                            hightLightLayer.add(highlightGraphic);
                            isHaveNode = true;
                            return;
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    InitNumber(fmNumberTemp,nodeNumberTemp,pipeNumberTemp){
        fmNumber = fmNumberTemp+1;
        nodeNumber = nodeNumberTemp+1;
        pipeNumber =  pipeNumberTemp+1;
        tankNumber = nodeNumberTemp+1;
    }

    InitDeletePipe(deletePipeTemp){
        for(var i=0;i<deletePipeTemp.length;i++){
            var obj = deletePipeTemp[i];
            deletedModelPipeGraphicArr.push(obj);
            deletedModelPipeIDArr.push(obj.ElementId);
            tempFormingDataList.push(obj);
            global.DelPipes.push(Number(obj.ElementId));
        }
        
    }

    createToolbar(AddType, hightLightLayer, map, errorMy,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer, deletedline, displayline) {
        var self = this;
        isFirst = false
        tempFormingDataList = [];
        global.DelPipes = [];
        global.AddNodes = [];
        global.AddPipes = [];
        pipeNumber = 0;
        nodeNumber = 0;
        fmNumber = 0;
        tankNumber = 0;
        sketchVM = new esriApi.SketchViewModel({
            view: map,
            layer: drawToolGraphicsLayer,
            updateOnGraphicClick: false,
            defaultUpdateOptions: {
                tool: "reshape",
                toggleToolOnClick: false
            },
            pointSymbol: {
                type: "simple-marker",
                style: "circle",
                color: "#ff0000",
                size: 10
            },
            polylineSymbol: {
                type: "simple-line",
                color: "#ff0000",
                width: 5,
                style: "solid"
            }
        });
        sketchVM.updatePolylineSymbol.width = 5;
        sketchVM.on("create", function(evt) {
            if (evt.state === "complete") {
                self.addToMap(evt, AddType, hightLightLayer, map, errorMy,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer, deletedline, displayline);
            }
        });
        sketchVM.on("update", function(evt) {
            if (evt.toolEventInfo) {
                const toolType = evt.toolEventInfo.type;
                switch (toolType) {
                    case "reshape-stop":
                        self.editVertexMoveStop(evt, drawToolGraphicsLayer, errorMy);
                        break;
                    case "move-stop":
                        self.editGraphicMoveStop(evt, drawToolGraphicsLayer);
                        break;
                    case "vertex-add":
                        self.editVertexAdd(evt, drawToolGraphicsLayer);
                        break;
                    case "vertex-remove":
                        self.editVertexRemove(evt, drawToolGraphicsLayer);
                        break;
                }
            }
        });

        map.on("click",function(e){
            if(e.button != 0){ return}
            map.hitTest(e).then(function(response){
                if(response.results[0]){
                    var graphic = response.results[0].graphic;
                    if (graphic.layer.id == drawToolGraphicsLayer.id) {
                        if (!self.isEdit()) {
                            e.stopPropagation();
                            self.InfoWindowsShow(e, graphic, errorMy);
                        }
                    }
                }
            })
        });
    }

    isEditRemove(graphic, removePoint){
        var isBool = false;
        var removePointX = removePoint[0][0];
        var removePointY = removePoint[0][1];
        var dataTemp = graphic.attributes;
        for (let i = 0; i < dataTemp.CoordinateX.length; i++) {
            const xTemp = dataTemp.CoordinateX[i];
            const yTemp = dataTemp.CoordinateY[i];
            if (removePointX == xTemp && removePointY == yTemp) {
                if (i != 0 && i != dataTemp.CoordinateX.length - 1) {
                    isBool = true;
                }
                break;
            }
        }
        return isBool;
    }

    isEditAdd(graphic){
        var isBool = false;
        var dataTemp = graphic.attributes;
        if (dataTemp.CoordinateX.length < graphic.geometry.paths[0].length) {
            isBool = true;
        }
        return isBool;
    }

    isEditCancel(graphic, errorMy){
        var isBool = true;
        var dataTemp = graphic.attributes;
        var nodeID = dataTemp.StartNodeID;
        for (var k = 0; k < dataTemp.CoordinateX.length; k++) {
            var CoordinateX = dataTemp.CoordinateX[k];
            var graPoint = graphic.geometry.paths[0][k][0];
            if (CoordinateX != graPoint) {
                if (dataTemp.CoordinateX.length > 2) {
                    if (k == dataTemp.CoordinateX.length - 1) {
                        nodeID = dataTemp.EndNodeID;
                    }else{
                        if (k != 0) {
                            isBool = false;
                        }
                    }
                }else{
                    if (k > 0) {
                        nodeID = dataTemp.EndNodeID;
                    }
                }
                break;
            }
        }
        if (isBool) {
            for (var i = juncAddedGraphicArr.length - 1; i > -1; i--) {
                var item = juncAddedGraphicArr[i].attributes;
                if (item.ElementId == nodeID) {
                    var foot = new Object();
                    var mapPointTempMy = juncAddedGraphicArr[i].geometry;
                    if (!TopologyUtility.PtOnPolyline(graphic.geometry, mapPointTempMy, foot, errorMy)) {
                        isBool = false;
                    }
                    break;
                }
            }
        }
        return isBool;
    }

    setEditCancelAttribute(elementId, graphicsArr){
        for (var i = graphicsArr.length - 1; i > -1; i--) {
            var graphic = graphicsArr[i];
            var item = graphic.attributes;
            if (item.ElementId == elementId) {
                var rings = [];
                for (let p = 0; p < item.CoordinateX.length; p++) {
                    const ring = [];
                    const itemTempX = item.CoordinateX[p];
                    const itemTempY = item.CoordinateY[p];
                    ring.push(itemTempX);
                    ring.push(itemTempY);
                    rings.push(ring);
                }
                var graTemp = graphic.geometry.clone();
                graTemp.paths[0] = rings;
                graphic.geometry = graTemp;
                sketchVM.complete();
                break;
            }
        }
    }

    setEditVertexMoveAttribute(isEditRef, isNode, maxCount, elementId , vertexPoint, nodeID, ptC, isBetween, graphicsArr){
        var setCount = 0;
        maxCount = isEditRef ? maxCount : (maxCount - 2);
        maxCount = isNode ? 0 : maxCount;
        if (maxCount < 0) {
            return setCount;
        }
        for (var i = graphicsArr.length - 1; i > -1; i--) {
            if (!isEditRef && setCount > maxCount) {
                break;
            }
            var item = graphicsArr[i].attributes;
            if (!isNode && item.ElementId == elementId) {
                item.CoordinateX[ptC] = vertexPoint.x;
                item.CoordinateY[ptC] = vertexPoint.y;
                setCount ++;
            }else if ((isEditRef || isNode) && !isBetween && item.ElementId == nodeID) {
                item.CoordinateX = vertexPoint.x;
                item.CoordinateY = vertexPoint.y;
                item.X = vertexPoint.x;
                item.Y = vertexPoint.y;
                item.x = vertexPoint.x;
                item.y = vertexPoint.y;
                item.geometry.x = vertexPoint.x;
                item.geometry.y = vertexPoint.y;
                graphicsArr[i].geometry = vertexPoint.clone();
                setCount ++;
            }else if(!isNode && !isBetween && item.StartNodeID == nodeID){
                item.CoordinateX[0] = vertexPoint.x;
                item.CoordinateY[0] = vertexPoint.y;
                if (isEditRef) {
                    var graEndTemp = graphicsArr[i].geometry.clone();
                    var graPointEndTemp = graEndTemp.paths[0][0];
                    graPointEndTemp[0] = vertexPoint.x;
                    graPointEndTemp[1] = vertexPoint.y;
                    graphicsArr[i].geometry = graEndTemp;
                }
                setCount ++;
            }else if(!isNode && !isBetween && item.EndNodeID == nodeID){
                item.CoordinateX[item.CoordinateX.length-1] = vertexPoint.x;
                item.CoordinateY[item.CoordinateX.length-1] = vertexPoint.y;
                if (isEditRef) {
                    var graStartTemp = graphicsArr[i].geometry.clone();
                    var graPointStartTemp = graStartTemp.paths[0][item.CoordinateX.length-1];
                    graPointStartTemp[0] = vertexPoint.x;
                    graPointStartTemp[1] = vertexPoint.y;
                    graphicsArr[i].geometry = graStartTemp;
                }
                setCount ++;
            }
        }
        return setCount;
    }

    editVertexMoveStop(evt, drawToolGraphicsLayer, errorMy){
        var graphic = evt.graphics[0];
        var dataTemp = graphic.attributes;
        var isAdd = this.isEditAdd(graphic);
        if (isAdd) {
            this.editVertexAdd(evt, drawToolGraphicsLayer);
        } else {
            var isCancel = this.isEditCancel(graphic, errorMy);
            if(isCancel){
                this.setEditCancelAttribute(dataTemp.ElementId, drawToolGraphicsLayer.graphics.items);
                this.setEditCancelAttribute(dataTemp.ElementId, pipeAddedGraphicArr);
                this.setEditCancelAttribute(dataTemp.ElementId, allPipesGraphics);
            }else{
                var vertexPoint = evt.toolEventInfo.mover.geometry;
                var nodeID = dataTemp.StartNodeID, ptC = 0, isBetween = false;
                for (var l = 0; l < dataTemp.CoordinateX.length; l++) {
                    var CoordinateX = dataTemp.CoordinateX[l];
                    var graPoint = graphic.geometry.paths[0][l][0];
                    if (CoordinateX != graPoint) {
                        if (dataTemp.CoordinateX.length > 2) {
                            if (l == dataTemp.CoordinateX.length - 1) {
                                nodeID = dataTemp.EndNodeID;
                            }
                            if (0 < l && l < dataTemp.CoordinateX.length - 1) {
                                isBetween = true;
                            }
                        }else{
                            if (l > 0) {
                                nodeID = dataTemp.EndNodeID;
                            }
                        }
                        ptC = l;
                        break;
                    }
                }
                var maxCount = isBetween ? 0 : 4;//初始基于最大四通管加一个连接节点设置(现已内置max)
                maxCount = this.setEditVertexMoveAttribute(true, false, maxCount, dataTemp.ElementId, vertexPoint, nodeID, ptC, isBetween, drawToolGraphicsLayer.graphics.items);
                this.setEditVertexMoveAttribute(false, true, maxCount, dataTemp.ElementId, vertexPoint, nodeID, ptC, isBetween, juncAddedGraphicArr);
                this.setEditVertexMoveAttribute(false, true, maxCount, dataTemp.ElementId, vertexPoint, nodeID, ptC, isBetween, allNodesGraphics);
                this.setEditVertexMoveAttribute(false, false, maxCount, dataTemp.ElementId, vertexPoint, nodeID, ptC, isBetween, pipeAddedGraphicArr);
                this.setEditVertexMoveAttribute(false, false, maxCount, dataTemp.ElementId, vertexPoint, nodeID, ptC, isBetween, allPipesGraphics);
            }
        }
    }

    setEditGraphicMoveAttribute(isEditRef, isNode, maxCount, movePoint, nodeID, graphicsArr){
        var setCount = 0;
        maxCount = isEditRef ? maxCount : (maxCount - 2);
        maxCount = isNode ? 0 : maxCount;
        if (maxCount < 0) {
            return setCount;
        }
        for (var i = graphicsArr.length - 1; i > -1; i--) {
            if (!isEditRef && setCount > maxCount) {
                break;
            }
            var item = graphicsArr[i].attributes;
            if ((isEditRef || isNode) && item.ElementId == nodeID) {
                item.CoordinateX = movePoint.x;
                item.CoordinateY = movePoint.y;
                item.X = movePoint.x;
                item.Y = movePoint.y;
                item.x = movePoint.x;
                item.y = movePoint.y;
                item.geometry.x = movePoint.x;
                item.geometry.y = movePoint.y;
                setCount ++;
            }else if(!isNode && item.StartNodeID == nodeID){
                item.CoordinateX[0] = movePoint.x;
                item.CoordinateY[0] = movePoint.y;
                var graEndTemp = graphicsArr[i].geometry.clone();
                var graPointEndTemp = graEndTemp.paths[0][0];
                graPointEndTemp[0] = movePoint.x;
                graPointEndTemp[1] = movePoint.y;
                graphicsArr[i].geometry = graEndTemp;
                setCount ++;
            }else if(!isNode && item.EndNodeID == nodeID){
                item.CoordinateX[item.CoordinateX.length-1] = movePoint.x;
                item.CoordinateY[item.CoordinateX.length-1] = movePoint.y;
                var graStartTemp = graphicsArr[i].geometry.clone();
                var graPointStartTemp = graStartTemp.paths[0][item.CoordinateX.length-1];
                graPointStartTemp[0] = movePoint.x;
                graPointStartTemp[1] = movePoint.y;
                graphicsArr[i].geometry = graStartTemp;
                setCount ++;
            }
        }
        return setCount;
    }

    editGraphicMoveStop(evt, drawToolGraphicsLayer){
        var graphic = evt.graphics[0];
        var dataTemp = graphic.attributes;
        var nodeID = dataTemp.ElementId
        var movePoint = evt.toolEventInfo.mover.geometry;
        if(movePoint.type == "polyline"){
            this.setEditCancelAttribute(nodeID, drawToolGraphicsLayer.graphics.items);
            this.setEditCancelAttribute(nodeID, pipeAddedGraphicArr);
            this.setEditCancelAttribute(nodeID, allPipesGraphics);
        }else{
            var maxCount = 4;//初始基于最大四通管加一个连接节点设置(现已内置max)
            maxCount = this.setEditGraphicMoveAttribute(true, false, maxCount, movePoint, nodeID, drawToolGraphicsLayer.graphics.items);
            this.setEditGraphicMoveAttribute(false, true, maxCount, movePoint, nodeID, juncAddedGraphicArr);
            this.setEditGraphicMoveAttribute(false, true, maxCount, movePoint, nodeID, allNodesGraphics);
            this.setEditGraphicMoveAttribute(false, false, maxCount, movePoint, nodeID, pipeAddedGraphicArr);
            this.setEditGraphicMoveAttribute(false, false, maxCount, movePoint, nodeID, allPipesGraphics);
        }
    }

    setEditAddAttribute(elementId, coordinateX, coordinateY, graphicsArr){
        for (var i = graphicsArr.length - 1; i > -1; i--) {
            var graphic = graphicsArr[i];
            var item = graphic.attributes;
            if (item.ElementId == elementId) {
                item.CoordinateX = coordinateX;
                item.CoordinateY = coordinateY;
                break;
            }
        }
    }

    editVertexAdd(evt, drawToolGraphicsLayer){
        var graphic = evt.graphics[0];
        var dataTemp = graphic.attributes;
        var nodeID = dataTemp.ElementId;
        var coordinateX = [];
        var coordinateY = [];
        for (let p = 0; p < graphic.geometry.paths.length; p++) {
            const itemTemp = graphic.geometry.paths[p];
            for (let t = 0; t < itemTemp.length; t++) {
                const element = itemTemp[t];
                coordinateX.push(element[0]);
                coordinateY.push(element[1]);
            }
        }
        this.setEditAddAttribute(nodeID, coordinateX, coordinateY, drawToolGraphicsLayer.graphics.items);
        this.setEditAddAttribute(nodeID, coordinateX, coordinateY, pipeAddedGraphicArr);
        this.setEditAddAttribute(nodeID, coordinateX, coordinateY, allPipesGraphics);
    }

    editVertexRemove(evt, drawToolGraphicsLayer){
        var graphic = evt.graphics[0];
        var dataTemp = graphic.attributes;
        var removePoint = evt.toolEventInfo.removed;
        var isRemove = this.isEditRemove(graphic, removePoint);
        if(isRemove){
            this.editVertexAdd(evt, drawToolGraphicsLayer);
        }else{
            this.setEditCancelAttribute(dataTemp.ElementId, drawToolGraphicsLayer.graphics.items);
            this.setEditCancelAttribute(dataTemp.ElementId, pipeAddedGraphicArr);
            this.setEditCancelAttribute(dataTemp.ElementId, allPipesGraphics);
        }
    }

    isEdit(){
        return isEdit;
    }

    isActivateEditToolbar(data){
        isEdit = data;
        if (tempFormingDataList.length < 1 || !isEdit) {
            WindowsEvent.MyDispatchEvent("DrawFinish", "");
        }else{
            if (sketchVM) {
                sketchVM.cancel();
                sketchVM.updateOnGraphicClick = true;
            }
        }
    }

    deactivateEditToolbar(){
        if (isEdit) {
            if (sketchVM) {
                sketchVM.updateOnGraphicClick = false;
                sketchVM.cancel();
            }
            isEdit = false;
        }
    }

    activateTool(type) {
        switch (type) {
            case "fm_point":
                trackingType = 3;
                type = "point";
                break;
            case "pointTank":
                trackingType = 4;
                type = "point";
                break;
            case "point":
                trackingType = 2;
                break;
            case "polyline":
                trackingType = 1;
                break;
        }
        sketchVM.create(type, {mode: "click"});
        trackingMode = true;
    }

    InitDraw(nodeList,pipeList,layer, hide_junc_fm, hide_junc,hide_junc_T){
        // debugger
        var self = this;
        isFirst = false;
        if (!isFirst) {
            isFirst = true;
        }
        this.DrawAddPipe(pipeList,layer);
        this.DrawAddNode(nodeList,layer, hide_junc_fm, hide_junc,hide_junc_T);
    }
    
    DrawAddNode(nodeList,layer, hide_junc_fm, hide_junc,hide_junc_T){
        for(var i=0;i<nodeList.length;i++){
            var ids = nodeList[i].ElementId;
            const gra = layer.graphics.find(function(g){
                return g.id === ids;
            });
            if (!gra) {
                var point = nodeList[i].Coordinate[0];
                var mapPoint = new esriApi.Point(point.X,point.Y,new esriApi.SpatialReference({ wkid: global.spatialReference }));
                var symbol = hide_junc;
                if (ids.indexOf('F') > -1) {
                    symbol = hide_junc_fm;
                }else if(ids.indexOf('J') > -1){
                    symbol = hide_junc;
                }else if(ids.indexOf('T') > -1){
                    symbol = hide_junc_T;
                }
                var graphic = new esriApi.Graphic(mapPoint, symbol, nodeList[i]);
                graphic.id = ids;
                layer.add(graphic)
                if (tempFormingDataList.indexOf(nodeList[i]) == -1)
                {
                    var obj = Object.assign({},nodeList[i]);
                    obj.geometry = mapPoint;
                    var coordinate=obj.Coordinate;
                    obj.CoordinateX=[];
                    obj.CoordinateY=[];
                    for(var a=0;a<coordinate.length;a++){
                        obj.CoordinateX.push(coordinate[a].X);
                        obj.CoordinateY.push(coordinate[a].Y);
                    }
                    tempFormingDataList.push(obj);
                }
            }
        }
    }
    DrawAddPipe(pipeList,layer){
        // debugger
        for(var i=0;i<pipeList.length;i++){
            var obj = pipeList[i];
            var ids = obj.ElementId;
            const gra = layer.graphics.find(function(g){
                return g.id === ids;
            });
            if (!gra) {
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
                var symbol = new esriApi.SimpleLineSymbol({width: 5, color: new esriApi.Color("#ff0000"), cap: "round"});
                var graphic = new esriApi.Graphic(line, symbol,obj);
                graphic.id = ids;
                layer.add(graphic);
                if (tempFormingDataList.indexOf(obj) == -1)
                {
                    var objTemp = Object.assign({},obj);
                    objTemp.geometry = line;
                    var coordinate=objTemp.Coordinate;
                    objTemp.CoordinateX=[];
                    objTemp.CoordinateY=[];
                    for(var a=0;a<coordinate.length;a++){
                        objTemp.CoordinateX.push(coordinate[a].X);
                        objTemp.CoordinateY.push(coordinate[a].Y);
                    }
                    tempFormingDataList.push(objTemp);
                }
            }
        }
    }

    ResetTracking() {
        trackingMode = false;
        trackingType = -1;
        hooked = false;
    }

    CloseDrawTool(map) {
        map.popup.close();
        if (sketchVM) {
            sketchVM.updateOnGraphicClick = false;
            sketchVM.cancel();
        }
    }

    CloseDrawToolMain(map) {
        for (var j = (allNodesGraphics.length - 1); j > -1; j--) {
            var itemTemp = allNodesGraphics[j].attributes;
            if (itemTemp.ElementId.indexOf('J') > -1 || itemTemp.ElementId.indexOf('F') > -1) {
                allNodesGraphics.splice(j, 1);
            }
        }
        tempFormingDataList = [];
        global.DelPipes = [];
        global.AddNodes = [];
        global.AddPipes = [];
        pipeAddedGraphicArr = [];
        juncAddedGraphicArr = [];
        deletedModelPipeGraphicArr = [];
        map.popup.close();
        if (sketchVM) {
            sketchVM.updateOnGraphicClick = false;
            sketchVM.cancel();
        }
    }

    addToMap(evt, AddType, hightLightLayer, map, errorMy,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer, deletedline, displayline) {
        AddType = "";
        oldSelect = false;
        var symbol;
        switch (evt.graphic.geometry.type) {
            case "fm_point":
                symbol = new esriApi.SimpleMarkerSymbol({size: 10, color: new esriApi.Color("#A80084")});
                break;
            case "pointTank":
                symbol = new esriApi.SimpleMarkerSymbol({size: 10, color: new esriApi.Color("#ffff00")});
                break;
            case "point":
                symbol = new esriApi.SimpleMarkerSymbol({size: 10, color: new esriApi.Color("#ff0000")});
                break;
            case "polyline":
                symbol = new esriApi.SimpleLineSymbol({width: 5, color: new esriApi.Color("#ff0000"), cap: "round"});
                break;
            default:
                symbol = new esriApi.SimpleFillSymbol();
                break;
        }
        var graphic = new esriApi.Graphic(evt.graphic.geometry, symbol);
        this.DrawEnd(graphic.geometry, graphic, map, errorMy,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer, deletedline, displayline)
        isClickDraw = false;
        trackingMode = false;
        hightLightLayer.removeAll();
        tempPipeRecord = [];
        //this.OnSave();
        drawToolGraphicsLayer.remove(evt.graphic);
    }

    DrawEnd(geometry, graphic, map, errorMy,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer, deletedline, displayline) {
        var self = this;
        this.MouseDown(geometry, errorMy, map)
        switch (trackingType) {
            case 4:
            {
                if (hooked) {
                   alert("水池不能添加到管网上")
                }
                else {
                    this.AddJunction("T" + String(tankNumber++), geometry, "", null, null, null, null, null,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer);
                    WindowsEvent.MyDispatchEvent("DrawFinish", "");
                }
                break;
            }
            case 3:
                if (hooked) {
                    if (hookedType == 1) {
                        MessageBox.confirm('是否拆分管道？', '操作提示', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            type: 'warning'
                        }).then(() => {
                            self.AddJunctionclickHandler(true,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer, deletedline, displayline);
                        }).catch(() => {
                            self.AddJunctionclickHandler(false,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer, deletedline, displayline);    
                        });
                    }
                    else if (hookedType == 2)
                        Message({showClose: true, message: '不能在已有的节点处添加阀门', type: 'warning'});
                    else if (hookedType == 3)
                        Message({showClose: true, message: '不能在已有的阀门处添加阀门', type: 'warning'});
                }
                else {
                    Message({showClose: true, message: '阀门只能添加在管网上', type: 'warning'});
                }
                break;
            case 2: {
                if (hooked) {
                    if (hookedType == 1) {
                        MessageBox.confirm('是否拆分管道？', '操作提示', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            type: 'warning'
                        }).then(() => {
                            self.AddJunctionclickHandler(true,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer, deletedline, displayline);
                        }).catch(() => {
                            self.AddJunctionclickHandler(false,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer, deletedline, displayline);  
                        });
                    }
                    else if (hookedType == 2)
                        Message({showClose: true, message: '不能在已有的节点处添加节点', type: 'warning'});
                    else if (hookedType == 3)
                        Message({showClose: true, message: '不能在已有的阀门处添加节点', type: 'warning'});
                }
                else {
                    this.AddJunction(("J" + String(nodeNumber++)), geometry, "", null, null, null, null, null,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer);
                    WindowsEvent.MyDispatchEvent("DrawFinish", "");
                }
                break;
            }
            case 1: {
                //先添加管道上的各个节点，如果点到管道上（HookedPipeElementID不为空），需要拆分管道
                for (var i = 0; i < tempPipeRecord.length; i++) {
                    var data = tempPipeRecord[i];
                    if (!this.IsNumber(String(data.ElementId))) {
                        if (data.Hooked) {
                            //if hooked a pipe, add a new junction
                            if (data.hasOwnProperty("HookedPipeElementID") && data.HookedPipeElementID != "") {
                                if (data.HookedType == 1)
                                    this.AddJunction(data.ElementId, data.Point, data.HookedPipeElementID,
                                        data.HookedStartNodeId, data.HookedEndNodeId, data.HookedGraphic,
                                        data.HookedPipeDiameter, data.HookedPipeC,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer, deletedline, displayline);
                            }
                        }
                        else {
                            var isExist = juncAddedGraphicArr.some(function(index) {
                                return index.attributes.ElementId === data.ElementId;
                            });
                            if (!isExist) {
                                this.AddJunction(data.ElementId, data.Point, "", null, null, null, null, null,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer);
                            }
                        }
                    }
                }
                //然后在添加管道
                for (i = 0; i < tempPipeRecord.length - 1; i++) {

                    var data1 = tempPipeRecord[i];
                    var data2 = tempPipeRecord[i + 1];
                    var polyline = new esriApi.Polyline({
                        "paths": [],
                        "spatialReference": { "wkid": global.spatialReference }
                    });
                    var path = new Array();
                    var startNodeID = data1.ElementId;
                    var endNodeID = data2.ElementId;

                    path.push(data1.Point);
                    path.push(data2.Point);
                    polyline.addPath(path);

                    this.AddPipe("Q" + String(pipeNumber++), startNodeID, endNodeID, polyline, Default_Diameter, Default_C, displayline, drawToolGraphicsLayer);
                }
                tempPipeRecord = [];
                WindowsEvent.MyDispatchEvent("DrawFinish", "");
                break;
            }
        }
    }
    AddJunctionclickHandler(detail,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer, deletedline, displayline) {
        if (detail)//yes to split the pipe
        {
            this.AddJunction(hookedSplitNewID, hookedPoint, hookedElementID, hookedStartNodeID, hookedEndNodeID, hookedGraphic, hookedPipeDiameter, hookedPipeC,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer, deletedline, displayline);
        }
        else {
            this.AddJunction(hookedSplitNewID, mapPoint, "", null, null, null, null, null,hide_junc_T, hide_junc_fm, hide_junc, drawToolGraphicsLayer);
        }
        WindowsEvent.MyDispatchEvent("DrawFinish", "");
    }

    DeleteAPipe(graphic, drawToolGraphicsLayer, deletedline) {
        var index = allPipesGraphics.indexOf(graphic);
        if (index >= 0)
            allPipesGraphics.splice(index, 1);

        index = pipeAddedGraphicArr.indexOf(graphic);

        if (index >= 0)
            pipeAddedGraphicArr.splice(index, 1);

        if (deletedModelPipeGraphicArr.indexOf(graphic) == -1) {
            deletedModelPipeIDArr.push(String(graphic.attributes["ElementId"]));
            deletedModelPipeGraphicArr.push(graphic);
        }
        if (Number(graphic.attributes["Type"]) == 0) {
            var deletedPipeGraphic = graphic;
            deletedPipeGraphic.symbol = deletedline;
            drawToolGraphicsLayerArray.push(deletedPipeGraphic)
            drawToolGraphicsLayer.add(deletedPipeGraphic);
        }

    }

    AddPipe(elementID, fromID, toID, polyline, diameter, c, displayline, drawToolGraphicsLayer) {
        var length = 0;
        var array = polyline.paths[0];
        var arrayX = [];
        var arrayY = [];
        for (var i = 0; i < array.length - 1; i++) {
            var point1 = array[i];
            var point2 = array[i + 1];
            var x = Math.abs(point1[0] - point2[0]);
            var y = Math.abs(point1[1] - point2[1]);
            length += Number(Math.sqrt(x * x + y * y).toFixed(2));
        }
        for (var i = 0; i < array.length; i++) {
            var point1 = array[i];
            arrayX.push(point1[0]);
            arrayY.push(point1[1]);
        }
        var attr = new Object();
        attr.ElementId = elementID;
        attr.StartNodeID = fromID;
        attr.EndNodeID = toID;
        attr.Physical_PipeDiameter = diameter;
        attr.管径 = diameter;
        attr.Physical_HazenWilliamsC = c;
        attr.Type = 1;
        attr.Length = length;
        attr.lcoeff = 100;
        attr.CoordinateX = arrayX;
        attr.CoordinateY = arrayY;
        var newPipeGraphic = new esriApi.Graphic(polyline, displayline, attr);
        if (drawToolGraphicsLayerArray.indexOf(newPipeGraphic) == -1) {
            drawToolGraphicsLayer.add(newPipeGraphic);
            drawToolGraphicsLayerArray.push(newPipeGraphic);
        }
        if (allPipesGraphics.indexOf(newPipeGraphic) == -1) allPipesGraphics.push(newPipeGraphic);
        if (pipeAddedGraphicArr.indexOf(newPipeGraphic) == -1) pipeAddedGraphicArr.push(newPipeGraphic);
    }

    SplitPipe(point, pipeElementID, result, graphic) {
        return TopologyUtility.Split(point, graphic.geometry, result);
    }

    IsRepeatPipe(polyline){
        var isBool = false;
        for (var i = (tempPipeRecord.length - 1); i > -1; i--) {
            var data = tempPipeRecord[i];
            if (data.Hooked) {
                if (data.hasOwnProperty("HookedPipeElementID") && data.HookedPipeElementID != "") {
                    if (data.HookedType == 1){
                        if (data.HookedGraphic.geometry.paths[0].length == polyline.paths[0].length) {
                            if(esriApi.geometryEngine.equals(data.HookedGraphic.geometry, polyline)){
                                console.log("线重复:", data.HookedGraphic);
                                isBool = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return isBool;
    }
    AddJunction(elementID, point, pipeElementID = "", startNodeID = "", endNodeID = "", graphic = null, diameter = Default_Diameter, c = Default_C,hide_junc_T=null, hide_junc_fm = null, hide_junc = null, drawToolGraphicsLayer = null, deletedline = null, displayline = null) {
        //点到管道了，需要先拆分管道
        if (pipeElementID != "") {
            var splitResult = new Object();
            if (this.SplitPipe(point, pipeElementID, splitResult, graphic)) {
                this.DeleteAPipe(graphic, drawToolGraphicsLayer, deletedline);
                if (graphic != null) drawToolGraphicsLayer.remove(graphic);
                if(!this.IsRepeatPipe(splitResult.polyline1)){
                    var tempElementID1 = (elementID.indexOf('F') > -1 ? (elementID + "-A") : elementID);
                    this.AddPipe("Q" + String(pipeNumber++), startNodeID, tempElementID1, splitResult.polyline1, diameter, c, displayline, drawToolGraphicsLayer);
                }
                if(!this.IsRepeatPipe(splitResult.polyline2)){
                    var tempElementID2 = (elementID.indexOf('F') > -1 ? (elementID + "-B") : elementID);
                    this.AddPipe("Q" + String(pipeNumber++), tempElementID2, endNodeID, splitResult.polyline2, diameter, c, displayline, drawToolGraphicsLayer);
                }
            }
        }

        //再添加节点
        var attr = new Object();
        attr.ElementId = elementID;
        attr.Elevation = 0.0;
        attr.Demand = 0;
        attr.emitterCoeff = 0;
        attr.initConc = 0;
        attr.zoneId = 0;
        attr.CoordinateX = point.x;
        attr.CoordinateY = point.y;
        attr.HMIGeometryXCoordinate = point.x;
        attr.HMIGeometryYCoordinate = point.y;
        var pointTemp = new esriApi.Point(point.x, point.y, new esriApi.SpatialReference({ wkid: global.spatialReference }))
        var juncGraphic = new esriApi.Graphic(pointTemp, hide_junc, attr);
        if(elementID.indexOf('F') > -1){
            attr.Physical_ValveDiameter = diameter;
            juncGraphic = new esriApi.Graphic(pointTemp, hide_junc_fm, attr);
        }
        if(elementID.indexOf('T') > -1){
            juncGraphic = new esriApi.Graphic(pointTemp, hide_junc_T, attr);
        }
        if (drawToolGraphicsLayerArray.indexOf(juncGraphic) == -1) {
            drawToolGraphicsLayer.add(juncGraphic);
            drawToolGraphicsLayerArray.push(juncGraphic);
        }
        if (allNodesGraphics.indexOf(juncGraphic) == -1) allNodesGraphics.push(juncGraphic);
        if (juncAddedGraphicArr.indexOf(juncGraphic) == -1) juncAddedGraphicArr.push(juncGraphic);
    }

    InfoWindowsShow(event, graphic, errorMy) {
        var featureTemp = new Object();
        var tempPoint = event.mapPoint;
        var layerId = "";
        var elementId = graphic.attributes.ElementId;
        for (var i = 0; i < tempFormingDataList.length; i++) {
            var obj = tempFormingDataList[i];
            if (String(obj.LayerId) != global.layerId.EN_DEL_PIPE) {
                if (String(elementId) == String(obj.ElementId) || TopologyUtility.Offset(tempPoint, obj.geometry) < errorMy) {
                    layerId = String(obj.LayerId);
                    console.log('obj',obj);
                    featureTemp.attributes = obj;
                    featureTemp.geometry = obj.geometry;
                    var data = { layerId: layerId, featureTemp: featureTemp }
                    WindowsEvent.MyDispatchEvent("AddClick", data)
                    break;
                }
            }
        }
    }

    DrawToolInit(AddType, data, isClickDraw) {
        isClickDraw = true;
        trackingMode = true;
        if (AddType == data) {
            oldSelect = !oldSelect;
        }
        else
            oldSelect = true;
        AddType = data;
        if (!oldSelect) {
            if (sketchVM) {
                sketchVM.updateOnGraphicClick = false;
                sketchVM.cancel();
            }
            trackingMode = false;
        }
        return isClickDraw;
    }

    ZtMapQuery(query, map, type) {
        WindowsEvent.MyDispatchEvent("ztMapLoadingOpen");
        var self = this;
        let url = "";
        if(type != "Pressure"){
            query.geometry = map.extent;
            if (map.scale <= global.myScale[1])
                query.where = "1=1";
            else
                query.where = "Physical_PipeDiameter >=" + String(global.myDiameter[1]);
            query.outFields = ["ElementId"];
            query.returnGeometry = false;
            url = urlClass.baseMapUrl + global.layerId.EN_PIPE;
        }else{
            query.geometry = map.extent;
            if (map.scale <= global.myScale[1])
                query.where = "1=1";
            else
                query.where = "MaxDiameter >=" + String(global.myDiameter[1]);
            query.where = "1=1";
            query.outFields = ["ElementId"];
            query.returnGeometry = false;
            url = urlClass.junctionResultUrl;
            // url = urlClass.baseMapUrl + global.layerId.EN_JUNCTION;
        }
        var queryTask = new esriApi.QueryTask(url);
        queryTask.execute(query).then(self.ZtMapQueryById, function(error){
            console.log(error);
        });
    }

    ZtMapQueryById(event){
        if (event) {
            var ids = [];
            var featureArr = event.features;
            featureArr.forEach(element => {
                ids.push(element.attributes.ElementId);
            });
            WindowsEvent.MyDispatchEvent("PlanIdsResult", ids);
        }
    }

    DrawInit(query, map, drawToolGraphicsLayer) {
        this.QueryPipes(query, map, drawToolGraphicsLayer);//查询所有管道的graphis信息
        this.QueryNodes(query, map, drawToolGraphicsLayer);//查询所有节点的graphis信息
    }

    QueryPipes(query, map, drawToolGraphicsLayer) {
        query.geometry = map.extent;
        if (map.scale <= global.myScale[1])
            query.where = "1=1";
        else
            query.where = "Physical_PipeDiameter >=" + String(global.myDiameter[1]);
        query.outFields = ["ElementId", "StartNodeID", "EndNodeID", "Physical_PipeDiameter", "Physical_HazenWilliamsC"];
        query.returnGeometry = true;
        var queryTask = new esriApi.QueryTask(urlClass.baseMapUrl + global.layerId.EN_PIPE);
        var self = this;
        queryTask.execute(query).then(function (event) {
            self.QueryPipeComplete(event, drawToolGraphicsLayer)
        }, function(error){
            console.log(error);
        });
    }


    QueryPipeComplete(event, drawToolGraphicsLayer) {
        if (event) {
            var pipeFeatureArr = event.features;

            if (pipeFeatureArr.length > 0) {
                allPipesGraphics = [];
                allPipesGraphics = pipeFeatureArr.slice(0);
            }
            for (var pipeAddedGraphic of pipeAddedGraphicArr) {
                allPipesGraphics.push(pipeAddedGraphic);
                //if (!drawToolGraphicsLayer.contains(pipeAddedGraphic)) drawToolGraphicsLayer.add(pipeAddedGraphic);
            }
            for (var pipeGraphic of deletedModelPipeGraphicArr) {
                for (var i = 0; i < allPipesGraphics.length; i++) {
                    var PipesGraphics = allPipesGraphics[i];
                    if (String(pipeGraphic.attributes.ElementId) == String(PipesGraphics.attributes.ElementId))
                        allPipesGraphics.splice(i, 1);
                }
            }

        }
    }

    QueryNodes(query, map, drawToolGraphicsLayer) {
        query.geometry = map.extent;
        query.where = "1=1";
        query.outFields = ["ElementId", "Physical_NodeElevation"];
        query.returnGeometry = true;
        var queryTask = new esriApi.QueryTask(urlClass.baseMapUrl + global.layerId.EN_JUNCTION);
        var self = this;
        queryTask.execute(query).then(function (event) {
            self.QueryNodeComplete(event, drawToolGraphicsLayer, query, map)
        }, function(error){
            console.log(error);
        });
    }
    QueryNodeComplete(event, drawToolGraphicsLayer, query, map) {
        if (event) {
            var juncFeatureArr = event.features;

            if (juncFeatureArr.length > 0) {
                //allNodesGraphics = [];
                //allNodesGraphics = juncFeatureArr.slice(0);
                if (juncFeatureArr.length > 0) {
                    for (var _graphic of allNodesGraphics) drawToolGraphicsLayer.remove(_graphic);
                    //allNodesGraphics = [];

                    for (var i = 0; i < juncFeatureArr.length; i++) {
                        var attr = new Object();
                        attr.ElementId = String(juncFeatureArr[i].attributes["ElementId"]);
                        attr.Elevation = String(juncFeatureArr[i].attributes["Physical_NodeElevation"]);
                        attr.Demand = 0.0;
                        attr.Type = "节点";
                        var juncGraphic = new esriApi.Graphic(juncFeatureArr[i].geometry, null, attr);
                        /*  if (drawToolGraphicsLayerArray.indexOf(juncGraphic)==-1)  {
                         drawToolGraphicsLayer.add(juncAddedGraphic);
                         drawToolGraphicsLayerArray.push(juncGraphic);
                     } */
                        allNodesGraphics.push(juncGraphic);
                    }
                }
                for (var juncAddedGraphic of juncAddedGraphicArr) {
                    allNodesGraphics.push(juncAddedGraphic);
                    /* if (drawToolGraphicsLayerArray.indexOf(juncAddedGraphic)==-1) 
                    {
                        drawToolGraphicsLayer.add(juncAddedGraphic);
                        drawToolGraphicsLayerArray.push(juncAddedGraphic);
                    } */
                }
            }
        }
        var initExtent = drawClass.GetMapInitExtent(global.initExtent)
        if (map.scale <= global.myScale[0])
        {
            query.where = "1=1";
        }
        else if(map.scale > global.myScale[0]&&map.scale <= global.myScale[1]){
            query.where = "Physical_PipeDiameter >=" + String(global.myDiameter[0]);
        }
        else{
            query.where = "Physical_PipeDiameter >=" + String(global.myDiameter[1]);
        }
        query.geometry = map.extent;
        query.outFields = ["ElementId", "Physical_NodeElevation"];
        var queryTask = new esriApi.QueryTask(urlClass.baseMapUrl + global.layerId.EN_VALVE);
        var self = this;
        queryTask.execute(query).then(function (event) {
            self.QueryNodeCompleteTcv(event, drawToolGraphicsLayer)
        }, function(error){
            console.log(error);
        });
    }
    
    QueryNodeCompleteTcv(event, drawToolGraphicsLayer) {
        if (event) {
            var juncFeatureArr = event.features;

            if (juncFeatureArr.length > 0) {

                if (juncFeatureArr.length > 0) {
                    for (var _graphic of allNodesGraphics) drawToolGraphicsLayer.remove(_graphic);

                    for (var i = 0; i < juncFeatureArr.length; i++) {
                        var attr = new Object();
                        attr.ElementId = String(juncFeatureArr[i].attributes["ElementId"]);
                        attr.Elevation = String(juncFeatureArr[i].attributes["Physical_NodeElevation"]);
                        attr.Demand = 0.0;
                        attr.Type = "阀门";
                        var juncGraphic = new esriApi.Graphic(juncFeatureArr[i].geometry, null, attr);
                         /* if (drawToolGraphicsLayerArray.indexOf(juncGraphic)==-1)  {
                            drawToolGraphicsLayer.add(juncGraphic);
                            drawToolGraphicsLayerArray.push(juncGraphic);
                        }  */
                        allNodesGraphics.push(juncGraphic);
                    }
                }
            }
        }
        //新增
        for (var i=0;i<juncAddedGraphicArr.length;i++) {
            var juncAddedGraphic = juncAddedGraphicArr[i];
            if (drawToolGraphicsLayer.graphics.indexOf(juncAddedGraphic)==-1) 
            {
                drawToolGraphicsLayer.add(juncAddedGraphic);
            }  
        }
    }

    OnSave() {
        _editResult = new Object();
        _editResult.Pipes = pipeAddedGraphicArr;
        _editResult.Junctions = juncAddedGraphicArr;
        var tmpDeletedPipeIDArr = [];
        for (var graphic of deletedModelPipeGraphicArr) {
            //只保留模型中原有的管道
            //if (Number(graphic.attributes["Type"]) == 0)
            if (tmpDeletedPipeIDArr.indexOf(String(graphic.attributes["ElementId"])) == -1)
                tmpDeletedPipeIDArr.push(String(graphic.attributes["ElementId"]));
        }
        _editResult.DeletedPipes = tmpDeletedPipeIDArr;
        var pipeArr = [];
        var nodeArr = [];
        var valveArr = [];
        var objectResult = new Object();
        for (var i = 0; i < pipeAddedGraphicArr.length; i++) {
            var diameter = (pipeAddedGraphicArr[i]).attributes.Physical_PipeDiameter;
            var elementId = (pipeAddedGraphicArr[i]).attributes.ElementId;
            var startId = (pipeAddedGraphicArr[i]).attributes.StartNodeID;
            var endId = (pipeAddedGraphicArr[i]).attributes.EndNodeID;
            var Physical_HazenWilliamsC = (pipeAddedGraphicArr[i]).attributes.Physical_HazenWilliamsC;
            var type = (pipeAddedGraphicArr[i]).attributes.Type;
            var length = (pipeAddedGraphicArr[i]).attributes.Length;
            var object = new Object();
            object.id = elementId;
            object.startId = startId;
            object.endId = endId;
            object.diameter = diameter;
            object.c = Physical_HazenWilliamsC;
            object.type = type;
            object.Length = length;
            object.CoordinateX = (pipeAddedGraphicArr[i]).attributes.CoordinateX;
            object.CoordinateY = (pipeAddedGraphicArr[i]).attributes.CoordinateY;
            object.geometry = pipeAddedGraphicArr[i].geometry;
            if (global.AddPipes.indexOf(pipeAddedGraphicArr[i]) == -1) {
                pipeArr.push(object);
                global.AddPipes.push(pipeAddedGraphicArr[i]);
            }
        }
        for (var i = 0; i < juncAddedGraphicArr.length; i++) {
            var object = (juncAddedGraphicArr[i]).attributes;
            if (global.AddNodes.indexOf(juncAddedGraphicArr[i]) == -1) {
                object.geometry = juncAddedGraphicArr[i].geometry;
                nodeArr.push(object);
                global.AddNodes.push(juncAddedGraphicArr[i]);
            }
        }
        for (var i = 0; i < tmpDeletedPipeIDArr.length; i++) {
            var object = new Object();
            object.id = tmpDeletedPipeIDArr[i];
            object.ElementId = tmpDeletedPipeIDArr[i];
            object.LayerId = global.layerId.EN_DEL_PIPE;
            object.ChangeData = [];
            var o = new Object();
            o.isAdd = false;
            object.ChangeData.push(o);
            var isAdd = true;
            for (var obj of tempFormingDataList) {
                if (String(obj.ElementId) == String(object.ElementId)) {
                    isAdd = false;
                    break;
                }

            }
            if (isAdd) {
                if (tempFormingDataList.indexOf(object) == -1)
                    tempFormingDataList.push(object);
                if (global.DelPipes.indexOf(Number(tmpDeletedPipeIDArr[i])) == -1)
                    global.DelPipes.push(Number(tmpDeletedPipeIDArr[i]));
            }
        }
        for (var i = 0; i < nodeArr.length; i++) {
            var object = nodeArr[i];
            object.ElementId = nodeArr[i].ElementId;
            object.initConc = 0;
            object.emitterCoeff = 0;
            object.zoneId = 0;
            object.Elev = 0;
            object.LayerId = (trackingType == 3 ? Number(global.layerId.EN_ADD_VALVE_O) :(trackingType == 4? Number(global.layerId.EN_ADD_TANK_O):Number(global.layerId.EN_ADD_NODE_O)));
            object.typeId = (trackingType == 3 ? global.layerId.EN_ADD_VALVE :(trackingType == 4 ? global.layerId.EN_ADD_TANK:global.layerId.EN_ADD_NODE_TYPE));
            var PointMy = object.geometry;
            object.x = PointMy.x;
            object.y = PointMy.y;
            object.X = PointMy.x;
            object.Y = PointMy.y;
            object.BasedeMand = object.Demand;
            object.Result_Demand_hour = object.Demand;
            object.位置 = "无";
            object.分公司 = "无";
            object.Physical_NodeElevation = 0;
            object.Label = "无";
            object.type = (trackingType == 3 ? "阀门" :(trackingType == 4 ? "水池":"节点"));
            if(trackingType == 3)
            {
                object.InitialSettingsRelativeClosure = "100";
                // object.InitialSettingsRelativeClosureO = 100;
            }
            object.ChangeData = [];
            var o = new Object();
            o.isAdd = true;
            o.label = (trackingType == 3 ? "添加阀门" : (trackingType == 4 ? "添加水池":"添加节点"));
            o.changeData = object.ElementId;
            object.ChangeData.push(o);
            if (tempFormingDataList.indexOf(object) == -1)
                tempFormingDataList.push(object);
        }
        for (var i = 0; i < pipeArr.length; i++) {
            var obj = new Object();
            obj = pipeArr[i];
            obj.LayerId = Number(global.layerId.EN_ADD_PIPE);
            obj.id = pipeArr[i].id;
            obj.startId = pipeArr[i].startId;
            obj.endId = pipeArr[i].endId;
            obj.diameter = pipeArr[i].diameter;
            obj.length = 100;
            obj.rcoeff = 120;
            obj.lcoeff = 0;
            obj.typeId = global.layerId.EN_ADD_PIPE_TYPE;
            obj.status = pipeArr[i].type;

            obj.Setting = "";
            obj.BasedeMand = "";
            obj.diameter = pipeArr[i].diameter;
            obj.rcoeff = Number(pipeArr[i].c).toFixed(1);
            obj.status = "开";
            obj.Status = "开";
            obj.Diameter = Number(pipeArr[i].diameter).toFixed(1);
            obj.Resistance_Coefficient = Number(pipeArr[i].c).toFixed(1);
            obj.startId = pipeArr[i].startId;
            obj.endId = pipeArr[i].endId;
            obj.length = pipeArr[i].Length;
            obj.lcoeff = 0;
            obj.Physical_PipeDiameter = pipeArr[i].diameter;
            obj.管径 = pipeArr[i].diameter;
            obj.Physical_HazenWilliamsC = Number(pipeArr[i].c).toFixed(1);
            obj.Is_Active = "开";
            obj.HazenWilliamsC = Number(pipeArr[i].c).toFixed(1);
            obj.LayerId = global.layerId.EN_ADD_PIPE_O;
            obj.ElementId = pipeArr[i].id;
            obj.CoordinateX = pipeArr[i].CoordinateX;
            obj.CoordinateY = pipeArr[i].CoordinateY;
            var pipeGraphic = (pipeAddedGraphicArr[i]);
            var startPoint = (pipeGraphic.geometry).paths[0][0];
            var endPoint = (pipeGraphic.geometry).paths[0][1];
            obj.x = Number(((startPoint[0] + endPoint[0]) / 2.0).toFixed(4));
            obj.y = Number(((startPoint[1] + endPoint[1]) / 2.0).toFixed(4));
            obj.X = Number(((startPoint[0] + endPoint[0]) / 2.0).toFixed(4));
            obj.Y = Number(((startPoint[1] + endPoint[1]) / 2.0).toFixed(4));
            obj.XMin = obj.x - 200;
            obj.YMin = obj.y - 200;
            obj.XMax = obj.x + 200;
            obj.YMax = obj.y + 200;
            obj.HMIGeometryScaledLength = pipeArr[i].Length;
            obj.PipeStatus = 0;
            obj.StartNodeID = pipeArr[i].startId;
            obj.EndNodeID = pipeArr[i].endId;
            obj.位置 = "";
            obj.分公司 = "";
            obj.埋设时间 = "";
            obj.type = "管道";
            obj.ChangeData = [];
            var o = new Object();
            o.isAdd = true;
            o.label = "添加管道";
            o.changeData = obj.ElementId;
            obj.ChangeData.push(o);
            obj.Physical_PipeMaterial = "";
            if (tempFormingDataList.indexOf(obj) == -1)
                tempFormingDataList.push(obj);
            if (!this.IsNumber(String(pipeArr[i].id)))//2018.04.12
            {
                obj = new Object();
                obj.id = pipeArr[i].id;
                //pipeInfoTemp.push(obj);
            }
        }
        return tempFormingDataList;
    }

    DeleteDataList(dataTemp){
        for (var i = 0; i < tempFormingDataList.length; i++) {
            var item = tempFormingDataList[i];
            if (item.ElementId == dataTemp.ElementId) {
                tempFormingDataList.splice(i, 1);
                break;
            }
        }
        if (dataTemp.type == "节点") {
            for (var j = 0; j < juncAddedGraphicArr.length; j++) {
                var item = juncAddedGraphicArr[j].attributes;
                if (item.ElementId == dataTemp.ElementId) {
                    juncAddedGraphicArr.splice(j, 1);
                    break;
                }
            }
            for (var jj = (allNodesGraphics.length - 1); jj > -1; jj--) {
                var item = allNodesGraphics[jj].attributes;
                if (item.ElementId == dataTemp.ElementId) {
                    allNodesGraphics.splice(jj, 1);
                    break;
                }
            }
        } else {
            for (var k = 0; k < pipeAddedGraphicArr.length; k++) {
                var item = pipeAddedGraphicArr[k].attributes;
                if (item.ElementId == dataTemp.ElementId) {
                    pipeAddedGraphicArr.splice(k, 1);
                    break;
                }
            }
            for (var kk = (allPipesGraphics.length - 1); kk > -1; kk--) {
                var item = allPipesGraphics[kk].attributes;
                if (item.ElementId == dataTemp.ElementId) {
                    allPipesGraphics.splice(kk, 1);
                    break;
                }
            }
        }
        if (pipeAddedGraphicArr.length < 1 && juncAddedGraphicArr.length < 1) {
            tempFormingDataList = [];
            fmNumber = 0;
            nodeNumber = 0;
            pipeNumber = 0;
            tankNumber = 0;
            for (var l = 0; l < deletedModelPipeGraphicArr.length; l++) {
                var item = deletedModelPipeGraphicArr[l];
                allPipesGraphics.push(item);
                deletedModelPipeGraphicArr.splice(l, 1);
            }
        }
    }
 /**
     * 删除某个添加的元素
     * @param {*} dataTemp 
     */
    DeleteElement(dataTemp){
        for(var i=0;i<pipeAddedGraphicArr.length;i++){
            var obj = (pipeAddedGraphicArr[i]).attributes;
            if(String(dataTemp.ElementId)==String(obj.ElementId)){
                pipeAddedGraphicArr.splice(i,1);
                break;
            }
        }
        for(var i=0;i<juncAddedGraphicArr.length;i++){
            var obj = (juncAddedGraphicArr[i]).attributes;
            if(String(dataTemp.ElementId)==String(obj.ElementId)){
                juncAddedGraphicArr.splice(i,1);
                break;
            }
        }
        for(var i=0;i<global.AddPipes.length;i++){
            var obj = (global.AddPipes[i]).attributes;
            if(String(dataTemp.ElementId)==String(obj.ElementId)){
                global.AddPipes.splice(i,1);
                break;
            }
        }
        for(var i=0;i<global.AddNodes.length;i++){
            var obj = (global.AddNodes[i]).attributes;
            if(String(dataTemp.ElementId)==String(obj.ElementId)){
                global.AddNodes.splice(i,1);
                break;
            }
        }
        for(var i=0;i<tempFormingDataList.length;i++){
            var obj = (tempFormingDataList[i]);
            if(String(dataTemp.ElementId)==String(obj.ElementId)){
                tempFormingDataList.splice(i,1);
                break;
            }
        }
        for(var j=0;j<allNodesGraphics.length;j++){
            var obj = allNodesGraphics[j].attributes;
            if(String(dataTemp.ElementId)==String(obj.ElementId)){
                allNodesGraphics.splice(j, 1);
                break;
            }
        }
        if (dataTemp.type != "管道") {
            if(!this.DeleteElementRelated(dataTemp)){
                this.isReset();
            }
        }else{
            this.isReset();
        }
    }

    DeleteElementRelated(dataTemp){
        let isBool = false;
        for(var i=0;i<pipeAddedGraphicArr.length;i++){
            var obj = (pipeAddedGraphicArr[i]).attributes;
            if (String(obj["StartNodeID"]) == String(dataTemp.ElementId) || String(obj["EndNodeID"]) == String(dataTemp.ElementId)) {
                pipeAddedGraphicArr.splice(i,1);
                isBool = true;
                break;
            }
        }
        for(var i=0;i<juncAddedGraphicArr.length;i++){
            var obj = (juncAddedGraphicArr[i]).attributes;
            if (String(obj["StartNodeID"]) == String(dataTemp.ElementId) || String(obj["EndNodeID"]) == String(dataTemp.ElementId)) {
                juncAddedGraphicArr.splice(i,1);
                isBool = true;
                break;
            }
        }
        for(var i=0;i<global.AddPipes.length;i++){
            var obj = (global.AddPipes[i]).attributes;
            if (String(obj["StartNodeID"]) == String(dataTemp.ElementId) || String(obj["EndNodeID"]) == String(dataTemp.ElementId)) {
                global.AddPipes.splice(i,1);
                isBool = true;
                break;
            }
        }
        for(var i=0;i<global.AddNodes.length;i++){
            var obj = (global.AddNodes[i]).attributes;
            if (String(obj["StartNodeID"]) == String(dataTemp.ElementId) || String(obj["EndNodeID"]) == String(dataTemp.ElementId)) {
                global.AddNodes.splice(i,1);
                isBool = true;
                break;
            }
        }
        for(var i=0;i<tempFormingDataList.length;i++){
            var obj = (tempFormingDataList[i]);
            if (String(obj["StartNodeID"]) == String(dataTemp.ElementId) || String(obj["EndNodeID"]) == String(dataTemp.ElementId)) {
                tempFormingDataList.splice(i,1);
                isBool = true;
                break;
            }
        }
        for(var j=0;j<allNodesGraphics.length;j++){
            var obj = allNodesGraphics[j].attributes;
            if (String(obj["StartNodeID"]) == String(dataTemp.ElementId) || String(obj["EndNodeID"]) == String(dataTemp.ElementId)) {
                allNodesGraphics.splice(j, 1);
                isBool = true;
                break;
            }
        }
        return (isBool ? this.DeleteElementRelated(dataTemp) : isBool);
    }

    isReset(){
        let isBool = true;
        for(var i=0;i<tempFormingDataList.length;i++){
            let itemTemp = tempFormingDataList[i];
            if (String(itemTemp.id).indexOf('J') > -1 || String(itemTemp.id).indexOf('Q') > -1 || String(itemTemp.id).indexOf('F') > -1) {
                isBool = false;
                break;
            }
        }
        if (isBool) {
            fmNumber = 0;
            nodeNumber = 0;
            pipeNumber = 0;
            tempFormingDataList = [];
            global.DelPipes = [];
            global.AddNodes = [];
            global.AddPipes = [];
            pipeAddedGraphicArr = [];
            juncAddedGraphicArr = [];
            deletedModelPipeGraphicArr = [];
            console.log("自动重置集合");
        }
    }

    IsNumber(str) {
        var result = true;
        var i = 0;
        if (str == null)
            return false;
        for (i = 0; i < str.length; i++) {
            if (!(Number(str.charAt(i)) >= 0 && Number(str.charAt(i)) <= 9))
                break;
        }
        if (i != str.length)
            result = false;
        else
            result = true;
        return result;
    }
}
export default new Methods()