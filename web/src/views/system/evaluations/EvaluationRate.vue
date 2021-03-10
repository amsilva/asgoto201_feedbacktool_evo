<script>
import { Auth, Firestore } from "@/requests/firebase";
import evltHelper from "@/helpers/evaluationHelper";
import formHelper from "@/helpers/formHelper";
import moment from "moment";
// import Evaluation from "@/classes/Evaluation";
export default {
  mixins: [evltHelper, formHelper, Auth, Firestore],
  data() {
    return {
      user: {},
      today: moment().startOf("day").format("X"),
      evaluation: null,
      rate: null,
      members: [],
      config: {
        evaluations: {}
      },
      form: {
        evaluation: [],
        comment: []
      },
      error: {
        evaluation: []
      }
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
      .then(config => (this.config.evaluations = config.find(x => x.id === "evaluations")))
      .then(() => this.fsGetQry("evaluations-dates", "id_squad", "==", this.user.id_squad)
        .then(evaluations => evaluations.find(evl => {
          const initialDate = moment(evl.initialDate, "DD/MM/YYYY").startOf("day").format("X");
          const finishDate = moment(evl.finishDate, "DD/MM/YYYY").startOf("day").format("X");
          return (initialDate < this.today && this.today < finishDate);
        }))
        .then(evaluation => !evaluation
          ? this.$router.replace("/dashboard")
          : (this.evaluation = evaluation)
        )
        .then(() => this.fsGet("evaluations-rates", this.evaluation.id))
        .then(rate => (this.rate = rate ? {} : rate))
        .then(() => this.fsGetQry("users", "id_squad", "==", this.user.id_squad))
        .then(members => members.filter(x => x.id !== this.user.id))
        .then(members => (this.members = members))
        .then(() => (this.form.evaluation = new Array(this.members.length).fill("")))
        .then(() => (this.form.comment = new Array(this.members.length).fill("")))
        .then(() => (this.error.evaluation = new Array(this.members.length).fill("")))
      )
      .then(() => this.$store.commit("showLoader", false));
  },
  methods: {
    getRate() {
      let rate = { id_squad: null };

      rate = { ...rate, ...this.rate };
      if (!rate.id_squad) rate.id_squad = this.user.id_squad;

      this.members.map((member, key) => {
        if (!rate[member.id]) rate[member.id] = new Array();

        rate[member.id].push({
          rate: this.form.evaluation[key],
          comment: this.form.comment[key]
        })
      });

      return rate;
    },
    saveEvaluation(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      new Promise(resolve => resolve(this.$store.commit("showLoader", true)))
        .then(() => this.checkForm())
        .then(check => check
          ? this.fsSet("evaluations-rates", this.getRate(), this.evaluation.id)
            .then(res => { if(res && res.id) {
              this.evaluation.done.push(this.user.id);
              this.fsSet("evaluations-dates", this.evaluation, this.evaluation.id)
                .then(res => res && res.id
                  ? this.$router.push("/dashboard")
                  : null
                )
            }})
          : null
        )
        .then(() => this.$store.commit("showLoader", false));
    },
    checkForm() {
      let count = 0;
      this.members.map((member, mkey) => {
        if (!this.form.evaluation[mkey])
          this.error.evaluation[mkey] = this.formValidateEmpty() || "";
        if (this.form.evaluation[mkey])
          this.error.evaluation[mkey] = this.formValidateEmpty(this.form.evaluation[mkey]) || "";
        if(this.error.evaluation[mkey]) count++;
      })
      this.$forceUpdate();
      return !count;
    }
  }
};
</script>

<template>
  <div id="EvolutionRatePage">
    <form>
      <div class="columns">
        <div class="column is-3">
          <div class="box">
            <div class="title fn-s12 m-b-07">
              Avaliação 360
            </div>
            <p class="m-tb-07" v-if="evaluation">
              De {{ evaluation.initialDate }} a {{ evaluation.finishDate }}
            </p>
            <div class="is-flex flex-wrap">
              <a
                class="button flex-grow bg-green m-r-1"
                href="#"
                @click="saveEvaluation"
              >
                Enviar
              </a>
              <router-link to="/profile" class="flex-grow button bg-grey">
                voltar
              </router-link>
            </div>
          </div>
        </div>
        <div class="column is-9">
          <div class="box">
            <div class="columns is-multiline">
              <template v-for="(member, mkey) in members">
                <div class="column is-4" :key="member.id">
                  <div class="bd p-t-1 p-lr-1">
                    <p class="fn-s12">{{ member.name }}</p>
                    <div class="avatar m-t-05 m-b-1">
                      <figure class="image is-square">
                        <img src="https://bulma.io/images/placeholders/480x480.png" />
                      </figure>
                    </div>
                    <b-field
                      :type="{ 'is-danger': error.evaluation[mkey] }"
                      :message="error.evaluation[mkey]"
                    >
                      <b-select placeholder="Selecione" v-model="form.evaluation[mkey]">
                        <template v-for="(evaluation, key) in config.evaluations">
                          <option
                            v-if="key !== 'id'"
                            :value="key"
                            :key="'access-' + key"
                          >
                            {{ evaluation }}
                          </option>
                        </template>
                      </b-select>
                    </b-field>
                    <b-field>
                      <b-input
                        maxlength="200"
                        type="textarea"
                        v-model="form.comment[mkey]"
                      />
                    </b-field>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
