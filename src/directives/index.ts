import { App } from 'vue'
import VLoading from './v-loading'
export default {
    install (vue: App) {
        vue.directive('loading', VLoading)
    }
}