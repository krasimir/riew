export const isPromise = obj => obj && typeof obj['then'] === 'function';
export const getFuncName = (func) => {
  if (func.name) return func.name;
  let result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());

  return result ? result[ 1 ] : 'unknown';
};
export const compose = (...funcs) => {
  return (...payload) => funcs.forEach(f => f(...payload));
};
