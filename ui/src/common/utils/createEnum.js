const createProxy =
  typeof Proxy === 'function'
    ? (object) =>
        new Proxy(object, {
          get: (target, name) => {
            if (name.includes('$$')) {
              return null;
            }

            if (name in target) return target[name];

            if (name === 'toJSON') {
              return JSON.parse(JSON.stringify(target));
            }

            if (name === 'toKeys') {
              return Object.keys(target);
            }

            if (name === 'toValues') {
              return Object.values(target);
            }

            if ('default' in target) {
              return target.default;
            }

            throw new RangeError(
              `Please initialize Enum member ${name} in ${target}`
            );
          },
        })
    : (x) => x;

const createEnum = (states, prefix = '') => {
  const prefixPart = prefix ? `${prefix}.` : '';

  return createProxy(
    Object.keys(states)
      .filter((key) => !states[key] && !Number.isInteger(states[key]))
      .reduce(
        (p, c) => ({
          ...p,
          [c]: `${prefixPart}${c}`,
        }),
        states
      )
  );
};

export default createEnum;
