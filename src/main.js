import Vue from 'vue'
import App from './App.vue'
import VueDragDrop from "vue-drag-drop";
import { VTooltip } from 'v-tooltip'
import '@/assets/style/style.scss';

Vue.use(VueDragDrop);
Vue.directive('tooltip', VTooltip);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
