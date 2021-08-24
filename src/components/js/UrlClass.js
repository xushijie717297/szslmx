export default{
    /**
     * 阀门状态的图标
     */
    valveStatusImageSource: (localStorage.getItem("imgPath") ? localStorage.getItem("imgPath") : "/static/theme/lighttheme/") + 'assets/valve_change.png',
    /**
     * 阀门全关的图标
     */
    valveCloseSource: (localStorage.getItem("imgPath") ? localStorage.getItem("imgPath") : "/static/theme/lighttheme/") + 'assets/valve_closed.png',
    /**
     * 阀门半开的图标
     */
    valvePartCloseSource: (localStorage.getItem("imgPath") ? localStorage.getItem("imgPath") : "/static/theme/lighttheme/") + 'assets/valve_partclosed.png',
    /**
     * 地图上最大值的图标
     */
    maxSource: (localStorage.getItem("imgPath") ? localStorage.getItem("imgPath") : "/static/theme/lighttheme/") + 'assets/colored-pins-blue.png',
    /**
     * 地图上最小值的图标
     */
    minSource: (localStorage.getItem("imgPath") ? localStorage.getItem("imgPath") : "/static/theme/lighttheme/") + 'assets/colored-pins-red.png',

    arcgisUrlIp:'',

    googleMapUrl:'',
    /**
     * 本地arcgisAPI
     */
    /**
     * 高德底图
     */
    // amap:"http://121.40.242.176:8098/Service1.svc/Rest/GMService/{col}/{row}/{level}/2/amap",
    // amap:"http://112.64.170.158:8098/Service1.svc/Rest/GMService/{col}/{row}/{level}/2",
    arcgisAPIUrlHost:'192.168.1.177:8010',
    amap:"http://10.200.6.71:8088/arcgis/rest/services/SSEQ_TYFW/Basemap_dem/MapServer/tile/{level}/{row}/{col}",//深圳内网
    /**
     * 服务器接口地址
     */
    // axiosUrl:"http://112.64.170.158:8012/Service1.svc/Rest/",//'http://localhost:17458/Service1.svc/Rest/',//
    // axiosUrl:"http://112.64.170.158:8013/Service1.svc/Rest/",//'http://localhost:17458/Service1.svc/Rest/',//
    axiosUrl:"http://10.200.6.71:8088/WaterService/Service1.svc/Rest/",//'http://localhost:17458/Service1.svc/Rest/',//深圳内网
    // axiosUrl:"http://192.168.1.254:8014/Service1.svc/Rest/",//'http://localhost:17458/Service1.svc/Rest/',//

    //
    /**
     * 本地接口地址
     */
    axiosUrlLocalHost:'http://localhost:17458/Service1.svc/Rest/',

    /**
     * 日常调度接口
     */
    axiosUrlRC:"http://112.64.170.158:8190/Service1.svc/",

    /**
     * 应急调度接口
     */
    axiosUrl2:"http://112.64.170.158:8186/Service1.svc/",
    /**
     * 应急调度接口
     */
    axiosUrlYJ:"http://112.64.170.158:8192/Service1.svc/",
    /**
     * 计划调度接口
     */
    axiosUrJH:"http://112.64.170.158:8187/Service1.svc/",
    /**
     * 预案管理接口
     */
    axiosUrYA:"http://112.64.170.158:8189/Service1.svc/",
    /**
     *事件预警接口
    */
   axiosUrWarningEvent: "http://112.64.170.158:8184/Service1.svc/",
    /**
     * 地形图接口
     */
    reliefMap:'http://10.200.6.57:6080/arcgis/rest/services/SSEQ_TYFW/Basemap_jsy/MapServer',

    /**
     * 管道结果服务
     */
    pipeResultUrl:'http://112.64.170.158:8888/ArcGIS/rest/services/PipeResult_sxquanNew/MapServer/0',//查询的服务
    /**
     * 节点结果服务
     */
    // junctionResultUrl:'http://112.64.170.158:8888/ArcGIS/rest/services/JunctionResult_sxquanNew/MapServer/0',//查询的服务
    junctionResultUrl:'http://10.200.6.71:8088/reliefMapUrl/ArcGIS/rest/services/JunctionResult_sznew/MapServer/0',//查询的服务深圳内网
    /**
     * app管网
     */
    // appMapUrl:"http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sz_BaseMap1/MapServer",
    appMapUrl:"http://10.200.6.71:8088/reliefMapUrl/ArcGIS/rest/services/ModelPipe_sznew_BaseMap1/MapServer/",//新的深圳内网

     /**
     * 基础管网服务
     */
    // baseMapUrl:'http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sxquan_BaseMapNew1/MapServer/',//10.200.6.71s
    /**
     * 浅色基础管网服务
     */
    baseMapUrlTint:'http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sxquan_BaseMapNew/MapServer/',//10.200.6.71
    /**             
     * 深圳基础管网服务
     */
    baseMapUrl:'http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sz_BaseMap/MapServer/',
    /**
     * 用户数据服务
     */
    customerUrl:'http://112.64.170.158:8888/ArcGIS/rest/services/CustomerMeter_sxquanNew/MapServer/0',
    /**
     * 几何服务
     */
    geometryService:'http://112.64.170.158:8888/ArcGis/rest/services/Geometry/GeometryServer',
     /**
     * 凸包
     */
    proxUrl:'http://112.64.170.158:8888/proxy.ashx',
     /**
     * 首页数据接口
     */
    // homePage:'http://112.64.170.158:8013/HomePageService.svc/Rest/',
    homePage:'http://10.200.6.71:8088/HomePageService.svc/Rest/',//深圳内网
     /**
     * 基础地图
     */
    baseLayers: [{id:"layerWebTile", label:"谷歌地图", type:"webTile", visible: true, url:"http://112.64.170.158:8098/Service1.svc/Rest/GMService/"}],
    /**
    * 业务地图
    */
    businessLayers: [{id:"baseMapUrl", label:"baseMapUrl", type:"dynamic", visible: true, url:"http://112.64.170.158:8888/ArcGIS/rest/services/ModelPipe_sz_BaseMap/MapServer/"}],
    /**
     * 点击用户列表获取坐标
     */
    // PipeResult:"http://112.64.170.158:8888/ArcGis/rest/services/PipeResult_sz/MapServer/0",
    PipeResult:"http://10.200.6.71:8088/reliefMapUrl/ArcGIS/rest/services/PipeResult_sznew/MapServer/0",//深圳内网
    ArcgisCss:"http://112.64.170.158:8009/ztdata/library/4.12/esri/css/main.css",
    ArcgisUrl:"http://112.64.170.158:8009/ztdata/library/4.12/init.js"
}