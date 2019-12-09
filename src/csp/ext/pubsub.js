import { chan } from '../channel';

const PubSub = function () {
  const channels = {};

  const api = {
    register(ch) {
      if (!channels[ ch.id ]) {
        channels[ ch.id ] = { subscribers: [] };
        (function taker() {
          ch.take(value => {
            if (value !== chan.CLOSED && value !== chan.ENDED) {
              channels[ ch.id ].subscribers.forEach(s => s(value));
              taker();
            }
          });
        })();
      }
    },
    subscribe(ch, callback) {
      api.register(ch);
      channels[ ch.id ].subscribers.push(callback);
    },
    unsubscribe(ch, callback) {
      if (channels[ ch.id ]) {
        channels[ ch.id ].subscribers = channels[ ch.id ].subscribers.filter(c => c !== callback);
      }
    },
    unsubscribeAll(ch) {
      if (channels[ ch.id ]) {
        channels[ ch.id ].subscribers = [];
      }
    }
  };

  return api;
};
const ps = PubSub();

export const sub = ps.subscribe;
export const unsub = ps.unsubscribe;
export const unsubAll = ps.unsubscribeAll;
