<template>
  <el-container class="layout-container-demo" style="height: 98vh">
    <el-aside style="width: 200px; border-right: 1px silver solid">
      <el-scrollbar>
        <el-menu :default-openeds="[]">
          <el-menu-item index="1" @click="changeComponent('cloud')">
            <template #title>
              <el-icon><messageBox /></el-icon><span>云文件目录</span>
            </template>
          </el-menu-item>
          <el-menu-item index="2" @click="changeComponent('history')">
            <template #title>
              <el-icon><icon-menu /></el-icon><span>版本管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="3" @click="changeComponent('upAndDown')">
            <template #title>
              <el-icon style="transform: rotate(-90deg)"><upAndDown /></el-icon><span>上传\下载</span>
            </template>
          </el-menu-item>
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
                <el-dropdown-item @click="router.push('/person')">个人主页</el-dropdown-item>
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
import Upload from "../file/Upload.vue";
import Cookies from "js-cookie";
import axios from "axios";

const mainComponent = ref(Directory)

const username = ref(Cookies.get('username'))

const componentLabel = ref('cloud')

if(username.value === undefined)
{
  router.push('/account')
}

const changeComponent = (label) =>
{
  componentLabel.value = label
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

const uploadFile = () =>
{

}

const createDirectory = () =>
{

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
