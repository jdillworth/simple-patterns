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
        this.parts = [];
        this.nextQuantity = null;
    }
    SimplePattern.prototype.applyQuantity = function () {
        if (this.nextQuantity) {
            this.parts.push(this.nextQuantity);
            this.nextQuantity = null;
        }
    };
    SimplePattern.prototype.text = function (s) {
        this.parts.push(esc(s));
        this.applyQuantity();
        return this;
    };
    SimplePattern.prototype.charInSet = function (s) {
        this.parts.push('[' + esc(s) + ']');
        this.applyQuantity();
        return this;
    };
    SimplePattern.prototype.chr = function (s) {
        return this.text(s);
    };
    Object.defineProperty(SimplePattern.prototype, "atStart", {
        get: function () {
            this.parts.push('^');
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePattern.prototype, "atEnd", {
        get: function () {
            this.parts.push('$');
            return this;
        },
        enumerable: true,
        configurable: true
    });
    SimplePattern.prototype.digits = function () {
        this.parts.push('\\d');
        this.applyQuantity();
        return this;
    };
    SimplePattern.prototype.oneOf = function () {
        var subs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            subs[_i] = arguments[_i];
        }
        this.parts.push('(');
        this.parts.push(subs.map(function (p) { return p.toRegexSource(); }).join('|'));
        this.parts.push(')');
        this.applyQuantity();
        return this;
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
    SimplePattern.prototype.count = function (n) {
        this.nextQuantity = '{' + n + '}';
        return this;
    };
    SimplePattern.prototype.to = function (max) {
        var nq = this.nextQuantity;
        var min = nq.substring(1, nq.length - 1);
        this.nextQuantity = '{' + min + ',' + max + '}';
        return this;
    };
    SimplePattern.prototype.group = function (subPattern) {
        this.parts.push('(');
        this.parts.push(subPattern.toRegexSource());
        this.parts.push(')');
        this.applyQuantity();
        return this;
    };
    SimplePattern.prototype.toRegexSource = function () {
        return this.parts.join('');
    };
    SimplePattern.group = function (subPattern) {
        var sp = new SimplePattern();
        return sp.group(subPattern);
    };
    Object.defineProperty(SimplePattern, "atStart", {
        get: function () {
            var s = new SimplePattern();
            return s.atStart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePattern, "atEnd", {
        get: function () {
            var s = new SimplePattern();
            return s.atEnd;
        },
        enumerable: true,
        configurable: true
    });
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
    return SimplePattern;
}());
exports.default = SimplePattern;
