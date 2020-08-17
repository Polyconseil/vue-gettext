import interpolate from "./interpolate";
import translate from "./translate";
import { VNode, DirectiveBinding } from "vue";
import { getPlugin } from "./utils";
import { useGettext, GetText } from ".";

const updateTranslation = (plugin: GetText, el, binding: DirectiveBinding, vnode: VNode) => {
  let attrs = vnode.props || {};
  let msgid = el.dataset.msgid;
  let translateContext = attrs["translate-context"];
  let translateN = attrs["translate-n"];
  let translatePlural = attrs["translate-plural"];
  let isPlural = translateN !== undefined && translatePlural !== undefined;
  let context = binding.instance;
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

  const translator = translate;

  let translation = translator.getTranslation(
    msgid,
    translateN,
    translateContext,
    isPlural ? translatePlural : null,
    el.dataset.currentLanguage
  );

  let msg = interpolate(translation, context, disableHtmlEscaping);

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
export default function directive(plugin: GetText) {
  return (el: HTMLElement, binding: DirectiveBinding, vnode: VNode) => {
    // Get the raw HTML and store it in the element's dataset (as advised in Vue's official guide).
    if (!el.dataset.msgid) {
      const msgid = el.innerHTML;
      el.dataset.msgid = msgid;
    }

    // Store the current language in the element's dataset.
    el.dataset.currentLanguage = plugin.current;

    updateTranslation(plugin, el, binding, vnode);
    return {};
  };
}
