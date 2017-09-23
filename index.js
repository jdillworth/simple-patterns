"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NEEDS_ESCAPE = '.[]{}\\';
function esc(s) {
    if (!s)
        return s;
    var s2 = '';
    for (var i = 0; i < s.length; i++) {
        var ch = s.charAt(i);
        if (NEEDS_ESCAPE.indexOf(ch) !== -1) {
            s2 += '\\';
        }
        s2 += ch;
    }
    return s2;
}
var SimplePattern = (function () {
    function SimplePattern() {
        this.regexParts = [];
        this.nextQuantity = null;
    }
    SimplePattern.prototype.concat = function (regexPart) {
        var p2 = this.regexParts.concat([regexPart]);
        if (this.nextQuantity) {
            p2 = p2.concat([this.nextQuantity]);
        }
        var sp2 = new SimplePattern();
        sp2.regexParts = p2;
        return sp2;
    };
    SimplePattern.prototype.text = function (s) {
        return this.concat(esc(s));
    };
    SimplePattern.prototype.charInSet = function (s) {
        return this.concat('[' + esc(s) + ']');
    };
    SimplePattern.prototype.chr = function (s) {
        return this.text(s);
    };
    SimplePattern.prototype.atStart = function () {
        return this.concat('^');
    };
    SimplePattern.prototype.atEnd = function () {
        return this.concat('$');
    };
    SimplePattern.prototype.digits = function () {
        return this.concat('\\d');
    };
    SimplePattern.prototype.oneOf = function () {
        var subs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            subs[_i] = arguments[_i];
        }
        var p = ['(', subs.map(function (p) { return p.toRegexSource(); }).join('|'), ')'];
        return this.concat(p.join(''));
    };
    SimplePattern.prototype.digit = function () {
        return this.digits();
    };
    Object.defineProperty(SimplePattern.prototype, "then", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePattern.prototype, "of", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    SimplePattern.prototype.join = function () {
        var subs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            subs[_i] = arguments[_i];
        }
        var p = subs.map(function (p) { return p.toRegexSource(); }).join('');
        return this.concat(p);
    };
    SimplePattern.prototype.count = function (n) {
        var sp = new SimplePattern();
        sp.regexParts = this.regexParts;
        sp.nextQuantity = '{' + n + '}';
        return sp;
    };
    SimplePattern.prototype.to = function (max) {
        var sp = new SimplePattern();
        sp.regexParts = this.regexParts;
        var nq = this.nextQuantity;
        var min = nq.substring(1, nq.length - 1);
        sp.nextQuantity = '{' + min + ',' + max + '}';
        return sp;
    };
    SimplePattern.prototype.group = function (subPattern) {
        var p = ['(', subPattern.toRegexSource(), ')'];
        return this.concat(p.join(''));
    };
    SimplePattern.prototype.toRegexSource = function () {
        return this.regexParts.join('');
    };
    SimplePattern.group = function (subPattern) {
        var sp = new SimplePattern();
        return sp.group(subPattern);
    };
    SimplePattern.atStart = function () {
        var s = new SimplePattern();
        return s.atStart();
    };
    SimplePattern.atEnd = function () {
        var s = new SimplePattern();
        return s.atEnd();
    };
    SimplePattern.digit = function () {
        var s = new SimplePattern();
        return s.digit();
    };
    SimplePattern.digits = function () {
        var s = new SimplePattern();
        return s.digits();
    };
    SimplePattern.count = function (n) {
        var s = new SimplePattern();
        return s.count(n);
    };
    SimplePattern.text = function (s) {
        var sp = new SimplePattern();
        return sp.text(s);
    };
    SimplePattern.chr = function (s) {
        var sp = new SimplePattern();
        return sp.chr(s);
    };
    SimplePattern.charInSet = function (s) {
        var sp = new SimplePattern();
        return sp.charInSet(s);
    };
    SimplePattern.oneOf = function () {
        var subs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            subs[_i] = arguments[_i];
        }
        var sp = new SimplePattern();
        return sp.oneOf.apply(sp, subs);
    };
    SimplePattern.join = function () {
        var subs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            subs[_i] = arguments[_i];
        }
        var sp = new SimplePattern();
        return sp.join.apply(sp, subs);
    };
    return SimplePattern;
}());
exports.default = SimplePattern;
