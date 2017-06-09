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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readConfig = path => _jsYaml2.default.safeLoad(_fs2.default.readFileSync(path, 'utf8'));

const populate = (config, context) => {
  const getValue = (source, value) => {
    if (_lodash2.default.isString(value) && _lodash2.default.has(source, value)) {
      return _lodash2.default.get(source, value);
    }
    return value;
  };

  const check = (source, value) => {
    if (_lodash2.default.isPlainObject(value)) {
      return populate(value, source);
    }
    return getValue(context, value);
  };

  return _lodash2.default.mergeWith({}, config, (ignore, value) => {
    if (_lodash2.default.isArray(value)) {
      return _lodash2.default.chain(value).map(check.bind(null, context)).compact().value();
    }
    return check(context, value);
  });
};

const read = (path, env) => populate(readConfig(path), env);

exports.default = read;