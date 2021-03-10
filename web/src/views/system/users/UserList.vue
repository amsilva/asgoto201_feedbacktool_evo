<script>
import { Auth, Firestore } from "@/requests/firebase";
export default {
  mixins: [Auth, Firestore],
  data() {
    return {
      table: {
        data: [],
        columns: [],
        paginated: false,
        perPage: 10,
        sort: "name"
      }
    };
  },
  mounted() {
    new Promise(resolve => resolve(this.$store.commit("showLoader", true)))
      .then(() => (this.$parent.selectedId = null))
      .then(() => Promise.all([
          this.fsGet("users"),
          this.fsGet("config", "profiles")
        ])
        .then(res => {
          const users = res[0];
          const profiles = res[1];

          this.table.data = users.map(user => {
            user.profile = profiles[user.profile];
            return user;
          });
        })
      )
      .then(() => (this.table.paginated = this.table.data.length > 10))
      .then(() => this.$store.commit("showLoader", false));
  },
  methods: {
    formEdit(id) {
      this.$parent.selectedId = id;
      this.$router.push({ name: "UserForm" });
    }
  }
};
</script>

<template>
  <div id="UserPage">
    <div class="columns">
      <div class="column is-3">
        <div class="box">
          <div class="title fn-s12 m-b-05">Usuários</div>
          <p>Total de Usuários: {{ table.data.length }}</p>
          <!-- <router-link to="/users/form" class="button bg-blue full-width m-t-05">
            <strong>Registrar novo Usuário</strong>
          </router-link> -->
        </div>
      </div>
      <div class="column is-9">
        <div class="users box">
          <b-table
            striped
            :class="{ 'is-paginated': table.paginated }"
            :default-sort="table.sort"
            :perPage="table.perPage"
            :paginated="table.paginated"
            :data="table.data"
            :columns="table.columns"
          >
            <template slot-scope="props">
              <b-table-column field="name" label="Nome" sortable>
                {{ props.row.name }}
              </b-table-column>
              <b-table-column field="email" label="E-mail" sortable>
                {{ props.row.email }}
              </b-table-column>
              <b-table-column field="profile" label="Perfil" sortable>
                {{ props.row.profile }}
              </b-table-column>
              <b-table-column field="actions" class="flex-end">
                <a
                  class="button bg-green"
                  @click="props.row.profile !== 'disabled'
                    ? formEdit(props.row.id)
                    : null"
                >
                  <b-icon icon="pen" size="is-small" />
                </a>
                <!-- <template v-if="props.row.profile !== 'disabled'">
                  <a class="button bg-red" @click="formEdit(props.row.id)">
                    <b-icon icon="acount-cancel" size="is-small" />
                  </a>
                </template>
                <template v-if="props.row.profile === 'disabled'">
                  <a class="button bg-blue" @click="formEdit(props.row.id)">
                    <b-icon icon="account-check" size="is-small" />
                  </a>
                </template> -->
              </b-table-column>
            </template>
            <template slot="empty">
              <div class="content has-text-grey has-text-centered p-tb-3">
                <p>
                  <b-icon icon="account-off" size="is-large"> </b-icon>
                </p>
                <p>Nao há usuários cadastrados</p>
              </div>
            </template>
          </b-table>
        </div>
      </div>
    </div>
  </div>
</template>
