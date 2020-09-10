import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/reset.css'
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
//导入axios数据请求
import axios from 'axios'
// 将axios挂载到Vue原型上
Vue.prototype.$http = axios
// 设置axios根路径，后端提供API接口(配置请求的根路径)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios请求拦截器 为登录后的每次请求挂载Authorization 这样有权限的API才可以成功调用
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //最后必须return config
  return config
})



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
