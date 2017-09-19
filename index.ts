const NEEDS_ESCAPE = '.[]{}\\';

function esc(s:string):string {
  if (!s) return s;

  let s2 = '';
  for (let i = 0; i < s.length; i++) {
    let ch = s.charAt(i);
    if (NEEDS_ESCAPE.indexOf(ch) !== -1) {
      s2 += '\\';
    }
    s2 += ch;
  }
  return s2;
}

export default class SimplePattern {
  parts:Array<String>;
  nextQuantity:string;

  constructor() {
    this.parts = [];
    this.nextQuantity = null;
  }

  private applyQuantity():void {
    if (this.nextQuantity) {
      this.parts.push(this.nextQuantity)
      this.nextQuantity = null;
    }
  }

  text(s:string):SimplePattern {
    this.parts.push(esc(s));
    this.applyQuantity();
    return this;
  }

  charInSet(s:string):SimplePattern {
    this.parts.push('[' + esc(s) + ']');
    this.applyQuantity();
    return this;
  }

  chr(s:string):SimplePattern {
    // TODO: make sure just one character
    return this.text(s);
  }

  get atStart():SimplePattern {
    this.parts.push('^');
    return this;
  }

  get atEnd():SimplePattern {
    this.parts.push('$');
    return this;
  }

  digits():SimplePattern {
    this.parts.push('\\d');
    this.applyQuantity();
    return this;
  }

  oneOf(...subs:Array<SimplePattern>):SimplePattern {
    this.parts.push('(');
    this.parts.push(subs.map((p) => p.toRegexSource()).join('|'));
    this.parts.push(')');
    this.applyQuantity();
    return this;
  }

  digit():SimplePattern {
    return this.digits();
  }

  get then():SimplePattern {
    return this;
  }

  get of():SimplePattern {
    return this;
  }

  count(n:number):SimplePattern {
    this.nextQuantity = '{' + n + '}';
    return this;
  }

  to(max:number):SimplePattern {
    // TODO: error check nextQuantity and max/min values
    let nq = this.nextQuantity;
    let min = nq.substring(1, nq.length - 1);
    this.nextQuantity = '{' + min + ',' + max + '}';
    return this;
  }


  group(subPattern:SimplePattern):SimplePattern {
    this.parts.push('(');
    this.parts.push(subPattern.toRegexSource());
    this.parts.push(')');
    this.applyQuantity();
    return this;
  }

  toRegexSource():string {
    return this.parts.join('');
  }

  static group(subPattern:SimplePattern):SimplePattern {
    let sp = new SimplePattern();
    return sp.group(subPattern);
  }

  static get atStart():SimplePattern {
    let s = new SimplePattern();
    return s.atStart;
  }

  static get atEnd():SimplePattern {
    let s = new SimplePattern();
    return s.atEnd;
  }
  static digit():SimplePattern {
    let s = new SimplePattern();
    return s.digit();
  }

  static digits():SimplePattern {
    let s = new SimplePattern();
    return s.digits();
  }

  static count(n:number):SimplePattern {
    let s = new SimplePattern();
    return s.count(n);
  }

  static text(s:string):SimplePattern {
    let sp = new SimplePattern();
    return sp.text(s);
  }

  static chr(s:string):SimplePattern {
    let sp = new SimplePattern();
    return sp.chr(s);
  }

  static charInSet(s:string):SimplePattern {
    let sp = new SimplePattern();
    return sp.charInSet(s);
  }

  static oneOf(...subs:Array<SimplePattern>):SimplePattern {
    let sp = new SimplePattern();
    return sp.oneOf(...subs);
  }

}
