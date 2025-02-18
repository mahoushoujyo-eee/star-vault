<script setup>
import {ref} from 'vue'

const path = ref('总目录/')

</script>

<template>
        <el-row>
          <span style="margin: 10px; font-size: 15px; color: #247983">当前路径: {{path}}</span>
        </el-row>
        <el-scrollbar>
          <el-table>

          </el-table>
        </el-scrollbar>
</template>

<style scoped>

</style>