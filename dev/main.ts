import { createApp, computed } from "vue";
import App from "./App.vue";
import "./index.css";
import GetTextPlugin from "/@gettext/";
import translations from "./translations.json";

const app = createApp(App);

app.use(GetTextPlugin, {
  availableLanguages: {
    en_GB: "British English",
    fr_FR: "Français",
    it_IT: "Italiano",
  },
  mixins: {
    currentWithoutRegion: (lang) => computed(() => lang.current.toLowerCase().split("_")[0]),
  },
  defaultLanguage: "en_GB",
  translations: translations,
});

app.mount("#app");

export default app;
