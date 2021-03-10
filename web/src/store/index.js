import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    done: false,
    showLoader: false,
    id: null,
    userAuth: null,
    userFirestore: null,
    config: null
  },
  mutations: {
    done: (ctx, done) => (ctx.done = done),
    showLoader: (ctx, showLoader) => (ctx.showLoader = showLoader),
    id: (ctx, id) => (ctx.id = id),
    userAuth: (ctx, userAuth) => (ctx.userAuth = userAuth),
    userFirestore: (ctx, userFirestore) => {
      ctx.userFirestore = userFirestore;
    },
    config: (ctx, config) => (ctx.config = config)
  },
  getters: {
    done: ctx => ctx.done,
    showLoader: ctx => ctx.showLoader,
    id: ctx => ctx.id,
    userAuth: ctx => ctx.userAuth,
    userFirestore: ctx => {
      if(ctx.userFirestore) ctx.userFirestore.id = ctx.id;
      return ctx.userFirestore;
    },
    config: ctx => ctx.config
  },
  actions: {
    login(ctx, user) {
      console.log("login", user);
      ctx.dispatch("updateUser", user)
        .then(() => ctx.commit("done", true));
    },
    logout(ctx, user) {
      console.log("logout", user);
      ctx.commit("userAuth", null);
      ctx.commit("userFirestore", null);
      ctx.commit("done", true);
    },
    updateUser(ctx, user) {
      console.log(user);
      if (user.uid) {
        console.log("userAuth");
        ctx.commit("userAuth", user);
        ctx.commit("id", user.uid);
      } else if (user.profile) {
        console.log("userFirestore");
        ctx.commit("userFirestore", user);
      }
    }
  },
  modules: {}
});
