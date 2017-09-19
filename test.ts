/// <reference path="node_modules/@types/mocha/index.d.ts" />

import R$ from './index';
import { assert } from 'chai';

describe('SimplePattern', () => {
  it('should produce a regex for phone numbers', () => {

    let r$ = R$.atStart.count(2).group(
      R$.count(3).digits().chr('-')
    ).then.chr('-').count(4).digits().atEnd;

    assert.equal(r$.toRegexSource(), '^(\\d{3}-){2}-\\d{4}$');
  });

  it('should produce a regex for usernames', () => {
    let r$ = R$.atStart.count(3).to(16).of.charInSet('a-z0-9_-').atEnd;
    assert.equal(r$.toRegexSource(), '^[a-z0-9_-]{3,16}$');
  });

  it('should produce a regex to match IP addresses', () => {
    let r$ = R$.atStart.count(3).of.group(
       R$.oneOf(
         R$.charInSet('0-9'),
         R$.charInSet('1-9').charInSet('0-9'),
         R$.chr('1').count(2).of.charInSet('0-9'),
         R$.chr('2').charInSet('0-4').charInSet('0-9'),
         R$.text('25').charInSet('0-5'),
       ).then.chr('.')
     ).then.oneOf(
       R$.charInSet('0-9'),
       R$.charInSet('1-9').charInSet('0-9'),
       R$.chr('1').count(2).of.charInSet('0-9'),
       R$.chr('2').charInSet('0-4').charInSet('0-9'),
       R$.text('25').charInSet('0-5'),
    ).atEnd;
    assert.equal(r$.toRegexSource(), '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$')
  });

});
