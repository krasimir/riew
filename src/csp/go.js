import { PUT, TAKE } from './channel';

const isPromise = obj => obj && typeof obj[ 'then' ] === 'function';

export default function go(genFunc, ...args) {
  return new Promise(resolve => {
    const gen = genFunc(...args);
    (function processGen(nextValue) {
      const iteration = gen.next(nextValue);
      if (iteration.done) {
        resolve();
      } else {
        if (typeof iteration.value === 'object') {
          const { ch, op, ...rest } = iteration.value;
          let opResult;
          switch (op) {
            case PUT:
              opResult = ch.putNow(rest.item);
              if (isPromise(opResult)) {
                opResult.then(processGen);
              } else {
                processGen();
              }
              break;
            case TAKE:
              opResult = ch.takeNow(rest.item);
              if (isPromise(opResult)) {
                opResult.then(processGen);
              } else {
                processGen(opResult);
              }
              break;
            default:
            // console.log('=>', iteration.value);
          }
        }
      }
    })();
  });
}
