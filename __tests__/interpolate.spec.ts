import rawInterpolate from "../src/interpolate";
import translations from "./json/translate.json";
import { mountWithPlugin } from "./utils";
import { GetText } from "../src";

const mount = mountWithPlugin({
  translations: translations,
  silent: true,
});

const wrapper = mount({ template: "<div></div>" });
const plugin = wrapper.vm.$.appContext.config.globalProperties.$language as GetText;

const interpolate = rawInterpolate(plugin);

describe("Interpolate tests", () => {
  it("without placeholders", () => {
    let msgid = "Foo bar baz";
    let interpolated = interpolate(msgid);
    expect(interpolated).toEqual("Foo bar baz");
  });

  it("with a placeholder", () => {
    let msgid = "Foo %{ placeholder } baz";
    let context = { placeholder: "bar" };
    let interpolated = interpolate(msgid, context);
    expect(interpolated).toEqual("Foo bar baz");
  });

  it("with HTML in var (should be escaped)", () => {
    let msgid = "Foo %{ placeholder } baz";
    let context = { placeholder: "<p>bar</p>" };
    let interpolated = interpolate(msgid, context);
    expect(interpolated).toEqual("Foo &lt;p&gt;bar&lt;/p&gt; baz");
  });

  it("with HTML in var (should NOT be escaped)", () => {
    let msgid = "Foo %{ placeholder } baz";
    let context = { placeholder: "<p>bar</p>" };
    let disableHtmlEscaping = true;
    let interpolated = interpolate(msgid, context, disableHtmlEscaping);
    expect(interpolated).toEqual("Foo <p>bar</p> baz");
  });

  it("with multiple spaces in the placeholder", () => {
    let msgid = "Foo %{              placeholder                              } baz";
    let context = { placeholder: "bar" };
    let interpolated = interpolate(msgid, context);
    expect(interpolated).toEqual("Foo bar baz");
  });

  it("with the same placeholder multiple times", () => {
    let msgid = "Foo %{ placeholder } baz %{ placeholder } foo";
    let context = { placeholder: "bar" };
    let interpolated = interpolate(msgid, context);
    expect(interpolated).toEqual("Foo bar baz bar foo");
  });

  it("with multiple placeholders", () => {
    let msgid = "%{foo}%{bar}%{baz}%{bar}%{foo}";
    let context = { foo: 1, bar: 2, baz: 3 };
    let interpolated = interpolate(msgid, context);
    expect(interpolated).toEqual("12321");
  });

  it("with new lines", () => {
    let msgid = "%{       \n    \n\n\n\n  foo} %{bar}!";
    let context = { foo: "Hello", bar: "world" };
    let interpolated = interpolate(msgid, context);
    expect(interpolated).toEqual("Hello world!");
  });

  it("with an object", () => {
    let msgid = "Foo %{ foo.bar } baz";
    let context = {
      foo: {
        bar: "baz",
      },
    };
    let interpolated = interpolate(msgid, context);
    expect(interpolated).toEqual("Foo baz baz");
  });

  it("with an array", () => {
    let msgid = "Foo %{ foo[1] } baz";
    let context = {
      foo: ["bar", "baz"],
    };
    let interpolated = interpolate(msgid, context);
    expect(interpolated).toEqual("Foo baz baz");
  });

  it("with a multi level object", () => {
    let msgid = "Foo %{ a.b.x } %{ a.c.y[1].title }";
    let context = {
      a: {
        b: {
          x: "foo",
        },
        c: {
          y: [{ title: "bar" }, { title: "baz" }],
        },
      },
    };
    let interpolated = interpolate(msgid, context);
    expect(interpolated).toEqual("Foo foo baz");
  });

  it("with a failing expression", () => {
    let msgid = 'Foo %{ alert("foobar") } baz';
    let context = {
      foo: "bar",
    };
    const warnSpy = jest.spyOn(console, "warn");
    interpolate(msgid, context);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith('Cannot evaluate expression: alert("foobar")');
    warnSpy.mockRestore();
  });

  it("should warn of the usage of mustache syntax", () => {
    let msgid = "Foo {{ foo }} baz";
    let context = {
      foo: "bar",
    };
    const warnSpy = jest.spyOn(console, "warn");
    interpolate(msgid, context);
    expect(warnSpy).not.toHaveBeenCalled;
    plugin.options.silent = false;
    interpolate(msgid, context);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });
});
