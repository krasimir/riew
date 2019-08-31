export const isPromise = obj => obj && typeof obj['then'] === 'function';
export const getFuncName = (func) => {
  if (func.name) return func.name;
  let result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());

  return result ? result[ 1 ] : 'unknown';
};
export const compose = (...funcs) => {
  let isAsync = false;
  let lastResult;
  let done = () => {};

  (function loop() {
    if (funcs.length === 0) {
      done(lastResult);return;
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
