class User {
  getUserAuth() {
    return {
      displayName: null,
      email: null,
      photoURL: null,
      phoneNumber: null,
      uid: null
    };
  }
  getRequiredFields() {
    return {
      name: "",
      email: "",
      birthday: "",
      profile: "",
      workBirthday: ""
    };
  }
  getUserFields() {
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
  }
}
export default User;
