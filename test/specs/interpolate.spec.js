import interpolate from '../../src/interpolate'


describe('Interpolate tests', () => {

  it('tests the interpolate() method without placeholders', () => {
    let msgid = 'Foo bar baz'
    let interpolated = interpolate(msgid)
    expect(interpolated).to.equal('Foo bar baz')
  })

  it('tests the interpolate() method with a placeholder', () => {
    let msgid = 'Foo %{ placeholder } baz'
    let context = { placeholder: 'bar' }
    let interpolated = interpolate(msgid, context)
    expect(interpolated).to.equal('Foo bar baz')
  })

  it('tests the interpolate() method with multiple spaces in the placeholder', () => {
    let msgid = 'Foo %{              placeholder                              } baz'
    let context = { placeholder: 'bar' }
    let interpolated = interpolate(msgid, context)
    expect(interpolated).to.equal('Foo bar baz')
  })

  it('tests the interpolate() method with the same placeholder multiple times', () => {
    let msgid = 'Foo %{ placeholder } baz %{ placeholder } foo'
    let context = { placeholder: 'bar' }
    let interpolated = interpolate(msgid, context)
    expect(interpolated).to.equal('Foo bar baz bar foo')
  })

  it('tests the interpolate() method with multiple placeholders', () => {
    let msgid = '%{foo}%{bar}%{baz}%{bar}%{foo}'
    let context = { foo: 1, bar: 2, baz: 3 }
    let interpolated = interpolate(msgid, context)
    expect(interpolated).to.equal('12321')
  })

  it('tests the interpolate() method with new lines', () => {
    let msgid = '%{       \n    \n\n\n\n  foo} %{bar}!'
    let context = { foo: 'Hello', bar: 'world' }
    let interpolated = interpolate(msgid, context)
    expect(interpolated).to.equal('Hello world!')
  })

})
