<script setup>
import {reactive, ref} from 'vue'
import axios from "axios";
import Cookies from "js-cookie";

const path = ref('总目录/')
const search = ref('')
const fileList = ref([])

const addDirectoryToUI = () =>
{
  fileList.value.push({
    name: '新建文件夹',
    type: '文件夹',
  })
}

const deleteDirectory = (event) =>
{
  console.log(event.target.parentNode.parentNode.parentNode.parentNode)
  event.target.parentNode.parentNode.parentNode.remove()
}

const renameDirectory = (event) =>
{
  event.target.parentNode.parentNode.parentNode.parentNode.querySelector('input').style.display = 'block'
}

const createDirectory = (directoryName) =>
{

  const directoryData = reactive(
      {
        name:directoryName,
        parentName: path.value.split('/')[-1],
        userId:Cookies.get('userId')
      }
  )

  axios.post('api/directory/create', JSON.stringify({directoryData}), {headers: {'Content-Type': 'application/json'}})
}

</script>

<template>
        <el-row style="padding: 10px; background:#b2e4ff">
          <el-button type="primary" @click="addDirectoryToUI" plain>新建目录</el-button>
          <el-button type="primary" plain>上传文件</el-button>
        </el-row>
        <el-row>
          <span style="margin: 10px; font-size: 15px; color: #247983">当前路径: {{path}}</span>
        </el-row>
        <el-scrollbar>
          <el-table empty-text="没有任何文件" :data="fileList.filter(data => data.name.includes(search))" style="width: 100%">
            <el-table-column prop="name" label="文件名" width="300"></el-table-column>
            <el-table-column prop="type" label="类型" width="100"></el-table-column>
            <el-table-column label="操作">
              <template #header>
                <el-input v-model="search" size="big" style="width: 500px" placeholder="输入信息搜索文件名" />
              </template>
              <template #default="scope">
                <el-button type="primary" plain>下载</el-button>
                <el-button type="primary" @click="deleteDirectory($event)" plain>删除</el-button>
                <el-button type="primary" @click="renameDirectory($event)" plain>重命名</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
</template>

<style scoped>

</style>