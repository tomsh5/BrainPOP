<template>
  <section class="zoom-modal">
    <div class="closeIcon" @click="closeModal()">
      <i class="fa-solid fa-xmark"></i>
    </div>
    <div class="top-container">
      <div class="timeline_item_icon_container">
        <img
          class="timeline_item_icon"
          :src="getImageURL(item.topic_data.icon_path)"
        />
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
    <div class="bottom-container">
      <div>
        <h1>{{ item.comment }}!</h1>
      </div>
      <div v-if="item.score" class="score-container">
        <span>Score</span>
        <span
          ><b>{{ item.score }}/{{ item.possible_score }}</b></span
        >
      </div>
    </div>
  </section>
</template>

<script>
import timeLineMixins from "../mixins/timeLineMixins";
export default {
  name: "ZoomModal",
  props: ["item", "showModal"],
  mixins: [timeLineMixins],
  methods: {
    closeModal() {
      this.$emit("closeModal", true);
    },
  },
};
</script>
