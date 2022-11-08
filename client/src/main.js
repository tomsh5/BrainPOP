import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import moment from "moment";
import "./styles/main.scss";

Vue.config.productionTip = false;

Vue.filter("formatDate", (value) => {
  if (value) {
    var date = new Date(value * 1000);
    return moment(String(date.toISOString())).format("MMM DD, YYYY . h:mm a");
  }
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
