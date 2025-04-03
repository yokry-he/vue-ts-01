import { createRouter, createWebHashHistory, Router } from "vue-router";

export const routes = [
  {
    path: "/profile",
    name: "profile",
    component: () => import("@views/profile/index.vue"),
  },
  {
    path: "/async-comp",
    name: "async-comp",
    component: () => import("@views/async-comp/index.vue"),
  },
  {
    path: "/drag-temp",
    name: "drag-temp",
    component: () => import("@comps/drag-temp/index.vue"),
  },
  {
    path: "/free-layout",
    name: "free-layout",
    component: () => import("@comps/free-layout/index.vue"),
  },
  { path: "/", redirect: "/free-layout" },
];

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
