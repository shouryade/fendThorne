import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import DKToast from "vue-dk-toast";
import VueAnalytics from 'vue-analytics';
import "@/index.css";

const app = createApp(App);

// Vue.use(VueAnalytics, {
//   id: 'UA-xxxxxxxxx-x'
// });

app.use(router);
app.use(store);
app.use(DKToast, {
  duration: 5000,
  styles: {
    color: "white",
    boxShadow: "none",
    width: "300px",
    alignSelf: "flex-end",
  },
  positionX: "right",
  positionY: "top",
  disableClick: true,
});
app.mount("#app");
