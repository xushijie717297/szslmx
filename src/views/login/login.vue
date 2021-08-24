<template>
  <div class="profile">
    <div class="top">
      <img src="../../assets/logo1.png" alt="">
    </div>
    <div class="main">
        <!-- <van-form @submit="onSubmit">
          <van-field
            v-model="username"
            name="用户名"
            label=""
            placeholder="输入用户名"
            left-icon="friends"
            :rules="[{ required: true, message: '' }]"
          />
          <van-field
            class="inputP"
            v-model="password"
            name="密码"
            label=""
            left-icon="lock"
            placeholder="输入密码"
            :rules="[{ required: true, message: '' }]"
          />
          <div class="foot">
            <van-button
              round
              block
              type="info"
              native-type="submit"
            ></van-button>
          </div>
        </van-form> -->
        <van-form @submit="onSubmit">
          <van-field
            v-model="username"
            name="用户名"
            label=""
            placeholder="输入用户名"
            :rules="[{ required: true, message: '' }]"
          />
          <van-field
            class="inputP"
            v-model="password"
            type="password"
            name="密码"
            label=""
            placeholder="输入密码"
            :rules="[{ required: true, message: '' }]"
          />
          <div class="foot">
            <van-button
              round
              block
              icon="down"
              type="info"
              native-type="submit"
            ></van-button>
          </div>
        </van-form>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import $ from "jquery";
import urlClass from "../../components/js/UrlClass";
import { Cell, CellGroup, Form, Button, Field, Icon, Toast} from "vant";

Vue.use(Toast);
Vue.use(Icon);
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
      keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    };
  },
  methods: {
    top() {
      console.log(2);
    },
    onSubmit(values) {
      var name = this.Encode(this.username);
      var password = this.Encode(this.password);
      var userInfo = {
        UserName: name,
        Password: password,
      };
      var self = this;
      console.log()
      axios
        .post(urlClass.axiosUrl + "UserLogin", JSON.stringify(userInfo), {//urlClass.axiosUrl + 
          headers: { "Content-Type": "application/json;" },
        })
        .then(function (respone) {//UserStatus
          console.log(respone);
          var userInfo = respone.data.Response;
          if(userInfo.UserStatus == "2"){
            Toast.success('登陆成功');
            localStorage.setItem("tokenn", userInfo.Token);
            if (self.$route.query.redirect) {
              self.$router.push(self.$route.query.redirect)
            }else{
              self.$router.push("/profile")
            }
          }else if(userInfo.UserStatus == "1"){
            self.username = "";
            self.password = "";
            Toast.fail('用户名或者密码错误');
          }else{
            self.username = "";
            self.password = "";
            Toast.fail('用户不存在');
          }
          
          // switch(String(userInfo.UserStatus))
          // {
          //   case "0":
          //     self.$message({showClose: true, message: "用户不存在"});
          //   break;
          //   case "1":
          //     self.$message({showClose: true, message: "用户名与密码不匹配"});
          //   break;
          //   case "2":
          //     self.LoginSuccess(userInfo);
          //   break;
          // }
        });
    },
    Encode(input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      input = this._utf8_encode(input);
      var self = this;
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output =
          output +
          self.keyStr.charAt(enc1) +
          self.keyStr.charAt(enc2) +
          self.keyStr.charAt(enc3) +
          self.keyStr.charAt(enc4);
      }
      return output;
    },
    _utf8_encode(string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    },
  },
  mounted() {
    var self = this;
    console.log(this.$route.query.redirect)
    var winHeight = $(window).height(); //获取当前页面高度
    $(window).resize(function () {
      //当窗体大小变化时
      var thisHeight = $(this).height(); //窗体变化后的高度
      if (winHeight - thisHeight > 150) {
        /*
            软键盘弹出
            50是设置的阈值，用来排除其他影响窗体大小变化的因素，比如有的浏览器的工具栏的显示和隐藏
            */
        console.log();
        $("body").css("height", winHeight + "px");
      } else {
        /*
            软键盘关闭
            */
        $("body").css("height", "100%");
      }
    });
    // $(".inputP div:nth-child(2) input").keyup(function(){
    //     var value=$(this).val();    //输入的时候获取输入框的值  
    //     self.str+=value.substr(value.length-1,1); //获取最后一个字符加到到str,因为除了最后一个字符，其他的已经为*
    //     $(this).val(value.replace(/./g,'*')) //输入框内容全部变为*
    // })
  },
};
</script>
<style>
.van-icon {
  font-size: 24px !important;
  color: #d4e3f2;
  opacity: 0.5;
}
.van-field__left-icon {
  margin-right: 12px;
}
.van-button--info {
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(153deg, #14befb 0%, #0b7de0 100%);
}
.van-field__control {
  background: transparent;
  color: #fff;
}
</style>
<style scoped lang="less">
@import "../../assets/color.less";
@r:1rem /37.5;
.profile {
  height: 100%;
  width: 100%;
  background-size: 100% 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  background: #171a2a;
}
.main {
  width: 100%;
  height: 300*@r;
  display: flex;
  justify-content: center;
  & /deep/ .van-cell {
    background-color: #222638;
    border-radius: 50px;
    margin-bottom: 8*@r;
    &::after{
      display: none;
    }
  }
}
.top{
  width: 100%;
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80*@r;
  margin-bottom: 10*@r;
  img{
    height: 50*@r;
    display: block;
  }
  p{
    padding: 10*@r;
    color: #fff;
    font-size: 24px;
  }
}
.foot{
  margin-top: 50*@r;
  display: flex;
  justify-content: center;
  & /deep/ .van-icon{
    transform: rotate(-90deg);
  }
}
</style>
