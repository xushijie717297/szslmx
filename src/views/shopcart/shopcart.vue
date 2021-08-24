<template>
  <div class="waring">
    <p id="statusBar"></p>
    <h3>模型</h3>
    <div class="top">
      <div  v-for="(item,index) in data" :key="index" class="main">
        <h4>{{item.cate}}</h4>
          <van-grid :border="false" :column-num="3">
          <van-grid-item :text="itemson.text" ref="gridd"  v-for="(itemson,index) in item.news" :key="index" @click="jumping(itemson,itemson.state)">
            <van-image :src="itemson.url" />
            <div>{{itemson.name}}</div>
          </van-grid-item>
        </van-grid> 
      </div>
      <div  v-for="(itemm,index) in list" :key="index+1" class="main" style="margin-bottom:50px">
        <h4>{{itemm.cate}}</h4>
          <van-grid :border="false" :column-num="3">
          <van-grid-item :style="ite.show?'':'pointer-events: none'" :text="ite.text"  v-for="(ite,i) in itemm.news" :key="i" @click="jumping(ite,ite.state)">
            <van-image v-show="ite.show" :src="ite.url" />
            <div v-show="ite.show">{{ite.name}}</div>
          </van-grid-item>
        </van-grid> 
      </div>
    </div>
  </div>
  
</template>
<script>
import Vue from 'vue';
import { Grid, GridItem, Image as VanImage} from 'vant';

Vue.use(VanImage);
Vue.use(Grid);
Vue.use(GridItem)
export default {
  name: "Waring",
  data () {
    return {
      day:null,
      data:[{
            "cate":"运行状态",
            "news":[
                {"url":require("../../../static/menu/Basicpipe.png"),"name":"基础管网","state":"Basics","only":11,"key":0,"show":false},
                {"url":require("../../../static/menu/Flow.png"),"name":"管道流量","state":"Flow","only":0,"key":0,"show":true},
                {"url":require("../../../static/menu/Velocity.png"),"name":"管道流速","state":"Velocity","only":0,"key":0,"show":true},
                {"url":require("../../../static/menu/Slop.png"),"name":"水力坡度","state":"Slop","only":0,"key":0,"show":true},
                {"url":require("../../../static/menu/HydraulicGrade.png"),"name":"水压标高","state":"HydraulicGrade","only":0,"key":0,"show":true},
                {"url":require("../../../static/menu/Pressure.png"),"name":"压力","state":"Pressure","only":0,"key":0,"show":true},
                {"url":require("../../../static/menu/liu.png"),"name":"水流方向","state":"flow","only":3,"key":0,"show":true},
                {"url":require("../../../static/menu/Demand.png"),"name":"节点流量","state":"Demand","only":0,"key":0,"show":true},
                {"url":require("../../../static/menu/SupplyArea.png"),"name":"供水分界","state":"SupplyArea","only":0,"key":0,"show":false},
                {"url":require("../../../static/menu/Age.png"),"name":"水龄","state":"Age","only":0,"key":0,"show":true},
                // {"url":require("../../../static/menu/PipeAge.png"),"name":"管龄","state":"PipeAge","only":0,"key":0,"show":true},
                {"url":require("../../../static/menu/Diameter.png"),"name":"管径分类","state":"Diameter","only":0,"key":0,"show":true},
                {"url":require("../../../static/menu/Material.png"),"name":"管材分类","state":"Material","only":0,"key":0,"show":false},
                {"url":require("../../../static/menu/PressureChange.png"),"name":"压力波动","state":"PressureChange","only":0,"key":0,"show":true},
                {"url":require("../../../static/menu/FlowChangeCount.png"),"name":"流向变化","state":"FlowChangeCount","only":0,"key":0,"show":true}
            ]
        }] ,
      list:[
            {
              "cate":"智能分析",
              "news":[
                  {"url":require("../../../static/menu/close.png"),"name":"关阀处置","state":"close","only":1,"key":0,"show":true},
                  {"url":require("../../../static/menu/TubeBurst.png"),"name":"爆管工况","state":"TubeBurst","only":2,"key":0,"show":true},
                  {"url":require("../../../static/menu/waterSupply.png"),"name":"供水路径","state":"Analysis","only":4,"key":0,"show":true},
                  {"url":require("../../../static/menu/contaminated.png"),"name":"污染分析","state":"WaterQuality","only":5,"key":0,"show":true},
                  // {"url":require("../../../static/menu/contaminated.png"),"name":"污染分析","state":"contaminated","only":1,"key":0,"show":false}
              ]
            }
      ]   
    }
  },
  methods: {
    jumping(item,state){//state路由标识
    console.log(item.only)
        var user = item.name
        var legendShow = item.show
        switch(item.only){
          case 0://公共路由
            this.$router.push({path:'/warn',query:{index:state,user:user,legend:legendShow}});
            break;
          case 1://单一路由
          console.log(1)
            this.$router.push({path:'/intelligence',query:{index:state}});
            break;
          case 2:
            this.$router.push("/tubeBurst");
          break;
          case 3:
            this.$router.push('/Direction');
            break;
          case 4:
            this.$router.push('/Analysis');
            break;
          case 5:
            this.$router.push('/WaterQuality')
          break;
          case 11:
            this.$router.push('/BasicsPipe')
          break;
        }
    }   
  },
  mounted () {
    // console.log(data)
    // this.data = data
    console.log(this.data)
  }
};
</script>
<style scoped  lang="less">
@r: 1rem/37.5;
  .waring{
    height: 100%;
    width: 100%;
    background: #171A2A;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // background-color: antiquewhite;
    &::after{
      display :block;
      content:'';
      width: 100%;
      height: 50px;
      // background-color: black;
    }
  }
  .top{
    flex: 1;
    overflow: auto;
    .main,.mainn{
      width: 100%;
      padding: 0 12*@r;
      box-sizing: border-box;
      background: #171A2A;
        .van-image{
    height: 32*@r;
    width: 32*@r;
    margin-top: 11*@r;
    margin-bottom: 15*@r;
  }
    }
  }
  h3{
    height: 45*@r;
    background-color:#242838;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
  h4{
    width: 350*@r;
    height: 55*@r;
    font-size: 14px;
    color: #fff;
    line-height: 55*@r;
    box-sizing: border-box;
    padding-left: 12*@r;
  }
  .van-grid{
    border: 1px solid #262a3b;
    border-radius: 10*@r;
    overflow: hidden;
    // &::after{
    //   content: '';
    //   display: block;
    //   border-left: 1px solid red;
    //   margin-left: 115*@r;
    // }
  }
  .van-grid-item{
    height: 116*@r;
    box-sizing: border-box;
    &:nth-child(n){
        border-bottom: 1px solid #262a3b;
        border-right: 1px solid #262a3b;
        box-sizing: border-box;

      };
      &:nth-child(2n+2){
        border-bottom: 1px solid #262a3b;
        border-right: 1px solid #262a3b;
        box-sizing: border-box;

      };
      &:nth-child(3n){
        border-bottom: 1px solid #262a3b;
        border-right: none
      };
      &:last-child{
        border-bottom: none;
      };
      &:nth-last-child(2){
        border-bottom: none;
      }
      &:nth-last-child(3){
        border-bottom: none;
      }
  }

/deep/ .van-grid-item__content{
//     background: #1C1F2F;
    background:#1C1F2F;
    color: #fff;
}
/deep/ .van-grid-item__content:active{
    background: #242838;
    // background:transparent;
}
.gridItem{
  background: #242838 !important;
}
</style>
