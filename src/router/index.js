import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
//404
import error from '@/views/404/error'
import home from '@/views/home/home'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
	return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path:'/error',
      name:'error',
      component:error
    },
    {
      path:'/',
      name:'menu',
      redirect: "/home",
      component: resolve => require(['@/views/menu/menu'],resolve),
      children:[
        {
          path:'/home',
          name:'home',
          component: home,
          meta:{requireAuth:true}
        },
        {
          path:'/category',
          name:'category',
          component: resolve => require(['@/views/category/category'],resolve),
        },
        {
          path:'/profile',
          name:'profile',
          component: resolve => require(['@/views/profile/profile'],resolve),
          meta:{requireAuth:true}
        },
        {
          path:'/shopcart',
          name:'shopcart',
          component: resolve => require(['@/views/shopcart/shopcart'],resolve),
        },
        {
          path:'/programme',
          name:'programme',
          component: resolve => require(['@/views/programme/programme'],resolve),
          meta:{requireAuth:true}
        },
      ]
    },
    {
      path:'/news',
      name:'news',
      component: resolve => require(['@/views/cell/new'],resolve),
    },
    {
      path:'/police',
      name:'police',
      component: resolve => require(['@/views/cell/police'],resolve),
    },
    {
      path:'/configure',
      name:'configure',
      component: resolve => require(['@/views/cell/configure'],resolve),
    },
    {
      path:'/programmeDetail',
      name:'programmeDetail',
      component: resolve => require(['@/views/programme/programmeDetail'],resolve),
    },
    {
      path:'/login',
      name:'login',
      component: resolve => require(['@/views/login/login'],resolve),
    },   
    {
      path:'/warn',
      name:'warn',
      component: resolve => require(['@/views/warn/warn'],resolve),
    },
    {
      path:'/intelligence',
      name:'Intelligence',
      component: resolve => require(['@/views/intelligence/intelligence'],resolve),
    },
    {
      path:'/tubeBurst',
      name:'tubeBurst',
      component: resolve => require(['@/views/tubeBurst/tubeBurst'],resolve),
    },
    {
      path:'/Direction',
      name:'Direction',
      component: resolve => require(['@/views/warn/Direction'],resolve),
    },
    {
      path:'/BasicsPipe',
      name:'BasicsPipe',
      component: resolve => require(['@/views/warn/BasicsPipe'],resolve),
    }, 
    {
      path:'/Analysis',
      name:'Analysis',
      component: resolve => require(['@/views/Analysis/Analysis'],resolve),
    },
    {
      path:'/WaterQuality',
      name:'WaterQuality',
      component: resolve => require(['@/views/WaterQuality/WaterQuality'],resolve),
    },
    {
      path:'/water',
      name:'water',
      component: resolve => require(['@/views/Waters/Waters'],resolve),
    },
    {
      path:'/region',
      name:'region',
      component: resolve => require(['@/views/Region/Region'],resolve),
    },
    {
      path:'/vartical',
      name:'vartical',
      component: resolve => require(['@/components/vartical'],resolve),
    },
  ]
})
