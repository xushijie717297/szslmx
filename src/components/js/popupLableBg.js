import global from './Global'
import $ from "jquery"
class Methods {
    popupView = null;
    popupName = "";//避免重复使用
    isOffset = false;//窗口偏移使用
    popupInfoData = [];
    xoffset = -45;
    yoffset = -10;
    lableHeight = 34;

    initPopupEvent(_view, _popupName = "", _isOffset = false){
        this.popupView = _view;
        this.popupName = _popupName + "_" ;
        this.isOffset = _isOffset;
        //监听地图变化事件，对应刷新气泡窗口位置
        var self = this;
        this.popupView.watch("extent", function() {
            self.relocatePopup();
        });
        this.popupView.watch("rotation", function() {
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
            if(popupInfo.title && popupInfo.title.length > 4)
            {
                this.xoffset = popupInfo.title.length * -10;
            }else{
                this.xoffset = -45;
            }
            var screenPoint = this.popupView.toScreen(mapPoint);
            popupInfo.screenPointX = screenPoint.x - this.xoffset;
            popupInfo.screenPointY = screenPoint.y - this.yoffset;
            if(this.isOffset){
                // popupInfo.screenPointX = screenPoint.x - this.xoffset + global._kssScrollLeft;
                popupInfo.screenPointY = screenPoint.y - this.yoffset + global._kssScrollTop - lableHeight;
            }
            this.popupInfoData.push(popupInfo);
            this.loadinfoWindow(popupInfo);
        }
    }

    loadinfoWindow(obj) {
        const popupID = this.popupName + obj.id;
        //动态添加气泡窗口DIV
        var infoDiv = '<div id="popup-LableBg' + popupID + '" class="popupLableBg '+this.popupName+'">' +
            '<div class="content-wrapper-popupLableBg">' +
            '<div id="' + popupID + '" class="content-popupLableBg">' + 
            '<span id="title' + popupID + '" class="content-txttitle-popupLableBg"></span>'+
            '</div>' +
            '</div>' +
            '</div>';
        $("#" + this.popupView.container.id).append(infoDiv);
        //填充标题
        $('#title' + popupID).append(obj.title);
        console.log('%c XSJ-[ popupID ]->', 'font-size:13px; background:red; color:#bf2c9f;', obj.title)

        //刷新气泡窗口位置
        this.positionPopUp(obj);
    }
    
    positionPopUp(obj) {//刷新气泡窗口位置
        const popupID = this.popupName + obj.id;
        var tempPopup = $('#popup-LableBg' + popupID);
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
        if(popupInfo.title && popupInfo.title.length > 4)
        {
            this.xoffset = popupInfo.title.length * -10;
        }else{
            this.xoffset = -45;
        }
        var screenPoint = this.popupView.toScreen(mapPoint);
        popupInfo.screenPointX = screenPoint.x - this.xoffset;
        popupInfo.screenPointY = screenPoint.y - this.yoffset;
        if(this.isOffset){
            // popupInfo.screenPointX = screenPoint.x - this.xoffset + global._kssScrollLeft;
            popupInfo.screenPointY = screenPoint.y - this.yoffset + global._kssScrollTop - lableHeight;
        }
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

    destroy() {
        console.log('this.popupName',this.popupName);
        $("."+this.popupName).remove();
        this.popupInfoData = [];
    }
}
export default new Methods()