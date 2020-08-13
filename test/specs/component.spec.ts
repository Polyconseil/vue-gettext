import Vue from "vue";
import { mount } from "@vue/test-utils";

import GetTextPlugin from "../../src/";
import translations from "./json/component.json";
import uninstallPlugin from "../testUtils";
import { expect } from "chai";
import sinon from "sinon";

describe("translate component tests", () => {
  beforeEach(function() {
    uninstallPlugin(Vue, GetTextPlugin);
    Vue.use(GetTextPlugin, {
      availableLanguages: {
        en_US: "American English",
        fr_FR: "Français",
      },
      defaultLanguage: "en_US",
      translations: translations,
    });
  });

  it("works on empty strings", () => {
    const wrapper = mount({ template: "<div><translate></translate></div>" });
    expect(vm.$el.innerHTML.trim()).to.equal("<span></span>");
  });

  it("returns an unchanged string when no translation is available for a language", () => {
    console.warn = sinon.spy(console, "warn");
    const wrapper = mount({ template: "<div><translate>Unchanged string</translate></div>" });
    const vm = wrapper.vm as any;
    vm.$language.current = "fr_BE";
    expect(vm.$el.innerHTML.trim()).to.equal("<span>Unchanged string</span>");
    expect(console.warn).calledOnce;
    (console.warn as any).restore();
  });

  it("returns an unchanged string when no translation key is available", () => {
    console.warn = sinon.spy(console, "warn");
    const wrapper = mount({ template: "<div><translate>Untranslated string</translate></div>" });
    const vm = wrapper.vm as any;
    expect(vm.$el.innerHTML.trim()).to.equal("<span>Untranslated string</span>");
    expect(console.warn).calledOnce;
    console.warn.restore();
  });

  it("translates known strings", () => {
    Vue.config.language = "fr_FR";
    const wrapper = mount({ template: "<div><translate>Pending</translate></div>" });
    expect(vm.$el.innerHTML.trim()).to.equal("<span>En cours</span>");
  });

  it("translates multiline strings no matter the number of spaces", () => {
    Vue.config.language = "fr_FR";
    const wrapper = mount({
      template: `<div><translate tag="p">



                  A


                                    lot




                  of

                  lines




    </translate></div>`,
    });
    const vm = wrapper.vm as any;
    expect(vm.$el.innerHTML.trim()).to.equal(`<p>Plein de lignes</p>`);
  });

  it("renders translation in custom html tag", () => {
    Vue.config.language = "fr_FR";
    const wrapper = mount({ template: '<div><translate tag="h1">Pending</translate></div>' });
    const vm = wrapper.vm as any;
    expect(vm.$el.innerHTML.trim()).to.equal("<h1>En cours</h1>");
  });

  it("translates known strings according to a given translation context", () => {
    Vue.config.language = "en_US";
    let wrapper = mount({ template: '<div><translate translate-context="Verb">Answer</translate></div>' });
    let vm = wrapper.vm as any;
    expect(vm.$el.innerHTML.trim()).to.equal("<span>Answer (verb)</span>");
    wrapper = mount({ template: '<div><translate translate-context="Noun">Answer</translate></div>' });
    vm = wrapper.vm as any;
    expect(vm.$el.innerHTML.trim()).to.equal("<span>Answer (noun)</span>");
  });

  it("allows interpolation", () => {
    Vue.config.language = "fr_FR";
    const wrapper = mount({
      template: "<p><translate>Hello %{ name }</translate></p>",
      data: { name: "John Doe" },
    });
    const vm = wrapper.vm as any;
    expect(vm.$el.innerHTML.trim()).to.equal("<span>Bonjour John Doe</span>");
  });

  it("allows interpolation with computed property", () => {
    Vue.config.language = "fr_FR";
    const wrapper = mount({
      template: "<p><translate>Hello %{ name }</translate></p>",
      computed: {
        name() {
          return "John Doe";
        },
      },
    });
    const vm = wrapper.vm as any;
    expect(vm.$el.innerHTML.trim()).to.equal("<span>Bonjour John Doe</span>");
  });

  it("allows custom params for interpolation", () => {
    Vue.config.language = "fr_FR";
    const wrapper = mount({
      template: '<p><translate :translate-params="{name: someNewNameVar}">Hello %{ name }</translate></p>',
      data: {
        someNewNameVar: "John Doe",
      },
    });
    expect(vm.$el.innerHTML.trim()).to.equal("<span>Bonjour John Doe</span>");
  });

  it("allows interpolation within v-for with custom params", () => {
    Vue.config.language = "fr_FR";
    const wrapper = mount({
      template: '<p><translate v-for="name in names" :translate-params="{name: name}">Hello %{ name }</translate></p>',
      data: {
        names: ["John Doe", "Chester"],
      },
    });
    const vm = wrapper.vm as any;
    expect(vm.$el.innerHTML.trim()).to.equal("<span>Bonjour John Doe</span><span>Bonjour Chester</span>");
  });

  it("translates plurals", () => {
    Vue.config.language = "fr_FR";
    const wrapper = mount({
      template: `<p>
        <translate :translate-n="count" translate-plural="%{ count } cars">%{ count } car</translate>
      </p>`,
      data: { count: 2 },
    });
    const vm = wrapper.vm as any;
    expect(vm.$el.innerHTML.trim()).to.equal("<span>2 véhicules</span>");
  });

  it("translates plurals with computed property", () => {
    Vue.config.language = "fr_FR";
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
    expect(vm.$el.innerHTML.trim()).to.equal("<span>2 véhicules</span>");
  });

  it("updates a plural translation after a data change", (done) => {
    Vue.config.language = "fr_FR";
    const wrapper = mount({
      template: `<p>
        <translate :translate-n="count" translate-plural="%{ count } cars">%{ count } car</translate>
      </p>`,
      data: { count: 10 },
    });
    const vm = wrapper.vm as any;
    expect(vm.$el.innerHTML.trim()).to.equal("<span>10 véhicules</span>");
    vm.count = 8;
    vm.$nextTick(function() {
      expect(vm.$el.innerHTML.trim()).to.equal("<span>8 véhicules</span>");
      done();
    });
  });

  it("updates a translation after a language change", (done) => {
    Vue.config.language = "fr_FR";
    const wrapper = mount({ template: "<div><translate>Pending</translate></div>" });
    const vm = wrapper.vm as any;
    expect(vm.$el.innerHTML.trim()).to.equal("<span>En cours</span>");
    Vue.config.language = "en_US";
    vm.$nextTick(function() {
      expect(vm.$el.innerHTML.trim()).to.equal("<span>Pending</span>");
      done();
    });
  });

  it("thrown errors displayed in the console if you forget to add a `translate-plural` attribute", () => {
    console.error = sinon.spy(console, "error");
    mount({
      template: '<span><translate :translate-n="n">%{ n } car</translate></span>',
      data: { n: 2 },
    });
    const vm = wrapper.vm as any;
    expect(console.error).calledWith(
      sinon.match("`translate-n` and `translate-plural` attributes must be used together: %{ n } car.")
    );
    console.error.restore();
  });

  it("thrown errors displayed in the console if you forget to add a `translate-n` attribute", () => {
    console.error = sinon.spy(console, "error");
    mount({
      template: '<p><translate translate-plural="%{ n }} cars">%{ n } car</translate></p>',
    });
    expect(console.error).calledWith(
      sinon.match("`translate-n` and `translate-plural` attributes must be used together: %{ n } car.")
    );
    console.error.restore();
  });

  it("supports conditional rendering such as v-if, v-else-if, v-else", (done) => {
    Vue.config.language = "en_US";
    Vue.config.autoAddKeyAttributes = true;
    const wrapper = mount({
      template: `
      <translate v-if="show">Pending</translate>
      <translate v-else>Hello %{ name }</translate>
      `,
      data: { show: true, name: "John Doe" },
    });
    const vm = wrapper.vm as any;
    expect(vm.$el.innerHTML).to.equal("Pending");
    vm.show = false;
    vm.$nextTick(function() {
      expect(vm.$el.innerHTML).to.equal("Hello John Doe");
      Vue.config.autoAddKeyAttributes = false;
      done();
    });
  });
});

describe("translate component tests for interpolation", () => {
  beforeEach(function() {
    uninstallPlugin(Vue, GetTextPlugin);
    Vue.use(GetTextPlugin, {
      availableLanguages: {
        en_US: "American English",
        fr_FR: "Français",
      },
      defaultLanguage: "en_US",
      translations: translations,
    });
  });

  it("goes up the parent chain of a nested component to evaluate `name`", (done) => {
    Vue.config.language = "fr_FR";
    const wrapper = mount({
      template: `<div><inner-component></inner-component></div>`,
      data: {
        name: "John Doe",
      },
      components: {
        "inner-component": {
          template: `<p><translate>Hello %{ name }</translate></p>`,
        },
      },
    });
    const vm = wrapper.vm as any;
    vm.$nextTick(function() {
      expect(vm.$el.innerHTML.trim()).to.equal("<p><span>Bonjour John Doe</span></p>");
      done();
    });
  });

  it("goes up the parent chain of a nested component to evaluate `user.details.name`", (done) => {
    console.warn = sinon.spy(console, "warn");
    Vue.config.language = "fr_FR";
    const wrapper = mount({
      template: `<div><inner-component></inner-component></div>`,
      data: {
        user: {
          details: {
            name: "Jane Doe",
          },
        },
      },
      components: {
        "inner-component": {
          template: `<p><translate>Hello %{ user.details.name }</translate></p>`,
        },
      },
    });
    const vm = wrapper.vm as any;
    vm.$nextTick(function() {
      expect(vm.$el.innerHTML.trim()).to.equal("<p><span>Bonjour Jane Doe</span></p>");
      expect(console.warn).notCalled;
      console.warn.restore();
      done();
    });
  });

  it("goes up the parent chain of 2 nested components to evaluate `user.details.name`", (done) => {
    console.warn = sinon.spy(console, "warn");
    Vue.config.language = "fr_FR";
    const wrapper = mount({
      template: `<div><first-component></first-component></div>`,
      data: {
        user: {
          details: {
            name: "Jane Doe",
          },
        },
      },
      components: {
        "first-component": {
          template: `<p><second-component></second-component></p>`,
          components: {
            "second-component": {
              template: `<b><translate>Hello %{ user.details.name }</translate></b>`,
            },
          },
        },
      },
    });
    const vm = wrapper.vm as any;
    vm.$nextTick(function() {
      expect(vm.$el.innerHTML.trim()).to.equal("<p><b><span>Bonjour Jane Doe</span></b></p>");
      expect(console.warn).notCalled;
      console.warn.restore();
      done();
    });
  });
});
