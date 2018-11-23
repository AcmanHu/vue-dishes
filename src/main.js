import Vue from 'vue'
import App from './App.vue'
//数据请求配置
import VueResource from 'vue-resource'
Vue.use(VueResource);
//vue-socket.io 的使用步骤
/**
 * 1、安装
 * 2、引入 
 * 3、vue实例定义socket
 */

 //获取url 传过来的桌号
 import storage from './model/storage.js'
 var roomid = window.location.hash.split('=')[1];
 storage.set('roomid',roomid);
//  console.log(window.location.hash.split('=')[1]);
import VueSocketio from 'vue-socket.io'
Vue.use(VueSocketio,'http://a.itying.com?roomid='+roomid);


// 配置路由
import VueRouter from 'vue-router'
Vue.use(VueRouter);
//引入模板

import Cart from './components/Cart.vue'
import Home from './components/Home.vue'
import Hot from './components/Hot.vue'
import Order from './components/Order.vue'
import Pcontent from './components/Pcontent.vue'
import Search from './components/Search.vue'
import Start from './components/Start.vue'
import StartAmendData from './components/StartAmendData.vue'

//配置路由
const routes= [
  {path:'*',redirect:'/start'},
  {path:'/cart',component:Cart},
  {path:'/home',component:Home},
  {path:'/hot',component:Hot},
  {path:'/order',component:Order},
  {path:'/pcontent',component:Pcontent},
  {path:'/search',component:Search},
  {path:'/start',component:Start},
  {path:'/startamenddata',component:StartAmendData},
]
//路由实例化

const router = new VueRouter({
  routes
})
//挂在路由
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
