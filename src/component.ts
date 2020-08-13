import translate from "./translate";
import uuid from "./uuid";
import { GetText } from ".";
import { Component, h, AppContext, computed, SetupContext, Text } from "vue";

/**
 * Translate content according to the current language.
 */
export default function component(plugin: GetText) {
  return {
    name: "translate",

    props: {
      tag: {
        type: String,
        default: "span",
      },
      // Always use v-bind for dynamically binding the `translateN` prop to data on the parent,
      // i.e.: `:translateN`.
      translateN: {
        type: Number,
        required: false,
      },
      translatePlural: {
        type: String,
        required: false,
      },
      translateContext: {
        type: String,
        required: false,
      },
      translateParams: {
        type: Object,
        required: false,
      },
      // `translateComment` is used exclusively by `easygettext`'s `gettext-extract`.
      translateComment: {
        type: String,
        required: false,
      },
    },

    setup(props: any, context: SetupContext<any>) {
      const isPlural = props.translateN !== undefined && props.translatePlural !== undefined;
      if (!isPlural && (props.translateN || props.translatePlural)) {
        throw new Error(`\`translate-n\` and \`translate-plural\` attributes must be used together: ${context.slots.default()[0]?.children}.`);
      }

      const globalProps = plugin.app.config.globalProperties;

      const translation = computed(() => {
        const translator = translate(plugin);
        let msgid = "";
        const slotItem = context.slots.default()[0];
        if (slotItem?.type !== Text) {
          throw new Error("The <translate> component expects a single string child");
        }
        msgid = context.slots.default()[0]?.children as string || msgid;
        let translation = translator.getTranslation(
          msgid,
          props.translateN,
          props.translateContext,
          isPlural ? props.translatePlural : null,
          globalProps.$language.current
        );

        return globalProps.$gettextInterpolate(translation, props.translateParams);
      });

      // The text must be wraped inside a root HTML element, so we use a <span> (by default).
      // https://github.com/vuejs/vue/blob/a4fcdb/src/compiler/parser/index.js#L209
      return () => h(props.tag, translation.effect());
    },
  } as Component;
}
