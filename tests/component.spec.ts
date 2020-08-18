import translations from "./json/component.json";
import { mountWithPlugin } from "./utils";

const mount = mountWithPlugin({
  availableLanguages: {
    en_US: "American English",
    fr_FR: "Français",
  },
  defaultLanguage: "en_US",
  translations: translations,
});

describe("translate component tests", () => {
  it("works on empty strings", async () => {
    const wrapper = mount({
      template: "<div><translate></translate></div>",
    });
    expect(wrapper.element.innerHTML.trim()).toBe("<span></span>");
  });

  it("returns an unchanged string when no translation is available for a language", async () => {
    const warnSpy = jest.spyOn(console, "warn");
    const wrapper = mount({ template: "<div><translate>Unchanged string</translate></div>" });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_BE";
    await vm.$nextTick();
    expect(vm.$el.innerHTML.trim()).toEqual("<span>Unchanged string</span>");
    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });

  it("returns an unchanged string when no translation key is available", async () => {
    const warnSpy = jest.spyOn(console, "warn");
    const wrapper = mount({ template: "<div><translate>Untranslated string</translate></div>" });
    const vm = wrapper.vm as any;
    await vm.$nextTick();
    expect(vm.$el.innerHTML.trim()).toEqual("<span>Untranslated string</span>");
    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });

  it("translates known strings", () => {
    const wrapper = mount({ template: "<div><translate>Pending</translate></div>" });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_FR";
    expect(vm.$el.innerHTML.trim()).toEqual("<span>En cours</span>");
  });

  it("translates multiline strings no matter the number of spaces", () => {
    const wrapper = mount({
      template: `<div><translate tag="p">

                      A

                                        lot

                      of

                      lines

        </translate></div>`,
    });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_FR";
    expect(vm.$el.innerHTML.trim()).toEqual(`<p>Plein de lignes</p>`);
  });

  it("renders translation in custom html tag", () => {
    const wrapper = mount({ template: '<div><translate tag="h1">Pending</translate></div>' });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_FR";
    expect(vm.$el.innerHTML.trim()).toEqual("<h1>En cours</h1>");
  });

  it("translates known strings according to a given translation context", () => {
    let wrapper = mount({ template: '<div><translate translate-context="Verb">Answer</translate></div>' });
    let vm = wrapper.vm as any;
    expect(vm.$el.innerHTML.trim()).toEqual("<span>Answer (verb)</span>");
    wrapper = mount({ template: '<div><translate translate-context="Noun">Answer</translate></div>' });
    vm = wrapper.vm as any;
    vm.$language.current = "en_US";
    expect(vm.$el.innerHTML.trim()).toEqual("<span>Answer (noun)</span>");
  });

  it("allows interpolation", async () => {
    const wrapper = mount({
      template: "<p><translate>Hello %{ name }</translate></p>",
      data() {
        return { name: "John Doe" };
      },
    });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_FR";
    await vm.$nextTick();
    expect(vm.$el.innerHTML.trim()).toEqual("<span>Bonjour John Doe</span>");
  });

  it("allows interpolation with computed property", async () => {
    const wrapper = mount({
      template: "<p><translate>Hello %{ name }</translate></p>",
      computed: {
        name() {
          return "John Doe";
        },
      },
    });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_FR";
    await vm.$nextTick();
    expect(vm.$el.innerHTML.trim()).toEqual("<span>Bonjour John Doe</span>");
  });

  it("allows custom params for interpolation", async () => {
    const wrapper = mount({
      template: '<p><translate :translate-params="{name: someNewNameVar}">Hello %{ name }</translate></p>',
      data() {
        return {
          someNewNameVar: "John Doe",
        };
      },
    });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_FR";
    await vm.$nextTick();
    expect(vm.$el.innerHTML.trim()).toEqual("<span>Bonjour John Doe</span>");
  });

  it("allows interpolation within v-for with custom params", async () => {
    const wrapper = mount({
      template: '<p><translate v-for="name in names" :translate-params="{name: name}">Hello %{ name }</translate></p>',
      data() {
        return {
          names: ["John Doe", "Chester"],
        };
      },
    });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_FR";
    await vm.$nextTick();
    expect(vm.$el.innerHTML.trim()).toEqual("<span>Bonjour John Doe</span><span>Bonjour Chester</span>");
  });

  it("translates plurals", async () => {
    const wrapper = mount({
      template: `<p>
            <translate :translate-n="count" translate-plural="%{ count } cars">%{ count } car</translate>
          </p>`,
      data() {
        return { count: 2 };
      },
    });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_FR";
    await vm.$nextTick();
    expect(vm.$el.innerHTML.trim()).toEqual("<span>2 véhicules</span>");
  });

  it("translates plurals with computed property", async () => {
    const wrapper = mount({
      template: `<p>
            <translate :translate-n="count" translate-plural="%{ count } cars">%{ count } car</translate>
          </p>`,
      computed: {
        count() {
          return 2;
        },
      },
    });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_FR";
    await vm.$nextTick();
    expect(vm.$el.innerHTML.trim()).toEqual("<span>2 véhicules</span>");
  });

  it("updates a plural translation after a data change", async (done) => {
    const wrapper = mount({
      template: `<p>
            <translate :translate-n="count" translate-plural="%{ count } cars">%{ count } car</translate>
          </p>`,
      data() {
        return { count: 10 };
      },
    });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_FR";
    await vm.$nextTick();
    await vm.$nextTick();
    expect(vm.$el.innerHTML.trim()).toEqual("<span>10 véhicules</span>");
    vm.count = 8;
    vm.$nextTick(function() {
      expect(vm.$el.innerHTML.trim()).toEqual("<span>8 véhicules</span>");
      done();
    });
  });

  it("updates a translation after a language change", (done) => {
    const wrapper = mount({ template: "<div><translate>Pending</translate></div>" });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_FR";
    expect(vm.$el.innerHTML.trim()).toEqual("<span>En cours</span>");
    vm.$language.current = "en_US";
    vm.$nextTick(function() {
      expect(vm.$el.innerHTML.trim()).toEqual("<span>Pending</span>");
      done();
    });
  });

  it("thrown errors if you forget to add a `translate-plural` attribute", async () => {
    try {
      mount({
        template: '<span><translate :translate-n="n">%{ n } car</translate></span>',
        data() {
          return { n: 2 };
        },
      });
    } catch (e) {
      expect(e.message).toBe("`translate-n` and `translate-plural` attributes must be used together: %{ n } car.");
    }
  });

  it("thrown errors if you forget to add a `translate-n` attribute", async () => {
    try {
      mount({
        template: '<p><translate translate-plural="%{ n }} cars">%{ n } car</translate></p>',
      });
    } catch (e) {
      expect(e.message).toBe("`translate-n` and `translate-plural` attributes must be used together: %{ n } car.");
    }
  });

  it("supports conditional rendering such as v-if, v-else-if, v-else", async (done) => {
    const wrapper = mount({
      template: `
          <translate v-if="show">Pending</translate>
          <translate v-else>Hello %{ name }</translate>
          `,
      data() {
        return { show: true, name: "John Doe" };
      },
    });
    const vm = wrapper.vm as any;
    vm.$language.current = "en_US";
    await vm.$nextTick();
    expect(vm.$el.innerHTML).toEqual("Pending");
    vm.show = false;
    vm.$nextTick(function() {
      expect(vm.$el.innerHTML).toEqual("Hello John Doe");
      done();
    });
  });
});

describe("translate component tests for interpolation", () => {
  it("goes up the parent chain of a nested component to evaluate `name`", (done) => {
    const wrapper = mount({
      template: `<div><inner-component><translate>Hello %{ name }</translate></inner-component></div>`,
      data() {
        return {
          name: "John Doe",
        };
      },
      components: {
        "inner-component": {
          template: `<p><slot /></p>`,
        },
      },
    });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_FR";
    vm.$nextTick(function() {
      expect(vm.$el.innerHTML.trim()).toEqual("<p><span>Bonjour John Doe</span></p>");
      done();
    });
  });

  it("goes up the parent chain of a nested component to evaluate `user.details.name`", (done) => {
    const warnSpy = jest.spyOn(console, "warn");
    const wrapper = mount({
      template: `<div><inner-component><translate>Hello %{ user.details.name }</translate></inner-component></div>`,
      data() {
        return {
          user: {
            details: {
              name: "Jane Doe",
            },
          },
        };
      },
      components: {
        "inner-component": {
          template: `<p><slot /></p>`,
        },
      },
    });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_FR";
    vm.$nextTick(function() {
      expect(vm.$el.innerHTML.trim()).toEqual("<p><span>Bonjour Jane Doe</span></p>");
      expect(warnSpy).not.toHaveBeenCalled;
      warnSpy.mockRestore();
      done();
    });
  });

  it("goes up the parent chain of 2 nested components to evaluate `user.details.name`", (done) => {
    const warnSpy = jest.spyOn(console, "warn");
    const wrapper = mount({
      template: `<div><first-component><translate>Hello %{ user.details.name }</translate></first-component></div>`,
      data() {
        return {
          user: {
            details: {
              name: "Jane Doe",
            },
          },
        };
      },
      components: {
        "first-component": {
          template: `<p><second-component><slot /></second-component></p>`,
          components: {
            "second-component": {
              template: `<b><slot /></b>`,
            },
          },
        },
      },
    });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_FR";
    vm.$nextTick(function() {
      expect(vm.$el.innerHTML.trim()).toEqual("<p><b><span>Bonjour Jane Doe</span></b></p>");
      expect(console.warn).not.toHaveBeenCalled;
      warnSpy.mockRestore();
      done();
    });
  });
});
