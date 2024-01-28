//路由鉴权
import router from '@/router'
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
//全局守卫:项目当中任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach((to: any, from: any, next: any) => {
  //访问某一个路由之前守卫
  nprogress.start()
  next()
})
//全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})

//任意路由切换实现进度条业务 --nprogress
