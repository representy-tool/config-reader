'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logWith = require('log-with');

var _logWith2 = _interopRequireDefault(_logWith);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = (0, _logWith2.default)(module);

class ConfigReader {

  static getDefaultOptions() {
    return {
      folder: 'build',
      file: 'me.json'
    };
  }

  static getValue(context, template) {
    if (_lodash2.default.isString(template)) {
      try {
        return _lodash2.default.template(template)(context);
      } catch (e) {
        return template;
      }
    }
    return template;
  }

  static check(source, value) {
    if (_lodash2.default.isPlainObject(value)) {
      return ConfigReader.populate(value, source);
    }
    return ConfigReader.getValue(source, value);
  }

  static populate(config, context) {
    return _lodash2.default.mergeWith({}, config, (ignore, value) => {
      if (_lodash2.default.isArray(value)) {
        return _lodash2.default.chain(value).map(ConfigReader.check.bind(null, context)).compact().value();
      }
      return ConfigReader.check(context, value);
    });
  }

  static readFile(folderPath) {
    try {
      return _jsYaml2.default.safeLoad(_fs2.default.readFileSync(_path2.default.resolve(process.cwd(), folderPath), 'utf8'));
    } catch (e) {
      logger.error("Couldn't load the configuration file", folderPath);
      return {};
    }
  }

  static read(folderPath = 'config.yml', env = {}) {
    return _lodash2.default.merge(ConfigReader.getDefaultOptions(), ConfigReader.populate(ConfigReader.readFile(folderPath), env));
  }
}

exports.default = ConfigReader;