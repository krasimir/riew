export default function map(func) {
  return (intermediateValue, payload) => {
    return (func || (value => value))(intermediateValue, ...payload);
  };
};
