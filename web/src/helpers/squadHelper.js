const evaluationHelper = {
  methods: {
    sqdGetRequired() {
      return {
        name: "",
        techlead: "",
        members: ""
      }
    },
    sqdGetFields() {
      return {
        active: true,
        name: "",
        techlead: "",
        registered: "",
        members: []
      }
    }
  }
};

export default evaluationHelper;
