import { createApp } from "vue";
import App from "./App.vue";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import "./styles/index.scss";
import router from "./router";

createApp(App).use(router).use(Antd).mount("#app");
