import { createApp } from 'vue'
import App from './App.vue'

import {createPinia} from "pinia";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '/public/font-icon/iconfont.css'
import router from "./router.js";

const pinia = createPinia();

createApp(App).use(pinia).use(router).use(ElementPlus).mount('#app')
