<script>
import Navbar from "@/components/Navbar";
import Menu from "@/components/Menu";
import { Firestore } from "@/requests/firebase";
import "./system.scss";
export default {
  components: { Menu, Navbar },
  mixins: [Firestore],
  data() {
    return {
      menu: null,
      navbar: null,
      footer: null,
      layoutClass: null
    };
  },
  mounted() {
    new Promise(resolve => resolve(this.$store.commit("showLoader", true)))
      .then(() => this.fsGet("users", this.$store.getters.id)
        .then(user => this.$store.dispatch("updateUser", user))
      )
      .then(() => this.fsGet("config")
        .then(config => (this.$store.commit("config", config)))
      )
      .then(() => this.$store.commit("showLoader", false));
  }
};
</script>

<template>
  <div class="system layout-blue">
    <Menu />
    <div class="system-main">
      <Navbar />
      <div class="container system-content">
        <router-view></router-view>
      </div>
    </div>
    <component v-if="footer" :is="footer" />
  </div>
</template>
