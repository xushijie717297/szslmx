<template>
  <div class="configure">
    <p id="statusBar"></p>
    <van-nav-bar
      title="我的配置"
      left-arrow
      right-text="添加用户"
      @click-left="onClickLeft"
      @click-right="addUser"
    />
    <div class="nullData">
      <ul>
        <li>用户名</li>
        <li>姓名</li>
        <li>部门</li>
        <li>职位</li>
        <li>用户权限</li>
      </ul>
      <div class="userInfo">
        <div v-for="(item, index) in listData" :key="index">
          <ul>
            <li>{{ item.UserName }}</li>
            <li>{{ item.Name }}</li>
            <li>{{ item.Department }}</li>
            <li>{{ item.Post }}</li>
            <li>{{ item.JurisdictionNameStr }}</li>
            <li @click="editItem(item)">
              <van-icon color="#fff" size="18px" name="edit" />
            </li>
            <li @click="delItem(item)">
              <van-icon color="#fff" size="18px" name="delete" />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <van-popup v-model="show">
      <div class="editData">
        <p id="statusBar"></p>
        <van-nav-bar title="我的配置" left-arrow @click-left="ClickLeft" />
        <h3></h3>
        <van-form validate-first @failed="onFailed" @submit="onSubmit">
          <!-- 通过 pattern 进行正则校验 -->
          <van-field
            label="用户名"
            v-model="UserName"
            name="pattern"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '用户名内容不能为空' }]"
          />
          <van-field
            label="密码"
            v-model="password"
            type="password"
            name="pattern"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '密码内容不能为空' }]"
          />
          <!-- 通过 validator 进行函数校验 -->
          <van-field
            label="校验密码"
            v-model="passwords"
            type="password"
            name="validator"
            placeholder="请输入校验密码"
            :rules="[{ required: true, validator, message: '密码不正确' }]"
          />
          <h3></h3>
          <van-field
            label="姓名"
            v-model="Name"
            name="pattern"
            placeholder="请输入姓名"
            :rules="[{ required: true, message: '姓名内容不能为空' }]"
          />
          <van-field
            label="所在部门"
            v-model="Department"
            name="pattern"
            placeholder="请输入所在部门"
            :rules="[{ required: true, message: '所在部门不能为空' }]"
          />
          <van-field
            label="担任职务"
            v-model="Post"
            name="pattern"
            placeholder="请输入担任职务"
            :rules="[{ required: true, message: '请输入正确内容' }]"
          />
          <van-field
            label="联系电话"
            v-model="tel"
            name="pattern"
            placeholder="请输入联系电话"
            :rules="[{ pattern, message: '请输入正确内容' }]"
          />
          <div class="returnData">
            <button native-type="submit">提交</button>
            <!-- <van-button color="#4664E3" block type="info" native-type="submit"
              >提交</van-button
            > -->
          </div>
        </van-form>
        <div class="returnDataL" @click="fanhui" style="color:#39405A">
            返回
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { NavBar } from "vant";
import { Icon } from "vant";
import { Popup } from "vant";
import { Form } from "vant";
import { Field } from "vant";
import { Button } from "vant";
import { Toast } from "vant";

Vue.use(Toast);
Vue.use(Button);
Vue.use(Form);
Vue.use(Field);
Vue.use(Popup);
Vue.use(Icon);
Vue.use(NavBar);
import encryption from "../../components/js/encryption";
import urlClass from "../../components/js/UrlClass";
import global from "../../components/js/Global";
import axios from "axios";
export default {
  name: "configure",
  data() {
    return {
      GetUserInfoReturn: null,
      listData: null,
      show: false,
      Name: "",
      Department: "",
      Post: "",
      JurisdictionNameStr: "",
      UserName: "",
      passwords: "",
      password: "",
      tel: "",
      value1: "",
      value2: "",
      value3: "",
      pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
      itemInfo: {},
    };
  },
  mounted() {
    this.GetAllUserInfo();
  },
  methods: {
    fanhui() {
      this.show = false;
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    ClickLeft() {
      this.show = false;
    },
    editItem(item) {
      console.log(item);
      this.itemInfo = item;
      this.show = true;
      this.Name = item.Name;
      this.UserName = item.UserName;
      this.Department = item.Department;
      this.Post = item.Post;
      this.tel = item.Mobilephone;
      this.Password = encryption.Decode(item.Password);
      this.Passwords = item.Password;
      console.log(this.Password);
    },
    addUser() {
      this.show = true;
      this.UserName = "";
      this.Name = "";
      this.Department = "";
      this.Post = "";
      this.tel = "";
      this.itemInfo.Jurisdiction = [1, 2, 3, 4, 5, 6];
      this.itemInfo.JurisdictionName = [
        "管理",
        "设置",
        "查看",
        "编辑",
        "允许多人同时登录",
        "阀门动态设置",
      ];
    },
    delItem(item) {
      axios
        .post(
          urlClass.axiosUrl + "DeleteUser",
          JSON.stringify(item.UserId),
          global.axiosHeaders
        )
        .then((response) => {
          var result = response.data;
          if (result && String(result.Code) == "0") {
            this.GetAllUserInfo();
            Toast.success("删除成功");
          } else {
            console.log("错误信息:", result.Message);
          }
        });
    },
    validator(val) {
      return this.password == val;
    },
    //  validator(val) {//
    //     return /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(val);
    // },
    onFailed(errorInfo) {
      console.log("failed", errorInfo);
    },
    onSubmit(values) {
      this.itemInfo.Name = this.Name;
      this.itemInfo.UserName = encryption.Encode(this.UserName);
      this.itemInfo.Department = this.Department;
      this.itemInfo.Post = this.Post;
      this.itemInfo.tel = this.tel;
      this.itemInfo.Password = encryption.Encode(this.password);
      this.itemInfo.PasswordDouble = encryption.Encode(this.passwords);
      console.log(JSON.stringify(this.itemInfo));
      axios
        .post(
          urlClass.axiosUrl + "AddUpdateUser",
          JSON.stringify(this.itemInfo),
          { headers: { "Content-Type": "application/json;" } }
        )
        .then((respone) => {
          console.log(respone);
          if (respone.data.Response == "1") {
            Toast.success("修改成功");
            this.GetAllUserInfo();
          } else if (respone.data.Response == "3") {
            Toast.fail("新增成功");
            this.show = false
          } else {
            Toast.fail("提交失败");
          }
        });
    },
    GetAllUserInfo() {
      axios
        .post(urlClass.axiosUrl + "UserManageData", {
          headers: { "Content-Type": "application/json;" },
        })
        .then((respone) => {
          console.log(respone.data.Response);
          this.GetUserInfoReturn = Object.assign({}, respone.data.Response);
          this.listData = this.GetUserInfoReturn.UserList.slice(0);
          for (var i = 0; i < this.listData.length; i++) {
            this.listData[i].UserName = encryption.Decode(
              this.listData[i].UserName
            );
            //   this.listData[i].UserName = encryption.Decode(this.listData[i].UserName);
            console.log(this.listData[i].UserName);
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
@r:1rem/37.5;
.configure{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: #17192A;
    .van-nav-bar{
        background: #242838;
        &::after{
            display: none;
        }
        /deep/ .van-nav-bar__title{
            color: #fff;
        }
        /deep/ .van-icon{
            color: #fff;
        }
    }
    & /deep/ .van-field__control{
        color: #fff;
    }
}
h3{
    height: 10*@r;
    background: #17192A;
}
.editData{
    background-color: #171a2a;
    .van-nav-bar{
        background: #242838;
        &::after{
            display: none;
        }
        /deep/ .van-nav-bar__title{
            color: #fff;
        }
        /deep/ .van-icon{
            color: #fff;
        }
    }
    & /deep/ .van-field__label{
        color: #fff;
    }
}
.nullData{
    flex: 1;
    color: #606478;
    overflow: auto;
    display: flex;
    flex-direction: column;
    ul{
        height: 45*@r;
        display: flex;
        width: 100%;
        overflow-x: scroll;
        li{
            height: 100%;
            width: 60*@r;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow-x: scroll;
            &:nth-child(5){
               width: 135*@r;
               padding: 0 10*@r;
               box-sizing: border-box;
               color: #4664E3;
            }
            &:nth-child(6){
                width: 45*@r;
                background: #39405A;
            }
            &:nth-child(7){
                width: 45*@r;
                background: #CA6363;
            }
        }
    }
    .userInfo{
        flex: 1;
        overflow-y: scroll;
        color: #fff;
        div{
            // height: 45*@r;
            // display: flex;
            // flex-direction: column;
            position: relative;
            &:nth-child(odd){
                background: #1C1F2F;
            }
            ul{
                display: -webkit-box;
            }
            // &::after {
            //     position: absolute;
            //     box-sizing: border-box;
            //     content: ' ';
            //     pointer-events: none;
            //     right: 0px;
            //     bottom: 0;
            //     left: 0px;
            //     border-bottom: 1px solid #ebedf0;
            //     -webkit-transform: scaleY(.5);
            //     transform: scaleY(.5);
            // }
        }
    }
}
.van-popup--center{
    width: 100%;
    height: 100%;
    background: #17192A;
    & /deep/ .van-cell{
        background-color: #222638;
        &::after{
            border-color: #17192A;
        }
        input::-webkit-input-placeholder{   
            color: #8E92A9;   
        }
    }
}
.returnData{
    width: 187*@r;
    height: 44px;
    position: absolute;
    bottom: 0;
    right: 0;
    button{
        height: 100%;
        width: 100%;
        background: #4664E3;
        border: none;
        font-size: 14px;
        color: #fff;
    }
}
.returnDataL{
    width: 187*@r;
    height: 44px;
    background: #39405A;
    text-align: center;
    line-height: 44px;
    font-size: 14px;
    color: #fff !important;
    position: absolute;
    bottom: 0;
    left: 0;
    .van-button{
        width: 100%;
        &::after{
            border-radius: none;
        }
    }
}
</style>