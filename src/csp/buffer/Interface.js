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
    }
  };
}
