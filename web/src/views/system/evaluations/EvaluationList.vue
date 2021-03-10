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
      .then(() => Promise.all([
          this.fsGet("evaluations"),
          this.fsGet("squads"),
          this.fsGet("evaluations-dates"),
          this.fsGet("config", "evaluations-dates")
        ])
        .then(res => {
          this.table.data = res[0].map(evaluation => {
            evaluation.name = res[1].find(x => x.id === evaluation.id).name;
            evaluation.quantity = res[2].filter(x => x.id_squad === evaluation.id).length;
            evaluation.frequencyLabel = res[3].frequencies[evaluation.frequency];
            return evaluation;
          });
        })
      )
      .then(() => (this.table.paginated = this.table.data.length > 10))
      .then(() => this.$store.commit("showLoader", false));
  },
  methods: {
    formEdit(id) {
      this.$parent.selectedId = id;
      this.$router.push({ name: "EvaluationForm" });
    }
  }
};
</script>

<template>
  <div id="EvaluationPage">
    <div class="columns">
      <div class="column is-3">
        <div class="box">
          <div class="title fn-s12">Avaliações</div>
          <p>Total de Equipes: {{ table.data.length }}</p>
          <router-link
            to="/evaluations/form"
            class="button bg-blue full-width m-t-05"
          >
            <strong>Criar nova Avaliação</strong>
          </router-link>
        </div>
      </div>
      <div class="column is-9">
        <div class="evaluations box">
          <b-table
            :default-sort="table.sort"
            :perPage="table.perPage"
            :paginated="table.paginated"
            :data="table.data"
            :columns="table.columns"
          >
            <template slot-scope="props">
              <b-table-column field="name" label="Nome da Equipe" sortable>
                {{ props.row.name }}
              </b-table-column>
              <b-table-column field="frequencyLabel" label="Frequência" sortable>
                {{ props.row.frequencyLabel }}
              </b-table-column>
              <b-table-column field="quantity" label="Avaliações criadas" sortable>
                {{ props.row.quantity }}
              </b-table-column>
              <!--
              <b-table-column field="members" label="Integrantes" sortable>
                {{ props.row.members }}
              </b-table-column> -->
              <b-table-column field="actions" class="flex-end">
                <a class="button bg-blue" @click="formEdit(props.row.id)">
                  <b-icon icon="eye" size="is-small" />
                </a>
              </b-table-column>
            </template>
            <template slot="empty">
              <div class="content has-text-grey has-text-centered p-tb-3">
                <p>
                  <b-icon icon="alert-octagram" size="is-large"> </b-icon>
                </p>
                <p>Nao há rotinas de avaliação registradas</p>
              </div>
            </template>
          </b-table>
        </div>
      </div>
    </div>
  </div>
</template>
