<template>
  <el-upload
      ref="upload"
      class="upload-demo"
      :action="url"
      :limit="1"
      :on-exceed="handleExceed"
      :data="extraData"
      :before-upload="setFileName"
      :on-success="submitUpload"
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

const upload = ref<UploadInstance>()

const props = defineProps({
  parentId:Number
})

const emit = defineEmits(['submit'])

const url = ref(`api/file/upload`)
const extraData = ref({
  name: '',
  userId: Cookies.get('userId'),
  parentId:props.parentId
})



const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const submitUpload = () => {
  emit('submit', extraData.value)
}

const setFileName = (file: UploadRawFile) => {
  extraData.value.name = file.name
  extraData.value.parentId = props.parentId
  return true
}
</script>

