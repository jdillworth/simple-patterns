class SimplePattern {
  parts:Array<String>;
  nextQuantity:string;

  constructor() {
    this.parts = [];
    this.nextQuantity = null;
  }

  text(s:string):SimplePattern {
    let q = '';
    if (this.nextQuantity) {
      q = this.nextQuantity;
      this.nextQuantity = null;
    }
    this.parts.push(s + q);
    return this;
  }

  get atStart():SimplePattern {
    this.parts.push('^');
    return this;
  }

  get atEnd():SimplePattern {
    this.parts.push('$');
    return this;
  }

  get digits():SimplePattern {
    this.parts.push('\\d');
    return this;
  }

  get digit():SimplePattern {
    this.parts.push('\\d');
    return this;
  }

  get of():PatternBuilder {
    // TODO: nextQuantity should be set
    return makeSimplePatternBuilder(this);
  }

  count(n:number):SimplePattern {
    this.nextQuantity = '{' + n + '}';
    return this;
  }

  toRegexSource():string {
    return this.parts.join('');
  }

  static get atStart():SimplePattern {
    let s = new SimplePattern();
    return s.atStart;
  }

  static get atEnd():SimplePattern {
    let s = new SimplePattern();
    return s.atEnd;
  }
  static get digit():SimplePattern {
    let s = new SimplePattern();
    return s.digit;
  }

  static get digits():SimplePattern {
    let s = new SimplePattern();
    return s.digits;
  }

  static count(n:number):SimplePattern {
    let s = new SimplePattern();
    return s.count(n);
  }

  static text(s:string):SimplePattern {
    let sp = new SimplePattern();
    return sp.text(s);
  }

}

interface PatternBuilder {
  (subPattern:SimplePattern):SimplePattern;
  atStart:SimplePattern;
  atEnd:SimplePattern;
  digit:SimplePattern;
  digits:SimplePattern;
  count(n:number):SimplePattern;
  text(s:string):SimplePattern;
  of:PatternBuilder;
}

function makeSimplePatternBuilder(existingPattern:SimplePattern):PatternBuilder {

  let of = function(subPattern:SimplePattern):SimplePattern {
    if (existingPattern) {
      let q = existingPattern.nextQuantity || '';
      existingPattern.nextQuantity = null;
      if (q) {
        existingPattern.parts.push('(' + subPattern.toRegexSource() + ')' + q);
      } else {
        existingPattern.parts.push(subPattern.toRegexSource());
      }
      return existingPattern;
    } else {
      return subPattern;
    }
  };

  ['count', 'text'].forEach((method) => {
    of[method] = function(x:any) {
      if (existingPattern) return existingPattern[method](x);
      else return SimplePattern[method](x);
    };
  });

  ['atStart', 'atEnd', 'digit', 'digits'].forEach((prop) => {
    Object.defineProperty(of, prop, {
      get:() => {
        if (existingPattern) return existingPattern[prop]
        else return SimplePattern[prop]
      }
    });
  });

  return <PatternBuilder>of;
}


export default makeSimplePatternBuilder(null);
