import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
const Dashboard = () => import(/* webpackChunkName: "dashboard" */"@/pages/Dashboard.vue");
const Navigation = () => import(/* webpackChunkName: "common" */ "@/pages/Navigation.vue");
const Conifguration = () => import(/* webpackChunkName: "common" */"@/pages/Configuration.vue");
const Teleop = () => import(/* webpackChunkName: "common" */ "@/pages/Teleop.vue");
const Debug = () => import(/* webpackChunkName: "common" */ "@/pages/Debug.vue");
const Connection = () => import(/* webpackChunkName: "common" */ "@/pages/Connection.vue");

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: "navigation",
        name: "navigation",
        component: Navigation
      },
      {
        path: "config",
        name: "config",
        component: Conifguration
      },
      {
        path: "teleop",
        name: "teleop",
        component: Teleop
      },
      {
        path: "debug",
        name: "debug",
        component: Debug
      },
      {
        path: "connection",
        name: "connection",
        component: Connection
      },
    ]
  },
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
