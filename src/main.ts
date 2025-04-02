import { createApp } from "vue";
import App from "./App.vue";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import "@/styles/index.scss";
import router from "./router";
import directives from "./directives";

const app = createApp(App)
app.use(router)
app.use(Antd)
app.use(directives)
app.mount("#app")
