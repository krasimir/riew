import { getFuncName, getId } from './utils';
import { EFFECT_QUEUE_END, EFFECT_QUEUE_STEP_IN, EFFECT_QUEUE_STEP_OUT } from './constants';

export default function createQueue(setStateValue, getStateValue, queueAPI, emit) {
  const q = {
    id: getId('q'),
    index: null,
    setStateValue,
    getStateValue,
    result: getStateValue(),
    items: [],
    add(type, func) {
      this.items.push({ type, func, name: func.map(getFuncName) });
    },
    process(...payload) {
      q.index = 0;

      function next() {
        if (q.index < q.items.length) {
          return loop();
        }
        q.index = null;
        emit(EFFECT_QUEUE_END);
        return q.result;
      };
      function loop() {
        emit(EFFECT_QUEUE_STEP_IN, q);
        const { type, func } = q.items[q.index];
        const logic = queueAPI[type];

        if (logic) {
          const r = logic(q, func, payload, (lastResult) => {
            q.result = lastResult;
            emit(EFFECT_QUEUE_STEP_OUT, q);
            q.index++;
            return next();
          });

          return r;
        }
        throw new Error(`Unsupported method "${ type }".`);
      };

      return q.items.length > 0 ? loop() : q.result;
    },
    cancel() {
      q.items = [];
    }
  };

  return q;
}
