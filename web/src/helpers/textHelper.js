const textHelper = {
  methods: {
    firstToUpper(text) {
      let newText = [];
      text
        .split(" ")
        .forEach(word =>
          newText.push(word.substr(0, 1).toUpperCase() + word.substr(1))
        );
      return newText.join(" ");
    }
  }
};

export default textHelper;
