import React from 'react';
import System from '../System';

export default function createRoutineController() {
  const spyIn = jest.fn().mockImplementation((setContent, props) => {
    setContent(<p>XXX</p>);
  });
  const spyOut = jest.fn();
  const spyUpdated = jest.fn();
  const spyRendered = jest.fn();

  const controller = {
    in: spyIn,
    out: spyOut,
    updated: spyUpdated,
    rendered: spyRendered
  };

  System.addController(controller);
  return controller;
};
