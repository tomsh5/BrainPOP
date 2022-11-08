import axios from "axios";

export default {
  async getActivitiesV1() {
    let res = await axios.get("http://localhost:3000/activities/v1");
    return res.data;
  },
  async getActivitiesV2() {
    let res = await axios.get("http://localhost:3000/activities/v2");
    return res.data;
  },
};
