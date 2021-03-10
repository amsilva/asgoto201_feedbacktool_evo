<script>
import { Auth, Firestore } from "@/requests/firebase";
import User from "@/classes/User";
import formHelper from "@/helpers/formHelper";
import moment from "moment";

export default {
  mixins: [formHelper, Auth, Firestore],
  data() {
    return {
      form: new User().getUserFields(),
      error: new User().getRequiredFields(),
      profiles: [],
      id: null,
      tooltip: "",
      buttonSaveEnabled: true,
      buttonLoadingShow: false,
      userBirthday: "",
      workBirthday: ""
    };
  },
  created() {
    new Promise(resolve => resolve(this.$store.commit("showLoader", true)))
      .then(() => this.fsGet("config", "profiles")
        .then(profiles => (this.profiles = profiles))
      )
      .then(() => (this.id = this.$parent.selectedId))
      .then(() => this.id
        ? this.fsGet("users", this.id)
        : this.$router.go(-1)
      )
      .then(user => (this.form = { ...this.form, ...user }))
      .then(() => {
        if (this.form.birthday)
          this.userBirthday = moment(this.form.birthday, "X").format("DD/MM/YYYY");
        if (this.form.work.birthday)
          this.workBirthday = moment(this.form.work.birthday,"X").format("DD/MM/YYYY");
      })
      .then(() => this.$store.commit("showLoader", false));
  },
  methods: {
    saveUser(evt) {
      new Promise(resolve => resolve(this.$store.commit("showLoader", true)))
        .then(() => evt.preventDefault())
        .then(() => evt.stopPropagation())
        .then(() => {
          if (this.checkForm()) {
            this.form.birthday = parseInt(
              moment(this.userBirthday, "DD/MM/YYYY").format("X")
            );
            this.form.work.birthday = parseInt(
              moment(this.workBirthday, "DD/MM/YYYY").format("X")
            );
            this.fsSet("users", this.form, this.id).then(res =>
              res.success ? this.$router.push("/users") : null
            );
          }
        })
        .then(() => this.$store.commit("showLoader", false));
    },
    checkForm() {
      if (this.form.name !== "admin")
        this.error.name = this.formValidateName(this.form.name) || "";
      this.error.email = this.formValidateMail(this.form.email) || "";
      this.error.birthday = this.formValidateDate(this.userBirthday) || "";
      this.error.profile = this.formValidateEmpty(this.form.profile) || "";

      if (this.workBirthday)
        this.error.workBirthday = this.formValidateDate(this.workBirthday) || "";

      return !Object.values(this.error).filter(err => err).length;
    }
  }
};
</script>

<template>
  <div id="UserFormPage">
    <form>
      <div class="columns">
        <div class="column is-3">
          <div class="box">
            <div class="title fn-s12">
              {{ id ? "Editar usuário" : "Cadastro de Novo Usuário" }}
            </div>
            <p></p>
            <div class="is-flex">
              <a
                class="button bg-green"
                href="#"
                :class="{ 'is-loading': buttonLoadingShow }"
                :disabled="!buttonSaveEnabled"
                @click="saveUser"
              >
                {{ id ? "Salvar" : "Cadastrar" }}
              </a>
              <router-link to="/users" class="m-l-1 flex-grow button bg-grey">
                voltar
              </router-link>
            </div>
          </div>
        </div>
        <div class="column is-9">
          <div class="box">
            <div class="title fn-s12 m-b-1">Dados Pessoais</div>
            <input type="hidden" v-model="id" />
            <div class="columns is-multiline">
              <div class="column is-9">
                <b-field
                  label="Nome completo"
                  class="required"
                  :type="{ 'is-danger': error.name }"
                  :message="error.name"
                >
                  <b-input v-model="form.name" />
                </b-field>
              </div>
              <div class="column is-3">
                <b-field
                  label="Perfil de acesso Persona"
                  class="required"
                  :type="{ 'is-danger': error.profile }"
                  :message="error.profile"
                >
                  <b-select placeholder="Selecione" v-model="form.profile">
                    <option
                      v-for="(profile, key) in profiles"
                      :value="key"
                      :key="'access-' + key"
                    >
                      {{ profile }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="column is-5">
                <b-field
                  label="E-mail"
                  class="required"
                  :type="{ 'is-danger': error.email }"
                  :message="error.email"
                >
                  <b-input type="email" v-model="form.email" :disabled="id" />
                </b-field>
              </div>
              <div class="column is-3">
                <b-field
                  label="Data de nascimento"
                  class="required"
                  :type="{ 'is-danger': error.birthday }"
                  :message="error.birthday"
                >
                  <div
                    class="control"
                    :class="{ 'has-icons-right': error.birthday }"
                  >
                    <input
                      class="input"
                      v-mask="'##/##/####'"
                      :class="{ 'is-danger': error.birthday }"
                      v-model="userBirthday"
                    />
                    <span
                      class="icon is-right has-text-danger"
                      v-if="error.birthday"
                    >
                      <i class="mdi mdi-alert-circle mdi-24px" />
                    </span>
                  </div>
                </b-field>
              </div>
              <div class="column is-4">
                <b-field label="Telefone">
                  <div class="control">
                    <input
                      class="input"
                      v-mask="'(##) ####-#####'"
                      v-model="form.phoneNumber"
                    />
                  </div>
                </b-field>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="title fn-s12 m-b-1">Documentos Pessoais</div>
            <div class="columns is-mobile">
              <div class="column is-6">
                <b-field label="RG">
                  <div class="control">
                    <input
                      class="input"
                      v-mask="'##.###.###-#'"
                      v-model="form.rg"
                    />
                  </div>
                </b-field>
              </div>
              <div class="column is-6">
                <b-field label="CPF">
                  <div class="control">
                    <input
                      class="input"
                      v-mask="'###.###.###-##'"
                      v-model="form.cpf"
                    />
                  </div>
                </b-field>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="title fn-s12 m-b-1">Dados Profissionais</div>
            <div class="columns is-mobile">
              <div class="column is-4">
                <b-field
                  label="Data de início na empresa"
                  class="required"
                  :type="{ 'is-danger': error.workBirthday }"
                  :message="error.workBirthday"
                >
                  <div
                    class="control"
                    :class="{ 'has-icons-right': error.workBirthday }"
                  >
                    <input
                      class="input"
                      v-mask="'##/##/####'"
                      :class="{ 'is-danger': error.workBirthday }"
                      v-model="workBirthday"
                    />
                    <span
                      class="icon is-right has-text-danger"
                      v-if="error.workBirthday"
                    >
                      <i class="mdi mdi-alert-circle mdi-24px" />
                    </span>
                  </div>
                </b-field>
              </div>
              <div class="column is-8">
                <b-field label="Cargo">
                  <div class="control">
                    <input class="input" v-model="form.work.office" />
                  </div>
                </b-field>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
