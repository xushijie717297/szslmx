import * as echarts from 'echarts';
// import WindowsEvent from "@/components/js/WindowsEvent";
import Bus from '../../utils/Bus'
class Methods {
    popupView = null;
    popupName = "";//避免重复使用
    yoffset = 20;
    popupInfoData = [];
    chartDataAr = [];

    initPopupEvent(_view, _popupName = ""){
        this.popupView = _view;
        this.popupName = _popupName + "_" ;
        //监听地图变化事件，对应刷新气泡窗口位置
        var self = this;
        this.popupView.watch(["extent","rotation"], function() {
            self.relocatePopup();
        });
    }

    /**
     * 加载popup的数据(id唯一标识)，可以累积添加数据
     */
    loadPopup(_popupInfoData) {
        for (var i = 0; i < _popupInfoData.length; i++) {
            var popupInfo = _popupInfoData[i];
            //坐标转换
            var mapPoint = {
                x: popupInfo.x,
                y: popupInfo.y,
                spatialReference: this.popupView.spatialReference
            };
            var screenPoint = this.popupView.toScreen(mapPoint);
            popupInfo.screenPointX = screenPoint.x;
            popupInfo.screenPointY = screenPoint.y - this.yoffset;
            this.popupInfoData.push(popupInfo);
            this.loadinfoWindow(popupInfo);
        }
    }

    loadinfoWindow(obj) {
        const popupID = this.popupName + obj.type + obj.id;
        let _colorType = "pressure";
        switch (obj.type) {
            case "flow":
                _colorType = 'traffic';
                break;
            case "pressure":
                _colorType = 'pressure';
                break;
            case "xnd":
                _colorType = 'dummy';
                break;
        }
        //动态添加气泡窗口DIV
        var infoDiv = '<div id="popup-Echarts' + popupID + '" class="popupEcharts">' +
            '<div class="content-wrapper-popupEcharts-' + _colorType + '">' +
            '<div id="' + popupID + '" class="content-popupEcharts">' + 
            '<div>'+
            '<span id="title' + popupID + '" class="content-txttitle-popupEcharts"></span>'+
            '<span id="tbImg' + popupID + '" class="tbImg-popupEcharts" title="查看历史"></span>'+
            '</div>' + 
            '<div class="content-value-popupEcharts-' + _colorType + '">'+
            '<span id="content' + popupID + '" class="'+ (obj.IsWarning ? 'content-txtcontent-yj-popupEcharts' : 'content-txtcontent-popupEcharts') +'"></span>'+
            '</div>' + 
            '</div>' +
            '</div>' +
            '<div id="tip' + popupID + '" class="tip-container-popupEcharts">' +
            '<div class="tip-popupEcharts-' + _colorType + '"></div>' +
            '</div>' +
            '</div>';
        $("#" + this.popupView.container.id).append(infoDiv);
        //填充标题
        $('#title' + popupID).append(obj.title);
        //填充内容
        $('#content' + popupID).append(obj.content);
        //刷新气泡窗口位置
        this.positionPopUp(obj);
        //标题控制图表显示
        $('#tbImg' + popupID).click(function() {
            Bus.$emit("OneMonitorData",obj)
            
        });
    }
    
    positionPopUp(obj) {//刷新气泡窗口位置
        const popupID = this.popupName + obj.type + obj.id;
        var tempPopup = $('#popup-Echarts' + popupID);
        if (tempPopup && tempPopup[0]) {
            var tempPopupHeight = tempPopup[0].offsetHeight;
            var tempPopupWidth = tempPopup[0].offsetWidth / 2;
            tempPopup.css('transform', 'translate3d(' + (obj.screenPointX - tempPopupWidth) + 'px, ' + (obj.screenPointY - tempPopupHeight) + 'px, 0)');
        }
    }

    positionToScreen(popupInfo){//位置转换
        //坐标转换
        var mapPoint = {
            x: popupInfo.x,
            y: popupInfo.y,
            spatialReference: this.popupView.spatialReference
        };
        var screenPoint = this.popupView.toScreen(mapPoint);
        popupInfo.screenPointX = screenPoint.x;
        popupInfo.screenPointY = screenPoint.y - this.yoffset;
        //刷新气泡窗口位置
        this.positionPopUp(popupInfo);
    }
    
    relocatePopup(id = null) {//移动气泡窗口位置(传入id匹配单个，否则全部)
        for (var i = 0; i < this.popupInfoData.length; i++) {
            var popupInfo = this.popupInfoData[i];
            if(id){
                if(id == popupInfo.id){
                    this.positionToScreen(popupInfo);
                    break;
                }
            }else{
                this.positionToScreen(popupInfo);
            }
        }
    }

    /**
     * 按类型销毁
     */
    typeDestroy(type) {
        const tempChartDataAr = [];
        for (let i = 0; i < this.chartDataAr.length; i++) {
            var _chartData = this.chartDataAr[i];
            if (type == _chartData.type && _chartData.chart) {
                _chartData.chart.dispose();
                _chartData.chart = null;
            }else{
                tempChartDataAr.push(_chartData);
            }
        }
        this.chartDataAr = tempChartDataAr;
        const tempPopupInfoData = [];
        for (let j = 0; j < this.popupInfoData.length; j++) {
            var _infoData = this.popupInfoData[j];
            if (type == _infoData.type) {
                const popupID = this.popupName + _infoData.type + _infoData.id;
                $("#popup-Echarts" + popupID).remove();
            }else{
                tempPopupInfoData.push(_infoData);
            }
        }
        this.popupInfoData = tempPopupInfoData;
    }

    destroy() {
        for (let i = 0; i < this.chartDataAr.length; i++) {
            var _chartData = this.chartDataAr[i];
            if (_chartData.chart) {
                _chartData.chart.dispose();
                _chartData.chart = null;
            }
        }
        this.chartDataAr = [];
        
        $(".popupEcharts").remove();
        this.popupInfoData = [];
    }
}
export default new Methods()