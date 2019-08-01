/* eslint-disable consistent-return, camelcase */
import { getFuncName } from './utils';

var ids = 0;
const getId = () => `r${ ++ids }`;

export default function createRoutineController(routine, { broadcast }) {
  let mounted = false;
  let pending = [];
  let renderFunc;
  let triggerRender;
  const id = getId();

  function put(typeOfAction, payload, shouldBroadcast = true) {
    const toFire = [];

    pending = pending.filter(({ type, done, once }) => {
      if (type === typeOfAction) {
        toFire.push(done);
        return !once;
      }
      return true;
    });
    toFire.forEach(func => func(payload));
    if (shouldBroadcast) {
      broadcast(typeOfAction, payload, id);
    }
  };
  function take(type, done) {
    if (!done) {
      const p = new Promise(done => {
        pending.push({
          type,
          done: (...args) => {
            if (mounted) done(...args);
          },
          once: true
        });
      });

      return p;
    }
    pending.push({ type, done, once: true });
  }
  function takeEvery(type, done) {
    pending.push({ type, done, once: false });
  }
  function isMounted() {
    return mounted;
  }

  return {
    id,
    name: getFuncName(routine),
    in(setContent, props) {
      mounted = true;
      triggerRender = newProps => {
        if (mounted) setContent(renderFunc(newProps));
      };

      return routine({
        render(f) {
          if (typeof f === 'function') {
            renderFunc = f;
          } else {
            renderFunc = () => f;
          }
          triggerRender(props);
        },
        take,
        takeEvery,
        put,
        isMounted
      });
    },
    update(props) {
      triggerRender(props);
    },
    out() {
      mounted = false;
      pending = [];
    },
    put,
    system() {
      return {
        mounted,
        pending
      };
    }
  };
}
