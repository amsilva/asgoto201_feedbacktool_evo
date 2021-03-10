const evaluationHelper = {
  methods: {
    evltGetRequired() {
      return {
        id: "",
        frequency: "",
        initialDate: "",
        finishDate: "",
        manyTimes: ""
      }
    },
    evltGetFields() {
      return {
        active: true,
        frequency: null,
        initialDate: null,
        finishDate: null,
        lastInitialDate: null,
        lastFinishDate: null
      }
    }
  }
};

export default evaluationHelper;
