
import global from '@/components/js/Global'
import PictureProperty from './PictureProperty';
var esriApi = {};
class Methods {

    setArcgisforAPI(_obj){
        esriApi = _obj;
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
    DrawPipeFlowChange(min, max, allData, levelTemp, colorTemp, isDisplaysTemp, layer, isCompare, selectTypeMain, EventTypeMain, drawBig, drawSmall) {
        var limitsTemp = new Array();
        for (var i = 0; i < allData.length; i++) {
            var obj = allData[i];
            var returnObject = new Object();
            var changeData = 0;
            if (EventTypeMain == "Diffusion")
                changeData = Number(obj.PassTime);
            else
                changeData = Number(obj.Change);
            returnObject = this.GetLevel(Number(min), Number(max), changeData, Number(levelTemp),
                i, selectTypeMain, isCompare, EventTypeMain);

            var level = returnObject.result;
            if (i == 0) {
                limitsTemp = returnObject.limitsTemp;
            }
            var path = new Array();
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
            var widthTemp = 0;
            var isDrawTemp = false;
            if (isDisplaysTemp[level - 1]) {
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
                    console.log("画图")
                    var gra1 = this.DrawLineGraphic(widthTemp, colorTemp[level - 1], line);
                    layer.add(gra1)
                }
            }
        }
        return limitsTemp;
    }

    DrawCloseValveBufferArea(allData,map,layer,geometryService) {

        var points = new Array();
        var minx = 0,miny = 0,maxx = 0,maxy = 0;
        console.log(layer);
        if (allData.ListPipe.length > 0){
            minx = allData.ListPipe[0].Coordinate[0].X;
            maxx = allData.ListPipe[0].Coordinate[0].X;
            miny = allData.ListPipe[0].Coordinate[0].Y;
            maxy = allData.ListPipe[0].Coordinate[0].Y;
        }
        for (var i = 0; i < allData.ListPipe.length; i++) {
            for (var j = 0; j < allData.ListPipe[i].Coordinate.length; j++) {
                var point = new esriApi.Point(allData.ListPipe[i].Coordinate[j].X, allData.ListPipe[i].Coordinate[j].Y, new esriApi.SpatialReference({ wkid: global.spatialReference }));
                points.push(point);
                if (minx > allData.ListPipe[i].Coordinate[j].X){
                    minx = allData.ListPipe[i].Coordinate[j].X;
                }
                else if (maxx < allData.ListPipe[i].Coordinate[j].X) {
                    maxx = allData.ListPipe[i].Coordinate[j].X;
                }
                if (miny > allData.ListPipe[i].Coordinate[j].Y) {
                    miny = allData.ListPipe[i].Coordinate[j].Y;
                }
                else if (maxy > allData.ListPipe[i].Coordinate[j].Y) {
                    maxy = allData.ListPipe[i].Coordinate[j].Y;
                }
            }
        }
        var extsize_x = (maxx - minx);
        var extsize_y = (maxy - miny);
        map.extent= new esriApi.Extent(Number(minx) - Number(extsize_x), Number(miny) - Number(extsize_y), Number(maxx) + Number(extsize_x), Number(maxy) + Number(extsize_y), new esriApi.SpatialReference({ wkid: global.spatialReference }));

        var thiss = this;
        var layers = layer;
        geometryService.convexHull(points).then(function (result) {
            var params = new esriApi.BufferParameters();
            params.geometries = [result];
            params.bufferSpatialReference = new esriApi.SpatialReference({ wkid: global.spatialReference });
            params.outSpatialReference = new esriApi.SpatialReference({ wkid: global.spatialReference });
            params.distances = [10];
            params.unit = "meters";
            // var ptBuff = esriApi.geometryEngine.buffer(result, 10, "meters");//4.x 新使用方法，速度会比geometryService快，暂未使用
            geometryService.buffer(params).then(function (bufferResult) {
                var symbol = new esriApi.SimpleFillSymbol({ style: "solid", color: [204, 102, 255, 0.5], outline: new esriApi.SimpleLineSymbol({ color: [255, 0, 0, 0], width: 2, style: "solid" }) });
                for (var k = 0; k < bufferResult.length;k++)
                {
                    var graphic = new esriApi.Graphic(bufferResult[k], symbol);
                    layers.add(graphic);
                }
            }, thiss.showBufferError);
        }, function (error) {
            console.log("An error occured during convex hull calculation");
        });
    }
    DrawClosePipe(allData,layer){
        var widthTemp = 5;
        //停水管道
        for (var i = 0; i < allData.ListPipe.length; i++) {
            var line = this.GetLine(allData.ListPipe[i].Coordinate);
            var gra1 = this.DrawLineGraphic(widthTemp, '#cc00ff', line);//'#FD5318'
            layer.add(gra1)
        }
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
    DrawPolygon(listX,listY,layer){
        // console.log("DrawPolygon",listX)
        var arrTemp = new Array();
        for(var i = listX.length - 1;i >= 0;i--)
        {
            if (listX[i] != "0") {
                var temp = new Array();
                temp.push(listX[i]);
                temp.push(listY[i]);
                arrTemp.push(temp);
            }
        }
        var singleRingPolygon = new esriApi.Polygon(arrTemp);
        singleRingPolygon.spatialReference = new esriApi.SpatialReference({ wkid: global.spatialReference });
        layer.add(this.DrawPolygonGraphic(singleRingPolygon));
    }
    /**
     * 画面
     * @param {*} geometry 坐标信息SimpleLineSymbol  .SimpleLineSymbol.STYLE_SOLID
     */
    DrawPolygonGraphic(geometry) {
        var symbol = new esriApi.SimpleFillSymbol({ style: "solid", color: [204, 102, 255, 0.5], outline: new esriApi.SimpleLineSymbol({ color: [255, 0, 0, 0], width: 2, style: "solid" }) });
        var gra1 = new esriApi.Graphic(geometry, symbol);
        return gra1;
    }
    showBufferError(error)
    {
        //console.log(error);
    }

    /**
     * 画停水管道与阀门的信息
     * @param {*} allData 
     * @param {*} layer 
     */
    DrawCloseValve(allData,layer) {
        this.DrawCloseValveMain(allData,layer);
         //关闭阀门
         for (var i = 0; i < allData.ListValve.length; i++) {
            allData.ListValve[i].GraphicType = 'Valve';
            var gra1 = this.CreatePictureGraphic(PictureProperty.closeValve, new esriApi.Point(allData.ListValve[i].X, allData.ListValve[i].Y, new esriApi.SpatialReference({ wkid: global.spatialReference })), allData.ListValve[i]);
            layer.add(gra1)
        }
    }

     /**
     * 创建一个图片的graphic
     * @param {*} pProperty 
     * @param {*} geometry 
     */
    CreatePictureGraphic(pProperty, geometry, attributes = null){
        var markerSymbol = new esriApi.PictureMarkerSymbol({ url: pProperty.url, width: pProperty.width + "px", height: pProperty.height + "px",
             xoffset: pProperty.xoffset + "px", yoffset: pProperty.yoffset + "px", angle: pProperty.angle});
        if (pProperty.color != '') markerSymbol.color = pProperty.color;
        var gra1 = new esriApi.Graphic(geometry, markerSymbol, attributes);
        return gra1;
    }


    DrawCloseValveMain(allData,layer){
        var widthTemp = 5;
        //停水管道
        for (var i = 0; i < allData.ListPipe.length; i++) {
            var line = this.GetLine(allData.ListPipe[i].Coordinate);
            var gra1 = this.DrawLineGraphic(widthTemp, '#cc00ff', line);//'#FD5318'
            layer.add(gra1)
        }
        //通水管道
        for (var i = 0; i < allData.ListReleasedPipes.length; i++) {
            var line = this.GetLine(allData.ListReleasedPipes[i].Coordinate);
            var gra1 = this.DrawLineGraphic(widthTemp, '#52B22C', line);
            layer.add(gra1)
        }
        //止回阀
        for (var i = 0; i < allData.ClosedCheckValvesData.length; i++) {
            var gra1 = this.CreatePictureGraphic(PictureProperty.checkValve, new esriApi.Point(allData.ClosedCheckValvesData[i].X, allData.ClosedCheckValvesData[i].Y, new esriApi.SpatialReference({ wkid: global.spatialReference })), allData.ClosedCheckValvesData[i]);
            layer.add(gra1)
        }
        //需打开阀门
        for (var i = 0; i < allData.OpenValvesList.length; i++) {
            allData.OpenValvesList[i].GraphicType = 'OpenValve';
            var gra1 = this.CreatePictureGraphic(PictureProperty.openValve, new esriApi.Point(allData.OpenValvesList[i].X, allData.OpenValvesList[i].Y, new esriApi.SpatialReference({ wkid: global.spatialReference })), allData.OpenValvesList[i]);
            layer.add(gra1)
        }
        //需关闭已关闭阀门
        for (var i = 0; i < allData.CloseValvesList.length; i++) {
            var gra1 = this.CreatePictureGraphic(PictureProperty.closedValve, new esriApi.Point(allData.CloseValvesList[i].X, allData.CloseValvesList[i].Y, new esriApi.SpatialReference({ wkid: global.spatialReference })), allData.CloseValvesList[i]);
            layer.add(gra1)
        }
    }

    /**
     * 画停水管道与阀门的信息
     * @param {*} allData 
     * @param {*} layer 
     */
    DrawCloseValveTable(allData,layer) {
        this.DrawCloseValveMain(allData,layer);
         //关闭阀门
         for (var i = 0; i < allData.ListValve.length; i++) {
            var gra1 ;
            if(allData.ListValve[i].IsFailure){
            allData.ListValve[i].GraphicType = 'BadValve';
            gra1 = this.CreatePictureGraphic(PictureProperty.badValve, new esriApi.Point(allData.ListValve[i].X, allData.ListValve[i].Y, new esriApi.SpatialReference({ wkid: global.spatialReference })), allData.ListValve[i]);
            }
            else{
            allData.ListValve[i].GraphicType = 'Valve';
            gra1 = this.CreatePictureGraphic(PictureProperty.closeValve, new esriApi.Point(allData.ListValve[i].X, allData.ListValve[i].Y, new esriApi.SpatialReference({ wkid: global.spatialReference })), allData.ListValve[i]);
            }
            layer.add(gra1)
        }
    }


    GetLine(PipeCoordinates) {
        var pathClose = new Array();
        for (var j = 0; j < PipeCoordinates.length; j++) {
            var objTemp = PipeCoordinates[j];
            var pathTemp = new Array();
            pathTemp.push(objTemp.X)
            pathTemp.push(objTemp.Y)
            pathClose.push(pathTemp);
        }
        var pathMain = new Array();
        pathMain.push(pathClose);
        var line = new esriApi.Polyline({
            "paths": [],
            "spatialReference": { "wkid": global.spatialReference }
        });
        line.paths = pathMain;

        return line;
    }
}
export default new Methods()