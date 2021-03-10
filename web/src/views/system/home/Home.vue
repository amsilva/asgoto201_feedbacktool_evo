<style lang="scss" scoped>
@import "./home";
</style>

<script>
import dataStats from "@/data/stats";
import dataHighlight from "@/data/highlight";

export default {
  components: {},
  data() {
    return {
      cardStat: dataStats,
      cardHighlight: dataHighlight
    };
  }
};
</script>

<template>
  <div class="home">
    <div class="columns">
      <div class="column is-3">
        <div class="box"></div>
      </div>
      <div class="column is-9"></div>
    </div>
  </div>
</template>
