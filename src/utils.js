export const isPromise = obj => obj && typeof obj[ 'then' ] === 'function';
export const isGenerator = obj => obj && typeof obj[ 'next' ] === 'function';
export const isObjectLiteral = obj => (obj ? obj.constructor === {}.constructor : false);
export const getFuncName = func => {
  if (func.name) return func.name;
  let result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());

  return result ? result[ 1 ] : 'unknown';
};
export const compose = (...args) => lastResult => {
  let isAsync = false;
  let done = () => {};
  let funcs = [ ...args ];

  (function loop() {
    if (funcs.length === 0) {
      done(lastResult);
      return;
    }
    const f = funcs.shift();
    const result = f(lastResult);

    if (isPromise(result)) {
      isAsync = true;
      result.then(r => {
        lastResult = r;
        loop();
      });
    } else {
      lastResult = result;
      loop();
    }
  })();

  if (isAsync) {
    return new Promise(d => (done = d));
  }
  return lastResult;
};
export const serial = (...args) => arg => {
  let isAsync = false;
  let done = () => {};
  let results = [];
  let funcs = [ ...args ];

  (function loop() {
    if (funcs.length === 0) {
      done(results);
      return;
    }
    const f = funcs.shift();
    const result = f(arg);

    if (isPromise(result)) {
      isAsync = true;
      result.then(r => {
        results.push(r);
        loop();
      });
    } else {
      results.push(result);
      loop();
    }
  })();

  if (isAsync) {
    return new Promise(d => (done = d));
  }
  return results;
};
export const parallel = (...args) => arg => {
  let isAsync = false;
  let results = [];
  let funcs = [ ...args ];

  (function loop() {
    if (funcs.length === 0) {
      return;
    }
    const f = funcs.shift();
    const result = f(arg);

    if (isPromise(result)) isAsync = true;
    results.push(result);
    loop();
  })();

  if (isAsync) {
    return Promise.all(
      results.map(r => {
        if (isPromise(r)) return r;
        return Promise.resolve(r);
      })
    );
  }
  return results;
};

let ids = 0;

export const getId = prefix => `${prefix}_${++ids}`;

export function isObjectEmpty(obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
}
