import Vue from "vue";

import GetTextPlugin from "../../src/";
import translations from "./json/directive.arabic.json";
import uninstallPlugin from "../testUtils";
import { expect } from "chai";

// https://docs.transifex.com/formats/gettext
// https://www.arabeyes.org/Plural_Forms

describe("translate arabic directive tests", () => {
  beforeEach(function() {
    uninstallPlugin(Vue, GetTextPlugin);
    Vue.use(GetTextPlugin, {
      availableLanguages: {
        en_US: "American English",
        ar: "Arabic",
      },
      defaultLanguage: "ar",
      translations: translations,
    });
  });

  it("translates singular", () => {
    let vm = new Vue({
      template: "<p v-translate>Orange</p>",
      data: { count: 1 },
    }).$mount();
    expect(vm.$el.innerHTML).to.equal("البرتقالي");
  });

  it("translates plural form 0", () => {
    let vm = new Vue({
      template: '<p v-translate :translate-n="count" translate-plural="%{ count } days">%{ count } day</p>',
      data: { count: 0 },
    }).$mount();
    expect(vm.$el.innerHTML).to.equal("{ count }أقل من يوم");
  });

  it("translates plural form 1", () => {
    let vm = new Vue({
      template: '<p v-translate :translate-n="count" translate-plural="%{ count } days">%{ count } day</p>',
      data: { count: 1 },
    }).$mount();
    expect(vm.$el.innerHTML).to.equal("{ count }يوم واحد");
  });

  it("translates plural form 2", () => {
    let vm = new Vue({
      template: '<p v-translate :translate-n="count" translate-plural="%{ count } days">%{ count } day</p>',
      data: { count: 2 },
    }).$mount();
    expect(vm.$el.innerHTML).to.equal("{ count }يومان");
  });

  it("translates plural form 3", () => {
    let vm = new Vue({
      template: '<p v-translate :translate-n="count" translate-plural="%{ count } days">%{ count } day</p>',
      data: { count: 9 },
    }).$mount();
    expect(vm.$el.innerHTML).to.equal("{ count } أيام");
  });

  it("translates plural form 4", () => {
    let vm = new Vue({
      template: '<p v-translate :translate-n="count" translate-plural="%{ count } days">%{ count } day</p>',
      data: { count: 11 },
    }).$mount();
    expect(vm.$el.innerHTML).to.equal("{ count } يومًا");
  });

  it("translates plural form 5", () => {
    let vm = new Vue({
      template: '<p v-translate :translate-n="count" translate-plural="%{ count } days">%{ count } day</p>',
      data: { count: 3000 },
    }).$mount();
    expect(vm.$el.innerHTML).to.equal("{ count } يوم");
  });
});
