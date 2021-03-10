const formHelper = {
  methods: {
    formValidatePassword(pass, pass2) {
      if (!pass) return this.formValidateEmpty(pass);
      if (!pass2) return this.formValidateEmpty(pass2);
      if (pass !== pass2) return "Confirmação de senha é diferente da senha.";
      return false;
    },
    formValidateMail(mail) {
      const regex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.([a-z]+))?$/i;
      if (mail) mail = mail.toLowerCase().trim();
      if (!mail) return this.formValidateEmpty(mail);
      if (!regex.test(mail)) return "O e-mail digitado é inválido";
      return false;
    },
    formValidateName(name) {
      if (name) name = name.trim();
      if (!name) return this.formValidateEmpty(name);
      if (name.split(" ").length < 2) return "Digite seu nome completo";
      return false;
    },
    formValidatePhone(phone, cel) {
      if (phone) {
        phone = phone.match(/\d+/g).join("");
        if (!phone) return this.formValidateEmpty(phone);
        if ((!cel && phone.length < 10) || (cel && phone.length < 11))
          return "Número de telefone inválido.";
      }
      return false;
    },
    formValidateDate(date) {
      let d = this.dateFromString(date);
      let now = new Date();
      if (!date) return this.formValidateEmpty(date);
      if (date.length !== 10) return "Campo incompleto";
      if (Object.prototype.toString.call(d) === "[object Error]")
        return "Data inválida";
      if (Object.prototype.toString.call(d) === "[object Date]") {
        if (isNaN(d.getTime())) {
          return "Data inválida";
        }
      }
      if (d >= now) return "Data inválida";
    },
    dateFromString(date) {
      if (date) {
        let [day, month, year] = date.split("/");
        day = parseInt(day);
        month = parseInt(month);
        month--;
        year = parseInt(year);
        let newDate = new Date();
        const err = new Error("Data invalida");
        if (month > 11 || month < 0) {
          return err;
        } else if (month < 7) {
          if (month === 1) {
            if (!(year % 4) && day > 29) {
              return err;
            } else if (day > 28) {
              return err;
            }
          } else if (!(month % 2)) {
            if (day > 31) {
              return err;
            }
          } else if (day > 30) {
            return err;
          }
        } else if (month > 6) {
          if (month % 2) {
            if (day > 31) {
              return err;
            }
          } else if (day > 30) {
            return err;
          }
        }

        newDate.setFullYear(year, month, day);
        return newDate;
      }
    },
    formValidateLength(text, length) {
      if (!text || !text.length) return "Campo obrigatório";
      text = String(text);
      if (text.length < length)
        return (
          "Quantidade valor digitado é menor que " + length + " caracteres."
        );
      return false;
    },
    formValidateArray(array) {
      if (!array || !array.length) return "Campo obrigatório";
      return false;
    },
    formValidateEmpty(text) {
      if (text) text = String(text).trim();
      if (!text || !text.length) return "Campo obrigatório";
      return false;
    }
  }
};

export default formHelper;
