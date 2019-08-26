import { createState as state } from './state';

export default function createRoutineInstance(controllerFunc, viewFunc) {
  let active = false;
  let funcsToCallOnUnmount = [];

  function isActive() {
    return active;
  }

  const instance = state({});

  instance.isActive = isActive;
  instance.in = (initialProps) => {
    active = true;
    instance.set(initialProps);
    controllerFunc(
      {
        render(props) {
          if (!active) return Promise.resolve();
          return new Promise(done => {
            viewFunc(props, done);
          });
        },
        props: instance,
        state(...args) {
          const s = state(...args);

          funcsToCallOnUnmount.push(s.teardown);
          return s;
        },
        isActive
      }
    );
  };
  instance.out = () => {
    active = false;
    funcsToCallOnUnmount.forEach(f => f());
    funcsToCallOnUnmount = [];
    instance.teardown();
  };

  return instance;
}
