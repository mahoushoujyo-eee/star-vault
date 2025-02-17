import {createRouter, createWebHashHistory} from "vue-router";

const router = createRouter(
    {

    history:createWebHashHistory(),
    routes:
        [
            {path:"/", redirect:"/home"},
            {path:"/home",component:() => import("./components/main/Main.vue")},
            {path:"/account",component:() => import("./components/account/Account.vue")},
        ]
})

export default router;