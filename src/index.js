import fs from 'fs';
import yaml from 'js-yaml';
import _ from 'lodash';
import logWith from 'log-with';
import path from 'path';

const logger = logWith(module);

class ConfigReader {

  static getDefaultOptions() {
    return {
      folder: 'build',
      file: 'me.json',
    };
  }

  static getValue(context, template) {
    if (_.isString(template)) {
      try {
        return _.template(template)(context);
      } catch (e) {
        return template;
      }
    }
    return template;
  }

  static check(source, value) {
    if (_.isPlainObject(value)) {
      return ConfigReader.populate(value, source);
    }
    return ConfigReader.getValue(source, value);
  }

  static populate(config, context) {
    return _.mergeWith(
      {},
      config,
      (ignore, value) => {
        if (_.isArray(value)) {
          return _.chain(value)
            .map(ConfigReader.check.bind(null, context))
            .compact()
            .value();
        }
        return ConfigReader.check(context, value);
      },
    );
  }

  static readFile(folderPath) {
    try {
      return yaml.safeLoad(fs.readFileSync(path.resolve(process.cwd(), folderPath), 'utf8'));
    } catch (e) {
      logger.error("Couldn't load the configuration file", folderPath);
      return {};
    }
  }

  static read(folderPath = 'config.yml', env = {}) {
    return _.merge(ConfigReader.getDefaultOptions(),
      ConfigReader.populate(ConfigReader.readFile(folderPath), env));
  }
}

export default ConfigReader;
