<template>
  <section class="timeline">
    <header>
      <h1>Timeline</h1>
      <div class="versionToggle">
        <span
          class="version"
          @click="changeAPIVersion(2)"
          :class="{ 'version-selected': apiVersion === 2 }"
          >V2</span
        >
        <span
          class="version"
          @click="changeAPIVersion(1)"
          :class="{ 'version-selected': apiVersion === 1 }"
          >V1</span
        >
      </div>
    </header>
    <search-bar class="search" @search="searchFilter"></search-bar>
    <div class="filter-header">Filter By:</div>
    <div class="filters-container">
      <activity-filter
        v-for="filter in filters"
        :key="filter.id"
        @clicked="filterClicked"
        :filter="filter"
      >
      </activity-filter>
    </div>
    <div v-for="month in sortedActivitiesMonths" :key="month">
      <div v-if="getMonthActivitiesItems(month).length > 0">
        <div class="month-container-label">
          {{ month }}
        </div>
        <div class="line"></div>
        <time-line-item
          v-for="item in getMonthActivitiesItems(month)"
          @openModal="openModal"
          @remove="addToRemovedItems(item)"
          :key="item.id"
          :item="item"
        >
        </time-line-item>
      </div>
    </div>
    <div
      v-if="loadMoreResults"
      @click="showMoreResults"
      class="load-more-container"
    >
      <i class="fa-solid fa-chevron-down"></i>
      <span class="load-more">Load more</span>
    </div>
    <zoom-modal
      v-if="showModal"
      :item="zoomItem"
      @closeModal="closeModal"
    ></zoom-modal>
  </section>
</template>

<script>
import timeLineMixins from "../mixins/timeLineMixins";
import TimeLineItem from "@/components/TimeLineItem";
import ZoomModal from "@/components/ZoomModal";
import SearchBar from "@/components/SearchBar";
import activitiesService from "@/activitiesService";
import ActivityFilter from "@/components/ActivityFilter";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default {
  name: "TimeLine",
  components: { ActivityFilter, SearchBar, TimeLineItem, ZoomModal },
  mixins: [timeLineMixins],

  data() {
    return {
      showModal: false,
      activity: {},
      activities: [],
      zoomItem: {},
      months: [],
      activitiesByMonth: {},
      filters: [],
      sortedActivitiesMonths: [],
      searchTerm: "",
      removedItems: [],
      apiVersion: 1,
      loadMoreResults: true,
      additionalActivities: [],
    };
  },
  created() {
    this.getActivitiesData();
  },
  methods: {
    searchFilter(searchTerm) {
      this.resetFilters();
      this.searchTerm = searchTerm;
    },
    showMoreResults() {
      this.loadMoreResults = false;
      this.getActivitiesData();
    },
    addToRemovedItems(item) {
      this.removedItems.push(item.id);
    },
    openModal(item) {
      this.zoomItem = item;
      this.showModal = true;
    },
    filterClicked(id) {
      this.setFiltersSelection(id);
    },
    closeModal(arg) {
      this.showModal = false;
    },
    changeAPIVersion(newVersion) {
      this.apiVersion = newVersion;
      this.getActivitiesData();
    },
    getMonthActivitiesItems(month) {
      if (this.searchTerm && this.searchTerm.length > 0) {
        return this.activitiesByMonth[month].filter(
          (activity) =>
            activity.resource_type.includes(this.searchTerm) &&
            !this.removedItems.includes(activity.id)
        );
      }
      const allItemsFilter = this.filters.find((filter) => filter.id === -1);
      const selectedResources = this.filters
        .filter((filter) => filter.selected)
        .map((filter) => filter.resource_type);
      return allItemsFilter.selected
        ? this.activitiesByMonth[month].filter(
            (activity) => !this.removedItems.includes(activity.id)
          )
        : this.activitiesByMonth[month].filter(
            (activity) =>
              selectedResources.includes(activity.resource_type) &&
              !this.removedItems.includes(activity.id)
          );
    },
    async getActivitiesData() {
      let activities;
      if (this.apiVersion === 1) {
        activities = await activitiesService.getActivitiesV1();
      } else {
        activities = await activitiesService.getActivitiesV2();
        let results = [];
        activities.forEach((activityResult) => {
          activityResult.activities.forEach((activity) => {
            results.push({
              ...activity,
              resource_type: activityResult.resource_type,
            });
          });
        });
        activities = results;
      }
      this.$set(this, "activities", activities);
      this.buildResults();
    },
    setFiltersSelection(id) {
      this.searchTerm = "";
      const allItemsFilter = this.filters.find((filter) => filter.id === -1);
      if (id === allItemsFilter.id) {
        this.filters.find((filter) => (filter.selected = false));
        allItemsFilter.selected = true;
        return;
      }
      const filter = this.filters.find((filter) => filter.id === id);
      filter.selected = !filter.selected;

      const selectedFiltersCount = this.filters.filter(
        (filter) => filter.id !== -1 && filter.selected
      );
      allItemsFilter.selected = selectedFiltersCount.length === 0;
    },
    resetFilters() {
      this.filters.forEach((filter) => (filter.selected = false));
      const allItemsFilter = this.filters.find((filter) => filter.id === -1);
      allItemsFilter.selected = true;
    },
    buildResults() {
      this.filters = this.activities.map((item) => this.formatFilter(item));
      this.filters = [
        {
          id: -1,
          name: "All Work",
          selected: true,
        },
        ...this.filters.filter((item, pos, arr) => {
          return !pos || item.name !== arr[pos - 1].name;
        }),
      ];
      if (this.loadMoreResults) {
        this.additionalActivities = this.activities.splice(
          this.activities.length - 10,
          this.activities.length - 10
        );
      }
      const map_result = this.activities.map((item) => {
        const d = new Date(Number(item.d_created) * 1000);
        const month = monthNames[d.getMonth()];
        return {
          Month: month,
          Item: item,
        };
      });

      this.activitiesByMonth = map_result.reduce((container, item) => {
        if (container[item.Month] === undefined) {
          container[item.Month] = [item.Item];
        } else {
          container[item.Month].push(item.Item);
          container[item.Month] = container[item.Month]
            .sort((a, b) => {
              return (
                new Date(a.d_created * 1000) - new Date(b.d_created * 1000)
              );
            })
            .reverse();
        }
        return container;
      }, {});
      this.sortedActivitiesMonths = Object.keys(this.activitiesByMonth)
        .sort((a, b) => {
          return monthNames.indexOf(a) - monthNames.indexOf(b);
        })
        .reverse();
    },
  },
};
</script>