import { halt, pub, sub, topic, topicExists } from '../index';
import { getId } from '../../utils';

export function state(...args) {
  let value = args[ 0 ];
  const id = getId('state');
  const readTopics = [];
  const writeTopics = [];
  const isThereInitialValue = args.length > 0;

  function verifyTopic(topicName) {
    if (topicExists(topicName)) {
      throw new Error(`Topic with name ${topicName} already exists.`);
    }
  }

  const api = {
    id,
    '@state': true,
    'GET': id + '_READ',
    'SET': id + '_WRITE',
    select(topicName, func = v => v) {
      verifyTopic(topicName);
      readTopics.push({ topicName, func });
      topic(topicName)
        .onSubscriberAdded(callback => {
          if (isThereInitialValue) {
            callback(func(value));
          }
        })
        .onSubscriberRemoved(callback => {});
    },
    mutate(topicName, reducer = (_, v) => v) {
      verifyTopic(topicName);
      writeTopics.push({ topicName });
      sub(topicName, payload => {
        value = reducer(value, payload);
        readTopics.forEach(r => {
          pub(r.topicName, r.func(value));
        });
      });
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

  api.select(api.GET);
  api.mutate(api.SET);

  return api;
}

export function isState(s) {
  return s && s[ '@state' ] === true;
}
