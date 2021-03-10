<script>
import "./navbar.scss";
export default {
};
</script>

<template>
  <b-navbar class="fixed-top">
    <template slot="end">
      <!-- <b-navbar-item tag="div">
        <router-link to="/evaluations/results">
          <strong>Avaliações</strong>
        </router-link>
      </b-navbar-item> -->
      <div class="buttons" v-if="$store.getters.userFirestore">
        <template
          v-if="$store.getters.userFirestore.profile === '99'">
          <router-link to="/evaluations" class="button">
            <strong>Avaliações</strong>
          </router-link>
          <router-link to="/squads" class="button">
            <strong>Equipes</strong>
          </router-link>
          <router-link to="/users" class="button">
            <strong>Usuários</strong>
          </router-link>
        </template>
      </div>
    </template>
  </b-navbar>
</template>
