import closevalve from "../../assets/PipeBurst/closevalve.png"
import checkvalve from "../../../static/imag/PipeBurst/checkvalve.png"
import openvalve from "../../../static/imag/PipeBurst/openvalve.png"
import badvalve from "../../../static/imag/PipeBurst/badvalve.png"
import closedvalve from "../../../static/imag/PipeBurst/closedvalve.png"

export default {  
    /**
     * 方案管理监测点
     */
    pressureMonitor:{
        url:localStorage.getItem("imgPath")+'assets/planManager/monitor.png',
        width:210,
        height:49,
        xoffset:0,
        yoffset:30,
        angle:0,
        color:'#ff0000'
    },
    /**
     * 方案管理监测点添加以后
     */
    pressureMonitorAdd:{
        url:localStorage.getItem("imgPath")+'assets/planManager/monitorAdd.png',
        width:163,
        height:49,
        xoffset:0,
        yoffset:30,
        angle:0,
        color:'#ff0000'
    },
    /**
     * 方案管理压力监测点名称
     */
    pressureName:{
        url:'',
        width:0,
        height:0,
        xoffset:5,
        yoffset:28,
        angle:0,
        color:'#ffffff'
    },
    /**
     * 事件预警流量点
     */
    eventBlue:{
        url:localStorage.getItem("imgPath")+'assets/waringEvent/event_bluedot.png',//'../../../static/assets/img/redNode.png',
        width:15,
        height:15,
        xoffset:0,
        yoffset:0,
        angle:0,
        color:''
    },
    /**
     * 事件预警定位点
     */
    eventRed:{
        url:localStorage.getItem("imgPath")+'assets/waringEvent/event_reddot.png',//'../../../static/assets/img/redNode.png',
        width:29,
        height:29,
        xoffset:0,
        yoffset:0,
        angle:0,
        color:''
    },
    /**
     * 热度值黄色
     */
    eventYellow:{
        url:localStorage.getItem("imgPath")+'assets/waringEvent/event_yellowdot.png',//'../../../static/assets/img/redNode.png',
        width:20,
        height:20,
        xoffset:0,
        yoffset:0,
        angle:0,
        color:''
    },
    /**
     * 热度值橙色
     */
    eventOrange:{
        url:localStorage.getItem("imgPath")+'assets/waringEvent/event_orangedot.png',//'../../../static/assets/img/redNode.png',
        width:20,
        height:20,
        xoffset:0,
        yoffset:0,
        angle:0,
        color:''
    },
     /**
     * 阀门状态关闭的阀门
     */
    closeValvePin:{
        url:localStorage.getItem("imgPath")+'assets/valve_closed.png',//'../../../static/assets/img/redNode.png',
        width:13,
        height:13,
        xoffset:0,
        yoffset:0,
        angle:0,
        color:''
    },
    /**
     * 阀门状态半开的阀门
     */
    closeOpenValvePin:{
        url:localStorage.getItem("imgPath")+'assets/valve_partclosed.png',//'../../../static/assets/img/redNode.png',
        width:13,
        height:13,
        xoffset:0,
        yoffset:0,
        angle:0,
        color:''
    },
     /**
     * 蓝色压力点
     */
    redNodePin:{
        url:localStorage.getItem("imgPath")+'assets/img/redNode.png',//'../../../static/assets/img/redNode.png',
        width:15,
        height:15,
        xoffset:0,
        yoffset:0,
        angle:0,
        color:''
    },
     /**
     * 红色压力点
     */
    blueNodePin:{
        url:localStorage.getItem("imgPath")+'assets/img/blueNode.png',
        width:14,
        height:14,
        xoffset:0,
        yoffset:0,
        angle:0,
        color:''
    },
    /**
     * 蓝色
     */
    bluePin:{
        url:localStorage.getItem("imgPath")+'assets/colored-pins-blue.png',
        width:20,
        height:41,
        xoffset:0,
        yoffset:17,
        angle:0,
        color:''
    },
     /**
     * 红色
     */
    redPin:{
        url:localStorage.getItem("imgPath")+'assets/colored-pins-red.png',
        width:20,
        height:41,
        xoffset:0,
        yoffset:17,
        angle:0,
        color:''
    },

    /**
     * 绿色
     */
    greenPin:{
        url:localStorage.getItem("imgPath")+'assets/colored-pins-green.png',
        width:20,
        height:41,
        xoffset:0,
        yoffset:17,
        angle:0,
        color:''
    },

     /**
     * 供水路径的水源
     */
    sourcePin:{
        url:localStorage.getItem("imgPath")+'assets/blackinfowin.png',
        width:163,
        height:49,
        xoffset:0,
        yoffset:18,
        angle:0,
        color:''
    },
    /**
     * 需关闭阀门
     */
    closeValve:{
        url:closevalve,
        width:28,
        height:40,
        xoffset:0,
        yoffset:18,
        angle:0,
        color:''
    },
    /**
     * 止回阀
     */
    checkValve:{
        url: checkvalve,
        width: 24,
        height: 34,
        xoffset: 0,
        yoffset: 17,
        angle: 0,
        color: ''
    },
    /**
     * 需打开阀门
     */
    openValve:{
        url: openvalve.png,
        width: 28,
        height: 40,
        xoffset: 0,
        yoffset: 18,
        angle: 0,
        color: ''
    },
    /**
     * 需关闭已关闭的阀门 
     */
    closedValve:{
        url: closedvalve,
        width: 28,
        height: 40,
        xoffset: 0,
        yoffset: 18,
        angle: 0,
        color: ''
    },
    /**
     * 水流方向Arrow
     */
    SVGArrow: {
        iconPath: 'M 100 100 L 300 100 L 200 300 z',
        xoffset: 0,
        yoffset: 0,
        angle: 0,
        color: '#1C86EE',
        size: 12
    },
     /**
     * 水流方向Arrow
     */
    SVGArrowOnly: {
        iconPath: 'M 100 100 L 300 100 L 200 300 z',
        xoffset: 0,
        yoffset: 0,
        angle: 0,
        color: '#fff600',
        size: 8
    },
    /**
     * 故障阀门
     */
    badValve: {
        url: badvalve,
        width: 33,
        height: 35,
        xoffset: 0,
        yoffset: 4,
        angle: 0,
        color: ''
    },
}