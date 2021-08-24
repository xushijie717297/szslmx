<template>
  <div class="police">
    <p id="statusBar"></p>
    <van-nav-bar
        title="我的报警"
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="nullData">
        <p class="iconfont iconzanwushuju"></p>
        <span>暂未开放</span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { NavBar } from 'vant';

Vue.use(NavBar);
export default {
    name:"police",
    data () {
        return {
            
        }
    },
    methods: {
        onClickLeft(){
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="less" scoped>
@r:1rem/37.5;
.police{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .van-nav-bar{
        background: transparent;
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
}
.nullData{
    flex: 1;
    overflow: auto;
    background-color: #171a2a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p{
        font-size: 42px;
        color: #585b70;
    }
    span{
        padding: 15*@r;
        color: #8E92A9;
    }
}
</style>