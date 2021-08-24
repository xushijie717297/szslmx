<template>
	<div class="Analysis">
		<p id="statusBar"></p>
            <van-nav-bar
            :title="msg"
            left-text="低压区分析"
            left-arrow
            @click-left="superior"
            :border="false"
        >
			<template #right>
				<div class="rightTop">
					<div class="moni">模拟结果时间：</div>
					<div class="rightTopDate">
						<p>{{rightTopTime}}</p>
						<div class="tianchong"></div>
						<span @click="jiantou" class="iconfont iconshangyibu-copy" :class="isClass?'top':'bottom'"></span>
					</div>
				</div>
				<van-popup v-model="isClass" position="bottom" get-container="body">
					<van-picker
						show-toolbar
						:columns="RightTopDate"
						@confirm="onConfirmTop"
						@cancel="isClass = false"
						:default-index="DateIndex"
					/>
                </van-popup>
  			</template>
		</van-nav-bar>
		<div class="main">
			<p @click="legend()">
				<span class="iconfont icontuli"></span>
			</p>	
      		<div id="map" ref="mainHeight"  style="width: 100%;height: 100%;"></div>
            <img class="zzImg" src="../../../static/imag/mask.png" alt="">
        </div>
        <!-- 定位浮层 -->
        <div class="foot" ref="Stretch">
			<div class="imgBtn" @click="handClick">
				<img src="../../../static/imag/buttom.png" alt="">
				<p><span>查找路径</span></p>
			</div>
            <div class="foot-top" @touchstart.capture="touchStart" @touchend.capture="touchEnd">
				<div>
				<div class="pipeNetwork" @click="choiceWho" v-show="pipeNetwork">
                    <p>{{areaValue}}</p>
					<span class="iconfont iconxiasanjiaoxing" style="size:12px"></span>
					<van-popup v-model="showPicker" position="bottom" get-container="body">
						<van-picker
							show-toolbar
							:columns="resultData"
							@confirm="onConfirm1"
							@cancel="showPicker = false"
						/>
                	</van-popup>
                </div>
				</div>
				<div class="Selection" @click="changeStyle" :class="{active:isMapClickPipeBurst}">
					<span class="iconfont icondingwei2"></span>
					<p>图上选择</p>
				</div>
            </div>
			<div class="dataList">
				<ul>
					<li>
						<span>线路总长度</span>
						<p>{{AllLength | fill}}m</p>
					</li>
					<li>
						<span>总水头损失</span>
						<p>{{HeadLoss | fill}}m</p>
					</li>
					<li>
						<span>供水水源</span>
						<p>{{SourceName | fill}}</p>
					</li>
					<li>
						<span>起端水压标高</span>
						<p>{{StartHead | fill}}m</p>
					</li>
					<li>
						<span>末端水压标高</span>
						<p>{{EndHead | fill}}m</p>
					</li>
					<li>
						<span>起端压力</span>
						<p>{{StartPressure | fill}}m</p>
					</li>
					<li>
						<span>末端压力</span>
						<p>{{EndPressure | fill}}m</p>
					</li>
				</ul>
			</div>
			<div class="foot-foot">
				<div class="foot-nav">
					<span class="nav-h" @click="shuping">低压区断面图</span>
					<div>
						<p v-for="(item,index) in tabList" :key='index' @click="curr(index)" :class="{tabActive:cur==index}">
							<span>{{item}}</span>
						</p>
					</div>
				</div>
				<!-- 图表 -->
				<div class="foot-echarts" v-show="cur==0">
					<!-- <echart :chartData="chartData" @func="getMsgFormSon"></echart> -->
					<p class="Hscreen iconfont iconhengping1" @click="Hscreen"></p>
					<p class="screenVertical" @click="screenVertical">
						<span class="iconfont iconfangxiang">
							<i>返回</i>
						</span>
					</p>
					<div id="myChartDiv" style="height:270px;width:100%" ></div>
					<div id="myChartDiv1" style="height:100vw;width:100vh" ></div>
				</div>
				<!-- 表格 -->
				<div class="foot-content" v-show="cur==1">
					<div class="Header">
						<h4 v-for="(item,index) in Header" :key='index'>{{item}}</h4>
					</div>
					<div class="lister">
							<div v-for="(item,index) in lister" :key='index' @click="itemClick(item)">
								<p>{{item.ElementId}}</p>
								<p>{{item.Addr}}</p>
								<p>{{item.Headloss}}</p>
								<p>{{item.Slop}}</p>
								<p>{{item.Pressure}}</p>
								<p>{{item.Head}}</p>
							</div>
					</div>
				</div>
			</div>
        </div>
		<van-popup v-model="PopupS" :close-on-click-overlay="false" get-container=".Analysis">
      		<van-loading type="spinner" color="#1989fa" />
    	</van-popup>
		<van-popup
      class="LegendS"
      :style="{ height: '100%' }"
      position="right"
      v-model="LegendS"
      get-container="#app"
    >
      <div class="Basics">
		  <p class="statusBar"></p>
        <h3>基础管网</h3>
        <div class="imgList">
          <div v-for="(item, index) in BasicsLegendImg" :key="index">
            <img :src="item.url" alt="" />
            <p>{{ item.name }}</p>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup
      v-model="EchartA" 
      position="bottom"
      :style="{ height: '42%' }">
        <div class="popupTop">
          <p>24小时{{pipeChartData.label}}曲线</p>
          <p @click="showMapClick1" class="iconfont iconguanbi4"></p>
        </div>
      <EchatAtt></EchatAtt>
    </van-popup>
    <van-popup
      v-model="showMap"
      position="bottom"
      :style="{ height: '42%' }"
      :overlay="false"
      get-container=".warning"
    >
      <div class="popupBox">
        <div class="popupTop">
          <p>管道属性</p>
          <p @click="showMapClick" class="iconfont iconguanbi4"></p>
        </div>
        <div class="popupContent">
          <div
            v-for="(item, index) in pipeAttrData"
            :key="index"
            class="popupB"
          >
            <p>{{ item.name }}{{ item.unit }}</p>
            <p>
              {{ item.value }}
              <span
                class="iconfont iconquxiantu"
                v-if="index == '0'"
                @click="FlowChart"
              ></span>
              <span
                class="iconfont iconquxiantu"
                v-if="index == '1'"
                @click="VelocityChart"
              ></span>
              <span
                class="iconfont iconquxiantu"
                v-if="index == '2'"
                @click="HeadlossChart"
              ></span>
            </p>
          </div>
        </div>
      </div>
    </van-popup>
	<!-- <van-popup
      v-model="EchartPmt" 
      position="bottom"
      :style="{ height: '100%' }">
		<div class="EchartPm">
				<div id="myCharts" style="height:300px;width:11rem" ></div>
				<div class="charts" @click="screenVertical()">返回</div>
		</div>
    </van-popup> -->
	</div>
</template>
<script>
import Vue from 'vue';
import axios from "axios"
import urlClass  from "../../components/js/UrlClass"
import global  from "../../components/js/Global"
import drawClass from "../../components/arcgisforjsTest/DrawClass"
// import supplyPath from "../../components/arcgisforjsTest/SupplyPath"
import popupLable from "../../components/js/popupLable"
import blackinfowin from "../../../static/imag/blackinfowin.png"
import mark from "../../../static/imag/redIcon.png"
import greenpin from "../../../static/imag/orangeIcon.png"
import echart from "./echarts.vue"
import { DropdownMenu, DropdownItem, NavBar, Icon, Button, Picker, Popup, Tab, Tabs, Overlay, Loading,Dialog } from 'vant';

Vue.use(Loading);
Vue.use(Overlay);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Popup);
Vue.use(Picker);
Vue.use(Button);
Vue.use(Icon);
Vue.use(NavBar);
import $ from "jquery";
import { loadModules } from "esri-loader";
import tileInfo from "../../components/arcgisforjsTest/tdt_data.js";
import Bus from "../../utils/Bus";
import Attribute from "../../components/js/Attribute";
import EchatAtt from "../warn/EchatAttr"
export default {
    name: "Analysis",
	// inject:["reload"],
	components: {
		echart,
		[Dialog.Component.name]: Dialog.Component,
    	EchatAtt
	},
    data () {
	  return {
		  AttributePupup:true,
	      myChart: null,
	      myChart1: null,
		  EchartPmt:false,
      	  showMap: false,
      	  EchartA: false,
		  arcgisJsApi:null,
		  screenHeight:0,
		  PopupS:false,//遮罩层
		  chartData:null,//图表数据
		  RightTopDate:[],
		  rightTopTime:'',
		  isClass:false,
		  DateIndex:0,
		  tabList:['剖面图','沿线数据'],
		  Header:["编号","地址","水头损失","水力坡度","末端压力","水压标高"],
		  lister:[],
		  LegendS:false,
		  BasicsLegendImg: [
			{
			name: "水泵机组",
			url: require("../../../static/imag/PipeBurst/pump_icon.png"),
			},
			{
			name: "水池水箱",
			url: require("../../../static/imag/PipeBurst/tank_icon.png"),
			},
			{
			name: "消火栓",
			url: require("../../../static/imag/PipeBurst/hydrant_icon.png"),
			},
			{
			name: "止回阀",
			url: require("../../../static/imag/PipeBurst/cv.png"),
			},
			{
			name: "流量阀",
			url: require("../../../static/imag/PipeBurst/fcv.png"),
			},
			{
			name: "减压阀",
			url: require("../../../static/imag/PipeBurst/prv.png"),
			},
			{
			name: "阀门",
			url: require("../../../static/imag/PipeBurst/valve_icon.png"),
			},
			{
			name: "全关阀门",
			url: require("../../../static/imag/PipeBurst/valve_closed.png"),
			},
			{
			name: "半开阀门",
			url: require("../../../static/imag/PipeBurst/valve_partclosed.png"),
			},
			{
			name: "节点",
			url: require("../../../static/imag/PipeBurst/junction_icon.png"),
			},
			{
			name: "供水管道",
			url: require("../../../static/imag/PipeBurst/pipe_icon.png"),
			},
		  ],
		  tabMain: ['echarts', 'dataList'],
		  cur:0,
          pipeNetwork:false,
          buttom:true,
          showPicker2:false,
          showPicker:false,
          data:[],
		  msg:'',
		  Id:0,
		  drapValue:'',
		  areaValue:'区域最低压力',
		  resultData:[],
		  resultData1:[],
		  columns:['图上选择', '区域最低压力'],
		  judgeSpot:false,//判断点
		  judgeRange:false,//判断范围
		  supplyPathReturn:{},//放置坐标点管网参数
		  minPressureId:0,
		  spotCoordinate:0,
		  supplyPathPositionLayer:null,
		  LocationGraphicsLayer:null,
		  areaDrawLayer:null,
		  featurePolygonLayerview_SupplyPath:null,
		  highlightHover2:null,
		  pipeBurstPositionLayer:null,
      	  mapClickgl:null,
		  drapValue:'',
		  listAreaData:[],
		  searchAreaData:[],
		  graData_SupplyPath:[],
		  view:null,
		  query:null,
		  locationQueryUrlType:'',//定位
		  initExtent:null,
		  eventType:null,
		  isMapClickPipeBurst:false,//控制点击
		  EN_HYDRANT : "5",//消火栓
		  EN_JUNCTION:'7',//节点
		  EN_VALVE:'5',//阀门
		  EN_PIPE:'9',//管道
		  EN_HYDRANTElement:'54',//消火栓elementTypeId
		  EN_JunctionElement:'55',//节点elementTypeId
		  EN_TCVElement:'61',//阀门elementTypeId
		  EN_PipeElement:'69',//管道elementTypeId
		  sourceMarkerSymbol:null,//水厂牌子
		//   sourceMarkerSymbol 
		  greenMarkerSymbol:null,//绿色定位点
		  AllLength:'',//线路总长度
		  HeadLoss:'',//总水头损失
		  SourceName:'',//供水水源
		  StartHead:'',//起端水压标高
		  StartPressure:'',//起端压力
		  EndPressure:'',//末端水压标高
		  EndHead:'',//末端压力
		  startY:0,//触摸开始点
		  endY:0,//触摸结束点
		  pipeAttrData: [],
      	  pipeChartData: []
	  }
    },
	filters: {
		fill: function (value) {
			let data = value
			if (value == "") {
				data = "-"
			}
			return data
		}
	},
	methods: {
	Hscreen(){
		console.log("横屏走起")
		plus.screen.lockOrientation("landscape-primary");
	},
	screenVertical(){
		console.log("返回竖屏")
		plus.screen.lockOrientation("portrait-primary");

	},
	FlowChart() {
      //流量echarts
      console.log("流量echarts", this.pipeChartData);
      this.pipeChartData.field = "Flow"
      this.pipeChartData.label = "流量"
      this.pipeChartData.unit = "m³/h"
      var id = this.pipeChartData.id
      var type = this.pipeChartData.type
      var field = this.pipeChartData.field
      var label = this.pipeChartData.label
      var unit = this.pipeChartData.unit
      Attribute.ChartClick(id, field, type, label, unit)
    },
    VelocityChart() {
      //流速echarts
      console.log("流速echarts");
      this.pipeChartData.field = "Velocity"
      this.pipeChartData.label = "流速"
      this.pipeChartData.unit = "m/s"
      var id = this.pipeChartData.id
      var type = this.pipeChartData.type
      var field = this.pipeChartData.field
      var label = this.pipeChartData.label
      var unit = this.pipeChartData.unit
      Attribute.ChartClick(id, field, type, label, unit)
    },
    HeadlossChart() {
      //水头损失echarts
      console.log("水头损失echarts");
      this.pipeChartData.field = "Headloss"
      this.pipeChartData.label = "水头损失"
      this.pipeChartData.unit = "m"
      var id = this.pipeChartData.id
      var type = this.pipeChartData.type
      var field = this.pipeChartData.field
      var label = this.pipeChartData.label
      var unit = this.pipeChartData.unit
      Attribute.ChartClick(id, field, type, label, unit)
    },
    showMapClick() {
      this.showMap = false;
      this.mapClickgl.removeAll();
    },
    showMapClick1() {
      this.EchartA = false;
    },
		legend() {
			this.LegendS = true;
		},
		curr(index){
			this.cur = index
		},
		shuping(){
		},
		jiantou(){
			this.isClass = !this.isClass
		},
		onConfirmTop(value){
			this.rightTopTime = value
			this.isClass = false
		},
		itemClick(itemData){
			var whereTemp = "ElementId = " + itemData.ElementId;
				this.locationQueryUrlType = "pipe";
                this.TableItemClickLocation(whereTemp, urlClass.PipeResult);
		},
		getMsgFormSon(obj){
				this.supplyPathPositionLayer.removeAll();
                var pointNew = new this.arcgisAPI.Point(obj.X, obj.Y, new this.arcgisAPI.SpatialReference({ wkid: global.spatialReference }));
                var gra1 = drawClass.CreatePictureGraphic({
					url:greenpin,
					width:20,
					height:41,
					xoffset:0,
					yoffset:17,
					angle:0,
					color:''
				}, pointNew);
                this.supplyPathPositionLayer.add(gra1)
                this.view.center = pointNew;
		},
		//点击查找路径
		handClick(){
			if(this.judgeRange){
				this.areaDrawLayer.visible = true
			}

			// if(this.pipeBurstPositionLayer){
				this.pipeBurstPositionLayer.visible = false
			// }
			if(this.judgeRange == false && this.judgeSpot == false){
				Dialog.confirm({
				title: "提示",
				message: "请先选择查找的节点或管道",
				})
				.then(() => {
					// on confirm
				})
				.catch(() => {
					// on cancel
				});
			}else if(this.judgeRange){
				var obj = new Object();
                obj.type = "pressureLow";
				obj.id = this.MinPressureId;
				this.FindSupplyPath(obj)
			}else if(this.judgeSpot){
				var obj = new Object();
                obj.type = "click";
				obj.id = this.spotCoordinate;
				// debugger
				this.FindSupplyPath(obj)
			}

		},
		FindSupplyPath(obj){
			this.PopupS = true;//请求开始遮罩展示
			// debugger
			    this.eventType = "SupplyPath";
                var elementIdTemp = obj.id;
                var type = obj.type;
                var whereTemp = ("ElementId = " + elementIdTemp);
                this.locationQueryUrlType = "junction"
				var layerId = '';
                if (type == "click") {
                    switch (this.supplyPathReturn.elementTypeId) {
                        case this.EN_HYDRANTElement: layerId = (this.EN_HYDRANT); break;
                        case this.EN_JunctionElement: layerId = (this.EN_JUNCTION); break;
                        case this.EN_TCVElement: layerId = (this.EN_VALVE); break;
                        case this.EN_PipeElement: layerId = (this.EN_PIPE); break;
                    }
				}
                else if (type == "pressureLow") {
                    layerId = (this.EN_JUNCTION)
				}
				this.TableItemClickLocation(whereTemp, urlClass.baseMapUrl + layerId);
                var parameter = new Object();
                parameter.ElementId = String(elementIdTemp);
                parameter.ElementType = '0';
                parameter.Time = String((new Date()).getHours());
                parameter.Time = global.time;
                parameter.TableNodeName = 'junction';
				parameter.TablePipeName = 'pipe';
                this.FindSupplyPath1( urlClass.axiosUrl + "GetSupplyPath", parameter , urlClass.baseMapUrl + this.EN_PIPE, this.supplyPathLayer, this.sourceMarkerSymbol, this.view, this.greenMarkerSymbol, popupLable);
		},
		FindSupplyPath1(tempUrl,paraMeter,urlTemp,layer,LocationMarkerSymbol,map,greenMarkerSymbol,popupLable){
			var self = this;
			console.log('供水路径参数',JSON.stringify(paraMeter))
			axios.post(
				tempUrl,
				JSON.stringify(paraMeter),
				 global.axiosHeaders
			)   
			.then(function(respone){
				self.FindSupplyPathReturn(respone,urlTemp,layer,LocationMarkerSymbol,map,greenMarkerSymbol,popupLable)
			}) 
		},
		FindSupplyPathReturn(respone,urlTemp,layer,LocationMarkerSymbol,map,greenMarkerSymbol,popupLable){
		var result1 = respone.data;
        if(result1 && String(result1.Code) == "0"){
            var result = result1.Response[0];
			// debugger
			this.passEchart(result)
			this.AllLength = result.AllLength
			this.HeadLoss = result.HeadLoss
			this.SourceName = result.SourceName
			this.StartHead = result.StartHead
			this.StartPressure = result.StartPressure
			this.EndPressure = result.EndPressure
			this.EndHead = result.EndHead
			this.lister = result.PipeInfoData
			this.PopupS = false;//查询结束遮罩隐藏
			this.$refs.Stretch.style.bottom = 0 + "rem"
			this.$refs.Stretch.style.transition = "bottom 0.6s";
            var position1 = -9.7;
            this.$refs.mainHeight.style.height = this.screenHeight - 11 - 1.2 + "rem";
			console.log('result',result)

			var pipeResult = result.PipeResult.slice(0);
			var nodeResult = result.NodeResult.slice(0);
			var nodeTypeResult = result.NodeTypeResult.slice(0);
			var nodeHGL = result.NodeHGL.slice(0);
			var nodeHGL2 = result.NodeHGL2.slice(0);
			var pipeSlop = result.PipeSlop.slice(0);
			var nodeElev = result.NodeElev.slice(0);
			
			var pipeInfoData = result.PipeInfoData.slice(0);
			var sourceName = result.SourceName;
			var coordiante = result.PipeCoordinates.slice(0);
			var minX = Number(coordiante[0].Coordinate[0].X);
			var maxX = Number(coordiante[0].Coordinate[0].Y);
			var minY = Number(coordiante[0].Coordinate[0].X);
			var maxY = Number(coordiante[0].Coordinate[0].Y);
			var sourcePoint;
			for(var i=0;i<coordiante.length;i++)
			{
				var linePath = new Array();
				var path = new Array();
				var pipe = coordiante[i];
				for(var j=0;j<pipe.Coordinate.length;j++)
				{
					var array = new Array();
					var point = pipe.Coordinate[j];
					array.push(point.X);
					array.push(point.Y);
					path.push(array);
					if(i==coordiante.length-1&&j==pipe.Coordinate.length-1)
					{
						sourcePoint = new this.arcgisAPI.Point(Number(point.X), Number(point.Y), new this.arcgisAPI.SpatialReference({ wkid: global.spatialReference }));
					}
					if(minX>Number(point.X))
					minX = Number(point.X)
					if(maxX<Number(point.X))
					maxX = Number(point.X)
					if(minY>Number(point.Y))
					minY = Number(point.Y)
					if(maxY<Number(point.Y))
					maxY = Number(point.Y)
				}
				
				linePath.push(path)
				var line = new this.arcgisAPI.Polyline({
					"paths":[],
					"spatialReference": { "wkid": global.spatialReference }
				});
				line.paths = linePath;
				var gra1 = drawClass.DrawLineGraphic(5,'#ff7f00',line);
				layer.add(gra1);
			}
			// WindowsEvent.MyDispatchEvent("FindPathReturn",result);
			popupLable.destroy();//删除气泡
			if (sourceName) {
				//加载popup的数据
				popupLable.loadPopup([{
					id: "1",
					title: sourceName,
					type: "supplySc",
					select: false,
					x: sourcePoint.x,
					y: sourcePoint.y
				}]);
			}
			drawClass.MapResultDataRangeZoom([this.supplyPathLayer], this.view);
			}else{
				console.log("错误信息:", result);
			}
		},
		passEchart(data){//向图表子组件传参
			console.log(data)
			var listLabelData = Object.assign({}, data);
			this.labelData = listLabelData;
			var chartData = new Object();
			var listX = new Array();
			listX = listLabelData.LengthCount;
			var listY1 = new Array();
			listY1 = listLabelData.NodeElev;
			var listY2 = new Array();
			listY2 = listLabelData.NodeHGL; //NodeCoordiantes
			var listY3 = new Array();
			listY3 = listLabelData.NodeCoordiantes;
			var listY4 = new Array();
			listY4 = listLabelData.NodePressure;
			chartData.listXNew = listLabelData.LengthCountNew.slice(0).reverse();
			chartData.listX = listX.slice(0).reverse();
			chartData.listY1 = listY1.slice(0).reverse();
			chartData.listY2 = listY2.slice(0).reverse();
			chartData.listY3 = listY3.slice(0).reverse();
			chartData.listY4 = listY4.slice(0).reverse();
			listLabelData.chartData = Object.assign({}, chartData);
			this.chartData = chartData
			this.$nextTick(()=>{
				this.drawLine();
				this.drawLine1();
			})
			console.log(this.chartData)
		},
		 /**
         *查询窗口下方表格中单行元素的定位信息
          * @param {*} whereMy 查询条件
          * @param {*} urlTemp 查询服务地址
         */
        // TableItemClickLocation(whereMy, urlTemp) {
		// 	debugger
		// 	console.log('表格定位')
		// 	var query = this.arcgisAPI.Query()
        //     query.geometry = this.initExtent;
        //     query.where = whereMy;
		// 	query.outFields = ["ElementId"];
        //     var queryTask = new this.arcgisAPI.Polygon(urlTemp);
        //     queryTask.execute(query).then(this.SelectLocationInfo, function(error){
        //         console.log(error);
        //     });
        // },
		choice(){
			this.showPicker2 = !this.showPicker2
		},
		choiceWho(){
			this.showPicker = !this.showPicker
		},
        superior(){
            this.$router.go(-1)
		},
		changeStyle(){
			this.areaValue = '区域最低压力';
			// if(this.supplyPathLayer){
			// 	this.supplyPathLayer.removeAll()
			// }
			// debugger
			if(this.lister.length > 0){
				this.lister = []
				this.LocationGraphicsLayer.removeAll();
				this.highlightHover2.removeAll();
				this.supplyPathPositionLayer.removeAll();
				this.supplyPathLayer.removeAll();
				popupLable.destroy();
				this.pipeBurstPositionLayer.removeAll();
			}
			this.$refs.Stretch.style.bottom = -9.7 + "rem";
			this.$refs.mainHeight.style.width = '100%'
			this.$refs.mainHeight.style.height = "100%"
			this.isMapClickPipeBurst = !this.isMapClickPipeBurst
			console.log(this.isMapClickPipeBurst)
			if (this.isMapClickPipeBurst) {
				this.AttributePupup = false
			}else{
				this.AttributePupup = true
			}
			if (this.isMapClickPipeBurst) {
				this.LocationGraphicsLayer.removeAll();
				this.highlightHover2.remove();
				this.supplyPathPositionLayer.removeAll()
				this.supplyPathLayer.removeAll()
				if(this.areaDrawLayer){
					this.areaDrawLayer.visible = false
				}
				this.pipeBurstPositionLayer.visible = true
				this.judgeRange = false
			}
		},        
		onConfirm1(value){
			// debugger
			this.AttributePupup = false
			if(this.lister.length > 0){
				this.lister = []
				popupLable.destroy();
				this.$refs.Stretch.style.bottom = -9.7 + "rem";
				this.$refs.mainHeight.style.width = '100%'
				this.$refs.mainHeight.style.height = "100%"
			}
			this.judgeSpot = false;
			this.judgeRange = true
			this.LocationGraphicsLayer.removeAll();
			if(this.highlightHover2){
				this.highlightHover2.remove();
			}
			this.supplyPathPositionLayer.removeAll()
			this.supplyPathLayer.removeAll()
			this.pipeBurstPositionLayer.removeAll()
			// this.pipeBurstPositionLayer.visible = false
			this.isMapClickPipeBurst = false
			if(this.areaDrawLayer){
				this.areaDrawLayer.visible = true
			}
			console.log(value)
			this.showPicker = false;
			this.areaValue = value
			console.log(this.listAreaData)
			var minPressureId = ''
			var item = {}
			switch (value) {
				case '全管网':
					minPressureId = this.listAreaData[0].MinPressureId
					item = this.listAreaData[0]
				break;
				case '南山片区':
					minPressureId = this.listAreaData[1].MinPressureId
					item = this.listAreaData[1]
				break;		
				case '前海片区':
					minPressureId = this.listAreaData[2].MinPressureId
					item = this.listAreaData[2]
				break;
				case '福田片区':
					minPressureId = this.listAreaData[3].MinPressureId
					item = this.listAreaData[3]
				break;
				case '沙头角片区':
					minPressureId = this.listAreaData[4].MinPressureId
					item = this.listAreaData[4]
				break;
				case '罗湖片区':
					minPressureId = this.listAreaData[5].MinPressureId
					item = this.listAreaData[5]
				break;
				case '盐田重力流片区':
					minPressureId = this.listAreaData[6].MinPressureId
					item = this.listAreaData[6]
				break;
				case '盐田加压片区':
					minPressureId = this.listAreaData[7].MinPressureId
					item = this.listAreaData[7]
				break;
			}
			this.MinPressureId = minPressureId;
			var whereTemp = ("elementId = " + minPressureId)
			var EN_JUNCTION = "7";
			var layerId = (EN_JUNCTION);
			this.locationQueryUrlType = 'junction'
			this.TableItemClickLocation(whereTemp, urlClass.baseMapUrl + layerId);
			this.DrawConsumptionById_SupplyPath(item.Id)
		},
		// selectAreaData() {
        //     this.drapValue = "";
        //     var self = this;
		// 	var time = new Date().getHours();
        //      axios.post("http://112.64.170.158:8013/Service1.svc/Rest/AreaNameSupplyPath",
        //         JSON.stringify(global.time), global.axiosHeaders
        //     ).then(function(response) {
		// 		console.log(response)
		// 		var result = response.data;
        //         if(result && String(result.Code) == "0"){
		// 		self.listAreaData = result.Response;
		// 		for(var i = 0; i < respone.data.length; i++) {
		// 			var obj = respone.data[i];
		// 			self.resultData.push(obj.Name)
		// 		}
        //         self.areaValue=self.listAreaData[0].Name;
        //         self.onConfirm1(self.listAreaData[0].Name);
        //         // self.drapValue=self.listAreaData[0].MinPressureId;
		// 		self.selectAreaCoordinatesData(self.listAreaData);
		// 		}else{
        //             console.log("错误信息:", result.Message);
        //         }
        //     });    
		// },
		selectAreaCoordinatesData(responeData) {//2020.11.11
            for (let i = 0; i < responeData.length; i++) {
				const item = responeData[i];
				let area = [];
				for (let j = 0; j < item.ListX.length; j++) {
					const itemX = item.ListX[j];
					const itemY = item.ListY[j];
					area.push([itemX, itemY]);
				}
				this.searchAreaData.push({
					Name: item.Name,
					Id: item.Id,
					Color: item.Color,
					Area: area
				});
			}
			if(this.searchAreaData!=undefined){
				this.SupplyPathAreaBlock(this.searchAreaData)
			}	
		},
	SupplyPathAreaBlock(dataList){
		// debugger
		var self = this;
		console.log(this)
		console.log(self.arcgisAPI)	
        //区域用水量（绘制区域）
        this.graData_SupplyPath = [];
        var rings = [];
		let uniqueValueInfos = [];
        for (let i = 0; i < dataList.length; i++) {
			const element = dataList[i];
			// debugger
            if (element.Area.length > 0) {
				rings.push(element.Area);
				const poly = new self.arcgisAPI.Polygon({rings: element.Area, spatialReference: self.view.spatialReference});
                const gra = new self.arcgisAPI.Graphic({geometry: poly, attributes: {Id:element.Id,Name:element.Name,pt:poly.extent.center}});
                this.graData_SupplyPath.push(gra);
                //渲染分级
                uniqueValueInfos.push({value: element.Id, symbol: {type: "simple-fill", color: element.Color, outline: {color: "#333",width: "1px"}}});
            }
        }
       this.areaDrawLayer = new this.arcgisAPI.FeatureLayer({
			id: "areaDrawLayer",
			visible: false,
            source: this.graData_SupplyPath,
            fields: [
              {name: "ObjectID", alias: "ObjectID", type: "oid"},
              {name: "Id", alias: "Id", type: "string"},
              {name: "Name", alias: "Name", type: "string"}
            ],
            objectIdField: "ObjectID",
            geometryType: "polygon",
            renderer: {
              type: "unique-value",
              field: "Id",
              uniqueValueInfos: uniqueValueInfos
            }
        });
			this.view.map.addMany([this.areaDrawLayer], 1);
		    this.view.whenLayerView(this.areaDrawLayer).then(function(layerview){
		         self.featurePolygonLayerview_SupplyPath = layerview;
				
			});
		},
		getId(){
			var time = new Date().getHours();
			var self = this
			axios
			.get(urlClass.axiosUrl + "GetLowPressureNode/" + String(time))
			.then(function(respone) {
				self.drapValue = respone.data.ElementId
			});
		},
		TableItemClickLocation(whereMy, urlTemp) {
			var self = this
			var query = this.arcgisAPI.Query()
			// query.geometry = self.initExtent;
			query.returnGeometry = true;
            query.where = whereMy;
			query.outFields = ["ElementId"];
			// debugger
            var queryTask = new this.arcgisAPI.QueryTask(urlTemp);
            queryTask.execute(query).then(self.SelectLocationInfo, function(error){
                console.log(error);
			});
		},
		 /**
         * 查询窗口下方表格中单行元素的定位信息(返回结果)
         * 查询返回参数
         */
        SelectLocationInfo(re) {
			console.log('我执行了',re)
            for (var i = 0; i < re.features.length; i++) {
                var feature = re.features[i];
				var geometeyTemp = feature.geometry;
                if (this.locationQueryUrlType == "junction" || this.locationQueryUrlType == "Customer") {
                    this.PositionMy(geometeyTemp);
                }
                else if (this.locationQueryUrlType == "pipe") {
					console.log('我到了这里')
                    var path = geometeyTemp.paths;
                    var points = path[0];
                    var point1 = points[0];
                    var point2 = points[1];
                    var x = Math.abs(Number(point1[0]) + Number(point2[0])) / 2;
					var y = Math.abs(Number(point1[1]) + Number(point2[1])) / 2;
					console.log(x,y)
                    var point = this.arcgisAPI.Point(x, y, new this.arcgisAPI.SpatialReference({ wkid: global.spatialReference }));
                    this.PositionMy(point);
                }
            }
		},
        PositionMy(point) {
			console.log("定位点")
			var marks = mark
			if(this.locationQueryUrlType == "pipe"){
				marks = greenpin
			}
            this.LocationGraphicsLayer.removeAll();
            var gra1 = drawClass.CreatePictureGraphic({
					url:mark,
					width:20,
					height:41,
					xoffset:0,
					yoffset:17,
					angle:0,
					color:''
			}, point);
            this.LocationGraphicsLayer.add(gra1);
            this.view.center = point;
		},
		DrawConsumptionById_SupplyPath(Id){
			// debugger
			if (this.highlightHover2) {
				// debugger
				this.highlightHover2.remove();
			}
			if (Id != "0") {
				for (let i = 0; i < this.graData_SupplyPath.length; i++) {
					const gra = this.graData_SupplyPath[i];
					const item = gra.attributes;
					if (item.Id == Id) {
						console.log("通过--");
						this.highlightHover2 = this.featurePolygonLayerview_SupplyPath.highlight(gra);
						break;
					}
				}
			}
		},
		selectAreaData1() {
            var self = this;
			var time = new Date().getHours();
             axios.post( urlClass.axiosUrl + "AreaNameSupplyPath",
                JSON.stringify(global.time), global.axiosHeaders
            ).then(function(response) {
				// debugger
				var result = response.data;
                if(result && String(result.Code) == "0"){
					self.listAreaData = result.Response;
					for(var i = 0; i < result.Response.length; i++) {
						var obj = result.Response[i];
						self.resultData.push(obj.Name)
					}
					self.selectAreaCoordinatesData(self.listAreaData);
				}else{
                    console.log("错误信息:", result.Message);
                }
			});
			    
		},
		getTopDate(){
			var time = new Date().getHours();
			this.rightTopTime = "今天" + time + "点";
			for (let i = 0; i < 24; i++) {
				switch (true) {
					case i > time:
						var data = "今天" + i + "点"
						this.RightTopDate.push(data)
						break;
					case i < time:
						var data = "昨天" + i + "点"
						this.RightTopDate.push(data)
						break;
					case i == time:
						var data = "今天" + i + "点"
						this.RightTopDate.push(data)
						break;
				}	
			}
			this.DateIndex = this.RightTopDate.indexOf(this.rightTopTime)

		},
		touchStart(e) {//关阀
			this.startY = e.touches[0].clientY;
		},
		touchEnd(e){
			this.endY = e.changedTouches[0].clientY;
			var moveY = this.endY - this.startY;
			console.log(moveY);//Stretch
			var position1 = -9.7
			var position2 = 0
		if(this.lister.length != "0"){
			this.searchMove(moveY, position1, position2,this.$refs.Stretch)}
		},
		searchMove(moveY, position1, position2,node){
			var high = node.style.bottom;
			console.log(high)
			if(moveY > 0 && Math.abs(moveY) > 20 && high == position2 + "rem"){
				this.$refs.Stretch.style.bottom = position1 + "rem";
				this.$refs.mainHeight.style.width = '100%'
        		this.$refs.mainHeight.style.height = "100%"
			}else if(moveY < 0 && Math.abs(moveY) > 20 && high == position1 + "rem"){
				this.$refs.Stretch.style.bottom = position2 + "rem";
        		this.$refs.mainHeight.style.height = this.screenHeight - 11 - 1.2 + "rem";
				
			}
		},
	drawLine() {
      // 基于准备好的dom，初始化echarts实例
      if (this.myChart) {
        this.myChart.resize();
      } else {
        this.myChart = this.$echarts.init(
          document.getElementById("myChartDiv")
        );
        console.log("asd");
      }
      // 绘制图表
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
          alwaysShowContent: false,
          triggerOn: "click",
        },
        grid: {
          top: "13%",
          left: "15%",
          right: "5%",
          bottom: "15%",
        },
        title: {
          textStyle: {
            //文字颜色
            color: "#6e7b8b",
            //字体风格,'normal','italic','oblique'
            fontStyle: "normal",
            //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
            fontWeight: "bold",
            //字体系列
            fontFamily: "sans-serif",
            //字体大小
            fontSize: 14,
          },
          left: "center",
        },
        legend: {
          data: ["高程", "水头"],
          textStyle: {
            color: "#636b7a",
          },
		  top:"2%"
        },
        textStyle: {
          color: "#6e7b8b",
        },
        xAxis: [
          {
            show: false,
            name: "距离(m)",
            type: "category",
			nameLocation: "middle",
            data: this.chartData.listX,
            axisPointer: {
              type: "shadow",
            },
            axisLabel: {
              interval: 0,
            },
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#334756", //左边线的颜色
                width: "1", //坐标线的宽度
              },
            },
          },
          {
            position: "bottom",
            name: "距离(m)",
            type: "category",
			nameLocation: "middle",
            data: this.chartData.listXNew,
            nameTextStyle: {
              lineHeight: 40
            },
            axisPointer: {
              type: "shadow",
            },
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#334756", //左边线的颜色
                width: "1", //坐标线的宽度
              },
            },
          },
        ],
        yAxis: [
          {
            name: "高程(m)",
            type: "value",
			nameLocation: "middle",
			nameTextStyle: {
              lineHeight: 40
            },
            axisLabel: {
              formatter: "{value}",
            },
            axisTick: { show: false },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#334756",
                type: "dashed",
              },
            }, //去除网格线
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#334756", //左边线的颜色
                width: "1", //坐标线的宽度
              },
            },
            position: "left",
          },
        ],
        series: [
          {
            type: "line",
            name: "水头",
            data: this.chartData.listY2,
            itemStyle: {
            //   normal: {
                color: "#46759f",
                width: 2,
            //   },
            },
            areaStyle: {
            //   normal: {
                color: "#46759f",
            //   },
            },
          },
          {
            type: "line",
            name: "高程",
            data: this.chartData.listY1,
            itemStyle: {
            //   normal: {
                color: "#8d6d30",
                width: 2,
            //   },
            },
            areaStyle: {
            //   normal: {
                color: "#8d6d30",
            //   },
            },
          },
          {
            symbol: "none",
            type: "line",
            name: "压力",
            data: this.chartData.listY4,
            itemStyle: {
            //   normal: {
                color: "#2bbd78",
                lineStyle: {
                  color: "rgba(0,0,0,0)",
                  width: 2,
                },
            //   },
            },
            areaStyle: {
            //   normal: {
                color: "rgba(0,0,0,0)",
            //   },
            },
          },
        ],
      };
      var self = this;
      this.myChart.setOption(option);
      this.myChart.on("click", function (params) {
        // 控制台打印数据的名称
        var obj = self.chartData.listY3[params.dataIndex];
		self.getMsgFormSon(obj)
        // self.$emit("func", obj);
        // WindowsEvent.MyDispatchEvent("SupplyPathCharPosition", obj);
      });
    },
	drawLine1() {
      // 基于准备好的dom，初始化echarts实例
      if (this.myChart1) {
        this.myChart1.resize();
      } else {
        this.myChart1 = this.$echarts.init(
          document.getElementById("myChartDiv1")
        );
        console.log("asd");
      }
      // 绘制图表
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
          alwaysShowContent: false,
          triggerOn: "click",
        },
        grid: {
          top: "20%",
          left: "13%",
          right: "7%",
          bottom: "15%",
        },
        title: {
		  text:"低压区断面图",
		  top:"3%",
          textStyle: {
            //文字颜色
            color: "#fff",
            //字体风格,'normal','italic','oblique'
            fontStyle: "normal",
            //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
            fontWeight: "bold",
            //字体系列
            fontFamily: "sans-serif",
            //字体大小
            fontSize: 14,
          },
          left: "center",
        },
        legend: {
          data: ["高程", "水头"],
          textStyle: {
            color: "#636b7a",
          },
		  top:"10%"
        },
        textStyle: {
          color: "#6e7b8b",
        },
        xAxis: [
          {
            show: false,
            name: "距离(m)",
            type: "category",
            data: this.chartData.listX,
			nameLocation: "middle",
			nameTextStyle: {
              lineHeight: 40
            },
            axisPointer: {
              type: "shadow",
            },
            axisLabel: {
              interval: 0,
            },
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#334756", //左边线的颜色
                width: "1", //坐标线的宽度
              },
            },
          },
          {
            position: "bottom",
            name: "距离(m)",
            type: "category",
            data: this.chartData.listXNew,
			nameLocation: "middle",
            nameTextStyle: {
              lineHeight: 40
            },
            axisPointer: {
              type: "shadow",
            },
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#334756", //左边线的颜色
                width: "1", //坐标线的宽度
              },
            },
          },
        ],
        yAxis: [
          {
            name: "高程(m)",
            type: "value",
			nameLocation: "middle",
			nameTextStyle: {
              lineHeight: 60
            },
            axisLabel: {
              formatter: "{value}",
            },
            axisTick: { show: false },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#334756",
                type: "dashed",
              },
            }, //去除网格线
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#334756", //左边线的颜色
                width: "1", //坐标线的宽度
              },
            },
            position: "left",
          },
        ],
        series: [
          {
            type: "line",
            name: "水头",
            data: this.chartData.listY2,
            itemStyle: {
            //   normal: {
                color: "#46759f",
                width: 2,
            //   },
            },
            areaStyle: {
            //   normal: {
                color: "#46759f",
            //   },
            },
          },
          {
            type: "line",
            name: "高程",
            data: this.chartData.listY1,
            itemStyle: {
            //   normal: {
                color: "#8d6d30",
                width: 2,
            //   },
            },
            areaStyle: {
            //   normal: {
                color: "#8d6d30",
            //   },
            },
          },
          {
            symbol: "none",
            type: "line",
            name: "压力",
            data: this.chartData.listY4,
            itemStyle: {
            //   normal: {
                color: "#2bbd78",
                lineStyle: {
                  color: "rgba(0,0,0,0)",
                  width: 2,
                // },
              },
            },
            areaStyle: {
            //   normal: {
                color: "rgba(0,0,0,0)",
            //   },
            },
          },
        ],
      };
      var self = this;
      this.myChart1.setOption(option);
      this.myChart1.on("click", function (params) {
        // 控制台打印数据的名称
        var obj = self.chartData.listY3[params.dataIndex];
		self.getMsgFormSon(obj)
        // self.$emit("func", obj);
        // WindowsEvent.MyDispatchEvent("SupplyPathCharPosition", obj);
      });
    },
	},
	mounted () {
		console.log("加载完成了。。。。。。。。")
		// Bus.$on("EchatAttr", (res) => {
		// this.EchartA = true;
		// this.$nextTick(()=>{
		// Bus.$emit("EchatAttrData", res);
		// })
		// });
		Bus.$on("pipeAttr", (res) => {
		this.pipeAttrData = res;
		});
		Bus.$on("EchatAttrs", (res) => {
		console.log(res);
		this.pipeChartData = res;
		});
		Bus.$on("EchatAttrE", (res) => {
		this.EchartA = true;
		this.$nextTick(() => {
		Bus.$emit("EchatAttrData", res);
		})
		});
		this.screenHeight = window.screen.height/37.5;
		console.log(this.screenHeight)
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
			"esri/layers/GraphicsLayer",
			"esri/layers/FeatureLayer",
			"esri/tasks/QueryTask",
			"esri/geometry/Point",
			"esri/tasks/support/query",
			'esri/symbols/PictureMarkerSymbol',
			"esri/tasks/support/IdentifyParameters",
			"esri/tasks/IdentifyTask",
			"esri/geometry/Polyline",
			'esri/Color',
			'esri/symbols/SimpleLineSymbol',
			"esri/geometry/geometryEngine",
        	"esri/symbols/SimpleMarkerSymbol",
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
			GraphicsLayer,
			FeatureLayer,
			QueryTask,
			Point,
			Query,
			PictureMarkerSymbol,
			IdentifyParameters,
			IdentifyTask,
			Polyline,
			Color,
			SimpleLineSymbol,
			geometryEngine,
			SimpleMarkerSymbol
		]) => {
			this.arcgisAPI = { 
				SpatialReference: SpatialReference,
				Extent: Extent,
				GraphicsLayer:GraphicsLayer,
				Graphic:Graphic,
				Polygon:Polygon,
				FeatureLayer:FeatureLayer,
				QueryTask:QueryTask,
				Point:Point,
				Query:Query,
				PictureMarkerSymbol:PictureMarkerSymbol,
				Polyline:Polyline ,
				Color:Color,
				SimpleLineSymbol:SimpleLineSymbol,
				geometryEngine:geometryEngine,
				SimpleMarkerSymbol:SimpleMarkerSymbol,
				IdentifyTask:IdentifyTask,
				IdentifyParameters:IdentifyParameters
			};
			drawClass.setArcgisforAPI(this.arcgisAPI);
        	Attribute.setArcgisforAPI(this.arcgisAPI);
			console.log(this.arcgisAPI)
			this.initExtent = drawClass.GetMapInitExtent(global.initExtent)
			this.arcgisView = { MapView: MapView };
			this.arcgisExtent = { Extent: Extent };
			var data = tileInfo.tileInfo;
			var str = JSON.stringify(data);
			var tileInfoTemp = JSON.parse(str);
			for (var i = 0; i < tileInfoTemp.lods.length; i++) {
			tileInfoTemp.lods[i].resolution *= global.mul;
			}
			var map = new ArcGISMap(); // 创建地图实例
			var wtl_tileInfo = new TileInfo(tileInfoTemp);
			// let webTileMap = new WebTileLayer("http://112.64.170.158:8098/Service1.svc/Rest/GMService/{col}/{row}/{level}/1", {tileInfo: wtl_tileInfo});
			let webTileMap = new WebTileLayer(
			urlClass.amap,
			{ tileInfo: wtl_tileInfo }
			);
			map.add(webTileMap);
			var dynamicMapServiceLayer = new MapImageLayer(urlClass.appMapUrl);
			map.add(dynamicMapServiceLayer);
			var initExtent = new Extent(global.initExtent.minX, global.initExtent.minY, global.initExtent.maxX, global.initExtent.maxY,
            new SpatialReference({ wkid: global.spatialReference }));
			var view = (this.view = new MapView({
			highlightOptions: {color: [255, 0, 0, 1]},
			container: "map",
			map: map,
			extent: initExtent,
			spatialReference: new SpatialReference({ wkid: global.spatialReference })
			}));
			var self = this;
            //初始化
            this.view.ui.components = [];
			this.view.popup.dockEnabled = false;
			this.view.popup.collapseEnabled = false;
			this.view.popup.dockOptions = { buttonEnabled: false, breakpoint: false, position: "bottom-left" };//禁用停靠
			this.view.popup.actions = null;

			this.supplyPathPositionLayer = new GraphicsLayer();	//
			this.supplyPathLayer = new GraphicsLayer();//
			this.LocationGraphicsLayer = new GraphicsLayer();	
			this.highlightHover2 = new GraphicsLayer();
			this.pipeBurstPositionLayer = new GraphicsLayer();
        	this.mapClickgl = new GraphicsLayer();

			map.add(this.pipeBurstPositionLayer);
			map.add(this.highlightHover2);
    		map.add(this.supplyPathLayer);//
			map.add(this.LocationGraphicsLayer);
			map.add(this.supplyPathPositionLayer);//
        	map.add(this.mapClickgl);

			this.sourceMarkerSymbol = new PictureMarkerSymbol({ url: blackinfowin, width: 20, height: 41});
			this.greenMarkerSymbol = new PictureMarkerSymbol({ url: greenpin, width: 20, height: 41});
			view.when(function(e){
				console.log("LoadMap完成");
				//初始化刷新气泡窗口位置
				popupLable.initPopupEvent(view, "supplyPopup", true);
				popupLable.frameHeight = 35;
			}, function(error){
				console.log("The view's resources failed to load: ", error);
			});

			this.view.on("click", function (event) {
				if(self.isMapClickPipeBurst){
					// self.isMapClickPipeBurst = false
					console.log('我点击了管网')
					IdentifyMain(event.mapPoint);
				}
			if (self.AttributePupup) {
				var layer = self.mapClickgl;
				Attribute.myIdentify(event,self.view,layer,map);
				Bus.$on("Legend", (res) => {
				console.log(res);
				if (res.results.length > 0) {
					self.showMap = true;
				}
				});
			}
			});
			view.popup.watch("visible", function (event) {
				if (!event) {
					MyHideInfoWindow(event);
				}
			});
			function MyHideInfoWindow(event) {
				self.mapClickgl.removeAll();
			}
			function IdentifyMain(pointTemp) {
				var idenrifyParams = new IdentifyParameters();
				idenrifyParams.returnGeometry = true;
				idenrifyParams.width = view.width;
				idenrifyParams.height = view.height;
				idenrifyParams.geometry = pointTemp;
				idenrifyParams.tolerance = 5;
				idenrifyParams.mapExtent = view.extent;
				idenrifyParams.spatialReference = view.spatialReference;
				var identifyTask = new IdentifyTask(urlClass.baseMapUrl);
				identifyTask.execute(idenrifyParams)
					.then(SupplyPathResultFunction, function (error) {
					console.log(error);
					});
			}
			function SupplyPathResultFunction(evt) {
				var point = {};
				var elemetidTemp = 0;
				var elementType = 0;
				var feature;
				if (evt.results.length > 0) {
					var identifyResult = evt.results[0];
					feature = identifyResult.feature;
					var attributeTemp = feature.attributes;
					console.log(attributeTemp)
					if (feature.geometry.type == 'point') {
						console.log('point')
						point = feature.geometry;
						elemetidTemp = attributeTemp.ElementId;
						elementType = attributeTemp.ElementTypeId;
						self.supplyPathReturn.elementId = elemetidTemp;
						self.supplyPathReturn.elementTypeId = elementType
						self.spotCoordinate = elemetidTemp
					}
					else if (feature.geometry.type == 'polyline') {
						console.log('polyline')
						elemetidTemp = attributeTemp.StartNodeID;
						elementType = attributeTemp.StartNodeType;
						self.supplyPathReturn.elementId = elemetidTemp;
						self.supplyPathReturn.elementTypeId = elementType
						self.spotCoordinate = elemetidTemp
						var paths = feature.geometry.paths[0];
						var point1 = paths[0];
						var point2 = paths[1];
						var x = (Number(point1[0])+Number(point2[0]))/2;
						var y = (Number(point1[1])+Number(point2[1]))/2;
						point = Point(x,y,new SpatialReference({ wkid: global.spatialReference })); 
						
					}
					else {
						return;
					}
				PositionSupplyPathNode(point,self.pipeBurstPositionLayer);
				// self.getData({ ElementID: elemetidTemp, ElementTypeId: elementType })
				}

			}
			function PositionSupplyPathNode(point,layerTemp){
				// debugger
				self.isMapClickPipeBurst = false
				console.log('PositionSupplyPathNode')
				layerTemp.removeAll(); 
				var symbol = {
					type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
					url: mark,
					width: 16,
					height: 32,
					yoffset: 16
				};
				var gra1 = new Graphic(point, symbol);
				layerTemp.add(gra1);
				self.judgeSpot = true;
			}
		}
		);
		console.log(this.arcgisAPI)
		this.getTopDate()
		this.pipeNetwork = global.component
		if (global.component) {
			this.selectAreaData1()
		}
	},
	beforeDestroy() {
		plus.screen.lockOrientation("portrait-primary");
		if (this.view) {
		// destroy the map view
		popupLable.destroy();
		this.view.container = null;
		}
  }
};
</script>
<style scoped lang="less">
@import "./Analysis.less";
.Analysis /deep/ .van-popup{
    background-color: transparent !important;
}
.popupBox {
  position: relative;
  background: #242838;
}
.popupTop {
  height: 44 * @r;
  width: 100%;
  box-sizing: border-box;
  padding-left: 10 * @r;
  background: #242838;
  color: #fff;
  position: sticky;
  top: 0px;
  p {
    font-size: 14px;
    float: left;
    line-height: 44 * @r;
    &:nth-child(2) {
      float: right;
      width: 50 * @r;
      height: 100%;
      text-align: center;
      line-height: 44 * @r;
      font-size: 14px;
      color: #8e92a9;
    }
  }
}
.popupContent {
  box-sizing: border-box;
  width: 100%;
  padding: 0 10 * @r;
  background: #171a2a;
  color: #8e92a9;
}
.popupB {
  display: flex;
  border: 1px solid #262a3b;
  border-bottom: none;
  background: #222638;
  p {
    flex: 1;
    height: 40 * @r;
    box-sizing: border-box;
    padding: 0 10 * @r;
    display: flex;
    align-items: center;
    span {
      display: block;
      height: 100%;
      text-align: center;
      line-height: 44 * @r;
      width: 50 * @r;
      color: #2e9bde;
      margin-right: -10 * @r;
    }
    &:nth-child(2) {
      justify-content: flex-end;
      font-size: 15px;
      font-weight: bold;
    }
  }
  &:nth-child(even) {
    background: #1c1f2f;
  }
}
</style>
