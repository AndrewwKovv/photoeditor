import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomePage from "../pages/home.vue";
import HBPage from "../pages/HBPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/gnsldkfgadf32lmHB20",
    name: "hb",
    component: HBPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
