import plurals from "../src/plurals";

describe("Translate plurals tests", () => {
  it("plural form of singular english is 0", function() {
    expect(plurals.getTranslationIndex("en", 1)).toEqual(0);
  });

  it("plural form of plural english is 1", function() {
    expect(plurals.getTranslationIndex("en", 2)).toEqual(1);
  });

  it("plural form of Infinity in english is 1", function() {
    expect(plurals.getTranslationIndex("en", Infinity)).toEqual(1);
  });

  it("plural form of zero in english is 1", function() {
    expect(plurals.getTranslationIndex("en", 0)).toEqual(1);
  });

  it("plural form of singular dutch is 0", function() {
    expect(plurals.getTranslationIndex("nl", 1)).toEqual(0);
  });

  it("plural form of plural dutch is 1", function() {
    expect(plurals.getTranslationIndex("nl", 2)).toEqual(1);
  });

  it("plural form of zero in dutch is 1", function() {
    expect(plurals.getTranslationIndex("nl", 0)).toEqual(1);
  });

  it("plural form of singular french is 0", function() {
    expect(plurals.getTranslationIndex("fr", 1)).toEqual(0);
  });

  it("plural form of plural french is 1", function() {
    expect(plurals.getTranslationIndex("fr", 2)).toEqual(1);
  });

  it("plural form of zero in french is 0", function() {
    expect(plurals.getTranslationIndex("fr", 0)).toEqual(0);
  });

  it("plural form of 27 in arabic is 4", function() {
    expect(plurals.getTranslationIndex("ar", 27)).toEqual(4);
  });

  it("plural form of 23 in kashubian is 1", function() {
    expect(plurals.getTranslationIndex("csb", 23)).toEqual(1);
  });
});
