<script>
import "./access.scss";
export default {
  data() {
    return {
      active: this.$route.path
    };
  },
  computed: {
    background() {
      let index = Math.floor(Math.random() * 8 + 1);
      return index; //require("@/assets/images/background/image-0" + index + ".jpg");
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.active = to.path;
    next();
  }
};
</script>

<template>
  <section id="Access" class="hero is-fullheight is-bold">
    <div class="left-column bg-blue is-gradient">
      <div
        class="background"
        :style="{
          backgroundImage: `url(${background})`
        }"
      />
    </div>
    <div class="right-column">
      <div class="button-group">
        <router-link
          class="button is-large is-fullwidth"
          :class="{
            'is-active is-negative': active == '/login'
          }"
          to="/login"
        >
          Login
        </router-link>
        <router-link
          class="button is-large is-fullwidth"
          :class="{
            'is-active is-negative': active == '/signup'
          }"
          to="/signup"
        >
          Cadastrar
        </router-link>
      </div>
      <router-view />
    </div>
  </section>
</template>
