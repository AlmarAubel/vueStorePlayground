import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";
import Home from "../views/Home.vue";
import reduxHelper from "/@/reduxDevHelper";
import { defineAsyncComponent } from "vue";

const redux = reduxHelper("router", {} as RouteLocationNormalized);
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about/:msg",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: defineAsyncComponent(() => import("../views/About.vue")),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.afterEach((to, from, failure) => {
  redux.send(to.name?.toString() ?? "", to.fullPath, to);
});

redux.subscribe((to: RouteLocationNormalized) => {
  router.push({
    path: to.path,
    name: to.name ?? undefined,
    params: to.params,
    query: to.query,
  });
});

export default router;
