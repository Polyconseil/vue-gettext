import interpolate from "./interpolate";
import translate from "./translate";
import { VNode, DirectiveBinding, Directive, watch } from "vue";
import { GetText } from ".";

const updateTranslation = (plugin: GetText, el, binding: DirectiveBinding, vnode: VNode) => {
  const attrs = vnode.props || {};
  const msgid = el.dataset.msgid;
  const translateContext = attrs["translate-context"];
  const translateN = attrs["translate-n"];
  const translatePlural = attrs["translate-plural"];
  const isPlural = translateN !== undefined && translatePlural !== undefined;
  const disableHtmlEscaping = attrs["render-html"] === "true";

  if (!isPlural && (translateN || translatePlural)) {
    throw new Error("`translate-n` and `translate-plural` attributes must be used together:" + msgid + ".");
  }

  if (!plugin.options.silent && attrs["translate-params"]) {
    console.warn(
      `\`translate-params\` is required as an expression for v-translate directive. Please change to \`v-translate='params'\`: ${msgid}`
    );
  }

  let translation = translate(plugin).getTranslation(
    msgid,
    translateN,
    translateContext,
    isPlural ? translatePlural : null,
    el.dataset.currentLanguage
  );

  const context = Object.assign(binding.instance, binding.value);
  let msg = interpolate(plugin)(translation, context, null, disableHtmlEscaping);

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
export default function directive(plugin: GetText): Directive {
  const update = (el: HTMLElement, binding: DirectiveBinding, vnode: VNode) => {
    // Store the current language in the element's dataset.
    el.dataset.currentLanguage = plugin.current;
    updateTranslation(plugin, el, binding, vnode);
  };
  return {
    beforeMount(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
      // Get the raw HTML and store it in the element's dataset (as advised in Vue's official guide).
      if (!el.dataset.msgid) {
        const msgid = el.innerHTML;
        el.dataset.msgid = msgid;
      }

      watch(plugin, () => {
        update(el, binding, vnode);
      });

      update(el, binding, vnode);
    },
    updated(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
      update(el, binding, vnode);
    },
  };
}
