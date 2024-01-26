<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="updateRefresh"
  ></el-button>
  <el-button size="small" icon="FullScreen" circle></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
  <img src="/logo.png" style="width: 24px; height: 24px; margin: 0 10px" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      admin
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
//获取骨架的小仓库
import useLayOutSettingStore from '@/store/modules/setting'
const LayOutSettingStore = useLayOutSettingStore()

const updateRefresh = () => {
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}
</script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped></style>
