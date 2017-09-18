"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var chai_1 = require("chai");
describe('SimplePattern', function () {
    it('should produce a regex for phone numbers', function () {
        var r$ = index_1.default.atStart.count(2).of(index_1.default.count(3).of.digit.text('-')).text('-').count(4).of.digit.atEnd;
        chai_1.assert.ok(r$.toRegexSource(), '^(\\d{3}-){2}-\\d{4}$');
    });
});
