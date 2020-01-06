import { SERIAL, ONE_OF, PARALLEL, NOTHING } from './constants';

const normalizeResult = result => (result.length > 1 ? result : result[0]);

export default function pipeline(strategy = SERIAL) {
  const api = {};
  let steps = [];

  api.append = m => steps.push(m);
  api.prepend = m => (steps = [m, ...steps]);
  api.run = (input, callback) => {
    if (steps.length === 0) {
      callback(input);
      return;
    }
    // ************************************** SERIAL
    if (strategy === SERIAL) {
      const progress = steps.map(() => NOTHING);
      (function step(idx) {
        if (idx === steps.length) {
          callback(normalizeResult(progress));
          return;
        }
        steps[idx](input, result => {
          progress[idx] = result;
          step(idx + 1);
        });
      })(0);
      // ************************************** PARALLEL
    } else if (strategy === PARALLEL) {
      const progress = steps.map(() => NOTHING);
      steps.forEach((m, idx) => {
        m(input, (...result) => {
          progress[idx] = normalizeResult(result);
          if (!progress.includes(NOTHING)) {
            callback(normalizeResult(progress));
          }
        });
      });
      // ************************************** ONE_OF
    } else if (strategy === ONE_OF) {
      steps.forEach((m, idx) => {
        m(input, result => {
          callback(result, idx);
        });
      });
    }
  };

  return api;
}
