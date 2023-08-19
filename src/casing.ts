import nlp from 'compromise/one';
import { lower } from './util';
import {
  RuleSet,
  apaTitleCase,
  conditions,
  genericSentenceCase,
} from './rules';

const markdownLineStartRE = /^((?:#+ +|- +|(?:> +)+))?(.*)/;
function applyToMDLine(str: string, fn: (str: string) => string) {
  return str.replace(markdownLineStartRE, (_, m1, m2) => {
    return (m1 ?? '') + fn(m2);
  });
}

const nlRE = /([\n\r]+)/g;
function eachLine(str: string, fn: (str: string) => string) {
  return str
    .split(nlRE)
    .map((line) => {
      if (nlRE.test(line)) return line;
      if (
        conditions.isAllCaps(
          { text: line, pre: '', post: '', normal: '' },
          undefined
        )
      )
        line = lower(line);
      return applyToMDLine(line, fn);
    })
    .join('');
}

function applyRuleSet(rules: RuleSet) {
  return (str: string) => {
    const doc = nlp(str);
    doc.termList().forEach((term, i, terms) => {
      for (const rule of rules) {
        const [condition, command, ...args] = rule;
        if (condition(term, terms[i - 1], ...args)) {
          term.text = command(term.text);
          return;
        }
      }
    });
    return doc.text();
  };
}

export function titleCase(str: string) {
  return eachLine(str, applyRuleSet(apaTitleCase));
}

export function sentenceCase(str: string) {
  return eachLine(str, applyRuleSet(genericSentenceCase));
}
