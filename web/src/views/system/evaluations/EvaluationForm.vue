<script>
import ModalConfirmation from "@/components/ModalConfirmation";
import { Auth, Firestore } from "@/requests/firebase";
import Evaluation from "@/classes/Evaluation";
import formHelper from "@/helpers/formHelper";
import moment from "moment";

export default {
  components: { ModalConfirmation },
  mixins: [formHelper, Auth, Firestore],
  data() {
    return {
      form: new Evaluation().getEvaluationFields(),
      error: new Evaluation().getRequiredFields(),
      id: null,
      manyTimes: 0,
      squads: [],
      evaluations: [],
      config: {},
      rangeInitialList: [],
      rangeFinishList: [],
      evaluationDates: [],
      calendarDates: [],
      tooltip: "",
      readonlyMode: true,
      buttonSaveShow: false,
      buttonSaveEnabled: true,
      buttonLoadingShow: false,
      buttonAddNewDateShow: true,
      modalConfim: {
        show: false,
        title: "",
        message: ""
      }
    };
  },
  created() {
    new Promise(resolve => resolve(this.$store.commit("showLoader", true)))
      .then(() => this.fsGet("squads")
        .then(squads => (this.squads = squads))
      )
      .then(() => this.fsGet("evaluations")
        .then(evaluations => (this.evaluations = evaluations))
      )
      .then(() => this.fsGet("config", "evaluations-dates")
        .then(config => (this.config = config))
      )
      .then(() => {
        if(this.$parent.selectedId) {
          this.id = this.$parent.selectedId;
          this.fsGet("evaluations", this.id)
            .then(evaluation => (this.form = { ...this.form, ...evaluation }))
            .then(() => (this.rangeInitialList.push(this.form.initialDate)))
            .then(() => (this.rangeFinishList.push(this.form.finishDate)))
            .then(() => (this.calendarDates = [
                moment(this.form.initialDate, "DD/MM/YYYY").toDate(),
                moment(this.form.finishDate, "DD/MM/YYYY").toDate()
              ]));
          this.fsGetQry("evaluations-dates", "id_squad", "==", this.id)
            .then(evaluationDates => {
              this.evaluationDates = evaluationDates.sort((a, b) => {
                a = moment(a.initialDate, "DD/MM/YYYY").format("X");
                b = moment(b.initialDate, "DD/MM/YYYY").format("X");
                return a < b ? -1 : 1;
              })
            });
        } else {
          this.readonlyMode = false;
          this.buttonSaveShow = true;
          this.buttonAddNewDateShow = false;
          this.squads = this.squads.filter(x => {
            return this.evaluations.findIndex(y => y.id === x.id) < 0;
          })
        }
      })
      .then(() => this.$store.commit("showLoader", false))
      .then(() => console.log(this.form, this.id));
  },
  methods: {
    clear(step) {
      this.evaluationDates = [];

      if(step === 3) return;

      this.manyTimes = 1;
      this.form.frequency = null;

      if(step === 2) return;

      this.calendarDates = [];
      this.rangeFinishList = [];
      this.evaluationDates = [];
      this.form.finishDate = null;
      this.selectFinishDate = null;

      if(step === 1) return;

      this.rangeInitialList = [];
      this.form.initialDate = null;
    },
    setInitialDateRange(id) {
      this.clear();
      const { initialDaysMin, initialDaysRange } = this.config;
      const squad = this.squads.find(x => x.id === id);

      const fromToday = moment().add(initialDaysMin, "days").toDate();
      const dtRegistered = moment(squad.registered, "X").toDate();
      const dtMin = Math.max(moment(dtRegistered).add(1, "month"), fromToday);

      for (let i = 0; i < initialDaysRange; i++) {
        this.rangeInitialList.push(
          moment(dtMin).add(i, "days").format("DD/MM/YYYY")
        );
      };
    },
    setFinishDateRange(date) {
      const { finishDaysMin, finishDaysRange } = this.config;
      const initialDate = moment(date, "DD/MM/YYYY").toDate();

      for (let i = 0; i < finishDaysRange; i++) {
        this.rangeFinishList.push(
          moment(initialDate).add(i + finishDaysMin, "days").format("DD/MM/YYYY")
        );
      };
    },
    setInitialDate(date) {
      this.clear(1);
      this.calendarDates = [moment(date, "DD/MM/YYYY").toDate()];
      this.setFinishDateRange(date);
    },
    setFinishDate(date) {
      this.clear(2);
      this.calendarDates = [
        moment(this.form.initialDate, "DD/MM/YYYY").toDate(),
        moment(date, "DD/MM/YYYY").toDate()
      ];
      this.evaluationDates = [{
        initialDate: this.form.initialDate,
        finishDate: this.form.finishDate
      }];
    },
    setFrequency() {
      this.manyTimes = 1;
      this.setEvaluationDates(1);
    },
    setEvaluationDates(times) {
      this.clear(3);
      const frequency = this.form.frequency;
      const evaluationDates = [];

      for(let i = 0; i < times; i++) {
        let initialDate = moment(this.form.initialDate, "DD/MM/YYYY")
          .add(i * frequency, "months")
          .format("DD/MM/YYYY");
        let finishDate = moment(this.form.finishDate, "DD/MM/YYYY")
          .add(i * frequency, "months")
          .format("DD/MM/YYYY");
        let dates = this.getEvaluationInterval(initialDate, finishDate);

        evaluationDates.push({initialDate, finishDate, dates});
      }
      this.evaluationDates = evaluationDates;
      this.form.lastInitialDate = evaluationDates[evaluationDates.length - 1].initialDate;
      this.form.lastFinishDate = evaluationDates[evaluationDates.length - 1].finishDate;
    },
    getEvaluationInterval(initialDate, finishDate) {
      let dates = [];
      let date = null;
      let count = 0;
      while(date !== finishDate) {
        date = moment(initialDate, "DD/MM/YYYY").add(count, "days").format("DD/MM/YYYY");
        dates.push(date);
        count ++;
      }
      return dates;
    },
    showModalConfirmationNewDate(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      const { initialDaysMin } = this.config;

      const finishDate = moment(this.form.lastFinishDate, "DD/MM/YYYY");
      const initialDate = moment(this.form.lastInitialDate, "DD/MM/YYYY");
      const daysBetween = finishDate.diff(initialDate, "days");
      const fromToday = moment().add(initialDaysMin, "days").toDate();
      const frequency = parseInt(this.form.frequency);
      const dtMin = Math.max(moment(initialDate).add(1 * (frequency || 1), "month"), fromToday);
      this.temporaryData = {
        initialDate: moment(dtMin).format("DD/MM/YYYY"),
        finishDate: moment(dtMin).add(daysBetween, "days").format("DD/MM/YYYY")
      };

      let message = "Essa ação irá criar uma nova avaliação com início em ";
      message += "<b>" + this.temporaryData.initialDate + "</b> ";
      message += "e finalização em ";
      message += "<b>" + this.temporaryData.finishDate + "</b>";
      message += "<br>Deseja realmente continuar?";

      this.modalConfim = {
        message,
        title: "Atenção"
      }
      this.modalConfim.show = true;
    },
    saveEvaluation(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      new Promise(resolve => resolve(this.$store.commit("showLoader", true)))
        .then(() => this.checkForm())
        .then(check => check
          ? this.fsSet("evaluations", this.form, this.id)
            .then(res => (res && res.id)
              ? this.evaluationDates.map(date => {
                this.fsSet("evaluations-dates", {
                    id_squad: res.id,
                    initialDate: date.initialDate,
                    finishDate: date.finishDate,
                    dates: date.dates
                  })
                })
              : null
            )
            .then(() => this.$router.push("/evaluations"))
          : null
        )
        .then(() => this.$store.commit("showLoader", false));
    },
    saveNewEvaluationDate() {
      new Promise(resolve => resolve(this.$store.commit("showLoader", true)))
        .then(() => {
          if(this.form.frequency == 0 ) this.form.frequency = 1;
          this.form.lastInitialDate = this.temporaryData.initialDate;
          this.form.lastFinishDate = this.temporaryData.finishDate;
          this.fsSet("evaluations", this.form, this.id)
            .then(res => {
              if(res && res.id) {
                const {initialDate, finishDate} = this.temporaryData;
                this.fsSet("evaluations-dates", {
                  id_squad: this.id,
                  initialDate,
                  finishDate,
                  dates: this.getEvaluationInterval(initialDate, finishDate)
                });
                this.evaluationDates.push({
                  initialDate: this.temporaryData.initialDate,
                  finishDate: this.temporaryData.finishDate
                });
                delete this.temporaryData;
              }
            })
        })
        // .then(() => this.fsGetQry("evaluations-dates", "id_squad", "==", this.id))
        // .then(evaluationDates => {
        //   this.evaluationDates = evaluationDates.sort((a, b) => {
        //     a = moment(a.initialDate, "DD/MM/YYYY").format("X");
        //     b = moment(b.initialDate, "DD/MM/YYYY").format("X");
        //     return a < b ? -1 : 1;
        //   })
        // })
        .then(() => this.$store.commit("showLoader", false));
    },
    checkForm() {
      this.error.id = this.formValidateEmpty(this.id) || "";
      if (this.id)
        this.error.initialDate = this.formValidateEmpty(this.form.initialDate) || "";
      if (this.form.initialDate)
        this.error.finishDate = this.formValidateEmpty(this.form.finishDate) || "";
      if (this.form.finishDate)
        this.error.frequency = this.formValidateEmpty(this.form.frequency) || "";
      if (this.form.frequency && this.form.frequency !== "0")
        this.error.manyTimes = this.formValidateEmpty(this.manyTimes) || "";

      return !Object.values(this.error).filter(err => err).length;
    }
  }
};
</script>

<template>
  <div id="EvaluationFormPage">
    <form>
      <div class="columns">
        <div class="column is-3">
          <div class="box">
            <div class="title fn-s12">
              {{
                readonlyMode
                  ? "Visualizar Rotina de Avaliação"
                  : "Nova Rotina de Avaliações"
              }}
            </div>
            <p></p>
            <div class="is-flex flex-wrap">
              <a
                v-if="buttonSaveShow"
                class="button flex-grow bg-green m-r-1"
                href="#"
                :class="{ 'is-loading': buttonLoadingShow }"
                :disabled="!buttonSaveEnabled"
                @click="saveEvaluation"
              >
                Cadastrar
              </a>
              <a
                v-if="buttonAddNewDateShow"
                class="button flex-grow bg-blue m-b-1 full-width"
                href="#"
                :class="{ 'is-loading': buttonLoadingShow }"
                @click="showModalConfirmationNewDate"
              >
                Criar Nova Data de Avaliação
              </a>
              <router-link to="/evaluations" class="flex-grow button bg-grey">
                voltar
              </router-link>
            </div>
          </div>
        </div>
        <div class="column is-9">
          <div class="box">
            <div class="columns">
              <div class="column">
                <b-field
                  label="Equipes"
                  class="required"
                  :type="{ 'is-danger': error.id }"
                  :message="error.id"
                >
                  <b-select
                    placeholder="Selecione"
                    v-model="id"
                    :disabled="readonlyMode"
                    @input="setInitialDateRange"
                  >
                    <option
                      v-for="squad in squads"
                      :value="squad.id"
                      :key="squad.id"
                    >
                      {{ squad.name }}
                    </option>
                  </b-select>
                </b-field>
                <div class="columns">
                  <div class="column">
                    <b-field
                      label="Dia de início da Avaliação"
                      class="required"
                      :type="{ 'is-danger': error.initialDate }"
                      :message="error.initialDate"
                    >
                      <b-select
                        placeholder="Selecione"
                        v-model="form.initialDate"
                        :disabled="!rangeInitialList.length || readonlyMode"
                        @input="setInitialDate"
                      >
                        <option
                          v-for="(day, index) in rangeInitialList"
                          :value="day"
                          :key="'day-start-' + index"
                        >
                          {{ day }}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column">
                    <b-field
                      label="Dia Limite da Avaliação"
                      class="required"
                      :type="{ 'is-danger': error.finishDate }"
                      :message="error.finishDate"
                    >
                      <b-select
                        placeholder="Selecione"
                        v-model="form.finishDate"
                        :disabled="!rangeFinishList.length || readonlyMode"
                        @input="setFinishDate"
                      >
                        <option
                          v-for="(day, index) in rangeFinishList"
                          :value="day"
                          :key="'day-finish-' + index"
                        >
                          {{ day }}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                </div>
                <div class="columns">
                  <div class="column">
                    <b-field
                      label="Frequência da Avaliação"
                      class="required"
                      :type="{ 'is-danger': error.frequency }"
                      :message="error.frequency"
                    >
                      <b-select
                        placeholder="Selecione"
                        v-model="form.frequency"
                        :disabled="!form.initialDate || !form.finishDate || readonlyMode"
                        @input="setFrequency"
                      >
                        <option
                          v-for="(frequency, index) in config.frequencies"
                          :value="index"
                          :key="index"
                        >
                          {{ frequency }}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column" v-if="!readonlyMode">
                    <b-field
                      label="Criar Avaliações Futuras"
                      class="required"
                      :type="{ 'is-danger': error.manyTimes }"
                      :message="error.manyTimes"
                    >
                      <b-select
                        placeholder="Selecione"
                        v-model="manyTimes"
                        :disabled="readonlyMode || !form.frequency || form.frequency === '0'"
                        @input="setEvaluationDates"
                      >
                        <!-- <template v-if="form.frequency && form.frequency !=='0'"> -->
                          <option v-for="n in 10" :value="n" :key="n">
                            {{ n }}
                          </option>
                        <!-- </template> -->
                      </b-select>
                    </b-field>
                  </div>
                </div>
                <b-field label="Datas das Avaliações">
                  <b-taglist class="p-t-05 p-lr-07 bd bd-radius bg-whitesmoke">
                    <p class="tx-disabled p-b-02" v-if="!evaluationDates.length">
                      Sem datas definidas
                    </p>
                      <!-- closable -->
                    <b-tag
                      attached
                      v-for="tag in evaluationDates"
                      :key="tag.initialDate + '~' + tag.finishDate"
                    >
                      {{ tag.initialDate }} ~ {{ tag.finishDate }}
                    </b-tag>
                  </b-taglist>
                </b-field>
              </div>
              <div class="column is-narrow">
                <b-datepicker
                  inline
                  range
                  class="readonly"
                  v-model="calendarDates"
                >
                  <template slot="header">
                    <div class="fn-s12 has-text-centered">
                      <p class="m-t-1 m-b-05" v-if="!calendarDates.length">
                        Datas não selecionadas
                      </p>
                      <template v-if="calendarDates.length">
                        <b v-if="form.frequency">
                          {{ form.frequency === "0"
                            ? "Data da Avaliação Única"
                            : "Data da 1ª Avaliação" }}
                        </b>
                        <p :class="{ 'm-t-1 m-b-05': !form.frequency }">
                          De
                          <span v-if="calendarDates[0]">
                            {{ calendarDates[0] | moment("DD/MM/YYYY") }}
                          </span>
                          <span v-if="calendarDates[1]">
                            a
                            {{ calendarDates[1] | moment("DD/MM/YYYY") }}
                          </span>
                        </p>
                      </template>
                    </div>
                  </template>
                </b-datepicker>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <ModalConfirmation
      :title="modalConfim.title"
      :message="modalConfim.message"
      @confirm="saveNewEvaluationDate"
    />
  </div>
</template>
