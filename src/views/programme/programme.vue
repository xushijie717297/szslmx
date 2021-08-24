<template>
	<div class="programme">
        <div class="main">
            <p id="statusBar"></p>
            <van-nav-bar
                title="方案"
                left-text=""
                right-text="重置"
                :left-arrow = false
                @click-left="onClickLeft"
                @click-right="onClickRight"
                :safe-area-inset-top = true
                :border = false
            />
            <div class="screen">
                <van-popover
                    v-model="showPopover"
                    theme="dark"
                    trigger="click"
                    :actions="actions"
                    get-container=".programme"
                    @select = "selectType"
                    >
                    <template #reference>
                        <div class="screenTop">
                            {{screenType}}
                            <span class="iconfont iconxiasanjiaoxing"></span>
                        </div>
                    </template>
                </van-popover>
                <!-- 第二排下拉选择 -->
                <div v-show="selectShow">
                    <van-popover
                        v-model="showPopover1"
                        theme="dark"
                        trigger="click"
                        :actions="action"
                        get-container=".screen"
                        @select = "selectType1"
                        >
                        <template #reference>
                            <div class="screenTop">
                                <p>
                                {{screenType1}}
                                </p>
                                <span class="iconfont iconxiasanjiaoxing"></span>
                            </div>
                        </template>
                    </van-popover>
                </div>
                <!-- 第二排输入框 -->
                <input @blur = "blurText" v-show="selectShow1" type="text" v-model="inputText" :placeholder="name">
                <div class="screenBtn" @click="screenClick">
                    <span class="iconfont iconshaixuan"></span>
                    筛选
                </div>
            </div>
            <div class="list">
                <!-- <Skeleton></Skeleton> -->
                <div v-if="nullData" class="nullData">
                    <p class="iconfont iconzanwushuju"></p>
                    <span>暂无数据</span>
                </div>
                <!-- <div v-if="false" class="nullData">暂无数据</div> -->
                <!-- <div class="lister" v-show="false" v-for="(item,index) in userData" :key="index" @click="popupDetail(item)"> -->
                <div class="lister" v-else v-for="(item,index) in userData" :key="index" @click="popupDetail(item)">
                    <div class="left" :class="item.PlanGradeName == '准确' ? 'green' : 'red'"></div>
                    <div class="center">
                        <h4>方案类型</h4>
                        <div class="programmeType">
                            <img :src="csfa" v-if="item.PlanTypeID == '3'" alt="">
                            <img :src="gcfa" v-if="item.PlanTypeID == '5'" alt="">
                            <img :src="gcsj" v-if="item.PlanTypeID == '2'" alt="">
                            <img :src="gdgj" v-if="item.PlanTypeID == '6'" alt="">
                            <img :src="gdpg" v-if="item.PlanTypeID == '4'" alt="">
                            <img :src="tszy" v-if="item.PlanTypeID == '1'" alt="">
                            <img :src="bggf" v-if="item.PlanTypeID == '7'" alt="">
                            <p>{{item.PlanType_Name}}</p>
                        </div>
                        <div class="evaluate">
                            <p >评价</p>
                            <span :class=" item.PlanGradeName == '准确' ? 'green11' : 'red11'">{{item.PlanGradeName}}</span>
                        </div>
                        <div class="ellipseT"></div>
                        <div class="ellipseB"></div>
                    </div>
                    <div class="right">
                        <div class="ellipseT"></div>
                        <div class="ellipseB"></div>
                        <h4>{{item.PlanName}}</h4>
                        <div class="TimeC">
                            <div class="TimeCL">
                                <p :class=" item.PlanGradeName == '准确' ? 'green1' : 'red1'" v-for="(item1,index) in 5" :key="index "></p>
                            </div>
                            <div class="TimeCR">
                                <h5>
                                    <p>新建时间 :</p>
                                    <span>{{item.CreationTime}}</span>
                                </h5>
                                <h5>
                                    <p>归档时间：</p>
                                    <span>{{item.ArchiveTime}}</span>
                                </h5>
                            </div>                            
                        </div>
                        <h5 class="miaoshu">描述 :</h5>
                        <div class="brief">
                            <p class="briefText">{{item.PlanDescribe | textHidden}}</p>
                            <span @click.stop="dialog(item)">更多</span>
                        </div>
                    </div>
                </div>
                <!-- <infinite-loading  spinner="bubbles" @infinite="infiniteHandler">
                    <span
                        slot="no-more"
                        style="height: 60px; line-height: 60px; display: block;color:#8E92A9"
                    >
                    没有更多数据了
                    </span>
                    <span
                        slot="no-results"
                        style="height: 60px; line-height: 60px; display: block;color:#8E92A9"
                    >
                    暂无数据
                    </span>
                </infinite-loading> -->
            </div>
        </div>
        <van-popup v-model="PopupS" :close-on-click-overlay="false" get-container=".programme">
            <van-loading type="spinner" color="#1989fa" />
        </van-popup>
        <van-popup v-model="PopupShow"  get-container="#app">
        <!-- <van-popup v-model="PopupShow" :close-on-click-overlay="false" get-container="#app"> -->
            <div class="Dialog" v-if="PopupShow">
                <div class="navTop">
                    方案详情
                    <p @click="DialogF">
                        <img src="../../../static/imag/chahao.png" alt="">
                    </p>
                </div>
                <div class="content"  v-for="(item,index) in PopupData" :key="index">
                    <h5>
                        {{item.PlanName}}
                    </h5>
                    <div class="TimeC">
                        <div class="TimeCL">
                            <p :class="item.PlanGradeName == '准确' ? 'red' : 'green'" v-for="(item,index) in 5" :key="index "></p>
                        </div>
                        <div class="TimeCR">
                            <h5>
                                <p>新建时间&nbsp;: </p>
                                <span>{{item.CreationTime}}</span>
                            </h5>
                            <h5>
                                <p>归档时间&nbsp;:</p>
                                <span>{{item.ArchiveTime}}</span>
                            </h5>
                        </div>                            
                    </div>
                    <div class="Founder">
                        <p>创建人&nbsp;：</p>
                        <span>{{item.Username}}</span>
                    </div>
                    <div class="admin">
                        <p>方案类型&nbsp;：</p>
                        <span>{{item.PlanType_Name}}</span>
                    </div>
                    <div class="evaluate">
                        <p>评价&nbsp;：</p>
                        <span  :class="item.PlanGradeName == '准确' ? 'red' : 'green'">{{item.PlanGradeName}}</span>
                    </div>
                    <div class="file">
                        <p>是否归档&nbsp;：</p>
                        <span>{{item.ArchiveTF}}</span>
                    </div>
                    <div class="describe">
                        <p>描述&nbsp;：</p>
                        <span>
                            {{item.PlanDescribe | textHidden}}
                        </span>
                    </div>
                </div>
            </div>
        </van-popup>
	</div>
</template>
<script>
import Skeleton from "./Skeleton.vue"
import programmeImg from "../../../static/imag/falx.png";
import tszy from "../../../static/imag/programme/tszy.png";
import gcsj from "../../../static/imag/programme/gcsj.png";
import csfa from "../../../static/imag/programme/csfa.png";
import gdpg from "../../../static/imag/programme/gdpg.png";
import gdgj from "../../../static/imag/programme/gdgj.png";
import gcfa from "../../../static/imag/programme/gcfa.png";
import bggf from "../../../static/imag/programme/bggf.png";
import Vue from 'vue';
import axios from "axios";
import Bus from "../../utils/Bus";
import urlClass  from "../../components/js/UrlClass";
import InfiniteLoading from 'vue-infinite-loading';
import aa from "./aa.json";
import { Popup, Popover, Dialog, NavBar, Loading } from 'vant';

Vue.use(Loading);
Vue.use(NavBar);
Vue.use(Popover);
Vue.use(Popup);
export default {
  name: "programme",
  inject:['reload'],
  components: {
    InfiniteLoading,
    Skeleton,
    [Dialog.Component.name]: Dialog.Component,
  },
  data () {
    return {
      typeChange:0,
      PopupS:true,
      name:"请输入方案名称",
      src:'',
      tszy:'',
      gcsj:'',
      csfa:'',
      gdpg:'',
      gcfa:'',
      gdgj:'',
      bggf:'',
      userDatas:[],
      userData:[],
      currentPage:0,
      cont:0,
      pageSize:0,
      text:"11",
      PopupShow:false,
      PopupData:[],
      index:0,
      nullData:true,
      screenType:"方案类型",
      screenType1:"选择方案类型",
      inputText:"",
      type1:[{ text: '停水作业',className:"" }, { text: '工程设计',className:"" }, { text: '冲水方案',className:"" }, { text: '管道评估',className:"" }, { text: '管道割接',className:"" }, { text: '爆管关阀',className:"" }, { text: '工程方案评估',className:"" }],
      type2:[{ text: '准确',className:"add" },{ text: '不准确',className:"" },],
      type3:[{ text: '个人项目',className:"add" },{ text: '全部项目',className:"" },],
      showPopover: false,
      showPopover1: false,
      selectShow1: false,
      selectShow:true,
      action:[],
      actions: [{ text: '方案类型',className:"add" }, { text: '方案名称',className:"" }, { text: '创建人',className:"" }, { text: '评价',className:"" }, { text: '项目类型',className:"" }],
      params:{
        TypeName:"",
        AssessName:"",
        UserName:"",
        PlanName:"",
        UserId:"",
      }
    }
  },
  filters: {
      textHidden:function(value){
          let text = value;
          if(value.length == 0){
            text = "暂无描述"
          }
          return text;
      }
  },
  watch: {
      PopupData(newValue,oldValue){
          this.PopupData = newValue
      }
  },
  methods: {
    onClickLeft() {
      console.log('左边')
    },
    onClickRight() {
    this.reload()//刷新当前页面
    //   console.log("右边")
    //   var userId = "1"
    //   this.GetPlanData(userId) 
    //   this.screenType1 = "选择方案类型";
    //   this.typeChange = 0
    //   this.actions[this.typeChange].className = "add"
    },
    selectType(action,index){
        this.index = index;
        this.params.TypeName = "";
        this.params.AssessName = "";
        this.params.UserName = "";
        this.params.PlanName = "";
        switch (index) {
            case 0:
                this.screenType1 = this.type1[this.typeChange].text//
                console.log(this.screenType1)
                this.selectShow = true;
                this.selectShow1 = false;
                this.action = this.type1
                this.params.TypeName = this.screenType1
                break;
            case 1:
                this.name = "请输入方案名称";
                this.inputText = "";
                this.selectShow = false;
                this.selectShow1 = true;
                break;
            case 2:
                this.name = "请输入创建人名称";
                this.inputText = "";
                this.selectShow = false;
                this.selectShow1 = true;
                break;
            case 3:
                this.screenType1 = this.type2[0].text
                this.selectShow = true;
                this.selectShow1 = false;
                this.action = this.type2;
                this.params.AssessName = "1"
                break;
            case 4:
                this.screenType1 = this.type3[0].text
                this.selectShow = true;
                this.selectShow1 = false;
                this.action = this.type3;
                break;
        }
        for (let i = 0; i < this.actions.length; i++) {
            this.actions[i].className = "" 
        }
        this.actions[index].className = "add"
        this.screenType = action.text
    },
    selectType1(action,index){
        console.log(action,index)
        for (let i = 0; i < this.action.length; i++) {
            this.action[i].className = "" 
        }
        this.action[index].className = "add"
        this.screenType1 = action.text
        console.log(this.index)
        this.typeChange = index;
        switch (this.index) {
            case 4:
                if(index == '0'){
                    this.params.UserId = localStorage.getItem("UserId");
                }else{
                this.params.UserId = "" 
                }
                break;
            case 0:
                console.log(action,index)
                this.params.TypeName = action.text
                break;
            case 3:
                console.log(index)
                if(index == '0'){
                    this.params.AssessName = "1"
                }else{
                    this.params.AssessName = "0"
                }
                break;
        }
    },
    blurText(){
        console.log("失去焦点")
        this.inputText = this.inputText.replace(/\s*/g,"")
        if(this.index == "1"){
            this.params.PlanName = this.inputText
        }else{
            this.params.UserName = this.inputText
        }
    },
    screenClick(){
        console.log(this.params.PlanName.length)
        var userId = localStorage.getItem("Userid")
        console.log("筛选",this.index)
        switch (this.index) {
            case 0:
                if(this.screenType1 == "选择方案类型"){
                    Dialog.confirm({
                    title: "提示",
                    message: "请选择方案类型",
                    })
                    .then(() => {
                        // on confirm
                    })
                    .catch(() => {
                        // on cancel
                    });
                }else{
                    this.PlanScreen(this.params)
                }
                break;
            case 1:
                if(this.inputText.length == "0"){
                    Dialog.confirm({
                    title: "提示",
                    message: "请输入方案名称",
                    })
                    .then(() => {
                        // on confirm
                    })
                    .catch(() => {
                        // on cancel
                    });
                }else{
                    this.PopupS = true
                    this.PlanScreen(this.params)
                }
                break;
        
            case 2:
                if(this.inputText.length == "0"){
                    Dialog.confirm({
                    title: "提示",
                    message: "请输入创建人名称",
                    })
                    .then(() => {
                        // on confirm
                    })
                    .catch(() => {
                        // on cancel
                    });
                }else{
                    this.PopupS = true
                    this.PlanScreen(this.params)
                }
                break;
            default:
                this.PlanScreen(this.params)
                break;

        }
        console.log(this.params)
    },
    PlanScreen(screenInfo) {
      var self = this;
      axios
        .post(urlClass.axiosUrl + "PlanScreen", screenInfo, global.axiosHeaders)
        .then(function(response) {
          var result = response.data;
          if(result && String(result.Code) == "0"){
            var obj = result.Response;
            console.log(obj)
            if(obj.length == "0"){
                self.nullData = true
                self.PopupS = false
            }else{
                self.PopupS = false
                self.userData = obj;
                self.nullData = false;
            }
          }else{
            console.log("错误信息:", result.Message);
          }
        });
    },
    DialogF(){
        this.PopupShow = false;
    },
    dialog(data){
    this.PopupData = [];
    this.PopupData.push(data)
    this.PopupShow = true;
    },
    // infiniteHandler($state) {
    //   var self = this;
    //   var userId = "1";
    //   axios
    //     .post(urlClass.axiosUrl + "planData", JSON.stringify(userId), {
    //       headers: { "Content-Type": "application/json;" }
    //     })
    //     .then(function(respone) {
    //         console.log(respone)
    //         var obj = respone.data.PlanData;
    //         self.currentPage = Math.ceil(obj.length/4)
    //         self.pageSize++;
    //         if ( self.pageSize <= self.currentPage) {
    //             self.userData.push(...obj.slice(self.cont,self.cont + 4))
    //             self.cont += 4;
    //             console.log(self.cont)
    //             var aa = [];
    //             for (let i = 0; i < self.userData.length; i++) {
    //                aa.push(self.userData[i])
    //             }
    //                 console.log(aa)
    //             $state.loaded();
    //         } else {
    //             $state.complete();
    //         }
    //     });
    // },
    GetPlanData(userId) {
      var self = this;
      axios
        .post(urlClass.axiosUrl + "planData", JSON.stringify(userId), {
          headers: { "Content-Type": "application/json;" }
        })
        .then(function(respone) {
            console.log(respone.data.Code)
            if (respone.data.Code == '0') {
                self.nullData = false
                var obj = respone.data.Response.PlanData;
                self.PopupS = false
                self.userData = obj
            }else{
               Dialog.confirm({
                    title: "提示",
                    message: "请求错误！",
                    }) 
            }


        }).catch((error) => {
            self.PopupS = false
        });
    },
    popupDetail(data){
        this.$router.push({path:'/programmeDetail',query:{programmeData:data}})
    }
  },
  mounted () {
      var Userid = "1"
      localStorage.setItem("Userid", Userid);
      this.src = programmeImg;
      this.gdgj = gdgj;
      this.gcsj = gcsj;
      this.tszy = tszy;
      this.csfa = csfa;
      this.gcfa = gcfa;
      this.gdpg = gdpg;
      this.bggf = bggf;
      this.action = this.type1;
      this.params.UserId = localStorage.getItem("Userid");
      this.params.TypeName = this.screenType1;
  },
  created () {
      var userId = "1"
      this.GetPlanData(userId) 
      console.log("加载。。。")
  },
};
</script>
<style scoped lang="less">
@import '../../assets/color.less';
@r:1rem/37.5;
.programme /deep/ .van-popup{
    background-color: transparent !important;
}
.Dialog{
    width: 280*@r;
    background: #171a2a ;
    // padding: 0 20*@r 20*@r 20*@r;
    // box-sizing: border-box;
    .navTop{
        height: 40*@r;
        width: 100%;
        color: #fff;
        line-height: 40*@r;
        border-bottom: 1px solid #262a3b;
        box-sizing: border-box;
        padding-left: 20*@r;
        display: flex;
        justify-content: space-between;
        align-items: center;
        P{
            height: 40*@r;
            width: 40*@r;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        img{
            width: 10*@r;
            height: 10*@r;
            display: block;
        }
    };
    .content{
        width: 100%;
        padding: 0 20*@r;
        box-sizing: border-box;
        h5{
            width: 100%;
            padding: 16*@r 0;
            line-height: 26*@r;
        };
        .TimeC{
            height: 40*@r;
            display: flex;
            .TimeCL{
                width: 6px;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                padding: 3px 0;
                box-sizing: border-box;
                p{
                    &:nth-child(1){
                        width: 6px;
                        height: 6px;
                        background: #679f46;
                        border-radius: 50%;
                    };
                    &:nth-child(2){
                        width: 3px;
                        height: 3px;
                        background: #3a5238;
                        border-radius: 50%;
                    };
                    &:nth-child(3){
                        width: 3px;
                        height: 3px;
                        background: #496c3d;
                        border-radius: 50%;
                    };
                    &:nth-child(4){
                        width: 3px;
                        height: 3px;
                        background: #588541;
                        border-radius: 50%;
                    };
                    &:nth-child(5){
                        width: 6*@r;
                        height: 6*@r;
                        background: #679f46;
                        border-radius: 50%;
                    };
                }
            };
            .TimeCR{
                width: 208*@r;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding-left: 10*@r;
                box-sizing: border-box;
                h5{
                    height: 16*@r;
                    display: flex;
                    width: 100%;
                    font-size: 12px;
                    padding: 0;
                    align-items: center;
                    p{     
                        width: 65*@r;
                        height: 16*@r;                          
                        color: #fff;
                        font-weight: bold;
                        line-height: 16*@r;
                    };
                    span{
                        color: #8E92A9;
                        flex: 1;
                        height: 16*@r;
                        line-height: 16*@r;
                    }
                }
            }
        };
        .Founder{
            margin-top: 10*@r;
            padding: 10*@r 0;
            display: flex;
            color: #fff;
            span{
                color: #8E92A9;
            }
        };
        .admin{
            padding: 10*@r 0;
            color: #fff;
            display: flex;
            align-items: flex-end;
            span{
                color: #61B1DA;
            }
        };
        .evaluate{
            padding: 10*@r 0;
            color: #fff;
            display: flex;
            span{
                color: #679F46;
            }
        };
        .file{
            .evaluate();
            span{
                color: #8E92A9;
            }
        };
        .describe{
            padding: 10*@r 0 30*@r 0;
            color: #fff;
            display: flex;
            flex-direction: column;
            span{
                margin-top: 10*@r;
                color: #8E92A9;
                display: block;
                line-height: 22*@r;
            }
        }
    }
}
.programme{
    height: 100%;
    width: 100%;
    background-color: #171a2a;
    &::after{
    display :block;
    content:'';
    width: 100%;
    height: 50px;
    background-color: #fff;
    }
    & /deep/ .van-nav-bar{
        background: #242838;
        .van-nav-bar__title{
            font-size: 15px;
            color: #fff;
        }
    }
    & /deep/ .van-popover__content{
        border-radius: 0;
        background: #242838;
    }
    & /deep/ .van-popover--dark{
       color: #8E92A9;
    }
    & /deep/ .van-hairline--bottom{
        &::after{
            border-color: #2B2F41;
        }
    }
    & /deep/ .van-popover .add{
        color: #4664E3;
        font-weight: bold;
    }
    // & /deep/ .van-popover__content{
    //     // background: #171a2a;
    // }
    & /deep/ .van-popover{
        left: 20px !important;
    }
    & /deep/ .van-popover__action{
        width: 80px;
        padding: 0;
        font-size: 12px;
    }
    input{
        height: 25*@r;
        outline: none;
        border: 1px solid #262A3B;
        border-radius: 12px;
        background: #171a2a;
        padding-left: 10*@r;
        color: #fff;
    }
}
    input::-webkit-input-placeholder {
		color: #8E92A9;
	}
	/* 火狐 Mozilla Firefox 4 to 18 */ 
	input:-moz-placeholder {
		color: #8E92A9;
	}
	/* 火狐 Mozilla Firefox 19+ */ 
	input::-moz-placeholder {
		color: #8E92A9;
	}
	/* Internet Explorer 10+ */ 
	input:-ms-input-placeholder {
		color: #8E92A9;
	}
.screen{
    & /deep/ .van-popover{
        left: 120px !important;
    }
    height: 45*@r;
    width: 100%;
    // background: red;
    display: flex;
    align-items: flex-end;
    padding: 0 12*@r;
    box-sizing: border-box;
    .screenTop{
        width: 82*@r;
        height: 25*@r;
        border-radius: 12px;  
        padding: 0 4px;    
        border: 1px solid #262A3B;
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #fff;
        justify-content: space-around;
        overflow-x: scroll;
        white-space: nowrap;
        margin-right: 12*@r;
        span{
            font-size: 12px;
            color: #8e92a9;
        }
        p{
            width: 60*@r;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: center
        }
    };
    .screenBtn{
        width: 65*@r;
        height: 25*@r;
        background: #4664E3;
        border-radius: 12px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        padding: 0 8px;
        color: #fff;
        margin-left: auto;
    }
}
  .main{
    height: calc(100% - 50px);
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    h3{
        height: 45*@r;
        width: 100%;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    };
    .list{
        width: 100%;
        height: calc(100% - 45*@r);
        // height: 100%;
        background: #171a2a;
        overflow-y:scroll;
        padding: 0*@r 12*@r 0 12*@r;
        box-sizing: border-box;
        .nullData{
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            p{
                font-size: 42px;
                color: #585b70;
            }
            span{
                padding: 15*@r;
                color: #8E92A9;
            }
        }
        .lister{
            // height: 172*@r;
            display: flex;
            background: #1C1F2F;
            border-radius: 5*@r;
            margin-top: 15*@r;
            position: relative;
            overflow: hidden;
            &:nth-last-child(1){
                &::after{
                    content: "没有更多数据了";
                    display: block;
                    position: absolute;
                    width: 100%;
                    height: 80px;
                    line-height: 50px;
                    text-align: center;
                    bottom: -80px;
                }
            }
            .red{
                background: #BB3C39 !important;
                color: #BB3C39 !important
            };
            .green{
                background: #679F46 !important;
                color: #679F46 !important
            };
            .red11{
                color: #BB3C39 !important
            };
            .green11{
                color: #679F46 !important
            };
            .red1{
                &:nth-child(1){
                    width: 6px;
                    height: 6px;
                    background: #bb3c39;
                    border-radius: 50%;
                };
                &:nth-child(2){
                    width: 3px;
                    height: 3px;
                    background: #5c2b33;
                    border-radius: 50%;
                };
                &:nth-child(3){
                    width: 3px;
                    height: 3px;
                    background: #7b3035;
                    border-radius: 50%;
                };
                &:nth-child(4){
                    width: 3px;
                    height: 3px;
                    background: #9b3637;
                    border-radius: 50%;
                };
                &:nth-child(5){
                    width: 6*@r;
                    height: 6*@r;
                    background: #bb3c39;
                    border-radius: 50%;
                };
            };
            .green1{
                &:nth-child(1){
                    width: 6px;
                    height: 6px;
                    background: #679f46;
                    border-radius: 50%;
                };
                &:nth-child(2){
                    width: 3px;
                    height: 3px;
                    background: #3a5238;
                    border-radius: 50%;
                };
                &:nth-child(3){
                    width: 3px;
                    height: 3px;
                    background: #496c3d;
                    border-radius: 50%;
                };
                &:nth-child(4){
                    width: 3px;
                    height: 3px;
                    background: #588541;
                    border-radius: 50%;
                };
                &:nth-child(5){
                    width: 6*@r;
                    height: 6*@r;
                    background: #679f46;
                    border-radius: 50%;
                };  
            };
            .left{
                width: 3*@r;
                height: auto;
                background: red;
            };
            .center{
                width: 92*@r;
                padding-left: 10*@r;
                box-sizing: border-box;
                font-size: 12px;
                color: #fff;
                position: relative;
                border-right: 1px dashed #262a3b;
                box-sizing: border-box;
                h4{
                    width: 100%;
                    height: 36*@r;
                    line-height: 36*@r;
                    margin-top: 3*@r;
                };
                .programmeType{
                    width: 100%;
                    img{
                        display: block;
                        width: 21*@r;
                        margin-left: 3*@r;
                    }
                    p{
                        width: 56*@r;
                        line-height: 18*@r;
                        color: #61b1da;
                        font-weight: 900;
                        margin-top: 10*@r;
                    }
                };
                .evaluate{
                    width: 100%;
                    margin: 16*@r 0 16*@r 0;
                    height: 36*@r;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    p{
                      color: #fff;  
                    };
                    span{
                        color: #679F46;
                    }
                };
                .ellipseT{
                    background: #171a2a;
                    width: 6*@r; 
                    height: 6*@r;
                    border-radius: 100% 0 0 0;
                    transform:rotate(-90deg);
                    position: absolute;
                    right: -1px;
                    top: 0;
                };
                .ellipseB{
                    background: #171a2a;
                    width: 6*@r; 
                    height: 6*@r;
                    border-radius: 100% 0 0 0;
                    transform:rotate(0deg);
                    position: absolute;
                    right: -1px;
                    bottom: 0;
                }
            };
            .right{
                flex: 1;
                // background: red;
                position: relative;
                padding-left: 16*@r;
                box-sizing: border-box;
                .ellipseT{
                    background: #171a2a;
                    width: 6*@r; 
                    height: 6*@r;
                    border-radius: 100% 0 0 0;
                    transform:rotate(-180deg);
                    position: absolute;
                    left: 0px;
                    top: 0;
                };
                .ellipseB{
                    background: #171a2a;
                    width: 6*@r; 
                    height: 6*@r;
                    border-radius: 100% 0 0 0;
                    transform:rotate(90deg);
                    position: absolute;
                    left: 0px;
                    bottom: 0;
                };
                h4{
                    width: 200*@r;
                    height: 45*@r;
                    line-height: 45*@r;
                    font-size: 15px;
                    color: #fff;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                };
                .TimeC{
                    height: 40*@r;
                    display: flex;
                    .TimeCL{
                        width: 6px;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        align-items: center;
                        padding: 3px 0;
                        box-sizing: border-box;
                        // p{
                        //     &:nth-child(1){
                        //         width: 6px;
                        //         height: 6px;
                        //         background: #679f46;
                        //         border-radius: 50%;
                        //     };
                        //     &:nth-child(2){
                        //         width: 3px;
                        //         height: 3px;
                        //         background: #3a5238;
                        //         border-radius: 50%;
                        //     };
                        //     &:nth-child(3){
                        //         width: 3px;
                        //         height: 3px;
                        //         background: #496c3d;
                        //         border-radius: 50%;
                        //     };
                        //     &:nth-child(4){
                        //         width: 3px;
                        //         height: 3px;
                        //         background: #588541;
                        //         border-radius: 50%;
                        //     };
                        //     &:nth-child(5){
                        //         width: 6*@r;
                        //         height: 6*@r;
                        //         background: #679f46;
                        //         border-radius: 50%;
                        //     };
                        // }
                    };
                    .TimeCR{
                        width: 208*@r;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        padding-left: 10*@r;
                        box-sizing: border-box;
                        h5{
                            height: 16*@r;
                            display: flex;
                            width: 100%;
                            font-size: 12px;
                            padding: 0;
                            align-items: center;
                            p{     
                                width: 65*@r;
                                height: 16*@r;                          
                                color: #fff;
                                font-weight: bold;
                                line-height: 16*@r;
                            };
                            span{
                               color: #8E92A9;
                               flex: 1;
                               height: 16*@r;
                               line-height: 16*@r;
                            }
                        }
                    }
                };
                .miaoshu{
                    font-size: 12px;
                    color: #fff;
                    padding: 15*@r 0;
                };
                .brief{
                    width: 224*@r;
                    position: relative;
                    p{
                        width: 200*@r;
                        line-height: 22*@r;
                        color: #8E92A9;
                        text-align: justify;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    };
                    span{
                        color: #4664E3;
                        position: absolute;
                        right: -10*@r;
                        top: -10*@r;
                        display: block;
                        line-height: 22*@r;
                        padding: 10*@r;
                    }
                }
            }
        }
    }

  }

</style>
