import { sentenceCase, titleCase } from './casing';

describe('sentenceCase', () => {
  it('Uncapitalizes title cased words', () => {
    expect(sentenceCase('Hello, to You!')).toEqual('Hello, to you!');
  });

  it('Capitalizes first word', () => {
    expect(sentenceCase('hello, world!')).toEqual('Hello, world!');
  });

  it('Lowercases before processing when all caps', () => {
    expect(sentenceCase('HELLO, WORLD!')).toEqual('Hello, world!');
  });

  it("Doesn't lowercase before processing when partial caps", () => {
    expect(sentenceCase('HELLO, World!')).toEqual('HELLO, world!');
  });

  it('Handles markdown', () => {
    expect(
      sentenceCase("## here’s why that changed.\n\nand here's some more info.")
    ).toEqual("## Here’s why that changed.\n\nAnd here's some more info.");
  });

  it('Handles citekeys', () => {
    expect(sentenceCase('## @bob here’s why that changed')).toEqual(
      '## @bob here’s why that changed'
    );
  });
});

describe('titleCase', () => {
  it('Capitalizes title cased words', () => {
    expect(
      titleCase('an excellent hello and with the super-world to you!')
    ).toEqual('An Excellent Hello and With the Super-World to You!');
  });

  it('Capitalizes after colons', () => {
    expect(titleCase('Test: and test—and test')).toEqual(
      'Test: And Test—And Test'
    );
  });

  it('Lowercases before processing when all caps', () => {
    expect(titleCase('HELLO, WORLD!')).toEqual('Hello, World!');
  });

  it('Follows the rules', () => {
    expect(titleCase('here’s why that changed')).toEqual(
      'Here’s Why That Changed'
    );
  });

  it.only('Handle hyphenated words', () => {
    expect(titleCase('here’s why that vis-à-vis changed')).toEqual(
      'Here’s Why That vis-à-vis Changed'
    );
  });

  it('Handles markdown', () => {
    expect(titleCase('## here’s why that changed')).toEqual(
      '## Here’s Why That Changed'
    );
    expect(titleCase('> here’s why that changed')).toEqual(
      '> Here’s Why That Changed'
    );
    expect(titleCase('- here’s why that changed')).toEqual(
      '- Here’s Why That Changed'
    );
  });

  it('Handles citekeys', () => {
    expect(titleCase('## @bob here’s why that changed')).toEqual(
      '## @bob Here’s Why That Changed'
    );
  });
});
