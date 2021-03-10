const userHelper = {
  methods: {
    usrGetFieldsAuth() {
      return {
        displayName: null,
        email: null,
        photoURL: null,
        phoneNumber: null,
        uid: null
      };
    },
    usrGetFields() {
      return {
        active: true,
        name: "",
        email: "",
        phoneNumber: "",
        profile: "analisis",
        photoURL: null,
        birthday: 0,
        rg: "",
        cpf: "",
        id_squad: null,
        work: {
          birthday: 0,
          office: "",
          salary: "",
          flybackOption: false,
          liveChangeOption: false
        },
        socialMedia: []
      };
    },
    usrGetRequired() {
      return {
        name: "",
        email: "",
        birthday: "",
        profile: "",
        workBirthday: ""
      };
    },
    usrGetRate(rates) {
      let results = [];
      let highter;
      rates.map(evaluation => {
        let index = results.findIndex(x => x.rate === evaluation.rate);
        if (index < 0)
          return results.push({ rate: evaluation.rate, value: 1 });
        return results[index].value++;
      });
      results.map(rate => {
        if (!highter) highter = rate;
        highter = highter.value < rate.value ? rate : highter;
      })
      highter.total = rates.length;
      highter.percent = parseInt((highter.value / rates.length) * 100);
      return highter;
    },
    usrGetGfxRate(squad, rates) {
      let graphic = this.getGfxBaseData();
      let table = [];

      if (squad && rates) {
        rates.map(evaluation => {
          graphic[evaluation.rate].y++;
          table.push(this.getGfxTableLine(table.length + 1, squad.name, evaluation));
        });
        while (table.length < squad.members.length) {
          graphic[0].y++;
          table.push(this.getGfxTableLine(table.length + 1, squad.name));
        }
      }
      return { graphic, table };
    },
    getGfxBaseData() {
      return [
        { name: "Não sei avaliar", y: 0 },
        { name: "Transformador", y: 0 },
        { name: "Evolutivo Rápido", y: 0 },
        { name: "Evolutivo Lento", y: 0 },
        { name: "Não evolutivo", y: 0 }
      ];
    },
    getGfxTableLine(index, name, evaluation) {
      return {
        id: index,
        squad: name,
        evaluation: evaluation && evaluation.rate ? evaluation.rate : 0,
        feedback: evaluation && evaluation.comment ? evaluation.comment : ""
      }
    }
  }
};

export default userHelper;
