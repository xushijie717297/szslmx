<template>
  <div class="zwsj">
    <img src="../../../static/imag/huoxing.png" alt="">
    <p>数据飞到火星上去了～</p>
  </div>
</template>

<script>
   export default {
      name: 'zwsj',
      data () {
         return {

         }
      },
      methods:{

      }
   }
</script>
<style scoped lang="less">
 @r : 1rem/37.5;
.zwsj{
    width: 100%;
    height: 120*@r;
    background: #171A2A;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    img{
        display: block;
        width: 24*@r;
    };
    p{
        padding: 12*@r 0;
        color: #8E92A9;
    }
}
</style>
