//引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Category from './Category/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//全局对象
const allGlobalComponent = { SvgIcon, Category }
//对外暴露插件对象
export default {
  //务必叫做install方法
  //@ts-ignore
  install(app) {
    //注册项目全部的全局组件
    Object.keys(allGlobalComponent).forEach((key) => {
      //注册为全局组件
      //@ts-ignore
      app.component(key, allGlobalComponent[key])
    })
    //将element-plus提供图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
