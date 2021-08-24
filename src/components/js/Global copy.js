export default{
    /**
        * 管道开关状态
        */
   pipeState:[
       { label: "开", value: 0 },
       { label: "关", value: 1 }
   ],
   component:false,//控制水质事件分析与低压区分析的选择模块显示
   initExtent:{
    minX:"93398.2201",
    minY:"13573.6436",
    maxX:"133535.5920",
    maxY:"50925.5613"     
   },
   mul:0.86972632716139800000,//比例系数
   pipeLayerId:8,
   pipeLayerId0:0,
   ///////////////////压力/////////////////////////////////////////
   pressureLimit:[],
   pressureColor:[],
   pressureWidth:[],//[3,3.5,4,4.5,5],
   pressureIsDisplay:[],
   pressureIcon:[],
   ///////////////////管道流量/////////////////////////////////////////
   pipeFlowLimit:[],//[10,50,100,500,1000,2000,3000],
   pipeFlowColor:[],
   pipeFlowWidth:[],
   pipeFlowIsDisplay:[],
   ///////////////////管道流速/////////////////////////////////////////
   pipeVelocityLimit:[],
   pipeVelocityColor:[],
   pipeVelocityWidth:[],
   pipeVelocityIsDisplay:[],
    ///////////////////水压标高/////////////////////////////////////////
    headLimit:[],
    headColor:[],
    headWidth:[],//[3,3.5,4,4.5,5,5.5],
    headIsDisplay:[],
    headIcon:[],
     ///////////////////水力坡度/////////////////////////////////////////
   pipeSlopLimit:[],
   pipeSlopColor:[],
   pipeSlopWidth:[],
   pipeSlopIsDisplay:[],
    ///////////////////节点流量/////////////////////////////////////////
    demandLimit:[],
    demandColor:[],
    demandWidth:[],
    demandIsDisplay:[],
    demandIcon:[],
     ///////////////////供水分界线/////////////////////////////////////////
    pipeSupplyAreaLimit: ["447830", "95468", "448080", "326683", "447870", "326682", "448120", "448119", "448003", "481332", "481330", "481323"],
    pipeSupplyAreaColor: [],
    pipeSupplyAreaWidth: [],
    pipeSupplyCompareAreaWidth: [2, 2, 2,2],
    pipeSupplyAreaIsDisplay: [],
    pipeSupplyAreaLabels: ["观澜清水池","红木山水厂一期","梅陇泵站","龙华低区出水","高新园泵站","龙华低区","清湖泵站","大和泵站","红木山水厂二期","龙华大浪低区","龙华大浪高区","茜坑水厂DN1800供水",],

    supplyAreaMixWidth:10,
    supplyAreaMixColor:"#481974",

    ///////////////////供水分界线入口点/////////////////////////////////////////
    pipeSupplyAreaNewLimit: [],
    pipeSupplyAreaNewColor: [],
    pipeSupplyAreaNewWidth: [],
    pipeSupplyCompareAreaNewWidth: [2, 2, 2,2, 2, 2,2, 2, 2,2],
    pipeSupplyAreaNewIsDisplay: [],
    pipeSupplyAreaNewLabels: [],

    ///////////////////管龄/////////////////////////////////////////
    pipeAgeLimit:[],
    pipeAgeColor:[],
    pipeAgeWidth:[],
    pipeAgeIsDisplay:[],
     ///////////////////管径分类/////////////////////////////////////////
   pipeDiameterLimit:[],
   pipeDiameterColor:[],
   pipeDiameterWidth:[],
   pipeDiameterIsDisplay:[],
    ///////////////////管材分类/////////////////////////////////////////
    pipeMaterialLimit:[],
    pipeMaterialColor:[],
    pipeMaterialWidth:[],
    pipeMaterialIsDisplay:[],
   ///////////////////水龄/////////////////////////////////////////
   ageLimit:[],
   ageColor:[],
   ageWidth:[],
   ageIsDisplay:[],
   ////////////////////压力波动////////////////////////////////////////////
   /* pressureChangColor:[],
   pressureChangLimit:[],
   pressureChangWidth:[],
   pressureChangeIsDisplay:[], */
   ///////////////////流向变化次数/////////////////////////////////////////
   directionChangeLimit:[],
   directionChangeColor:[],
   directionChangeWidth:[],
   directionChangeIsDisplay:[],
    ///////////////////停水管道/////////////////////////////////////////
    pipeStopWaterLimit:[1],
    pipeStopWaterColor:["#ff0000"],
    pipeStopWaterWidth:[3],
    pipeStopWaterIsDisplay:[true],
    ////////////////////模拟计算////////////////////////////////////////
   planCalPipeFlowIsDisplay:[true,true,true,true,true],
   planCalPipeVelocityIsDisplay:[true,true,true,true,true],
   pressureChangColor:["#f9d801","#f9a301","#f86d02","#f83802","#f70202"],
   pressureChangColorNew:["#f9d801","#f9a301","#f86d02","#f83802","#f70202"],
   pipeChangColorNew:["#02dbf7","#0fa5f8","#1d6ef8","#2a38f9","#3701f9"],
   pressureChangLimit:[],
   pressureChangWidth:[8,8,8,8,8],
   pressureChangeIsDisplay:[true,true,true,true,true],
   pressureChangeIcon:[],
   /////////////////方案管理///////////////////////////////
   planPipeSupplyAreaWidth: [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
   planBaseColor:["#f5d2e5","#EE1289"],
   planBaseColor1:["#1f3b08","#d5fab6"],
   planChangColor:["#f5d2e5","#F4C3DE","#F5B5D8","#F39ECC","#F286C1","#F16FB6","#F158AB","#F0419F","#EF2A95","#EE1289"],
   planChangColor1:["#207ce5","#2D83E6","#398AE7","#4491E8","#5198EA","#5FA1EB","#70AAEC","#91BEEE","#BCD6F3","#dce9f5"],
    ///////////////////////扩散分析/////////////////////////////////////
    diffusionColor:["#800000","#9e1c1c","#bf4343","#de7676","#ffb3b3"],
    diffusionWidth:[5,5,5,5,5],
    diffusionLevel:5,
    diffusionLimit:[],
    diffusionIsDisplay:[true,true,true,true,true],

    isDisplay:[true,true,true,true,true],

   planCalTempDirectionChangeColor:'#EB0076',
   planCalTempDirectionChangeSize:5,

   routerType:'',
   routerDiffusionData:{},

    triangleColor:'#6495ED',//"#B24FB4",
    triangleSize:10,
    directionLevel:5,


    nodeDown:8,
    nodeUp:15,

   pipeDown:4,
   pipeUp:10,

   spatialReference:102113,
   /**
    * 地图比例尺分类
    */
   myScale:[8000,20000],
   /**
    * 管道管径的分类
    */
   myDiameter:[600,1000],
   layerId:{
        /**
        * 减压阀
        */
       'EN_PRVALVE':"0",
       /**
       * 流量阀
       */
       'EN_FCVALVE':"1",
       /**
       * 止回阀
       */
       'EN_CVALVE':"2",
       /**
       * 水泵
       */
       'EN_PUMP':"3",
       /**
       * 水池
       */
       'EN_TANK':"4",
       /**
       * 消火栓
       */
       'EN_HYDRANT':"5",
       /**
       * 阀门
       */
       'EN_VALVE':"6",
       /**
       * 节点
       */
       'EN_JUNCTION':"7",
       /**
       * 管道
       */
       'EN_PIPE':"8",
       'EN_PIPE_1':"9",
       'EN_PIPE_2':"10",
       'EN_TCVTYPECHANGE':"300",
        /**
        * 添加的管道11
        **/
       'EN_ADD_PIPE':"11",
       /**
        * 添加的节点12
        **/
       'EN_ADD_NODE':"12",
       /**
        * 添加的阀门13
        **/
       'EN_ADD_VALVE':"13",

       'EN_DEL_PIPE':"-1",

       /**
        * 添加的管道11
        **/
       'EN_ADD_PIPE_O':"14",
       /**
        * 添加的节点12
        **/
       'EN_ADD_NODE_O':"15",
       /**
        * 添加的阀门13
        **/
       'EN_ADD_VALVE_O':"16",

       'EN_ADD_PIPE_TYPE':"60",
       /**
        * 添加的节点8
        **/
       'EN_ADD_NODE_TYPE':"50",
       'EN_ADD_TANK':'22',
       'EN_ADD_TANK_O':'21',
       'EN_AllDemands':"20",

   },
   AddNodes:[],
   AddPipes:[],
   DelPipes:[],

   /**
    * 用户信息
    */
   UserInfo:{
       UserId:'2',
       UserName:''
   },
   tableNameMain:'',
   time:new Date().getHours()-1,
   timeTheLeastBit:0,
   isTimeTheLeastBit:false,
   isGoogleMap:true,
   isDynamic:false,
   googleRatio:0,
   isRatio:'',
   LayerName:[],
   _kssScrollTop:132,
   _kssScrollLeft:0,
   /**
    * 精确统计图例信息
    */
   flowLegendData:[],
   pressureLegendData:[],
   /**
    * 水池类型
    */
   reserviorType: [
       { label: "压力", value: 0 },
       { label: "流量", value: 1 }
   ],
   reservoirIndex: 0,
   axiosHeaders: { headers: { "Content-Type": "application/json;", "Authorization": "YWRtaW4tenRkYXRhQDEyMw" } }
}
