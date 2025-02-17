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
    <el-form-item label="邮箱" prop="email" style="color: black">
      <el-input v-model="ruleForm.email" />
    </el-form-item>
    <el-form-item label="密码" prop="pass">
      <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item style="display: flex; align-self: center">
      <el-button type="primary" @click="submitForm(ruleFormRef)" style="">
        登录
      </el-button>
      <el-button @click="toRegister()">注册</el-button>
      <el-button @click="toSetPassword()">重置密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, defineEmits } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import axios from "axios";
import router from '/src/router.js'
import Cookies from 'js-cookie'

const ruleFormRef = ref<FormInstance>()

const emit = defineEmits(['changeComponent'])

const toRegister = () =>
{
  emit('changeComponent', 'register')
}

const toSetPassword = () =>
{
  emit('changeComponent', 'setPassword')
}

const checkEmail = (rule: any, value: any, callback: any) =>
{
  if (value === '')
  {
    return callback(new Error('请输入邮箱'))
  }
  else
  {
    callback()
  }

}

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '')
  {
    callback(new Error('请输入密码'))
  }
  else
  {
    if (ruleForm.checkPass !== '')
    {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass')
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) =>
{
  if (value === '')
  {
    callback(new Error('Please input the password again'))
  }
  else if (value !== ruleForm.pass)
  {
    callback(new Error("Two inputs don't match!"))
  }
  else
  {
    callback()
  }
}

const ruleForm = reactive({
  pass: '',
  checkPass: '',
  email: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  email: [{ validator: checkEmail,type: 'email',message: '请输入正确的邮箱', trigger: 'blur' }],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) =>
  {
    if (valid)
    {
      axios.post('/api/user/login',
          {
            email: ruleForm.email,
            password: ruleForm.pass
          })
          .then(res=>
          {
            console.log(res.data)
            if(res.data.code===0)
            {
              router.push('/home')
              Cookies.set('userId',res.data.data.id)
              Cookies.set('username',res.data.data.username)
            }
            else
            {
              alert(res.data.message)
            }
          })
    }
    else
      console.log('error submit!')
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
