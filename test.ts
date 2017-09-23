/// <reference path="node_modules/@types/mocha/index.d.ts" />

import R$ from './index';
import { assert } from 'chai';

describe('SimplePattern', () => {
  it('should produce a regex for phone numbers', () => {

    let r$ = R$.atStart().count(2).group(
      R$.count(3).digits().chr('-')
    ).then.chr('-').count(4).digits().atEnd();

    assert.equal(r$.toRegexSource(), '^(\\d{3}-){2}-\\d{4}$');
  });

  it('should produce a regex for usernames', () => {
    let r$ = R$.atStart().count(3).to(16).of.charInSet('a-z0-9_-').atEnd();
    assert.equal(r$.toRegexSource(), '^[a-z0-9_-]{3,16}$');
  });

  it('should produce a regex to match IP addresses', () => {
    let r$ = R$.atStart().count(3).of.group(
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
    ).atEnd();
    assert.equal(r$.toRegexSource(), '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$')
  });

  it('should allow composing named regexes', () => {
    let octetDot$ = R$.oneOf(
        R$.charInSet('0-9'),
        R$.charInSet('1-9').charInSet('0-9'),
        R$.chr('1').count(2).of.charInSet('0-9'),
        R$.chr('2').charInSet('0-4').charInSet('0-9'),
        R$.text('25').charInSet('0-5'),
      ).then.chr('.');

    let octet$ = R$.oneOf(
        R$.charInSet('0-9'),
        R$.charInSet('1-9').charInSet('0-9'),
        R$.chr('1').count(2).of.charInSet('0-9'),
        R$.chr('2').charInSet('0-4').charInSet('0-9'),
        R$.text('25').charInSet('0-5'),
      );

    // static or instance versions should be the same
    let ip$ = R$.join(R$.atStart(), octetDot$, octetDot$, octetDot$, octet$, R$.atEnd());
    let ip2$ = R$.atStart().join(octetDot$).join(octetDot$).join(octetDot$).join(octet$).atEnd();

    assert.equal(ip$.toRegexSource(), ip2$.toRegexSource());
    assert.equal(ip$.toRegexSource(), '^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$')

  });

  it('should be immutable, returning a new object for every change', () => {
    let r1$ = R$.atStart();
    let r2$ = r1$.chr('-');
    let r3$ = r2$.charInSet('a-z');
    let r4$ = r3$.text('m');
    let r5$ = r4$.count(4).of.digit();
    let r6$ = r5$.join(R$.chr('H'));


    assert.notEqual(r1$.toRegexSource(), r2$.toRegexSource());
    assert.notEqual(r2$.toRegexSource(), r3$.toRegexSource());
    assert.notEqual(r3$.toRegexSource(), r4$.toRegexSource());
    assert.notEqual(r4$.toRegexSource(), r5$.toRegexSource());
    assert.notEqual(r5$.toRegexSource(), r6$.toRegexSource());
    assert.notEqual(r1$.toRegexSource(), r6$.toRegexSource());
  });

});
