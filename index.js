"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimplePattern = (function () {
    function SimplePattern() {
        this.parts = [];
        this.nextQuantity = null;
    }
    SimplePattern.prototype.text = function (s) {
        var q = '';
        if (this.nextQuantity) {
            q = this.nextQuantity;
            this.nextQuantity = null;
        }
        this.parts.push(s + q);
        return this;
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
    Object.defineProperty(SimplePattern.prototype, "digits", {
        get: function () {
            this.parts.push('\\d');
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePattern.prototype, "digit", {
        get: function () {
            this.parts.push('\\d');
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePattern.prototype, "of", {
        get: function () {
            return makeSimplePatternBuilder(this);
        },
        enumerable: true,
        configurable: true
    });
    SimplePattern.prototype.count = function (n) {
        this.nextQuantity = '{' + n + '}';
        return this;
    };
    SimplePattern.prototype.toRegexSource = function () {
        return this.parts.join('');
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
    Object.defineProperty(SimplePattern, "digit", {
        get: function () {
            var s = new SimplePattern();
            return s.digit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePattern, "digits", {
        get: function () {
            var s = new SimplePattern();
            return s.digits;
        },
        enumerable: true,
        configurable: true
    });
    SimplePattern.count = function (n) {
        var s = new SimplePattern();
        return s.count(n);
    };
    SimplePattern.text = function (s) {
        var sp = new SimplePattern();
        return sp.text(s);
    };
    return SimplePattern;
}());
function makeSimplePatternBuilder(existingPattern) {
    var of = function (subPattern) {
        if (existingPattern) {
            var q = existingPattern.nextQuantity || '';
            existingPattern.nextQuantity = null;
            if (q) {
                existingPattern.parts.push('(' + subPattern.toRegexSource() + ')' + q);
            }
            else {
                existingPattern.parts.push(subPattern.toRegexSource());
            }
            return existingPattern;
        }
        else {
            return subPattern;
        }
    };
    ['count', 'text'].forEach(function (method) {
        of[method] = function (x) {
            if (existingPattern)
                return existingPattern[method](x);
            else
                return SimplePattern[method](x);
        };
    });
    ['atStart', 'atEnd', 'digit', 'digits'].forEach(function (prop) {
        Object.defineProperty(of, prop, {
            get: function () {
                if (existingPattern)
                    return existingPattern[prop];
                else
                    return SimplePattern[prop];
            }
        });
    });
    return of;
}
exports.default = makeSimplePatternBuilder(null);
