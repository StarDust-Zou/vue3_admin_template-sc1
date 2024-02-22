//商品分类全局组件的小仓库
import { defineStore } from 'pinia'
import { reqC1 } from '@/api/product/attr'
let useCategoryStore = defineStore('Category', {
  state: () => {
    return {
      //存储一级分类的数据
      c1Arr: [],
      //存储一级分类的ID
      c1Id: '',
    }
  },
  actions: {
    //获取一级分类的方法
    async getC1() {
      let result: any = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },
  },
  getters: {},
})
export default useCategoryStore
