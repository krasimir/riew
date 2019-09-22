export function implementIterableProtocol(effect) {
  if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
    effect[Symbol.iterator] = function () {
      const values = [ effect, effect.mutate(), effect.state.cancel ];
      let i = 0;

      return {
        next: () => ({
          value: values[ i++ ],
          done: i > values.length
        })
      };
    };
  }
};

export function implementLoggableInterface(obj, initialValue = true) {
  obj.loggable = initialValue;
  obj.loggability = (value) => {
    obj.loggable = value;
    return obj;
  };
}
