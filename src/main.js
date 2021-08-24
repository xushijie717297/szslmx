// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../static/appback'
Vue.config.productionTip = false
//全局引入echarts
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts
import $ from 'jquery'

import '@/assets/css/base.css'

import VueAwesomeSwiper from 'vue-awesome-swiper'
// import style
import 'swiper/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default options with global component } */)
//滑动
import VueTouch from "vue-touch";
Vue.use(VueTouch, {name: "v-touch"});
//调试工具
import Vconsole from 'vconsole';
new Vconsole();

Vue.prototype.getTime = function (timestamp){
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate()+1 < 10 ? '0' + (date.getDate()+1) : date.getDate()+1);
    var h = date.getHours();
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return h;
}
// import axios from 'axios'
// Vue.prototype.$axios = axios
// //将axios挂载到vue全局
import api from './axios/api'
Vue.prototype.api= api; // 将api挂载到vue的原型上
/* eslint-disable no-new */
router.beforeEach((to,from,next)=>{
 if(to.matched.some((res) => res.meta.requireAuth)){  //需要登录权限进入的路由
  let token = localStorage.getItem('tokenn')
  console.log('%c XSJ-[ token ]->', 'font-size:13px; background:pink; color:#bf2c9f;', token)
   if(!token){  //取不到登录信息
    next({
        path: '/login',
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
    })
   }else{  //取得到登录信息，进行下一步
    next();
   }
 }else{  //不需要登录权限
  next();
 }
})
import moment from 'moment'
Vue.prototype.$moment = moment
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
