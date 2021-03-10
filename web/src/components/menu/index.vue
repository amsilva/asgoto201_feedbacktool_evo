<style lang="scss">
@import "./menu";
</style>

<script>
import { Auth } from "@/requests/firebase";
export default {
  mixins: [Auth],
  data() {
    return {
      toggleShow: false,
      props: {}
    };
  },
  methods: {
    menuToggle: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      this.toggleShow = !this.toggleShow;
    },
    logout() {
      this.atLogout()
        .then(() => this.$store.dispatch("logout"))
        .then(() => this.$router.push("/"));
    }
  }
};
</script>

<template>
  <b-menu :class="{ 'show-collapse': toggleShow }">
    <div class="menu-header">
      <div class="avatar">
        <figure class="image is-square">
          <img src="https://bulma.io/images/placeholders/480x480.png" />
        </figure>
        <a href="#" class="button is-outlined menu-show" @click="menuToggle">
          <b-icon icon="menu" :size="!toggleShow ? 'is-small' : 'is-medium'" />
        </a>
      </div>
    </div>
    <div class="menu-body">
      <b-menu-list>
        <b-menu-item to="/dashboard" tag="router-link">
          <template slot="label">
            <b-icon class="is-pulled-left" icon="home" />
            <label>Home</label>
          </template>
        </b-menu-item>
        <!-- <b-menu-item to="/profile" tag="router-link">
          <template slot="label">
            <b-icon class="is-pulled-left" icon="account" />
            <label>Meu perfil</label>
          </template>
        </b-menu-item> -->
      </b-menu-list>
    </div>
    <div class="menu-footer">
      <b-menu-list>
        <!-- <b-menu-item to="/config" tag="router-link">
          <template slot="label">
            <b-icon class="is-pulled-left" icon="cogs" />
            <label>Configurações</label>
          </template>
        </b-menu-item> -->
        <b-menu-item @click="logout()">
          <template slot="label">
            <b-icon class="is-pulled-left" icon="logout" />
            <label>Sair</label>
          </template>
        </b-menu-item>
      </b-menu-list>
    </div>
  </b-menu>
</template>
