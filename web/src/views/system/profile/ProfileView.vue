<script>
import { Auth, Firestore } from "@/requests/firebase";
import dateHelper from "@/helpers/dateHelper";
import userHelper from "@/helpers/userHelper";
import moment from "moment";

export default {
  mixins: [dateHelper, userHelper, Auth, Firestore],
  data() {
    return {
      toggleTimeline: false,
      today: moment().startOf("day").format("X"),
      evaluations: {},
      config: {
        evaluations: []
      },
      user: {
        id: null,
        timeline: [],
        socialMedia: [],
        work: {}
      }
    };
  },
  mounted() {
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
      .then(config => (this.profiles = config.find(x => x.id === "evaluations")))
      .then(() => this.fsGet("squads")
        .then(squads => {
          this.fsGetQry("squads-users", "id_user", "==", this.user.id)
            .then(timeline => (this.user.timeline = timeline.map(line => {
                line.squad = squads.find(x => x.id === line.id_squad);
                return line;
              })
              .sort((a, b) => a < b ? -1 : 1))
            );
          Promise.all([
            this.fsGetQry("evaluations-dates", "id_squad", "==", this.user.id_squad),
            this.fsGetQry("evaluations-rates", "id_squad", "==", this.user.id_squad)
          ])
            .then(res => res[0]
              .sort((a, b) => {
                a = moment(a.initialDate, "DD/MM/YYYY").format("X");
                b = moment(b.initialDate, "DD/MM/YYYY").format("X");
                return a > b ? -1 : 1
              })
              .map(evl => {
                const squad = squads.find(x => x.id === evl.id_squad);
                evl.initialDateTime = moment(evl.initialDate, "DD/MM/YYYY").format("X");
                evl.finishDateTime = moment(evl.finishDate, "DD/MM/YYYY").format("X");

                evl.closed = (
                  squad.members.length + 1 === evl.done.length ||
                  this.today > evl.finishDateTime
                );
                evl.current = (!evl.closed && this.today >= evl.initialDateTime &&
                  this.today <= evl.finishDateTime);
                evl.active = this.today < evl.initialDateTime;

                if(evl.closed) {
                  let rate = res[1].find(
                    x => x.id_squad === evl.id_squad && x.id === evl.id
                  )
                  evl.result = this.usrGetRate(rate[this.user.id]);
                }
                return evl;
              })
            )
            .then(evaluations => (this.evaluations = {
                current: evaluations.find(x => x.current && !x.done.includes(this.user.id)),
                last: evaluations.filter(x => !x.current && !x.active)[0]
              })
            );
        })
      )
      .then(() => this.$store.commit("showLoader", false));
  },
  computed: {
    workOffice() {
      return this.user.work.office || "";
    },
    workSalary() {
      return this.user.work.salary || "";
    },
    workFlyback() {
      return this.user.work.flybackOption ? "Sim" : "Não";
    },
    workLiveChange() {
      return this.user.work.liveChangeOption ? "Sim" : "Não";
    },
    userSocialMedia() {
      return this.user.socialMedia.length
        ? this.user.socialMedia.filter(x => x.type === "personal")
        : [];
    },
    professionalSocialMedia() {
      return this.user.socialMedia.length
        ? this.user.socialMedia.filter(x => x.type === "professional")
        : [];
    }
  },
  methods: {
    showAllTimeline() {
      this.toggleTimeline = !this.toggleTimeline;
    }
  }
};
</script>

<template>
  <div id="Profile">
    <div class="columns">
      <div class="column is-3">
        <div class="profile box grid">
          <div class="profile-avatar">
            <figure class="image is-square">
              <img src="https://bulma.io/images/placeholders/480x480.png" />
            </figure>
          </div>
          <div class="profile-name">
            <h1 class="title fn-s15 lh-2 m-b-0" v-if="user.name">
              {{ user.name }}
            </h1>
            <div class="fn-s1 lh-11">
              {{ workOffice }}
            </div>
          </div>
          <div class="profile-details">
            <div class="fn-s1 is-flex flex-center-v" v-if="user.email">
              <b-icon class="is-pulled-left" icon="mail" />
              <label>{{ user.email }}</label>
            </div>
            <div
              class="fn-s1 is-flex flex-center-v"
              v-if="user && user.phoneNumber"
            >
              <b-icon class="is-pulled-left" icon="phone" />
              <label>{{ user.phoneNumber }}</label>
            </div>
            <div
              class="fn-s1 is-flex flex-center-v"
              v-if="user && user.birthday"
            >
              <b-icon class="is-pulled-left" icon="cake" />
              <label>{{
                user.birthday | moment("DD / MMMM / YYYY ")
              }}</label>
            </div>
            <div
              class="fn-s1 is-flex flex-center-v"
              v-if="user && user.work.birthday"
            >
              <b-icon class="is-pulled-left" icon="briefcase" />
              <span>{{
                user.work.birthday | moment("from", "now")
              }}</span>
            </div>
          </div>
          <div
            class="profile-professional"
            v-if="professionalSocialMedia.length"
          >
            <h2 class="title fn-s12 m-b-03">Redes profissionais</h2>
            <div class="is-flex">
              <a
                v-for="(item, key) in professionalSocialMedia"
                class="button rounded bg-transparent"
                target="blank"
                :key="'socialMedia-' + item.name + '-' + key"
                :class="'tx-' + item.name"
                :href="item.url"
              >
                <b-icon class="is-pulled-left" pack="fab" :icon="item.name" />
              </a>
            </div>
          </div>
          <div class="profile-personal" v-if="userSocialMedia.length">
            <h2 class="title fn-s12 m-b-03">Redes pessoais</h2>
            <div class="is-flex">
              <a
                v-for="(item, key) in userSocialMedia"
                class="button rounded bg-transparent"
                target="blank"
                :key="'socialMedia-' + item.name + '-' + key"
                :class="'tx-' + item.name"
                :href="item.url"
              >
                <b-icon class="is-pulled-left" pack="fab" :icon="item.name" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-9">
        <div class="timeline box grid">
          <h2 class="title fn-s15 m-b-0 p-lr-15">Onde estou, que faço e o que fiz?</h2>
          <div class="timeline-grid" :class="{ 'toggle-show': toggleTimeline }">
            <template v-for="line in user.timeline">
              <div class="timeline-item" :key="line.join">
                <div class="timeline-date">
                  {{ line.join | moment("DD/MM/YYYY") }}
                  ~
                  <template v-if="line.quit">
                    {{ line.quit | moment("DD/MM/YYYY") }}
                  </template>
                  <template v-else>Até o momento</template>
                </div>
                <div class="timeline-details">
                  <div class="grid-left">
                    <div class="timeline-details-item">
                      <div class="fn-s08">Equipe</div>
                      <div class="fn-s1 has-text-weight-bold">
                        {{ line.squad ? line.squad.name : null }}
                      </div>
                    </div>
                    <div class="timeline-details-item">
                      <div class="fn-s08">Lider Técnico</div>
                      <a class="pipe-separator" href="#">
                        {{ line.squad.techlead.name }}
                      </a>
                    </div>
                  </div>
                  <div class="grid-right">
                    <div class="timeline-details-item">
                      <div class="fn-s08">Integrantes</div>
                      <template v-for="member in line.squad.members">
                        <a
                          v-if="member.id !== line.squad.techlead.id"
                          class="pipe-separator"
                          href="#"
                          :key="member.id"
                        >
                          {{ member.name }}
                        </a>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <a
            v-if="user.timeline.length > 1"
            class="m-lr-13 is-flex flex-center-v"
            @click="showAllTimeline"
          >
            <b-icon class="is-pulled-left" icon="plus" />
            <div class="fn-s1 lh-1 m-t-02">Ver lista de projetos completa</div>
          </a>
        </div>
        <div class="evaluations box" v-if="evaluations.current || evaluations.last">
          <h2 class="title fn-s15 m-b-07">Avaliações</h2>
          <div :class="{ 'evaluations-grid': evaluations.current && evaluations.last }">
            <div
              v-if="evaluations.current"
              class="evaluations-container evaluations-current bd"
            >
              <div class="has-text-centered">
                <p>Há uma avalição pendente</p>
                <p>Por favor, preencha a avaliação atual.</p>
              </div>
              <router-link to="/evaluations/rate" class="button">
                Ir para avaliação
              </router-link>
            </div>
            <div
              v-if="evaluations.last"
              class="evaluations-container evaluations-next bd"
            >
              <h3
                class="fn-s2 lh-2 has-text-centered"
                :class="'tx-gfx-color-' + evaluations.last.result.rate"
              >
                <p class="fn-s3 lh-3 has-text-weight-bold">
                  {{ evaluations.last.result.percent}}%
                </p>
                {{ profiles[evaluations.last.result.rate] }}
              </h3>
              <router-link to="/evaluations/results" class="button is-outlined">
                ACOMPANHE OS RESULTADOS
              </router-link>
            </div>
            <div
              v-if="!evaluations.last && !evaluations.current"
              class="evaluations-container evaluations-empty bd"
            >
              <h3 class="fn-s2 has-text-centered">
                Você ainda não participou de nenhuma avaliação ou sua equipe não tem avaliações registradas.
              </h3>
            </div>
          </div>
          <!-- <pre>{{ evaluations }}</pre> -->
        </div>
        <div class="columns">
          <div class="column">
            <div class="register box grid full-height">
              <h3 class="title fn-s15 m-b-0">Dados cadastrais</h3>
              <div class="fn-s1 is-flex flex-center-v flex-spaced-h">
                <div>Cargo</div>
                <div class="has-text-weight-bold">
                  {{ workOffice }}
                </div>
              </div>
              <div class="fn-s1 is-flex flex-center-v flex-spaced-h">
                <div>RG</div>
                <div class="has-text-weight-bold" v-if="user.rg">
                  {{ user.rg }}
                </div>
              </div>
              <div class="fn-s1 is-flex flex-center-v flex-spaced-h">
                <div>CPF</div>
                <div class="has-text-weight-bold" v-if="user.cpf">
                  {{ user.cpf }}
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="register box grid full-height">
              <h3 class="title fn-s15 m-b-0">Dados de trabalho</h3>
              <div class="fn-s1 is-flex flex-center-v flex-spaced-h">
                <div>Salário atual</div>
                <div class="has-text-weight-bold">
                  {{ workSalary }}
                </div>
              </div>
              <div class="fn-s1 is-flex flex-center-v flex-spaced-h">
                <div>Disponível para Flyback</div>
                <div class="has-text-weight-bold">
                  {{ workFlyback }}
                </div>
              </div>
              <div class="fn-s1 is-flex flex-center-v flex-spaced-h">
                <div>Disponível para Mudança</div>
                <div class="has-text-weight-bold">
                  {{ workLiveChange }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
