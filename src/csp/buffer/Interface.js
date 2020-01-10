export default function BufferInterface() {
  return {
    value: [],
    puts: [],
    takes: [],
    isEmpty() {
      return this.value.length === 0;
    },
    reset() {
      this.value = [];
      this.puts = [];
      this.takes = [];
    },
    setValue(v) {
      this.value = v;
    },
    getValue() {
      return this.value;
    },
    decomposeTakers() {
      return this.takes.reduce(
        (res, take) => {
          res[take.options.read ? 'readers' : 'takers'].push(take);
          return res;
        },
        {
          readers: [],
          takers: [],
        }
      );
    },
    consumeTake(take, value) {
      if (!take.options.listen) {
        const idx = this.takes.findIndex(t => t === take);
        if (idx >= 0) this.takes.splice(idx, 1);
      }
      take.callback(value);
    },
  };
}
