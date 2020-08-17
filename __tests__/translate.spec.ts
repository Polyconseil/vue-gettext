import Vue from "vue";

import GetTextPlugin, { GetText } from "../src/";
import translateRaw from "../src/translate";
import translations from "./json/translate.json";
import { mountWithPlugin } from "./utils";

const mount = mountWithPlugin({
  availableLanguages: {
    en_US: "American English",
    fr_FR: "Français",
  },
  defaultLanguage: "en_US",
  translations: translations,
});

const wrapper = mount({ template: "<div></div>" });
const plugin = wrapper.vm.$.appContext.config.globalProperties.$language as GetText;
const setLanguage = (lang: string) => (plugin.current = lang);

const translate = translateRaw(plugin);

describe("Translate tests", () => {
  let translated;
  beforeEach(() => {
    plugin.options = {
      ...plugin.options,
      silent: false,
    };
    setLanguage("en_US");
  });

  it("tests the getTranslation() method", () => {
    translated = translate.getTranslation("", 1, null, "fr_FR");
    expect(translated).toEqual("");

    translated = translate.getTranslation("Unexisting language", null, null, null, "be_FR");
    expect(translated).toEqual("Unexisting language");

    translated = translate.getTranslation("Untranslated key", null, null, null, "fr_FR");
    expect(translated).toEqual("Untranslated key");

    translated = translate.getTranslation("Pending", 1, null, null, "fr_FR");
    expect(translated).toEqual("En cours");

    translated = translate.getTranslation("%{ carCount } car", 2, null, null, "fr_FR");
    expect(translated).toEqual("%{ carCount } véhicules");

    translated = translate.getTranslation("Answer", 1, "Verb", null, "fr_FR");
    expect(translated).toEqual("Réponse (verbe)");

    translated = translate.getTranslation("Answer", 1, "Noun", null, "fr_FR");
    expect(translated).toEqual("Réponse (nom)");

    translated = translate.getTranslation("Pending", 1, null, null, "en_US");
    expect(translated).toEqual("Pending");

    // If no translation exists, display the default singular form (if n < 2).
    translated = translate.getTranslation("Untranslated %{ n } item", 0, null, "Untranslated %{ n } items", "fr_FR");
    expect(translated).toEqual("Untranslated %{ n } item");

    // If no translation exists, display the default plural form (if n > 1).
    translated = translate.getTranslation("Untranslated %{ n } item", 10, null, "Untranslated %{ n } items", "fr_FR");
    expect(translated).toEqual("Untranslated %{ n } items");

    // Test that it works when a msgid exists with and without a context, see #32.
    translated = translate.getTranslation("Object", null, null, null, "fr_FR");
    expect(translated).toEqual("Objet");
    translated = translate.getTranslation("Object", null, "Context", null, "fr_FR");
    expect(translated).toEqual("Objet avec contexte");

    // Ensure that pluralization is right in English when there are no English translations.
    translated = translate.getTranslation("Untranslated %{ n } item", 0, null, "Untranslated %{ n } items", "en_US");
    expect(translated).toEqual("Untranslated %{ n } items");
    translated = translate.getTranslation("Untranslated %{ n } item", 1, null, "Untranslated %{ n } items", "en_US");
    expect(translated).toEqual("Untranslated %{ n } item");
    translated = translate.getTranslation("Untranslated %{ n } item", 2, null, "Untranslated %{ n } items", "en_US");
    expect(translated).toEqual("Untranslated %{ n } items");

    // Test plural message with multiple contexts (default context and 'Context'')
    translated = translate.getTranslation("%{ carCount } car (multiple contexts)", 1, null, null, "en_US");
    expect(translated).toEqual("1 car");
    translated = translate.getTranslation("%{ carCount } car (multiple contexts)", 2, null, null, "en_US");
    expect(translated).toEqual("%{ carCount } cars");
    translated = translate.getTranslation("%{ carCount } car (multiple contexts)", 1, "Context", null, "en_US");
    expect(translated).toEqual("1 car with context");
    translated = translate.getTranslation("%{ carCount } car (multiple contexts)", 2, "Context", null, "en_US");
    expect(translated).toEqual("%{ carCount } cars with context");
  });

  it("tests the gettext() method", () => {
    let undetectableGettext = translate.gettext.bind(translate); // Hide from gettext-extract.

    setLanguage("fr_FR");
    expect(undetectableGettext("Pending")).toEqual("En cours");

    setLanguage("en_US");
    expect(undetectableGettext("Pending")).toEqual("Pending");
  });

  it("tests the pgettext() method", () => {
    let undetectablePgettext = translate.pgettext.bind(translate); // Hide from gettext-extract.

    setLanguage("fr_FR");
    expect(undetectablePgettext("Noun", "Answer")).toEqual("Réponse (nom)");

    setLanguage("en_US");
    expect(undetectablePgettext("Noun", "Answer")).toEqual("Answer (noun)");
  });

  it("tests the ngettext() method", () => {
    let undetectableNgettext = translate.ngettext.bind(translate); // Hide from gettext-extract.

    setLanguage("fr_FR");
    expect(undetectableNgettext("%{ carCount } car", "%{ carCount } cars", 2)).toEqual("%{ carCount } véhicules");

    setLanguage("en_US");
    expect(undetectableNgettext("%{ carCount } car", "%{ carCount } cars", 2)).toEqual("%{ carCount } cars");

    // If no translation exists, display the default singular form (if n < 2).
    setLanguage("fr_FR");
    expect(undetectableNgettext("Untranslated %{ n } item", "Untranslated %{ n } items", -1)).toEqual(
      "Untranslated %{ n } item"
    );

    // If no translation exists, display the default plural form (if n > 1).
    setLanguage("fr_FR");
    expect(undetectableNgettext("Untranslated %{ n } item", "Untranslated %{ n } items", 2)).toEqual(
      "Untranslated %{ n } items"
    );
  });

  it("tests the npgettext() method", () => {
    let undetectableNpgettext = translate.npgettext.bind(translate); // Hide from gettext-extract

    setLanguage("fr_FR");
    expect(undetectableNpgettext("Noun", "%{ carCount } car (noun)", "%{ carCount } cars (noun)", 2)).toEqual(
      "%{ carCount } véhicules (nom)"
    );

    setLanguage("en_US");
    expect(undetectableNpgettext("Verb", "%{ carCount } car (verb)", "%{ carCount } cars (verb)", 2)).toEqual(
      "%{ carCount } cars (verb)"
    );

    setLanguage("fr_FR");
    expect(undetectableNpgettext("Noun", "%{ carCount } car (noun)", "%{ carCount } cars (noun)", 1)).toEqual(
      "%{ carCount } véhicule (nom)"
    );

    setLanguage("en_US");
    expect(undetectableNpgettext("Verb", "%{ carCount } car (verb)", "%{ carCount } cars (verb)", 1)).toEqual(
      "%{ carCount } car (verb)"
    );

    // If no translation exists, display the default singular form (if n < 2).
    setLanguage("fr_FR");
    expect(
      undetectableNpgettext("Noun", "Untranslated %{ n } item (noun)", "Untranslated %{ n } items (noun)", 1)
    ).toEqual("Untranslated %{ n } item (noun)");

    // If no translation exists, display the default plural form (if n > 1).
    setLanguage("fr_FR");
    expect(
      undetectableNpgettext("Noun", "Untranslated %{ n } item (noun)", "Untranslated %{ n } items (noun)", 2)
    ).toEqual("Untranslated %{ n } items (noun)");
  });

  it("works when a msgid exists with and without a context, but the one with the context has not been translated", () => {
    expect(plugin.options.silent).toEqual(false);
    const warnSpy = jest.spyOn(console, "warn");

    translated = translate.getTranslation("May", null, null, null, "fr_FR");
    expect(translated).toEqual("Pourrait");

    translated = translate.getTranslation("May", null, "Month name", null, "fr_FR");
    expect(translated).toEqual("May");

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith("Untranslated fr_FR key found: May (with context: Month name)");

    warnSpy.mockRestore();
  });
});

describe("Translate tests without Vue", () => {
  beforeEach(() => {
    plugin.options = {
      ...plugin.options,
      silent: false,
    };
    setLanguage("en_US");
  });

  let translated;

  it("tests the getTranslation() method", () => {
    translated = translate.getTranslation("", 1, null, "fr_FR");
    expect(translated).toEqual("");

    translated = translate.getTranslation("Unexisting language", null, null, null, "be_FR");
    expect(translated).toEqual("Unexisting language");

    translated = translate.getTranslation("Untranslated key", null, null, null, "fr_FR");
    expect(translated).toEqual("Untranslated key");

    translated = translate.getTranslation("Pending", 1, null, null, "fr_FR");
    expect(translated).toEqual("En cours");

    translated = translate.getTranslation("%{ carCount } car", 2, null, null, "fr_FR");
    expect(translated).toEqual("%{ carCount } véhicules");

    translated = translate.getTranslation("Answer", 1, "Verb", null, "fr_FR");
    expect(translated).toEqual("Réponse (verbe)");

    translated = translate.getTranslation("Answer", 1, "Noun", null, "fr_FR");
    expect(translated).toEqual("Réponse (nom)");

    translated = translate.getTranslation("Pending", 1, null, null, "en_US");
    expect(translated).toEqual("Pending");

    // If no translation exists, display the default singular form (if n < 2).
    translated = translate.getTranslation("Untranslated %{ n } item", 0, null, "Untranslated %{ n } items", "fr_FR");
    expect(translated).toEqual("Untranslated %{ n } item");

    // If no translation exists, display the default plural form (if n > 1).
    translated = translate.getTranslation("Untranslated %{ n } item", 10, null, "Untranslated %{ n } items", "fr_FR");
    expect(translated).toEqual("Untranslated %{ n } items");

    // Test that it works when a msgid exists with and without a context, see #32.
    translated = translate.getTranslation("Object", null, null, null, "fr_FR");
    expect(translated).toEqual("Objet");
    translated = translate.getTranslation("Object", null, "Context", null, "fr_FR");
    expect(translated).toEqual("Objet avec contexte");

    // Ensure that pluralization is right in English when there are no English translations.
    translated = translate.getTranslation("Untranslated %{ n } item", 0, null, "Untranslated %{ n } items", "en_US");
    expect(translated).toEqual("Untranslated %{ n } items");
    translated = translate.getTranslation("Untranslated %{ n } item", 1, null, "Untranslated %{ n } items", "en_US");
    expect(translated).toEqual("Untranslated %{ n } item");
    translated = translate.getTranslation("Untranslated %{ n } item", 2, null, "Untranslated %{ n } items", "en_US");
    expect(translated).toEqual("Untranslated %{ n } items");

    // Test plural message with multiple contexts (default context and 'Context'')
    translated = translate.getTranslation("%{ carCount } car (multiple contexts)", 1, null, null, "en_US");
    expect(translated).toEqual("1 car");
    translated = translate.getTranslation("%{ carCount } car (multiple contexts)", 2, null, null, "en_US");
    expect(translated).toEqual("%{ carCount } cars");
    translated = translate.getTranslation("%{ carCount } car (multiple contexts)", 1, "Context", null, "en_US");
    expect(translated).toEqual("1 car with context");
    translated = translate.getTranslation("%{ carCount } car (multiple contexts)", 2, "Context", null, "en_US");
    expect(translated).toEqual("%{ carCount } cars with context");
  });

  it("tests the gettext() method", () => {
    let undetectableGettext = translate.gettext.bind(translate); // Hide from gettext-extract.

    setLanguage("fr_FR");
    expect(undetectableGettext("Pending")).toEqual("En cours");

    setLanguage("en_US");
    expect(undetectableGettext("Pending")).toEqual("Pending");
  });

  it("tests the pgettext() method", () => {
    let undetectablePgettext = translate.pgettext.bind(translate); // Hide from gettext-extract.

    setLanguage("fr_FR");
    expect(undetectablePgettext("Noun", "Answer")).toEqual("Réponse (nom)");

    setLanguage("en_US");
    expect(undetectablePgettext("Noun", "Answer")).toEqual("Answer (noun)");
  });

  it("tests the ngettext() method", () => {
    let undetectableNgettext = translate.ngettext.bind(translate); // Hide from gettext-extract.

    setLanguage("fr_FR");
    expect(undetectableNgettext("%{ carCount } car", "%{ carCount } cars", 2)).toEqual("%{ carCount } véhicules");

    setLanguage("en_US");
    expect(undetectableNgettext("%{ carCount } car", "%{ carCount } cars", 2)).toEqual("%{ carCount } cars");

    // If no translation exists, display the default singular form (if n < 2).
    setLanguage("fr_FR");
    expect(undetectableNgettext("Untranslated %{ n } item", "Untranslated %{ n } items", -1)).toEqual(
      "Untranslated %{ n } item"
    );

    // If no translation exists, display the default plural form (if n > 1).
    setLanguage("fr_FR");
    expect(undetectableNgettext("Untranslated %{ n } item", "Untranslated %{ n } items", 2)).toEqual(
      "Untranslated %{ n } items"
    );
  });

  it("tests the npgettext() method", () => {
    let undetectableNpgettext = translate.npgettext.bind(translate); // Hide from gettext-extract

    setLanguage("fr_FR");
    expect(undetectableNpgettext("Noun", "%{ carCount } car (noun)", "%{ carCount } cars (noun)", 2)).toEqual(
      "%{ carCount } véhicules (nom)"
    );

    setLanguage("en_US");
    expect(undetectableNpgettext("Verb", "%{ carCount } car (verb)", "%{ carCount } cars (verb)", 2)).toEqual(
      "%{ carCount } cars (verb)"
    );

    setLanguage("fr_FR");
    expect(undetectableNpgettext("Noun", "%{ carCount } car (noun)", "%{ carCount } cars (noun)", 1)).toEqual(
      "%{ carCount } véhicule (nom)"
    );

    setLanguage("en_US");
    expect(undetectableNpgettext("Verb", "%{ carCount } car (verb)", "%{ carCount } cars (verb)", 1)).toEqual(
      "%{ carCount } car (verb)"
    );

    // If no translation exists, display the default singular form (if n < 2).
    setLanguage("fr_FR");
    expect(
      undetectableNpgettext("Noun", "Untranslated %{ n } item (noun)", "Untranslated %{ n } items (noun)", 1)
    ).toEqual("Untranslated %{ n } item (noun)");

    // If no translation exists, display the default plural form (if n > 1).
    setLanguage("fr_FR");
    expect(
      undetectableNpgettext("Noun", "Untranslated %{ n } item (noun)", "Untranslated %{ n } items (noun)", 2)
    ).toEqual("Untranslated %{ n } items (noun)");
  });

  it("works when a msgid exists with and without a context, but the one with the context has not been translated", () => {
    expect(plugin.options.silent).toEqual(false);
    const warnSpy = jest.spyOn(console, "warn");

    translated = translate.getTranslation("May", null, null, null, "fr_FR");
    expect(translated).toEqual("Pourrait");

    translated = translate.getTranslation("May", null, "Month name", null, "fr_FR");
    expect(translated).toEqual("May");

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith("Untranslated fr_FR key found: May (with context: Month name)");

    warnSpy.mockRestore();
  });
});
