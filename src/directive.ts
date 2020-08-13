import interpolate from "./interpolate";
import translate from "./translate";
import looseEqual from "./looseEqual";
import uuid from "./uuid";
import { GetText } from ".";
import { VNode, DirectiveBinding } from "vue";

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
  return (el: HTMLElement, binding: DirectiveBinding, vnode: VNode) => {
    // Get the raw HTML and store it in the element's dataset (as advised in Vue's official guide).
    const msgid = el.innerHTML;
    el.dataset.msgid = msgid;

    // Store the current language in the element's dataset.
    el.dataset.currentLanguage = plugin.app.config.globalProperties.$language.current;

    updateTranslation(plugin, el, binding, vnode);
    return {};
  };
}
