/* eslint-disable no-shadow */
import { state, register, sread } from 'riew';
import {
  TOGGLE_TODO,
  NEW_TODO,
  DELETE_TODO,
  EDIT_TODO,
  UPDATE_TODO,
  FILTER_CLEAR_COMPLETED,
} from './constants';

export const ToDo = label => ({ label, completed: false, editing: false });

const initialValue = JSON.stringify([
  ToDo('Riew is reactive view architecture'),
  ToDo('Riew plays well with React'),
  ToDo('Riew follows some of the ideas of CSP'),
]);
const saveTodosData = todos => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

export const todos = state(
  JSON.parse(localStorage.getItem('todos') || initialValue)
);

todos.mutate(TOGGLE_TODO, (todos, payload) =>
  todos.map((todo, i) => {
    if (i === payload) {
      return {
        ...todo,
        completed: !todo.completed,
      };
    }
    return todo;
  })
);
todos.mutate(NEW_TODO, (todos, payload) => [...todos, ToDo(payload)]);
todos.mutate(DELETE_TODO, (todos, payload) =>
  todos.filter((todo, i) => i !== payload)
);
todos.mutate(EDIT_TODO, (todos, payload) =>
  todos.map((todo, i) => {
    if (i === payload.index) {
      return {
        ...todo,
        editing: payload.value,
      };
    }
    return todo;
  })
);
todos.mutate(UPDATE_TODO, (todos, payload) =>
  todos.map((todo, i) => {
    if (i === payload.index) {
      return {
        ...todo,
        label: payload.label,
        editing: false,
      };
    }
    return todo;
  })
);
todos.mutate(FILTER_CLEAR_COMPLETED, todos =>
  todos.filter(todo => !todo.completed)
);

register('todos', todos);

sread(todos, saveTodosData, { listen: true });
