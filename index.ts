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
  private regexParts:Array<string>;
  private nextQuantity:string;

  constructor() {
    this.regexParts = [];
    this.nextQuantity = null;
  }

  private concat(regexPart:string):SimplePattern {
    let p2:Array<string> = this.regexParts.concat([regexPart]);
    if (this.nextQuantity) {
      p2 = p2.concat([this.nextQuantity]);
    }
    let sp2 = new SimplePattern();
    sp2.regexParts = p2;
    return sp2;
  }


  text(s:string):SimplePattern {
    return this.concat(esc(s));
  }

  charInSet(s:string):SimplePattern {
    return this.concat('[' + esc(s) + ']');
  }

  chr(s:string):SimplePattern {
    // TODO: make sure just one character
    return this.text(s);
  }

  atStart():SimplePattern {
    // TODO: assert no quantity
    return this.concat('^');
  }

  atEnd():SimplePattern {
    // TODO: assert no quantity
    return this.concat('$');
  }

  digits():SimplePattern {
    return this.concat('\\d');
  }

  oneOf(...subs:Array<SimplePattern>):SimplePattern {
    let p = ['(', subs.map((p) => p.toRegexSource()).join('|'), ')'];
    return this.concat(p.join(''));
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

  join(...subs:Array<SimplePattern>):SimplePattern {
    let p:string = subs.map((p) => p.toRegexSource()).join('');
    return this.concat(p);
  }

  count(n:number):SimplePattern {
    let sp = new SimplePattern();
    sp.regexParts = this.regexParts;
    sp.nextQuantity = '{' + n + '}';
    return sp;
  }

  to(max:number):SimplePattern {
    // TODO: error check nextQuantity and max/min values
    let sp = new SimplePattern();
    sp.regexParts = this.regexParts;

    let nq = this.nextQuantity;
    let min = nq.substring(1, nq.length - 1);

    sp.nextQuantity = '{' + min + ',' + max + '}';
    return sp;
  }


  group(subPattern:SimplePattern):SimplePattern {
    let p = ['(', subPattern.toRegexSource(), ')'];
    return this.concat(p.join(''));
  }

  toRegexSource():string {
    return this.regexParts.join('');
  }

  static group(subPattern:SimplePattern):SimplePattern {
    let sp = new SimplePattern();
    return sp.group(subPattern);
  }

  static atStart():SimplePattern {
    let s = new SimplePattern();
    return s.atStart();
  }

  static atEnd():SimplePattern {
    let s = new SimplePattern();
    return s.atEnd();
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

  static join(...subs:Array<SimplePattern>):SimplePattern {
    let sp = new SimplePattern();
    return sp.join(...subs);
  }

}
