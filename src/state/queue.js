import { getFuncName, getId } from '../utils';

export default function createQueue(setStateValue, getStateValue, onDone = () => {}, onStep = () => {}, queueAPI) {
  const q = {
    id: getId('q'),
    index: 0,
    setStateValue,
    getStateValue,
    result: getStateValue(),
    items: [],
    add(type, func) {
      this.items.push({ type, func, name: func.map(getFuncName) });
    },
    process(...payload) {
      q.index = 0;

      function next(lastResult) {
        q.result = lastResult;
        q.index++;
        if (q.index < q.items.length) {
          return loop();
        }
        onDone();
        return q.result;
      };
      function loop() {
        const { type, func } = q.items[q.index];
        const logic = queueAPI[type];

        if (logic) {
          const r = logic(q, func, payload, next);

          onStep(q);
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
