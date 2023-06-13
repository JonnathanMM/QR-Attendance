import { createRouter, createWebHistory } from "vue-router";
 
import dashboard from '../pages/main/dashboard'
import employees from '../pages/employees'
import settings from '../pages/settings'
import scanner from '../pages/scanner'
import attendance from '../pages/attendance'


const routes = [
  {
    name: 'Dashboard',
    path: '/',
    component: dashboard,
    children: [
       {
        name: 'employees',
        path: '/employees',
        component:employees
      },
      {
        name: 'scanner',
        path: '/scanner',
        component:scanner
      },
      {
        name: 'attendance',
        path: '/attendance',
        component:attendance
      },
      {
        name: 'settings',
        path: '/settings',
        component:settings
      }
    ]
  },
     
];
const router = Router();
export default router;
function Router() {
    const router = new createRouter({
        history: createWebHistory(),
        routes,
    });
    return router;
}