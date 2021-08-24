import urlClass from './UrlClass'
import axios from 'axios'
import global from './Global'
import drawClass from '../arcgisforjsTest/DrawClass'
import PictureProperty from './PictureProperty';
// import WindowsEvent from "@/components/js/WindowsEvent";
import DrawConditional from "./DrawConditional";
var esriApi = {};
class Methods {

    setArcgisforAPI(_obj){
        esriApi = _obj;
        drawClass.setArcgisforAPI(esriApi);
    }
    Deduplication(array, n1, n2){
        for (let i = 0; i < array.length; i++) {
            if (array[i][0] == n1 && array[i][1] == n2) {
                return true;
            }
        }
        return false;
    }
    getPipeFlowDirection(data,map) {
        console.log("getPipeFlowDirection:", data);
        let directions = [];
        let directionsNew = [];
        let activePipe = data.Response.ActivePipe;
        let staticPipe = data.Response.StaticPipe;
        for (let i = 0; i < activePipe.length; i++) {
            let onlyPath = [];
            let path = activePipe[i].Coordinate;
            for(let j = 0;j < path.length;j++){
                if (!this.Deduplication(onlyPath, Number(path[j].X), Number(path[j].Y))) {
                    onlyPath.push([Number(path[j].X),Number(path[j].Y)]);
                }
            }
            // onlyPath.reverse();
            let polyline = {
                attributes: {
                    elementId: activePipe[i].ElementId,
                    level: activePipe[i].Level,
                    color: [255, 255, 0]
                },
                geometry:{
                    type: "polyline",
                    paths: onlyPath,
                    spatialReference: map.spatialReference
                }
            };
            // if(i > 100 && i < 300){
                directions.push(polyline);
            // }
        }
        for(let i = 0;i < staticPipe.length;i++){
            let path = staticPipe[i].Coordinate;
            let onlyPath = [];
            for(let j = 0;j < path.length;j++){
                if (Number(path[j].X) > 0 && Number(path[j].Y) > 0) {
                    onlyPath.push([path[j].X,path[j].Y]);
                }
            }
            let polyline = {
                attributes: {
                    elementId: staticPipe[i].ElementId,
                    level: staticPipe[i].Level,
                    color: [255, 255, 0]
                },
                geometry:{
                    type: "polyline",
                    paths: onlyPath,
                    spatialReference: map.spatialReference
                }
            };
            directionsNew.push(polyline);
        }
        var object = {directions: directions, directionsNew: directionsNew};
        return object;
        // WindowsEvent.MyDispatchEvent('DrawDirectionPaths', object);
    }
    DrawPipeFlowDirectionNew(data,map) {
        // debugger
        var directions = []; //data.length
        var directionsNew = []; 
        var activePipe = data.Response.ActivePipe;
        var staticPipe = data.Response.StaticPipe;
        for (var i = 0; i < activePipe.length; i++) {
            var obj = new Object();
            var path = activePipe[i].Coordinate;
            var flow = activePipe[i].Flow;
            var level = activePipe[i].Level;
            var onlyPath = [];//
            var onlyPathTemp = [];
            var nfx = 0,nfy = 0;
            for(var j=0;j<path.length;j++){//path.length
                var fromPX = path[j].X;
                var fromPY = path[j].Y;
                var fx, fy;

                fx = fromPX;
                fy = fromPY;
                var fpoint = map.toScreen(new esriApi.Point(Number(fx), Number(fy), new esriApi.SpatialReference({ wkid: 102113 })));
               /*  if(fpoint.x==nfx&&fpoint.y==nfy)
                continue; */
                nfx = fpoint.x;
                nfy = fpoint.y;
                var point = { nfx, nfy};
                onlyPath.push(point)
            } 
            var onlyPathTemp = [];
            for(var k=onlyPath.length-1;k>=0;k--){
                onlyPathTemp.push(onlyPath[k]);
            }
            obj.Level = level;
            obj.onlyPath = onlyPathTemp;
            directions.push(obj);
        }
        for(var i=0;i<staticPipe.length;i++){
            var path = staticPipe[i].Coordinate;
            onlyPath = [];
            for(var j=0;j<path.length;j++){//path.length
                var fromPX = path[j].X;
                var fromPY = path[j].Y;
                var fx, fy;

                fx = fromPX;
                fy = fromPY;
                var fpoint = map.toScreen(new esriApi.Point(Number(fx), Number(fy), new esriApi.SpatialReference({ wkid: 102113 })));
                nfx = fpoint.x;
                nfy = fpoint.y;
                var point = { nfx, nfy};
                onlyPath.push(point)
            } 
            directionsNew.push(onlyPath);
        }
        var object = {directions:directions,directionsNew:directionsNew};
        return object;
        // WindowsEvent.MyDispatchEvent('DrawFlowDirection', object);
    }
    DrawPipeFlowDirection(re, layer,map, field, conditional) {
        var directionsNew = [];
        var directions = []; //
        for (var i = 0; i < re.features.length; i++) {
            var feature = re.features[i];
            var flow = feature.attributes[field];
            var length = feature.attributes['HMIGeometryScaledLength'];
            var diameter = feature.attributes['Physical_PipeDiameter'];
            var path = feature.geometry.paths[0];
            
            if(length < conditional.length||diameter< conditional.diameter) continue;
             var onlyPath = [];
            for(var j=0;j<path.length;j++){
                var fromP = path[j];
                var fx, fy;

                fx = fromP[0];
                fy = fromP[1];
                var fpoint = map.toScreen(new esriApi.Point(Number(fx), Number(fy), new esriApi.SpatialReference({ wkid: 102113 })));
                var nfx = fpoint.x;
                var nfy = fpoint.y;
                var point = { nfx, nfy};
                onlyPath.push(point)
            }
            var onlyPathTemp = [];
            if(flow > 0){
                for(var m=onlyPath.length-1;m>=0;m--){
                    onlyPathTemp.push(onlyPath[m]);
                }
            }
            else if(flow < 0)
            onlyPathTemp = onlyPath;
            else 
            continue; 
            if(Math.abs(flow)<0.001)
            {
                directionsNew.push(onlyPathTemp);
                continue;
            }
            directions.push(onlyPathTemp);
        }
        var object = {directions,directionsNew};
        WindowsEvent.MyDispatchEvent('DrawFlowDirection', object);
    }
    DrawStaticPipeFlowDirection(re, layer,map, field, conditional) {
        var directions = []; 
        var Renderers = [];
        var renderer = new esriApi.UniqueValueRenderer();
        for (var i = 0; i < re.features.length; i++) {
            var feature = re.features[i];
            var flow = feature.attributes[field];
            var length = feature.attributes['HMIGeometryScaledLength'];
            var diameter = feature.attributes['Physical_PipeDiameter'];
            var path = feature.geometry.paths[0];
            
            if(length < conditional.length||diameter< conditional.diameter) continue;

            for(var j=0;j<path.length-1;j++)
            {
                var fromP = path[j];
                var toP = path[j+1];
                var fx, fy, tx, ty, angle;

                if (flow >= 0) {
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
                    continue;
                } 
                var fpoint = map.toScreen(new esriApi.Point(Number(fx), Number(fy), new esriApi.SpatialReference({ wkid: 102113 })));
                var tpoint = map.toScreen(new esriApi.Point(Number(tx), Number(ty), new esriApi.SpatialReference({ wkid: 102113 })));
                var nfx = fpoint.x;
                var nfy = fpoint.y;
                var ntx = tpoint.x;
                var nty = tpoint.y;
                var point = { nfx, nfy, ntx, nty};

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
                PictureProperty.SVGArrow.color = conditional.color;
                PictureProperty.SVGArrow.size = conditional.size;
                var gra1 = drawClass.CreateSVGGraphic(PictureProperty.SVGArrow, angle, new esriApi.Point(Number(midX), Number(midY), new esriApi.SpatialReference({ wkid: global.spatialReference })),{value:String(i)});
                layer.add(gra1); 
                break;
            }
        }
        // WindowsEvent.MyDispatchEvent("drawEnd","");
    }
    DrawOnlyPipeFlowDirection(feature, layer,map, flow) {
        var directions = []; 
        //for (var i = 0; i < re.features.length; i++) 
        {
            //var feature = re.features[i];
            var path = feature.geometry.paths[0];

            for(var j=0;j<path.length-1;j++)
            {
                var fromP = path[j];
                var toP = path[j+1];
                var fx, fy, tx, ty, angle;

                if (Number(flow) > 0) {
                    fx = fromP[0];
                    fy = fromP[1];
                    tx = toP[0];
                    ty = toP[1]
                }
                else if (Number(flow) < 0) {
                    fx = toP[0];
                    fy = toP[1];
                    tx = fromP[0];
                    ty = fromP[1]
                }
                else {
                    continue;
                } 
                var fpoint = map.toScreen(new esriApi.Point(Number(fx), Number(fy), new esriApi.SpatialReference({ wkid: 102113 })));
                var tpoint = map.toScreen(new esriApi.Point(Number(tx), Number(ty), new esriApi.SpatialReference({ wkid: 102113 })));
                var nfx = fpoint.x;
                var nfy = fpoint.y;
                var ntx = tpoint.x;
                var nty = tpoint.y;
                var point = { nfx, nfy, ntx, nty};

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
                var gra1 = drawClass.CreateSVGGraphic(PictureProperty.SVGArrowOnly, angle, new esriApi.Point(Number(midX), Number(midY), new esriApi.SpatialReference({ wkid: global.spatialReference })));
                layer.add(gra1); 
            }
        }
    }
    DrawOnlyPipeDirection(path, layer, flow) {
        for(var j=0;j<path.length-1;j++)
        {
            var fromP = path[j];
            var toP = path[j+1];
            var fx, fy, tx, ty, angle;
            if (Number(flow) > 0) {
                fx = fromP[0];
                fy = fromP[1];
                tx = toP[0];
                ty = toP[1]
            }
            else if (Number(flow) < 0) {
                fx = toP[0];
                fy = toP[1];
                tx = fromP[0];
                ty = fromP[1]
            }
            else {
                continue;
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
            var gra = drawClass.CreateSVGGraphic(PictureProperty.SVGArrowOnly, angle, new esriApi.Point(Number(midX), Number(midY), new esriApi.SpatialReference({ wkid: global.spatialReference })));
            layer.add(gra);
        }
    }
    GetConditionalByScale(scale) {
        for (var i = 0; i < DrawConditional.conditionals.length; i++) {
            var minScale = DrawConditional.conditionals[i].minScale;
            var maxScale = DrawConditional.conditionals[i].maxScale;
            if (scale >= minScale && scale < maxScale) {
                return DrawConditional.conditionals[i];
            }
        }
    }
}
export default new Methods()