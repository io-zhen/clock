import {
	createSSRApp
} from "vue";
import App from "./App.vue";

import VueParticles from 'vue-particles'
export function createApp() {
	const app = createSSRApp(App);
	app.use(VueParticles)
	return {
		app,
	};
}
