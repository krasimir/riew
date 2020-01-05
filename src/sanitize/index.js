import CircularJSON from './vendors/CircularJSON';
import SerializeError from './vendors/SerializeError';

export default function sanitize(something, showErrorInConsole = false) {
  let result;

  try {
    result = JSON.parse(
      CircularJSON.stringify(
        something,
        function(key, value) {
          if (typeof value === 'function') {
            return value.name === ''
              ? '<anonymous>'
              : `function ${value.name}()`;
          }
          if (value instanceof Error) {
            return SerializeError(value);
          }
          return value;
        },
        undefined,
        true
      )
    );
  } catch (error) {
    if (showErrorInConsole) {
      console.log(error);
    }
    result = null;
  }
  return result;
}
