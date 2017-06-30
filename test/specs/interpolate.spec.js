import Vue from 'vue'

import GetTextPlugin from '../../src/'
import interpolate from '../../src/interpolate'
import translations from './json/translate.json'


describe('Interpolate tests', () => {

  beforeEach(function () {
    GetTextPlugin.installed = false
    Vue.use(GetTextPlugin, {
      translations: translations,
      silent: true,
    })
  })

  it('without placeholders', () => {
    let msgid = 'Foo bar baz'
    let interpolated = interpolate(msgid)
    expect(interpolated).to.equal('Foo bar baz')
  })

  it('with a placeholder', () => {
    let msgid = 'Foo %{ placeholder } baz'
    let context = { placeholder: 'bar' }
    let interpolated = interpolate(msgid, context)
    expect(interpolated).to.equal('Foo bar baz')
  })

  it('with multiple spaces in the placeholder', () => {
    let msgid = 'Foo %{              placeholder                              } baz'
    let context = { placeholder: 'bar' }
    let interpolated = interpolate(msgid, context)
    expect(interpolated).to.equal('Foo bar baz')
  })

  it('with the same placeholder multiple times', () => {
    let msgid = 'Foo %{ placeholder } baz %{ placeholder } foo'
    let context = { placeholder: 'bar' }
    let interpolated = interpolate(msgid, context)
    expect(interpolated).to.equal('Foo bar baz bar foo')
  })

  it('with multiple placeholders', () => {
    let msgid = '%{foo}%{bar}%{baz}%{bar}%{foo}'
    let context = { foo: 1, bar: 2, baz: 3 }
    let interpolated = interpolate(msgid, context)
    expect(interpolated).to.equal('12321')
  })

  it('with new lines', () => {
    let msgid = '%{       \n    \n\n\n\n  foo} %{bar}!'
    let context = { foo: 'Hello', bar: 'world' }
    let interpolated = interpolate(msgid, context)
    expect(interpolated).to.equal('Hello world!')
  })

  it('with an object', () => {
    let msgid = 'Foo %{ foo.bar } baz'
    let context = {
      foo: {
        bar: 'baz',
      },
    }
    let interpolated = interpolate(msgid, context)
    expect(interpolated).to.equal('Foo baz baz')
  })

  it('with an array', () => {
    let msgid = 'Foo %{ foo[1] } baz'
    let context = {
      foo: [ 'bar', 'baz' ],
    }
    let interpolated = interpolate(msgid, context)
    expect(interpolated).to.equal('Foo baz baz')
  })

  it('with a multi level object', () => {
    let msgid = 'Foo %{ a.b.x } %{ a.c.y[1].title }'
    let context = {
      a: {
        b: {
          x: 'foo',
        },
        c: {
          y: [
            { title: 'bar' },
            { title: 'baz' },
          ],
        },
      },
    }
    let interpolated = interpolate(msgid, context)
    expect(interpolated).to.equal('Foo foo baz')
  })

  it('with a failing eval', () => {
    let msgid = 'Foo %{ alert("foobar") } baz'
    let context = {
      foo: 'bar',
    }
    console.warn = sinon.spy(console, 'warn')
    interpolate(msgid, context)
    expect(console.warn).calledOnce
    expect(console.warn).calledWith('Cannot evaluate expression: alert("foobar")')
    console.warn.restore()
  })

  it('should warn of the usage of mustache syntax', () => {
    let msgid = 'Foo {{ foo }} baz'
    let context = {
      foo: 'bar',
    }
    console.warn = sinon.spy(console, 'warn')
    interpolate(msgid, context)
    expect(console.warn).notCalled
    Vue.config.getTextPluginSilent = false
    interpolate(msgid, context)
    expect(console.warn).calledOnce
    console.warn.restore()
  })

})
