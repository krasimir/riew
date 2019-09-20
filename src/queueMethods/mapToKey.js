export default function mapToKey(key) {
  return (intermediateValue, payload) => {
    const mappingFunc = (value) => ({ [key]: value });

    return mappingFunc(intermediateValue, ...payload);
  };
};
