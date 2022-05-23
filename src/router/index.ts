import { inject, computed } from 'vue';
import { createRouter, createWebHashHistory, _RouteRecordBase, RouteLocationRaw, useRoute, useRouter } from 'vue-router';
import PrinteDesign from 'views/print-design/print-design.vue';

// let modules = import.meta.globEager('../views/**/!(components|component)/*.vue');
// modules = Object.entries(modules).reduce((prev: Record<string, any>, [k, val]) => {
//   prev[k.split('/').pop()!.split('.').shift()!] = val;
//   return prev;
// }, {});

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: PrinteDesign
    }
  ]
});

export default router;

export * from 'vue-router';
