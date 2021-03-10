<style lang="scss">
@import "./signup";
</style>

<script>
import { Auth, Firestore } from "@/requests/firebase";
import User from "@/classes/User";
import formHelper from "@/helpers/formHelper";

export default {
  mixins: [formHelper, Auth, Firestore],
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        passwordConfirm: ""
      },
      error: {
        name: "",
        email: "",
        password: "",
        passwordConfirm: ""
      }
    };
  },
  methods: {
    signUp(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (this.checkForm()) {
        this.atNewUser(this.form.email, this.form.password)
          .then(res => this.fsSet(
              "users",
              { ...new User().getUserFields(), ...this.form },
              res.user.uid
            )
              .then(() => this.$store.dispatch("updateUser", res.user))
              .then(() => this.$router.push({ name: "Dashboard" }))
          )
          .catch(error => {
            if (error.code === "auth/email-already-in-use")
              this.error.email = "E-mail já cadastrado";
            this.form.password = this.form.passwordConfirm = null;
          });
      }
    },
    checkForm() {
      this.error.name = this.formValidateName(this.form.name) || "";
      this.error.email = this.formValidateMail(this.form.email) || "";
      this.error.password = this.formValidateEmpty(this.form.password) || "";
      this.error.passwordConfirm =
        this.formValidatePassword(
          this.form.password,
          this.form.passwordConfirm
        ) || "";
      return !Object.values(this.error).filter(err => err).length;
    }
  }
};
</script>

<template>
  <form class="form-signup">
    <b-field :message="error.name" :type="{ 'is-danger': error.name }">
      <b-input
        placeholder="Nome completo"
        size="is-large"
        icon="account"
        v-model="form.name"
      />
    </b-field>
    <b-field :message="error.email" :type="{ 'is-danger': error.email }">
      <b-input
        type="email"
        placeholder="E-mail"
        size="is-large"
        icon="email"
        v-model="form.email"
      />
    </b-field>
    <b-field :message="error.password" :type="{ 'is-danger': error.password }">
      <b-input
        type="password"
        placeholder="Senha"
        size="is-large"
        icon="lock"
        v-model="form.password"
      />
    </b-field>
    <b-field
      :message="error.passwordConfirm"
      :type="{ 'is-danger': error.passwordConfirm }"
    >
      <b-input
        type="password"
        placeholder="Confirmação de senha"
        size="is-large"
        icon="lock"
        v-model="form.passwordConfirm"
      />
    </b-field>
    <a
      href="#"
      class="button bg-blue is-block is-large is-fullwidth"
      @click="signUp"
    >
      Cadastrar
      <i class="fa fa-sign-in" aria-hidden="true" />
    </a>
  </form>
</template>
