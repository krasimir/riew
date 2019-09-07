export default function mapToKey(key) {
  return (queueResult, payload, next) => {
    const mappingFunc = (value) => ({ [key]: value });

    return next(mappingFunc(queueResult, ...payload));
  };
};
