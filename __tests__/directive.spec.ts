import translations from "./json/directive.json";
import { mountWithPlugin } from "./utils";

const mount = mountWithPlugin({
  availableLanguages: {
    en_US: "American English",
    fr_FR: "Français",
  },
  defaultLanguage: "en_US",
  translations: translations,
});

describe("translate directive tests", () => {
  it("works on empty strings", () => {
    const vm = mount({ template: "<div v-translate></div>" }).vm;
    expect(vm.$el.innerHTML).toEqual("");
  });

  it("returns an unchanged string when no translation is available for a language", () => {
    const warnSpy = jest.spyOn(console, "warn");
    const vm = mount({ template: "<div v-translate>Unchanged string</div>" }).vm;
    (vm as any).$language.current = "fr_BE";
    expect(vm.$el.innerHTML).toEqual("Unchanged string");
    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });

  it("returns an unchanged string when no translation key is available", () => {
    const warnSpy = jest.spyOn(console, "warn");
    const vm = mount({ template: "<div v-translate>Untranslated string</div>" }).vm;
    expect(vm.$el.innerHTML).toEqual("Untranslated string");
    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });

  it("translates known strings", () => {
    const vm = mount({ template: "<div v-translate>Pending</div>" }).vm;
    (vm as any).$language.current = "fr_FR";
    expect(vm.$el.innerHTML).toEqual("En cours");
  });

  it("translates known strings when surrounded by one or more tabs and spaces", () => {
    const vm = mount({ template: "<div v-translate>\tPending\t\t \t\r\n\t\f\v</div>" }).vm;
    (vm as any).$language.current = "fr_FR";
    expect(vm.$el.innerHTML).toEqual("En cours");
  });

  it("translates multiline strings as-is, preserving the original content", () => {
    const vm = mount({ template: "<p v-translate>\n\nA\n\n\nlot\n\n\nof\n\nlines</p>" }).vm;
    (vm as any).$language.current = "fr_FR";
    expect(vm.$el.innerHTML).toEqual("Plein\n\n\nde\n\nlignes");
  });

  it("translates known strings according to a given translation context", () => {
    let vm = mount({ template: '<div v-translate translate-context="Verb">Answer</div>' }).vm;
    (vm as any).$language.current = "en_US";
    expect(vm.$el.innerHTML).toEqual("Answer (verb)");
    vm = mount({ template: '<div v-translate translate-context="Noun">Answer</div>' }).vm;
    expect(vm.$el.innerHTML).toEqual("Answer (noun)");
  });

  it("works with text content", () => {
    const vm = mount({ template: "<div v-translate>This is sparta!</div>" }).vm;
    expect(vm.$el.innerHTML).toEqual("This is sparta!");
  });

  it("works with HTML content", () => {
    const vm = mount({
      template: '<div v-translate>This is <strong class="txt-primary">sparta</strong>!</div>',
    }).vm;
    expect(vm.$el.innerHTML).toEqual('This is <strong class="txt-primary">sparta</strong>!');
  });

  it("allows interpolation", async () => {
    const vm = mount({
      template: "<p v-translate>Hello <strong>%{ name }</strong></p>",
      data() {
        return { name: "John Doe" };
      },
    }).vm;
    (vm as any).$language.current = "fr_FR";
    await vm.$nextTick();
    expect(vm.$el.innerHTML).toEqual("Bonjour <strong>John Doe</strong>");
  });

  it("escapes HTML in variables by default", async () => {
    const vm = mount({
      template: "<p v-translate>Hello %{ openingTag }%{ name }%{ closingTag }</p>",
      data() {
        return {
          name: "John Doe",
          openingTag: "<b>",
          closingTag: "</b>",
        };
      },
    }).vm;
    (vm as any).$language.current = "fr_FR";
    await vm.$nextTick();
    expect(vm.$el.innerHTML).toEqual("Bonjour &lt;b&gt;John Doe&lt;/b&gt;");
  });

  it("forces HTML rendering in variables (with the `render-html` attribute set to `true`)", async () => {
    const vm = mount({
      template: '<p v-translate render-html="true">Hello %{ openingTag }%{ name }%{ closingTag }</p>',
      data() {
        return {
          name: "John Doe",
          openingTag: "<b>",
          closingTag: "</b>",
        };
      },
    }).vm;
    (vm as any).$language.current = "fr_FR";
    await vm.$nextTick();
    expect(vm.$el.innerHTML).toEqual("Bonjour <b>John Doe</b>");
  });

  it("allows interpolation with computed property", () => {
    const vm = mount({
      template: "<p v-translate>Hello <strong>%{ name }</strong></p>",
      computed: {
        name() {
          return "John Doe";
        },
      },
    }).vm;
    (vm as any).$language.current = "fr_FR";
    expect(vm.$el.innerHTML).toEqual("Bonjour <strong>John Doe</strong>");
  });

  it("allows custom params for interpolation", () => {
    const vm = mount({
      template: '<p v-translate="{name: someNewNameVar}">Hello <strong>%{ name }</strong></p>',
      data() {
        return {
          someNewNameVar: "John Doe",
        };
      },
    }).vm;
    (vm as any).$language.current = "fr_FR";
    expect(vm.$el.innerHTML.trim()).toEqual("Bonjour <strong>John Doe</strong>");
  });

  it("allows interpolation within v-for with custom params", () => {
    let names = ["John Doe", "Chester"];
    const vm = mount({
      template: '<p><span v-for="name in names" v-translate="{name: name}">Hello <strong>%{ name }</strong></span></p>',
      data() {
        return {
          names,
        };
      },
    }).vm;
    (vm as any).$language.current = "fr_FR";
    let html = vm.$el.innerHTML.trim();
    let missedName = names.some((name) => {
      if (html.indexOf(name) === -1) {
        return true;
      }
    });
    expect(missedName).toEqual(false);
  });

  it("logs a warning in the console if translate-params is used", () => {
    const warnSpy = jest.spyOn(console, "warn");
    const vm = mount({
      template: '<p v-translate :translate-params="{name: someNewNameVar}">Hello <strong>%{ name }</strong></p>',
      data() {
        return {
          someNewNameVar: "John Doe",
        };
      },
    }).vm;
    (vm as any).$language.current = "fr_FR";
    expect(vm.$el.innerHTML.trim()).toEqual("Bonjour <strong>name</strong>");
    expect(console.warn).toHaveBeenCalled;
    warnSpy.mockRestore();
  });

  // it("updates a translation after a data change", (done) => {
  //   const vm = mount({
  //     template: '<p v-translate="name">Hello <strong>%{ name }</strong></p>',
  //     data() {
  //       return { name: "John Doe" };
  //     },
  //   }).vm;
  //   (vm as any).$language.current = "fr_FR";
  //   expect(vm.$el.innerHTML).toEqual("Bonjour <strong>John Doe</strong>");
  //   vm.name = "Kenny";
  //   vm.$nextTick(function() {
  //     expect(vm.$el.innerHTML).toEqual("Bonjour <strong>Kenny</strong>");
  //     done();
  //   });
  // });

  // it("logs an info in the console if an interpolation is required but an expression is not provided", () => {
  //   console.info = sinon.spy(console, "info");
  //   const vm = mount({
  //     template: "<p v-translate>Hello <strong>%{ name }</strong></p>",
  //     data() {
  //       return { name: "John Doe" };
  //     },
  //   }).vm;
  //   (vm as any).$language.current = "fr_FR";
  //   expect(vm.$el.innerHTML).toEqual("Bonjour <strong>John Doe</strong>");
  //   expect(console.info).toHaveBeenCalledTimes(1);
  //   console.info.restore();
  // });

  // it("translates plurals", () => {
  //   const vm = mount({
  //     template:
  //       '<p v-translate :translate-n="count" translate-plural="<strong>%{ count }</strong> cars"><strong>%{ count }</strong> car</p>',
  //     data() {
  //       return { count: 2 };
  //     },
  //   }).vm;
  //   (vm as any).$language.current = "fr_FR";
  //   expect(vm.$el.innerHTML).toEqual("<strong>2</strong> véhicules");
  // });

  // it("translates plurals with computed property", () => {
  //   const vm = mount({
  //     template:
  //       '<p v-translate :translate-n="count" translate-plural="<strong>%{ count }</strong> cars"><strong>%{ count }</strong> car</p>',
  //     computed: {
  //       count() {
  //         return 2;
  //       },
  //     },
  //   }).vm;
  //   (vm as any).$language.current = "fr_FR";
  //   expect(vm.$el.innerHTML).toEqual("<strong>2</strong> véhicules");
  // });

  // it("updates a plural translation after a data change", (done) => {
  //   const vm = mount({
  //     template:
  //       '<p v-translate="count + brand" :translate-n="count" translate-plural="<strong>%{ count }</strong> %{ brand } cars"><strong>%{ count }</strong> %{ brand } car</p>',
  //     data() {
  //       return { count: 1, brand: "Toyota" };
  //     },
  //   }).vm;
  //   (vm as any).$language.current = "fr_FR";
  //   expect(vm.$el.innerHTML).toEqual("<strong>1</strong> Toyota véhicule");
  //   vm.count = 8;
  //   vm.$nextTick(function() {
  //     expect(vm.$el.innerHTML).toEqual("<strong>8</strong> Toyota véhicules");
  //     done();
  //   });
  // });

  // it("updates a translation after a language change", (done) => {
  //   const vm = mount({ template: "<div v-translate>Pending</div>" }).vm;
  //   (vm as any).$language.current = "fr_FR";
  //   expect(vm.$el.innerHTML).toEqual("En cours");
  //   (vm as any).$language.current = "en_US";
  //   vm.$nextTick(function() {
  //     expect(vm.$el.innerHTML).toEqual("Pending");
  //     done();
  //   });
  // });

  // it("supports conditional rendering such as v-if, v-else-if, v-else", (done) => {
  //   const vm = mount({
  //     template: `
  //     <div v-if="show" v-translate>Pending</div>
  //     <div v-else v-translate>Hello <strong>%{ name }</strong></div>
  //     `,
  //     data() {
  //       return { show: true, name: "John Doe" };
  //     },
  //   }).vm;
  //   (vm as any).$language.current = "en_US";
  //   expect(vm.$el.innerHTML).toEqual("Pending");
  //   vm.show = false;
  //   vm.$nextTick(function() {
  //     expect(vm.$el.innerHTML).toEqual("Hello <strong>John Doe</strong>");
  //     done();
  //   });
  // });

  // it("does not trigger re-render of innerHTML when using expression with object and expression value was not changed", (done) => {
  //   const vm = mount({
  //     template: `
  //     <div v-translate="{name: 'test'}">Hello %{ name }</div>
  //     `,
  //     data() {
  //       return { someCounter: 0 };
  //     },
  //   }).vm;
  //   expect(vm.$el.innerHTML).toEqual("Hello test");

  //   let spy = sinon.spy(vm.$el, "innerHTML", ["set"]);
  //   vm.someCounter += 1;
  //   vm.$nextTick(function() {
  //     vm.someCounter += 1;
  //     vm.$nextTick(function() {
  //       expect(spy.set.callCount).toEqual(0);
  //       done();
  //     });
  //   });
  // });

  // it("re-render innerHTML when using expression and only if translation data was changed", (done) => {
  //   const vm = mount({
  //     template: `
  //     <div v-translate="{name: {first: varFromData}}">Hello %{ name.first }</div>
  //     `,
  //     data() {
  //       return { someCounter: 0, varFromData: "name" };
  //     },
  //   }).vm;
  //   expect(vm.$el.innerHTML).toEqual("Hello name");

  //   let spy = sinon.spy(vm.$el, "innerHTML", ["set"]);
  //   vm.varFromData = "name";
  //   vm.someCounter += 1;
  //   vm.$nextTick(function() {
  //     vm.varFromData = "otherName";
  //     vm.someCounter += 1;
  //     vm.$nextTick(function() {
  //       expect(vm.$el.innerHTML).toEqual("Hello otherName");
  //       expect(spy.set).toHaveBeenCalledTimes(1);
  //       done();
  //     });
  //   });
  // });
});
