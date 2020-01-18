/* eslint-disable react/prop-types */
import React from 'react';
import ReactDOM from 'react-dom';
import riew from 'riew/react';
import { sput } from 'riew';

import {
  TOGGLE_TODO,
  NEW_TODO,
  DELETE_TODO,
  EDIT_TODO,
  UPDATE_TODO,
} from './Data';
import App from './App';
import appRoutine from './routines/app';

const A = riew(App, appRoutine).with({
  toggle: idx => sput(TOGGLE_TODO, idx),
  newTodo: payload => sput(NEW_TODO, payload),
  deleteTodo: idx => sput(DELETE_TODO, idx),
  editingTodo: payload => sput(EDIT_TODO, payload),
  updateTodo: payload => sput(UPDATE_TODO, payload),
});

ReactDOM.render(<A />, document.querySelector('#container'));
