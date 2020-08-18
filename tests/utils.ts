import { ComponentOptionsWithoutProps } from "vue";
import GetTextPlugin, { GetTextOptions } from "../src";
import { mount } from "@vue/test-utils";

export const mountWithPlugin = (pluginOptions: Partial<GetTextOptions>) => (
  componentOptions: ComponentOptionsWithoutProps
) =>
  mount(componentOptions, {
    global: {
      plugins: [GetTextPlugin], // TODO: params
      // plugins: [
      //   [
      //     GetTextPlugin,
      //     pluginOptions,
      //   ],
      // ],
    },
  });
