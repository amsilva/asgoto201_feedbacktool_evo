class Squad {
  getRequiredFields() {
    return {
      name: "",
      techlead: "",
      members: ""
    }
  }
  getSquadFields() {
    return {
      active: true,
      name: "",
      techlead: "",
      registered: "",
      members: []
    }
  }
}
export default Squad;
