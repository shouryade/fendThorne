import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import DKToast from "vue-dk-toast";
import "@/index.css";

const app = createApp(App);

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
