/* eslint-disable no-param-reassign, no-multi-assign */
import { go } from '../index';
import { NOTHING } from './constants';
import { isGeneratorFunction } from '../utils';

export function waitAllStrategy(channels, to, options) {
  const { transform, onError, initialCall, listen } = options;
  const data = channels.map(() => NOTHING);
  let composedAlready = false;
  const subscriptions = channels.map((ch, idx) => {
    let subscription = {};
    const notify = (value, done = () => {}) => {
      data[idx] = value;
      // Notify the subscriber only if all the sources are fulfilled.
      // In case of one source we don't have to wait.
      if (composedAlready || data.length === 1 || !data.includes(NOTHING)) {
        composedAlready = true;
        try {
          if (isGeneratorFunction(transform)) {
            go(
              transform,
              v => {
                to(v);
                done();
              },
              value
            );
          } else {
            to(transform(...data));
            done();
          }
        } catch (e) {
          if (onError === null) {
            throw e;
          }
          onError(e);
        }
      }
    };
    if (!ch.subscribers.find(({ to: t }) => t === to)) {
      ch.subscribers.push((subscription = { to, notify, listen }));
    }
    // If there is already a value in the channel
    // notify the subscribers.
    const currentChannelBufValue = ch.value();
    if (initialCall && currentChannelBufValue.length > 0) {
      notify(currentChannelBufValue[0]);
    }
    return subscription;
  });
  return {
    listen() {
      subscriptions.forEach(s => (s.listen = true));
    },
  };
}

export function waitOneStrategy(channels, to, options) {
  const { transform, onError, initialCall, listen } = options;
  const subscriptions = channels.map(ch => {
    let subscription = {};
    const notify = (value, done = () => {}) => {
      try {
        if (isGeneratorFunction(transform)) {
          go(
            transform,
            v => {
              to(v);
              done();
            },
            value
          );
        } else {
          to(transform(value));
          done();
        }
      } catch (e) {
        if (onError === null) {
          throw e;
        }
        onError(e);
      }
    };
    if (!ch.subscribers.find(({ to: t }) => t === to)) {
      ch.subscribers.push((subscription = { to, notify, listen }));
    }
    // If there is already a value in the channel
    // notify the subscribers.
    const currentChannelBufValue = ch.value();
    if (initialCall && currentChannelBufValue.length > 0) {
      notify(currentChannelBufValue[0]);
    }
    return subscription;
  });
  return {
    listen() {
      subscriptions.forEach(s => (s.listen = true));
    },
  };
}
