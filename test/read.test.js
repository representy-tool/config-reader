import ConfigReader from '../src';

describe('Read file', () => {
  test('tests', () => {
    const TOKEN_VALUE = 'TOKEN_VALUE';
    const config = ConfigReader.read('test/test.config.yml', { TOKEN: TOKEN_VALUE });
    expect(config.folder).toBe('build');
    expect(config.file).toBe('me.json');
    expect(config.tokens.github).toBe(TOKEN_VALUE);
    expect(config.sources.github.user).toBe('salimkayabasi');
    expect(config.sources.github.options).toBeInstanceOf(Array);
    expect(config.sources.github.options[0]).toBe(TOKEN_VALUE);
  });

  test('test with empty context', () => {
    // eslint-disable-next-line
    const TOKEN = '${TOKEN}';
    const config = ConfigReader.read('test/test.config.yml');
    expect(config.folder).toBe('build');
    expect(config.file).toBe('me.json');
    expect(config.tokens.github).toBe(TOKEN);
    expect(config.sources.github.user).toBe('salimkayabasi');
    expect(config.sources.github.options).toBeInstanceOf(Array);
    expect(config.sources.github.options[0]).toBe(TOKEN);
  });
});
