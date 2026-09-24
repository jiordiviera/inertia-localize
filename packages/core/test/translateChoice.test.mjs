import assert from 'node:assert/strict'
import test from 'node:test'
import { translateChoice } from '../dist/index.js'

test('picks the first of two unmarked segments when count is 1', () => {
  const messages = { apples: 'There is one apple|There are many apples' }

  assert.equal(translateChoice(messages, 'apples', 1), 'There is one apple')
})

test('picks the second of two unmarked segments when count is not 1', () => {
  const messages = { apples: 'There is one apple|There are many apples' }

  assert.equal(translateChoice(messages, 'apples', 5), 'There are many apples')
})

test('resolves explicit exact and range selectors', () => {
  const messages = {
    apples: '{0} There are none|[1,19] There are some|[20,*] There are many',
  }

  assert.equal(translateChoice(messages, 'apples', 0), 'There are none')
  assert.equal(translateChoice(messages, 'apples', 10), 'There are some')
  assert.equal(translateChoice(messages, 'apples', 20), 'There are many')
  assert.equal(translateChoice(messages, 'apples', 1000), 'There are many')
})

test('auto-interpolates :count alongside other replacements', () => {
  const messages = {
    apples: '{1} :name has one apple|[2,*] :name has :count apples',
  }

  assert.equal(
    translateChoice(messages, 'apples', 1, { name: 'Ada' }),
    'Ada has one apple',
  )
  assert.equal(
    translateChoice(messages, 'apples', 3, { name: 'Ada' }),
    'Ada has 3 apples',
  )
})

test('the count argument overrides a same-named replacement, matching trans_choice', () => {
  const messages = { apples: ':count apples' }

  assert.equal(
    translateChoice(messages, 'apples', 3, { count: 999 }),
    '3 apples',
  )
})

test('falls back to the last segment when no explicit selector matches', () => {
  const messages = { apples: '{0} none|{1} one' }

  assert.equal(translateChoice(messages, 'apples', 5), 'one')
})

test('returns the key when the message is missing', () => {
  assert.equal(translateChoice({}, 'apples', 3), 'apples')
})

test('uses an explicit fallback for missing messages', () => {
  assert.equal(
    translateChoice({}, 'apples', 3, {}, { fallback: '{1} one|[2,*] :count' }),
    '3',
  )
})

test('a single-segment message (no pipes) is returned as-is, interpolated', () => {
  assert.equal(
    translateChoice({ apples: ':count apples total' }, 'apples', 7),
    '7 apples total',
  )
})
