<script setup>
import {ref} from "vue";
import Login from "./Login.vue";
import Register from "./Register.vue";
import SetPassword from "./SetPassword.vue";

const component = ref(Login)
const label = ref('登录界面')

const changeComponent = (anotherComponent) =>
{
    if(anotherComponent === 'login')
    {
      component.value = Login
      label.value = '登录界面'
    }
    else if(anotherComponent === 'register')
    {
      component.value = Register
      label.value = '注册界面'
    }
    else if(anotherComponent === 'setPassword')
    {
      component.value = SetPassword
      label.value = '重置密码界面'
    }

}
</script>

<template>
<div style="
background-image: url('../../../public/image/background.jpg');
height: 98vh;
background-attachment: fixed;
background-size: cover;
background-repeat: no-repeat;
">
  <span>&nbsp</span>
  <div style="display: flex; align-self: center; justify-self: center; margin-top: 180px">
    <span class="iconfont icon-16gl-S font-size"></span>
    <span class="iconfont icon-16gl-T font-size"></span>
    <span class="iconfont icon-16gl-A font-size"></span>
    <span class="iconfont icon-16gl-R font-size"></span>
    <span class="iconfont icon-16gl-V font-size"></span>
    <span class="iconfont icon-16gl-A font-size"></span>
    <span class="iconfont icon-16gl-U font-size"></span>
    <span class="iconfont icon-16gl-L font-size"></span>
    <span class="iconfont icon-16gl-T font-size"></span>
  </div>
  <span style="display: flex; align-self: center; justify-self: center; margin-top: 20px">{{label}}</span>
  <component :is="component"
           @changeComponent="changeComponent"
           style="display: flex; justify-self: center; flex-direction: column; margin-top: 20px; width: 400px;">
  </component>
</div>
</template>

<style scoped>
.font-size
{
  font-size: 35px;
}
</style>