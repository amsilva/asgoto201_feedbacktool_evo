import "buefy/dist/buefy.css";
import "@/assets/sass/style.scss";
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";

import Vue from "vue";
import VueMask from "v-mask";
import VueMoney from "v-money";
import VueAxios from "vue-axios";
import Axios from "axios";
import Buefy from "buefy";
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import VueMoment from "vue-moment";

import App from "@/App.vue";
import store from "@/store";
import router from "@/router";
import firebase from "@/requests/firebase";

Vue.use(Buefy);
Vue.use(VueAxios, Axios);
Vue.use(VueMask);
Vue.use(VueMoney, { precision: 4 });
Vue.use(VueMoment);
Vue.use(HighchartsVue, { highcharts: Highcharts });
Vue.config.productionTip = false;

firebase.auth().onAuthStateChanged(user => {
  store.dispatch(user ? "login" : "logout", user, "main");
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
