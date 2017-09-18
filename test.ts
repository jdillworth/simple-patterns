/// <reference path="node_modules/@types/mocha/index.d.ts" />

import R$ from './index';
import { assert } from 'chai';

describe('SimplePattern', () => {
  it('should produce a regex for phone numbers', () => {
    let r$ = R$.atStart.count(2).of(
      R$.count(3).of.digit.text('-')
    ).text('-').count(4).of.digit.atEnd;

    assert.ok(r$.toRegexSource(), '^(\\d{3}-){2}-\\d{4}$');
  });

});
