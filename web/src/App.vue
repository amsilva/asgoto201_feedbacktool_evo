<script>
import dateHelper from "@/helpers/dateHelper";
export default {
  name: "App",
  mixins: [dateHelper],
  created() {
    this.$moment.updateLocale("en", {
      months: this.dateGetAllMonths(),
      monthsShort: this.dateGetAllMonths(true),
      weekdays: this.dateGetAllWeekdays(),
      weekdaysShort: this.dateGetAllWeekdays(true),
      relativeTime: {
        future: "em %s",
        past: "%s atrás",
        s: "há alguns segundos",
        ss: "%d segundos",
        m: "um minuto",
        mm: "%d minutos",
        h: "uma hora",
        hh: "%d horas",
        d: "um dia",
        dd: "%d dias",
        w: "um semana",
        ww: "%d semanas",
        M: "um mês",
        MM: "%d meses",
        y: "um ano",
        yy: "%d anos"
      }
    });
  }
};
</script>

<template>
  <div id="app">
    <router-view />
    <div id="shadow" :class="{ show: $store.getters.showLoader }" />
  </div>
</template>
