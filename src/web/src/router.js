import Vue from "vue";
import VueRouter from "vue-router";

import homeRoutes from "@/modules/home/router";
import authenticationRoutes from "@/modules/authentication/router";
import administrationRoutes from "@/modules/administration/router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("@/views/Default.vue"),
  },

  ...homeRoutes,
  ...authenticationRoutes,
  ...administrationRoutes,

  {
    path: "*",
    name: "Not Found",
    component: () => import("@/views/NotFound.vue"),
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

import { getInstance } from "@/auth/auth0-plugin";
let authService;

router.beforeEach(async (to, from, next) => {
  var requiresAuth = to.meta.requiresAuth || false;

  if (!requiresAuth) {
    return next();
  }

  if (!authService) {
    authService = await getInstance();
  }

  const guardAction = () => {
    if (authService.isAuthenticated) {
      return next();
    }

    authService.loginWithRedirect({ appState: { targetUrl: to.fullPath } });
  };

  // If the Auth0Plugin has loaded already, check the authentication state
  if (!authService.isLoading) {
    return guardAction();
  }

  authService.$watch('isLoading', (isLoading) => {
    if (isLoading === false) {
      return guardAction();
    }
  });



  /*   let i = window.setInterval(async () => {
      if (authService.isLoading === false) {
        window.clearInterval(i);

        next(await kick());
      }
    }, 100); */
});
/*
async function kick() {
  if (!authService) {
    authService = await getInstance();
  }

  const accessToken = await authService.getTokenSilently();

  let user = await store.dispatch("getCurrentUser", { accessToken });

  //Disabled because this breaks things -
  //@MJ what is the purpose inactive check?

  // if (user && user.status == "Inactive")
  // return "inactive";

  return;
} */
export default router;
