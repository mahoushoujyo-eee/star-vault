<script setup>
import {reactive, ref} from 'vue'
import axios from "axios";
import Cookies from "js-cookie";
import Upload from "../file/Upload.vue";
import PrimaryDirectory from "../file/PrimaryDirectory.vue";

const path = ref([])
const parentId = ref(-1)
const search = ref('')
const fileList = ref([])
const inputType = ref('')
const editId = ref()
const tableEmptyText = ref('数据加载中')

const ifShowPrimaryDirectory = ref(false)
const initialize = async () =>
{
  await getRootDirectory()
  await initializeDirectory()
}

const getRootDirectory = async () =>
{
  const res = await axios.get(`api/directory/root/${Cookies.get('userId')}`)
  path.value = []
  path.value.push({name:res.data.data.name, id:res.data.data.id})

  parentId.value = res.data.data.id
}

const initializeDirectory = async () =>
{
  console.log('initialize')
  tableEmptyText.value = '数据加载中'
  fileList.value = []
  const res = await axios.post(`/api/directory/initialize`, {userId:Cookies.get('userId'),parentId: parentId.value}, {headers: {'Content-Type': 'application/json'}})
  res.data.data.forEach(el=>
  {
      fileList.value.push({name:el.name, type:el.type, id:el.id, url:el.url})
  })
  tableEmptyText.value = '暂无任何文件'
}

const submitUpload = () =>
{
  initializeDirectory()
}

const shiftPrimaryDirectory = () =>
{
  inputType.value = 'create'
  ifShowPrimaryDirectory.value = !ifShowPrimaryDirectory.value
}

const deleteDirectoryOrFile = (data) =>
{
  console.log({id:data.id, userId:Cookies.get('userId'), name:data.name})
  if(data.type === '文件夹')
  {
    axios.post(`/api/directory/delete`, {id:data.id, userId:Cookies.get('userId'), name:data.name}, {headers: {'Content-Type': 'application/json'}}).then(res=>
    {
      console.log(res)
      if(res.status === 200)
      {
        if(res.data.code === 0)
          fileList.value = fileList.value.filter(el=>!(el.id === data.id && el.type === '文件夹'))
        else
          alert(res.data.message)
      }
    })
  }
  else if (data.type === '文件')
  {
    axios.post('api/file/delete', {userId:Cookies.get('userId'), id:data.id, name:data.name}, {headers: {'Content-Type': 'application/json'}}).then(res=>
    {
      console.log(res)
      if(res.status === 200)
      {
        fileList.value = fileList.value.filter(el=>!(el.id === data.id && el.type === '文件'))
      }
    })
  }

}

const renameDirectory = (data) =>
{
  if(editId.value === data.id && data.type === '文件夹')
  {
    editId.value = null
    axios.post(`/api/directory/rename`, {userId:Cookies.get('userId'), id:data.id, name:data.name}, {headers: {'Content-Type': 'application/json'}}).then(res=>
    {
      console.log(res)
      if(res.status === 200)
      {
        fileList.value = fileList.value.map(el=>
        {
          if(el.id === data.id)
          {
            el.name = data.name
          }
          return el
        })
      }
    })
  }
  else
  {
    editId.value = data.id
  }
}

const createDirectory = (directory) =>
{
  postCreateDirectoryData(directory.name).then(res=>
  {
    console.log(res)
    fileList.value.push(Object.assign(directory, {type:'文件夹', id:res.data.data.id}))
    ifShowPrimaryDirectory.value = false
  })
}

const postCreateDirectoryData = (directoryName) =>
{
  const directoryData = reactive(
      {
        name:directoryName,
        parentId:parentId.value,
        userId:Cookies.get('userId')
      }
  )
  console.log("directoryData:", directoryData)

  return axios.post('api/directory/create', directoryData, {headers: {'Content-Type': 'application/json'}})
}

const openForwardFile = async (row) =>
{
  console.log(row)
  if (row.type === '文件夹')
  {
    parentId.value = row.id
    path.value.push({name:row.name, id:row.id})
    await initializeDirectory()
  }
  else if (row.type === '文件')
  {
    const res = await axios.post(`api/file/download`, {id:row.id, name:row.name, userId:Cookies.get('userId')})
    window.open(res.data.data.url)
  }
}

const openBackFile = (directory) =>
{
  parentId.value = directory.id
  const tempPathList = []
  for (let i = 0; i < path.value.length; i++)
  {
    if (path.value[i].id === directory.id)
    {
      tempPathList.push(path.value[i])
      break
    }
    else
    {
      tempPathList.push(path.value[i])
    }
  }
  path.value = tempPathList

  initializeDirectory()
}

window.onload = initialize()
</script>

<template>
        <el-row style="padding: 10px; background:#b2e4ff">
          <el-button type="primary" @click="shiftPrimaryDirectory" plain>新建目录</el-button>
          <Upload @submit="submitUpload" :parentId="parentId" style="margin-left: 10px">上传文件</Upload>
        </el-row>
        <el-row>
          <span style="margin: 10px; font-size: 15px; color: #247983">当前路径:
            <span v-for="item in path" class="span-hover" @click="openBackFile(item)">{{item.name}}/</span>
          </span>
        </el-row>
        <el-scrollbar>
          <PrimaryDirectory :type="inputType" v-if="ifShowPrimaryDirectory" @give-up="shiftPrimaryDirectory" @createDirectory="createDirectory"></PrimaryDirectory>
          <el-table @row-click.self="openForwardFile" :empty-text="tableEmptyText" :data="fileList.filter(data => data.name.includes(search))" style="width: 100%" :show-overflow-tooltip="true">
            <el-table-column prop="name" label="文件名" width="300">
              <template #default="scope">
                <img src="/image/directory.png" style="height: 30px; margin-bottom: -10px" v-if="scope.row.type === '文件夹'">
                <img src="/image/file.png" style="height: 30px; margin-bottom: -10px" v-if="scope.row.type === '文件'">
                <span :ref="scope.row.name" v-if="scope.row.type === '文件' || editId !== scope.row.id">
                  {{scope.row.name}}
                </span>
                <el-input @click.stop="" v-model="scope.row.name" v-if="editId === scope.row.id && scope.row.type === '文件夹'" size="default" style="width: 200px" />
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="100"></el-table-column>
            <el-table-column label="操作">
              <template #header>
                <el-input v-model="search" size="big" style="width: 500px" placeholder="输入信息搜索文件名" />
              </template>
              <template #default="scope">
                <el-button type="primary" @click.stop="deleteDirectoryOrFile(scope.row)" plain>删除</el-button>
                <el-button type="primary" v-if="scope.row.type === '文件夹'" @click.stop="renameDirectory(scope.row)" :class="{isEditing:scope.row.id === editId}" plain>{{scope.row.id === editId ? '完成' :'重命名'}}</el-button>
                <el-button type="primary" v-if="scope.row.type === '文件'" class="isFile" plain>下载</el-button>
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

.isEditing
{
  background-color: rgba(124, 218, 188, 0.78);
}

.isFile
{
  width: 75px;
}

</style>