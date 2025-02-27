<script setup>
import { ref, watch } from 'vue'
const ifShow = ref(false)
const emit = defineEmits(['giveUp', 'createDirectory', 'renameDirectory'])
const giveUp = () =>
{
  emit('giveUp')
}

const props = defineProps(
    {
      type:String
    })

const fileName = ref('')

const confirm = () =>
{
  if(props.type === '')
    return;

  if(props.type === 'rename')
  {

  }
  else if(props.type === 'create')
  {
    if (fileName.value === '')
    {
      alert('文件名不能为空')
      return
    }
    const data =
        {
          name: fileName.value,
          type: '文件夹'
        }
    emit('createDirectory', data)
  }
}

</script>

<template>
<el-input placeholder="请输入文件名" v-model="fileName" style="width: 260px; margin-left: 15px"></el-input>
  <el-button type="primary" style="margin-left: 10px" @click="confirm">确定</el-button>
  <el-button type="primary" style="margin-left: 10px" @click="giveUp">取消</el-button>
</template>

<style scoped>

</style>