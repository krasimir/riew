export default function BufferInterface() {
  return {
    value: [],
    puts: [],
    takes: [],
    isEmpty() {
      return this.value.length === 0;
    }
  };
}