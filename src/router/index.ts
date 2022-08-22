import { createRouter, createWebHashHistory, Router } from "vue-router";

export const routes = [
  {
    path: "/profile",
    name: "profile",
    component: () => import("@views/profile/index.vue"),
  },
  { path: "/", redirect: "profile" },
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
