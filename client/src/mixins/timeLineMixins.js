export default {
  methods: {
    formatFilter(item) {
      return {
        id: item.id,
        resource_type: item.resource_type,
        name: this.uppercase(item.resource_type.split("_").join(" ")),
        selected: false,
      };
    },
    uppercase(str) {
      const array1 = str.split(" ");
      const newarray1 = [];

      for (let x = 0; x < array1.length; x++) {
        newarray1.push(array1[x].charAt(0).toUpperCase() + array1[x].slice(1));
      }
      return newarray1.join(" ");
    },
    formatItemName(item) {
      return this.uppercase(
        [item.topic_data.name, item.resource_type.split("_").join(" ")].join(" ")
      );
    },
    getImageURL(path) {
      return require("../assets" + path.replace("assets/", ""));
    },
  },
};
