"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var chai_1 = require("chai");
describe('SimplePattern', function () {
    it('should produce a regex for phone numbers', function () {
        var r$ = index_1.default.atStart.count(2).group(index_1.default.count(3).digits().chr('-')).then.chr('-').count(4).digits().atEnd;
        chai_1.assert.equal(r$.toRegexSource(), '^(\\d{3}-){2}-\\d{4}$');
    });
    it('should produce a regex for usernames', function () {
        var r$ = index_1.default.atStart.count(3).to(16).of.charInSet('a-z0-9_-').atEnd;
        chai_1.assert.equal(r$.toRegexSource(), '^[a-z0-9_-]{3,16}$');
    });
    it('should produce a regex to match IP addresses', function () {
        var r$ = index_1.default.atStart.count(3).of.group(index_1.default.oneOf(index_1.default.charInSet('0-9'), index_1.default.charInSet('1-9').charInSet('0-9'), index_1.default.chr('1').count(2).of.charInSet('0-9'), index_1.default.chr('2').charInSet('0-4').charInSet('0-9'), index_1.default.text('25').charInSet('0-5')).then.chr('.')).then.oneOf(index_1.default.charInSet('0-9'), index_1.default.charInSet('1-9').charInSet('0-9'), index_1.default.chr('1').count(2).of.charInSet('0-9'), index_1.default.chr('2').charInSet('0-4').charInSet('0-9'), index_1.default.text('25').charInSet('0-5')).atEnd;
        chai_1.assert.equal(r$.toRegexSource(), '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$');
    });
});
