export const isGenerator = obj => obj && typeof obj['next'] === 'function';
export const isPromise = obj => obj && typeof obj['then'] === 'function';
export const getFuncName = (func) => {
  if (func.name) return func.name;
  let result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());

  return result ? result[ 1 ] : 'unknown';
};