<style lang="scss" scoped>
@import "./login";
</style>

<script>
import { Auth, Firestore } from "@/requests/firebase";
export default {
  mixins: [Auth, Firestore],
  data() {
    return {
      form: {
        username: null,
        password: null
      },
      error: false
    };
  },
  methods: {
    login() {
      this.atLogin(this.form.username, this.form.password).then(() =>
        this.$router.push({ name: "DashboardProfile" })
      );
    }
  }
};
</script>

<template>
  <form class="form-login">
    <b-field>
      <b-input
        type="email"
        placeholder="Login"
        size="is-large"
        icon="account"
        v-model="form.username"
      />
    </b-field>
    <b-field>
      <b-input
        type="password"
        placeholder="Password"
        size="is-large"
        icon="lock"
        v-model="form.password"
      />
    </b-field>
    <!-- <b-field>
      <label class="checkbox">
        <input type="checkbox">
        Remember me
      </label>
    </b-field> -->
    <b-button
      class="button bg-blue is-block is-large is-fullwidth"
      @click="login"
    >
      Logar
      <i class="fa fa-sign-in" aria-hidden="true" />
    </b-button>
  </form>
</template>
