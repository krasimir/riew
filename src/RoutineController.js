/* eslint-disable consistent-return, camelcase */

var ids = 0;
const getId = () => `r${ ++ids }`;

export default function createRoutineController(routine, { putGlobal }) {
  let mounted = false;
  let pending = [];
  const id = getId();

  function put(typeToResume, payload, broadcast = true) {
    const toFire = [];

    pending = pending.filter(({ type, done, once }) => {
      if (type === typeToResume) {
        toFire.push(done);
        return !once;
      }
      return true;
    });
    toFire.forEach(func => func(payload));
    if (broadcast) {
      putGlobal(typeToResume, payload, id);
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

  return {
    id,
    in(setContent, props) {
      mounted = true;
      return routine({
        ...props,
        render(content) {
          if (mounted) setContent(content);
        },
        take,
        takeEvery,
        put,
        // for testing purposes
        '_rine_pending': () => pending
      });
    },
    out() {
      mounted = false;
      pending = [];
    },
    put
  };
}
