import { SERIAL, ONE_OF, PARALLEL, NOTHING } from './constants';

const normalizeResult = result => (result.length > 1 ? result : result[0]);

export default function pipeline(strategy = SERIAL) {
  const api = { strategy };
  let steps = [];

  const remove = m => () => {
    const idx = steps.findIndex(step => step === m);
    if (idx >= 0) {
      steps.splice(idx, 1);
      return true;
    }
    return false;
  };
  const cleanUpSteps = () => {
    steps = steps.filter(step => !('__once' in step && step.__once === true));
  };

  api.steps = steps;
  api.append = m => {
    m.__calls = 0;
    steps.push(m);
    return remove(m);
  };
  api.appendOnce = m => {
    m.__once = true;
    m.__calls = 0;
    steps.__calls = 0;
    return api.append(m);
  };
  api.prepend = m => {
    m.__calls = 0;
    steps = [m, ...steps];
    return remove(m);
  };
  api.prependOnce = m => {
    m.__calls = 0;
    m.__once = true;
    return api.prepend(m);
  };
  api.run = (input, callback = () => {}) => {
    if (steps.length === 0) {
      callback(input);
      return;
    }
    const currentSteps = [...steps];
    // ************************************** SERIAL
    if (strategy === SERIAL) {
      const result = [];
      console.log('serial start', currentSteps.length);
      (function loop() {
        if (currentSteps.length === 0) {
          cleanUpSteps();
          callback(normalizeResult(result));
          return;
        }
        const step = currentSteps.shift();
        step.__calls += 1;
        if (step.__calls > 1 && step.__once) {
          loop();
        } else {
          step(input, r => {
            result.push(r);
            loop();
          });
        }
      })();
      // ************************************** PARALLEL
    } else if (strategy === PARALLEL) {
      const result = currentSteps.map(() => NOTHING);
      currentSteps.forEach((step, idx) => {
        step.__calls += 1;
        step(input, (...r) => {
          result[idx] = normalizeResult(r);
          if (!result.includes(NOTHING)) {
            cleanUpSteps();
            callback(normalizeResult(result));
          }
        });
      });
      // ************************************** ONE_OF
    } else if (strategy === ONE_OF) {
      currentSteps.forEach((step, idx) => {
        step.__calls += 1;
        step(input, result => {
          cleanUpSteps();
          callback(result, idx);
        });
      });
    }
  };

  return api;
}
