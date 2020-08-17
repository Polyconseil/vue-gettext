import { GetText } from ".";
import { getCurrentInstance } from "vue";

export const getPlugin = (): GetText => {
  return getCurrentInstance()?.appContext.config.globalProperties.$language;
};
