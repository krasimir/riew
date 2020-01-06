import BufferInterface from './Interface';
import { NOTHING } from '../constants';

const DEFAULT_BEHAVIOR = function() {
  return {
    value: [],
    onPut(getItem, callback) {
      this.value = [getItem()];
      callback(true);
    },
    onTake(callback) {
      callback(this.value[0]);
    },
  };
};

export default function DivorcedBuffer(behavior) {
  const api = BufferInterface();
  const behaviors = [behavior || DEFAULT_BEHAVIOR()];

  api.put = (item, callback) => {
    const putProcess = behaviors.map(() => NOTHING);
    behaviors.forEach((b, idx) => {
      b.onPut(
        () => item,
        result => {
          putProcess[idx] = result;
          if (!putProcess.includes(NOTHING)) {
            callback(putProcess.length > 1 ? putProcess : putProcess[0]);
          }
        }
      );
    });
  };
  api.take = callback => {
    const takeProcess = behaviors.map(() => NOTHING);
    behaviors.forEach((b, idx) => {
      b.onTake(result => {
        takeProcess[idx] = result;
        if (!takeProcess.includes(NOTHING)) {
          callback(takeProcess.length > 1 ? takeProcess : takeProcess[0]);
        }
      });
    });
  };
  api.addBehavior = b => behaviors.push(b);
  api.getValue = () => {
    if (behaviors.length > 1) {
      return behaviors.map(b => b.value);
    }
    return behaviors[0].value;
  };

  return api;
}
