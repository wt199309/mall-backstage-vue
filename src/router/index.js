import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from'../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
Vue.use(VueRouter)

  const routes = [
    //登录组件
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  //首页跳转到登录组件,定向路由
  {
    path: '/',
    //定向到某地址
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    // 子路径
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行    next('/login') 强制跳转
  // 判断用户是否访问的是登录页如果是直接放行
  if(to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  //判断有无token无则强制跳转到登录页
  if(!tokenStr) return next('/login');
  next();
})


export default router
