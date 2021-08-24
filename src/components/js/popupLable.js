import $ from "jquery";

class Methods {
    popupView = null;
    popupName = "";//避免重复使用
    isBg = false;
    popupInfoData = [];
    frameHeight = 0;

    initPopupEvent(_view, _popupName = "", _isBg = false){
        this.popupView = _view;
        this.popupName = _popupName + "_" ;
        this.isBg = _isBg;
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
            var screenPoint = this.popupView.toScreen(mapPoint);
            popupInfo.screenPointX = screenPoint.x;
            popupInfo.screenPointY = screenPoint.y;
            this.popupInfoData.push(popupInfo);
            this.loadinfoWindow(popupInfo);
        }
    }

    loadinfoWindow(obj) {
        const popupID = this.popupName + obj.type + obj.id;
        var fh = obj.select ? "－" : "＋";
        //动态添加气泡窗口DIV
        var infoDiv = '<div id="popup-Lable' + popupID + '" class="popupLable">' +
            '<div class="content-wrapper-popupLable">' +
            '<div id="' + popupID + '" class="content-popupLable">' + 
            (this.isBg ? '<span class="bgSpan-popupLable1"></span>' : '<span class="bgSpan-popupLable">' + fh + '</span>') +
            '<span id="title' + popupID + '" class="content-txttitle-popupLable"></span>' +
            '</div>' +
            '</div>' +
            '<div class="tip-container-popupLable">' +
            '<div class="tip-popupLable"></div>' +
            '</div>' +
            '</div>';
        $("#" + this.popupView.container.id).append(infoDiv);
        //填充标题
        $('#title' + popupID).append(obj.title);
        $('#popup-Lable' + popupID).click(function() {
            // console.log(obj);
        });
        //刷新气泡窗口位置
        this.positionPopUp(obj);
    }
    
    positionPopUp(obj) {//刷新气泡窗口位置
        const popupID = this.popupName + obj.type + obj.id;
        var tempPopup = $('#popup-Lable' + popupID);
        if (tempPopup && tempPopup[0]) {
            var tempPopupHeight = tempPopup[0].offsetHeight - this.frameHeight;
            var tempPopupWidth = tempPopup[0].offsetWidth / 2;
            tempPopup.css('transform', 'translate3d(' + (obj.screenPointX - tempPopupWidth) + 'px, ' + (obj.screenPointY - tempPopupHeight) + 'px, 0)');
        }
    }

    positionToScreen(popupInfo){//位置转换
        // debugger
        //坐标转换
        var mapPoint = {
            x: popupInfo.x,
            y: popupInfo.y,
            spatialReference: this.popupView.spatialReference
        };
        var screenPoint = this.popupView.toScreen(mapPoint);
        popupInfo.screenPointX = screenPoint.x;
        popupInfo.screenPointY = screenPoint.y;
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
        const tempPopupInfoData = [];
        for (let j = 0; j < this.popupInfoData.length; j++) {
            var _infoData = this.popupInfoData[j];
            if (type == _infoData.type) {
                const popupID = this.popupName + _infoData.type + _infoData.id;
                $("#popup-Lable" + popupID).remove();
            }else{
                tempPopupInfoData.push(_infoData);
            }
        }
        this.popupInfoData = tempPopupInfoData;
    }

    destroy() {
        $(".popupLable").remove();
        this.popupInfoData = [];
    }
}
export default new Methods()