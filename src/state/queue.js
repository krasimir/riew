import { getFuncName, getId } from '../utils';

export default function createQueue(setStateValue, getStateValue, onDone = () => {}, queueAPI) {
  const q = {
    index: 0,
    setStateValue,
    getStateValue,
    result: getStateValue(),
    id: getId('q'),
    items: [],
    add(type, func) {
      this.items.push({ type, func, name: func.map(getFuncName) });
    },
    process(...payload) {
      var items = q.items;

      q.index = 0;

      function next(lastResult) {
        q.result = lastResult;
        q.index++;
        if (q.index < items.length) {
          return loop();
        }
        onDone(q);
        return q.result;
      };
      function loop() {
        const { type, func } = items[q.index];
        const logic = queueAPI[type];

        if (logic) {
          return logic(q, func, payload, next);
        }
        throw new Error(`Unsupported method "${ type }".`);
      };

      return items.length > 0 ? loop() : q.result;
    },
    teardown() {
      this.items = [];
    }
  };

  return q;
}
