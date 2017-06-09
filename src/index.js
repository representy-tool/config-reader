import fs from 'fs';
import yaml from 'js-yaml';
import _ from 'lodash';

const readConfig = path => yaml.safeLoad(fs.readFileSync(path, 'utf8'));

const populate = (config, context) => {
  const getValue = (source, value) => {
    if (_.isString(value) && _.has(source, value)) {
      return _.get(source, value);
    }
    return value;
  };

  const check = (source, value) => {
    if (_.isPlainObject(value)) {
      return populate(value, source);
    }
    return getValue(context, value);
  };

  return _.mergeWith(
    {},
    config,
    (ignore, value) => {
      if (_.isArray(value)) {
        return _.chain(value)
          .map(check.bind(null, context))
          .compact()
          .value();
      }
      return check(context, value);
    },
  );
};

const read = (path, env) => populate(readConfig(path), env);

export default read;
