export default function mapToKey(key) {
  return (intermediateValue, payload, next) => {
    const mappingFunc = (value) => ({ [key]: value });

    return next(mappingFunc(intermediateValue, ...payload));
  };
};
