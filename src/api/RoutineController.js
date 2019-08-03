/* eslint-disable consistent-return */
import React from 'react';
import { getFuncName } from '../utils';
import System from './System';

var ids = 0;
const getId = () => `r${ ++ids }`;

export default function createRoutineController(routine) {
  let active = false;
  let RenderComponent;
  let triggerRender;
  let onRendered = () => {};

  function isActive() {
    return active;
  }

  const routineController = {
    __routine: 'rine',
    id: getId(),
    isActive,
    name: getFuncName(routine),
    in(setContent, props) {
      active = true;
      triggerRender = newProps => {
        if (active) setContent(<RenderComponent {...newProps } />);
      };

      routine(
        function render(f) {
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
        { isMounted: isActive }
      );
    },
    updated(props) {
      triggerRender(props);
    },
    rendered() {
      onRendered();
    },
    out() {
      active = false;
    }
  };

  System.addController(routineController);

  return routineController;
}
