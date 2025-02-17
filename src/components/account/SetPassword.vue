<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
  >
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="ruleForm.email" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPassword">
      <el-input v-model="ruleForm.checkPassword" type="password" autocomplete="off"/>
    </el-form-item>
    <el-form-item style="display: flex; align-self: center">
      <el-button type="primary" @click="submitForm(ruleFormRef)" style="">
        重置密码
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">清空</el-button>
      <el-button @click="toLogin()">去登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {defineEmits, reactive, ref} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import axios from "axios";

const ruleFormRef = ref<FormInstance>()

const emit = defineEmits(['changeComponent'])

const toLogin = () => {
  emit('changeComponent', 'login')
}

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass')
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== ruleForm.password) {
    callback(new Error("两次输入不匹配！"))
  } else {
    callback()
  }
}

const checkEmail = (rule: any, value: any, callback: any) =>
{
  if (value === '')
  {
    callback(new Error('请输入邮箱'))
  }
  else
  {
    callback()
  }
}

const ruleForm = reactive({
  password: '',
  checkPassword: '',
  email: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  password: [{ validator: validatePass, trigger: 'blur' }],
  checkPassword: [{ validator: validatePass2, trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'], validator:checkEmail}],
})

const submitForm = (formEl: FormInstance | undefined) =>
{
  if (!formEl) return
  formEl.validate((valid) =>
  {
    if (valid)
    {
      axios.post('api/user/reset-password', JSON.stringify(ruleForm), {headers: {'Content-Type': 'application/json'}}).then(res=>
      {
        console.log(res.data)
        if(res.data.code === 0)
        {
          alert(res.data.message)
          toLogin()
        }
        else
        {
          alert(res.data.message)
        }
      })
    }
    else
    {
      console.log('error submit!')
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>