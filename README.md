# Simple Patterns

*coming soon*

The common quote about regular expressions is:

> Some people, when confronted with a problem,
> think "I know, I'll use regular expressions."
> Now they have two problems.

Regular expressions are extremely useful, but they are hard to maintain.

Simple Patterns provides a chai-like interface to generating regular
expressions.

# Examples

To match a username, instead of

    let r = /^[a-z0-9_-]{3,16}$/

You can write (and read):

    import R$ from 'simple-patterns';
    let r = R$.atStart.count(3).to(16).of.charInSet('a-z0-9_-').atEnd;

Instead of this monster IP regex:

    let r = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/

You can maintain this:

    let r = R$.atStart.count(3).of.group(
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
    ).atEnd;


# TODO
1. SimplePattern objects should be immutable
1. Error checking with nice readable error messages
1. More sample regexes to test against
1. Enhancements to standard regex API (named groups, more?)
