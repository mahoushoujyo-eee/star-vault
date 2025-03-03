<template>
  <el-upload
      ref="upload"
      class="upload-demo"
      :action="url"
      :limit="1"
      :on-exceed="handleExceed"
      :http-request="uploadFile"
  >
    <template #trigger>
      <el-button type="primary"><slot></slot></el-button>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import Cookies from "js-cookie";
import axios from "axios";

const upload = ref<UploadInstance>()

const props = defineProps({
  parentId:Number
})

const emit = defineEmits(['submit'])

const url = ref(`api/file/upload`)
const extraData = ref({
  name: '',
  userId: Cookies.get('userId'),
  parentId:props.parentId,
  taskId:''
})



const handleExceed: UploadProps['onExceed'] = (files) =>
{
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const submitUpload = () =>
{
  emit('submit', extraData.value)
}

const uploadFile = async (param) =>
{
  extraData.value.name = param.file.name
  extraData.value.parentId = props.parentId

  const chunkSize = 5 * 1024 * 1024;
  const totalChunks = Math.ceil(param.file.size / chunkSize);

  if(param.file.size > 1024 * 1024 * 10)
  {
    const formData = new FormData()

    Object.entries(extraData.value).forEach(([key, value]) =>
    {
      formData.append(key, value.toString());
    });
    const res1 = await axios.post('api/file/upload-chunks-start', formData, {headers: {'Content-Type': 'application/json'}})
    console.log(res1)
    if(res1.status === 200)
    {
      extraData.value.taskId = res1.data.data
    }



    for (let i = 0; i < totalChunks; i++)
    {
      const formData = new FormData()

      Object.entries(extraData.value).forEach(([key, value]) =>
      {
        formData.append(key, value.toString());
      });

      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, param.file.size);
      const chunk = param.file.slice(start, end);
      console.log('chunk size:', chunk.size)
      formData.append('file', chunk);
      formData.append('chunkIndex', i);
      formData.append('totalChunks', totalChunks);

      console.log(formData.get('taskId'))
      const res2 = await axios.post('api/file/upload-chunks', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      console.log(res2)
    }

    console.log(extraData.value)
    const finalFormData = new FormData()

    Object.entries(extraData.value).forEach(([key, value]) =>
    {
      finalFormData.append(key, value.toString());
    });
    const res3 = await axios.post('api/file/upload-chunks-compose', finalFormData, {headers: {'Content-Type': 'multipart/form-data'} })
    console.log(res3)
    if(res3.status === 200)
    {
      submitUpload()
    }
  }
  else
  {
    const formData = new FormData()

    Object.entries(extraData.value).forEach(([key, value]) =>
    {
      formData.append(key, value.toString());
    });

    formData.append('file', param.file)
    axios.post('api/file/upload', formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res=>
    {
      console.log(res)
      if(res.status === 200)
      {
        submitUpload()
      }
    })
  }

}
</script>

