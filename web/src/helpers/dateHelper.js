const dateHelper = {
  data() {
    return {
      dateMonths: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ],
      dateWeekdays: [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado"
      ]
    };
  },
  methods: {
    dateGetAllWeekdays(short) {
      if (short)
        return this.dateWeekdays.map(name => name.substr(0, 3));
      return this.dateWeekdays;
    },
    dateGetMonth(month, short) {
      return short
        ? this.dateMonths[month].substr(0, 3)
        : this.dateMonths[month];
    },
    dateGetAllMonths(short) {
      if (short)
        return this.dateMonths.map(name => name.substr(0, 3));
      return this.dateMonths;
    },
    dateGetMonthString(data, extense) {
      let month = this.dateMonths[parseInt(data) + 1];
      return extense ? month : month.substr(0, 3);
    }
  }
};

export default dateHelper;
