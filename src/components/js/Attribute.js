import global from "./Global";
import urlClass from "./UrlClass";
import axios from "axios";
import attributeData from "./AttributeData";
import FlowDirection from "./FlowDirection";
import img from "../../../static/imag/waterFactory/tk_03.png"
import Bus from "../../utils/Bus"
import pipeattr from "../../../static/pipeattr"
import junction from "../../../static/pipeattr1"
import valve from "../../../static/valve"
import hydrant from "../../../static/hydrant"
import pool from "../../../static/pool"
var esriApi = {};
class Methods {
  setArcgisforAPI(_obj) {
    esriApi = _obj;
  }
  /**
   * Identify查询初始化
   * @param {*} e 地图点击事件对象
   */
  myIdentify(e, view, layer, map) {
    var clickMapPoint;
    var view = view;
    var layer = layer;
    clickMapPoint = new esriApi.Point(
      e.mapPoint.x,
      e.mapPoint.y,
      view.spatialReference
    );
    var typeTemp = "";

    // if (isMapClickSupplyPath) {
    //     typeTemp = 'SupplyPath';
    // }
    // else if (isMapClick) {
    typeTemp = "mapClick";
    // }
    this.IdentifyMain(e.mapPoint, typeTemp, view, layer, map);
  }
  IdentifyMain(pointTemp, typeTemp, view, layer, map) {
    var view = view;
    var layer = layer;
    var idenrifyParams = new esriApi.IdentifyParameters();
    idenrifyParams.returnGeometry = true;
    // idenrifyParams.width = view.width;
    // idenrifyParams.height = view.height;
    idenrifyParams.geometry = pointTemp;
    idenrifyParams.tolerance = 5;
    idenrifyParams.mapExtent = view.extent;
    idenrifyParams.spatialReference = view.spatialReference;
    var identifyTask = new esriApi.IdentifyTask(urlClass.baseMapUrl);
    console.log(this);
    var self = this;
    if (typeTemp == "mapClick" || typeTemp == "") {
      identifyTask.execute(idenrifyParams).then(
        response => {
          Bus.$emit("Legend", response);
          var feature;
          if (response.results.length > 0) {
            {
              feature = response.results[0];
              console.log(feature, view, layer);
              self.MyJudgeLayerId(feature, view, layer, map);
            }
          }
        },
        function(error) {
          console.log(error);
        }
      );
    } else if (typeTemp == "SupplyPath") {
      identifyTask
        .execute(idenrifyParams)
        .then(SupplyPathResultFunction, function(error) {
          console.log(error);
        });
    }
  }
  /**
   * identify查询成功返回函数
   * @param {*} event 返回结果的对象
   */
  //  myResultFunction(event,view) {
  //     var feature;
  //     var view = view
  //     if (event.results.length > 0) {
  //         {
  //             feature = event.results[0];
  //             this.MyJudgeLayerId(feature,view);
  //         }
  //     }
  // }

  /**
   * 根据查询结果中的layerId调用不同的后台接口
   * @param {*} feature 查询返回对象
   */
  MyJudgeLayerId(feature, view, layer, map) {
    var mapInfoWindowPoup = false;
    var infoWindowData = "";
    infoWindowData = feature;
    layer.removeAll();
    var layerId = String(feature.layerId);
    var featureTemp = feature.feature;
    if (
      global.DelPipes.indexOf(Number(featureTemp.attributes.ElementId)) == -1
    ) {
      var mySelectLayerId = layerId;
      var title = "";
      var point = new esriApi.Point();
      if (
        layerId == global.layerId.EN_PIPE_1 ||
        layerId == global.layerId.EN_PIPE_2 ||
        layerId == global.layerId.EN_PIPE
      ) {
        if (
          global.DelPipes.indexOf(Number(featureTemp.attributes.ElementId)) ==
          -1
        ) {
          var path = featureTemp.geometry.paths[0];
          var x = (path[0][0] + path[1][0]) / 2;
          var y = (path[0][1] + path[1][1]) / 2;
          point = new esriApi.Point(x, y, view.spatialReference);

          var markerSymbol = new esriApi.SimpleLineSymbol({
            style: "solid",
            color: new esriApi.Color("#ff0000"),
            width: 4
          });
          var gra1 = new esriApi.Graphic(featureTemp.geometry, markerSymbol);
          layer.add(gra1);
        }
      } else {
        point = new esriApi.Point(
          featureTemp.geometry.x,
          featureTemp.geometry.y,
          view.spatialReference
        );
        var markerSymbol = new esriApi.SimpleMarkerSymbol({
          size: 10,
          color: new esriApi.Color("#ff0000"),
          outline: null
        });
        var gra1 = new esriApi.Graphic(featureTemp.geometry, markerSymbol);
        layer.add(gra1);
      }
      var clickMapPoint = point;
      console.log(layerId)
      switch (layerId) {
        //管道
        case global.layerId.EN_PIPE_1:
        case global.layerId.EN_PIPE_2:
        case global.layerId.EN_PIPE:
          mapInfoWindowPoup = true;
          this.InfoWindowsShowPipe(featureTemp, view, layer, map);
          break;
        //节点
        case global.layerId.EN_JUNCTION:
          mapInfoWindowPoup = true;
          this.InfoWindowsShowJunction(featureTemp, layer);
          break;
        //阀门
        case global.layerId.EN_VALVE:
          mapInfoWindowPoup = true;
          console.log(111)
          this.InfoWindowsShowTcv(featureTemp, layer);
          break;
        //减压阀暂时没有
        case global.layerId.EN_PRVALVE:
          title = "减压阀属性";
          mapInfoWindowPoup = true;
          this.InfoWindowsShowPrv(featureTemp, layer);
          break;
        //水泵----没有
        case global.layerId.EN_PUMP:
          title = "水泵属性";
          mapInfoWindowPoup = true;
          this.InfoWindowsShowPump(featureTemp, layer);
          break;
        //流量阀暂时没有
        case global.layerId.EN_FCVALVE:
          title = "流量阀属性";
          mapInfoWindowPoup = true;
          this.InfoWindowsShowFcv(featureTemp, layer);
          break;
        //消火栓
        case global.layerId.EN_HYDRANT:
          title = "消火栓属性";
          mapInfoWindowPoup = true;
          this.InfoWindowsShowMain(
            featureTemp,
            title,
            "junction",
            attributeData.hydrantAttribute,
            layer
          );
          break;
        //止回阀----没有
        case global.layerId.EN_CVALVE:
          title = "止回阀属性";
          mapInfoWindowPoup = true;
          this.InfoWindowsShowMain(
            featureTemp,
            title,
            "junction",
            attributeData.checkValveAttribute,
            layer
          );
          break;
        //水池
        case global.layerId.EN_TANK:
          title = "水池属性";
          mapInfoWindowPoup = true;
          this.InfoWindowsShowReservoir(featureTemp, layer);
          break;
      }

      if (
        global.DelPipes.indexOf(Number(featureTemp.attributes.ElementId)) == -1
      ) {
        popup();
      }
    }
  }
  /*
   *修改组件列表
   */
  InfoWindowsShowPipe(featureTemp, view, layer, map) {//管道
    console.log(layer)
    console.log("InfoWindowsShowPipe", global.time);
    var tableNameMain = "";
    var view = view;
    var mapClickgl = layer;
    var path = featureTemp.geometry.paths[0];
    var x = (path[0][0] + path[1][0]) / 2;
    var y = (path[0][1] + path[1][1]) / 2;
    var point = new esriApi.Point(x, y, view.spatialReference);
    var title = "管道属性";
    var resultTemp;

    if (
      global.DelPipes.indexOf(Number(featureTemp.attributes.ElementId)) == -1
    ) {
      let parameterTemp = {
        Id: featureTemp.attributes.ElementId,
        Hour: global.time,
        TableName: tableNameMain == "" ? "Result_Pipe" : tableNameMain + "pipe",
        Minute: global.timeTheLeastBit
      };
      axios
        .post(
          urlClass.axiosUrl + "Pipeline",
          JSON.stringify(parameterTemp),
          global.axiosHeaders
        )
        .then(response => {
          var result = response.data;
          if (result && String(result.Code) == "0") {
            var objTemp = result.Response;
            resultTemp = this.GetPipeResult(objTemp);
            var Content = this.GetAttribute(
              attributeData.pipeAttribute,
              featureTemp,
              resultTemp,
              "pipe"
            );
            var objTempData = objTemp[0];
            console.log('%c XSJ-[ featureTemp ]->', 'font-size:13px; background:red; color:#bf2c9f;', featureTemp)
            console.log('%c XSJ-[ objTemp ]->', 'font-size:13px; background:red; color:#bf2c9f;', objTemp[0])
           for (let i = 0; i < pipeattr.length; i++) {
              if (pipeattr[i].name == "流量") {
                pipeattr[i].value = Number(objTempData.Flow).toFixed(2)
              }else if(pipeattr[i].name == "流速"){
                pipeattr[i].value = Number(objTempData.Velocity).toFixed(2)
              }else if(pipeattr[i].name == "起始点压力"){
                pipeattr[i].value = objTempData.StartNodePressure
              }else if(pipeattr[i].name == "终止点压力"){
                pipeattr[i].value = objTempData.EndNodePressure
              }else if(pipeattr[i].name == "分公司"){
                pipeattr[i].value = featureTemp.attributes.分公司
              }else if(pipeattr[i].name == "管径"){
                pipeattr[i].value = featureTemp.attributes.管径
              }else if(pipeattr[i].name == "管长"){
                pipeattr[i].value = featureTemp.attributes.HMIGeometryScaledLength
              }else if(pipeattr[i].name == "管材"){
                pipeattr[i].value = featureTemp.attributes.Physical_PipeMaterial
              }else if(pipeattr[i].name == "阻力系数"){
                pipeattr[i].value = featureTemp.attributes.Physical_HazenWilliamsC
              }else if(pipeattr[i].name == "状态"){
                pipeattr[i].value = featureTemp.attributes.PipeStatus
              }else if(pipeattr[i].name == "管龄"){
                pipeattr[i].value = featureTemp.attributes.PipeAge
              }else if(pipeattr[i].name == "安装年代"){
                pipeattr[i].value = featureTemp.attributes.埋设时间
              }else if(pipeattr[i].name == "水头损失"){
                pipeattr[i].value = objTempData.Headloss
              }else if(pipeattr[i].name == "24小时流向变化"){
                pipeattr[i].value = objTempData.DirectionChange
              }else if(pipeattr[i].name == "模型ID"){
                pipeattr[i].value = featureTemp.attributes.ElementId
              }else if(pipeattr[i].name == "GIS编号"){
                pipeattr[i].value = featureTemp.attributes.Label
              }else if(pipeattr[i].name == "起始节点"){
                pipeattr[i].value = featureTemp.attributes.StartNodeID
              }else if(pipeattr[i].name == "终止节点"){
                pipeattr[i].value = featureTemp.attributes.EndNodeID
              }
           }
           console.log(pipeattr)
           Bus.$emit("pipeAttr", pipeattr);
            map.add(mapClickgl);
            // view.popup.open({
            //   title: title,
            //   content: Content,
            //   location: point
            // });
            this.SetInfoWindowPosition(point, view);
            var flowTemp = 0;
            if (tableNameMain == "") {
              flowTemp = resultTemp[0];
            } else {
              flowTemp = resultTemp[4];
            }
            FlowDirection.DrawOnlyPipeFlowDirection(
              featureTemp,
              mapClickgl,
              view,
              flowTemp
            );
          } else {
            console.log("错误信息:", result.Message);
          }
        });
    }
  }
  InfoWindowsShowJunction(featureTemp,map) {//点
    var tableNameMain = "";
    var mapClickgl = map;
    var self = this;
    var point = new esriApi.Point(featureTemp.geometry.x, featureTemp.geometry.y, map.spatialReference);
    var title = "节点属性";
    var resultTemp;
    var parameterTemp = {
        Id: featureTemp.attributes.ElementId,
        Hour: global.time, 
        TableName: (tableNameMain == "" ? "Result_Junction" : (tableNameMain + "junction")),
        Minute: global.timeTheLeastBit
    };
    axios.post(urlClass.axiosUrl + "NodeSelect", JSON.stringify(parameterTemp), global.axiosHeaders)
        .then(function (response) {
            var result = response.data;
            if(result && String(result.Code) == "0"){
                var objTemp = result.Response;
                console.log(objTemp)
                var junctionAttribute = [];
                resultTemp = self.GetJunctionResult(objTemp);
                var Content = self.GetAttribute(attributeData.junctionAttribute, featureTemp, resultTemp, "junction");
                var objTempData = objTemp[0];
                console.log(objTempData)
                for (let i = 0; i < junction.length; i++) {
                  if (junction[i].name == "水压标高") {
                    junction[i].value = Number(objTempData.Head).toFixed(2)
                  }else if (junction[i].name == "压力") {
                    junction[i].value = Number(objTempData.Pressure).toFixed(2)
                  }else if (junction[i].name == "流量") {
                    junction[i].value = Number(objTempData.Demand).toFixed(2)
                  }else if (junction[i].name == "压力同比") {
                    junction[i].value = objTempData.PressureChange
                  }else if (junction[i].name == "地址") {
                    junction[i].value = featureTemp.attributes.位置
                  }else if (junction[i].name == "分公司") {
                    junction[i].value = featureTemp.attributes.分公司
                  }else if (junction[i].name == "横坐标") {
                    junction[i].value = featureTemp.attributes.HMIGeometryXCoordinate
                  }else if (junction[i].name == "纵坐标") {
                    junction[i].value = featureTemp.attributes.HMIGeometryYCoordinate
                  }else if(junction[i].name == "模型ID"){
                    junction[i].value = featureTemp.attributes.ElementId
                  }else if(junction[i].name == "GIS编号"){
                    junction[i].value = featureTemp.attributes.Label
                  }else if(junction[i].name == "地面高程"){
                    junction[i].value = featureTemp.attributes.地面高程
                  }
               }
               Bus.$emit("junction", junction);
              //  map.add(mapClickgl);
            //    this.SetInfoWindowPosition(point, view);
            // var flowTemp = 0;
            // if (tableNameMain == "") {
            //   flowTemp = resultTemp[0];
            // } else {
            //   flowTemp = resultTemp[4];
            // }
            // FlowDirection.DrawOnlyPipeFlowDirection(
            //   featureTemp,
            //   mapClickgl,
            //   view,
            //   flowTemp
            // );
                // self.ViewPopupOpen(geometryService, map, title, Content, point);
            }else{
                console.log("错误信息:", result.Message);
            }
        });
}
InfoWindowsShowTcv(featureTemp,map) {//阀门tcvAttribute
  // debugger
  var tableNameMain = "";
  var mapClickgl = map;
  var self = this;
  var point = new esriApi.Point(featureTemp.geometry.x, featureTemp.geometry.y, map.spatialReference);
  var title = "阀门属性";
  var resultTemp;
  var parameterTemp = {
      Id: featureTemp.attributes.ElementId,
      Hour: global.time, 
      TableName: (tableNameMain == "" ? "NAN" : (tableNameMain + "junction"))
  };
  axios.post(urlClass.axiosUrl + "TcvSelect", JSON.stringify(parameterTemp), global.axiosHeaders)
      .then(function (response) {
          var result = response.data;
          if(result && String(result.Code) == "0"){
              var objTemp = result.Response;
              resultTemp = self.GetTcvResult(objTemp);
              var Content = self.GetAttribute(attributeData.tcvAttribute, featureTemp, resultTemp, "tcv");
              var objTempData = objTemp[0];
              console.log(objTempData)
              for (let i = 0; i < valve.length; i++) {
                if (valve[i].name == "水压标高") {
                  valve[i].value = Number(objTempData.Head).toFixed(2)
                }else if (valve[i].name == "压力") {
                  valve[i].value = Number(objTempData.Pressure).toFixed(2)
                }else if (valve[i].name == "阀门编号") {
                  valve[i].value = featureTemp.attributes.阀门编号
                }else if (valve[i].name == "地址") {
                  valve[i].value = featureTemp.attributes.位置
                }else if (valve[i].name == "分公司") {
                  valve[i].value = featureTemp.attributes.分公司
                }else if (valve[i].name == "横坐标") {
                  valve[i].value = featureTemp.attributes.HMIGeometryXCoordinate
                }else if (valve[i].name == "纵坐标") {
                  valve[i].value = featureTemp.attributes.HMIGeometryYCoordinate
                }else if(valve[i].name == "模型ID"){
                  valve[i].value = featureTemp.attributes.ElementId
                }else if(valve[i].name == "GIS编号"){
                  valve[i].value = featureTemp.attributes.Label
                }else if(valve[i].name == "高程"){
                  valve[i].value = Number(featureTemp.attributes.Physical_NodeElevation).toFixed(2)
                }else if(valve[i].name == "口径"){
                  valve[i].value = Number(featureTemp.attributes.Physical_ValveDiameter).toFixed(2)
                }else if(valve[i].name == "开关状态"){
                  valve[i].value = featureTemp.attributes.ValveSetting == "0" ? "开" : "关"
                }else if(valve[i].name == "开度"){
                  valve[i].value = (1  - featureTemp.attributes.InitialSettingsRelativeClosure) * 100 + "%"
                }else if(valve[i].name == "安装年代"){
                  valve[i].value = featureTemp.attributes.埋设时间
                }
             }
             Bus.$emit("valve", valve);
              // map.map.add(mapClickgl);

          }else{
              console.log("错误信息:", result.Message);
          }
      });
}
InfoWindowsShowMain(featureTemp,map) {//消火栓
      for (let i = 0; i < hydrant.length; i++) {
        if (hydrant[i].name == "地面高程") {
          hydrant[i].value = featureTemp.attributes.Physical_NodeElevation
        }else if(hydrant[i].name == "分公司"){
          hydrant[i].value = featureTemp.attributes.分公司
        }else if(hydrant[i].name == "模型ID"){
          hydrant[i].value = featureTemp.attributes.ElementId
        }else if(hydrant[i].name == "横坐标"){
          hydrant[i].value = featureTemp.attributes.HMIGeometryXCoordinate
        }else if(hydrant[i].name == "纵坐标"){
          hydrant[i].value = featureTemp.attributes.HMIGeometryYCoordinate
        }else if(hydrant[i].name == "地址"){
          hydrant[i].value = featureTemp.attributes.位置
        }else if(hydrant[i].name == "消火栓编号"){
          hydrant[i].value = featureTemp.attributes.消防栓字段_1
        }
      }
      Bus.$emit("hydrant", hydrant);
}
InfoWindowsShowReservoir(featureTemp,map) {
  var self = this;
  var tableNameMain = "";
  var point = new esriApi.Point(featureTemp.geometry.x, featureTemp.geometry.y, map.spatialReference);
  var title = "水池属性";
  var resultTemp;
  var parameterTemp = {
      Id: featureTemp.attributes.ElementId,
      Hour: global.time, 
      TableName: (tableNameMain == "" ? "RESULT_RESERVOIR" : (tableNameMain + "junction")),
      Minute: global.timeTheLeastBit
  };
  axios.post(urlClass.axiosUrl + "ReservoirSelect", JSON.stringify(parameterTemp), global.axiosHeaders)
      .then(function (response) {
          var result = response.data;
          if(result && String(result.Code) == "0"){
              var objTemp = result.Response;
              resultTemp = self.GetReservoirResult(objTemp,tableNameMain);
              var Content = self.GetAttribute(attributeData.reservoirAttribute, featureTemp, resultTemp, "reservoir");
              var objTempData = objTemp[0];
              console.log(objTempData)
              for (let i = 0; i < pool.length; i++) {
                if (pool[i].name == "ID") {
                  pool[i].value = featureTemp.attributes.ElementId
                }else if (pool[i].name == "名称") {
                  pool[i].value = featureTemp.attributes.Label
                }else if (pool[i].name == "横坐标") {
                  pool[i].value = featureTemp.attributes.HMIGeometryXCoordinate
                }else if (pool[i].name == "纵坐标") {
                  pool[i].value = featureTemp.attributes.HMIGeometryYCoordinate
                }else if (pool[i].name == "底板高程") {
                  pool[i].value = featureTemp.attributes.备注
                }else if (pool[i].name == "水位") {
                  pool[i].value = Number(objTempData.Head).toFixed(2)
                }
             }
             console.log(pool)
             Bus.$emit("pool", pool);
          }else{
              console.log("错误信息:", result.Message);
          }
      });
}
InfoWindowsShowPrv(featureTemp,map) {
  var tableNameMain = "";
  var self = this;
  var point = new esriApi.Point(featureTemp.geometry.x, featureTemp.geometry.y, map.spatialReference);
  var title = "减压阀属性";
  var resultTemp;
  var parameterTemp = {
      Id: featureTemp.attributes.ElementId,
      Hour: global.time, 
      TableName: (tableNameMain == "" ? "NAN" : (tableNameMain + "junction"))
  };
  axios.post(urlClass.axiosUrl + "PrvSelect", JSON.stringify(parameterTemp), global.axiosHeaders)
      .then(function (response) {
          var result = response.data;
          if(result && String(result.Code) == "0"){
              var objTemp = result.Response;
              resultTemp = self.GetPrvResult(objTemp);
              var Content = self.GetAttribute(attributeData.prvAttribute, featureTemp, resultTemp, "prv",tableNameMain,allElementChangeData,map,eventName);
          }else{
              console.log("错误信息:", result.Message);
          }
      });
}
InfoWindowsShowFcv(featureTemp,map) {
  var tableNameMain = "";
  var self = this;
  var point = new esriApi.Point(featureTemp.geometry.x, featureTemp.geometry.y, map.spatialReference);
  var title = "流量阀属性";
  var resultTemp;
  var parameterTemp = {
      Id: featureTemp.attributes.ElementId,
      Hour: global.time, 
      TableName: (tableNameMain == "" ? "NAN" : (tableNameMain + "junction"))
  };
  axios.post(urlClass.axiosUrl + "FcvSelect", JSON.stringify(parameterTemp), global.axiosHeaders)
      .then(function (response) {
          var result = response.data;
          if(result && String(result.Code) == "0"){
              var objTemp = result.Response;
              resultTemp = self.GetFcvResult(objTemp);
              var Content = self.GetAttribute(attributeData.fcvAttribute, featureTemp, resultTemp, "fcv",tableNameMain,allElementChangeData,map,eventName);
              
          }else{
              console.log("错误信息:", result.Message);
          }
      });
}
GetFcvResult(objTemp) {//流量阀
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
         *  将减压阀阀门结果接口返回数据拆分
         * @param {*} objTemp 结果
         */
          GetPrvResult(objTemp) {
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
        *  将famen结果接口返回数据拆分
        * @param {*} objTemp 结果
        */
         GetReservoirResult(objTemp,tableNameMain) {
          objTemp = objTemp[0];
          var array = new Array();
          array.push(objTemp.Head);
          array.push(objTemp.Demand);
          if(global.reservoirIndex==0){
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
         *  将阀门结果接口返回数据拆分
         * @param {*} objTemp 结果
         */
         GetTcvResult(objTemp) {
          objTemp = objTemp[0];
          var array = new Array();
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
         * 将节点结果接口返回数据拆分
         * @param {*} objTemp 结果
         */
         GetJunctionResult(objTemp) {
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
   * 将管道结果接口返回数据拆分
   * @param {*} objTemp 结果
   */
  GetPipeResult(objTemp) {
    objTemp = objTemp[0];
    var array = new Array();
    if (objTemp.Flow == null) objTemp.Flow = 0;
    if (objTemp.Velocity == null) objTemp.Velocity = 0;
    if (objTemp.Headloss == null) objTemp.Headloss = 0;
    if (objTemp.DirectionChange == null) objTemp.DirectionChange = 0;
    var array = new Array();
    array.push(objTemp.Flow);
    array.push(objTemp.Velocity);
    array.push(objTemp.Headloss);
    /*   array.push(objTemp.Age);
              array.push(objTemp.SupplyAreaLabel); */
    array.push(objTemp.StartNodePressure);
    array.push(objTemp.EndNodePressure);
    array.push(objTemp.RealPressure);
    array.push(objTemp.DirectionChange);

    if (objTemp.FlowCalculate != null)
      array.push(Number(objTemp.FlowCalculate));
    if (objTemp.VelocityCalculate != null)
      array.push(Number(objTemp.VelocityCalculate));
    if (objTemp.HeadlossCalculate != null)
      array.push(Number(objTemp.HeadlossCalculate));
      console.log('%c XSJ-[ array ]->', 'font-size:13px; background:red; color:#bf2c9f;', array)
    return array;
  }
  GetAttribute(attributes, featureTemp, resultTemp, type) {
    var chart = new Object()
          chart = {
            id:featureTemp.attributes.ElementId,
            type:type
          }
          Bus.$emit("EchatAttrs", chart);
    // debugger
    // var pipeState = [
    //   { label: "开", value: 0 },
    //   { label: "关", value: 1 }
    // ];
    // var IsRevise = false;
    // var reservoirIndex = 0;
    // var buttonboxdiv = "";
    // //创建outboxdiv节点
    // var outboxdiv = document.createElement("div");
    // outboxdiv.id = "outboxdiv";
    // /* outboxdiv.style.cssText = "width:100%;height:450px;" */
    // outboxdiv.style.cssText = "width:100%;";
    // //创建outboxdiv的子节点newdiv
    // var newdiv = document.createElement("div");
    // newdiv.className = "switch-animate switch-on";
    // newdiv.id = "switch_div";
    // /* newdiv.style.cssText =
    //             "height: 420px;" */

    // outboxdiv.appendChild(newdiv);
    // var boxList = new Array();
    // var tboxList = new Array();
    // var leftList = new Array();
    // var rightList = new Array();
    // var allList = new Array();
    // //创建newdiv的子节点
    // var son1 = document.createElement("div");
    // son1.id = "son1_div";
    // son1.style.cssText = "width:100%;height:238px;overflow:auto";
    // newdiv.appendChild(son1);
    // //for循环，创建son1的子节点
    // for (var i = 0; i < attributes.length; i++) {
    //   if (type == "reservoir") {
    //     if (i == 3 || i == 5) {
    //       if (reservoirIndex != 0) {
    //         continue;
    //       }
    //     } else if (i == 4 || i == 6) {
    //       if (reservoirIndex != 1) {
    //         continue;
    //       }
    //     }
    //   }
    //   var sonson1 = document.createElement("div");
    //   sonson1.id = "sonson_1" + i;

    //   if (i % 2 == 0) {
    //     sonson1.className = "box";
    //   } else {
    //     sonson1.className = "tbox";
    //   }
    //   sonson1.style.cssText =
    //     "display: -webkit-box;display: -webkit-flex; display: -ms-flexbox;display:flex;flex-direction:row;flex-wrap:nowrap;justif-content: center;align-items: center;width:100%;";
    //   son1.appendChild(sonson1);
    //   if (i % 2 == 0) boxList.push(sonson1);
    //   else tboxList.push(sonson1);
    //   allList.push(sonson1);
    // }
    // if (allList) {
    //   for (var i = 0; i < allList.length; i++) {
    //     var mya = allList[i];
    //     if (i % 2 == 0) mya.style.backgroundColor = "var(--popup-mian)";
    //     var sonson1left = document.createElement("div");
    //     var sonson1right = document.createElement("div");
    //     sonson1left.id = "sonson1left_1";
    //     sonson1right.id = "sonson1right_1" + i;
    //     sonson1left.className = "leftbox";
    //     sonson1right.className = "rightbox";
    //     sonson1left.style.cssText =
    //       "width:100px;border-right:var(--border-solid);line-height:40px;text-align:start;padding-right:10px;margin-left:10px;font-size:12px;";
    //     sonson1right.style.cssText =
    //       "display: flex;flex-flow: row nowrap;justify-content:space-between; align-items:center;text-align:start;padding-left:10px;font-size:12px;width:182px;";
    //     mya.appendChild(sonson1left);
    //     mya.appendChild(sonson1right);
    //     leftList.push(sonson1left);
    //     rightList.push(sonson1right);
    //   }
    // }
    // //在sonson1right下创建子节点div
    // var rightListson = new Array();
    // for (var i = 0; i < rightList.length; i++) {
    //   var myarson = rightList[i];
    //   var sonson1right_son = document.createElement("div");
    //   sonson1right_son.className = "sonson1right_son";
    //   sonson1right_son.style.cssText =
    //     "display: flex;flex-flow: row nowrap;justify-content:flex-start; align-items:center;/* background-color:red; */";
    //   myarson.appendChild(sonson1right_son);
    //   rightListson.push(sonson1right_son);
    // }
    // //在每行的左右两边添加节点或插入文本
    // var leftboxtotal = leftList;
    // for (var ltbox = 0; ltbox < leftboxtotal.length; ltbox++) {
    //   var obj = "";
    //   if (type == "reservoir") {
    //     if (ltbox == leftboxtotal.length - 2) {
    //       obj = reservoirIndex == 0 ? attributes[ltbox] : attributes[ltbox + 1];
    //     } else if (ltbox == leftboxtotal.length - 1) {
    //       obj =
    //         reservoirIndex == 0 ? attributes[ltbox + 1] : attributes[ltbox + 2];
    //     } else {
    //       obj = attributes[ltbox];
    //     }
    //   } else {
    //     obj = attributes[ltbox];
    //   }

    //   leftboxtotal[ltbox].innerHTML = obj.displayName;
    // }
    // //向右侧每一行添加span标签
    // var rightboxtotal = rightListson; /* rightList */
    // var newrightfather = rightList;
    // var count = 0;
    // if (type == "reservoir") {
    //   count = reservoirIndex == 0 ? 0 : 1;
    // }
    // var elementIdTemp = featureTemp.attributes.ElementId;
    // console.log("reservoirIndex", reservoirIndex);
    // for (var i = 0; i < rightboxtotal.length; i++) {
    //   // console.log('count',count)
    //   var obj = "";
    //   if (type == "reservoir") {
    //     if (i == rightboxtotal.length - 2) {
    //       obj = reservoirIndex == 0 ? attributes[i] : attributes[i + 1];
    //     } else if (i == rightboxtotal.length - 1) {
    //       obj = reservoirIndex == 0 ? attributes[i + 1] : attributes[i + 2];
    //     } else {
    //       obj = attributes[i];
    //     }
    //   } else {
    //     obj = attributes[i];
    //   }
    //   // console.log('obj',obj)
    //   var attribute = featureTemp.attributes[obj.fieldName];

    //   if (obj.type == "attribute") {
    //     if (obj.fieldName == "PipeStatus");
    //     else if (obj.fieldName == "ValveSetting") {
    //       attribute = attribute == 2 ? "关" : "开";
    //     } else if (obj.fieldName == "PumpStatus") {
    //       attribute = attribute == 2 ? "关" : "开";
    //     } else if (obj.fieldName == "InitialSettingsRelativeClosure") {
    //       if (String(featureTemp.attributes["ValveSetting"]) == "2") {
    //         attribute = 0;
    //       } else if (
    //         String(featureTemp.attributes.ElementId).indexOf("F") == -1
    //       ) {
    //         attribute = (1 - Number(attribute)) * 100;
    //         if (Number(attribute) == 100) attribute = 100;
    //         else if (Number(attribute) == 0) attribute = 0;
    //         else attribute = attribute.toFixed(2);
    //       }
    //     } else if (obj.fieldName == "PipeAge") {
    //       if (attribute == null) attribute = "无";
    //     }

    //     if (obj.rounding) attribute = parseFloat(attribute).toFixed(2);
    //     if (obj.displayName == "横坐标" || obj.displayName == "纵坐标")
    //       attribute = parseFloat(attribute).toFixed(3);
    //     if (obj.displayName == "起始节点" || obj.displayName == "终止节点") {
    //       if (
    //         String(attribute).indexOf("-A") > -1 ||
    //         String(attribute).indexOf("-B") > -1
    //       ) {
    //         attribute = attribute.split("-")[0];
    //       }
    //     }
    //     if (obj.displayType == "label") {
    //       obj.originalData = attribute;
    //       if (String(attribute) == "undefined") attribute = "";
    //       var temp = this.CreateLabel(attribute, attributes, i);
    //       rightboxtotal[i].appendChild(temp);
    //     } else if (obj.displayType == "input") {
    //       // var temp = this.CreateInput(attributes, i, attribute, type, elementIdTemp);
    //       rightboxtotal[i].appendChild(temp);
    //     } else if (obj.displayType == "combox" && obj.fieldName != "") {
    //       var temp = this.CreateSelect(
    //         pipeState,
    //         attribute,
    //         attributes,
    //         i,
    //         type,
    //         elementIdTemp
    //       );
    //       rightboxtotal[i].appendChild(temp);
    //     } else if (obj.displayType == "combox" && obj.fieldName == "") {
    //       var temp = this.CreateReserviorSelect(
    //         reserviorType,
    //         attribute,
    //         attributes,
    //         i,
    //         type,
    //         elementIdTemp
    //       );
    //       rightboxtotal[i].appendChild(temp);
    //     }
    //   } else {
    //     var roundingTempData = "";
    //     if (obj.fieldName == "Direction_Change_") {
    //       resultTemp[count] = parseInt(resultTemp[count]).toFixed(0);
    //     }
    //     if (obj.rounding) {
    //       roundingTempData = resultTemp[count];
    //       if (String(obj.fieldName) == "Result_Demand_")
    //         resultTemp[count] = parseFloat(resultTemp[count]).toFixed(3);
    //       else resultTemp[count] = parseFloat(resultTemp[count]).toFixed(2);
    //     }
    //     if (obj.displayType == "label") {
    //       var temp = this.CreateLabelResult(
    //         resultTemp[count],
    //         roundingTempData
    //       );
    //       if (type == "pipe") {
    //         if (String(resultTemp[count]) == "999.00") {
    //           leftboxtotal[i].innerHTML = "";
    //         } else {
    //           rightboxtotal[i].appendChild(temp);
    //         }
    //       } else {
    //         rightboxtotal[i].appendChild(temp);
    //       }
    //       //rightboxtotal[i].appendChild(temp)
    //       var tableNameMain = "";
    //       if (tableNameMain != "" && resultTemp.length > count + 4) {
    //         var temp = "";
    //         if (type == "reservoir") {
    //           roundingTempData = resultTemp[resultTemp.length - 1];
    //           resultTemp[resultTemp.length - 1] = Number(
    //             resultTemp[resultTemp.length - 1]
    //           ).toFixed(2);
    //           temp = this.CreateLabelResult(
    //             "(" + resultTemp[resultTemp.length - 1] + ")",
    //             roundingTempData
    //           );
    //         } else if (type == "pipe") {
    //           roundingTempData = resultTemp[count + 7];
    //           resultTemp[count + 7] = Number(resultTemp[count + 7]).toFixed(2);
    //           temp = this.CreateLabelResult(
    //             "(" + resultTemp[count + 7] + ")",
    //             roundingTempData
    //           );
    //         } else {
    //           roundingTempData = resultTemp[count + 4];
    //           resultTemp[count + 4] = Number(resultTemp[count + 4]).toFixed(2);
    //           temp = this.CreateLabelResult(
    //             "(" + resultTemp[count + 4] + ")",
    //             roundingTempData
    //           );
    //         }
    //         rightboxtotal[i].appendChild(temp);
    //       }
    //       if (tableNameMain != "" && type == "reservoir") {
    //         roundingTempData = resultTemp[resultTemp.length - 1];
    //         resultTemp[resultTemp.length - 1] = Number(
    //           resultTemp[resultTemp.length - 1]
    //         ).toFixed(2);
    //         var temp = this.CreateLabelResult(
    //           "(" + resultTemp[resultTemp.length - 1] + ")",
    //           roundingTempData
    //         );
    //         rightboxtotal[i].appendChild(temp);
    //       }
    //       if (type == "tcv") {
    //         if (tableNameMain != "" && resultTemp.length > count + 2) {
    //           roundingTempData = resultTemp[count + 2];
    //           resultTemp[count + 2] = Number(resultTemp[count + 2]).toFixed(2);
    //           var temp = this.CreateLabelResult(
    //             "(" + resultTemp[count + 2] + ")",
    //             roundingTempData
    //           );
    //           rightboxtotal[i].appendChild(temp);
    //         }
    //       }
    //     } else if (obj.displayType == "input") {
    //       // var temp = this.CreateInput(attributes, i, resultTemp[count], type, elementIdTemp);
    //       rightboxtotal[i].appendChild(temp);
    //     }
    //     count++;
    //   }
    //   if (obj.unit != "") {
    //     var temp = this.CreateLabel(obj.unit, attributes, i, false);
    //     if (type == "pipe") {
    //       if (String(resultTemp[count - 1]) != "999.00") {
    //         rightboxtotal[i].appendChild(temp);
    //       } else {
    //         continue;
    //       }
    //     } else {
    //       rightboxtotal[i].appendChild(temp);
    //     }
    //     if (
    //       obj.type != "attribute" &&
    //       obj.fieldName != "Direction_Change_" &&
    //       obj.fieldName != "StartNodePressure" &&
    //       obj.fieldName != "EndNodePressure" &&
    //       obj.fieldName != "RealPressure"
    //     ) {
    //       var objTemp = obj.fieldName;
    //       var strArr = objTemp.split("_");
    //       if (!IsRevise) {
    //         var temp = this.CreateBtnResult(
    //           elementIdTemp,
    //           strArr[1],
    //           obj.displayName,
    //           type,
    //           obj.unit
    //         );
    //         newrightfather[i].appendChild(temp);
    //       }
    //     }
    //     if (obj.fieldName == "InitialSettingsRelativeClosure") {
    //       var temp = CreateTcvChangeBtn(featureTemp);
    //       rightboxtotal[i].appendChild(temp);
    //     }
    //   }
    // }
    // buttonboxdiv = document.createElement("div");
    // buttonboxdiv.id = "buttonboxdiv";
    // var allElementChangeData = new Array();
    // var indexMy = this.CheckElement(allElementChangeData, elementIdTemp);
    // if (indexMy != -1 && allElementChangeData.length != 0) {
    //   buttonboxdiv.style.cssText =
    //     "height:34px;width:100%;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center;align-items:flex-end;margin-top:3px;border-top: var(--border-divider);";
    // } else buttonboxdiv.style.cssText = "height:34px;width:100%;display:none";
    // newdiv.insertBefore(buttonboxdiv, null);
    // /*  son1.insertBefore(buttonboxdiv, null); */
    // var btn1 = this.CreateBtn("确定", "sure");
    // var btn2 = this.CreateBtn("取消", "cancel");
    // buttonboxdiv.appendChild(btn1);
    // buttonboxdiv.appendChild(btn2);
    // return outboxdiv;
  }
  CreateLabelResult(textTemp, roundingTempData) {
    var spantext2 = document.createElement("span");
    spantext2.className = "spanboxt2";
    //spantext2.title = roundingTempData;
    spantext2.innerHTML = textTemp; //width:55px;
    spantext2.style.cssText =
      "margin-right:3px;display:inline-block;height:20px;line-height:20px;color:var(--popup-font-value);font-family: Microsoft YaHei;font-weight: bold;font-size: 12px;";
    return spantext2;
  }
  CreateLabel(textTemp, attributesTemp, i, isBool = true) {
    var spantext2 = document.createElement("div");
    spantext2.className = "spanboxt2";
    spantext2.innerHTML = textTemp;
    // console.log("String(attributesTemp[i].fieldName)", String(attributesTemp[i].fieldName))
    spantext2.style.cssText =
      (isBool
        ? "color:var(--popup-font-value);font-family: Microsoft YaHei;font-weight: bold;"
        : "") +
      "display:flex;flex-flow:row nowrap;justify-content: center;align-items: center;height:20px;margin-right:3px;";
    if (textTemp.length > 19) {
      spantext2.style.cssText =
        (isBool
          ? "color:var(--popup-font-value);font-family: Microsoft YaHei;font-weight: bold;"
          : "") +
        "justify-content: center;align-items: center;margin-right:3px;text-overflow: ellipsis;word-break: break-all;";
      spantext2.title = textTemp;
    }
    return spantext2;
  }
  /**
   * 创建组件属性中可修改属性的输入框
   * @param {*} attributesTemp 组件的某个属性对象
   * @param {*} i 该属性在组件所有属性数组中的索引
   * @param {*} attribute 属性显示的值
   * @param {*} type 组件类型(用于后面获取修改哪类组件的值)
   */
  CreateInput(attributesTemp, i, attribute, type, elementIdTemp) {
    var allElementChangeData = new Array();
    if (type == "reservoir") {
      i = reservoirIndex == 0 ? i : i + 1;
    }
    if (String(attribute) == "undefined") attribute = "";
    var o1 = document.createElement("input");
    o1.setAttribute("class", "el-input__inner");
    o1.style = "width:70px;height:28px";
    var IsRevise = false;
    if (!IsRevise) o1.disabled = true;
    var index = this.CheckElement(allElementChangeData, elementIdTemp);
    if (index == -1) {
      attributesTemp[i].changeData = attribute;
      o1.value = attribute;
    } else {
      var isChangeTemp = CheckChangeFieldName(
        attributesTemp[i].fieldName,
        allElementChangeData[index].fieldName
      );
      if (isChangeTemp) {
        var indexChange = CheckChangeFieldNameIndex(
          attributesTemp[i].fieldName,
          allElementChangeData[index].fieldName
        );
        if (indexChange != -1) {
          attributesTemp[i].changeData =
            allElementChangeData[index].ChangeData[indexChange].changeData;
          o1.value = attributesTemp[i].changeData;
          o1.style = "background:#4DC86F;width:70px;height:28px";
        } else {
          attributesTemp[i].changeData = attribute;
          o1.value = attribute;
        }
      } else {
        attributesTemp[i].changeData = attribute;
        o1.value = attribute;
      }
    }
    attributesTemp[i].originalData = attribute;
    o1.addEventListener("input", myInputChange);
    o1.id = type + ":" + i;
    return o1;
  }
  /**
   * 创建组件属性中可修改属性的下拉框
   * @param {*} arrayTemp 下拉框的数据源
   * @param {*} attribute 下拉框默认显示的值
   */
  CreateSelect(
    arrayTemp,
    attribute,
    attributesTemp,
    i,
    typeTemp,
    elementIdTemp
  ) {
    var allElementChangeData = new Array();
    var o = document.createElement("select");
    o.style = "width:50px;";
    o.setAttribute("class", "el-select el-select--mini");
    var IsRevise = false;
    if (!IsRevise) o.disabled = true;
    for (var j = 0; j < arrayTemp.length; j++) {
      var item = document.createElement("option");
      item.value = arrayTemp[j].value;
      item.textContent = arrayTemp[j].label;
      o.appendChild(item);
    }
    if (typeTemp == "prv") attribute = attribute == "开" ? "0" : "1";
    else if (typeTemp == "pump") attribute = attribute == "开" ? "0" : "1";
    var statusTemp = attribute == "0" ? "开" : "关";
    var index = this.CheckElement(allElementChangeData, elementIdTemp);
    if (index == -1) {
      attributesTemp[i].changeData = statusTemp;
      o.value = attribute;
    } else {
      var isChangeTemp = CheckChangeFieldName(
        attributesTemp[i].fieldName,
        allElementChangeData[index].fieldName
      );
      if (isChangeTemp) {
        var indexChange = CheckChangeFieldNameIndex(
          attributesTemp[i].fieldName,
          allElementChangeData[index].fieldName
        );
        if (indexChange != -1) {
          attributesTemp[i].changeData =
            allElementChangeData[index].ChangeData[indexChange].changeData;
          o.value = attributesTemp[i].changeData == "开" ? "0" : "1";
          o.style = "background:#4DC86F;width:50px;";
        } else {
          attributesTemp[i].changeData = attribute;
          o1.value = attribute;
        }
      }
    }
    attributesTemp[i].originalData = statusTemp;
    o.id = typeTemp + ":" + i;
    o.addEventListener("change", this.mySelectChange);
    return o;
  }
  /**
   * 创建组件属性中可修改属性的下拉框
   * @param {*} arrayTemp 下拉框的数据源
   * @param {*} attribute 下拉框默认显示的值
   */
  CreateReserviorSelect(
    arrayTemp,
    attribute,
    attributesTemp,
    i,
    typeTemp,
    elementIdTemp
  ) {
    var o = document.createElement("select");
    o.style = "width:50px;";
    o.setAttribute("class", "el-select el-select--mini");
    for (var j = 0; j < arrayTemp.length; j++) {
      var item = document.createElement("option");
      item.value = arrayTemp[j].value;
      item.textContent = arrayTemp[j].label;
      o.appendChild(item);
    }
    o.id = typeTemp + ":" + i;
    o.addEventListener("change", myReserviorSelectChange);
    o.value = reservoirIndex;
    return o;
  }
          /**
         * 创建曲线按钮
         * @param {*} id 
         * @param {*} field 
         */
  CreateBtnResult(id, field, label, type, unit) {
    var self = this;
    var spantext2 = document.createElement("div");
    spantext2.id = field;
    spantext2.className = field;
    spantext2.title = "24小时曲线";
    spantext2.style.cssText =
      "width: 20px;margin-right:10px;height: 20px;background: url(" + img + ") no-repeat;background-position: right center;cursor: pointer;/* background-color:green */";
    spantext2.addEventListener('click', function (event) {
        console.log(id, field, label, type, unit, event)
        self.ChartClick(event, id, field, label, type, unit);
    });
    return spantext2;
  }
  ChartClick(id, field, type, label, unit) {
    // console.log(id,field,type)
    // if (String(event.target.id) == field) {
      var parameter = {
          ElementId: id,
          Attribute: field
      }
      var urlTemp = "";
      switch (type) {
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
      parameter.IsMinute = global.isTimeTheLeastBit;
      console.log('urlTemp', JSON.stringify(parameter))
      console.log('开始:', new Date());
      axios
          .post(
              urlTemp,
              JSON.stringify(parameter), global.axiosHeaders)
          .then(respone => {
              console.log('结束:', new Date());
              this.GetPipeResultReturn(respone, label, unit)
          });
    // }
  }
  GetPipeResultReturn(response, label, unit) {
    var result = response.data;
    if(result && String(result.Code) == "0"){
        var obj = { data: result.Response, title: label, unit }
        Bus.$emit("EchatAttrE", obj);
    }else{
        console.log("错误信息:", result.Message);
    }
  }
  CheckElement(allData, elementIdTemp) {
    var returnIndex = -1;
    for (var i = 0; i < allData.length; i++) {
      var itemTemp = allData[i];
      if (
        String(itemTemp.LayerId) != global.layerId.EN_TCVTYPECHANGE &&
        itemTemp.ElementId == elementIdTemp
      ) {
        returnIndex = i;
        break;
      }
    }
    return returnIndex;
  }
  /**
   * 下拉框内容变化事件
   * @param {*} event 事件对象
   */
  mySelectChange(event) {
    var idTemp = String(event.target.id);
    var typeTemp = idTemp.split(":")[0];
    var indexTemp = idTemp.split(":")[1];
    var tempChangeData;
    var tempOriginalData;
    if (typeTemp == "pipe") {
      attributeData.pipeAttribute[indexTemp].changeData =
        String(event.target.value) == "0" ? "开" : "关";
      tempChangeData = attributeData.pipeAttribute[indexTemp].changeData;
      tempOriginalData = attributeData.pipeAttribute[indexTemp].originalData;
    } else if (typeTemp == "prv") {
      attributeData.prvAttribute[indexTemp].changeData =
        String(event.target.value) == "0" ? "开" : "关";
      tempChangeData = attributeData.prvAttribute[indexTemp].changeData;
      tempOriginalData = attributeData.prvAttribute[indexTemp].originalData;
    } else if (typeTemp == "fcv") {
      attributeData.fcvAttribute[indexTemp].changeData =
        String(event.target.value) == "0" ? "开" : "关";
      tempChangeData = attributeData.fcvAttribute[indexTemp].changeData;
      tempOriginalData = attributeData.fcvAttribute[indexTemp].originalData;
    } else if (typeTemp == "pump") {
      attributeData.pumpAttribute[indexTemp].changeData =
        String(event.target.value) == "0" ? "开" : "关";
      tempChangeData = attributeData.pumpAttribute[indexTemp].changeData;
      tempOriginalData = attributeData.pumpAttribute[indexTemp].originalData;
    }
    var tempSelect = event.target;
    if (String(tempChangeData) != String(tempOriginalData)) {
      tempSelect.style = "background:#4DC86F;width:50px;";
      buttonboxdiv.style.cssText =
        "height:34px;width:100%;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center;align-items:flex-end;margin-top:3px;border-top: var(--border-divider);";
    } else {
      tempSelect.style = "width:50px;";
      buttonboxdiv.style.cssText = "height:34px;width:100%;display:none";
    }
  }
  /**
   * 创建组件属性框中的按钮
   * @param {*} labelTemp 按钮显示值
   */
  CreateBtn(labelTemp, idTemp) {
    var btn = document.createElement("input");
    //var btn = document.createElement('button');
    btn.type = "button";
    btn.style["height"] = "28px";
    btn.value = labelTemp;
    btn.id = idTemp;
    if (labelTemp == "确定")
      btn.setAttribute("class", "el-button el-button--success el-button--mini");
    else if (labelTemp == "取消")
      btn.setAttribute("class", "el-button el-button--primary el-button--mini");
    btn.addEventListener("click", this.BtnClick);
    return btn;
  }
  /**
   * 图上查询窗口中按钮的点击事件
   * @param {*} event 事件的对象
   */
  BtnClick(event) {
    var myEvent = new CustomEvent("event_name", {
      detail: { type: "This is title!" }
    });
    // myEvent.detail.type = event.target.id;
    // if (event.target.id == "cancel") {
    //     // map.infoWindow.hide();
    //     view.popup.close();
    //     return;
    // }
    // var selectElement = new Object;
    // var isChange = false;
    // var typeTemp = "";
    // if (mySelectLayerId == global.layerId.EN_PIPE || mySelectLayerId == global.layerId.EN_PIPE_1 || mySelectLayerId == global.layerId.EN_PIPE_2 || mySelectLayerId == global.layerId.EN_ADD_PIPE_O) {
    //     isChange = JudgeAttributeChange(attributeData.pipeAttribute);
    //     if (isChange) {
    //         selectElement = GetChangeAttribute(attributeData.pipeAttribute);
    //         console.log('selectElement', selectElement)
    //         if (mySelectLayerId == global.layerId.EN_ADD_PIPE_O) {
    //             selectElement.LayerId = global.layerId.EN_ADD_PIPE;
    //             for (var i = 0; i < AddElementData.length; i++) {
    //                 var obj = AddElementData[i];
    //                 if (String(selectElement.ElementId) == String(obj.ElementId)) {
    //                     selectElement.CoordinateX = obj.CoordinateX;
    //                     selectElement.CoordinateY = obj.CoordinateY;
    //                     selectElement.startId = obj.startId;
    //                     selectElement.endId = obj.endId;
    //                     selectElement.diameter = obj.diameter;
    //                     selectElement.length = obj.length;
    //                     selectElement.rcoeff = obj.rcoeff;
    //                     selectElement.lcoeff = obj.lcoeff;
    //                     selectElement.status = obj.status;
    //                     selectElement.X = obj.X;
    //                     selectElement.Y = obj.Y;
    //                     selectElement.XMin = obj.XMin;
    //                     selectElement.YMin = obj.YMin;
    //                     selectElement.XMax = obj.XMax;
    //                     selectElement.YMax = obj.YMax;
    //                     //selectElement.管径 = obj.管径;
    //                     selectElement.Physical_HazenWilliamsC = obj.Physical_HazenWilliamsC;
    //                     selectElement.HMIGeometryScaledLength = obj.HMIGeometryScaledLength;
    //                     selectElement.startId = obj.startId;
    //                     selectElement.endId = obj.endId;
    //                     selectElement.StartNodeID = obj.StartNodeID;
    //                     selectElement.EndNodeID = obj.EndNodeID;
    //                     selectElement.位置 = obj.位置;
    //                     selectElement.分公司 = obj.分公司;
    //                     selectElement.埋设时间 = obj.埋设时间;
    //                     selectElement.Physical_PipeMaterial = obj.Physical_PipeMaterial;
    //                     selectElement.PipeStatusO = 0;
    //                     selectElement.PipeStatus = selectElement.PipeStatus == '开' ? 0 : 1;
    //                     break;
    //                 }
    //             }
    //         }
    //         else
    //             selectElement.LayerId = global.layerId.EN_PIPE;
    //         typeTemp = "管道";
    //     }
    // }
    // else if (mySelectLayerId == global.layerId.EN_JUNCTION || mySelectLayerId == global.layerId.EN_ADD_NODE_O) {
    //     isChange = JudgeAttributeChange(attributeData.junctionAttribute);
    //     if (isChange) {
    //         selectElement = GetChangeAttribute(attributeData.junctionAttribute);
    //         if (mySelectLayerId == global.layerId.EN_ADD_NODE_O) {
    //             selectElement.LayerId = global.layerId.EN_ADD_NODE;
    //             for (var i = 0; i < AddElementData.length; i++) {
    //                 var obj = AddElementData[i];
    //                 if (String(selectElement.ElementId) == String(obj.ElementId)) {
    //                     selectElement.X = obj.X;
    //                     selectElement.Y = obj.Y;
    //                     selectElement.initConc = obj.initConc;
    //                     selectElement.emitterCoeff = obj.emitterCoeff;
    //                     selectElement.zoneId = obj.zoneId;
    //                     selectElement.Elev = obj.Elev;
    //                     clickMapPoint = null;
    //                     break;
    //                 }
    //             }
    //         }
    //         else
    //             selectElement.LayerId = global.layerId.EN_JUNCTION;
    //         typeTemp = "节点";
    //     }
    // }
    // else if (mySelectLayerId == global.layerId.EN_VALVE || mySelectLayerId == global.layerId.EN_ADD_VALVE_O) {
    //     isChange = JudgeAttributeChange(attributeData.tcvAttribute);
    //     if (isChange) {
    //         selectElement = GetChangeAttribute(attributeData.tcvAttribute);
    //         selectElement.LayerId = EN_VALVE;
    //         for (var i = 0; i < AddElementData.length; i++) {
    //             var obj = AddElementData[i];
    //             if (String(selectElement.ElementId) == String(obj.ElementId)) {
    //                 selectElement.X = obj.X;
    //                 selectElement.Y = obj.Y;
    //                 selectElement.initConc = obj.initConc;
    //                 selectElement.emitterCoeff = obj.emitterCoeff;
    //                 selectElement.zoneId = obj.zoneId;
    //                 selectElement.Elev = obj.Elev;
    //                 clickMapPoint = null;
    //                 break;
    //             }
    //         }
    //         typeTemp = "阀门";
    //     }
    // } else if (mySelectLayerId == global.layerId.EN_PRVALVE) {
    //     isChange = JudgeAttributeChange(attributeData.prvAttribute);
    //     if (isChange) {
    //         selectElement = GetChangeAttribute(attributeData.prvAttribute);
    //         selectElement.LayerId = global.layerId.EN_PRVALVE;
    //         typeTemp = "减压阀";
    //     }
    // } else if (mySelectLayerId == global.layerId.EN_FCVALVE) {
    //     isChange = JudgeAttributeChange(attributeData.fcvAttribute);
    //     if (isChange) {
    //         selectElement = GetChangeAttribute(attributeData.fcvAttribute);
    //         selectElement.LayerId = global.layerId.EN_FCVALVE;
    //         typeTemp = "流量阀";
    //     }
    // } else if (mySelectLayerId == global.layerId.EN_PUMP) {
    //     isChange = JudgeAttributeChange(attributeData.pumpAttribute);
    //     if (isChange) {
    //         selectElement = GetChangeAttribute(attributeData.pumpAttribute);
    //         selectElement.LayerId = global.layerId.EN_PUMP;
    //         typeTemp = "水泵";
    //     }
    // } else if (mySelectLayerId == global.layerId.EN_TANK) {
    //     JudgeAttributeChangeReservoir();
    //     isChange = JudgeAttributeChange(attributeData.reservoirAttribute);
    //     if (isChange) {
    //         selectElement = GetChangeAttribute(attributeData.reservoirAttribute);
    //         selectElement.LayerId = global.layerId.EN_TANK;
    //         typeTemp = "水池";
    //     }
    // }
    // if (isChange) {
    //     selectElement.type = typeTemp;
    //     if (clickMapPoint) {
    //         selectElement.point = new esriApi.Point(clickMapPoint.x, clickMapPoint.y, view.spatialReference);
    //     } else {
    //         selectElement.point = new esriApi.Point(selectElement.X, selectElement.Y, view.spatialReference);
    //     }
    //     myEvent.detail.data = selectElement;
    //     if (window.dispatchEvent) {
    //         window.dispatchEvent(myEvent);
    //     } else {
    //         window.fireEvent(myEvent);
    //     }
    //     // map.infoWindow.hide();
    //     view.popup.close();
    //     var indexTemp = CheckElement(allElementChangeData, selectElement.ElementId);
    //     if (indexTemp != -1) {
    //         allElementChangeData.splice(indexTemp, 1);
    //     }
    //     allElementChangeData.push(selectElement)
    // }
    // else {
    //     Message({ showClose: true, message: '请先修改属性' });
    // }
  }
  SetInfoWindowPosition(point, view) {
    var extentTemp = view.extent;
    if (
      Number(point.x) >= Number(extentTemp.xmin) &&
      Number(point.x) <= Number(extentTemp.xmax) &&
      Number(point.y) >= Number(extentTemp.ymin) &&
      Number(point.y) <= Number(extentTemp.ymax)
    ) {
    } else {
      var pointTemp = point;
      if (Number(point.y) > Number(extentTemp.ymax))
        pointTemp = new esriApi.Point(
          point.x,
          point.y + 100,
          new esriApi.SpatialReference({ wkid: global.spatialReference })
        );
      else if (Number(point.y) < Number(extentTemp.ymin))
        pointTemp = new esriApi.Point(
          point.x,
          point.y - 100,
          new esriApi.SpatialReference({ wkid: global.spatialReference })
        );
      // map.centerAt(point);
      view.center = point;
    }
  }
}
export default new Methods();
