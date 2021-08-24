/**
 * Created by W on 2020-04-27.
 */
import esriLoader from 'esri-loader';
import tileInfo from './tdt_data.js';

var esriApi, mapView;
class Methods {
    loadArcgis() {// 该方法用于加载 arcgis 依赖的js,css 等
        // 加载css
        esriLoader.loadCss('http://112.64.170.158:8009/ztdata/library/4.12/esri/css/main.css');
        esriLoader.loadCss('http://112.64.170.158:8009/ztdata/library/4.12/dijit/themes/tundra/tundra.css');
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
            'esri/layers/GraphicsLayer'
        ], {
            url: 'http://112.64.170.158:8009/ztdata/library/4.12/init.js'
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
        GraphicsLayer
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
            GraphicsLayer
        };
    }

    initMap(obj) { // 初始化地图,并设置中心点等
        esriApi = obj;

        //基础图层加载
        var map = mapView = new esriApi.Map();// 创建地图实例
        var data = tileInfo.tileInfo;
        var str = JSON.stringify(data);
        var tileInfoTemp = JSON.parse(str);
        for (var i = 0; i < tileInfoTemp.lods.length; i++) {
            tileInfoTemp.lods[i].resolution *= 0.9105;
        }
        // var dynamicMapServiceLayer = new esriApi.TileLayer("https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer");
        // map.add(dynamicMapServiceLayer);
        var wtl_tileInfo = new esriApi.TileInfo(tileInfoTemp);
        let webTileMap = new esriApi.WebTileLayer("http://112.64.170.158:8098/Service1.svc/Rest/GMService/{col}/{row}/{level}/1", {tileInfo: wtl_tileInfo});
        map.add(webTileMap);
        var view =  new esriApi.MapView({
            map: map,
            container: "map",
            // center: [114.0420384350586,22.543302042829197],//经纬度
            extent:  new esriApi.Extent(91018.9439, 7611.9801, 142976.5999, 34599.5340, new esriApi.SpatialReference({ wkid: 102113 })),
            spatialReference: new esriApi.SpatialReference({ wkid: 102113 })
        });
        //业务图层加载
        // var dynamicMapServiceLayer = new esriApi.MapImageLayer("http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sz_BaseMap/MapServer");
        // view.ui.components = [];

        view.when(function(e){
            console.log("LoadMap完成");
        }, function(error){
            console.log("The view's resources failed to load: ", error);
        });
    }
}

export default new Methods()
