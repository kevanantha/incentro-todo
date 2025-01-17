import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);

app.use(VueQueryPlugin);

app.mount("#app");
