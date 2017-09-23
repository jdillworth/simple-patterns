"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var chai_1 = require("chai");
describe('SimplePattern', function () {
    it('should produce a regex for phone numbers', function () {
        var r$ = index_1.default.atStart().count(2).group(index_1.default.count(3).digits().chr('-')).then.chr('-').count(4).digits().atEnd();
        chai_1.assert.equal(r$.toRegexSource(), '^(\\d{3}-){2}-\\d{4}$');
    });
    it('should produce a regex for usernames', function () {
        var r$ = index_1.default.atStart().count(3).to(16).of.charInSet('a-z0-9_-').atEnd();
        chai_1.assert.equal(r$.toRegexSource(), '^[a-z0-9_-]{3,16}$');
    });
    it('should produce a regex to match IP addresses', function () {
        var r$ = index_1.default.atStart().count(3).of.group(index_1.default.oneOf(index_1.default.charInSet('0-9'), index_1.default.charInSet('1-9').charInSet('0-9'), index_1.default.chr('1').count(2).of.charInSet('0-9'), index_1.default.chr('2').charInSet('0-4').charInSet('0-9'), index_1.default.text('25').charInSet('0-5')).then.chr('.')).then.oneOf(index_1.default.charInSet('0-9'), index_1.default.charInSet('1-9').charInSet('0-9'), index_1.default.chr('1').count(2).of.charInSet('0-9'), index_1.default.chr('2').charInSet('0-4').charInSet('0-9'), index_1.default.text('25').charInSet('0-5')).atEnd();
        chai_1.assert.equal(r$.toRegexSource(), '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$');
    });
    it('should allow composing named regexes', function () {
        var octetDot$ = index_1.default.oneOf(index_1.default.charInSet('0-9'), index_1.default.charInSet('1-9').charInSet('0-9'), index_1.default.chr('1').count(2).of.charInSet('0-9'), index_1.default.chr('2').charInSet('0-4').charInSet('0-9'), index_1.default.text('25').charInSet('0-5')).then.chr('.');
        var octet$ = index_1.default.oneOf(index_1.default.charInSet('0-9'), index_1.default.charInSet('1-9').charInSet('0-9'), index_1.default.chr('1').count(2).of.charInSet('0-9'), index_1.default.chr('2').charInSet('0-4').charInSet('0-9'), index_1.default.text('25').charInSet('0-5'));
        var ip$ = index_1.default.join(index_1.default.atStart(), octetDot$, octetDot$, octetDot$, octet$, index_1.default.atEnd());
        var ip2$ = index_1.default.atStart().join(octetDot$).join(octetDot$).join(octetDot$).join(octet$).atEnd();
        chai_1.assert.equal(ip$.toRegexSource(), ip2$.toRegexSource());
        chai_1.assert.equal(ip$.toRegexSource(), '^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$');
    });
    it('should be immutable, returning a new object for every change', function () {
        var r1$ = index_1.default.atStart();
        var r2$ = r1$.chr('-');
        var r3$ = r2$.charInSet('a-z');
        var r4$ = r3$.text('m');
        var r5$ = r4$.count(4).of.digit();
        var r6$ = r5$.join(index_1.default.chr('H'));
        chai_1.assert.notEqual(r1$.toRegexSource(), r2$.toRegexSource());
        chai_1.assert.notEqual(r2$.toRegexSource(), r3$.toRegexSource());
        chai_1.assert.notEqual(r3$.toRegexSource(), r4$.toRegexSource());
        chai_1.assert.notEqual(r4$.toRegexSource(), r5$.toRegexSource());
        chai_1.assert.notEqual(r5$.toRegexSource(), r6$.toRegexSource());
        chai_1.assert.notEqual(r1$.toRegexSource(), r6$.toRegexSource());
    });
});
