import { halt, pub, sub, topic, topicExists } from '../index';
import { getId } from '../../utils';

export function state(...args) {
  let value = args[ 0 ];
  const id = getId('state');
  const readTopics = [];
  const writeTopics = [];
  const api = {
    id,
    '@state': true,
    read(topicName, func = v => v) {
      if (topicExists(topicName)) {
        console.warn(`Topic with name ${topicName} already exists.`);
        return false;
      }
      readTopics.push({ topicName, func });
      topic(topicName, null, func(value));
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
    }
  };

  return api;
}

export function isState(s) {
  return s && s[ '@state' ] === true;
}
