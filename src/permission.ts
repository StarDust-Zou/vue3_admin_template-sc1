//路由鉴权
import router from '@/router'
import setting from './setting'
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'

//获取用户相关的小仓库内部token数据，判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'
import useStore from 'element-plus/es/components/table/src/store'
let userStore = useUserStore(pinia)

//全局守卫:项目当中任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title} + ${to.meta.title}`
  //访问某一个路由之前守卫
  nprogress.start()
  //获取token,去判断用户登录与否
  let token = userStore.token
  //获取用户名字
  let username = userStore.username
  //用户登录
  if (token) {
    //登录成功，访问login，不能访问，指向首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      //登录成功访问其余六个路由
      //有用户信息
      if (username) {
        //放行
        next()
      } else {
        //如果没有用户信息，在守卫这里发请求获取到了再放行
        try {
          //获取用户信息
          await userStore.userInfo()
          next()
        } catch (error) {
          //token过期:获取不到token了
          //手动修改本地存储token
          //退出登录->用户相关的数据清空
          await userStore.userLogout()
          next({ path: '/login' })
        }
      }
    }
  } else {
    //用户未登录
    if (to.path == '/login') {
      next()
    } else {
      next({ path: 'login', query: { redirect: to.path } })
    }
  }
})
//全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})

//任意路由切换实现进度条业务 --nprogress
//路由鉴权(路由组件访问权限设置)
// 全部的路由组件:登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)

//用户未登录：可以访问login，其余六个路由不能访问(指向login)
//用户登录成功：不可以访问login
