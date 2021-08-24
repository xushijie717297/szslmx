<template>
  <div class="dialog">
    <!--  -->
    <van-dialog v-model="show" :closeOnClickOverlay='true' title="条件筛选" width="280" @confirm="confirmOn" @cancel="cancelOn" show-cancel-button>  
    <div class="box">
      <div class="top">
        <van-switch inactive-color="#9a9ea4" v-model="checked" size="24px" />
        <p :class="{prohibit:!checked}">仅
          <input type="number" v-model="number" />
        小时之内</p>
      </div>
      <div class="foot" @click="ShouPup">
        <span>连续警报</span>
        <p>
          <em> {{data}}次</em>
          <span></span>
        </p>
      </div>
    </div>
    </van-dialog>
    <van-popup v-model="show1" position="bottom" :overlay="true">
      <van-picker show-toolbar title="" :columns="columns" @cancel="onCancel" @confirm="onConfirm" @change="onChange" />
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue';
import { Switch } from 'vant';

import { Popup } from 'vant';
import { Picker } from 'vant';
Vue.use(Popup);
Vue.use(Picker);
Vue.use(Switch)
import { Dialog } from 'vant';
	export default {
	    name:'Dialog',
      components: {
          [Dialog.Component.name]: Dialog.Component // ERROR: Property 'name' is a static member of type 'VanComponent'
        },
	    data() {
	        return {
              show: true,
              show1: false,
              checked:true,
              data:'3',
              number:'23',
              columns:['1','2','3','4','5','6','7','8','9','10',]
	        }
	    },
	    methods:{
          onChange(picker,value,index){

          },
          onCancel(picker,value,index){
            console.log('您点击了取消'+value,picker)
            this.data = picker;
            this.show1 = false
          },
          onConfirm(picker,value,index){
            console.log('您点击了确定'+value,picker);
            this.data = picker;
            this.show1 = false
          },
          ShouPup(){
            this.show1 = true
          },
          confirmOn(){
            console.log("我点击了外层确定按钮")
          },
          cancelOn(){
            console.log("我点击了外层取消按钮")
          },
      }
	}
</script>

<style scoped="" lang="less">
  @r : 1rem/37.5;
	.dialog{
		// height: 100%;
		// width: 100%;
    display: flex;
    flex-direction: column;
		background-color: transparent;
	}
  .prohibit{//禁止点击
    pointer-events: none;
    // cursor:no-drop
    cursor:not-allowed
  }
  .box{
    height:130px;
    width: 100%;
    // background: #cecece;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .top{
    height: 48px;
    width: 90%;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
    font-size: 12px;
    p{
      height: 100%;
      width: 140px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      input{
        width:40px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border: none;
        font-size: 18px;
      }
    }
  }
  .foot{
    height: 70px;
    width: 100%;
    border-bottom: 1px solid #d9d9d9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
      height: 100%;
      width: 88px;
      display: flex;
      justify-content: center;
      align-items: center;
    };
    p{
      width: 72px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #558be8;
      span{
        display: block;
        height: 10px;
        width: 10px;
        background: url(../../static/image/icon_06@2x.png.png) no-repeat center;
        background-size: 100% 80%;
      };
      em{
        height:100%;
        width: 42px;
        font-style: normal;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    };

  }
</style>
<style>
  .van-hairline--left::after{
    border-left-width: 2px;
    border-color: #d9d9d9;
  }
</style>
