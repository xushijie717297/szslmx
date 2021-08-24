<template>
  <div class="profile">
    <div class="top">
      <p id="statusBar"></p>
      <h3>我的</h3>
            <div class="Hportrait">
        <div class="HportraitL">
          <div class="H_img">
            <img src="../../../static/image/bj.png" alt="">
          </div>
          <div class="Autograph">
              <p>admin</p>
              <span>隐秘而伟大</span>
            </div>
        </div>
        <div class="HportraitR">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <div class="main">
      <div class="cell"></div>
      <van-cell-group>
        <van-cell value="" is-link to="news">
          <template #title>
            <span style="color:#41BBA6" class="iconfont iconxiaoxi"></span>
            <span class="custom-title">我的消息</span>
          </template>
        </van-cell>
        <van-cell value="" is-link to="police">
          <template #title>
            <span style="color:#ce8d5b" class="iconfont iconbaojing4"></span>
            <span class="custom-title">我的报警</span>
          </template>
        </van-cell>
        <van-cell value="" is-link to="configure">
          <template #title>
            <span style="color:#CE6D5B" class="iconfont iconshezhi1"></span>
            <span class="custom-title">用户管理</span>
          </template>
        </van-cell>
        <van-cell value="" is-link @click="testing">
          <template #title>
            <span style="color:#8871c2" class="iconfont iconbanben"></span>
            <span class="custom-title">版本检查</span>
          </template>
        </van-cell>
        <!-- <van-cell title="检查新版本" is-link @click="testing" />
        <van-cell title="当前版本" is-link @click="vvvv" />
        <van-cell title="退出登录" is-link @click="logOut" /> -->
      </van-cell-group>
      <div class="cell"></div>
            <van-cell-group>
        <van-cell value="" is-link @click="logOut">
          <template #title>
            <span style="color:#3A99F2" class="iconfont iconqiehuanzhanghao"></span>
            <span class="custom-title">切换账号</span>
          </template>
        </van-cell>
        <van-cell value="" is-link @click="logOut">
          <template #title>
            <span style="color:#AF4C4C" class="iconfont iconkaiting"></span>
            <span class="custom-title">退出</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import urlClass from "../../components/js/UrlClass"
import { Cell, CellGroup, Form, Button, Field, Dialog, Toast, Icon} from "vant";

Vue.use(Icon);
Vue.use(Toast);
Vue.use(Field);
Vue.use(Button);
Vue.use(Form);
Vue.use(Cell);
Vue.use(CellGroup);
export default {
  name: "Profile",
  data() {
    return {
      username: "",
      password: "",
      keyStr:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    };
  },
  methods: {
    logOut(){
      localStorage.removeItem('tokenn');
      this.$router.push("/login")
      Toast.success('退出成功');
    },
    vvvv(){
      Toast.success(`v${plus.runtime.version}`);
      console.log(plus.runtime.version)
    },
    testing(event){
      plus.runtime.getProperty(plus.runtime.appid, function (inf) {
      var ua = navigator.userAgent.toLowerCase();
      console.log(/android/.test(ua))
      if (/android/.test(ua)) {
      // if (true) {
            axios.post(
              urlClass.axiosUrl + "ReturnAppVersion",
              { headers: { "Content-Type": "application/json;" } }
            )
            .then(function(respone){
              if(respone.data.Code == "0"){
                var versFWQ = respone.data.Response;
                console.log(versFWQ)
                var versBD = inf.version;
                console.log(versBD)
                if(versFWQ != versBD){
                  var url="http://192.168.1.159:8181/WaterRTMS.apk"; // 下载文件地址  
                  Dialog.confirm({
                  title: '提示',
                  message: '是否更新至最新版',
                  }).then(() => {
                      var dtask = plus.downloader.createDownload( url, {}, function ( d, status ) {  
                      if ( status == 200 ) { // 下载成功  
                          var path = d.filename;  
                          plus.runtime.install(path); 
                          console.log(d.filename);  
                      } else {//下载失败  
                          alert( "Download failed: " + status );   
                      }    
                  });  
                  dtask.start();
                  }).catch(() => {
                    
                  }); 
                }else{
                  alert('已是最新版本')
                } 
              }else{
                alert("服务器驾崩了！！！！")
              } 
            });
      }else if(/iphone|ipad|ipod/.test(ua)){

      }
      })
    }
  },
  mounted() {},
};
</script>
<style scoped lang="less">
@import "../../assets/color.less";
@r:1rem /37.5;
.profile {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(153deg, #454A61 0%, #242838 100%);
  #statusBar{
    background: transparent;
  }
  .van-icon{
    color: #8e92a9;
  }
  & /deep/ .van-cell-group{
    background: transparent;
  }
}
.iconfont{
  font-size: 18px !important;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #171a2a;
  // align-items: center;
  // justify-content: center;
  & /deep/ .van-cell{
    background-color: #222638;
    font-size: 12px;
  }
    span{
        color: #fff;
        font-size: 14px;
        padding: 4px;
    }
  & /deep/ .van-cell-group{
    &::after{
      display: none;
    }
    .van-cell{
      &::after{
        border-color: #121421;
        left: 0;
        right: 0;
      }
    }
  }
  .cell{
  height: 10*@r;
  width: 100%;
  }
}
h3 {
  height: 45 * @r;
  width: 100%;
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent !important;
}
.top {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(153deg, #454A61 0%, #242838 100%);
}
.logOut{
  color: #fff;
}
.Hportrait{
  box-sizing: border-box;
  width: 100%;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .HportraitL{
    height: 100%;
    width: 50%;
    display: flex;
    .H_img{
      width: 60*@r;
      height: 60*@r;
      border-radius: 50%;
      overflow: hidden;
      img{
        width: 100%;
      }
    }
    .Autograph{
      flex: 1;
      box-sizing: border-box;
      padding-left: 12*@r;
      display: flex;
      flex-direction: column;
      justify-content: center;
      p{
        height: 20*@r;
        width: 100%;
        line-height: 20*@r;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #fff;
        padding: 6*@r 0;
        font-size: 18px;
      }
      span{
        color: #8e92a9;
        padding: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
      }
    }
  }
  .HportraitR{
    width: 80*@r;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .van-icon{
      font-size: 16px;
      color: #8E92A9;
    }
  }
}
</style>
