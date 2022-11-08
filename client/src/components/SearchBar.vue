<template>
  <section class="search-bar">
    <div class="input-container">
      <input
        class="search-input"
        type="text"
        placeholder="Search Timeline"
        v-model="searchTerm"
        @keyup="search"
      />
    </div>
    <div class="icon-container">
      <i class="fa-solid fa-magnifying-glass"></i>
    </div>
  </section>
</template>

<script>
export default {
  name: "SearchBar",
  data: function () {
    return {
      searchTerm: "",
    };
  },
  methods: {
    search() {
      this.$emit("search", this.searchTerm);
    },
  },
};
</script>
