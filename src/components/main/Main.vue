<template>
  <el-container class="layout-container-demo" style="height: 98vh">
    <el-aside style="width: 200px; border-right: 1px silver solid">
      <el-scrollbar>
        <el-menu :default-openeds="[]">
          <el-sub-menu index="1">
            <template #title>
              <el-icon><messageBox /></el-icon><span @click="changeComponent('cloud')">云文件目录</span>
            </template>
              <el-menu-item index="1-1">Option 1</el-menu-item>
              <el-menu-item index="1-2">Option 2</el-menu-item>
              <el-menu-item index="1-3">Option 3</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><icon-menu /></el-icon><span @click="changeComponent('history')">版本管理</span>
            </template>
            <el-menu-item-group>
              <template #title>Group 1</template>
              <el-menu-item index="2-1">Option 1</el-menu-item>
              <el-menu-item index="2-2">Option 2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group 2">
              <el-menu-item index="2-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="2-4">
              <template #title>Option 4</template>
              <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon style="transform: rotate(-90deg)"><upAndDown /></el-icon><span @click="changeComponent('upAndDown')">上传\下载</span>
            </template>
            <el-menu-item-group>
              <template #title>Group 1</template>
              <el-menu-item index="3-1">Option 1</el-menu-item>
              <el-menu-item index="3-2">Option 2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group 2">
              <el-menu-item index="3-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="3-4">
              <template #title>Option 4</template>
              <el-menu-item index="3-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 15px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px; font-size: 20px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人主页</el-dropdown-item>
                <el-dropdown-item @click="logOut">登出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>{{ username }}</span>
        </div>
      </el-header>

      <el-main>
        <component :is="mainComponent"></component>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { Menu as IconMenu, Message, Setting, MessageBox, Switch as upAndDown } from '@element-plus/icons-vue'
import router from "../../router.js";
import Directory from "./Directory.vue";
import History from "./History.vue";
import Switch from "./Switch.vue";
import Cookies from "js-cookie";
import axios from "axios";

const mainComponent = ref(Directory)

const username = ref(Cookies.get('username'))

const changeComponent = (label) =>
{
  if(label === 'cloud')
  {
    mainComponent.value = Directory
  }
  else if(label === 'history')
  {
    mainComponent.value = History
  }
  else if(label === 'upAndDown')
  {
    mainComponent.value = Switch
  }
}

const logOut = () =>
{
  Cookies.remove('userId')
  Cookies.remove('username')
  router.push('/account')
}

</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
