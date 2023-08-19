import { Term } from 'compromise/types/misc';
import { capitalize, lower, upper } from './util';
import { articles, skipWords } from './constants';

export type Condition = (
  term: Term,
  prev: Term | undefined,
  ...args: any[]
) => boolean;
export type Command = (str: string) => string;
export type Rule = [Condition, Command, ...any[]];
export type RuleSet = Rule[];

export const conditions: Record<string, Condition> = {
  hasInnerCaps(term: Term, prev: Term | undefined) {
    return /\p{Ll}\p{Lu}/u.test(term.text);
  },
  isAllCaps(term: Term, prev: Term | undefined) {
    return (
      // Must have uppercase letter
      /\p{Lu}/u.test(term.text) &&
      // but not lowercase letter
      !/\p{Ll}/u.test(term.text)
    );
  },
  isAfter(term: Term, prev: Term | undefined, what: string[]) {
    return (
      !!prev &&
      (what.includes(prev.post.trim()) || what.includes(prev.text.trim()))
    );
  },
  isOneOf(term: Term, prev: Term | undefined, what: string[]) {
    return what.includes(term.text.trim());
  },
  isSentenceStart(term: Term, prev: Term | undefined) {
    return !prev || /[\p{Sentence_Terminal}]\s*$/u.test(prev.post);
  },
  isLenLessThan(term: Term, prev: Term | undefined, what: number) {
    return term.text.length < what;
  },
  isLenGreaterThan(term: Term, prev: Term | undefined, what: number) {
    return term.text.length > what;
  },
  otherwise() {
    return true;
  },
};

export const commands: Record<string, Command> = {
  capitalize,
  lower,
  upper,
  nothing(str: string) {
    return str;
  },
};

export const apaTitleCase: RuleSet = [
  [conditions.hasInnerCaps, commands.nothing],
  [conditions.isAllCaps, commands.nothing],
  [conditions.isSentenceStart, commands.capitalize],
  [conditions.isAfter, commands.capitalize, [':', '—']],
  [conditions.isOneOf, commands.lower, Array.from(articles)],
  [conditions.isLenGreaterThan, commands.capitalize, 3],
  [conditions.isOneOf, commands.lower, Array.from(skipWords)],
  [conditions.otherwise, commands.capitalize],
];

export const genericSentenceCase: RuleSet = [
  [conditions.hasInnerCaps, commands.nothing],
  [conditions.isAllCaps, commands.nothing],
  [conditions.isSentenceStart, commands.capitalize],
  [conditions.otherwise, commands.lower],
];
