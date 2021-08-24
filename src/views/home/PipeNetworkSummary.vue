<template>
  <div class="PipeNetworkSummary">
    <h5>水厂运行参数</h5>
    <div class="tableNav">
        <p>水厂名称</p>
        <p>出场压力(m)</p>
        <p>出场流量(m³/h)</p>
    </div>
    <div class="tableContent">
        <div class="content" v-for="(item,index) in Summary" :key="index">
            <p>{{item.Label}}</p>
            <p>{{item.EntryPressure}}</p>
            <p>{{item.EntryFlow}}</p>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import global from "../../components/js/Global";
import urlClass from "../../components/js/UrlClass";
export default {
  name: "PipeNetworkSummary",
  data() {
    return {
        Summary:""
    };
  },
  methods: {
    GetWaterFactoryInfo() {
      axios
        .post(
          urlClass.homePage + "GetWaterFactoryInfo",
          "",
          global.axiosHeaders
        )
        .then((response) => {
          var result = response.data;
          if (result && String(result.Code) == "0") {
            this.Summary = result.Response
          } else {
            console.log("错误信息:", result.Message);
          }
        });
    },
  },
  mounted() {
    this.GetWaterFactoryInfo();
  },
};
</script>

<style scoped lang="less">
@r:1rem /37.5;
.PipeNetworkSummary {
  margin-top: 15 * @r;
  padding: 0 12 * @r;
  box-sizing: border-box;
  h5 {
    color: #fff;
    font-size: 14px;
    padding: 9 * @r 12 * @r 9 * @r 0;
    width: 100%;
    box-sizing: border-box;
  }
  .tableNav{
      height: 30*@r;
      display: flex;
      background: #1c2730;
      p{
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          color: #fff;
      }
  }
  .tableContent{
      .content{
          height: 26*@r;
          display: flex;
          &:nth-child(odd){
              background: #0d161d;
          }
          p{
              flex: 1;
              color: #657984;
              display: flex;
              align-items: center;
          }
      }
  }
}
</style>>