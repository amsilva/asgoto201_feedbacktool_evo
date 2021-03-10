import Vue from "vue";
import VueRouter from "vue-router";
import PublicRoutes from "@/router/public";
import SystemRoutes from "@/router/system";
import store from "@/store";

Vue.use(VueRouter);
const routes = Array.prototype.concat(PublicRoutes, SystemRoutes);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes /*: PublicRoutes*/
});

router.beforeEach((to, from, next) => {
  // let restrict = to.meta.restrict;
  let load = setInterval(() => {
    if (store.getters.done) {
      clearInterval(load);
      if (store.getters.userAuth && store.getters.id) {
        if (to.name == "SignUp" || to.name == "Login")
          next({ name: "DashboardProfile" });
        else next();
      } else {
        if (to.meta.restrict) next({ name: "Login" });
        else next();
      }
      // // console.log(to, restrict);
      next();
    }
  });
  // if (store.getters.done) {
  //   console.log(restrict);
  // }
  // console.log(new Date(), store.getters.user);
  // console.log(to, from, next);
  // next();
});

router.afterEach(() => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

export default router;
