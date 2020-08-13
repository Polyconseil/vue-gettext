import interpolate from "./interpolate";
import translate from "./translate";
import looseEqual from "./looseEqual";
import uuid from "./uuid";
import { GetText } from ".";
import { VNode } from "vue";

const updateTranslation = (plugin: GetText, el, binding, vnode: VNode) => {
  let attrs = vnode.el.attributes || {};
  let msgid = el.dataset.msgid;
  let translateContext = attrs["translate-context"];
  let translateN = attrs["translate-n"];
  let translatePlural = attrs["translate-plural"];
  let isPlural = translateN !== undefined && translatePlural !== undefined;
  let context = vnode.appContext;
  let disableHtmlEscaping = attrs["render-html"] === "true";

  if (!isPlural && (translateN || translatePlural)) {
    throw new Error("`translate-n` and `translate-plural` attributes must be used together:" + msgid + ".");
  }

  if (!plugin.options.silent && attrs["translate-params"]) {
    console.warn(
      `\`translate-params\` is required as an expression for v-translate directive. Please change to \`v-translate='params'\`: ${msgid}`
    );
  }

  if (binding.value && typeof binding.value === "object") {
    context = Object.assign({}, vnode.appContext, binding.value);
  }

  const translator = translate(plugin);

  let translation = translator.getTranslation(
    msgid,
    translateN,
    translateContext,
    isPlural ? translatePlural : null,
    el.dataset.currentLanguage
  );

  let msg = interpolate(plugin)(translation, context, disableHtmlEscaping);

  el.innerHTML = msg;
};

/**
 * A directive to translate content according to the current language.
 *
 * Use this directive instead of the component if you need to translate HTML content.
 * It's too tricky to support HTML content within the component because we cannot get the raw HTML to use as `msgid`.
 *
 * This directive has a similar interface to the <translate> component, supporting
 * `translate-comment`, `translate-context`, `translate-plural`, `translate-n`.
 *
 * `<p v-translate translate-comment='Good stuff'>This is <strong class='txt-primary'>Sparta</strong>!</p>`
 *
 * If you need interpolation, you must add an expression that outputs binding value that changes with each of the
 * context variable:
 * `<p v-translate="fullName + location">I am %{ fullName } and from %{ location }</p>`
 */
export default function component(plugin: GetText) {
  return {
    beforeMount(el, binding, vnode) {
      // Get the raw HTML and store it in the element's dataset (as advised in Vue's official guide).
      let msgid = el.innerHTML;
      el.dataset.msgid = msgid;

      // Store the current language in the element's dataset.
      el.dataset.currentLanguage = plugin.app.config.globalProperties.$language.current;

      // Output an info in the console if an interpolation is required but no expression is provided.
      if (!plugin.options.silent) {
        let hasInterpolation = msgid.indexOf(interpolate.INTERPOLATION_PREFIX) !== -1;
        if (hasInterpolation && !binding.expression) {
          console.info(
            `No expression is provided for change detection. The translation for this key will be static:\n${msgid}`
          );
        }
      }

      updateTranslation(plugin, el, binding, vnode);
    },

    // TODO: does updated have params?
    updated(el, binding, vnode) {
      let doUpdate = false;

      // Trigger an update if the language has changed.
      const language = plugin.app.config.globalProperties.$language.current;
      if (el.dataset.currentLanguage !== language) {
        el.dataset.currentLanguage = language;
        doUpdate = true;
      }

      // Trigger an update if an optional bound expression has changed.
      if (!doUpdate && binding.expression && !looseEqual(binding.value, binding.oldValue)) {
        doUpdate = true;
      }

      if (doUpdate) {
        updateTranslation(plugin, el, binding, vnode);
      }
    },
  };
}
