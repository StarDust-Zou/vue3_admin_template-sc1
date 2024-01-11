<template>
  <div>
    <h1>SVG测试</h1>
    <!-- 测试SVG图标使用 -->
    <!-- svg:图标外层容器节点，内部需要与use标签结合使用 -->
    <svg :style="{ width, height }">
      <!-- xlink:href执行用哪一个图标,属性值务必#icon-图标名字,use标签fill属性可以设置图标的颜色 -->
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts" name="App">
//接收父组件传递过来的参数
//@ts-ignore
defineProps({
  //xlink:href属性值前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  //提供使用的图标名字
  name: String,
  //接收父组件传递颜色
  color: {
    type: String,
    default: '',
  },
  //接收父组件传递过来的图标的宽度
  width: {
    type: String,
    default: '16px',
  },
  height: {
    type: String,
    default: '16px',
  },
})
</script>

<style scoped></style>
