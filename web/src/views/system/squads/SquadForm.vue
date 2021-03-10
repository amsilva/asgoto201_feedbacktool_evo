<script>
import { Auth, Firestore } from "@/requests/firebase";
import Squad from "@/classes/Squad";
import formHelper from "@/helpers/formHelper";
import moment from "moment";

export default {
  mixins: [formHelper, Auth, Firestore],
  data() {
    const form = new Squad().getSquadFields();
    form.registered = moment().startOf("day").format("X");
    return {
      form: form,
      error: new Squad().getRequiredFields(),
      users: [],
      modelProfessionals: [],
      modelCreatedDate: moment().startOf("day").format("DD/MM/YYYY"),
      id: null,
      buttonSaveEnabled: true,
      buttonLoadingShow: false
    };
  },
  created() {
    new Promise(resolve => resolve(this.$store.commit("showLoader", true)))
      .then(() => (this.id = this.$parent.selectedId))
      .then(() => this.id ? this.fsGet("squads", this.id) : null)
      .then(squad => {
        if(squad) {
          this.form = { ...this.form, ...squad };
          this.form.techlead = this.form.techlead.id;
          this.fsGetQry("squads-users", "id_squad", "==", this.id)
            .then(members => (this.members = members.filter(x => !x.quit)))
            .then(() => moment(this.form.registered, "X").format("DD/MM/YYYY"))
            .then(date => (this.modelCreatedDate = date))
        }
      })
      .then(() => this.fsGet("users"))
      .then(users => (this.users = users))
      .then(() => this.$store.commit("showLoader", false));
  },
  methods: {
    getUserFiltered(user) {
      return {
        id: user.id,
        name: user.name,
      }
    },
    setUserSelected() {
      this.modelProfessionals.map(id => {
        this.form.members.push(
          this.getUserFiltered(
            this.users.find(x => x.id === id)
          )
        )
      });
      this.clearUserSelection();
    },
    unsetUserSelected() {
      this.modelProfessionals.map(id => {
        if(this.form.members.findIndex(x => x.id === id) >= 0)
          this.form.members.splice(this.form.members.findIndex(x => x.id === id), 1);
      });
      this.clearUserSelection();
    },
    clearUserSelection() {
      this.modelProfessionals = [];
      document
        .querySelectorAll("option")
        .forEach(obj => (obj.selected = false));
    },
    saveSquad(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      new Promise(resolve => resolve(this.$store.commit("showLoader", true)))
        .then(() => this.checkForm())
        .then(check => check
          ? this.fsSet("squads", {
            active: this.form.active,
            name: this.form.name,
            techlead: this.getUserFiltered(
              this.users.find(x => x.id === this.form.techlead)
            ),
            members: this.form.members,
            registered: this.form.registered
          }, this.id)
          : null
        )
        .then(res => {
          if (res && res.id) {
            let techlead = this.members && this.members.length
              ? this.members.find(x => x.techlead)
              : null;
            if (!techlead || techlead && techlead.id_user !== this.form.techlead) {
              this.fsSet("squads-users", {
                techlead: true,
                id_user: this.form.techlead,
                id_squad: res.id,
                join: parseInt(moment().startOf("day").format("X"))
              });
              if (techlead) {
                this.fsSet("squads-users", {
                  techlead: true,
                  id_user: techlead.id_user,
                  id_squad: res.id,
                  join: techlead.join,
                  quit: parseInt(moment().startOf("day").format("X"))
                }, techlead.id);
              }
            }
            this.members.filter(x => !x.techlead).map(old => {
              if (!this.form.members.find(x => x.id === old.id_user)) {
                let user = this.users.find(x => x.id === old.id_user);
                user.id_squad = null;
                delete user.id;
                this.fsSet("users", user, old.id_user)
                  .then(() => this.fsSet("squads-users", {
                      id_user: old.id_user,
                      id_squad: old.id_squad,
                      join: old.join,
                      quit: parseInt(moment().startOf("day").format("X"))
                    }, old.id)
                  );
              }
            })
            this.form.members.filter(x => !x.techlead).map(member => {
              if (this.members && !this.members.find(x => x.id_user === member.id)) {
                let user = this.users.find(x => x.id === member.id);
                user.id_squad = res.id;
                delete user.id;
                this.fsSet("users", user, member.id)
                  .then(() => this.fsSet("squads-users", {
                      id_user: member.id,
                      id_squad: res.id,
                      join: parseInt(moment().startOf("day").format("X"))
                    })
                  )
              }
            });
          }
        })
        .then(() => this.$router.push("/squads"))
        .then(() => this.$store.commit("showLoader", false));
    },
    checkForm() {
      this.error.name = this.formValidateEmpty(this.form.name) || "";
      this.error.techlead = this.formValidateEmpty(this.form.techlead) || "";
      this.error.members = this.formValidateArray(this.form.members) || "";
      return !Object.values(this.error).filter(err => err).length;
    }
  }
};
</script>

<template>
  <div id="SquadFormPage">
    <form>
      <div class="columns">
        <div class="column is-3">
          <div class="box">
            <div class="title fn-s12">
              {{ id ? "Editar Equipe" : "Cadastro de Nova Equipe" }}
            </div>
            <p></p>
            <div class="is-flex">
              <a
                class="button bg-green"
                href="#"
                :class="{ 'is-loading': buttonLoadingShow }"
                :disabled="!buttonSaveEnabled"
                @click="saveSquad"
              >
                {{ id ? "Salvar" : "Cadastrar" }}
              </a>
              <router-link to="/squads" class="m-l-1 flex-grow button bg-grey">
                voltar
              </router-link>
            </div>
          </div>
        </div>
        <div class="column is-9">
          <div class="box">
            <input type="hidden" v-model="id" />
            <div class="columns is-multiline">
              <div class="column is-9">
                <b-field
                  label="Nome da Squad"
                  class="required"
                  :type="{ 'is-danger': error.name }"
                  :message="error.name"
                >
                  <b-input v-model="form.name" />
                </b-field>
              </div>
              <div class="column is-3">
                <b-field label="Criaado em" class="required">
                  <b-input v-model="modelCreatedDate" disabled/>
                </b-field>
              </div>
              <div class="column is-12">
                <b-field
                  label="Líder Técnico"
                  class="required"
                  :type="{ 'is-danger': error.techlead }"
                  :message="error.techlead"
                >
                  <b-select placeholder="Selecione" v-model="form.techlead">
                    <option
                      v-for="user in users.filter(x => x.profile === '2' || x.profile === '99')"
                      :value="user.id"
                      :key="user.id"
                    >
                      {{ user.name }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Outros integrantes">
                  <b-select v-model="modelProfessionals" multiple>
                    <option
                      v-for="user in users.filter(x => x.profile === '1')"
                      :key="user.id"
                      :value="user.id"
                      :disabled="form.members.find(x => x.id === user.id)"
                    >
                      {{ user.name }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div
                class="column is-narrow is-flex flex-col flex-center-v flex-center-h"
              >
                <b-button class="bg-green m-b-3" @click="setUserSelected">
                  Selecionar
                  <b-icon icon="chevron-right" class="is-pulled-right m-l-02" />
                </b-button>
                <b-button class="bg-red" @click="unsetUserSelected">
                  <b-icon icon="chevron-left" class="is-pulled-left m-r-02" />
                  Remover
                </b-button>
              </div>
              <div class="column">
                <b-field
                  label="Selecionados"
                  class="required"
                  :type="{ 'is-danger': error.members }"
                  :message="error.members"
                >
                  <b-select v-model="modelProfessionals" multiple>
                    <template v-for="user in users.filter(x => x.profile === '1')">
                      <option
                        :key="user.id"
                        :value="user.id"
                        v-if="form.members.find(x => x.id === user.id)"
                      >
                        {{ user.name }}
                      </option>
                    </template>
                  </b-select>
                </b-field>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
