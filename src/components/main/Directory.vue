<script setup>
import {reactive, ref} from 'vue'
import axios from "axios";
import Cookies from "js-cookie";
import Upload from "../file/Upload.vue";
import PrimaryDirectory from "../file/PrimaryDirectory.vue";

const path = ref(['总目录'])
const search = ref('')
const fileList = ref([])

const ifShowPrimaryDirectory = ref(false)
const initialize = () =>
{
  initializeDirectory()
}

const initializeDirectory = () =>
{
  fileList.value = []
  axios.post(`/api/directory/initialize`, {userId:Cookies.get('userId'), parentName:path.value[path.value.length-1]}, {headers: {'Content-Type': 'application/json'}}).then(res=>
  {
    res.data.data.forEach(el=>
    {
      fileList.value.push({name:el.name, type:'文件夹'})
    })
  })
}

const shiftPrimaryDirectory = () =>
{
  ifShowPrimaryDirectory.value = !ifShowPrimaryDirectory.value
}

const deleteDirectory = (event) =>
{
  console.log((event.target.parentNode.parentNode.parentNode.querySelector('span').innerText))
  axios.post(`/api/directory/delete`, {userId:Cookies.get('userId'), parentName:path.value[path.value.length-1], name:event.target.parentNode.parentNode.parentNode.querySelector('span').innerText}, {headers: {'Content-Type': 'application/json'}}).then(res=>
  {
    console.log(res)
  })
}

const renameDirectory = (event) =>
{
  event.target.parentNode.parentNode.parentNode.parentNode.querySelector('input').style.display = 'block'
}

const createDirectory = (directory) =>
{
  postCreateDirectoryData(directory.name).then(res=>
  {
    console.log((res))
    fileList.value.push(directory)
    ifShowPrimaryDirectory.value = false
  })
}

const postCreateDirectoryData = (directoryName) =>
{
  const directoryData = reactive(
      {
        name:directoryName,
        parentName: path.value[path.value.length-1],
        userId:Cookies.get('userId')
      }
  )
  console.log()
  console.log(directoryData)

  return axios.post('api/directory/create', JSON.stringify(directoryData), {headers: {'Content-Type': 'application/json'}})
}

const openForwardFile = (row) =>
{
  if (row.type === '文件夹')
  {
    path.value.push(row.name)
    initializeDirectory()
  }
  else
  {
    window.open(`/api/file/download/${row.name}`)
  }
}

const openBackFile = (directoryName) =>
{
  console.log(directoryName)
  let flag = true
  path.value = path.value.filter(el=>
  {
    if(el === directoryName)
    {
      flag = false
      return true
    }
    return flag
  })

  initializeDirectory()
}

window.onload = initialize()
</script>

<template>
        <el-row style="padding: 10px; background:#b2e4ff">
          <el-button type="primary" @click="shiftPrimaryDirectory" plain>新建目录</el-button>
          <Upload style="margin-left: 10px">上传文件</Upload>
        </el-row>
        <el-row>
          <span style="margin: 10px; font-size: 15px; color: #247983">当前路径:
            <span v-for="item in path" class="span-hover" @click="openBackFile(item)">{{item}}/</span>
          </span>
        </el-row>
        <el-scrollbar>
          <PrimaryDirectory v-if="ifShowPrimaryDirectory" @give-up="shiftPrimaryDirectory" @createDirectory="createDirectory"></PrimaryDirectory>
          <el-table @row-click.self="openForwardFile" empty-text="没有任何文件" :data="fileList.filter(data => data.name.includes(search))" style="width: 100%">
            <el-table-column prop="name" label="文件名" width="300"></el-table-column>
            <el-table-column prop="type" label="类型" width="100"></el-table-column>
            <el-table-column label="操作">
              <template #header>
                <el-input v-model="search" size="big" style="width: 500px" placeholder="输入信息搜索文件名" />
              </template>
              <template #default="scope">
                <el-button type="primary" plain>下载</el-button>
                <el-button type="primary" @click.stop="deleteDirectory($event)" plain>删除</el-button>
                <el-button type="primary" @click.stop="renameDirectory($event)" plain>重命名</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
</template>

<style scoped>
.span-hover:hover
{
  color: #203030;
  cursor: pointer;
}
</style>