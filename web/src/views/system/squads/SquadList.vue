<script>
import { Auth, Firestore } from "@/requests/firebase";
export default {
  mixins: [Auth, Firestore],
  data() {
    return {
      table: {
        data: [],
        columns: [],
        paginatd: false,
        perPage: 10,
        sort: "name"
      }
    };
  },
  created() {
    new Promise(resolve => resolve(this.$store.commit("showLoader", true)))
      .then(() => (this.$parent.selectedId = null))
      .then(() => this.fsGet("squads"))
      .then(squads => (this.table.data = squads))
      .then(() => (this.table.paginated = this.table.data.length > 10))
      .then(() => this.$store.commit("showLoader", false));
  },
  methods: {
    formEdit(id) {
      this.$parent.selectedId = id;
      this.$router.push({ name: "SquadForm" });
    }
  }
};
</script>

<template>
  <div id="SquadPage">
    <div class="columns">
      <div class="column is-3">
        <div class="box">
          <div class="title fn-s12">Equipes</div>
          <p>Total de Equipes: {{ table.data.length }}</p>
          <router-link
            to="/squads/form"
            class="button bg-blue full-width m-t-05"
          >
            <strong>Registrar nova Equipe</strong>
          </router-link>
        </div>
      </div>
      <div class="column is-9">
        <div class="squads box">
          <b-table
            striped
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
              <b-table-column field="techlead.name" label="Líder Técnico">
                {{ props.row.techlead.name }}
              </b-table-column>
              <b-table-column field="members" label="Integrantes">
                {{ props.row.members.length + 1 }}
              </b-table-column>
              <b-table-column field="actions" class="flex-end">
                <a class="button bg-green" @click="formEdit(props.row.id)">
                  <b-icon icon="pen" size="is-small" />
                </a>
              </b-table-column>
            </template>
            <template slot="empty">
              <div class="content has-text-grey has-text-centered p-tb-3">
                <p>
                  <b-icon icon="alert-octagram" size="is-large"> </b-icon>
                </p>
                <p>Nao há equipes registrados</p>
              </div>
            </template>
          </b-table>
        </div>
      </div>
    </div>
  </div>
</template>
