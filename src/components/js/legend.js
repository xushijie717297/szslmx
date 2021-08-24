/**
 * 图例类
 */
// import windowEvent from '@/components/js/WindowsEvent'
import urlClass from './UrlClass'
import axios from 'axios'
import global from './Global'
import Bus from '../../utils/Bus'
class Methods{

    /**
     * 调用接口获取图例中某项的定位信息
     * @param {*} itemDataTemp 图例中的筛选条件
     * @param {*} top 获取的数据数目
     * @param {*} tableName 模拟计算表名(如果没有计算则为空字符串)
     * @param {*} supplyAreaLabelTemp 供水分界线时图例中该项显示的信息(如不是供水分界线的图例则为NAN字符串)
     * @param {*} selectTypeMain 专题图类型
     * @param {*} layerType 图层类型
     * @param {*} isCompare 是否进行对比
     * @param {*} timeMyMain 专题图模拟结果时间
     * @param {*} timeMyMain1 对比时间1
     * @param {*} timeMyMain2 对比时间2
     */
    GetLegendLocationData(itemDataTemp,top,tableName,supplyAreaLabelTemp,selectTypeMain,layerType,isCompare,timeMyMain,timeMyMain1,timeMyMain2){
        var self = this;
        var parameterTemp = new Object();
        if(supplyAreaLabelTemp!='NAN')
        {
            parameterTemp.Where = itemDataTemp.labelId;
        }
        else 
        {
            parameterTemp.Where = itemDataTemp.labelDisplayContent;
            supplyAreaLabelTemp = "";
        }
        parameterTemp.Time = timeMyMain;
        parameterTemp.Field = (selectTypeMain=="SupplyAreaCompare"?"SupplyArea":selectTypeMain);
        parameterTemp.Top = top;
        parameterTemp.TableName = tableName;
        parameterTemp.SupplyAreaLabel = supplyAreaLabelTemp;
        parameterTemp.Time1 = timeMyMain1;
        parameterTemp.Time2 = timeMyMain2;
        parameterTemp.isCompare = isCompare;
        var postUrl = "";
        if(isCompare)
            postUrl = urlClass.axiosUrl+'GetCompareLegendLocationData';
        else if(EventTypeMain!="PlanTempCalculate")
            postUrl = urlClass.axiosUrl+'GetLegendLocationData';
        else if(EventTypeMain=="PlanTempCalculate")
            postUrl = urlClass.axiosUrl+'GetLegendCalLocationData';
        axios.post(
            postUrl,
            JSON.stringify(parameterTemp),
            global.axiosHeaders
        )   
         .then(function(response){
            self.GetLegendLocationDataReturn(response,layerType,isCompare);
         }) 
    } 


    /**
     * 从接口返回图例中某一项的定位结果
     * @param {*} response 调用后台接口返回的结果
     * @param {*} layerType 图层类型(节点或者管道)
     * @param {*} isCompare 是否进行对比
     */
    GetLegendLocationDataReturn(response,layerType,isCompare){
        var obj = response.data;
        var tableData = obj.LegendInfo;
        
        var mytableData = new Object();
        mytableData.tableType = layerType;
        mytableData.listData = tableData;
        mytableData.numberCount = obj.Count;
        mytableData.tableName='attributeTable';
        mytableData.labelType = layerType=='pipe'?'管道数量':'节点数量';
        mytableData.mainType = "Location";
        mytableData.isCompare = isCompare?'compare':'';
        // windowEvent.MyDispatchEvent('LegendLocationGet',mytableData);
        Bus.$emit("LegendLocationGet",mytableData)
    }

    /**
     * 调用接口获取模拟计算后管道图例中的定位结果
     * @param {*} itemDataTemp 图例中的筛选条件
     * @param {*} top 获取的数据数目
     * @param {*} tableName 模拟计算的表名
     * @param {*} fieldTemp 类型(流量flow,流速velocity)
     * @param {*} layerType 图层类型
     * @param {*} isCompare 是否进行对比
     */
    GetLegendCalPipeLocationData(itemDataTemp,top,tableName,fieldTemp,layerType,isCompare){
        var self = this;
        var parameterTemp = new Object();
        parameterTemp.Where = itemDataTemp.labelDisplayContent;
        parameterTemp.Field = fieldTemp;
        parameterTemp.Top = top;
        parameterTemp.TableName = tableName;
        var postUrl = "";
        postUrl = urlClass.axiosUrl+'GetLegendCalPipeLocationData';
        axios.post(
            postUrl,
            JSON.stringify(parameterTemp),
            global.axiosHeaders
        )   
         .then(function(response){
            self.GetLegendLocationDataReturn(response,layerType,isCompare);
         }) 
    }

    /**
     * 接口返回图例中用户信息
     * @param {*} response 调用接口后的返回值
     */
    GetLegendCustomerDataReturn(response){
        var obj = response.data;
        var tableData = obj.ListData;
        var mytableDate = new Object();
        mytableDate.listData = tableData;
        mytableDate.numberCount = obj.Count;
        mytableDate.tableName='customerTable';
        mytableDate.labelType = '用户数量';
        mytableDate.mainType = "Customer";
        this.MyDispatchEvent('LegendCustomerGet',mytableDate);
    }

    /**
     * 调用后台接口返回图例上的用户信息
     * @param {*} itemDataTemp 图例上筛选条件
     * @param {*} top 信息数目
     * @param {*} tableName 模拟计算表名
     * @param {*} timeMyMain 模拟结果时间
     * @param {*} selectTypeMain 专题图类型
     */
    GetLegendCustomerData(itemDataTemp,top,tableName,timeMyMain,selectTypeMain){
        var self = this;
        var parameterTemp = new Object();
        if(selectTypeMain!="PipeAge")
            parameterTemp.Where = itemDataTemp.labelDisplayContent;
        else
            parameterTemp.Where = itemDataTemp.labelId;
        parameterTemp.Time = timeMyMain;
        parameterTemp.Field = selectTypeMain;
        parameterTemp.Top = top;
        parameterTemp.TableName = tableName;
        console.log('用户参数1');
        console.log(JSON.stringify(parameterTemp))
        var tempUrl = "";
        if(tableName=="")
        tempUrl = urlClass.axiosUrl+'GetLegendUserData';
        else
        tempUrl = urlClass.axiosUrl+'GetLegendCalUserData';
        axios.post(
            tempUrl,
            JSON.stringify(parameterTemp),
            global.axiosHeaders
        )   
         .then(function(respone){
            self.GetLegendCustomerDataReturn(respone);
         }) 
    }

    /**
     * 调用后台接口获取模拟计算后结果图例中的用户信息
     * @param {*} itemDataTemp 图例中筛选条件
     * @param {*} top 信息数目
     * @param {*} tableName 模拟计算表名
     * @param {*} fieldTemp 管道结果类型(flow流量,velocity流速)
     */
    GetLegendCalPipeCustomerData(itemDataTemp,top,tableName,fieldTemp){
        var parameterTemp = new Object();
        parameterTemp.Where = itemDataTemp.labelDisplayContent;
        parameterTemp.Field = fieldTemp;
        parameterTemp.Top = top;
        parameterTemp.TableName = tableName;
        tempUrl = urlClass.axiosUrl+'GetLegendCalPipeUserData';
        axios.post(
            tempUrl,
            JSON.stringify(parameterTemp),
            global.axiosHeaders
        )   
         .then(this.GetLegendCustomerDataReturn) 
    }


    /**
     * 获取图例上显示的数据
     * @param {*} legendPipeLengthData 各个等级图例上管长的数据
     * @param {*} colorLegend 颜色数组
     * @param {*} isDisplays 是否显示数组
     * @param {*} itemType 类型
     * @return {*} 返回值图例显示的数据
     */
    GetLegendDisplayData(legendPipeLengthData,colorLegend,isDisplays,itemType,labelsAll){
        var obj = new Object();
        var legendList = new Array();
        var allPipeLengthTemp = 0;
        for(var i=0;i<legendPipeLengthData.length;i++)
        {
            var temp = legendPipeLengthData[i];
            var legendItem = new Object();
            legendItem.color = colorLegend[i];
            legendItem.labelDisplayContent = temp.Label;
            legendItem.pipeLengthContent = (Number(temp.PipeLength)).toFixed(2);
            legendItem.ratioContent = temp.Ratio;
            legendItem.isDisplay = isDisplays[i];
            legendItem.itemType = itemType;
            legendItem.index = i;
            legendItem.labelId = labelsAll[i].labelId;
            if(i==legendPipeLengthData.length-1)
                legendItem.lineDisplay = false;
            else  
                legendItem.lineDisplay = true;
            legendList.push(legendItem);
            allPipeLengthTemp+=Number(temp.PipeLength);
        } 
        obj.legendList = legendList;
        obj.AllPipelength = allPipeLengthTemp;
        return obj;
    }


    /**
     * 图例主函数
     * @param {*} type 
     * @param {*} fieldTemp 
     * @param {*} colorLegend 
     * @param {*} isDisplays 
     * @param {*} itemType 
     * @param {*} compreType 
     * @param {*} maxMin 
     * @param {*} minMain 
     * @param {*} isCompare 
     * @param {*} planCalTempFlowLegendList 
     * @param {*} allPipeFlowLength 
     * @param {*} planCalTempStrengthLegendList 
     * @param {*} allPipeStrengthLength 
     * @param {*} diffusionResultClass 
     * @param {*} EventTypeMain 
     * @param {*} timeMyMain 
     * @param {*} timeMyMain1 
     * @param {*} timeMyMain2 
     *///"Direction","",color,isDisplays,'','',max,min,true,[],0,[],0,{},'Direction',0,time1,time2,'',false
    LegendMain(type,fieldTemp,colorLegend,isDisplays,itemType
    ,compreType,maxMin,minMain,isCompare,planCalTempFlowLegendList,allPipeFlowLength,planCalTempStrengthLegendList
,allPipeStrengthLength,diffusionResultClass,EventTypeMain,timeMyMain,timeMyMain1,timeMyMain2,tableNameMain,opType,legendType=""){
        var legendData = {
        }
        var labels = new Array();
        var tempLimit = new Array();
        var labelsParameter = new Array();
        var object = new Object();
        object = this.ClassifyFunction(type,isDisplays,isCompare,true,true);
        tempLimit = object.labelId;
        labelsParameter = object.labels;//ClassifyLabelsFunction(type);
        labels = this.GetLegendLabelsMain(type,tempLimit,labelsParameter,EventTypeMain,isCompare)
        var labelsAll = labels;
        legendData.ListLegend = labels;
        legendData.Type =  isCompare?compreType:type;
        legendData.Big = "true";
        legendData.Small = "true";
        legendData.Field = EventTypeMain=="PlanTempCalculate"?"PlanCalTemp":fieldTemp;
        legendData.Time1 = isCompare?timeMyMain1:timeMyMain;
        legendData.Time2 = isCompare?timeMyMain2:"";
        legendData.PlanId = "";
        legendData.TableName = tableNameMain;
        legendData.opType = opType;
        if(EventTypeMain=="Diffusion")
        {
            var listTemp = diffusionResultClass.ListPipe.slice(0);
            legendData.PipeList = new Array();
        }
        this.GetLegendPIpeLengthData(legendData,colorLegend,isDisplays,itemType,object.titleName,object.legendName,
        compreType,maxMin,minMain,isCompare,planCalTempFlowLegendList,allPipeFlowLength,
        planCalTempStrengthLegendList,allPipeStrengthLength,labelsAll,EventTypeMain,legendType);
    }

        /**
         * 模拟计算管道的图例
         * @param {*} planTempCalFlowLimit 流量的分级信息
         * @param {*} planTempCalVelocityLimit 流速的分级信息
         * @param {*} tableNameMain 计算表名
         */
        LegendMainPlanTempCalPipe(planTempCalFlowLimit,planTempCalVelocityLimit,tableNameMain,opType,legendType,colorLegendPipe,colorLegendNode)
        {
            console.log(colorLegendNode)
            var legendData = new Object();
            var flowLimit = this.GetLegendPressureChangeLabels(planTempCalFlowLimit);
            var velocityLimit = this.GetLegendPressureChangeLabels(planTempCalVelocityLimit);
            legendData.ListLegendFlow = flowLimit;
            legendData.ListLegendVelocity = velocityLimit;
            legendData.Field = 'cal';
            legendData.FlowBig = true;
            legendData.FlowSmall = true;
            legendData.VelocityBig = true;
            legendData.VelocitySmall = true;
            legendData.TableName = tableNameMain;
            this.GetLegendCalPipeLengthData(legendData,tableNameMain,opType,legendType,colorLegendPipe,colorLegendNode)
        }
   
       /**
        * 获取模拟计算管道图例上的管道管长的信息
        * @param {*} legendData 图例上第一列的信息
        */
        GetLegendCalPipeLengthData(legendData,tableName,opType,legendType,colorLegendPipe,colorLegendNode){
            // return new Promise((resolve,reject)=>{
                var isDisplays = global.pressureChangeIsDisplay.slice(0)
                console.log(JSON.stringify(legendData))
                var urlTemp = urlClass.axiosUrl+"LegendGetCalPipeLength";
                var self = this;
                axios.post(urlClass.axiosUrl +"LegendGetCalPipeLength",
                    JSON.stringify(legendData),
                    global.axiosHeaders
                )   
                 .then(function(respone){
                    //  debugger
                     console.log(respone)
                    self.GetLegendCalPipeLengthDataReturn(respone,colorLegendPipe,isDisplays,tableName,opType,legendType,colorLegendNode);
                 }
                )
            // }).then(()=>{

            // })
        }

        /**
         * 获取模拟计算管道图例管长的返回函数
         * @param {*} respone 
         * @param {*} colorLegend 
         * @param {*} isDisplays 
         */
        GetLegendCalPipeLengthDataReturn(respone,colorLegendPipe,isDisplays,tableName,opType,legendType,colorLegendNode){
            var result = respone.data;
            if(result && String(result.Code) == "0"){
                var data = result.Response;
                var flowLegendList = data.ListLegendFlow;
                var velocityLegendList = data.ListLegendVelocity;
                var objTemp = new Object();
                var labelsAll = new Array();
                for(var i=0;i<flowLegendList.length;i++)
                {
                    var obj = new Object();
                    obj.labelId = flowLegendList[i].Label;
                    labelsAll.push(obj);
                }
                var itemType = 'flow';
                objTemp = this.GetLegendDisplayData(flowLegendList,colorLegendPipe,isDisplays,itemType,labelsAll) 
                var objTempVelocity = new Object();
                itemType = 'velocity';
                labelsAll = new Array();
                for(var i=0;i<velocityLegendList.length;i++)
                {
                    var obj = new Object();
                    obj.labelId = velocityLegendList[i].Label;
                    labelsAll.push(obj);
                }
                console.log('velocityLegendList')
                console.log(velocityLegendList)
                objTempVelocity = this.GetLegendDisplayData(velocityLegendList,colorLegendPipe,isDisplays,itemType,labelsAll) 
                var planCalTempFlowLegendList = objTemp.legendList;
                var allPipeLengthPipe = objTemp.AllPipelength;
                var allPipeLengthPipeVelocity = objTempVelocity.AllPipelength;
                var planCalTempVelocityLegendList = objTempVelocity.legendList;
                itemType = 'calNode';
                this.LegendMain("PlanCalTemp","",colorLegendNode,isDisplays,itemType,"",
                    0,0,false,planCalTempFlowLegendList,allPipeLengthPipe,planCalTempVelocityLegendList,allPipeLengthPipeVelocity,
                new Object(),"PlanTempCalculate",0,0,0,tableName,opType,legendType);
            }
        }
   


        GetDirectionChangeLegend(colorLegend,isDisplays,itemType){
            this.LegendMain("PlanCalTemp","",colorLegend,isDisplays,itemType,"",
                0,0,false,planCalTempFlowLegendList,allPipeLengthPipe,planCalTempVelocityLegendList,allPipeLengthPipeVelocity,
            new Object(),"PlanTempCalculate",0,0,0,tableName,false);
        }


    /**
     * 调用获取图例上管道长度接口的返回函数
     * @param {*} response 接口返回值
     * @param {*} colorLegend 颜色数组
     * @param {*} isDisplays 是否显示数组
     * @param {*} itemType 类型
     * @param {*} titleName 图例名称
     * @param {*} legendName 图例中表格名称
     * @param {*} compreType 对比类型
     * @param {*} maxMain 是否绘制增大的结果
     * @param {*} minMain 是否绘制减小的结果
     * @param {*} isCompare 是否是对比
     * @param {*} planCalTempFlowLegendList 模拟计算管道流量的图例数据
     * @param {*} allPipeLengthPipe 模拟计算管道流量的图例的总管长
     * @param {*} planCalTempVelocityLegendList 模拟计算管道流速的图例数据
     * @param {*} allPipeLengthPipeVelocity 模拟计算管道流速的图例的总管长
     */
    GetLegendPipeLengthDataReturn(response,colorLegend,isDisplays,itemType,titleName,legendName,compreType,
        maxMain,minMain,isCompare,planCalTempFlowLegendList,allPipeLengthPipe,planCalTempVelocityLegendList,
        allPipeLengthPipeVelocity,allLabel,EventTypeMain,opType,legendType)
        {
            // debugger
        var result = response.data;
        if(result && String(result.Code) == "0"){
        var legendPipeLengthData = result.Response;
        var legendList = new Array(); 
        var legendAllData = new Object(); 
        var tempObj = new Object();
        
        tempObj = this.GetLegendDisplayData(legendPipeLengthData,colorLegend,isDisplays,itemType,allLabel) 
        legendList = tempObj.legendList;
        var allPipeLength = tempObj.AllPipelength;
        legendAllData.title = titleName;
        legendAllData.legendName = legendName;
        legendAllData.allIsDisplay = true;//图例控制是否全部显示
        legendAllData.listData = legendList;
        legendAllData.allPipeLength = Number(allPipeLength).toFixed(2);
        legendAllData.maxValue = maxMain;
        legendAllData.minValue = minMain;
        legendAllData.maxCheckedIsDisplay = maxMain!=""?true:false;
        legendAllData.minCheckedIsDisplay = minMain!=""?true:false;
        legendAllData.maxChecked = false;
        legendAllData.minChecked = false;
        legendAllData.isCompareType = isCompare?compreType:"";
        legendAllData.compareUpCheck = true;
        legendAllData.compareDownCheck = true;
        legendAllData.compareUpPipeFlowCheck = true;
        legendAllData.compareDownPipeFlowCheck = true;
        legendAllData.compareUpPipeVelocityCheck = true;
        legendAllData.compareDownPipeVelocityCheck = true;
        legendAllData.opType = opType;
        //模拟计算管道图例的数据
        legendAllData.listDataPipe = planCalTempFlowLegendList;
        legendAllData.allPipeLengthPipe = Number(allPipeLengthPipe).toFixed(2);
        legendAllData.legendNamePipe = "流量变化(m³/h)";

        legendAllData.listDataPipeVelocity = planCalTempVelocityLegendList;
        legendAllData.allPipeVelocityLengthPipe = Number(allPipeLengthPipeVelocity).toFixed(2);
        legendAllData.legendNameVelocity = "流速变化(m/s)";

        if(EventTypeMain=="PlanTempCalculate")
            legendAllData.type="planCal";
        else
            legendAllData.type="";
        var legendAllDataTemp = legendAllData;
        console.log(legendAllData)
        legendAllData.TypeMain = legendType;
        // windowEvent.MyDispatchEvent("LegendDisplay",legendAllData)
        Bus.$emit("LegendDisplay",legendAllData)
        }else{
            console.log("错误信息:", result.Message);
        }
    }


    /**
     * 调用后台接口获取图例上的管长数据
     * @param {*} legendData 图例上的筛选条件
     * @param {*} colorLegend 颜色数组
     * @param {*} isDisplays 是否显示数组
     * @param {*} itemType 类型
     * @param {*} titleName 图例名称
     * @param {*} legendName 图例中表格名称
     * @param {*} compreType 对比类型
     * @param {*} maxMain 是否绘制增大的结果
     * @param {*} minMain 是否绘制减小的结果
     * @param {*} isCompare 是否是对比
     * @param {*} planCalTempFlowLegendList 模拟计算管道流量的图例数据
     * @param {*} allPipeLengthPipe 模拟计算管道流量的图例的总管长
     * @param {*} planCalTempVelocityLegendList 模拟计算管道流速的图例数据
     * @param {*} allPipeLengthPipeVelocity 模拟计算管道流速的图例的总管长
     */
    GetLegendPIpeLengthData(legendData,colorLegend,isDisplays,itemType,titleName,legendName,compreType,
        maxMain,minMain,isCompare,planCalTempFlowLegendList,allPipeLengthPipe,planCalTempVelocityLegendList,
        allPipeLengthPipeVelocity,allLabel,EventTypeMain,legendType){
        var self = this;
        var urlTemp = "http://112.64.170.158:8013/Service1.svc/Rest/LegendGetPipeLength";
        axios.post(
            urlTemp,
            JSON.stringify(legendData),
            global.axiosHeaders
        )   
         .then(function(respone)
        {
            // debugger
            self.GetLegendPipeLengthDataReturn(respone,colorLegend,isDisplays,itemType,titleName,legendName,compreType,
                maxMain,minMain,isCompare,planCalTempFlowLegendList,allPipeLengthPipe,planCalTempVelocityLegendList,
                allPipeLengthPipeVelocity,allLabel,EventTypeMain,legendData.opType,legendType);
        })
    }


    /**
     * 更新图例上的显示内容
     * @param {*} initData 图例的原始数据
     * @param {*} allIsDisplayTemp 显示与否
     * @return {*} 图例数据更新后返回是否显示的数组
     */
    UpdateLegendData(initData,allIsDisplayTemp){
        var listDataTemp = initData.listData;
        var returnListTemp = new Array();
        var isDisplays = new Array();
        for(var i=0;i<listDataTemp.length;i++)
        {
            var temp = listDataTemp[i];
            temp.isDisplay = allIsDisplayTemp;
            returnListTemp.push(temp);
            isDisplays[i] = allIsDisplayTemp;
        }
        initData.listData = returnListTemp;
        // windowEvent.MyDispatchEvent("LegendDisplay",initData)
        console.log(initData)
        Bus.$emit("LegendDisplay",initData)
        return isDisplays;
    }

    /**
     * 获取图例上显示的筛选条件
     * @param {*} limits 等级数据
     * @return {*} 图例上的第一列
     */
    GetLegendLabels(limits){
        var labels = new Array();
        for(var i=0;i<limits.length;i++)
        {
            var labelTemp = "";
            if(i==0)
                labelTemp = ("<"+String(limits[i]));
            else
                labelTemp = (String(limits[i-1])+"-"+String(limits[i]));
            var obj = new Object();
            obj.Label = labelTemp;
            obj.LabelId = labelTemp;
            labels.push(obj);
        }
        var labelTemp =  (">"+String(limits[limits.length-1]));
        var obj = new Object();
        obj.Label = labelTemp;
        obj.LabelId = labelTemp;
        labels.push(obj);
        return labels;
    }

    /**
     * 获取管龄图例上显示的筛选条件
     * @param {*} limits 等级数据
     * @return {*} 图例上的第一列
     */
    GetLegendLabelsPipeAge(limits){
        var labels = new Array();
        for(var i=0;i<limits.length-1;i++)
        {
            var labelTemp = "";
            if(i==0)
                labelTemp = ("<"+String(limits[i]));
            else
                labelTemp = (String(limits[i-1])+"-"+String(limits[i]));
            var obj = new Object();
            obj.Label = labelTemp;
            obj.LabelId = labelTemp;
            labels.push(obj);
        }
        var labelTemp =  (">"+String(limits[limits.length-2]));
        var obj = new Object();
        obj.Label = labelTemp;
        obj.LabelId = labelTemp;
        labels.push(obj);
        var labelTemp1 =  (String(limits[limits.length-1]));
        var obj1 = new Object();
        obj1.Label = labelTemp1;
        obj1.LabelId = "";
        labels.push(obj1);
        return labels;
    }

    /**
     * 获取物理量图例上显示的筛选条件
     * @param {*} limits 等级数据
     * @param {*} labelsParameter 物理量的值
     * @return {*} 图例上的第一列
     */
    GetLegendLabelsPhysical(limits,labelsParameter){
        var labels = new Array();
        for(var i=0;i<limits.length;i++)
        {
            var labelTemp = "";
            labelTemp = String(limits[i]);
            var obj = new Object();
            obj.Label = labelsParameter[i];
            obj.LabelId = labelTemp;
            labels.push(obj);
        }
        return labels;
    }

    /**
     * 获取压力变化图例上显示的筛选条件
     * @param {*} limits 等级数据
     * @return {*} 图例上的第一列
     */
    GetLegendPressureChangeLabels(limits){
        var labels = new Array();
        for(var i=0;i<limits.length-1;i++)
        {
            var labelTemp = "";
            labelTemp = (String(limits[i])+"-"+String(limits[i+1]));
            var obj = new Object();
            obj.Label = labelTemp;
            obj.LabelId = labelTemp;
            labels.push(obj);
        }
        return labels;
    }

    /**
     * 获取图例第一列的主函数
     * @param {*} type 类型
     * @param {*} limitsMyTemp 等级划分数组
     * @param {*} labelsParameter 物理量的值
     * @param {*} selectTypeMain 专题图类型
     * @param {*} isCompare 是否是对比
     */
    GetLegendLabelsMain(type,limitsMyTemp,labelsParameter,selectTypeMain,isCompare){
        var labels = new Array();
        if(isCompare&&selectTypeMain!="SupplyAreaCompare")
        {
            labels = this.GetLegendPressureChangeLabels(limitsMyTemp)
        }
        else if(type=="Flow"||type=="Velocity"||type=="Slop"||type=="Age"||type=="Pressure"||type=="HydraulicGrade"||type=="Demand"||type=="Diameter"||type=="FlowChangeCount")
            labels = this.GetLegendLabels(limitsMyTemp)
        else if(type=="SupplyArea"||type=="Material"||type=="SupplyAreaCompare")
            labels = this.GetLegendLabelsPhysical(limitsMyTemp,labelsParameter)
        else if(type=="PressureChange"||type=="PlanCalTemp")
            labels = this.GetLegendPressureChangeLabels(limitsMyTemp)
        else if(type=="PipeAge")
            labels = this.GetLegendLabelsPipeAge(limitsMyTemp)
        return labels;
    }

    /**
     * 获取图例上的筛选信息
     * @param {*} type 类型
     * @param {*} isDisplays 是否显示数组
     * @param {*} isCompare 是否对比
     * @param {*} allLegendDisplay 图例全部显示与否(目前都为true该功能已经去掉)
     * @param {*} isAllDisplay 设置为true
     * @return {*} 返回图例名称、第一列的名称以及等级分类信息等
     */
    ClassifyFunction(type,isDisplays,isCompare,allLegendDisplay,isAllDisplay){
        var tempLimit = new Array();
        var labelTemp = new Array();
        var colorLegend = new Array();
        var titleName = "";
        var legendName = "";
        var compreType = "";
        if(type=="Flow")
        {
            labelTemp = global.pipeFlowLimit;
            tempLimit = global.pipeFlowLimit;
            colorLegend = global.pipeFlowColor;
            if(isDisplays.length==0)
            isDisplays = global.pipeFlowIsDisplay.slice(0)
            titleName = "管道流量";
            legendName = "流量分级(m³/h)";
            if(isCompare)
            {
                labelTemp = global.pressureChangLimit;
                tempLimit = global.pressureChangLimit;
                colorLegend = global.pressureChangColorNew;
                if(isDisplays.length==0)
                isDisplays = global.pressureChangeIsDisplay.slice(0)
                titleName = "流量对比";
                legendName = "流量变化(m³/h)";
                compreType = "ComparePipe";
            }
            
        }
        else if(type=="Velocity")//typeTemp=="Velocity"||typeTemp=="Slop"||typeTemp=="Age"||typeTemp=="SupplyArea"
        {
            labelTemp = global.pipeVelocityLimit;
            tempLimit = global.pipeVelocityLimit;
            colorLegend = global.pipeVelocityColor;
            if(isDisplays.length==0)
            isDisplays = global.pipeVelocityIsDisplay.slice(0);
            titleName = "管道流速";
            legendName = "流速分级(m/s)";
            if(isCompare)
            {
                labelTemp = global.pressureChangLimit;
                tempLimit = global.pressureChangLimit;
                colorLegend = global.pressureChangColorNew;
                if(isDisplays.length==0)
                isDisplays = global.pressureChangeIsDisplay.slice(0)
                titleName = "流速对比";
                legendName = "流速变化(m/h)";
                compreType = "ComparePipe";
            }
        }
        else if(type=="Slop")
        {
            labelTemp = global.pipeSlopLimit;
            tempLimit = global.pipeSlopLimit;
            colorLegend = global.pipeSlopColor;
            if(isDisplays.length==0)
            isDisplays = global.pipeSlopIsDisplay.slice(0);
            titleName = "管道水力坡度";
            legendName = "水力坡度分级(1/1000)";
            if(isCompare)
            {
                labelTemp = global.pressureChangLimit;
                tempLimit = global.pressureChangLimit;
                colorLegend = global.pressureChangColorNew;
                if(isDisplays.length==0)
                isDisplays = global.pressureChangeIsDisplay.slice(0)
                titleName = "水力坡度对比";
                legendName = "水力坡度变化(1/1000)";
                compreType = "ComparePipe";
            }
        }
        else if(type=="Direction")
        {
            labelTemp = global.pressureChangLimit;
            tempLimit = global.pressureChangLimit;
            colorLegend = global.pressureChangColorNew;
            if(isDisplays.length==0)
            isDisplays = global.pressureChangeIsDisplay.slice(0);
            titleName = "流向对比";
            legendName = "流速变化(m/s)";
            compreType = "ComparePipe";
        }
        else if(type=="Age")
        {
            labelTemp = global.ageLimit;
            tempLimit = global.ageLimit;
            colorLegend = global.ageColor;
            if(isDisplays.length==0)
            isDisplays = global.ageIsDisplay.slice(0);
            titleName = "管道水龄";
            legendName = "水龄分级(h)";
            if(isCompare)
            {
                labelTemp = global.pressureChangLimit;
                tempLimit = global.pressureChangLimit;
                colorLegend = global.pressureChangColorNew;
                if(isDisplays.length==0)
                isDisplays = global.pressureChangeIsDisplay.slice(0)
                titleName = "水龄对比";
                legendName = "水龄变化(1/1000)";
                compreType = "ComparePipe";
            }
        }
        else if(type=="SupplyArea"||type=="SupplyAreaCompare")
        {
            labelTemp = global.pipeSupplyAreaLabels;
            tempLimit = global.pipeSupplyAreaLimit;
            colorLegend = global.pipeSupplyAreaColor;
            if(isDisplays.length==0)
            isDisplays = global.pipeSupplyAreaIsDisplay.slice(0);
            titleName = "供水分界线";
            legendName = "供水区域";
            if(isCompare)
            {
                labelTemp = global.pipeSupplyAreaLabels;
                tempLimit = global.pipeSupplyAreaLimit;
                colorLegend = global.pipeSupplyAreaColor;
                titleName = "供水区域对比";
                legendName = "供水区域";
                compreType = "CompareSupplyArea";
                if(isDisplays.length==0)
                isDisplays = global.pipeSupplyAreaIsDisplay.slice(0);
            }
        }
        else if(type=="Pressure")
        {
            labelTemp = global.pressureLimit;
            tempLimit = global.pressureLimit;
            colorLegend = global.pressureColor;
            if(isDisplays.length==0)
            isDisplays = global.pressureIsDisplay.slice(0)
            titleName = "节点压力";
            legendName = "压力分级(m)";
            if(isCompare)
            {
                labelTemp = global.pressureChangLimit;
                tempLimit = global.pressureChangLimit;
                colorLegend = global.pressureChangColorNew;
                if(isDisplays.length==0)
                isDisplays = global.pressureChangeIsDisplay.slice(0)
                titleName = "压力对比";
                legendName = "压力变化(m)";
                compreType = "CompareNode";
            }
        }
        else if(type=="HydraulicGrade")
        {
            labelTemp = global.headLimit;
            tempLimit = global.headLimit;
            colorLegend = global.headColor;
            if(isDisplays.length==0)
            isDisplays = global.headIsDisplay.slice(0)
            titleName = "水压标高";
            legendName = "水压标高分级(m)";
            if(isCompare)
            {
                labelTemp = global.pressureChangLimit;
                tempLimit = global.pressureChangLimit;
                colorLegend = global.pressureChangColorNew;
                if(isDisplays.length==0)
                isDisplays = global.pressureChangeIsDisplay.slice(0)
                titleName = "水压标高对比";
                legendName = "水力坡度变化(m)";
                compreType = "CompareNode";
            }
        }
        else if(type=="Demand")
        {
            labelTemp = global.demandLimit;
            tempLimit = global.demandLimit;
            colorLegend = global.demandColor;
            if(isDisplays.length==0)
            isDisplays = global.demandIsDisplay.slice(0)
            titleName = "节点流量";
            legendName = "节点流量(m³/s)";
            if(isCompare)
            {
                labelTemp = global.pressureChangLimit;
                tempLimit = global.pressureChangLimit;
                colorLegend = global.pressureChangColorNew;
                if(isDisplays.length==0)
                isDisplays = global.pressureChangeIsDisplay.slice(0)
                titleName = "节点流量对比";
                legendName = "流量变化(m³/s)";
                compreType = "CompareNode";
            }
        }
        else if(type=="Diameter")
        {
            labelTemp = global.pipeDiameterLimit;
            tempLimit = global.pipeDiameterLimit;
            colorLegend = global.pipeDiameterColor;
            if(isDisplays.length==0)
            isDisplays = global.pipeDiameterIsDisplay.slice(0)
            titleName = "管径";
            legendName = "管径分级(mm)";
        }
        else if(type=="Material")
        {
            labelTemp = global.pipeMaterialLimit;
            tempLimit = global.pipeMaterialLimit;
            colorLegend = global.pipeMaterialColor;
            if(isDisplays.length==0)
            isDisplays = global.pipeMaterialIsDisplay.slice(0);
            titleName = "管材";
            legendName = "管材分级";
        }
        else if(type=="PipeAge")
        {
            labelTemp = global.pipeAgeLimit;
            tempLimit = global.pipeAgeLimit;
            colorLegend = global.pipeAgeColor;
            if(isDisplays.length==0)
            isDisplays = global.pipeAgeIsDisplay.slice(0);
            titleName = "管龄";
            legendName = "管龄分级(年)";
        }
        else if(type=="PressureChange")
        {
            labelTemp = global.pressureChangLimit;
            tempLimit = global.pressureChangLimit;
            colorLegend = global.pressureChangColorNew;
            if(isDisplays.length==0)
            isDisplays = global.pressureChangeIsDisplay.slice(0)
            titleName = "24小时压力波动";
            legendName = "压力变化(m)";
        }
        else if(type=="FlowChangeCount")
        {
            labelTemp = global.directionChangeLimit;
            tempLimit = global.directionChangeLimit;
            colorLegend = global.directionChangeColor;
            if(isDisplays.length==0)
            isDisplays = global.directionChangeIsDisplay.slice(0)
            titleName = "24小时流向变化次数";
            legendName = "流向变化次数(次)";
        }
        else if(type=="PlanCalTemp")
        {
            labelTemp = global.pressureChangLimit;
            tempLimit = global.pressureChangLimit;
            colorLegend = global.pressureChangColorNew;
            if(isDisplays.length==0)
            isDisplays = global.pressureChangeIsDisplay.slice(0)
            titleName = "模拟计算";
            legendName = "压力变化(m)";
        }
        /* if(!allLegendDisplay)
        {
            isDisplays = new Array();
            for(var i=0;i<colorLegend.length;i++)
            {
                isDisplays.push(false);
            }
        }
        else if(isAllDisplay&&allLegendDisplay)
        {
            isDisplays = new Array();
            for(var i=0;i<colorLegend.length;i++)
            {
                isDisplays.push(true);
            }
        } */
        var object = new Object();
        object.labelId = tempLimit;
        object.labels = labelTemp;
        object.titleName = titleName;
        object.legendName = legendName;
        object.compreType = compreType;
        object.isDisplays = isDisplays;
        object.colorLegend = colorLegend;
        return object;
    }
}
export default new Methods()