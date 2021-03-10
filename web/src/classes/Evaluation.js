class Evaluation {
  getRequiredFields() {
    return {
      id: "",
      frequency: "",
      initialDate: "",
      finishDate: "",
      manyTimes: ""
    }
  }
  getEvaluationFields() {
    return {
      active: true,
      frequency: null,
      initialDate: null,
      finishDate: null,
      lastInitialDate: null,
      lastFinishDate: null
    }
  }
  getEvaluationRate() {
    return {
      evaluation: 0,
      comment: ""
    }
  }
}
export default Evaluation;
