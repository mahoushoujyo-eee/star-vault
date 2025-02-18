import {createRouter, createWebHashHistory} from "vue-router";

const router = createRouter(
    {

    history:createWebHashHistory(),
    routes:
        [
            {path:"/", redirect:"/home"},
            {path:"/home",component:() => import("./components/main/Main.vue")},
            {path:"/account",component:() => import("./components/account/Account.vue")},
            {path:"/person",component:() => import("./components/Person.vue")},
        ]
})

export default router;