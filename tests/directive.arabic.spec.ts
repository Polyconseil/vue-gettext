import translations from "./json/directive.arabic.json";
import { mountWithPlugin } from "./utils";

const mount = mountWithPlugin({
  availableLanguages: {
    en_US: "American English",
    ar: "Arabic",
  },
  defaultLanguage: "ar",
  translations: translations,
});

describe("translate arabic directive tests", () => {
  it("translates singular", () => {
    let vm = mount({
      template: "<p v-translate>Orange</p>",
      data() {
        return { count: 1 };
      },
    }).vm;
    expect(vm.$el.innerHTML).toEqual("البرتقالي");
  });

  it("translates plural form 0", () => {
    const count = 0;
    let vm = mount({
      template: '<p v-translate :translate-n="count" translate-plural="%{ count } days">%{ count } day</p>',
      data() {
        return { count };
      },
    }).vm;
    expect(vm.$el.innerHTML).toEqual(`${count}أقل من يوم`);
  });

  it("translates plural form 1", () => {
    const count = 1;
    let vm = mount({
      template: '<p v-translate :translate-n="count" translate-plural="%{ count } days">%{ count } day</p>',
      data() {
        return { count };
      },
    }).vm;
    expect(vm.$el.innerHTML).toEqual(`${count}يوم واحد`);
  });

  it("translates plural form 2", () => {
    const count = 2;
    let vm = mount({
      template: '<p v-translate :translate-n="count" translate-plural="%{ count } days">%{ count } day</p>',
      data() {
        return { count };
      },
    }).vm;
    expect(vm.$el.innerHTML).toEqual(`${count}يومان`);
  });

  it("translates plural form 3", () => {
    const count = 9;
    let vm = mount({
      template: '<p v-translate :translate-n="count" translate-plural="%{ count } days">%{ count } day</p>',
      data() {
        return { count };
      },
    }).vm;
    expect(vm.$el.innerHTML).toEqual(`${count} أيام`);
  });

  it("translates plural form 4", () => {
    const count = 11;
    let vm = mount({
      template: '<p v-translate :translate-n="count" translate-plural="%{ count } days">%{ count } day</p>',
      data() {
        return { count };
      },
    }).vm;
    expect(vm.$el.innerHTML).toEqual(`${count} يومًا`);
  });

  it("translates plural form 5", async () => {
    const count = 3000;
    let vm = mount({
      template: '<p v-translate :translate-n="count" translate-plural="%{ count } days">%{ count } day</p>',
      data() {
        return { count };
      },
    }).vm;
    expect(vm.$el.innerHTML).toEqual(`${count} يوم`);
  });
});
