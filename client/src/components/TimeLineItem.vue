<template>
  <div>
    <div class="timeline_item">
      <div class="container">
        <div class="timeline_item_details">
          <i class="fa-solid fa-xmark" @click="remove"></i>
          <div
            class="timeline_item_icon_container"
            :class="{ junior: isJunior }"
          >
            <img
              class="timeline_item_icon"
              :src="getImageURL(item.topic_data.icon_path)"
            />
            <div v-if="isJunior" class="junior_text">Jr.</div>
          </div>
          <div class="timeline_item_labels">
            <div class="timeline_item_labels_header">
              {{ formatItemName(item) }}
            </div>
            <div class="timeline_item_labels_subHeader">
              {{ item.d_created | formatDate }}
            </div>
          </div>
        </div>
      </div>
      <div class="timeline_item_actions">
        <div v-if="item.score" class="timeline_item_actions_score">
          <span style="margin-right: 5px">Score</span>
          <span
            ><b>{{ item.score }}/{{ item.possible_score }}</b></span
          >
        </div>
        <div class="timeline_item_actions_view" @click="openModal()">
          <i class="fa-solid fa-eye"></i>
          <span>View work</span>
        </div>
      </div>
    </div>
    <div class="line"></div>
  </div>
</template>

<script>
import timeLineMixins from "../mixins/timeLineMixins";
export default {
  name: "TimeLineItem",
  props: ["item"],
  mixins: [timeLineMixins],
  data() {
    return {
      isJunior: this.item.product === "bpjr",
    };
  },
  methods: {
    openModal() {
      this.$emit("openModal", this.item);
    },
    remove() {
      this.$emit("remove", "");
    },
  },
};
</script>

<style lang="scss">
.fa-eye {
  margin-right: 5px;
}
</style>
