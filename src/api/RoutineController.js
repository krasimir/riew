/* eslint-disable consistent-return, camelcase */
import React from 'react';
import { getFuncName } from '../utils';

var ids = 0;
const getId = () => `r${ ++ids }`;

export default function createRoutineController(routine, { broadcast }) {
  let mounted = false;
  let pending = [];
  let RenderComponent;
  let triggerRender;
  let onRendered = () => {};
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
        if (mounted) setContent(<RenderComponent {...newProps } />);
      };

      return routine({
        render(f) {
          if (typeof f === 'function') {
            RenderComponent = f;
          } else {
            RenderComponent = () => f;
          }
          triggerRender(props);
          return new Promise(done => {
            onRendered = () => done();
          });
        },
        take,
        takeEvery,
        isMounted
      });
    },
    updated(props) {
      triggerRender(props);
    },
    rendered() {
      onRendered();
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
