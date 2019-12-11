import { halt, pub, sub, topic, topicExists } from '../index';
import { getId } from '../../utils';

export function state(...args) {
  let value = args[ 0 ];
  const id = getId('state');
  const readTopics = [];
  const writeTopics = [];
  const isThereInitialValue = args.length > 0;
  const api = {
    id,
    '@state': true,
    'READ': id + '_READ',
    'WRITE': id + '_WRITE',
    read(topicName, func = v => v) {
      if (topicExists(topicName)) {
        console.warn(`Topic with name ${topicName} already exists.`);
        return false;
      }
      readTopics.push({ topicName, func });
      topic(topicName, null, isThereInitialValue ? func(value) : undefined);
      return true;
    },
    write(topicName, reducer = (_, v) => v) {
      if (topicExists(topicName)) {
        console.warn(`Topic with name ${topicName} already exists.`);
        return false;
      }
      writeTopics.push({ topicName });
      sub(topicName, payload => {
        value = reducer(value, payload);
        readTopics.forEach(r => {
          pub(r.topicName, r.func(value));
        });
      });
      return true;
    },
    destroy() {
      readTopics.forEach(({ topicName }) => halt(topicName));
      writeTopics.forEach(({ topicName }) => halt(topicName));
      value = undefined;
    },
    getValue() {
      return value;
    }
  };

  api.read(api.READ);
  api.write(api.WRITE);

  return api;
}

export function isState(s) {
  return s && s[ '@state' ] === true;
}
