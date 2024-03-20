<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请你输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId" style="width: 240px">
        <el-option
          v-for="(item, index) in AllTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请你输入SPU描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <!-- v-model:filelist->展示默认图片 
      action:上传图片的接口地址
      -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select style="width: 240px">
        <el-option label="华为" value="华为"></el-option>
        <el-option label="oppo" value="oppo"></el-option>
        <el-option label="vivo" value="vivo"></el-option>
      </el-select>
      <el-button type="primary" icon="Plus" style="margin-left: 10px">
        添加属性值
      </el-button>
      <!-- table展示销售属性与属性值 -->
      <el-table border style="margin: 10px 0">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column label="属性名字" width="120px"></el-table-column>
        <el-table-column label="属性值"></el-table-column>
        <el-table-column label="操作" width="120px"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import {
  reqAllSaleAttr,
  reqAllTradeMark,
  reqSpuHasSaleAttr,
  reqSpuImageUrl,
} from '@/api/product/spu'
import {
  AllTradeMark,
  TradeMark,
  HasSaleAttr,
  HasSaleAttrResponseData,
  SaleAttr,
  SaleAttrResponseData,
  SpuData,
  SpuHasImg,
  SpuImage,
} from '@/api/product/spu/type'
import { ElMenu, ElMessage } from 'element-plus'
import { ref } from 'vue'

let $emit = defineEmits(['changeScene'])
//点击取消按钮:通知父组件切换场景为0
const cancel = () => {
  $emit('changeScene', 0)
}
//存储已有的SPU数据
let AllTradeMark = ref<TradeMark[]>([])
//商品图片
let imgList = ref<SpuImage[]>([])
//已有SPU销售属性
let saleAttr = ref<SaleAttr[]>([])
//全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
//控制对话框的显示和隐藏
let dialogVisible = ref<boolean>(false)
//存储预览图片地址
let dialogImageUrl = ref<string>('')
//存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: '', //收集三级分类ID
  spuName: '', //SPU名字
  description: '', //SPU描述
  tmId: '', //品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
})
//子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  //存储已有的SPU对象，将来在模板中展示
  SpuParams.value = spu
  //spu即为父组件传递过来的已有的SPU对象[不完整]
  //获取全部品牌的数据
  let result: AllTradeMark = await reqAllTradeMark()
  //获取某个品牌旗下全部售卖商品图片
  let result1: SpuHasImg = await reqSpuImageUrl(spu.id as number)
  //获取已有SPU销售属性的数据
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  //获取整个项目全部SPU销售属性数据
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()

  //存储全部品牌的数据
  AllTradeMark.value = result.data
  //SPU对应商品图片
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  //存储已有SPU销售属性
  saleAttr.value = result2.data
  //存储全部的销售属性
  allSaleAttr.value = result3.data
}

//照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview = (file: any) => {
  //对话框弹出
  dialogVisible.value = true
  dialogImageUrl.value = file.url
}
/* //照片墙删除文件的钩子
const handleRemove = () => {

} */
//照片墙上传成功之前的钩子，约束文件类型和大小
const handlerUpload = (file: any) => {
  if (
    file.type === 'image/png' ||
    file.type === 'image/jpeg' ||
    file.type === 'image/gif'
  ) {
    //文件大小小于3M
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传的文件需要小于3M',
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的文件务必是PNG|JPG|GIF类型',
    })
  }
}

//对外暴露
defineExpose({ initHasSpuData })
</script>

<style scoped></style>
