import assert from 'node:assert/strict'
import test from 'node:test'
import { translate } from '../dist/index.js'

test('translates an exact key in a flat dot-key dictionary', () => {
  assert.equal(translate({ 'dashboard.heading': 'Welcome' }, 'dashboard.heading'), 'Welcome')
})

test('returns the key when the message is missing', () => {
  assert.equal(translate({}, 'dashboard.heading'), 'dashboard.heading')
})

test('uses an explicit fallback for missing messages', () => {
  assert.equal(translate({}, 'dashboard.heading', {}, { fallback: 'Not translated' }), 'Not translated')
})

test('interpolates Laravel placeholders with string and non-string replacements', () => {
  const messages = { 'files.summary': ':count files, active: :active, owner: :name' }
  const replacements = { count: 3, active: false, name: 'Ada' }

  assert.equal(
    translate(messages, 'files.summary', replacements),
    '3 files, active: false, owner: Ada',
  )
})

test('leaves unknown placeholders intact', () => {
  assert.equal(translate({ greeting: 'Hello :name, :team' }, 'greeting', { name: 'Ada' }), 'Hello Ada, :team')
})

test('interpolates placeholders in an explicit fallback', () => {
  assert.equal(
    translate({}, 'greeting', { name: 'Ada' }, { fallback: 'Hello :name' }),
    'Hello Ada',
  )
})

test('does not treat inherited dictionary entries as translations', () => {
  const messages = Object.create({ greeting: 'Inherited message' })

  assert.equal(translate(messages, 'greeting'), 'greeting')
})
