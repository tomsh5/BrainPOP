<template>
  <section
    v-if="filter"
    class="activity-filter"
    :class="{ frame_selected: filter.selected }"
    @click="clicked"
  >
    <div class="filter-content">
      <div v-if="filter.selected" class="checkbox">
        <i class="fa-solid fa-check"></i>
      </div>
      <span>
        {{ filter.name }}
      </span>
    </div>
  </section>
</template>

<script>
export default {
  name: "ActivityFilter",
  props: ["filter"],
  methods: {
    clicked() {
      this.$emit("clicked", this.filter.id);
    },
  },
};
</script>

<style lang="scss">
.fa-check {
  margin-right: 5px;
}
</style>
