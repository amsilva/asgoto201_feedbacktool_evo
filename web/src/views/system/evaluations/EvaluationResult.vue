<script>
import GraphicPie from "@/components/GraphicPie";
import { Firestore } from "@/requests/firebase";
import dateHelper from "@/helpers/dateHelper";
import userHelper from "@/helpers/userHelper";
import moment from "moment";
// import dataGraphics from "@/data/graphics";

export default {
  components: { GraphicPie },
  mixins: [dateHelper, userHelper, Firestore],
  data() {
    return {
      user: {},
      evaluations: {
        dates: [],
        data: [],
        labels: []
      },
      dateSel: null,
      table: [],
      graphic: []
    };
  },
  created() {
    new Promise(resolve => resolve(this.$store.commit("showLoader", true)))
      .then(() => (this.user.id = this.$store.getters.id))
      .then(() => this.$store.getters.userFirestore
        ? this.$store.getters.userFirestore
        : this.fsGet("users", this.$store.getters.id)
      )
      .then(user => (this.user = { ...this.user, ...user }))
      .then(() => this.$store.getters.config
        ? this.$store.getters.config
        : this.fsGet("config")
      )
      .then(config => (this.evaluations.labels = config.find(x => x.id === "evaluations")))
      .then(() => Promise.all([
          this.fsGetQry("evaluations-dates", "id_squad", "==", this.user.id_squad),
          this.fsGetQry("evaluations-rates", "id_squad", "==", this.user.id_squad),
          this.fsGet("squads")
        ])
          .then(res => res[0]
            .sort((a, b) => {
              a = moment(a.initialDate, "DD/MM/YYYY").format("X");
              b = moment(b.initialDate, "DD/MM/YYYY").format("X");
              return a > b ? -1 : 1
            })
            .map(evl => {
              const squad = res[2].find(x => x.id === evl.id_squad);
              const year = moment(evl.initialDate, "DD/MM/YYYY").format("YYYY");
              const month = moment(evl.initialDate, "DD/MM/YYYY").format("MM");
              let rate = null;

              evl.closed = (squad.members.length + 1 === evl.done.length ||
                this.today > evl.finishDateTime);
              evl.timeId = parseInt(moment(evl.initialDate, "DD/MM/YYYY").format("X"));

              this.evaluations.dates.push({
                label: `${year} / ${this.dateGetMonth(month - 1)}`,
                value: evl.timeId
              });

              if(evl.closed) {
                rate = res[1].find(
                  x => x.id_squad === evl.id_squad && x.id === evl.id
                )
                rate = this.usrGetGfxRate(squad, rate[this.user.id]);
              }
              evl.graphic = rate ? rate.graphic : this.getGfxBaseData();
              evl.table = rate ? rate.table : [];

              return evl;
            })
          )
          .then(evaluations => (this.evaluations.data = evaluations))
          .then(() => {
            this.setData();
          })
      )
      .then(() => this.$store.commit("showLoader", false));
  },
  methods: {
    setData(input) {
      // console.log(input);
      if(!input) input = this.evaluations.dates[0].value;
      const dateSelect = this.evaluations.dates.find(x => x.value === input);
      const evaluation = this.evaluations.data.find(x => x.timeId === input);

      this.dateSel = dateSelect.value;
      this.table = evaluation.table;
      this.graphic = evaluation.graphic;
    }
  }
};
</script>

<template>
  <div id="EvaluationsResultsPage">
    <div class="columns">
      <div class="column is-3">
        <div class="filter box">
          <h1 class="fn-s12">Avaliações Anteriores</h1>
          <form>
            <div class="full-width is-inline-flex flex-center-v">
              <b-field class="m-0 flex-grow">
                <b-select
                  placeholder="Ano"
                  class="flex-grow"
                  v-model="dateSel"
                  @input="setData"
                >
                  <template v-for="date in evaluations.dates">
                    <option :key="'opt-year-' + date.value" :value="date.value">
                      {{ date.label }}
                    </option>
                  </template>
                </b-select>
              </b-field>
            </div>
          </form>
        </div>
        <!-- <div class="box">
          <h2 class="fn-s12">Avaliação pendente</h2>
          <p>
            Voce tem uma avaliação pendente. Responda até
            <strong>xx/xx/xxxx</strong>
          </p>
          <router-link to="/evaluations/new" class="button full-width m-t-05">
            <strong>Responder Avaliação</strong>
          </router-link>
        </div> -->
      </div>
      <div class="column is-9">
        <div class="graphic box" v-if="graphic.length">
          <h2 class="fn-s12">Gráfico geral</h2>
          <GraphicPie :data="graphic" class="graphic-chart" />
        </div>
        <div class="evaluations box">
          <h2 class="fn-s12">
            Avaliações
            <template v-if="graphic.length"
              >(total: {{ graphic.length }})</template
            >
          </h2>
          <b-table :data="table">
            <template slot-scope="props">
              <b-table-column field="squad" label="Equipe">
                {{ props.row.squad }}
              </b-table-column>
              <b-table-column field="evaluation" label="Avaliação">
                {{ evaluations.labels[props.row.evaluation] }}
              </b-table-column>
              <b-table-column field="feedback" label="Comentários">
                {{ props.row.feedback }}
              </b-table-column>
            </template>
            <template slot="empty">
              <div class="content has-text-grey has-text-centered p-tb-3">
                <p>
                  <b-icon icon="chart-areaspline" size="is-large"> </b-icon>
                </p>
                <p>Sem dados computados para esse período</p>
              </div>
            </template>
          </b-table>
        </div>
      </div>
    </div>
  </div>
</template>
