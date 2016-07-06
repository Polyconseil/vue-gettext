import plurals from '../src/plurals'

describe('Translate plurals tests', () => {

  it('plural form of singular english is 0', function () {
    expect(plurals.getTranslationIndex('en', 1)).toBe(0)
  })

  it('plural form of plural english is 1', function () {
    expect(plurals.getTranslationIndex('en', 2)).toBe(1)
  })

  it('plural form of zero in english is 1', function () {
    expect(plurals.getTranslationIndex('en', 0)).toBe(1)
  })

  it('plural form of singular dutch is 0', function () {
    expect(plurals.getTranslationIndex('nl', 1)).toBe(0)
  })

  it('plural form of plural dutch is 1', function () {
    expect(plurals.getTranslationIndex('nl', 2)).toBe(1)
  })

  it('plural form of zero in dutch is 1', function () {
    expect(plurals.getTranslationIndex('nl', 0)).toBe(1)
  })

  it('plural form of singular french is 0', function () {
    expect(plurals.getTranslationIndex('fr', 1)).toBe(0)
  })

  it('plural form of plural french is 1', function () {
    expect(plurals.getTranslationIndex('fr', 2)).toBe(1)
  })

  it('plural form of zero in french is 0', function () {
    expect(plurals.getTranslationIndex('fr', 0)).toBe(0)
  })

  it('plural form of 27 in arabic is 4', function () {
    expect(plurals.getTranslationIndex('ar', 27)).toBe(4)
  })

})
