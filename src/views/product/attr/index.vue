<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          @click="addAttr"
          type="primary"
          size="default"
          icon="Plus"
          :diabled="categoryStore.c3Id ? false : true"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
                style="margin: 5px"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <!-- row:已有的属性对象 -->
            <template #="{ row, $index }">
              <!-- 修改已有属性的按钮 -->
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.attrName}吗？`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加属性与修改数据的结构 -->
        <el-form inline>
          <el-form-item label="属性名称">
            <el-input
              placeholder="请你输入属性的名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="attrParams.attrName ? false : true"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-table
          border
          style="margin: 10px 0px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row即为当前属性值对象 -->
            <template #="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                v-if="row.flag"
                @blur="toRead(row, $index)"
                size="small"
                placeholder="请你输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)" style="height: 23px">
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
//组合式API函数watch
import { watch, ref, reactive, nextTick, onBeforeMount } from 'vue'
//引入获取已有属性与属性值接口
import { reqAddOrUpdate, reqAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
//获取分类的仓库
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()
//存储已有的属性和属性值
let attrArr = ref<Attr[]>([])
//定义card组件内容切换变量
let scene = ref<number>(0) //scene=0,显示table,scene=1,展示添加与修改属性结构
/* //定义一个响应式数据控制编辑模式与查看模式切换
let flag = ref(true) */
//收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3,
})
//准备一个数组：将来存储对应的组件实例
let inputArr = ref<any>([])
//监听仓库三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    //清空上一次查询的属性与属性值
    attrArr.value = []
    //保证三级分类得有才能发起请求
    if (!categoryStore.c3Id) return
    //获取分类的ID
    getAttr()
  },
)
//获取已有的属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
}
//添加属性按钮的回调
const addAttr = () => {
  //每一次点击的时候，先清空一下数据再收集数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: '',
    categoryLevel: 3,
  })
  //切换为添加与修改属性的结构
  scene.value = 1
  attrParams.categoryId = categoryStore.c3Id
}
//table表格修改已有属性按钮的回调
const updateAttr = (row: Attr) => {
  scene.value = 1
  // 将已有的属性对象复制给AttrParams
  // ES6->Object.assign()进行对象的合并
  //深拷贝
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
//取消按钮的回调
const cancel = () => {
  scene.value = 0
}
//添加属性值按钮的回调
const addAttrValue = () => {
  //点击添加属性值按钮时，向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制每一个属性的显示模式
  })
  //获取最后el-input组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
//保存按钮回调
const save = async () => {
  //发请求
  let result: any = await reqAddOrUpdate(attrParams)
  if (result.code == 200) {
    //切换场景
    scene.value = 0
    //提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    //获取全部已有的属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}
//失焦变为查看模式
const toRead = (row: AttrValue, $index: number) => {
  //非法情况1判断
  if (row.valueName.trim() == '') {
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
  }
  //非法情况2
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
  }
  row.flag = false
}
//聚焦变为编辑模式
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
//删除已有属性回调
const deleteAttr = async (attrId: number) => {
  //发相应的删除已有属性请求
  let result: any = await reqRemoveAttr(attrId)
  //删除成功
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //获取一次已有的属性与属性值
    getAttr()
  } //删除失败
  else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeMount(() => {
  //清空仓库的方法
  categoryStore.$reset()
})
</script>

<style scoped></style>
