<template>
  <div class="flow">
  <div class="main">
    <h2>
      <span class="return" @click="superior"></span>
        {{msg}}
      <span></span>
    </h2>
    
  </div>
</div>
</template>
<script>
export default {
  name: "flow",
  data () {
      return {
          msg:'流量详情'
      }
  },
  methods: {
     superior(){
       this.$router.go(-1)
     }
  },
  mounted () {

  }
};
</script>
<style scoped lang="less">
    @r:1rem/37.5;
  .flow{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
//   .flow::after {
//     display :block;
//     content:'';
//     width: 100%;
//     height: 50px;
//     background-color: black;
//   }
  .main{
    // height:calc(100% - 50px);
    height: 100%;
    width: 100%;
    background: #cecece;
    display: flex;
    flex-direction: column;
  }
  h2{
    height: 45*@r;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #c3c3c3;
    span{
      height: 100%;
      width: 45*@r;
    }
    .return{
      background: url(../../assets/img/iconfont/button_left_01.png) no-repeat center;
      background-size: 60% 80%;
    }
  }
</style>
