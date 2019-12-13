export const getFuncName = func => {
  if (func.name) return func.name;
  let result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());

  return result ? result[ 1 ] : 'unknown';
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
export function requireObject(obj) {
  if (typeof obj === 'undefined' || obj === null || (typeof obj !== 'undefined' && typeof obj !== 'object')) {
    throw new Error(`A key-value object expected. Instead "${obj}" passed.`);
  }
}
export const accumulate = (current, newData) => ({ ...current, ...newData });
export const isPromise = obj => obj && typeof obj[ 'then' ] === 'function';
export const isGenerator = obj => obj && typeof obj[ 'next' ] === 'function' && typeof obj[ 'throw' ] === 'function';
export const isObjectLiteral = obj => (obj ? obj.constructor === {}.constructor : false);
